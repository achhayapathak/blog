# Achhaya Pathak's Blog

[![Live Site](https://img.shields.io/badge/Live-blog.achhaya.com-E85D2A?style=flat-square)](https://blog.achhaya.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-achhaya.com-141413?style=flat-square)](https://achhaya.com)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%206-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A typography-first publication for long-form engineering essays, distributed system breakdowns, cloud infrastructure retrospectives, and personal technical notes.

Engineered and written by [Achhaya Pathak](https://achhaya.com).

---

## Overview

This publication is a focused environment for long-form technical writing. Rather than functioning as a high-friction web application or generic marketing blog, it is designed like a print-conscious editorial journal: warm parchment tones, a measured reading column (68ch), disciplined vertical rhythm, and static HTML output that formats cleanly under Cmd+P.

The visual design is inspired by the [Kami](https://kami.tw93.fun) design language, customized with an interactive multi-palette color engine, zero-telemetry client-side search, automated Open Graph generation, and streamlined markdown workflows.

---

## Features

- **Typography-First Reading Experience**:
  - **Literata** for long-form body prose
  - **Manrope** for navigation and UI elements
  - **Fira Code** for code blocks and terminal snippets
  - **Caveat** for editorial annotations
  - Self-hosted via `@fontsource` with zero third-party font trackers
- **Interactive Multi-Palette Engine**:
  - Four curated editorial schemes:
    - **Kami Refined** (Warm Terracotta `#D46238`)
    - **Archival Paper** (Slate Blue `#4A6FA5`)
    - **Wabi-Sabi Forest** (Earthy Sage `#5A7A57`)
    - **Sandstone & Amber** (Sunlit Amber `#C88A36`)
  - Accessible interactive palette picker in the header with persistent state (`localStorage` + `data-palette`)
- **Theme Support (Dark & Light)**:
  - System-aware color scheme detection with manual override toggle
  - Zero-flash theme initialization script
  - Dynamic browser `meta[name="theme-color"]` synchronization
- **Static Full-Text Search**:
  - Powered by [Pagefind](https://pagefind.app)
  - Zero external search APIs or tracking
  - Lightning-fast indexed search across all published writing
- **Automated Open Graph Images**:
  - Dynamic social card generation for every post via Satori and `@resvg/resvg-js`
  - Fallback custom cover support for image-led essays
- **Markdown & MDX Content Pipeline**:
  - GitHub-Flavored Markdown (GFM) and MDX component support
  - Callout blocks, autolinked heading anchors (`↗`), and smart external link decorators
  - Code syntax highlighting with dual light/dark Shiki themes
- **SEO & Syndication**:
  - Auto-generated RSS feed at `/rss.xml`
  - Canonical URLs, Open Graph / Twitter card meta tags, and structured sitemap
  - Native reading-time calculation and timeline archive grouped by year

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Astro 6](https://astro.build) (Static Site Generation & Content Collections) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + LightningCSS + CSS Custom Properties |
| **Search** | [Pagefind](https://pagefind.app) |
| **OG Images** | [Satori](https://github.com/vercel/satori) + `@resvg/resvg-js` |
| **Tooling** | [Biome](https://biomejs.dev) + [Prettier](https://prettier.io) |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com) |

---

## Getting Started

### Prerequisites

- **Node.js**: `>= 22.12.0`
- **Package Manager**: `npm` or `pnpm`

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/achhayapathak/blog.git
cd blog
npm install
```

### Local Development

Start the Astro local development server:

```sh
npm run dev
```

The site will be available at `http://localhost:4321`.

> **Note**: For background daemon mode, you can run `astro dev --background` and manage it using `astro dev status` or `astro dev stop`.

---

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local development server at `localhost:4321` |
| `npm run build` | Build static production assets and index content with Pagefind |
| `npm run preview` | Preview the production build locally from `./dist` |
| `npm run lint` | Run Biome linter across the project |
| `npm run format` | Format codebase using Biome and Prettier |

---

## Configuration

Site metadata, navigation, social handles, and layout toggles are centralized in [configs/user.config.ts](file:///Users/achhayapathak/Dev/portfolios/blog/configs/user.config.ts):

```ts
// configs/user.config.ts
const userConfig: UserConfig = {
  title: "Achhaya Pathak",
  description: "Thoughts on technology, software, and the systems that run the world.",
  url: "https://blog.achhaya.com",
  author: "Achhaya Pathak",

  navigation: [
    { title: "Writing", url: "/posts" },
    { title: "Archive", url: "/archive" },
    { title: "About", url: "/about" },
  ],

  social: [
    { title: "Portfolio", url: "https://achhaya.com", icon: "globe" },
    { title: "GitHub", url: "https://github.com/achhayapathak", icon: "github" },
    { title: "LinkedIn", url: "https://linkedin.com/in/achhayapathak", icon: "linkedin" },
    { title: "X", url: "https://x.com/frozen_parantha", icon: "x" },
    { title: "Email", url: "mailto:info@achhaya.com", icon: "mail" },
  ],

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showLogo: false,
  showThemeToggle: true,
  showReadingTime: true,
  heroVariant: "default",
  annotation: "Writing between filter coffees and terminal windows.",
};
```

---

## Writing & Content Workflow

### Creating a New Post

Posts reside in `src/content/posts/` as Markdown (`.md`) or MDX (`.mdx`) files. A ready-to-use template is available at `src/content/posts/_template.md`.

```markdown
---
title: "Building Distributed Document Search Services"
description: "Architecture review of a multi-node search pipeline handling high query loads."
published: 2026-09-06
updated: 2026-09-06
category: "Engineering"
tags:
  - Distributed Systems
  - Backend
  - Go
draft: false
---

Your post content here...
```

### Frontmatter Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | **Yes** | Post title displayed in headings, cards, and metadata |
| `description` | `string` | **Yes** | Post summary used for excerpts, RSS feeds, and OG cards |
| `published` | `date` | **Yes** | Publication date (`YYYY-MM-DD`) |
| `updated` | `date` | No | Last update date (renders "Updated on ..." if set) |
| `category` | `string` | No | Category classification (defaults to `Engineering`) |
| `tags` | `string[]` | No | List of tags used to power related posts and tag filtering |
| `cover` | `string` / `image` | No | Custom image override for social preview cards |
| `draft` | `boolean` | No | Set to `true` to exclude the post from production builds |
| `lang` | `string` | No | Per-post language override |

### Static Pages

Stand-alone pages like the [About](file:///Users/achhayapathak/Dev/portfolios/blog/src/content/pages/about.md) page and home intro are defined in `src/content/pages/`.

---

## Project Structure

```txt
blog/
├── configs/
│   └── user.config.ts        # Central site configuration and social metadata
├── public/
│   ├── avatar.png            # Profile avatar asset
│   ├── favicon.svg           # Scalable site favicon
│   └── pagefind/             # Generated search indices (post-build)
├── src/
│   ├── components/           # UI components (Header, Footer, SocialIcon, etc.)
│   ├── content/
│   │   ├── pages/            # Static pages (about.md, home-intro.md)
│   │   └── posts/            # Markdown & MDX blog posts
│   ├── layouts/              # Page layouts (Base, Post, Page)
│   ├── pages/                # File-based routes, RSS, and OG image endpoints
│   ├── plugins/              # Remark/Rehype custom markdown plugins
│   ├── scripts/              # Client-side theme and palette controller
│   ├── styles/               # Global reset, typography, and palette definitions
│   └── utils/                # Date formatting, content queries, and helpers
├── astro.config.mjs          # Astro, Tailwind, Vite, and Font configuration
├── biome.json                # Biome linter and formatter configuration
├── package.json
└── tsconfig.json
```

---

## Credits & Acknowledgments

- Built on top of the open-source **[Lipi](https://github.com/thelocalhoststudio/lipi)** template by [The Localhost Studio](https://github.com/thelocalhoststudio).
- Aesthetic inspiration drawn from the **[Kami](https://kami.tw93.fun)** design system.
- Typography:
  - [Literata](https://fonts.google.com/specimen/Literata) by TypeTogether
  - [Manrope](https://fonts.google.com/specimen/Manrope) by Mikhail Sharanda
  - [Fira Code](https://github.com/tonsky/FiraCode) by Nikita Prokopov
  - [Caveat](https://fonts.google.com/specimen/Caveat) by Pablo Impallari

---

## License

MIT © [Achhaya Pathak](https://achhaya.com)
