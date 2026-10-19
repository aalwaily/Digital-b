export const USD_TO_SAR_PEG = 3.75;

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
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
