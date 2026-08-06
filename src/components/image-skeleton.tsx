"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

const STAGES = [
  "Processing your prompt...",
  "Choosing a visual style...",
  "Generating the image...",
  "Adding the final touches...",
];

/** Animated skeleton + progress shown while the logo is being generated. */
export function ImageSkeleton({ ratio }: { ratio: string }) {
  const [progress, setProgress] = React.useState(8);
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    const start = Date.now();
    const duration = 12_000; // cap the visual progress near the end
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      // Ease towards 92% over time, never reaching 100 until truly done.
      const eased = Math.min(92, 8 + (elapsed / duration) * 84);
      setProgress(Math.round(eased));
      setStage(Math.min(STAGES.length - 1, Math.floor((eased / 92) * STAGES.length)));
    }, 220);
    return () => clearInterval(id);
  }, []);

  // Pick an aspect ratio for the skeleton box.
  const aspect =
    ratio === "portrait"
      ? "aspect-[2/3]"
      : ratio === "landscape"
        ? "aspect-[3/2]"
        : "aspect-square";

  return (
    <div
      className="animate-pulse rounded-2xl border border-line bg-surface p-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`mx-auto flex w-full max-w-md items-center justify-center overflow-hidden rounded-xl bg-line/70 ${aspect}`}
      >
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-ink">{STAGES[stage]}</p>
          <p className="text-xs text-muted">
            Please wait, do not refresh the page.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-4 max-w-md">
        <div className="h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>{progress}%</span>
          <span>AI is designing your logo</span>
        </div>
      </div>
    </div>
  );
}
