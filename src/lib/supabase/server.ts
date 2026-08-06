import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import {
  isSupabaseConfigured,
  hasServiceRoleKey,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/lib/supabase/config";

export { isSupabaseConfigured, hasServiceRoleKey };

function assertConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

/** Browser-aware server client using the current request cookies (anon key). */
export async function createSupabaseServerClient() {
  assertConfigured();
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware refreshes sessions.
        }
      },
    },
  });
}

/** Service-role client bypassing RLS. SERVER ONLY — never import in client code. */
export function createSupabaseAdminClient() {
  if (!isSupabaseConfigured() || !hasServiceRoleKey()) {
    throw new Error(
      "Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient<Database>(SUPABASE_URL(), SUPABASE_SERVICE_ROLE_KEY(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
