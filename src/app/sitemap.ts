import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/repositories/posts";
import { listPublishedPages } from "@/lib/repositories/pages";

const RESERVED = new Set(["blog", "contact", "admin", "api"]);

function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.popthelogo.com"
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [posts, pages] = await Promise.all([
    listPublishedPosts(),
    listPublishedPages(),
  ]);

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p) => !RESERVED.has(p.slug))
    .map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: new Date(page.updated_at || now),
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  return [...staticRoutes, ...postRoutes, ...pageRoutes];
}
