"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function OrderTools() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="h-11"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? t.receipt.copied : t.receipt.copy}
      </Button>
      <Button variant="outline" className="h-11" onClick={() => window.print()}>
        {t.receipt.print}
      </Button>
    </div>
  );
}
