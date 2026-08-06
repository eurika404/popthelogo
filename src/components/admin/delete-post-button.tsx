"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Could not delete.");
      }
      toast.success("Post deleted.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted hover:text-danger"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !deleting && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger/10 text-danger">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  Delete this post?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  &quot;{title}&quot; will be permanently removed. This cannot
                  be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
