import { RATIO_DIMENSIONS, STYLE_LABEL } from "@/lib/constants";
import type { RatioValue, StyleValue } from "@/lib/constants";

const BASE = "https://image.pollinations.ai/prompt";

/** Maps a style choice to descriptive language that guides the model. */
const STYLE_HINTS: Record<string, string> = {
  flat: "flat design style, solid colors, no gradients, clean vector, modern",
  "3d": "3D render style, soft shading, depth, glossy, dimensional, high detail",
  minimalis:
    "minimalist style, very simple, lots of negative space, one or two colors, refined",
  vintage: "vintage retro style, muted warm tones, classic emblem, aged texture",
  modern: "modern contemporary style, sleek, geometric, balanced, professional",
  abstract: "abstract geometric style, creative shapes, symbolic, artistic",
};

const LOGO_SUFFIX =
  "professional logo design, centered composition, simple clean background, high quality, sharp vector";

/**
 * Compose a single, descriptive prompt from the user's idea and chosen style.
 * The user only describes the idea; we add the style language and quality cues.
 */
export function buildPrompt(
  idea: string,
  style: StyleValue | string,
): string {
  const cleanIdea = idea.trim().replace(/\s+/g, " ");
  const hint = STYLE_HINTS[style] ?? STYLE_HINTS.modern;
  return `${cleanIdea}, ${hint}, ${LOGO_SUFFIX}`;
}

export interface BuildUrlArgs {
  idea: string;
  style: StyleValue | string;
  ratio: RatioValue | string;
  seed?: number;
}

export interface BuildUrlResult {
  url: string;
  width: number;
  height: number;
  seed: number;
  prompt: string;
}

/** Construct the final Pollinations image URL with all parameters. */
export function buildImageUrl({
  idea,
  style,
  ratio,
  seed,
}: BuildUrlArgs): BuildUrlResult {
  const dims = RATIO_DIMENSIONS[ratio] ?? RATIO_DIMENSIONS.square;
  const prompt = buildPrompt(idea, style);
  const finalSeed = seed ?? Math.floor(Math.random() * 1_000_000);

  const params = new URLSearchParams({
    width: String(dims.width),
    height: String(dims.height),
    model: "flux",
    nologo: "true",
    enhance: "true",
    seed: String(finalSeed),
    referrer: "popthelogo",
  });

  return {
    url: `${BASE}/${encodeURIComponent(prompt)}?${params.toString()}`,
    width: dims.width,
    height: dims.height,
    seed: finalSeed,
    prompt,
  };
}

export function styleLabel(style: string): string {
  return STYLE_LABEL[style] ?? "Modern";
}
