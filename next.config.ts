import type { NextConfig } from "next";

// Content-Security-Policy. Next.js (App Router) injects inline bootstrap scripts,
// so 'unsafe-inline' is required for script-src unless you wire up nonces. Dev
// (Turbopack) also needs 'unsafe-eval'. The remaining directives stay strict.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ""),
  // Inline styles are needed for server components + Radix; nonces are not used to keep it simple.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Images: self + Pollinations (logo generation) + Supabase storage
  "img-src 'self' data: blob: https:",
  // fetch/xhr to our own API + Pollinations + Supabase
  "connect-src 'self' https://*.supabase.co https://image.pollinations.ai",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
