"use client";

import { languageAlternate } from "@/lib/locale-path";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const alternate = languageAlternate(pathname);
  return (
    <Link
      href={alternate.href}
      hrefLang={alternate.lang}
      lang={alternate.lang}
      className={`rounded-lg px-2 py-1 text-sm hover:bg-muted hover:text-copper ${className}`}
    >
      {alternate.label}
    </Link>
  );
}
