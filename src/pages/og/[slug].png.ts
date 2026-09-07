import type { APIRoute } from "astro";
import { getAllPages } from "@/utils/content";
import { generateOgImage } from "@/utils/og";

export async function getStaticPaths() {
  const pages = await getAllPages();
  const pagePaths = pages.map((page) => ({
    params: { slug: page.id },
    props: {
      title: page.data.title,
      description: page.data.description,
      category: "Page",
    },
  }));

  const staticPages = [
    {
      params: { slug: "archive" },
      props: {
        title: "Archive",
        description: "A chronological archive of all writings and engineering essays.",
        category: "Writings",
      },
    },
    {
      params: { slug: "tags" },
      props: {
        title: "Tags",
        description: "Browse articles and writings by topic and technology.",
        category: "Topics",
      },
    },
    {
      params: { slug: "posts" },
      props: {
        title: "Writings",
        description: "Engineering essays, system breakdowns, and notes on building scalable software.",
        category: "Articles",
      },
    },
  ];

  return [...pagePaths, ...staticPages];
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, category } = props;

  const png = await generateOgImage({
    title,
    description,
    category,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
