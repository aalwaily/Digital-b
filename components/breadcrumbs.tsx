import { textDir } from "@/lib/i18n/bidi";
import type { Locale } from "@/lib/i18n/config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({
  label,
  locale,
  items,
}: {
  label: string;
  locale: Locale;
  items: { href?: string; label: string }[];
}) {
  const Separator = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label={label} className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const dir = textDir(item.label);
        return (
          <span key={`${index}-${item.href ?? item.label}`} className="inline-flex min-w-0 max-w-full items-center gap-1">
            {index > 0 ? <Separator aria-hidden className="size-3.5 shrink-0 opacity-60" /> : null}
            {item.href ? (
              <Link href={item.href} dir={dir} className="inline-flex min-h-11 items-center hover:underline">
                {item.label}
              </Link>
            ) : (
              <span dir={dir} className="min-w-0 break-words text-foreground">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
