## 🎨 Design.md — PopTheLogo

```markdown
# PopTheLogo — UI/UX Design Document

## 1. Design Principles
| Prinsip | Penerapan |
|---------|-----------|
| **Simplicity** | Antarmuka minimalis, fokus pada satu tugas utama: generate logo |
| **Delight** | Animasi halus membuat proses terasa magis |
| **Accessibility** | WCAG 2.1 AA compliant |
| **Responsiveness** | Mobile‑first, berfungsi di semua ukuran layar |
| **Performance** | < 2 detik First Contentful Paint |

---

## 2. Brand Identity

### 2.1 Color Palette
| Peran | Warna | Hex | Penggunaan |
|-------|-------|-----|------------|
| Primary | Indigo | `#6366F1` | Tombol CTA, link, aksen |
| Secondary | Ungu | `#8B5CF6` | Hover state, gradasi |
| Background | Putih | `#FFFFFF` | Latar utama |
| Surface | Abu‑abu | `#F8FAFC` | Card, section background |
| Text Primary | Gelap | `#0F172A` | Judul, teks utama |
| Text Secondary | Abu‑abu | `#64748B` | Deskripsi, subteks |
| Success | Hijau | `#10B981` | Status sukses |
| Error | Merah | `#EF4444` | Error states |

### 2.2 Typography
| Elemen | Font | Size | Weight |
|--------|------|------|--------|
| Heading 1 | Inter | 48px | 800 |
| Heading 2 | Inter | 32px | 700 |
| Heading 3 | Inter | 24px | 600 |
| Body | Inter | 16px | 400 |
| Caption | Inter | 14px | 400 |
| Button | Inter | 16px | 500 |

### 2.3 Spacing System
Menggunakan skala 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

---

## 3. Page Layouts

### 3.1 Homepage
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [Blog] [About] [Contact] [Admin Login] │ ← Navbar
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ ✨ PopTheLogo │ │ ← Hero
│ │ Ubah ide menjadi logo dalam hitungan detik │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ [📝 Prompt] "Logo kafe vintage dengan kopi" │ │ ← Form
│ │ [Gaya: ▼ Flat] [Rasio: ▼ Square] │ │
│ │ [✨ Buat Logo Sekarang] │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ [SKELETON LOADING] │ │ ← Result
│ │ ████████████░░░░░░░░ 45% "AI sedang merancang..." │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ 🖼️ [HASIL LOGO] [📥 Download] [🔄 Buat Lagi] │ │
│ └───────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ © 2026 PopTheLogo | Privacy | Terms │
└─────────────────────────────────────────────────────────────────┘


### 3.2 Blog Page
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [Blog] [About] [Contact] [Admin Login] │
├─────────────────────────────────────────────────────────────────┤
│ 📝 Blog & Artikel │
│ Tips dan inspirasi desain logo untuk brand-mu │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ [Image] │ │ [Image] │ │ [Image] │ │
│ │ Judul Post │ │ Judul Post │ │ Judul Post │ │
│ │ Excerpt... │ │ Excerpt... │ │ Excerpt... │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ © 2026 PopTheLogo │
└─────────────────────────────────────────────────────────────────┘


### 3.3 Admin Dashboard
┌─────────────────────────────────────────────────────────────────┐
│ ☰ PopTheLogo Admin [👤 Admin] ▼ │
├──────────────┬──────────────────────────────────────────────────┤
│ 📊 Dashboard │ ┌────────────────────────────────────────────┐ │
│ 📝 Blog │ │ 📝 Kelola Konten │ │
│ 📄 Pages │ │ ┌──────────────────────────────────────┐ │ │
│ ⚙️ Settings │ │ │ + Tambah Post Baru │ │ │
│ 🔐 Logout │ │ └──────────────────────────────────────┘ │ │
│ │ │ ┌──────┬───────────┬────────┬──────────┐ │ │
│ │ │ │ Title │ Status │ Date │ Action │ │ │
│ │ │ ├──────┼───────────┼────────┼──────────┤ │ │
│ │ │ │ ... │ Published │ 01/01 │ [Edit][🗑]│ │ │
│ │ │ └──────┴───────────┴────────┴──────────┘ │ │
│ │ └────────────────────────────────────────────┘ │
│ │ ┌────────────────────────────────────────────┐ │
│ │ │ ⚙️ Pengaturan Situs │ │
│ │ │ Logo: [Upload] Nama: [PopTheLogo] │ │
│ │ │ [💾 Simpan Pengaturan] │ │
│ │ └────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────┘

