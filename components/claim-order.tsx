"use client";

import { useCart } from "@/components/cart-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ClaimOrder({ sessionId }: { sessionId: string }) {
  const cart = useCart();
  const router = useRouter();
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
          setError(data.error || "We could not confirm this payment.");
          return;
        }
        data.slugs?.forEach((slug) => cart.remove(slug));
        router.replace(`/orders/${data.token}`);
      } catch {
        if (!cancelled) setError("Network error while confirming payment.");
      }
    }
    void claim();
    return () => {
      cancelled = true;
    };
  }, [cart, router, sessionId]);

  if (error) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="font-serif text-2xl">Payment not confirmed</h2>
        <p role="alert" className="mt-2 text-sm text-muted-foreground">
          {error} If you were charged, email support with the time of the payment and we will match it.
        </p>
      </div>
    );
  }

  return (
    <p role="status" className="text-sm text-muted-foreground">
      Confirming your payment and preparing the downloads…
    </p>
  );
}
