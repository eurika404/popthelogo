import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { listPublishedPosts } from "@/lib/repositories/posts";

export const metadata: Metadata = {
  title: "Blog — Logo Design Tips and Inspiration",
  description:
    "Tips, inspiration, and guides on logo design, branding, and using AI to create your perfect logo. Read the PopTheLogo blog.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Logo Design Tips and Inspiration",
    description:
      "Tips, inspiration, and guides on logo design and branding from PopTheLogo.",
  },
};

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          Blog and Articles
        </h1>
        <p className="mt-3 text-lg text-muted">
          Tips and inspiration for designing a logo that fits your brand.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface/50 p-10 text-center text-muted">
          No articles yet. Please check back soon.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
