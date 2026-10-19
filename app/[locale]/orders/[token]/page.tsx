import { ClearPurchased } from "@/components/clear-purchased";
import { Cover } from "@/components/cover";
import { LinkButton } from "@/components/link-button";
import { OrderTools } from "@/components/order-tools";
import { Price } from "@/components/price";
import { PurchaseEvent } from "@/components/purchase-event";
import { analyticsEnabled, readAnalytics } from "@/lib/analytics";
import { verifyDownloadToken } from "@/lib/download-token";
import { privatePdfPath } from "@/lib/files";
import { formatLongDate, localizedProduct, requireLocale } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; token: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.receipt.metaTitle,
    description: t.receipt.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ demo?: string; paid?: string }>;
}) {
  const { token, locale: raw } = await params;
  const locale = requireLocale(raw);
  const t = getDictionary(locale);
  const query = await searchParams;
  const payload = verifyDownloadToken(token);

  if (!payload) {
    return (
      <div className="mx-auto min-w-0 max-w-3xl px-5 py-16">
        <h1 className="font-serif text-4xl">{t.receipt.expiredTitle}</h1>
        <p className="mt-3 text-muted-foreground">{t.receipt.expiredText}</p>
        <LinkButton href="/contact" className="mt-6 h-11 px-5">
          {t.receipt.contact}
        </LinkButton>
      </div>
    );
  }

  const expires = formatLongDate(new Date(payload.exp * 1000).toISOString(), locale);
  const showDemo = payload.demo || query.demo === "1";
  const analytics = readAnalytics();
  const orderValue = payload.items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.18em]">{t.receipt.eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl">{t.receipt.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.receipt.orderFor(payload.orderId, payload.email, expires)}</p>
      {locale === "ar" ? <p className="mt-3 text-sm text-muted-foreground">{t.receipt.englishPdf}</p> : null}
      {query.paid === "1" && !payload.demo ? <ClearPurchased slugs={payload.items.map((item) => item.slug)} /> : null}
      {!showDemo && analyticsEnabled(analytics) ? (
        <PurchaseEvent
          orderId={payload.orderId}
          value={orderValue}
          currency="USD"
          items={payload.items.map((item) => ({ slug: item.slug, title: item.title, price: item.price }))}
          analytics={analytics}
        />
      ) : null}
      {showDemo ? (
        <p className="mt-4 rounded-xl border border-copper/50 bg-card px-4 py-3 text-sm">{t.receipt.demo}</p>
      ) : (
        <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm">{t.receipt.paid}</p>
      )}
      <div className="mt-5">
        <OrderTools />
      </div>

      <h2 className="mt-10 font-serif text-2xl">{t.receipt.purchased}</h2>
      <ul className="mt-3 divide-y rounded-2xl border bg-card">
        {payload.items.map((item) => {
          const product = localizedProduct(item.slug, locale);
          return (
            <li key={item.slug} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="min-w-0">{product?.title ?? item.title}</span>
              <Price price={item.price} />
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-serif text-2xl">{t.receipt.downloads}</h2>
      <ul className="mt-4 space-y-4">
        {payload.files.map((slug) => {
          const product = localizedProduct(slug, locale);
          const available = Boolean(privatePdfPath(slug));
          return (
            <li key={slug} className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row sm:items-center">
              {product ? (
                <div className="w-16 shrink-0 overflow-hidden rounded-md">
                  <Cover product={product} decorative />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{product?.title ?? slug}</p>
                <p className="text-sm text-muted-foreground">{product?.subtitle}</p>
              </div>
              {available ? (
                <a
                  href={`/api/download/${token}/${slug}`}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  {t.receipt.download}
                </a>
              ) : (
                <span className="text-sm text-destructive">{t.receipt.missing}</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">{t.receipt.secret}</p>
    </div>
  );
}
