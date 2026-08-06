import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

/** Renders markdown content with blog-friendly typography. */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose-blog max-w-none space-y-5 text-[1.0625rem] text-ink",
        // Targeting the generated elements via a wrapper class.
        "[&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:leading-[1.8] [&_p]:text-ink/90",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-strong",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-brand/40 [&_blockquote]:bg-surface [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:pr-2 [&_blockquote]:italic [&_blockquote]:text-muted",
        "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:text-brand-strong",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-line [&_pre]:bg-surface [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-ink",
        "[&_img]:rounded-xl [&_img]:border [&_img]:border-line",
        "[&_hr]:border-line [&_hr]:my-8",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-line [&_th]:bg-surface [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
