import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/** Browser client for client components. Returns null when unconfigured. */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient<Database>(SUPABASE_URL(), SUPABASE_ANON_KEY());
}
