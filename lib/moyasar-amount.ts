export const MOYASAR_API_BASE = "https://api.moyasar.com/v1";
export const MOYASAR_CURRENCY = "SAR";
export const MOYASAR_FORM_JS =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.3.0/dist/moyasar.umd.js";
export const MOYASAR_FORM_CSS =
  "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.3.0/dist/moyasar.css";
export const MOYASAR_APPLE_PAY_VALIDATE_URL = `${MOYASAR_API_BASE}/applepay/initiate`;
export const MOYASAR_METHODS = ["creditcard", "applepay", "stcpay"] as const;
export const MOYASAR_NETWORKS = ["mada", "visa", "mastercard"] as const;
export const DEFAULT_USD_TO_SAR_RATE = "3.75";
export const MOYASAR_MIN_HALALAS = 100;

const RATE_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/;

export class MoyasarAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoyasarAmountError";
  }
}

export type MoyasarFormConfig = {
  publishableKey: string;
  amount: number;
  currency: typeof MOYASAR_CURRENCY;
  amountLabel: string;
  description: string;
  callbackUrl: string;
  methods: typeof MOYASAR_METHODS;
  supportedNetworks: typeof MOYASAR_NETWORKS;
  applePay: {
    country: "SA";
    label: string;
    validateMerchantUrl: string;
  };
  metadata: {
    email: string;
    slugs: string;
  };
};

/** The official USD/SAR peg, unless USD_TO_SAR_RATE sets another positive rate. */
export function readUsdToSarRate(raw: string | undefined | null = process.env.USD_TO_SAR_RATE): string {
  if (raw == null || raw.trim() === "") return DEFAULT_USD_TO_SAR_RATE;
  const value = raw.trim();
  if (!RATE_PATTERN.test(value) || Number(value) <= 0) {
    throw new MoyasarAmountError("USD_TO_SAR_RATE must be a positive number with up to 6 decimal places.");
  }
  return value;
}

export function tryUsdToSarRate(raw: string | undefined | null = process.env.USD_TO_SAR_RATE) {
  try {
    return readUsdToSarRate(raw);
  } catch {
    return null;
  }
}

/** Convert a USD catalog amount into Moyasar halalas (1 SAR = 100 halalas). */
export function usdToHalalas(usd: number, rateInput?: string): number {
  if (!Number.isFinite(usd) || usd <= 0) {
    throw new MoyasarAmountError("USD amount must be positive.");
  }
  const cents = Math.round(usd * 100);
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new MoyasarAmountError("USD amount must be positive.");
  }
  const rate = readUsdToSarRate(rateInput);
  const halalas = multiplyCentsByRate(cents, rate);
  if (!Number.isSafeInteger(halalas) || halalas < MOYASAR_MIN_HALALAS) {
    throw new MoyasarAmountError("Moyasar requires a charge of at least 1.00 SAR.");
  }
  return halalas;
}

function multiplyCentsByRate(cents: number, rate: string) {
  const [whole, fraction = ""] = rate.split(".");
  const scale = 10 ** fraction.length;
  const rateScaled = Number(whole) * scale + Number(fraction || "0");
  const product = cents * rateScaled;
  if (!Number.isSafeInteger(product)) {
    throw new MoyasarAmountError("SAR amount is too large.");
  }
  return Math.round(product / scale);
}

export function formatSarHalalas(halalas: number) {
  if (!Number.isInteger(halalas) || halalas < 0) {
    throw new MoyasarAmountError("Invalid SAR amount.");
  }
  const major = Math.floor(halalas / 100);
  const minor = String(halalas % 100).padStart(2, "0");
  return `SAR ${major}.${minor}`;
}
