import Link from "next/link";
import {
  Newspaper,
  FileText,
  Settings,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  adminListAllPosts,
} from "@/lib/repositories/posts";
import { adminListAllPages } from "@/lib/repositories/pages";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();

  let posts: Awaited<ReturnType<typeof adminListAllPosts>> = [];
  let pages: Awaited<ReturnType<typeof adminListAllPages>> = [];
  let dbError: string | null = null;

  if (configured) {
    try {
      [posts, pages] = await Promise.all([
        adminListAllPosts(),
        adminListAllPages(),
      ]);
    } catch (err) {
      dbError =
        err instanceof Error
          ? err.message
          : "Could not load content. Check your Supabase setup.";
    }
  }

  const published = posts.filter((p) => p.published).length;
  const recent = [...posts]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const stats = [
    { label: "Total posts", value: posts.length, icon: Newspaper },
    { label: "Published", value: published, icon: CheckCircle2 },
    { label: "Pages", value: pages.length, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="text-sm text-muted">
            Manage your blog, pages, and site settings.
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </header>

      {/* Connection status */}
      {!configured && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">
                Supabase is not configured
              </p>
              <p className="mt-1 text-amber-800">
                The admin dashboard needs Supabase to read and write content.
                Add your Supabase keys to{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code>{" "}
                and run the SQL migration. See the README for setup steps.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {dbError && (
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="flex items-start gap-3 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <div className="text-sm">
              <p className="font-semibold text-danger">Database error</p>
              <p className="mt-1 text-danger/80">{dbError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent posts */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold text-ink">Recent posts</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/blog">View all</Link>
            </Button>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              No posts yet. Create your first post to get started.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="block truncate font-medium text-ink hover:text-brand"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-muted">
                      {post.published ? "Published" : "Draft"} -{" "}
                      {formatDate(post.updated_at)}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/admin/blog"
          icon={Newspaper}
          title="Blog Posts"
          desc="Create and edit articles"
        />
        <QuickLink
          href="/admin/pages"
          icon={FileText}
          title="Pages"
          desc="Edit static pages"
        />
        <QuickLink
          href="/admin/settings"
          icon={Settings}
          title="Settings"
          desc="Site name and footer"
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Newspaper;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-ink group-hover:text-brand">{title}</h3>
      <p className="text-sm text-muted">{desc}</p>
    </Link>
  );
}
