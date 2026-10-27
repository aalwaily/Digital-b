import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLdList } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { ShopBrowser } from "@/components/shop-browser";
import { bundles, guides } from "@/data/products";
import { shopListings } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/config";
import { requireLocale } from "@/lib/i18n/content";
import { pageJsonLd } from "@/lib/page-jsonld";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  return pageMetadata(publicMetadata(locale, "/shop")!);
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const listings = shopListings(locale);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-5 py-12">
      <JsonLdList data={pageJsonLd(locale, "/shop")} />
      <Breadcrumbs
        label={t.product.breadcrumb}
        locale={locale}
        items={[
          { href: localePath(locale, "/"), label: t.crumbs.home },
          { label: t.crumbs.shop },
        ]}
      />
      <p className="mt-6 text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.shop.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{t.shop.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.shop.lede(guides.length, bundles.length)}</p>
      <div className="mt-8 min-w-0">
        <ShopBrowser
          listings={listings}
          cards={Object.fromEntries(
            listings.map((entry) => [
              entry.product.slug,
              <ProductCard key={entry.product.slug} product={entry.product} locale={locale} />,
            ]),
          )}
        />
      </div>
    </div>
  );
}
