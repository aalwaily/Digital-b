"use client";

import { Price } from "@/components/price";
import { PurchaseActions } from "@/components/purchase-actions";
import { useI18n } from "@/components/locale-provider";
import { cn } from "cn";
import { useEffect, useState } from "react";

export function ProductStickyBar({
  slug,
  price,
  compareAt,
  previousPrice,
}: {
  slug: string;
  price: number;
  compareAt?: number;
  previousPrice?: number;
}) {
  const { t, locale } = useI18n();
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const target = document.getElementById("product-purchase");
    if (!target) {
      setShow(true);
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setShow(!entry.isIntersecting);
      setReady(true);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-sticky-buy=""
      data-ready={ready ? "true" : "false"}
      aria-hidden={show ? undefined : true}
      className={cn(
        "safe-x fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden",
        show ? "" : "invisible pointer-events-none",
      )}
      role="region"
      aria-label={t.product.stickyBuy}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <Price
          price={price}
          compareAt={compareAt}
          previousPrice={previousPrice}
          locale={locale}
          size="bar"
          className="min-w-0 flex-1"
        />
        <div className="w-[46%] max-w-[11.5rem] shrink-0">
          <PurchaseActions slug={slug} mode="primary" />
        </div>
      </div>
    </div>
  );
}
