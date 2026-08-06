import { NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = (body.password ?? "").toString();
  if (!password) {
    return NextResponse.json(
      { error: "Please enter your password." },
      { status: 400 },
    );
  }

  if (!verifyPassword(password)) {
    // Small constant-time-ish delay to blunt brute force.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
