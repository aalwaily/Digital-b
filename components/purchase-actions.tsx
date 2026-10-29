"use client";

import { useCart } from "@/components/cart-provider";
import { useCheckoutOptions } from "@/components/checkout-options";
import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PurchaseActions({
  slug,
  className = "",
  row = false,
  hint = false,
  mode = "full",
}: {
  slug: string;
  className?: string;
  row?: boolean;
  hint?: boolean;
  /** full: add to cart, plus buy now when checkout is open. primary: one button for a tight bar. */
  mode?: "full" | "primary";
}) {
  const cart = useCart();
  const router = useRouter();
  const { t, href } = useI18n();
  const { open } = useCheckoutOptions();
  const inCart = cart.has(slug);
  const [added, setAdded] = useState(false);
  const showCart = mode === "full" || !open;
  const showBuy = open && (mode === "full" || mode === "primary");

  return (
    <div className={className}>
      <div className={`flex w-full min-w-0 gap-2 ${mode === "full" && row && open ? "flex-row" : "flex-col sm:flex-row"}`}>
        {showBuy ? (
          <Button
            className="wrap-button h-auto min-h-11 w-full flex-1 px-4 py-2"
            onClick={() => {
              router.push(href(`/checkout?buy=${slug}`));
            }}
          >
            {t.product.buyNow}
          </Button>
        ) : null}
        {showCart ? (
          <Button
            variant={showBuy ? "outline" : "default"}
            className="wrap-button h-auto min-h-11 w-full flex-1 px-4 py-2"
            onClick={() => {
              cart.add(slug);
              setAdded(true);
            }}
          >
            {inCart || added ? <Check /> : <ShoppingBag />}
            {inCart || added ? t.product.inCart : t.product.add}
          </Button>
        ) : null}
      </div>
      {!open && hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.product.paymentUnavailable}</p> : null}
    </div>
  );
}
