"use client";

import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/components/locale-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const MobileMenu = dynamic(() => import("@/components/mobile-menu").then((mod) => mod.MobileMenu), { ssr: false });

export function SiteHeader() {
  const cart = useCart();
  const { t, href, locale, switchTo, alternateHref } = useI18n();
  const [open, setOpen] = useState(false);
  const count = cart.ready ? cart.slugs.length : 0;
  const other = locale === "ar" ? "en" : "ar";
  const items = [
    { href: "/shop", label: t.nav.shop },
    { href: "/blog", label: t.nav.journal },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-3 sm:gap-3 sm:px-5">
        <Link
          href={href("/")}
          dir="ltr"
          className="me-1 inline-flex h-11 min-w-0 items-center truncate font-serif text-lg tracking-tight sm:text-xl"
        >
          <span>
            Vellum <span className="text-copper">Press</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label={t.navPrimary}>
          {items.map((item) => (
            <Link key={item.href} href={href(item.href)} className="inline-flex h-11 items-center hover:text-copper">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-0.5 sm:gap-1">
          <a
            href={alternateHref}
            hrefLang={other}
            lang={other}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm font-medium hover:bg-muted"
            aria-label={`${t.switchTo}, ${t.switchToLabel}`}
            onClick={(event) => {
              event.preventDefault();
              switchTo(other);
            }}
          >
            {t.switchTo}
          </a>
          <ThemeToggle label={locale === "ar" ? { light: t.themeLight, dark: t.themeDark } : undefined} />
          <Link
            href={href("/cart")}
            className="relative inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted"
            aria-label={count ? t.cartCount(count) : t.cart}
          >
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute top-1 end-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <Button
            variant="ghost"
            size="icon-touch"
            className="md:hidden"
            aria-label={t.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          {open ? (
            <MobileMenu
              open={open}
              onOpenChange={setOpen}
              side={locale === "ar" ? "left" : "right"}
              navLabel={t.navMobile}
              items={items.map((item) => ({ href: href(item.href), label: item.label }))}
              contactHref={href("/contact")}
              contactLabel={t.nav.contact}
              switchLabel={t.switchToLabel}
              onSwitch={() => switchTo(other)}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
