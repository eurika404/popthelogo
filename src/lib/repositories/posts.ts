import "server-only";

import { SEED_POSTS } from "@/lib/fallback-seed";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { BlogPost } from "@/types/content";

/** Returns true when reads hit the live database (otherwise seed fallback). */
export const postsConfigured = isSupabaseConfigured;

/** List published posts, newest first. Limit optional. */
export async function listPublishedPosts(limit?: number): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    const seed = [...SEED_POSTS]
      .filter((p) => p.published)
      .sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
    return limit ? seed.slice(0, limit) : seed;
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createSupabaseServerClient(),
  );
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[posts] listPublishedPosts:", error.message);
    return [];
  }
  return (data ?? []) as BlogPost[];
}

/** Fetch a single published post by slug. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return SEED_POSTS.find((p) => p.slug === slug && p.published) ?? null;
  }

  const supabase = await import("@/lib/supabase/server").then((m) =>
    m.createSupabaseServerClient(),
  );
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[posts] getPostBySlug:", error.message);
    return null;
  }
  return (data as unknown as BlogPost | null) ?? null;
}

// ── Admin (write) operations — require the service role client ──────────────

export async function adminListAllPosts(): Promise<BlogPost[]> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPost[];
}

export async function adminGetPost(id: string): Promise<BlogPost | null> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as BlogPost | null) ?? null;
}

export async function adminCreatePost(
  input: Omit<BlogPost, "id" | "created_at" | "updated_at">,
): Promise<BlogPost> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as BlogPost;
}

export async function adminUpdatePost(
  id: string,
  input: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>,
): Promise<BlogPost> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as BlogPost;
}

export async function adminDeletePost(id: string): Promise<void> {
  const supabase = (
    await import("@/lib/supabase/server")
  ).createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
