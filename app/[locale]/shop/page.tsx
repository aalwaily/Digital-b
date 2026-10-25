import { ShopBrowser } from "@/components/shop-browser";
import { bundles, guides } from "@/data/products";
import { shopListings } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { staticSeo } from "@/data/page-seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const seo = staticSeo.shop;
  return pageMetadata({
    title: locale === "ar" ? getDictionary(locale).shop.metaTitle : seo.title,
    description: locale === "ar" ? getDictionary(locale).shop.metaDescription : seo.description,
    path: "/shop",
    locale,
    absoluteTitle: locale === "en",
  });
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const listings = shopListings(locale);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.shop.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.shop.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.shop.lede(guides.length, bundles.length)}</p>
      <div className="mt-8 min-w-0">
        <ShopBrowser listings={listings} />
      </div>
    </div>
  );
}
