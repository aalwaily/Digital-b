"use client";

import { getProduct } from "@/data/products";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vellum-cart-v1";

type CartContextValue = {
  slugs: string[];
  ready: boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSlugs(parsed.filter((slug): slug is string => typeof slug === "string" && Boolean(getProduct(slug))));
        }
      }
    } catch {
      // Ignore unreadable cart data and start empty.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [ready, slugs]);

  const add = useCallback((slug: string) => {
    if (!getProduct(slug)) return;
    setSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((item) => item !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({ slugs, ready, add, remove, clear, has }),
    [slugs, ready, add, remove, clear, has],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
