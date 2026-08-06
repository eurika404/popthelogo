import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { adminDeletePage } from "@/lib/repositories/pages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  try {
    await adminDeletePage(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
