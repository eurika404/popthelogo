import "server-only";

import { DEFAULT_SITE_SETTINGS } from "@/types/content";
import type { SiteSettings } from "@/types/content";
import { SEED_SETTINGS } from "@/lib/fallback-seed";
import { isSupabaseConfigured } from "@/lib/supabase/server";

const SETTINGS_KEY = "site_config";

/** Merge the stored settings over the defaults so every field always exists. */
function merge(stored: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...SEED_SETTINGS,
    ...(stored ?? {}),
  };
}

/** Read the public site settings (falls back to defaults when unconfigured). */
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return SEED_SETTINGS;
  }
  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createSupabaseServerClient(),
  );
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("[settings] getSettings:", error.message);
    return merge(null);
  }
  return merge((data?.value as Partial<SiteSettings>) ?? null);
}

/** Persist the full settings object (admin only). */
export async function adminSaveSettings(settings: SiteSettings): Promise<void> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: SETTINGS_KEY,
      value: settings as unknown as import("@/types/database").Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw new Error(error.message);
}
