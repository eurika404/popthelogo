-- ─────────────────────────────────────────────────────────────────────────────
-- PopTheLogo — initial schema, RLS policies, storage bucket, and seed data.
--
-- How to run:
--   Option A (Supabase Dashboard):  SQL Editor → New query → paste → Run.
--   Option B (local Supabase CLI):  supabase db push
--
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT).
-- ─────────────────────────────────────────────────────────────────────────────

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  excerpt         text,
  content         text not null,
  cover_image     text,
  author          text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  tags            text[] default '{}',
  meta_title      text,
  meta_description text
);

create table if not exists public.pages (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  content         text not null,
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  meta_title      text,
  meta_description text
);

create table if not exists public.site_settings (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on row changes.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated on public.blog_posts;
create trigger trg_blog_posts_updated
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_pages_updated on public.pages;
create trigger trg_pages_updated
  before update on public.pages
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- The app uses the anon key for reads and the service role key for writes.
-- The service role bypasses RLS, so write policies are for safety only.

alter table public.blog_posts   enable row level security;
alter table public.pages        enable row level security;
alter table public.site_settings enable row level security;

-- Public can read published content + all settings (settings hold no secrets).
drop policy if exists "public read published posts" on public.blog_posts;
create policy "public read published posts"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "public read published pages" on public.pages;
create policy "public read published pages"
  on public.pages for select
  using (published = true);

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings"
  on public.site_settings for select
  using (true);

-- Authenticated users (future: real Supabase Auth admins) can do everything.
-- The service role already bypasses RLS regardless.
drop policy if exists "authed manage posts" on public.blog_posts;
create policy "authed manage posts"
  on public.blog_posts for all
  to authenticated
  using (true) with check (true);

drop policy if exists "authed manage pages" on public.pages;
create policy "authed manage pages"
  on public.pages for all
  to authenticated
  using (true) with check (true);

drop policy if exists "authed manage settings" on public.site_settings;
create policy "authed manage settings"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);

-- ── Storage bucket for cover images ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "authed upload media" on storage.objects;
create policy "authed upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- ── Seed: default site settings ──────────────────────────────────────────────
insert into public.site_settings (key, value) values
  ('site_config', '{
    "site_name": "PopTheLogo",
    "tagline": "Turn your idea into a logo in seconds.",
    "footer_text": "PopTheLogo is a free AI logo maker. No sign up, no payment, no watermark.",
    "default_prompt_template": "modern minimalist logo for {idea}, clean vector, professional branding, centered, solid background",
    "analytics_id": "",
    "social": []
  }'::jsonb)
on conflict (key) do nothing;

-- ── Seed: static pages ───────────────────────────────────────────────────────
insert into public.pages (slug, title, content, published, meta_title, meta_description) values
  (
    'about',
    'About PopTheLogo',
    '# About PopTheLogo

PopTheLogo is a free AI logo maker that turns a simple text idea into a professional logo in seconds.

We built PopTheLogo because every business, freelancer, and creator deserves a strong brand identity, no matter their budget. There are no hidden fees, no premium plans, and no watermarks. You get full ownership of every logo you create.

## Our mission

Make great design accessible to everyone. Type your idea, pick a style, and let the AI do the heavy lifting. Your logo is ready to download as a high resolution PNG.

## Privacy first

We do not save your logos on our servers. Your creations stay private.',
    true,
    'About PopTheLogo — Free AI Logo Maker',
    'Learn about PopTheLogo, the free AI logo maker that turns your idea into a professional logo in seconds.'
  ),
  (
    'privacy',
    'Privacy Policy',
    '# Privacy Policy

Last updated: 2026

PopTheLogo respects your privacy.

## What we do not collect

- Your logos are not stored on our servers.
- We do not keep a history of your prompts.
- We do not require an account or personal data to generate a logo.

## What we collect

- Privacy friendly aggregate analytics.
- Standard server logs for security and rate limiting.

## Third party services

Logo generation is powered by Pollinations.ai. Avoid sharing sensitive information in prompts.',
    true,
    'Privacy Policy — PopTheLogo',
    'Read the PopTheLogo privacy policy. We do not store your logos or personal data.'
  ),
  (
    'terms',
    'Terms of Service',
    '# Terms of Service

Last updated: 2026

By using PopTheLogo, you agree to these terms.

## Use of the service

Use the service lawfully. Do not generate content that infringes rights or is illegal or harmful.

## Ownership and license

You own the logos you create and may use them for personal and commercial projects. Please review each logo before commercial use.

## No warranty

The service is provided as is without warranties. You are responsible for verifying that your logo does not conflict with existing trademarks.',
    true,
    'Terms of Service — PopTheLogo',
    'Read the PopTheLogo terms of service. You own the logos you create and may use them commercially.'
  )
