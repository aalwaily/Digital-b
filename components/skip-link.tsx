"use client";

import { useI18n } from "@/components/locale-provider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-md focus:bg-primary focus:px-3 focus:text-primary-foreground"
    >
      {t.skip}
    </a>
  );
}
