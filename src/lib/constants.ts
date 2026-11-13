// Centralised application constants.

export const SITE = {
  name: "PopTheLogo",
  domain: "popthelogo.com",
  tagline: "Free AI Logo Generator (No Sign Up)",
  description:
    "Create professional logos in seconds with AI. 100% free, high-resolution PNG download, no watermark, and no sign-up required. Try PopTheLogo now!",
  slogan: "Pop The Logo",
} as const;

// Style options for the logo generator (PRD 4.1 #2)
export const STYLE_OPTIONS = [
  { value: "flat", label: "Flat Design" },
  { value: "3d", label: "3D" },
  { value: "minimalis", label: "Minimalis" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "abstract", label: "Abstract" },
] as const;

export type StyleValue = (typeof STYLE_OPTIONS)[number]["value"];

// Aspect ratio options (PRD 4.1 #3)
export const RATIO_OPTIONS = [
  { value: "square", label: "Square", hint: "512 x 512", width: 512, height: 512 },
  {
    value: "portrait",
    label: "Portrait",
    hint: "512 x 768",
    width: 512,
    height: 768,
  },
  {
    value: "landscape",
    label: "Landscape",
    hint: "768 x 512",
    width: 768,
    height: 512,
  },
] as const;

export type RatioValue = (typeof RATIO_OPTIONS)[number]["value"];

export const STYLE_LABEL: Record<string, string> = Object.fromEntries(
  STYLE_OPTIONS.map((s) => [s.value, s.label]),
);

export const RATIO_DIMENSIONS: Record<
  string,
  { width: number; height: number; label: string }
> = Object.fromEntries(
  RATIO_OPTIONS.map((r) => [
    r.value,
    { width: r.width, height: r.height, label: r.label },
  ]),
);

export const ADMIN_COOKIE = "ptl_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

export const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  max: 5, // 5 requests per window per IP (PRD 9)
};
