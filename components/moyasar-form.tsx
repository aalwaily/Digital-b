"use client";

import {
  MOYASAR_APPLE_PAY_VALIDATE_URL,
  MOYASAR_FORM_CSS,
  MOYASAR_FORM_JS,
  type MoyasarFormConfig,
} from "@/lib/moyasar-amount";
import { useEffect, useState } from "react";

type MoyasarInit = {
  init: (config: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Moyasar?: MoyasarInit;
  }
}

function loadStylesheet() {
  const id = "moyasar-form-css";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = MOYASAR_FORM_CSS;
  document.head.appendChild(link);
}

function loadScript() {
  if (window.Moyasar) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${MOYASAR_FORM_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Moyasar form failed to load.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = MOYASAR_FORM_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Moyasar form failed to load."));
    document.body.appendChild(script);
  });
}

export function MoyasarForm({ config }: { config: MoyasarFormConfig }) {
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const element = document.getElementById("vellum-moyasar-form");
    if (element) element.replaceChildren();

    loadStylesheet();
    loadScript()
      .then(() => {
        if (cancelled || !window.Moyasar) return;
        window.Moyasar.init({
          element: "#vellum-moyasar-form",
          amount: config.amount,
          currency: config.currency,
          description: config.description,
          publishable_api_key: config.publishableKey,
          callback_url: config.callbackUrl,
          methods: [...config.methods],
          supported_networks: [...config.supportedNetworks],
          language: "en",
          fixed_width: false,
          metadata: config.metadata,
          apple_pay: {
            country: config.applePay.country,
            label: config.applePay.label,
            validate_merchant_url: config.applePay.validateMerchantUrl || MOYASAR_APPLE_PAY_VALIDATE_URL,
          },
          on_initiating: async () => ({ amount: config.amount, callback_url: config.callbackUrl }),
          on_failure: async (message: unknown) => {
            if (cancelled) return;
            setError(typeof message === "string" && message ? message : "The payment was not completed.");
          },
        });
      })
      .catch(() => {
        if (!cancelled) setError("The Moyasar payment form could not be loaded. Try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [config]);

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <p className="text-sm font-medium">
        You will pay {config.amountLabel}
        <span className="mt-1 block text-xs font-normal text-muted-foreground" lang="ar" dir="rtl">
          المبلغ بالريال السعودي قبل الدفع
        </span>
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        mada, Visa, and Mastercard use the card form. Apple Pay and STC Pay appear when this browser and your Moyasar
        account support them. Card details go to Moyasar, not to Vellum Press.
      </p>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div id="vellum-moyasar-form" className="mysr-form min-h-24" />
    </div>
  );
}