on conflict (slug) do nothing;

-- ── Seed: sample blog posts ──────────────────────────────────────────────────
insert into public.blog_posts (title, slug, excerpt, content, author, published, published_at, tags, meta_title, meta_description) values
  (
    '10 Logo Design Tips Every Small Business Should Know',
    '10-logo-design-tips',
    'A strong logo helps customers remember you. These ten practical tips will guide you from the first sketch to a finished, professional mark.',
    '# 10 Logo Design Tips Every Small Business Should Know

A great logo is more than a pretty picture. It is the face of your business.

## 1. Keep it simple

Simple logos are easier to recognize and easier to scale.

## 2. Make it work in one color

A strong logo still reads in black and white.

## 3. Choose the right style

Flat, vintage, minimalist. Pick a style that matches your brand.

## 4. Think about where it will live

Test your logo at very small and very large sizes.

## 5. Use a consistent color palette

Two or three colors are usually enough.

## 6. Pick readable fonts

Make sure letters stay legible at small sizes.

## 7. Leave breathing room

Whitespace makes your logo feel confident.

## 8. Make it timeless

A logo built on solid principles lasts for years.

## 9. Get feedback

If people cannot tell what it represents, simplify.

## 10. Start fast, then refine

Use PopTheLogo to generate dozens of ideas in minutes.',
    'PopTheLogo Team',
    true,
    now() - interval '5 days',
    array['tips', 'design', 'branding'],
    '10 Logo Design Tips for Small Businesses — PopTheLogo',
    'Ten practical logo design tips to help small businesses create a memorable, professional brand mark.'
  ),
  (
    'Flat vs 3D Logos: Which Style Fits Your Brand?',
    'flat-vs-3d-logos',
    'Flat and 3D logos send very different signals. Here is how to choose the style that matches what your brand stands for.',
    '# Flat vs 3D Logos: Which Style Fits Your Brand?

Two of the most popular directions are flat design and 3D design. Each tells a different story.

## What is flat design?

Flat design uses clean shapes and solid colors. It looks modern and clean.

## What is a 3D logo?

3D logos use depth and shading. They feel playful or premium.

## How to decide

Ask what your customers should feel. With PopTheLogo you can generate the same idea in both styles and compare them in seconds.',
    'PopTheLogo Team',
    true,
    now() - interval '12 days',
    array['styles', 'design', 'branding'],
    'Flat vs 3D Logos: Which Style Fits Your Brand? — PopTheLogo',
    'Compare flat and 3D logo styles and learn how to pick the one that matches your brand.'
  ),
  (
    'How to Write a Great Prompt for an AI Logo Generator',
    'how-to-write-logo-prompts',
    'The quality of an AI logo starts with the prompt. Learn a simple formula to describe your idea.',
    '# How to Write a Great Prompt for an AI Logo Generator

An AI logo generator is only as good as the instructions you give it.

## The formula

Describe the subject, the style, the details, and the mood.

## Be specific

Name the animal, the pose, and the framing.

## Pick a style word

Words like flat, minimalist, and vintage push the AI toward a different look.

## Generate and refine

Each round moves you closer to the perfect logo.',
    'PopTheLogo Team',
    true,
    now() - interval '20 days',
    array['prompts', 'tips', 'ai'],
    'How to Write a Great AI Logo Prompt — PopTheLogo',
    'Use a simple formula to write clear prompts for an AI logo generator.'
  )
on conflict (slug) do nothing;
