import Link from "next/link";
import {
  Zap,
  Gift,
  MousePointerClick,
  SlidersHorizontal,
  Download,
  ShieldOff,
  PenLine,
  Palette,
  MousePointer2,
  ArrowRight,
} from "lucide-react";
import { LogoGenerator } from "@/components/logo-generator";
import { Button } from "@/components/ui/button";
import { listPublishedPosts } from "@/lib/repositories/posts";
import { BlogCard } from "@/components/blog-card";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Logo Creation",
    body: "Time is valuable. Our logo maker works in seconds. Type your idea, choose your style, and get a high quality logo immediately. No waiting for designers and no back and forth revisions. Just results.",
  },
  {
    icon: Gift,
    title: "Completely Free",
    body: "No hidden fees, no premium plans, and no watermarks. You get full ownership of your logo without spending anything. Every business deserves a great brand identity, no matter the budget.",
  },
  {
    icon: MousePointerClick,
    title: "Easy to Use",
    body: "You do not need any design experience. The interface is simple and guides you step by step. Pick a style, choose your aspect ratio, and let the AI do the rest.",
  },
  {
    icon: SlidersHorizontal,
    title: "Customizable Options",
    body: "Choose from multiple design styles like flat, 3D, minimal, vintage, modern, or abstract. Adjust the aspect ratio to fit your needs. Your logo, your way.",
  },
  {
    icon: Download,
    title: "Download and Use Anywhere",
    body: "Get your logo as a high resolution PNG file. Use it on your website, business cards, social media, or merchandise. The quality stays sharp everywhere.",
  },
  {
    icon: ShieldOff,
    title: "No Storage, Full Privacy",
    body: "We do not save your logos on our servers. Your creations stay private and are deleted after you download them. You are always in control.",
  },
];

const STEPS = [
  {
    icon: PenLine,
    title: "Describe",
    body: "Enter your logo idea in plain words.",
  },
  {
    icon: Palette,
    title: "Choose",
    body: "Select a style and an aspect ratio.",
  },
  {
    icon: Zap,
    title: "Generate",
    body: "Click the button and watch the AI work.",
  },
  {
    icon: Download,
    title: "Download",
    body: "Save your logo and use it anywhere.",
  },
];

export default async function HomePage() {
  const posts = await listPublishedPosts(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PopTheLogo",
    url: "/",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free AI logo maker. Turn your idea into a logo in seconds. No sign up and no payment required.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft mesh-gradient background (light lavender blobs on near-white) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[#eef0f6]"
        >
          {/* main lavender blob, top-center */}
          <div className="absolute left-1/2 top-[-12%] h-[440px] w-[640px] -translate-x-1/2 rounded-full bg-[#c8c8f0]/55 blur-3xl" />
          {/* soft lilac, upper-left */}
          <div className="absolute left-[14%] top-[8%] h-[320px] w-[320px] rounded-full bg-[#cccbe7]/65 blur-3xl" />
          {/* muted purple, upper-right */}
          <div className="absolute right-[14%] top-[2%] h-[300px] w-[360px] rounded-full bg-[#b3b4d8]/35 blur-3xl" />
          {/* subtle brand glow, center */}
          <div className="absolute left-1/2 top-[26%] h-[260px] w-[480px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          {/* white radial brightening toward center (matches reference) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,#ffffff_0%,rgba(255,255,255,0)_58%)]" />
          {/* fade to page white at the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
            <Zap className="h-3.5 w-3.5" />
            Free forever. No sign up required.
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            Turn your idea into <span className="text-brand-gradient">a logo</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            No design skills needed. No payment required. Just type your idea,
            pick a style, and get a professional logo instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className="mx-auto max-w-2xl scroll-mt-20 px-4 pb-8 sm:px-6">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <LogoGenerator />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            How it works
          </h2>
          <p className="mt-2 text-muted">
            From idea to finished logo in four simple steps.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-line bg-surface/50 p-6 text-center"
            >
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-line">
                {i + 1}
              </span>
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-white">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            Everything you need to brand anything
          </h2>
          <p className="mt-2 text-muted">
            A fast, free, and private logo maker built for everyone.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest from blog */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                From the blog
              </h2>
              <p className="mt-2 text-muted">
                Tips and inspiration for your brand.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/blog">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center text-white shadow-lg sm:px-12">
          <MousePointer2 className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your brand?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Start creating your logo now. It takes only a second and it is free.
          </p>
          <Button
            asChild
            size="xl"
            className="mt-7 bg-white text-brand hover:bg-white/90"
          >
            <Link href="/#generator">
              Generate Logo Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
