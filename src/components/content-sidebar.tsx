import Link from "next/link";

/**
 * Shared sidebar for content pages (blog posts, static pages).
 * Contains the promoted tool widget and contextual links.
 */

export function ContentSidebar() {
  return (
    <aside className="space-y-8">
      {/* ── Promoted tool widget (TraceLinker) ── */}
      <div
        className="rounded-xl border border-line bg-white p-6 text-center shadow-sm"
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,.06)",
        }}
      >
        <span className="mb-4 inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
          RECOMMENDED TOOL
        </span>

        <div className="mb-4">
          <img
            src="https://tracelinker.com/logo-mark.svg"
            alt="TraceLinker Logo"
            width={64}
            height={64}
            className="mx-auto"
          />
        </div>

        <h3 className="mb-3 text-[22px] font-bold leading-snug text-[#1f2937]">
          Never Lose Track of Your Backlinks
        </h3>

        <p className="mb-6 text-[15px] leading-relaxed text-[#4b5563]">
          Building backlinks takes time and effort.{" "}
          <strong>TraceLinker</strong> helps you monitor every backlink, alerts
          you when a link is removed, and keeps everything organized in one
          simple dashboard. Stay on top of your SEO without checking links
          manually.
        </p>

        <a
          href="https://tracelinker.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-[10px] px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 8px 20px rgba(99,102,241,.35)",
          }}
        >
          <img
            src="https://tracelinker.com/logo-mark.svg"
            alt=""
            width={20}
            height={20}
            className="brightness-0 invert"
          />
          Try TraceLinker Free
        </a>
      </div>

      {/* ── Quick links ── */}
      <div className="rounded-xl border border-line bg-surface/50 p-5">
        <h4 className="mb-3 text-sm font-semibold text-ink">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/" className="text-muted transition-colors hover:text-brand">
              Logo Generator
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-muted transition-colors hover:text-brand">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-muted transition-colors hover:text-brand">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-muted transition-colors hover:text-brand">
              About PopTheLogo
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
