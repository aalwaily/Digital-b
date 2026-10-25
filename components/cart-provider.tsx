"use client";

import { getProduct } from "@/data/products";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "vellum-cart-v1";
const EMPTY: string[] = [];

type CartContextValue = {
  slugs: string[];
  ready: boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

let cached = EMPTY;

function same(left: string[], right: string[]) {
  return left.length === right.length && left.every((slug, index) => slug === right[index]);
}

function parse(raw: string | null) {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const slugs = parsed.filter((slug): slug is string => typeof slug === "string" && Boolean(getProduct(slug)));
    return slugs.length === 0 ? EMPTY : slugs;
  } catch {
    return EMPTY;
  }
}

function read() {
  const next = parse(localStorage.getItem(STORAGE_KEY));
  if (same(cached, next)) return cached;
  cached = next;
  return cached;
}

function commit(next: string[]) {
  cached = next.length === 0 ? EMPTY : next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  window.dispatchEvent(new Event("vellum-cart"));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("vellum-cart", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vellum-cart", callback);
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const slugs = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((slug: string) => {
    if (!getProduct(slug)) return;
    const current = read();
    if (current.includes(slug)) return;
    commit([...current, slug]);
  }, []);

  const remove = useCallback((slug: string) => {
    const current = read();
    if (!current.includes(slug)) return;
    commit(current.filter((item) => item !== slug));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({ slugs, ready: true, add, remove, clear, has }),
    [slugs, add, remove, clear, has],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
