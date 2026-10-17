import { ShopBrowser } from "@/components/shop-browser";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Vellum Press PDF guides and bundles. Filter by category, search, and sort.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Library</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Shop the guides</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Eight practical PDFs and two bundles. Every guide has a free sample, a table of contents, and a straight price.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading the library…</p>}>
          <ShopBrowser />
        </Suspense>
      </div>
    </div>
  );
}