---

## 4. Komponen UI

### 4.1 Generator Form
```tsx
interface GeneratorFormProps {
  onSubmit: (data: { prompt: string; style: string; ratio: string }) => void;
  isLoading: boolean;
}

const STYLE_OPTIONS = [
  { value: 'flat', label: 'Flat Design' },
  { value: '3d', label: '3D' },
  { value: 'minimalis', label: 'Minimalis' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
  { value: 'abstract', label: 'Abstract' },
];

const RATIO_OPTIONS = [
  { value: 'square', label: 'Square', width: 512, height: 512 },
  { value: 'portrait', label: 'Portrait', width: 512, height: 768 },
  { value: 'landscape', label: 'Landscape', width: 768, height: 512 },
];

### 4.2 Skeleton Loading
export function ImageSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-gray-200 p-4">
      <div className="flex h-64 items-center justify-center rounded bg-gray-300">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-500">AI sedang merancang logo...</p>
          <p className="text-xs text-gray-400">Mohon tunggu, jangan refresh halaman</p>
        </div>
      </div>
    </div>
  );
}

### 4.3 Result Display
export function ResultDisplay({ imageUrl, prompt, onRegenerate }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <img src={imageUrl} alt={`Logo: ${prompt}`} className="mx-auto max-h-96 w-auto" />
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button onClick={() => downloadImage(imageUrl)}>📥 Download PNG</Button>
        <Button variant="outline" onClick={onRegenerate}>🔄 Buat Lagi</Button>
        <Button variant="ghost" onClick={() => copyPrompt(prompt)}>📋 Salin Prompt</Button>
      </div>
    </div>
  );
}

## 5. Interaksi & Animasi
### 5.1 Loading States
State	Visual	Durasi
Initial	Form aktif, tombol siap	-
Loading	Skeleton + spinner + progress bar	3‑10 detik
Success	Fade‑in hasil logo	300ms
Error	Toast notification merah	4 detik

###5.2 Micro‑interactions
Elemen	Interaksi	Efek
Tombol CTA	Hover	Scale 1.02, shadow
Input Field	Focus	Border berubah warna
Dropdown	Open	Smooth slide down
Hasil Logo	Load	Fade‑in + scale up

###5.3 Progress Indicator
Loading Progress:
████████████████░░░░░░░░ 65%
[=====●=====] Mengolah prompt...
[=========●=] Menghasilkan gambar...
[============●] Selesai!

## 6. Responsive Breakpoints
Breakpoint	Lebar	Layout
Mobile	< 640px	Single column, form full‑width
Tablet	640‑1024px	Two column untuk form & result
Desktop	> 1024px	Max‑width 1200px, centering

## 7. Aksesibilitas (a11y)
Elemen	Implementasi
Semantic HTML	<main>, <article>, <nav>, <section>
ARIA Labels	aria‑label pada tombol ikon
Keyboard Navigation	Semua interaksi via keyboard
Focus Indicators	Outline jelas pada elemen focus
Alt Text	Semua gambar memiliki alt deskriptif
Color Contrast	Rasio kontras minimal 4.5:1

## 8. SEO Implementation Checklist
#	Item	Implementasi di Next.js 16
1	Metadata	Export metadata object di setiap page
2	Dynamic Metadata	generateMetadata untuk dynamic routes
3	Open Graph	og:title, og:description, og:image
4	Sitemap	app/sitemap.ts untuk generate sitemap.xml
5	Robots.txt	app/robots.ts
6	Canonical URL	alternates.canonical di metadata
7	JSON‑LD	Tambahkan structured data dengan <script>
8	Image Optimization	Gunakan <Image> dari Next.js

## 9. Admin Dashboard Features
Blog Management: Create, edit, delete posts dengan WYSIWYG editor, upload cover image, publish/schedule, tags.

Page Management: Create/edit static pages (About, Contact, etc.) dengan custom slug dan meta SEO.

Settings: Upload site logo, ubah site name, edit footer text, kelola social media links, konfigurasi analytics ID.

## 10. Deployment Checklist
#	Item	Status
1	Setup Next.js 16+ + TypeScript	⬜
2	Install Tailwind + shadcn/ui	⬜
3	Setup Supabase project & database	⬜
4	Integrate Pollinations.ai API	⬜
5	Build homepage + generator form	⬜
6	Build result display + download	⬜
7	Build blog pages (list + detail)	⬜
8	Build admin dashboard	⬜
9	Setup authentication (Supabase Auth)	⬜
10	SEO optimization (metadata, sitemap)	⬜
11	Testing & deployment to Vercel	⬜
12	Setup custom domain (popthelogo.com)	⬜
13	Setup analytics	⬜

## 11. Estimated Timeline (MVP)
Fase	Durasi	Deliverable
Setup & Foundation	3 hari	Next.js + Supabase + Tailwind
Core Feature	5 hari	Generator + API integration
CMS & Admin	5 hari	Blog + Admin dashboard
SEO & Optimization	3 hari	Metadata, sitemap, performance
Testing & Deployment	2 hari	QA, deploy ke Vercel
Total	18 hari	MVP siap launching

## 12. API Reference — Pollinations.ai
Endpoint: GET https://image.pollinations.ai/prompt/{prompt}
Parameters:

prompt (required) — teks deskripsi, URL‑encoded

model — flux (default), turbo, dll.

width / height — ukuran gambar

seed — untuk reproducibility

nologo — true untuk hilangkan watermark

enhance — true untuk perbaikan prompt otomatis

Rate Limit: 1 request concurrent per IP / 5 detik
Contoh:
https://image.pollinations.ai/prompt/modern%20minimalist%20logo%20for%20a%20coffee%20shop?width=512&height=512&model=flux&nologo=true


Homepage Content (popthelogo.com)
Hero Section:
<h1>Create Your Perfect Logo in One Second – Free</h1>
<p>No design skills needed. No payment required. Just type your idea, pick a style, and get a professional logo instantly.</p>

Generator Form (ditempatkan di bawah hero)
(Form ini adalah bagian dari UI, tetapi konten di sekitarnya bisa berupa penjelasan singkat)

Prompt input (placeholder): "Describe your logo idea, for example: modern coffee shop logo with a vintage feel"

Style options: Flat Design, 3D, Minimalist, Vintage, Modern, Abstract

Aspect ratio: Square, Portrait, Landscape

Button: "Generate Logo Now"

Feature Sections (di bawah hasil generate atau sebagai informasi tambahan)
1. Instant Logo Creation
Time is valuable. Our logo maker works in seconds. Type your idea, choose your style, and get a high‑quality logo immediately. No waiting for designers, no back‑and‑forth revisions. Just results.

2. Completely Free
No hidden fees, no premium plans, no watermarks. You get full ownership of your logo without spending anything. We believe every business deserves a great brand identity, regardless of budget.

3. Easy to Use
You do not need any design experience. The interface is simple and guides you step by step. Pick a style, choose your aspect ratio, and let the AI do the rest. Real‑time previews help you see changes before you download.

4. Customizable Options
Choose from multiple design styles – flat, 3D, minimal, vintage, modern, or abstract. Adjust the aspect ratio to fit your needs – square for social media, portrait for banners, landscape for websites. Your logo, your way.

5. Download and Use Anywhere
Get your logo as a high‑resolution PNG file. Use it on your website, business cards, social media, or merchandise. The quality stays sharp everywhere.

6. No Storage, Full Privacy
We do not save your logos on our servers. Your creations stay private and are deleted after you download them. You are in control.

How It Works (opsional, bisa ditambahkan)
Describe – Enter your logo idea in plain words.

Choose – Select a style and aspect ratio.

Generate – Click the button and watch the AI create your logo.

Download – Save your logo and use it anywhere.

Call to Action (di bagian bawah)
Ready to build your brand? Start creating your logo now – it takes only one second and it is free.

Testimonial / Trust Section (opsional)
"PopTheLogo gave me a professional logo for my startup in under 10 seconds. I could not believe it was free!" – satisfied user

Footer Links
About

Blog

Contact

Privacy Policy

Terms of Service

Catatan untuk Implementasi
Semua teks di atas menggunakan bahasa Inggris sederhana, tanpa em‑dash (hanya titik, koma, dan tanda tanya).

Bagian hero dan form akan berada di atas fold; fitur‑fitur bisa ditampilkan dalam grid di bawah hasil generate atau di bawah form.

Untuk SEO, pastikan setiap bagian memiliki heading (<h2>, <h3>) dan meta description yang sesuai.

Konten blog (misalnya artikel tentang tips desain logo) akan melengkapi homepage dan membantu peringkat pencarian.

Buatkan juga konten untuk halaman About, Contact, dan Privacy Policy