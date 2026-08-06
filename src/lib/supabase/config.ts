// Dependency-free env check shared by both client and server code.
// Keeping this isolated prevents server-only modules (next/headers) from being
// pulled into client bundles.

/** True when the public Supabase env vars are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** True when the service role key is present (admin writes). */
export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const SUPABASE_SERVICE_ROLE_KEY = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY!;
