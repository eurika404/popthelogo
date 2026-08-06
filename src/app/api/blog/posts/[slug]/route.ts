import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/repositories/posts";

export const runtime = "nodejs";
export const revalidate = 60;

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ post });
}
