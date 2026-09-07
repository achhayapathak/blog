import type { APIRoute } from "astro";
import { getAllPosts, getPostSlugPath } from "@/utils/content";
import { generateOgImage } from "@/utils/og";

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    params: {
      slug: getPostSlugPath(post.id, post.filePath),
    },
    props: {
      post,
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;

  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    published: post.data.updated ?? post.data.published,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
