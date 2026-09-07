import siteConfig from "@/site.config";
import { type Post, type Page, getPostUrl, getPostSlugPath } from "./content";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateAuthorSchema() {
  const sameAs = (siteConfig.social ?? [])
    .filter((s) => s.url && !s.url.startsWith("mailto:"))
    .map((s) => s.url);

  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#author`,
    name: siteConfig.author,
    url: "https://achhaya.com",
    image: new URL(siteConfig.avatar ?? "/avatar.png", siteConfig.url).href,
    sameAs,
    jobTitle: "Software Engineer",
  };
}

export function generatePublisherSchema() {
  return {
    "@type": "Person",
    "@id": `${siteConfig.url}/#author`,
    name: siteConfig.author,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: new URL(siteConfig.avatar ?? "/avatar.png", siteConfig.url).href,
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.url}/#author`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/archive?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generatePostSchema(
  post: Post,
  ogImageUrl?: string,
  canonicalUrl?: string
) {
  const postUrl =
    canonicalUrl ??
    new URL(getPostUrl(post.id, post.filePath), siteConfig.url).href;
  const publishedDate = new Date(post.data.published).toISOString();
  const modifiedDate = new Date(
    post.data.updated ?? post.data.published
  ).toISOString();
  const image =
    ogImageUrl ??
    new URL(
      `/og/posts/${getPostSlugPath(post.id, post.filePath)}.png`,
      siteConfig.url
    ).href;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    headline: post.data.title,
    description: post.data.description,
    url: postUrl,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: generateAuthorSchema(),
    publisher: generatePublisherSchema(),
    keywords: post.data.tags?.join(", "),
    articleSection: post.data.category ?? "Engineering",
    inLanguage: post.data.lang ?? "en-US",
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : new URL(item.url, siteConfig.url).href,
    })),
  };
}

export function generateAboutSchema(page: Page) {
  const aboutUrl = new URL("/about", siteConfig.url).href;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${aboutUrl}#profile`,
    name: `${page.data.title} · ${siteConfig.title}`,
    description: page.data.description ?? siteConfig.description,
    url: aboutUrl,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
    },
    mainEntity: generateAuthorSchema(),
  };
}