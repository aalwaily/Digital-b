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
}: {
  slug: string;
  className?: string;
  row?: boolean;
  hint?: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const { t, href } = useI18n();
  const { open } = useCheckoutOptions();
  const inCart = cart.has(slug);
  const [added, setAdded] = useState(false);

  return (
    <div className={className}>
      <div className={`flex w-full min-w-0 gap-2 ${row && open ? "flex-row" : "flex-col sm:flex-row"}`}>
        <Button
          className="wrap-button h-auto min-h-11 w-full flex-1 px-4 py-2"
          onClick={() => {
            cart.add(slug);
            setAdded(true);
          }}
        >
          {inCart || added ? <Check /> : <ShoppingBag />}
          {inCart || added ? t.product.inCart : t.product.add}
        </Button>
        {open ? (
          <Button
            variant="outline"
            className="wrap-button h-auto min-h-11 w-full flex-1 px-4 py-2"
            onClick={() => {
              router.push(href(`/checkout?buy=${slug}`));
            }}
          >
            {t.product.buyNow}
          </Button>
        ) : null}
      </div>
      {!open && hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.product.paymentSoon}</p> : null}
    </div>
  );
}
