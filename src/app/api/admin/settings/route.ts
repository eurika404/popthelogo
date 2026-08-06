import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getSettings, adminSaveSettings } from "@/lib/repositories/settings";
import { DEFAULT_SITE_SETTINGS } from "@/types/content";
import type { SiteSettings } from "@/types/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const settings: SiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    site_name: String(body.site_name ?? DEFAULT_SITE_SETTINGS.site_name),
    tagline: String(body.tagline ?? DEFAULT_SITE_SETTINGS.tagline),
    footer_text:
      String(body.footer_text ?? DEFAULT_SITE_SETTINGS.footer_text),
    default_prompt_template: String(
      body.default_prompt_template ?? DEFAULT_SITE_SETTINGS.default_prompt_template,
    ),
    analytics_id: String(body.analytics_id ?? ""),
    social: Array.isArray(body.social)
      ? (body.social as SiteSettings["social"])
      : [],
  };

  try {
    await adminSaveSettings(settings);
    return NextResponse.json({ settings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
