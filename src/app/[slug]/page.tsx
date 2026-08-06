import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, listPublishedPages } from "@/lib/repositories/pages";
import { SEED_PAGES } from "@/lib/fallback-seed";
import { Markdown } from "@/components/markdown";
import { ContentSidebar } from "@/components/content-sidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const RESERVED = new Set(["blog", "contact", "admin", "api"]);

export async function generateStaticParams() {
  try {
    const pages = await listPublishedPages();
    return pages
      .filter((p) => !RESERVED.has(p.slug))
      .map((p) => ({ slug: p.slug }));
  } catch {
    return SEED_PAGES.filter((p) => !RESERVED.has(p.slug)).map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page not found" };

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || undefined,
      url: `/${page.slug}`,
    },
  };
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-brand">
          Home
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-ink">{page.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 max-w-3xl border-b border-line pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          {page.title}
        </h1>
      </header>

      {/* Two-column layout: content + sidebar */}
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <article className="min-w-0">
          <Markdown content={page.content} />
        </article>
        <div className="hidden lg:block">
          <ContentSidebar />
        </div>
      </div>

      {/* Mobile sidebar (below content) */}
      <div className="mt-12 border-t border-line pt-10 lg:hidden">
        <ContentSidebar />
      </div>
    </div>
  );
}
