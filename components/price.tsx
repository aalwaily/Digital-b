"use client";

import { useI18n } from "@/components/locale-provider";
import { formatMoney, formatSarAmount } from "@/lib/money";
import { cn } from "cn";

function isExactHalf(price: number, previous: number) {
  return Math.round(previous * 100) === Math.round(price * 200);
}

export function Price({
  price,
  compareAt,
  previousPrice,
  className,
  size = "md",
}: {
  price: number;
  compareAt?: number | null;
  previousPrice?: number | null;
  className?: string;
  size?: "md" | "lg" | "bar";
}) {
  const { t } = useI18n();
  const sar = formatSarAmount(price);
  const halfOff = previousPrice != null && previousPrice > price && isExactHalf(price, previousPrice);
  const struck = halfOff ? previousPrice : compareAt && compareAt > price ? compareAt : null;

  return (
    <p className={cn("price flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        dir="ltr"
        className={cn(
          "font-medium whitespace-nowrap",
          size === "lg" && "font-serif text-3xl",
          size === "bar" && "text-lg font-semibold",
        )}
      >
        {formatMoney(price)}
      </span>
      {struck ? (
        <span dir="ltr" className="whitespace-nowrap text-sm text-muted-foreground line-through">
          {formatMoney(struck)}
        </span>
      ) : null}
      {halfOff ? <span className="text-xs font-medium tracking-wide text-copper">{t.price.halfOff}</span> : null}
      {size === "bar" ? null : (
        <span className="text-xs text-muted-foreground">
          {t.price.approx} <span dir="ltr" className="whitespace-nowrap">{sar}</span> {t.price.sar}
        </span>
      )}
    </p>
  );
}
