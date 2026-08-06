"use client";

import * as React from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteSettings } from "@/types/content";
import { DEFAULT_SITE_SETTINGS } from "@/types/content";

export function SettingsForm({
  initial,
}: {
  initial: SiteSettings;
}) {
  const [settings, setSettings] = React.useState<SiteSettings>({
    ...DEFAULT_SITE_SETTINGS,
    ...initial,
  });
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function addSocial() {
    set("social", [...settings.social, { label: "", url: "" }]);
  }

  function updateSocial(index: number, field: "label" | "url", value: string) {
    set(
      "social",
      settings.social.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  function removeSocial(index: number) {
    set("social", settings.social.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          social: settings.social.filter((s) => s.label && s.url),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save.");
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-end">
        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site name</Label>
          <Input
            id="site_name"
            value={settings.site_name}
            onChange={(e) => set("site_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics_id">Analytics ID</Label>
          <Input
            id="analytics_id"
            value={settings.analytics_id}
            onChange={(e) => set("analytics_id", e.target.value)}
            placeholder="e.g. Plausible domain or Umami id"
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={settings.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="footer_text">Footer text</Label>
          <Textarea
            id="footer_text"
            value={settings.footer_text}
            onChange={(e) => set("footer_text", e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="prompt_template">Default prompt template</Label>
          <Textarea
            id="prompt_template"
            value={settings.default_prompt_template}
            onChange={(e) => set("default_prompt_template", e.target.value)}
            rows={2}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted">
            Use <code className="rounded bg-surface px-1">{"{idea}"}</code> where
            the user prompt should go.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Social links</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSocial}>
            <Plus className="h-4 w-4" />
            Add link
          </Button>
        </div>
        {settings.social.length === 0 ? (
          <p className="text-sm text-muted">No social links yet.</p>
        ) : (
          <div className="space-y-2">
            {settings.social.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={s.label}
                  onChange={(e) => updateSocial(i, "label", e.target.value)}
                  placeholder="Label (e.g. Twitter)"
                  className="max-w-[180px]"
                />
                <Input
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted hover:text-danger"
                  onClick={() => removeSocial(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
