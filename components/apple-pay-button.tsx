"use client";

import {
  applePayJsSdkUrl,
  applePaySheetTotal,
  formatApplePayAmount,
  isPayPalApplePaySdkUrl,
  shouldShowApplePayButton,
} from "@/lib/apple-pay";
import { site } from "@/data/site";
import { isEmail } from "@/lib/email";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type ApplePayConfigResult = {
  isEligible?: boolean;
  countryCode?: string;
  merchantCapabilities?: string[];
  supportedNetworks?: string[];
};

type PayPalApplePayApi = {
  config: () => Promise<ApplePayConfigResult>;
  validateMerchant: (input: { validationUrl: string; displayName?: string }) => Promise<{ merchantSession: unknown }>;
  confirmOrder: (input: {
    orderId: string;
    token: unknown;
    billingContact?: unknown;
    shippingContact?: unknown;
  }) => Promise<unknown>;
};

type ApplePaySessionInstance = {
  begin: () => void;
  abort: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized:
    | ((event: { payment: { token: unknown; billingContact?: unknown; shippingContact?: unknown } }) => void)
    | null;
  oncancel: (() => void) | null;
};

type ApplePaySessionConstructor = {
  new (version: number, request: unknown): ApplePaySessionInstance;
  canMakePayments: () => boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
};

type SheetItem = { label: string; amount: number };

type Props = {
  email: string;
  slugs: string[];
  amount: number;
  items: SheetItem[];
  disabled: boolean;
  onPaid: (token: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
  onBusy: (busy: boolean) => void;
};

function loadScript(src: string, marker: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-sdk="${marker}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("script")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.sdk = marker;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("script"));
    document.head.appendChild(script);
  });
}

function applePaySessionType() {
  return (window as Window & { ApplePaySession?: ApplePaySessionConstructor }).ApplePaySession ?? null;
}

function paypalApplePay() {
  const paypal = (window as Window & { paypal?: { Applepay?: () => PayPalApplePayApi } }).paypal;
  if (!paypal?.Applepay) return null;
  return paypal.Applepay();
}

