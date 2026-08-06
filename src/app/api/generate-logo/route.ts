import { NextResponse } from "next/server";
import { buildImageUrl } from "@/lib/pollinations";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { STYLE_OPTIONS, RATIO_OPTIONS } from "@/lib/constants";

export const runtime = "nodejs";

const VALID_STYLES = new Set<string>(STYLE_OPTIONS.map((s) => s.value));
const VALID_RATIOS = new Set<string>(RATIO_OPTIONS.map((r) => r.value));

export async function POST(req: Request) {
  // ── Rate limiting (5 requests / minute / IP) ──────────────────────────────
  const ip = getClientIp(req);
  const limit = rateLimit(ip, "generate");
  if (!limit.ok) {
    const retryAfter = Math.ceil((limit.resetMs - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: `Too many requests. Please wait about ${Math.max(
          1,
          retryAfter,
        )} seconds and try again.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(1, retryAfter)) },
      },
    );
  }

  // ── Parse & validate body ─────────────────────────────────────────────────
  let body: { prompt?: string; style?: string; ratio?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").toString().trim();
  const style = (body.style ?? "").toString();
  const ratio = (body.ratio ?? "").toString();

  if (prompt.length < 3 || prompt.length > 500) {
    return NextResponse.json(
      { error: "Prompt must be between 3 and 500 characters." },
      { status: 400 },
    );
  }
  if (!VALID_STYLES.has(style)) {
    return NextResponse.json(
      { error: "Please choose a valid style." },
      { status: 400 },
    );
  }
  if (!VALID_RATIOS.has(ratio)) {
    return NextResponse.json(
      { error: "Please choose a valid aspect ratio." },
      { status: 400 },
    );
  }

  // ── Build the Pollinations image URL ──────────────────────────────────────
  const built = buildImageUrl({ idea: prompt, style, ratio });

  return NextResponse.json({
    imageUrl: built.url,
    width: built.width,
    height: built.height,
    prompt: built.prompt,
    seed: built.seed,
    style,
    ratio,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}
