"use client";

import { useI18n } from "@/components/locale-provider";
import { site } from "@/data/site";

export function PaymentSoon({
  slugs = [],
  className = "",
}: {
  slugs?: string[];
  className?: string;
}) {
  const { t } = useI18n();
  const subject = slugs.length ? `Vellum Press file request: ${slugs.join(", ")}` : "Vellum Press payment notification";
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div role="status" className={`rounded-xl border border-copper/50 bg-card px-4 py-4 text-sm leading-relaxed ${className}`}>
      <p>{t.checkout.closed}</p>
      <a
        href={mailto}
        className="mt-3 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
      >
        <bdi dir="ltr">{site.email}</bdi>
      </a>
    </div>
  );
}
