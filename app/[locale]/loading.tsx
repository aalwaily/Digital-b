"use client";

import { useI18n } from "@/components/locale-provider";

export default function LocaleLoading() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm text-muted-foreground">{t.loading}</p>
    </div>
  );
}
