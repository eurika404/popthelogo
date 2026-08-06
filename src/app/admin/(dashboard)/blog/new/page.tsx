import { PostEditor } from "@/components/admin/post-editor";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          New Post
        </h1>
        <p className="text-sm text-muted">Write a new article in Markdown.</p>
      </header>
      <PostEditor post={null} />
    </div>
  );
}
