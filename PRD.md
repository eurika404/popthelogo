# PopTheLogo — Product Requirements Document (PRD)

## 1. Ringkasan Produk
**Nama**: PopTheLogo  
**Domain**: popthelogo.com  
**Slogan**: Ubah ide menjadi logo dalam hitungan detik — gratis, cepat, tanpa registrasi.  

PopTheLogo adalah micro SaaS berbasis AI yang memungkinkan pengguna membuat logo dari teks dengan memilih gaya dan rasio aspek. Hasil logo **tidak disimpan di server** untuk menjaga privasi dan efisiensi biaya. Layanan ini **100% gratis** tanpa batasan penggunaan.

---

## 2. Tujuan & Sasaran
| Tujuan | Metrik Keberhasilan |
|--------|----------------------|
| Memudahkan pembuatan logo instan untuk semua orang | ≥ 100 generate/hari di bulan pertama |
| Pengalaman pengguna yang mulus dan intuitif | Bounce rate < 40% |
| Mendapatkan traffic organik melalui konten blog | ≥ 1.000 pengunjung organik/bulan di bulan ke-3 |
| Admin dapat mengelola konten dan pengaturan dengan mudah | Admin dashboard fully operational |

---

## 3. Target Pengguna
| Segmen | Deskripsi |
|--------|-----------|
| **Individu / Freelancer** | Butuh logo cepat untuk portofolio atau proyek kecil |
| **Startup / UKM** | Ingin bereksperimen dengan berbagai konsep logo |
| **Desainer** | Mencari inspirasi visual dari AI |
| **Content Creator** | Membutuhkan logo untuk channel/brand personal |
| **Pelajar / Mahasiswa** | Belajar desain dan branding |

---

## 4. Fitur Produk

### 4.1 MVP (Minimum Viable Product) — 100% Gratis
| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Text‑to‑Logo Generator** | Input prompt → AI generate logo secara instan |
| 2 | **Opsi Gaya** | Dropdown: Flat, 3D, Minimalis, Vintage, Modern, Abstract |
| 3 | **Opsi Rasio Aspek** | Toggle/Radio: Square (512×512), Portrait (512×768), Landscape (768×512) |
| 4 | **Animasi Loading** | Skeleton screen + progress indicator selama proses generate |
| 5 | **Download Logo** | Tombol unduh hasil logo dalam format PNG |
| 6 | **Riwayat Sesi** | Hasil generate tersimpan di session storage (hilang setelah browser ditutup) |
| 7 | **Blog CMS** | Artikel tentang logo, branding, tips desain (untuk SEO) |
| 8 | **Halaman Statis** | About, Contact, Privacy Policy, Terms of Service |

### 4.2 Fitur Future (Post‑MVP — tetap gratis)
| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Variasi Logo** | Generate 4 variasi dari 1 prompt sekaligus |
| 2 | **Color Palette Picker** | Pilih warna dominan sebelum generate |
| 3 | **Custom Font Integration** | Tambahkan teks pada logo |
| 4 | **User Account** | Simpan riwayat generate secara permanen (dengan login) |

---

## 5. Alur Pengguna (User Flow)
HOMEPAGE
└─> Input prompt + pilih gaya & rasio
└─> Klik "Buat Logo Sekarang"
└─> Tampilkan skeleton loading + animasi
└─> Logo muncul di bawah form
└─> Tombol Download / Buat Lagi / Salin Prompt


---

## 6. Persyaratan Teknis

### 6.1 Tech Stack
| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Frontend** | Next.js 16+ (App Router) | Server Components, SEO native, performa tinggi |
| **Bahasa** | TypeScript | Type safety, maintainability |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, aksesibilitas |
| **AI Image** | Pollinations.ai API | Gratis, no signup required |
| **Database** | Supabase (PostgreSQL) | Auth, CMS, Storage terintegrasi |
| **CMS Admin** | Payload CMS (atau custom) | Admin panel untuk blog & settings |
| **Hosting** | Vercel | Deployment otomatis, edge functions |
| **Analytics** | Vercel Analytics / Plausible | Tracking pengguna tanpa cookie |

### 6.2 Arsitektur Sistem

Vercel (Hosting)
└─ Next.js 16+ App Router
├─ / (Public) → Home, Blog, About, Contact
├─ /admin → CMS untuk kelola blog, pages, settings
└─ /api/generate-logo → Route Handler yang memanggil Pollinations.ai

Supabase (Database)
├─ Auth (untuk admin login)
├─ Database (tabel blog_posts, pages, site_settings)
└─ Storage (untuk upload cover image dan logo situs


---

## 7. Database Schema (Supabase)

### 7.1 Tabel `blog_posts`
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT
);

### 7.2 Tabel site_settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

Key yang dibutuhkan: site_logo, site_name, footer_text, default_prompt_template, analytics_id.	

### 7.3 Tabel pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT
);

## 8. API Endpoints
### 8.1 Public API
Endpoint	Method	Deskripsi
/api/generate-logo	POST	Generate logo dari prompt + opsi
/api/blog/posts	GET	List semua blog post (published)
/api/blog/posts/[slug]	GET	Detail blog post

### 8.2 Admin API (dengan Auth)
Endpoint	Method	Deskripsi
/api/admin/posts	GET/POST	CRUD blog posts
/api/admin/posts/[id]	PUT/DELETE	Update/delete post
/api/admin/pages	GET/POST	CRUD static pages
/api/admin/settings	GET/PUT	Baca/update settings

## 9. Keamanan & Kepatuhan
Aspek	Implementasi
Rate Limiting	5 request/menit per IP (mencegah abuse)
Admin Auth	Hanya user dengan role admin yang bisa akses /admin
CORS	Terapkan CORS yang ketat
Environment Variables	Semua secret disimpan di .env.local
Content Security Policy	Terapkan CSP header
GDPR	Cookie consent banner, tidak simpan data pribadi (kecuali admin)

## 10. Monitoring & Analytics
ools	Fungsi
Vercel Analytics	Performa halaman, Core Web Vitals
Plausible / Umami	Privacy‑first analytics
Sentry	Error tracking (opsional)
Upstash Redis	Rate limiting (opsional)