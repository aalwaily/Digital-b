"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function OrderTools() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="h-10"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Link copied" : "Copy receipt link"}
      </Button>
      <Button variant="outline" className="h-10" onClick={() => window.print()}>
        Print receipt
      </Button>
    </div>
  );
}
