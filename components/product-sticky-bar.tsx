"use client";

import { Price } from "@/components/price";
import { PurchaseActions } from "@/components/purchase-actions";
import { useI18n } from "@/components/locale-provider";

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
  const { t } = useI18n();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-3 pt-2 ps-[max(0.75rem,env(safe-area-inset-left))] pe-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
      role="region"
      aria-label={t.product.stickyBuy}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <Price
          price={price}
          compareAt={compareAt}
          previousPrice={previousPrice}
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
