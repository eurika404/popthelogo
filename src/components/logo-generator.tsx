"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  GeneratorForm,
  type GeneratorFormValues,
} from "@/components/generator-form";
import { ImageSkeleton } from "@/components/image-skeleton";
import { ResultDisplay } from "@/components/result-display";
import {
  SessionHistory,
  type HistoryItem,
} from "@/components/session-history";
import { STYLE_LABEL, RATIO_DIMENSIONS } from "@/lib/constants";
import type { StyleValue, RatioValue } from "@/lib/constants";
import type { GenerateLogoResponse } from "@/types/content";

const STORAGE_KEY = "ptl_history_v1";
const MAX_HISTORY = 12;

type Status = "idle" | "loading" | "success" | "error";

interface ActiveResult {
  imageUrl: string;
  prompt: string;
  width: number;
  height: number;
  style: string;
  ratio: string;
  seed: number;
}

export function LogoGenerator() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [result, setResult] = React.useState<ActiveResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loadingRatio, setLoadingRatio] = React.useState("square");
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  // Last submitted values, used by "Make Again".
  const lastValues = React.useRef<GeneratorFormValues | null>(null);

  // Load session history on mount.
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as HistoryItem[]);
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  function persistHistory(items: HistoryItem[]) {
    setHistory(items);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage might be full or unavailable */
    }
  }

  async function generate(values: GeneratorFormValues) {
    lastValues.current = values;
    setLoadingRatio(values.ratio);
    setStatus("loading");
    setError(null);
    setActiveId(null);

    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json()) as GenerateLogoResponse & {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.error || "The logo service is busy. Please try again shortly.",
        );
      }

      const active: ActiveResult = {
        imageUrl: data.imageUrl,
        prompt: values.prompt,
        width: data.width,
        height: data.height,
        style: data.style,
        ratio: data.ratio,
        seed: data.seed,
      };

      // Preload the image before flipping to success so the UX is smooth.
      await preloadImage(data.imageUrl);

      setResult(active);
      setStatus("success");

      const item: HistoryItem = {
        id: `${Date.now()}-${data.seed}`,
        imageUrl: data.imageUrl,
        prompt: values.prompt,
        styleLabel: STYLE_LABEL[data.style] ?? "Modern",
        ratioLabel: RATIO_DIMENSIONS[data.ratio]?.label ?? "Square",
        width: data.width,
        height: data.height,
        seed: data.seed,
        createdAt: Date.now(),
      };
      const next = [item, ...history].slice(0, MAX_HISTORY);
      persistHistory(next);
      setActiveId(item.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStatus("error");
      toast.error(message);
    }
  }

  function handleRegenerate() {
    if (lastValues.current) generate(lastValues.current);
  }

  function handleSelectHistory(item: HistoryItem) {
    const style = (STYLE_LABEL_REVERSE[item.styleLabel] ?? "flat") as StyleValue;
    const ratio = (RATIO_LABEL_REVERSE[item.ratioLabel] ??
      "square") as RatioValue;
    setResult({
      imageUrl: item.imageUrl,
      prompt: item.prompt,
      width: item.width,
      height: item.height,
      style,
      ratio,
      seed: item.seed,
    });
    setActiveId(item.id);
    setStatus("success");
    setError(null);
    // Sync the form's last values so "Make Again" works from history.
    lastValues.current = { prompt: item.prompt, style, ratio };
  }

  function handleClearHistory() {
    persistHistory([]);
    setActiveId(null);
  }

  return (
    <div className="space-y-5">
      <GeneratorForm isLoading={status === "loading"} onSubmit={generate} />

      {status === "loading" && <ImageSkeleton ratio={loadingRatio} />}

      {status === "error" && error && (
        <div
          className="animate-fade-in flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Could not generate the logo</p>
            <p className="mt-0.5 text-danger/80">{error}</p>
          </div>
        </div>
      )}

      {status === "success" && result && (
        <ResultDisplay
          imageUrl={result.imageUrl}
          prompt={result.prompt}
          width={result.width}
          height={result.height}
          styleLabel={STYLE_LABEL[result.style] ?? "Modern"}
          ratioLabel={RATIO_DIMENSIONS[result.ratio]?.label ?? "Square"}
          onRegenerate={handleRegenerate}
        />
      )}

      <SessionHistory
        items={history}
        activeId={activeId}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />
    </div>
  );
}

// Reverse lookups to reconstruct style/ratio values from labels.
const STYLE_LABEL_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(STYLE_LABEL).map(([k, v]) => [v, k]),
);
const RATIO_LABEL_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(RATIO_DIMENSIONS).map(([k, v]) => [v.label, k]),
);

/** Resolve when the image has actually loaded (or errored). */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // resolve anyway so the UI can show the broken image state
    img.src = url;
  });
}
