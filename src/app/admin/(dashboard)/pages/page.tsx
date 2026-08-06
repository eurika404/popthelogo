import { adminListAllPages } from "@/lib/repositories/pages";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { PagesManager } from "@/components/admin/pages-manager";

export const metadata = { title: "Pages" };
export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const configured = isSupabaseConfigured();
  const pages = configured
    ? await adminListAllPages().catch(() => [])
    : [];

  if (!configured) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Pages</h1>
          <p className="text-sm text-muted">Edit static pages.</p>
        </header>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect Supabase to create and manage pages.
        </p>
      </div>
    );
  }

  return <PagesManager pages={pages} />;
}
