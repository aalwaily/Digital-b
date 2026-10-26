"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-serif text-4xl">{t.error.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.error.text}</p>
      <Button className="mt-6 h-11 px-5" onClick={() => reset()}>
        {t.error.retry}
      </Button>
    </div>
  );
}
