"use client";

import { useCart } from "@/components/cart-provider";
import { useEffect } from "react";

export function ClearPurchased({ slugs }: { slugs: string[] }) {
  const { ready, remove } = useCart();
  const key = slugs.join("\n");

  useEffect(() => {
    if (!ready) return;
    for (const slug of key.split("\n")) {
      if (slug) remove(slug);
    }
  }, [ready, remove, key]);

  return null;
}
