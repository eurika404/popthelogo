import type { BlogPost, StaticPage, SiteSettings } from "@/types/content";

/**
 * Read-only seed content used as a fallback when Supabase is not yet
 * configured. This keeps the public site populated and demoable out of the box.
 * Once Supabase env vars are present, the repositories read from the database.
 */

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

export const SEED_SETTINGS: SiteSettings = {
  site_name: "PopTheLogo",
  tagline: "Turn your idea into a logo in seconds.",
  footer_text:
    "PopTheLogo is a free AI logo maker. No sign up, no payment, no watermark.",
  default_prompt_template:
    "modern minimalist logo for {idea}, clean vector, professional branding, centered, solid background",
  analytics_id: "",
  social: [],
};

export const SEED_PAGES: StaticPage[] = [
  {
    id: "seed-about",
    slug: "about",
    title: "About PopTheLogo",
    content: `# About PopTheLogo

PopTheLogo is a free AI logo maker that turns a simple text idea into a professional logo in seconds.

We built PopTheLogo because every business, freelancer, and creator deserves a strong brand identity, no matter their budget. There are no hidden fees, no premium plans, and no watermarks. You get full ownership of every logo you create.

## Our mission

Make great design accessible to everyone. Type your idea, pick a style, and let the AI do the heavy lifting. Your logo is ready to download as a high resolution PNG, ready to use on websites, business cards, social media, and merchandise.

## Privacy first

We do not save your logos on our servers. Your creations stay private. After you download a logo, nothing is stored on our side.`,
    published: true,
    created_at: iso(60),
    updated_at: iso(2),
    meta_title: "About PopTheLogo — Free AI Logo Maker",
    meta_description:
      "Learn about PopTheLogo, the free AI logo maker that turns your idea into a professional logo in seconds. No sign up and no payment required.",
  },
  {
    id: "seed-privacy",
    slug: "privacy",
    title: "Privacy Policy",
    content: `# Privacy Policy

Last updated: 2026

PopTheLogo respects your privacy. This policy explains what we collect and how we use it.

## What we do not collect

- **Your logos.** Generated logos are not stored on our servers. They are created on demand and delivered directly to your browser.
- **Your prompts.** We do not keep a history of the text you enter.
- **Personal data.** We do not require an account and we do not ask for your name or email to generate a logo.

## What we collect

- **Usage analytics.** We may use privacy friendly analytics to understand aggregate page views and performance. These tools do not use cookies to track individuals.
- **Server logs.** Standard server logs may include IP addresses for security and rate limiting. These are kept only as long as needed.

## Cookies

A cookie is only set when you sign in to the admin panel. Public visitors are not tracked with cookies.

## Third party services

Logo generation is powered by Pollinations.ai. When you generate a logo, your prompt is sent to that service to produce the image. We do not control how that service handles data, so please avoid sharing sensitive information in prompts.

## Contact

Questions about privacy? Reach out through the Contact page.`,
    published: true,
    created_at: iso(60),
    updated_at: iso(2),
    meta_title: "Privacy Policy — PopTheLogo",
    meta_description:
      "Read the PopTheLogo privacy policy. We do not store your logos or personal data. Privacy friendly analytics only.",
  },
  {
    id: "seed-terms",
    slug: "terms",
    title: "Terms of Service",
    content: `# Terms of Service

Last updated: 2026

By using PopTheLogo, you agree to these terms.

## Use of the service

PopTheLogo is a free tool that generates logo images from text prompts using AI. You agree to use it lawfully and not to generate content that infringes the rights of others or that is illegal, hateful, or harmful.

## Ownership and license

You own the logos you create with PopTheLogo. You may use them for personal and commercial projects. Because results are AI generated, we recommend reviewing each logo before commercial use.

## No warranty

The service is provided "as is" without warranties of any kind. We do not guarantee that every generated image will be usable or unique. You are responsible for verifying that your logo does not conflict with existing trademarks.

## Availability

We strive to keep the service available but may change or discontinue features at any time without notice.

## Limitation of liability

To the maximum extent permitted by law, PopTheLogo is not liable for any damages arising from the use of the service.

## Contact

Questions about these terms? Use the Contact page to reach us.`,
    published: true,
    created_at: iso(60),
    updated_at: iso(2),
    meta_title: "Terms of Service — PopTheLogo",
    meta_description:
      "Read the PopTheLogo terms of service. You own the logos you create and may use them commercially.",
  },
];

