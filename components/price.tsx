import { formatMoney } from "@/lib/money";
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
  return (
    <p className={cn("price flex items-baseline gap-2", className)}>
      <span className={cn("font-medium", size === "lg" && "font-serif text-3xl")}>{formatMoney(price)}</span>
      {compareAt && compareAt > price ? (
        <span className="text-sm text-muted-foreground line-through">{formatMoney(compareAt)}</span>
      ) : null}
    </p>
  );
}
