import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft, User } from "lucide-react";
import { getPostBySlug, listPublishedPosts } from "@/lib/repositories/posts";
import { SEED_POSTS } from "@/lib/fallback-seed";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime, stripMarkdown } from "@/lib/utils";
import { ContentSidebar } from "@/components/content-sidebar";

/** Plain-text description used for metadata: prefers meta_description, falls back to excerpt. */
function metaDescription(post: {
  meta_description?: string | null;
  excerpt?: string | null;
}): string | undefined {
  return stripMarkdown(post.meta_description || post.excerpt || "") || undefined;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await listPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return SEED_POSTS.map((post) => ({ slug: post.slug }));
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.meta_title || post.title,
    description: metaDescription(post),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.meta_title || post.title,
      description: metaDescription(post),
      url: `/blog/${post.slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.published_at ?? undefined,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: metaDescription(post),
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const minutes = readingTime(post.content);
  // The page template renders the title as an H1; strip a duplicated leading H1 from the markdown body.
  const body = post.content.replace(/^\s*#\s+.*\n+/, "").trim();
  const articleExcerpt = post.excerpt ? stripMarkdown(post.excerpt) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDescription(post),
    image: post.cover_image || undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author || "PopTheLogo" },
    publisher: {
      "@type": "Organization",
      name: "PopTheLogo",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${post.slug}` },
    keywords: (post.tags ?? []).join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero / cover ── */}
      {post.cover_image && (
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-line">
            <img
              src={post.cover_image}
              alt={post.title}
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-brand">
            Home
          </Link>
          <span className="mx-2 text-line">/</span>
          <Link href="/blog" className="transition-colors hover:text-brand">
            Blog
          </Link>
          <span className="mx-2 text-line">/</span>
          <span className="truncate text-ink">{post.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-10 max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(post.tags ?? []).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
            {post.title}
          </h1>
          {articleExcerpt && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {articleExcerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-line pb-6 text-sm text-muted">
            {post.author && (
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {minutes} min read
            </span>
          </div>
        </header>

        {/* Two-column layout: content + sidebar */}
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <article className="min-w-0">
            <Markdown content={body} />
          </article>
          <div className="hidden lg:block">
            <ContentSidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="mt-12 border-t border-line pt-10 lg:hidden">
          <ContentSidebar />
        </div>

        {/* Back to blog */}
        <div className="mt-12 border-t border-line pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}
