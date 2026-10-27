export const USD_TO_SAR_PEG = 3.75;

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** The struck-through amount the price line actually shows, if any. */
export function struckPrice(price: number, previousPrice?: number | null, compareAt?: number | null) {
  const halfOff =
    previousPrice != null && previousPrice > price && Math.round(previousPrice * 100) === Math.round(price * 200);
  if (halfOff) return previousPrice;
  if (compareAt != null && compareAt > price) return compareAt;
  return null;
}

export function approximateSar(amountUsd: number) {
  return Math.round(amountUsd * USD_TO_SAR_PEG * 100) / 100;
}

export function formatSarAmount(amountUsd: number) {
  const sar = approximateSar(amountUsd);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(sar) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(sar);
}
