"use client";

import { cn } from "cn";
import { useState, type ReactNode } from "react";

export function ProductGallery({
  cover,
  contents,
  worksheet,
  coverLabel,
  contentsLabel,
  worksheetLabel,
  galleryLabel,
  className = "",
}: {
  cover: ReactNode;
  contents: ReactNode;
  worksheet: ReactNode;
  coverLabel: string;
  contentsLabel: string;
  worksheetLabel: string;
  galleryLabel: string;
  className?: string;
}) {
  const panels = [
    { id: "cover" as const, label: coverLabel, panel: cover },
    { id: "contents" as const, label: contentsLabel, panel: contents },
    { id: "worksheet" as const, label: worksheetLabel, panel: worksheet },
  ];
  const [active, setActive] = useState<(typeof panels)[number]["id"]>("cover");

  return (
    <div className={cn("min-w-0", className)}>
      <div className="overflow-hidden rounded-2xl shadow-[0_24px_60px_-36px_rgba(28,24,18,0.8)] ring-1 ring-black/10 dark:ring-white/10">
        {panels.map((panel) => (
          <div key={panel.id} hidden={panel.id !== active}>
            {panel.panel}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label={galleryLabel}>
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            role="tab"
            aria-selected={active === panel.id}
            onClick={() => setActive(panel.id)}
            className={`inline-flex h-11 items-center rounded-full px-3 text-sm ${
              active === panel.id ? "bg-foreground text-background" : "bg-card ring-1 ring-border"
            }`}
          >
            {panel.label}
          </button>
        ))}
      </div>
    </div>
  );
}
