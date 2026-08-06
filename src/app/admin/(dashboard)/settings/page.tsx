import { getSettings } from "@/lib/repositories/settings";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const configured = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="text-sm text-muted">
          Manage your site name, footer, and analytics.
        </p>
      </header>

      {!configured && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You are viewing default settings. Connect Supabase to save changes.
        </p>
      )}

      <SettingsForm initial={settings} />
    </div>
  );
}
