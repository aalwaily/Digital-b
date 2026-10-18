import { ClearPurchased } from "@/components/clear-purchased";
import { Cover } from "@/components/cover";
import { OrderTools } from "@/components/order-tools";
import { PurchaseEvent } from "@/components/purchase-event";
import { LinkButton } from "@/components/link-button";
import { analyticsEnabled, readAnalytics } from "@/lib/analytics";
import { verifyDownloadToken } from "@/lib/download-token";
import { privatePdfPath } from "@/lib/files";
import { formatMoney } from "@/lib/money";
import { getProduct } from "@/data/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your downloads",
  description: "Receipt and PDF downloads for a Vellum Press order.",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ demo?: string; paid?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const payload = verifyDownloadToken(token);

  if (!payload) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-4xl">This link has expired</h1>
        <p className="mt-3 text-muted-foreground">
          The signature is invalid or the download window has closed. Email support from the address you used at checkout and include your order id if you still have it.
        </p>
        <LinkButton href="/contact" className="mt-6 h-11 px-5">
          Contact support
        </LinkButton>
      </div>
    );
  }

  const expires = new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(payload.exp * 1000));
  const showDemo = payload.demo || query.demo === "1";
  const analytics = readAnalytics();
  const orderValue = payload.items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Receipt</p>
      <h1 className="mt-2 font-serif text-4xl">Your guides are ready</h1>
      <p className="mt-3 text-muted-foreground">
        Order {payload.orderId} for {payload.email}. Save the PDFs. This link expires on {expires}.
      </p>
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
        <p className="mt-4 rounded-xl border border-copper/50 bg-card px-4 py-3 text-sm">
          Demo order. No payment was collected. PayPal is not configured, so this receipt is for trying the download flow.
        </p>
      ) : (
        <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm">Payment confirmed. Thank you.</p>
      )}
      <div className="mt-5">
        <OrderTools />
      </div>

      <h2 className="mt-10 font-serif text-2xl">Purchased</h2>
      <ul className="mt-3 divide-y rounded-2xl border bg-card">
        {payload.items.map((item) => (
          <li key={item.slug} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{item.title}</span>
            <span className="price">{formatMoney(item.price)}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-serif text-2xl">Downloads</h2>
      <ul className="mt-4 space-y-4">
        {payload.files.map((slug) => {
          const product = getProduct(slug);
          const available = Boolean(privatePdfPath(slug));
          return (
            <li key={slug} className="flex items-center gap-4 rounded-2xl border bg-card p-3">
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
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
                >
                  Download
                </a>
              ) : (
                <span className="text-sm text-destructive">File missing</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">
        The download URL checks a signature before it sends the file. Treat this page like a receipt you do not post in public.
      </p>
    </div>
  );
}
