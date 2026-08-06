import "server-only";

import { SEED_PAGES } from "@/lib/fallback-seed";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { StaticPage } from "@/types/content";

export const pagesConfigured = isSupabaseConfigured;

/** List all published pages. */
export async function listPublishedPages(): Promise<StaticPage[]> {
  if (!isSupabaseConfigured()) {
    return SEED_PAGES.filter((p) => p.published);
  }
  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createSupabaseServerClient(),
  );
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("title", { ascending: true });
  if (error) {
    console.error("[pages] listPublishedPages:", error.message);
    return [];
  }
  return (data ?? []) as StaticPage[];
}

/** Fetch a published page by slug. */
export async function getPageBySlug(slug: string): Promise<StaticPage | null> {
  if (!isSupabaseConfigured()) {
    return SEED_PAGES.find((p) => p.slug === slug && p.published) ?? null;
  }
  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createSupabaseServerClient(),
  );
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("[pages] getPageBySlug:", error.message);
    return null;
  }
  return (data as unknown as StaticPage | null) ?? null;
}

// ── Admin (write) operations ────────────────────────────────────────────────

export async function adminListAllPages(): Promise<StaticPage[]> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as StaticPage[];
}

export async function adminGetPage(id: string): Promise<StaticPage | null> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as StaticPage | null) ?? null;
}

export async function adminUpsertPage(input: {
  id?: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
}): Promise<StaticPage> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const payload = {
    slug: input.slug,
    title: input.title,
    content: input.content,
    published: input.published,
    meta_title: input.meta_title ?? null,
    meta_description: input.meta_description ?? null,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from("pages")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as unknown as StaticPage;
  }

  const { data, error } = await supabase
    .from("pages")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as StaticPage;
}

export async function adminDeletePage(id: string): Promise<void> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
