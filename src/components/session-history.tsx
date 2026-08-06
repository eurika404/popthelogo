"use client";

import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  styleLabel: string;
  ratioLabel: string;
  width: number;
  height: number;
  seed: number;
  createdAt: number;
}

interface SessionHistoryProps {
  items: HistoryItem[];
  activeId?: string | null;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export function SessionHistory({
  items,
  activeId,
  onSelect,
  onClear,
}: SessionHistoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <History className="h-4 w-4 text-brand" />
          Session history
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>
      <p className="mb-3 text-xs text-muted">
        Saved in this browser only. Clears when you close the tab.
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all hover:-translate-y-0.5",
              activeId === item.id
                ? "border-brand ring-2 ring-brand/30"
                : "border-line",
            )}
            title={item.prompt}
            aria-label={`Show logo: ${item.prompt}`}
          >
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="h-20 w-20 object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
