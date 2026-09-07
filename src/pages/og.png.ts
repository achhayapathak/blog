// src/pages/og.png.ts

import type { APIRoute } from "astro";
import siteConfig from "@/site.config";
import { generateOgImage } from "@/utils/og";

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    title: siteConfig.title,
    description: siteConfig.description,
    category: "Engineering & Systems",
    site: siteConfig.url,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};