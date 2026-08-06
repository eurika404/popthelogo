// Domain types shared between the database layer and the UI.

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  footer_text: string;
  default_prompt_template: string;
  analytics_id: string;
  social: { label: string; url: string }[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "PopTheLogo",
  tagline: "Turn your idea into a logo in seconds.",
  footer_text: "Free AI logo maker. No sign up required.",
  default_prompt_template:
    "modern minimalist logo for {idea}, clean vector, professional branding, centered, solid background",
  analytics_id: "",
  social: [],
};

/** Shape returned by the logo generation API. */
export interface GenerateLogoResponse {
  imageUrl: string;
  width: number;
  height: number;
  prompt: string;
  seed: number;
  style: string;
  ratio: string;
}
