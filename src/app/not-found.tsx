import Link from "next/link";
import { Home, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-7xl font-extrabold text-brand-gradient">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="gradient" size="lg">
          <Link href="/">
            <Home className="h-5 w-5" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/#generator">
            <Wand2 className="h-5 w-5" />
            Generate a logo
          </Link>
        </Button>
      </div>
    </div>
  );
}
