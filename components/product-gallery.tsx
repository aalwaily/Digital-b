"use client";

import { ContentsPlate, Cover, WorksheetPlate } from "@/components/cover";
import { useI18n } from "@/components/locale-provider";
import type { Product } from "@/data/products";
import { cn } from "cn";
import { useState } from "react";

export function ProductGallery({ product, className = "" }: { product: Product; className?: string }) {
  const { t } = useI18n();
  const panels = [
    { id: "cover" as const, label: t.product.cover },
    { id: "contents" as const, label: t.product.contentsTab },
    { id: "worksheet" as const, label: t.product.worksheet },
  ];
  const [active, setActive] = useState<(typeof panels)[number]["id"]>("cover");

  return (
    <div className={cn("min-w-0", className)}>
      <div className="overflow-hidden rounded-2xl shadow-[0_24px_60px_-36px_rgba(28,24,18,0.8)] ring-1 ring-black/10 dark:ring-white/10">
        {active === "cover" ? <Cover product={product} /> : null}
        {active === "contents" ? <ContentsPlate product={product} /> : null}
        {active === "worksheet" ? <WorksheetPlate product={product} /> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label={t.product.gallery}>
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
