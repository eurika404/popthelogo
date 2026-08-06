import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { adminListAllPosts } from "@/lib/repositories/posts";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog Posts" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const configured = isSupabaseConfigured();
  const posts = configured ? await adminListAllPosts().catch(() => []) : [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Blog Posts
          </h1>
          <p className="text-sm text-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total.
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </header>

      {!configured && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connect Supabase to create and manage posts.
        </p>
      )}

      {configured && posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-muted">No posts yet.</p>
            <Button asChild variant="gradient">
              <Link href="/admin/blog/new">
                <Plus className="h-4 w-4" />
                Create your first post
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Updated
                    </th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface/50">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="font-medium text-ink hover:text-brand"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted">/{post.slug}</p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={post.published ? "success" : "secondary"}
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="hidden px-5 py-3 text-muted md:table-cell">
                        {formatDate(post.updated_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          {post.published && (
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                          )}
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/blog/${post.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DeletePostButton id={post.id} title={post.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