export function ApplePayButton({ email, slugs, amount, items, disabled, onPaid, onError, onCancel, onBusy }: Props) {
  const { resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const applePayRef = useRef<PayPalApplePayApi | null>(null);
  const configRef = useRef<ApplePayConfigResult | null>(null);
  const detailsRef = useRef({ email, slugs, amount, items });
  const handlersRef = useRef({ onPaid, onError, onCancel, onBusy, disabled });
  detailsRef.current = { email, slugs, amount, items };
  handlersRef.current = { onPaid, onError, onCancel, onBusy, disabled };
  const buttonStyle = resolvedTheme === "dark" ? "white-outline" : "black";

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      const Session = applePaySessionType();
      if (!Session) return;
      let canPay = false;
      try {
        canPay = Session.canMakePayments();
      } catch {
        return;
      }
      if (!canPay) return;

      const configResponse = await fetch("/api/paypal/config");
      if (!configResponse.ok) return;
      const config = (await configResponse.json()) as { sdkUrl?: unknown };
      if (typeof config.sdkUrl !== "string" || !isPayPalApplePaySdkUrl(config.sdkUrl)) return;

      await Promise.all([
        loadScript(config.sdkUrl, "paypal-applepay"),
        loadScript(applePayJsSdkUrl(), "apple-pay-js"),
      ]);
      if (cancelled) return;

      const applepay = paypalApplePay();
      if (!applepay) return;
      const appleConfig = await applepay.config();
      if (cancelled) return;
      const show = shouldShowApplePayButton({
        hasApplePaySession: Boolean(applePaySessionType()),
        canMakePayments: canPay,
        isEligible: appleConfig.isEligible === true,
      });
      if (
        !show ||
        !appleConfig.countryCode ||
        !appleConfig.merchantCapabilities?.length ||
        !appleConfig.supportedNetworks?.length
      ) {
        return;
      }
      applePayRef.current = applepay;
      configRef.current = appleConfig;
      setReady(true);
    }

    prepare().catch(() => {
      // Hide Apple Pay. Card and PayPal checkout stay on the page.
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!ready || !host) return;
    host.replaceChildren();
    const button = document.createElement("apple-pay-button");
    button.setAttribute("buttonstyle", buttonStyle);
    button.setAttribute("type", "buy");
    button.setAttribute("locale", "en");
    button.id = "apple-pay-buy";
    const onClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      startApplePay();
    };
    button.addEventListener("click", onClick);
    host.appendChild(button);
    return () => {
      button.removeEventListener("click", onClick);
      host.replaceChildren();
    };
  }, [ready, buttonStyle]);

  if (!ready) return null;

  return (
    <div ref={hostRef} className="apple-pay-host" style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined} />
  );

  function startApplePay() {
    const handlers = handlersRef.current;
    if (handlers.disabled) return;
    const Session = applePaySessionType();
    const applepay = applePayRef.current;
    const appleConfig = configRef.current;
    const details = detailsRef.current;
    if (
      !Session ||
      !applepay ||
      !appleConfig?.countryCode ||
      !appleConfig.merchantCapabilities ||
      !appleConfig.supportedNetworks
    ) {
      handlers.onError("Apple Pay is not available in this browser.");
      return;
    }
    if (!isEmail(details.email.trim())) {
      handlers.onError("Enter a valid email address.");
      return;
    }

    const total = applePaySheetTotal({ label: site.name, amount: details.amount });
    if (!total) {
      handlers.onError("Apple Pay could not be started.");
      return;
    }
    const lineItems = details.items.flatMap((item) => {
      const value = formatApplePayAmount(item.amount);
      return value ? [{ label: item.label.slice(0, 64), amount: value, type: "final" as const }] : [];
    });
    const lineSum = lineItems.reduce((sum, item) => sum + Math.round(Number(item.amount) * 100), 0);
    const totalCents = Math.round(Number(total.amount) * 100);
    const paymentRequest = {
      countryCode: appleConfig.countryCode,
      currencyCode: "USD",
      merchantCapabilities: appleConfig.merchantCapabilities,
      supportedNetworks: appleConfig.supportedNetworks,
      requiredShippingContactFields: [] as string[],
      requiredBillingContactFields: ["postalAddress"],
      total,
      ...(lineItems.length > 0 && lineSum === totalCents ? { lineItems } : {}),
    };

    let session: ApplePaySessionInstance;
    try {
      session = new Session(4, paymentRequest);
    } catch {
      handlers.onError("Apple Pay requires Safari over HTTPS on a registered domain.");
      return;
    }

    let settled = false;
    handlers.onBusy(true);

    const fail = (message: string, close: "abort" | "failure") => {
      if (settled) return;
      settled = true;
      try {
        if (close === "abort") session.abort();
        else session.completePayment(Session.STATUS_FAILURE);
      } catch {
        // The sheet may already be closed.
      }
      handlers.onBusy(false);
      handlers.onError(message);
    };

    session.onvalidatemerchant = (event) => {
      applepay
        .validateMerchant({ validationUrl: event.validationURL, displayName: site.name })
        .then((result) => {
          session.completeMerchantValidation(result.merchantSession);
        })
        .catch(() => {
          fail("Apple Pay could not verify this site. Nothing was charged.", "abort");
        });
    };

    session.onpaymentauthorized = (event) => {
      void (async () => {
        try {
          const createdResponse = await fetch("/api/paypal/applepay/order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: details.email.trim(), slugs: details.slugs }),
          });
          const created = (await createdResponse.json()) as { id?: string; state?: string; error?: string };
          if (!createdResponse.ok || !created.id || !created.state) {
            throw new Error("order");
          }
          await applepay.confirmOrder({
            orderId: created.id,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
            shippingContact: event.payment.shippingContact,
          });
          const captureResponse = await fetch("/api/paypal/applepay/capture", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId: created.id, state: created.state }),
          });
          const captured = (await captureResponse.json()) as { token?: string };
          if (!captureResponse.ok || !captured.token) {
            throw new Error("capture");
          }
          if (settled) return;
          settled = true;
          try {
            session.completePayment(Session.STATUS_SUCCESS);
          } catch {
            // The capture is already verified. Still open the receipt.
          }
          handlers.onPaid(captured.token);
        } catch {
          fail(
            "Apple Pay could not be confirmed, so the downloads were not released. If PayPal shows a completed payment, email support with the time of the charge.",
            "failure",
          );
        }
      })();
    };

    session.oncancel = () => {
      if (settled) return;
      settled = true;
      handlers.onBusy(false);
      handlers.onCancel();
    };

    try {
      session.begin();
    } catch {
      fail("Apple Pay could not be started.", "abort");
    }
  }
}
