import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import type { BlogPost } from "@/types/content";
import { formatDate, readingTime, excerpt } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SITE = "PopTheLogo";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const minutes = readingTime(post.content);
  const description =
    post.excerpt || excerpt(post.content.replace(/^#.+\n/, ""), 140);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-surface"
        aria-label={post.title}
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/10 to-accent/10">
            <span className="font-extrabold text-2xl text-brand-gradient">
              {SITE}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(post.tags ?? []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-brand"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-muted">{description}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {minutes} min read
          </span>
        </div>
      </div>
    </article>
  );
}
