import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  siteName?: string;
  href?: string;
  className?: string;
}

/** PopTheLogo wordmark rendered from the supplied logo image. */
export function BrandMark({
  siteName = "PopTheLogo",
  href = "/",
  className,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center transition-transform hover:scale-[1.02]",
        className,
      )}
      aria-label={`${siteName} home`}
    >
      <img
        src="/logo.png"
        alt={siteName}
        className="h-9 w-auto md:h-10"
        draggable={false}
      />
    </Link>
  );
}
