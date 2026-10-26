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
    <nav aria-label={label} className="flex h-11 min-w-0 items-center gap-1 overflow-hidden text-sm text-muted-foreground">
      {items.map((item, index) => {
        const dir = textDir(item.label);
        const current = !item.href;
        return (
          <span key={`${index}-${item.href ?? item.label}`} className={`inline-flex min-w-0 items-center gap-1 ${current ? "flex-1" : "shrink-0"}`}>
            {index > 0 ? <Separator aria-hidden className="size-3.5 shrink-0 opacity-60" /> : null}
            {item.href ? (
              <Link href={item.href} dir={dir} className="inline-flex h-11 shrink-0 items-center hover:underline">
                {item.label}
              </Link>
            ) : (
              <span dir={dir} className="min-w-0 truncate text-foreground">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
