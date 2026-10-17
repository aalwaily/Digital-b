"use client";

import { ContentsPlate, Cover, WorksheetPlate } from "@/components/cover";
import type { Product } from "@/data/products";
import { useState } from "react";

const panels = [
  { id: "cover", label: "Cover" },
  { id: "contents", label: "Contents" },
  { id: "worksheet", label: "Worksheet" },
] as const;

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof panels)[number]["id"]>("cover");

  return (
    <div>
      <div className="overflow-hidden rounded-2xl shadow-[0_24px_60px_-36px_rgba(28,24,18,0.8)] ring-1 ring-black/10 dark:ring-white/10">
        {active === "cover" ? <Cover product={product} /> : null}
        {active === "contents" ? <ContentsPlate product={product} /> : null}
        {active === "worksheet" ? <WorksheetPlate product={product} /> : null}
      </div>
      <div className="mt-3 flex gap-2" role="tablist" aria-label="Product images">
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            role="tab"
            aria-selected={active === panel.id}
            onClick={() => setActive(panel.id)}
            className={`h-10 rounded-full px-3 text-sm ${
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