export const SEED_POSTS: BlogPost[] = [
  {
    id: "seed-post-1",
    title: "10 Logo Design Tips Every Small Business Should Know",
    slug: "10-logo-design-tips",
    excerpt:
      "A strong logo helps customers remember you. These ten practical tips will guide you from the first sketch to a finished, professional mark.",
    content: `A great logo is more than a pretty picture. It is the face of your business and the first thing customers remember. Whether you work with a designer or generate ideas with an AI logo maker, these tips will help you land on a logo that works.

## 1. Keep it simple

Simple logos are easier to recognize and easier to scale. Think of the world's most memorable marks. Most can be drawn from memory in a few seconds. Avoid cramming too many details into a small space.

## 2. Make it work in one color

If your logo only looks good in full color, it is fragile. A strong logo still reads in black and white, which matters for stamps, faxes, and single color prints.

## 3. Choose the right style

Flat design feels modern and clean. Vintage styles feel warm and trustworthy. Minimalist logos feel premium. Pick a style that matches the personality of your brand before you refine the details.

## 4. Think about where it will live

A logo for a phone app icon, a storefront sign, and an embroidered hat all have different needs. Test your logo at very small and very large sizes.

## 5. Use a consistent color palette

Two or three colors are usually enough. Write down the exact color codes so every piece of marketing looks consistent.

## 6. Pick readable fonts

If your logo includes text, make sure the letters stay legible at small sizes. Decorative fonts can look charming but are hard to read.

## 7. Leave breathing room

Whitespace around your logo makes it feel confident. Avoid pushing it into the corner of a design.

## 8. Make it timeless, not trendy

Trends fade. A logo built on solid principles lasts for years and keeps your brand feeling stable.

## 9. Get feedback

Show early versions to people outside your team. If they cannot tell what it represents, simplify.

## 10. Start fast, then refine

Use a tool like PopTheLogo to generate dozens of ideas in minutes. The faster you can explore directions, the sooner you find the one that fits.

## Ready to start?

Type your idea, choose a style, and generate a logo in seconds. It is free and requires no sign up.`,
    cover_image: null,
    author: "PopTheLogo Team",
    published: true,
    published_at: iso(5),
    created_at: iso(5),
    updated_at: iso(5),
    tags: ["tips", "design", "branding"],
    meta_title: "10 Logo Design Tips for Small Businesses — PopTheLogo",
    meta_description:
      "Ten practical logo design tips to help small businesses create a memorable, professional brand mark.",
  },
  {
    id: "seed-post-2",
    title: "Flat vs 3D Logos: Which Style Fits Your Brand?",
    slug: "flat-vs-3d-logos",
    excerpt:
      "Flat and 3D logos send very different signals. Here is how to choose the style that matches what your brand stands for.",
    content: `When you start designing a logo, one of the first choices is the visual style. Two of the most popular directions are flat design and 3D design. Each one tells a different story about your brand.

## What is flat design?

Flat design uses clean shapes, solid colors, and no gradients or shadows. It grew popular with modern apps and operating systems. Brands like flat design because it looks clean, scales perfectly, and feels current.

**Flat logos are great when you want to feel:**

- Modern and minimal
- Trustworthy and calm
- Easy to reproduce everywhere

## What is a 3D logo?

3D logos use depth, shading, and lighting to look like a real object. They feel playful, premium, or high tech. A 3D mark can make a gaming brand or a tech startup feel exciting.

**3D logos are great when you want to feel:**

- Bold and energetic
- Innovative and cutting edge
- Premium and detailed

## How to decide

Ask yourself what your customers should feel when they see your brand. A calm wellness studio and a fast gaming channel need very different logos.

The good news is that you do not have to choose blindly. With PopTheLogo you can generate the same idea in both flat and 3D styles and compare them side by side in seconds.

## Try it yourself

Enter your idea, switch the style between Flat Design and 3D, and see which result feels right for your brand.`,
    cover_image: null,
    author: "PopTheLogo Team",
    published: true,
    published_at: iso(12),
    created_at: iso(12),
    updated_at: iso(12),
    tags: ["styles", "design", "branding"],
    meta_title: "Flat vs 3D Logos: Which Style Fits Your Brand? — PopTheLogo",
    meta_description:
      "Compare flat and 3D logo styles and learn how to pick the one that matches your brand personality.",
  },
  {
    id: "seed-post-3",
    title: "How to Write a Great Prompt for an AI Logo Generator",
    slug: "how-to-write-logo-prompts",
    excerpt:
      "The quality of an AI logo starts with the prompt. Learn a simple formula to describe your idea so the result matches what you imagined.",
    content: `An AI logo generator is only as good as the instructions you give it. A vague prompt gives a vague result. A clear prompt gives you something close to what you imagined. Here is a simple formula that works every time.

## The formula

**[subject] + [style] + [details] + [mood]**

Describe what the logo shows, the visual style, the key details, and the feeling you want.

## Before and after

Vague prompt: "coffee logo"

Better prompt: "modern minimalist logo for a coffee shop, a coffee cup with steam, warm brown tones, clean vector style, friendly and cozy mood"

The second prompt tells the AI exactly what to draw and how it should feel.

## Be specific about the subject

Instead of "animal logo", name the animal, the pose, and the framing. "A geometric fox head facing forward" is much clearer.

## Pick a style word

Words like flat, minimalist, vintage, modern, 3D, and abstract each push the AI toward a different look. PopTheLogo lets you choose a style from a menu, so you only need to describe the idea.

## Add color and mood hints

Mention two or three colors and a mood word such as bold, calm, playful, or premium.

## Keep it short

One or two sentences are enough. Long prompts can confuse the model.

## Generate and refine

Your first result is a starting point. Tweak a word or two and generate again. Each round moves you closer to the perfect logo.

Start with the formula above and generate your logo for free.`,
    cover_image: null,
    author: "PopTheLogo Team",
    published: true,
    published_at: iso(20),
    created_at: iso(20),
    updated_at: iso(20),
    tags: ["prompts", "tips", "ai"],
    meta_title: "How to Write a Great AI Logo Prompt — PopTheLogo",
    meta_description:
      "Use a simple formula to write clear prompts for an AI logo generator and get results that match your idea.",
  },
];
