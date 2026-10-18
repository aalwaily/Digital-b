"use client";

import type { AnalyticsConfig } from "@/lib/analytics";
import { useEffect, useRef } from "react";

type PurchaseItem = {
  slug: string;
  title: string;
  price: number;
};

type PurchaseWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  ttq?: { track?: (event: string, payload?: unknown) => void };
};

export function PurchaseEvent({
  orderId,
  value,
  currency,
  items,
  analytics,
}: {
  orderId: string;
  value: number;
  currency: "USD";
  items: PurchaseItem[];
  analytics: AnalyticsConfig;
}) {
  const sent = useRef(false);

  useEffect(() => {
    const storageKey = `vellum-purchase-${orderId}`;
    if (sent.current || window.sessionStorage.getItem(storageKey)) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (sent.current) {
        window.clearInterval(timer);
        return;
      }
      const view = window as PurchaseWindow;
      const gaReady = !analytics.gaId || typeof view.gtag === "function";
      const metaReady = !analytics.metaPixelId || typeof view.fbq === "function";
      const tiktokReady = !analytics.tiktokPixelId || typeof view.ttq?.track === "function";
      if ((!gaReady || !metaReady || !tiktokReady) && attempts < 20) return;
      window.clearInterval(timer);
      if (!gaReady && !metaReady && !tiktokReady) return;
      sent.current = true;

      if (analytics.gaId && view.gtag) {
        view.gtag("event", "purchase", {
          transaction_id: orderId,
          value,
          currency,
          items: items.map((item) => ({
            item_id: item.slug,
            item_name: item.title,
            price: item.price,
            quantity: 1,
          })),
        });
      }
      if (analytics.metaPixelId && view.fbq) {
        view.fbq("track", "Purchase", {
          value,
          currency,
          content_ids: items.map((item) => item.slug),
          content_type: "product",
          contents: items.map((item) => ({ id: item.slug, quantity: 1, item_price: item.price })),
        });
      }
      if (analytics.tiktokPixelId && view.ttq?.track) {
        view.ttq.track("CompletePayment", {
          value,
          currency,
          contents: items.map((item) => ({
            content_id: item.slug,
            content_name: item.title,
            price: item.price,
            quantity: 1,
          })),
        });
      }
      window.sessionStorage.setItem(storageKey, "1");
    }, 250);

    return () => window.clearInterval(timer);
  }, [analytics.gaId, analytics.metaPixelId, analytics.tiktokPixelId, currency, items, orderId, value]);

  return null;
}
