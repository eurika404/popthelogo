"use client";

import * as React from "react";
import { Wand2, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  STYLE_OPTIONS,
  RATIO_OPTIONS,
  type StyleValue,
  type RatioValue,
} from "@/lib/constants";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-line bg-white pl-3.5 pr-10 text-base text-ink shadow-sm transition-colors focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50";

export interface GeneratorFormValues {
  prompt: string;
  style: StyleValue;
  ratio: RatioValue;
}

interface GeneratorFormProps {
  initialPrompt?: string;
  initialStyle?: StyleValue;
  initialRatio?: RatioValue;
  isLoading: boolean;
  onSubmit: (values: GeneratorFormValues) => void;
}

export function GeneratorForm({
  initialPrompt = "",
  initialStyle = "flat",
  initialRatio = "square",
  isLoading,
  onSubmit,
}: GeneratorFormProps) {
  const [prompt, setPrompt] = React.useState(initialPrompt);
  const [style, setStyle] = React.useState<StyleValue>(initialStyle);
  const [ratio, setRatio] = React.useState<RatioValue>(initialRatio);
  const [touched, setTouched] = React.useState(false);

  const promptError =
    touched && prompt.trim().length < 3
      ? "Please describe your logo idea (at least 3 characters)."
      : undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const trimmed = prompt.trim();
    if (trimmed.length < 3 || isLoading) return;
    onSubmit({ prompt: trimmed, style, ratio });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="prompt">
          Describe your logo idea
        </Label>
        <Input
          id="prompt"
          name="prompt"
          autoFocus
          autoComplete="off"
          placeholder="Describe your logo idea, for example: modern coffee shop logo with a vintage feel"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          aria-invalid={Boolean(promptError)}
          aria-describedby={promptError ? "prompt-error" : undefined}
        />
        {promptError && (
          <p id="prompt-error" className="text-sm text-danger">
            {promptError}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="style-select">Style</Label>
          <div className="relative">
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleValue)}
              disabled={isLoading}
              className={selectClass}
            >
              {STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ratio-select">Aspect ratio</Label>
          <div className="relative">
            <select
              id="ratio-select"
              value={ratio}
              onChange={(e) => setRatio(e.target.value as RatioValue)}
              disabled={isLoading}
              className={selectClass}
            >
              {RATIO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.hint})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="xl"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            Generate Logo Now
          </>
        )}
      </Button>
    </form>
  );
}
