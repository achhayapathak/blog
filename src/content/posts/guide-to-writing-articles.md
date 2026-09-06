---
title: "Guide to Writing Technical Articles"
description: "A comprehensive guide on authoring, formatting, and structuring engineering and technical blog articles in Lipi."
published: 2026-09-06
category: Guide
tags:
  - guide
  - writing
  - markdown
  - engineering
draft: true
annotation: "Everything you need to write and publish technical articles."
---

This guide covers everything you need to know to author, format, and publish high-quality technical blog articles in Lipi.

---

# Article Structure & Outline

For engineering and technical articles, Lipi includes a proven structure template ([`src/content/posts/_template.md`](file:///Users/achhayapathak/Dev/portfolios/blog/src/content/posts/_template.md)) designed to communicate technical depth clearly:

1. **Title & Summary Deck**: A bold, concrete statement title and a 1–2 sentence summary deck.
2. **Hook / Overview**: Brief introduction explaining why the project or system was built.
3. **Problem**: Clear statement of SLAs/SLOs, latency targets, concurrency bottlenecks, or scaling limits.
4. **Context**: Why naive or existing solutions (e.g. monolithic relational queries, synchronous calls) fail under load.
5. **Approach**: High-level system design, architectural principles, decoupling ingest from query execution, and architecture diagrams.
6. **Implementation**: Deep-dive code snippets, data schemas, routing keys, and batching algorithms.
7. **Trade-offs**: Comparison table analyzing trade-offs (e.g. Latency vs. Consistency, Memory vs. Throughput).
8. **What I Learned**: Retrospective lessons, JVM/kernel tuning takeaways, benchmarking results, and failure modes.

---

# File & Directory Organization

Posts live inside `src/content/posts/`. You can create articles using either of two file layouts:

## Flat Post File (Text-Only Articles)
For simple text posts without local attachment folders:
```txt
src/content/posts/
└── how-i-built-distributed-search.md   → URL: /posts/how-i-built-distributed-search
```

## Folder-Based Post (Articles with Images/Galleries)
When your article includes local inline images, cover images, or image galleries, create a dedicated post folder with an `index.md`:
```txt
src/content/posts/
└── distributed-search/
    ├── index.md            ← The main post content
    ├── attachments/        ← Inline images and cover images
    │   ├── cover.png
    │   └── architecture.png
    └── gallery/            ← Auto-rendered bottom photo gallery
        ├── 01-cluster-nodes.jpg
        └── 02-grafana-dash.jpg
```

> [!tip]
> **Grouping folders without affecting URLs**: Subfolders starting with an underscore `_` are omitted from the public URL slug. For example, `src/content/posts/_2026/my-post.md` is served at `/posts/my-post`.

---

# Frontmatter Configuration

Every `.md` or `.mdx` post must start with a YAML frontmatter block enclosed by `---`:

```yaml
---
title: "How I Built a Distributed Document Search Engine"
description: "Architecting a multi-tenant document search service with Kafka, Elasticsearch, and Redis capable of sub-200ms queries across millions of files."
published: 2026-09-05
updated: 2026-09-10
category: Technology
tags:
  - distributed-systems
  - elasticsearch
  - kafka
  - redis
  - backend
cover: posts/distributed-search/attachments/cover.png
draft: false
annotation: "Indexing millions of records without melting the cluster."
lang: en
---
```

## Frontmatter Reference Table

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | Article headline. Used in page `<title>`, post header, RSS feed, and auto OG cards. |
| `description` | `string` | **Yes** | Summary deck displayed beneath the title and in search engine / social previews. |
| `published` | `YYYY-MM-DD` | **Yes** | Publication date. Posts are ordered by this date (newest first). |
| `updated` | `YYYY-MM-DD` | Optional | Shows an "Updated on [date]" timestamp badge on the post. |
| `category` | `string` | Optional | Primary category label (defaults to `"Engineering"`). |
| `tags` | `string[]` | Optional | List of tags used to power the "Related posts" section. |
| `cover` | `string` | Optional | Vault-absolute path (from `src/content/`) to a cover image for social OG previews. |
| `draft` | `boolean` | Optional | Set to `true` to keep post hidden in production (defaults to `false`). |
| `annotation` | `string` | Optional | Handwritten accent note displayed next to featured post titles. |
| `lang` | `string` | Optional | Language override tag (e.g. `en`, `hi`). |

---

# Prose & Text Formatting

Lipi features a refined editorial typography system tuned to ~68 characters per line.

- **Headings**: Use `# Heading 1`, `## Heading 2`, `### Heading 3`. Section headings automatically generate clickable anchor links (`↗`).
- **Drop Capital**: The first paragraph of every published article automatically receives an elegant drop cap on desktop viewports.
- **Emphasis**: `**bold**` for strong emphasis, `*italic*` for subtle tone, `~~strikethrough~~` for superseded notes.
- **Highlights**: Use Obsidian highlight syntax: `==highlighted text==` (renders as `<mark>`).
- **Draft Comments**: Use `%%hidden drafting comment%%` to leave notes in markdown that are omitted from build output.
- **Wikilinks**: Link internal articles easily using `[[Page-Slug]]`, `[[Page-Slug|Alias Text]]`, or `[[#heading-anchor]]`.
- **Section Breaks**: Use standard `---` horizontal rules. Lipi renders these as accent gradient divider lines.

---

# Rich Callouts (Admonitions)

Lipi supports Obsidian-style blockquote callouts for highlighting critical notes, warnings, tips, and code examples:

> [!note]
> Standard informational callout box.

> [!tip] Performance Optimization
> Shard routing cuts scatter-gather operations dramatically.

> [!warning] Heavy Heap Allocations
> Avoid running Elasticsearch on nodes with under 16GB RAM.

> [!danger] Data Loss Risk
> Uncommitted offsets will resend payloads during worker crashes.

## Collapsible Callouts
Append `+` (expanded by default) or `-` (collapsed by default) to make callouts toggleable:

> [!info]- View Elasticsearch Config Options
> Detailed configuration snippet goes here...

**Supported Callout Types**: `note`, `tip`, `important`, `warning`, `caution`, `danger`, `info`, `question`, `success`, `failure`, `bug`, `example`, `quote`, `abstract`, `summary`, `tldr`.

---

# Technical Code Blocks

Code blocks feature syntax highlighting powered by Shiki in the **Fira Code** font, complete with line numbers and diff styling:

## Standard Fenced Code Block
Specify the language identifier (`typescript`, `python`, `rust`, `bash`, `yaml`, `json`, `sql`):

```typescript
interface SearchQuery {
  tenantId: string;
  query: string;
  limit: number;
}
```

## Code Diff Blocks
Add `+` or `-` at the start of code lines to highlight additions and deletions:

```diff
- const results = await db.query("SELECT * FROM docs WHERE query = " + q);
+ const results = await elasticClient.search({ index: "docs-v1", query: { match: { content: q } } });
```

---

# Images, Inline Grids & Photo Galleries

Lipi offers native support for inline figures, automatic grid layouts, and full photo galleries:

## Inline Images & Captions
Place images in `./attachments/` relative to your post's `index.md`:

```markdown
![Architecture Diagram](./attachments/architecture.png "Figure 1: Event-driven Kafka & Elasticsearch ingestion pipeline")
```

Or using native MDX figure syntax for detailed captions:

```mdx
<figure>
  <img src="./attachments/architecture.png" alt="Architecture Diagram" />
  <figcaption>Figure 1: Decoupled ingest pipeline with Kafka workers and Elasticsearch shards.</figcaption>
</figure>
```

## Automatic Image Grids
When you place consecutive markdown images back-to-back without blank lines between them, Lipi automatically transforms them into a responsive **Gallery Grid**:

```markdown
![Node 1 Status](./attachments/node1.png)
![Node 2 Status](./attachments/node2.png)
![Node 3 Status](./attachments/node3.png)
```

## Automated Bottom Photo Gallery
Drop high-res photos into a `gallery/` folder inside your post directory:

```txt
gallery/
├── 01-grafana-ingest-rate.png
├── 02-kafka-consumer-lag.png
└── 03-p99-latency-chart.png
```
Lipi automatically detects these images at build time, generates formatted alt text (e.g. `Grafana Ingest Rate`), and renders a full-screen **GLightbox** image lightbox below your post body!

---

# Tables, Pullquotes, Footnotes & Native Components

## Comparison Tables
Use markdown tables for multi-axis architectural comparisons:

| Design Decision | Trade-off Made | Rationale |
| :--- | :--- | :--- |
| **Near Real-Time (NRT)** | 1-2s indexing delay | Enables high-throughput bulk write batching |
| **Tenant Routing Keys** | Potential shard skew | Eliminates cross-node scatter-gather overhead |

## Pullquotes
Highlight memorable sentences using magazine-style pullquotes:

<blockquote class="pullquote">
  <p>High-throughput search is far more about queue discipline and data routing than raw query syntax.</p>
  <cite>Engineering Takeaway</cite>
</blockquote>

## Definition Lists (`<dl>`)
For defining domain concepts:

<dl>
  <dt>Eventual Consistency</dt>
  <dd>Data updates become visible across all search nodes after a brief indexing delay.</dd>
</dl>

## Collapsible Details Accordion (`<details>`)
For optional deep dives or secondary diagnostic logs:

<details>
  <summary>Click to view raw Elasticsearch JSON response</summary>
  <p>Raw JSON trace details...</p>
</details>

## Footnotes
Use standard Markdown footnotes for tangential notes:

Enforcing strict tenant isolation is critical.[^1]

[^1]: Scatter-gather queries without routing keys saturate JVM heap memory quickly.

---

# Authoring & Publishing Workflow

1. **Create the file**: Create `src/content/posts/my-article-slug.md` (or `src/content/posts/my-article-slug/index.md`).
2. **Copy the template**: Use [`src/content/posts/_template.md`](file:///Users/achhayapathak/Dev/portfolios/blog/src/content/posts/_template.md) as your starter structure.
3. **Draft mode**: Set `draft: true` in your frontmatter.
4. **Preview locally**: Run `astro dev --background` and visit `http://localhost:4321/posts/my-article-slug`.
5. **Publish**: Update `published: YYYY-MM-DD`, set `draft: false`, commit, and push!
