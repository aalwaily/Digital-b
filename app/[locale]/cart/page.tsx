import { CartView } from "@/components/cart-view";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.cartPage.metaTitle,
    description: t.cartPage.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ canceled?: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const { canceled } = await searchParams;
  return (
    <div className="mx-auto min-w-0 max-w-6xl px-5 py-12">
      <h1 className="font-serif text-4xl">{t.cartPage.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.cartPage.lede}</p>
      <div className="mt-8 min-w-0">
        <CartView canceled={canceled === "1"} />
      </div>
    </div>
  );
}
