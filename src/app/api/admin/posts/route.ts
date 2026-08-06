import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  adminListAllPosts,
  adminCreatePost,
} from "@/lib/repositories/posts";
import { slugify, excerpt } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const posts = await adminListAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 },
    );
  }

  const slug = String(body.slug ?? slugify(title)).trim() || slugify(title);
  const published = Boolean(body.published);
  const publishedAt = published
    ? (body.published_at as string) || new Date().toISOString()
    : null;

  try {
    const post = await adminCreatePost({
      title,
      slug,
      excerpt: (body.excerpt as string) || excerpt(content, 160),
      content,
      cover_image: (body.cover_image as string) || null,
      author: (body.author as string) || null,
      published,
      published_at: publishedAt,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
      meta_title: (body.meta_title as string) || null,
      meta_description: (body.meta_description as string) || null,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
