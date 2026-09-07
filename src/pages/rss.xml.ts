import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import siteConfig from "@/site.config";
import {
  getAllPosts,
  getPostUrl,
} from "@/utils/content";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  const site = context.site ?? siteConfig.url;

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site,
    customData: `<language>en-us</language><atom:link href="${new URL('/rss.xml', site).href}" rel="self" type="application/rss+xml" />`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      categories: post.data.tags ?? [],
      author: siteConfig.author,
      pubDate: post.data.published,
      link: getPostUrl(
        post.id,
        post.filePath
      ),
    })),
  });
}
