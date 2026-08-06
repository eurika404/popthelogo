"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  Upload,
  Eye,
  Pencil,
  ArrowLeft,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { slugify, excerpt as makeExcerpt } from "@/lib/utils";
import type { BlogPost } from "@/types/content";

interface PostEditorProps {
  post?: BlogPost | null;
}

type View = "write" | "preview";

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = React.useState(post?.title ?? "");
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [excerptValue, setExcerptValue] = React.useState(post?.excerpt ?? "");
  const [content, setContent] = React.useState(post?.content ?? "");
  const [coverImage, setCoverImage] = React.useState(
    post?.cover_image ?? "",
  );
  const [tags, setTags] = React.useState((post?.tags ?? []).join(", "));
  const [author, setAuthor] = React.useState(post?.author ?? "PopTheLogo Team");
  const [metaTitle, setMetaTitle] = React.useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = React.useState(
    post?.meta_description ?? "",
  );
  const [published, setPublished] = React.useState(post?.published ?? false);
  const [view, setView] = React.useState<View>("write");

  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  // Auto-slug while typing the title (until the user edits the slug manually).
  React.useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
      setCoverImage(data.url);
      toast.success("Cover image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerptValue.trim() || makeExcerpt(content, 160),
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      author: author.trim() || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      published,
    };

    try {
      const res = isEdit
        ? await fetch(`/api/admin/posts/${post!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = (await res.json()) as { post?: BlogPost; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save.");

      toast.success(isEdit ? "Post updated." : "Post created.");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published" className="text-sm">
              {published ? "Published" : "Draft"}
            </Label>
          </div>
          <Button type="submit" variant="gradient" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An engaging post title"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              {slug && (
                <Badge variant="outline" className="font-mono text-xs">
                  /blog/{slug}
                </Badge>
              )}
            </div>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="url-friendly-slug"
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
                  <Pencil className="h-3.5 w-3.5" />
                  Write
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={view === "preview" ? "default" : "ghost"}
                  onClick={() => setView("preview")}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </Button>
              </div>
            </div>
            {view === "write" ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"# Heading\n\nWrite your post in Markdown..."}
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

        {/* Sidebar column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerptValue}
              onChange={(e) => setExcerptValue(e.target.value)}
              placeholder="Short summary (auto-generated if empty)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover image</Label>
            {coverImage ? (
              <div className="relative overflow-hidden rounded-lg border border-line">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="aspect-video w-full object-cover"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => setCoverImage("")}
                >
                  <ImageOff className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <label
                htmlFor="cover"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface/50 px-4 py-8 text-center text-sm text-muted hover:border-brand hover:text-brand"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                <span>
                  {uploading ? "Uploading..." : "Click to upload an image"}
                </span>
                <input
                  id="cover"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            )}
            {coverImage && (
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="font-mono text-xs"
                placeholder="https://..."
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, branding, tips"
            />
            <p className="text-xs text-muted">Separate tags with commas.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>

          <details className="rounded-lg border border-line p-4">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              SEO settings
            </summary>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="meta-title" className="text-xs">
                  Meta title
                </Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta-desc" className="text-xs">
                  Meta description
                </Label>
                <Textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="SEO description"
                />
              </div>
            </div>
          </details>
        </div>
      </div>
    </form>
  );
}
