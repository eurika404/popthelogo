import { notFound } from "next/navigation";
import { adminGetPost } from "@/lib/repositories/posts";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/post-editor";

export const metadata = { title: "Edit Post" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { id } = await params;
  const post = await adminGetPost(id).catch(() => null);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Edit Post
        </h1>
        <p className="text-sm text-muted">{post.title}</p>
      </header>
      <PostEditor post={post} />
    </div>
  );
}
