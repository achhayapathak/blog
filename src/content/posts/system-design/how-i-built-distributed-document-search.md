---
title: "How I Built a Distributed Document Search Engine"
description: "Architecting a multi-tenant document search service with Kafka, Elasticsearch, and Redis capable of sub-200ms queries across millions of files."
published: 2026-09-05
tags:
  - distributed-systems
  - elasticsearch
  - kafka
  - redis
  - backend
category: Technology
draft: false
annotation: "Indexing millions of records without melting the cluster."
---

Searching across millions of heterogeneous documents while enforcing strict tenant isolation is one of those problems that looks deceptive on day one and brutally complex on day thirty.

When building my distributed document search engine, the objective was straightforward: deliver reliable, multi-tenant full-text search capable of querying millions of documents with a **sub-200ms p99 response time**, while decoupling heavy ingestion workloads from user-facing search traffic.

Here is an architectural deep dive into how I built it.

---

# Problem

As document volume expands past the tens of millions, three primary challenges emerge:

1. **Query Contention**: Heavy bulk-indexing operations directly degrade query throughput and spike search latency if executed on the same shared database path.
2. **Tenant Data Isolation**: In a multi-tenant environment, tenant data must remain strictly isolated. A noisy or malicious tenant running expensive wildcard queries cannot starve CPU cycles for others.
3. **Availability Under Spikes**: File upload bursts (such as bulk enterprise document migrations) must never cause dropped payloads or trigger cascading timeouts in the search API.

---

# Context

Naive search implementations frequently rely on database-level `LIKE` or basic trigram indexes on PostgreSQL. While functional for thousands of rows, this quickly degrades once file content exceeds several gigabytes:

- Table locking and write-amplification during large updates cripple relational throughput.
- Full-text tokenization and stemming on-the-fly inside the primary transactional database wastes precious compute.
- Without an asynchronous buffer, ingestion bottlenecks directly translate into API 504 Gateway Timeouts for end users.

To scale reliably, write ingestion and read querying had to be cleanly separated through an event-driven architecture.

---

# Approach

I adopted a decoupled, event-driven pipeline composed of three distinct tiers:

```
[ Client Upload ] ──> [ Ingestion API ] ──> [ Apache Kafka Topic ]
                                                    │
                                           [ Indexing Workers ]
                                                    │
                                           [ Elasticsearch Cluster ]
                                                    ▲
                                                    │
[ Search Query ]  ──> [ Search Gateway ] ──> [ Redis Cache ]
```

### 1. Ingestion via Apache Kafka
The API server immediately validates the metadata, persists raw files to an object store, and pushes an `IndexingTask` event to a partitioned Kafka topic. The API responds with `202 Accepted` in under **15ms**, fully shielding ingestion clients from indexing latency.

### 2. Clustered Ingestion Workers
Independent background consumer workers process batches from Kafka, extract text tokens, and dispatch bulk indexing requests to Elasticsearch.

### 3. Multi-Tiered Search with Redis
Read queries hit an API gateway that checks a tenant-scoped Redis cache for frequent term matches before dispatching complex query DSL to Elasticsearch.

---

# Implementation

### 1. Multi-Tenant Index Routing

To guarantee isolation and maximize shard efficiency, each tenant document is routed using a composite routing key combining the `tenant_id` and `document_id`.

In Elasticsearch, this ensures all documents for a single tenant reside within predictable shards, cutting down cross-node scatter-gather operations during search queries:

```typescript
// Multi-tenant search query dispatch
import { Client } from "@elastic/elasticsearch";

interface SearchRequest {
  tenantId: string;
  queryString: string;
  page?: number;
  pageSize?: number;
}

export async function queryTenantDocuments(
  client: Client,
  params: SearchRequest
) {
  const { tenantId, queryString, page = 1, pageSize = 20 } = params;

  return await client.search({
    index: "documents-v1",
    routing: tenantId, // Directs search directly to tenant-allocated shards
    query: {
      bool: {
        filter: [
          { term: { tenant_id: tenantId } },
          { term: { is_deleted: false } }
        ],
        must: [
          {
            multi_match: {
              query: queryString,
              fields: ["title^3", "content", "tags^2"],
              fuzziness: "AUTO",
            }
          }
        ]
      }
    },
    highlight: {
      fields: {
        content: { fragment_size: 150, number_of_fragments: 3 }
      }
    },
    from: (page - 1) * pageSize,
    size: pageSize,
  });
}
```

### 2. Resilient Worker Batching

Rather than writing to Elasticsearch per individual Kafka message, consumers accumulate micro-batches of up to 500 documents or 250ms of latency:

```typescript
import { EachBatchPayload } from "kafkajs";

export async function processBatch({ batch, resolveOffset, heartbeat }: EachBatchPayload) {
  const operations = [];

  for (const message of batch.messages) {
    if (!message.value) continue;
    const document = JSON.parse(message.value.toString());

    operations.push(
      { index: { _index: "documents-v1", _id: document.id, routing: document.tenantId } },
      document
    );
  }

  if (operations.length > 0) {
    const { errors, items } = await elasticClient.bulk({ operations });
    if (errors) {
      handleBulkErrors(items);
    }
  }

  // Commit offsets only after verified bulk write
  resolveOffset(batch.messages[batch.messages.length - 1].offset);
  await heartbeat();
}
```

---

# Trade-offs

Every distributed architecture is a collection of conscious compromises:

| Design Decision | Trade-off Made | Rationale |
| :--- | :--- | :--- |
| **Near Real-Time (NRT)** | Indexing latency of 1–2 seconds instead of instant query visibility | Allows massive batching efficiencies; 1-2s delay is completely imperceptible to document search users. |
| **Routing by Tenant ID** | Potential shard skew if one tenant is significantly larger than others | Solved by tenant tiering: enterprise tenants receive dedicated indices, while small-to-mid tenants share routed indices. |
| **Redis Cache Layer** | Cache invalidation complexity on document edits/deletions | Document updates publish cache invalidation events over Redis Pub/Sub, keeping hot search lists accurate. |

---

# What I Learned

1. **JVM Heap is Precious**: In Elasticsearch, sizing field data caches and garbage collection pauses can easily throttle indexing workers. Enforcing strict document text limits before indexing saved gigabytes of heap memory.
2. **Backpressure Is Non-Negotiable**: Without Kafka buffering incoming traffic, sudden document upload surges would bring the indexing nodes to their knees. Rate-limiting consumer group concurrency prevents cluster saturation during peak hours.
3. **Routing Keys Transform Performance**: Adding explicit shard routing dropped our average p99 query latency from 380ms down to **115ms** by eliminating cluster-wide scatter-gather queries.

Building this prototype reinforced that high-throughput search is far more about queue discipline and data routing than raw query syntax.
