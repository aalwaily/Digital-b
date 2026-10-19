"use client";

import { useI18n } from "@/components/locale-provider";
import { formatMoney, formatSarAmount } from "@/lib/money";
import { cn } from "cn";

export function Price({
  price,
  compareAt,
  className,
  size = "md",
}: {
  price: number;
  compareAt?: number | null;
  className?: string;
  size?: "md" | "lg";
}) {
  const { t } = useI18n();
  const sar = formatSarAmount(price);

  return (
    <p className={cn("price flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-medium", size === "lg" && "font-serif text-3xl")}>{formatMoney(price)}</span>
      {compareAt && compareAt > price ? (
        <span className="text-sm text-muted-foreground line-through">{formatMoney(compareAt)}</span>
      ) : null}
      <span className="text-xs text-muted-foreground">
        {t.price.approx} {sar} {t.price.sar}
      </span>
    </p>
  );
}
