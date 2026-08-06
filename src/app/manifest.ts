import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PopTheLogo — Free AI Logo Maker",
    short_name: "PopTheLogo",
    description:
      "Turn your idea into a logo in seconds. Free, fast, and no sign up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["design", "productivity", "graphics"],
  };
}
