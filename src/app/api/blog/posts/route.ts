import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/repositories/posts";

export const runtime = "nodejs";
export const revalidate = 60; // cache for a minute

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  if (limit !== undefined && (!Number.isFinite(limit) || limit < 1 || limit > 50)) {
    return NextResponse.json(
      { error: "limit must be a number between 1 and 50." },
      { status: 400 },
    );
  }

  const posts = await listPublishedPosts(limit);
  return NextResponse.json({ posts });
}
