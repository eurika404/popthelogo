import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import {
  adminListAllPages,
  adminUpsertPage,
} from "@/lib/repositories/pages";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const pages = await adminListAllPages();
  return NextResponse.json({ pages });
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

  try {
    const page = await adminUpsertPage({
      id: typeof body.id === "string" ? body.id : undefined,
      slug,
      title,
      content,
      published: Boolean(body.published ?? true),
      meta_title: typeof body.meta_title === "string" ? body.meta_title : null,
      meta_description:
        typeof body.meta_description === "string" ? body.meta_description : null,
    });
    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
