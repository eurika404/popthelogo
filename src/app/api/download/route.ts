import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_HOSTS = ["image.pollinations.ai"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get("url");
  const filename =
    searchParams.get("filename") || `popthelogo-${Date.now()}.png`;

  if (!urlParam) {
    return NextResponse.json(
      { error: "Missing url parameter." },
      { status: 400 },
    );
  }

  // Only allow proxying from whitelisted hosts to prevent SSRF.
  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url." }, { status: 400 });
  }
  if (!ALLOWED_HOSTS.includes(target.hostname)) {
    return NextResponse.json(
      { error: "This host is not allowed." },
      { status: 403 },
    );
  }

  // Rate limit downloads lightly too.
  const ip = getClientIp(req);
  const limit = rateLimit(ip, "download");
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: { "User-Agent": "PopTheLogo/1.0" },
      // Pollinations can be slow; allow retries via cache: no-store.
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "Could not fetch the logo image." },
        { status: 502 },
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "image/png";
    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename.replace(
          /[^a-zA-Z0-9._-]/g,
          "_",
        )}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to download the image." },
      { status: 502 },
    );
  }
}
