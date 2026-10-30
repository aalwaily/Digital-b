"use client";

import { useI18n } from "@/components/locale-provider";
import { site } from "@/data/site";
import Link from "next/link";

export function PaymentsClosed({
  slugs = [],
  className = "",
  compact = false,
}: {
  slugs?: string[];
  className?: string;
  /** Short note for a product card. The full note is used on product, cart, and checkout. */
  compact?: boolean;
}) {
  const { t, locale, href } = useI18n();
  const subject = slugs.length
    ? locale === "ar"
      ? `طلب ملف من Vellum Press: ${slugs.join(", ")}`
      : `Vellum Press file request: ${slugs.join(", ")}`
    : locale === "ar"
      ? "طلب ملف من Vellum Press"
      : "Vellum Press file request";
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

  if (compact) {
    return (
      <div data-payments-closed="" className={`text-xs leading-relaxed ${className}`}>
        <p>{t.product.paymentUnavailable}</p>
        <a href={mailto} className="mt-1 inline-flex min-h-11 min-w-11 items-center font-medium underline underline-offset-4">
          <bdi dir="ltr">{site.email}</bdi>
        </a>
        <Link href={href("/legal/refunds")} className="flex min-h-11 items-center underline underline-offset-4">
          {t.product.salesFinal}
        </Link>
      </div>
    );
  }

  return (
    <div
      role="status"
      data-payments-closed=""
      className={`rounded-xl border border-copper/50 bg-card px-4 py-4 text-sm leading-relaxed ${className}`}
    >
      <p>{t.checkout.closed}</p>
      <p className="mt-3">
        <Link href={href("/legal/refunds")} className="inline-flex min-h-11 items-center font-medium underline underline-offset-4">
          {t.checkout.final}
        </Link>
      </p>
      <a href={mailto} data-primary-cta="" className="inline-flex min-h-11 min-w-11 items-center font-medium underline underline-offset-4">
        <bdi dir="ltr">{site.email}</bdi>
      </a>
    </div>
  );
}
