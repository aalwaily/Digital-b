/** Arabic storefront display uses the SAR/USD peg. Checkout still charges USD. */
export const SAR_PER_USD = 3.75;

export function sarAmount(usd: number) {
  return Math.round(usd * SAR_PER_USD * 100) / 100;
}

export function formatSar(usd: number) {
  const amount = sarAmount(usd);
  const text = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${text} ر.س`;
}
