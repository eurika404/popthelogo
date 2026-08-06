import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

interface SiteFooterProps {
  siteName?: string;
  footerText?: string;
  social?: { label: string; url: string }[];
}

const YEAR = new Date().getFullYear();

export function SiteFooter({
  siteName = "PopTheLogo",
  footerText = "Free AI logo maker. No sign up required.",
  social = [],
}: SiteFooterProps) {
  return (
    <footer className="mt-24 border-t border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-3">
            <BrandMark siteName={siteName} />
            <p className="max-w-xs text-sm text-muted">{footerText}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#generator" className="text-muted hover:text-brand">
                  Logo Generator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted hover:text-brand">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-brand">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted hover:text-brand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {social.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {social.map((s) => (
              <a
                key={s.url}
                href={s.url}
                className="text-sm text-muted hover:text-brand"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs text-muted">
            &copy; {YEAR} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
