import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  adminGetPost,
  adminUpdatePost,
  adminDeletePost,
} from "@/lib/repositories/posts";
import { slugify, excerpt } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET(_req: Request, { params }: RouteProps) {
  if (!(await isAuthenticated())) return unauthorized();
  const { id } = await params;
  const post = await adminGetPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: RouteProps) {
  if (!(await isAuthenticated())) return unauthorized();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") update.title = body.title.trim();
  if (typeof body.content === "string") {
    update.content = body.content.trim();
    if (body.excerpt === undefined) {
      update.excerpt = excerpt(body.content, 160);
    }
  }
  if (typeof body.excerpt === "string") update.excerpt = body.excerpt;
  if (typeof body.slug === "string")
    update.slug = body.slug.trim() || slugify(String(update.title ?? ""));
  if (typeof body.cover_image === "string")
    update.cover_image = body.cover_image;
  if (typeof body.author === "string") update.author = body.author;
  if (Array.isArray(body.tags)) update.tags = body.tags;
  if (typeof body.meta_title === "string") update.meta_title = body.meta_title;
  if (typeof body.meta_description === "string")
    update.meta_description = body.meta_description;

  if (typeof body.published === "boolean") {
    update.published = body.published;
    if (body.published && !body.published_at) {
      update.published_at = new Date().toISOString();
    } else if (body.published === false) {
      update.published_at = null;
    }
  }
  if (typeof body.published_at === "string")
    update.published_at = body.published_at;

  try {
    const post = await adminUpdatePost(id, update);
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  if (!(await isAuthenticated())) return unauthorized();
  const { id } = await params;
  try {
    await adminDeletePost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
