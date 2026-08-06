"use client";

import * as React from "react";
import { Download, RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResultDisplayProps {
  imageUrl: string;
  prompt: string;
  width: number;
  height: number;
  styleLabel: string;
  ratioLabel: string;
  onRegenerate: () => void;
}

export function ResultDisplay({
  imageUrl,
  prompt,
  width,
  height,
  styleLabel,
  ratioLabel,
  onRegenerate,
}: ResultDisplayProps) {
  const [downloading, setDownloading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  async function handleDownload() {
    try {
      setDownloading(true);
      const apiUrl = `/api/download?${new URLSearchParams({
        url: imageUrl,
        filename: `popthelogo-${Date.now()}.png`,
      })}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `popthelogo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("Logo downloaded as PNG.");
    } catch {
      toast.error("Could not download the logo. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt copied to clipboard.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy the prompt.");
    }
  }

  return (
    <div className="animate-pop-in rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mx-auto flex max-w-md justify-center overflow-hidden rounded-xl bg-surface p-3">
        <img
          src={imageUrl}
          alt={`Generated logo: ${prompt}`}
          className="h-auto w-full rounded-lg"
          width={width}
          height={height}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Badge variant="default">{styleLabel}</Badge>
        <Badge variant="secondary">
          {ratioLabel} ({width}x{height})
        </Badge>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button onClick={handleDownload} disabled={downloading} size="lg">
          {downloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {downloading ? "Preparing..." : "Download PNG"}
        </Button>
        <Button onClick={onRegenerate} variant="outline" size="lg">
          <RefreshCw className="h-5 w-5" />
          Make Again
        </Button>
        <Button onClick={handleCopy} variant="ghost" size="lg">
          {copied ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          {copied ? "Copied" : "Copy Prompt"}
        </Button>
      </div>
    </div>
  );
}
