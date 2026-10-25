import { CartView } from "@/components/cart-view";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return pageMetadata({
    title: t.cartPage.metaTitle,
    description: t.cartPage.metaDescription,
    path: "/cart",
    locale,
    index: false,
  });
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return (
    <div className="mx-auto min-w-0 max-w-6xl px-5 py-12">
      <h1 className="font-serif text-4xl">{t.cartPage.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.cartPage.lede}</p>
      <div className="mt-8 min-w-0">
        <CartView />
      </div>
    </div>
  );
}
