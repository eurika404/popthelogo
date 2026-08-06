"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { slugify } from "@/lib/utils";
import type { StaticPage } from "@/types/content";

interface PagesManagerProps {
  pages: StaticPage[];
}

export function PagesManager({ pages: initial }: PagesManagerProps) {
  const [pages, setPages] = React.useState(initial);
  const [editing, setEditing] = React.useState<StaticPage | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<StaticPage | null>(
    null,
  );

  const showEditor = creating || editing;

  function startCreate() {
    setEditing(null);
    setCreating(true);
  }

  function startEdit(page: StaticPage) {
    setCreating(false);
    setEditing(page);
  }

  function closeEditor() {
    setCreating(false);
    setEditing(null);
  }

  function handleSaved(saved: StaticPage) {
    setPages((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
    closeEditor();
  }

  async function handleDelete(page: StaticPage) {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Could not delete.");
      }
      toast.success("Page deleted.");
      setPages((prev) => prev.filter((p) => p.id !== page.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setConfirmDelete(null);
    }
  }

  if (showEditor) {
    return (
      <PageForm
        page={editing}
        onCancel={closeEditor}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Pages</h1>
          <p className="text-sm text-muted">
            Edit static pages like About, Privacy, and Terms.
          </p>
        </div>
        <Button variant="gradient" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-surface/50">
                <td className="px-5 py-3">
                  <button
                    onClick={() => startEdit(page)}
                    className="font-medium text-ink hover:text-brand"
                  >
                    {page.title}
                  </button>
                  <p className="text-xs text-muted">/{page.slug}</p>
                </td>
                <td className="px-5 py-3">
                  <Badge variant={page.published ? "success" : "secondary"}>
                    {page.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(page)}
                      aria-label={`Edit ${page.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted hover:text-danger"
                      onClick={() => setConfirmDelete(page)}
                      aria-label={`Delete ${page.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-muted">
                  No pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-ink">Delete page?</h2>
            <p className="mt-1 text-sm text-muted">
              &quot;{confirmDelete.title}&quot; will be permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page form (create / edit) ───────────────────────────────────────────────

function PageForm({
  page,
  onCancel,
  onSaved,
}: {
  page: StaticPage | null;
  onCancel: () => void;
  onSaved: (page: StaticPage) => void;
}) {
  const isEdit = Boolean(page);
  const [title, setTitle] = React.useState(page?.title ?? "");
  const [slug, setSlug] = React.useState(page?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [content, setContent] = React.useState(page?.content ?? "");
  const [published, setPublished] = React.useState(page?.published ?? true);
  const [metaTitle, setMetaTitle] = React.useState(page?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = React.useState(
    page?.meta_description ?? "",
  );
  const [view, setView] = React.useState<"write" | "preview">("write");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: page?.id,
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        content: content.trim(),
        published,
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
      };
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { page?: StaticPage; error?: string };
      if (!res.ok || !data.page) throw new Error(data.error || "Save failed.");
      toast.success(isEdit ? "Page updated." : "Page created.");
      onSaved(data.page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
          Back to pages
        </Button>
        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEdit ? "Save Changes" : "Create Page"}
        </Button>
      </div>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {isEdit ? "Edit Page" : "New Page"}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content (Markdown)</Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={view === "write" ? "default" : "ghost"}
                  onClick={() => setView("write")}
                >
                  Write
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={view === "preview" ? "default" : "ghost"}
                  onClick={() => setView("preview")}
                >
                  Preview
                </Button>
              </div>
            </div>
            {view === "write" ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <div className="min-h-[400px] rounded-lg border border-line bg-white p-5">
                {content.trim() ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-muted">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">
              {published ? "Published" : "Draft"}
            </Label>
          </div>
          <details className="rounded-lg border border-line p-4">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              SEO settings
            </summary>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-meta-title" className="text-xs">
                  Meta title
                </Label>
                <Input
                  id="p-meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-meta-desc" className="text-xs">
                  Meta description
                </Label>
                <Textarea
                  id="p-meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </details>
        </div>
      </div>
    </form>
  );
}
