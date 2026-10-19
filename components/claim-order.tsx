"use client";

import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/components/locale-provider";
import { translateMessage } from "@/lib/i18n/messages";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ClaimOrder({ sessionId }: { sessionId: string }) {
  const cart = useCart();
  const router = useRouter();
  const { t, href, locale } = useI18n();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function claim() {
      try {
        const response = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = (await response.json()) as { error?: string; token?: string; slugs?: string[] };
        if (cancelled) return;
        if (!response.ok || !data.token) {
          setError(translateMessage(locale, data.error || "We could not confirm this payment."));
          return;
        }
        data.slugs?.forEach((slug) => cart.remove(slug));
        router.replace(href(`/orders/${data.token}`));
      } catch {
        if (!cancelled) setError(t.success.network);
      }
    }
    void claim();
    return () => {
      cancelled = true;
    };
  }, [cart, href, locale, router, sessionId, t.success.network]);

  if (error) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="font-serif text-2xl">{t.success.notConfirmed}</h2>
        <p role="alert" className="mt-2 text-sm text-muted-foreground">
          {error} {t.success.charged}
        </p>
      </div>
    );
  }

  return (
    <p role="status" className="text-sm text-muted-foreground">
      {t.success.confirming}
    </p>
  );
}
