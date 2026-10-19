"use client";

import { useCart } from "@/components/cart-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/components/locale-provider";
import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
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
            aria-label={t.switchToLabel}
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-touch" className="md:hidden" aria-label={t.openMenu} />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">
                  <bdi dir="ltr">Vellum Press</bdi>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label={t.navMobile}>
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-2 text-lg hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={href("/contact")}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 text-lg hover:bg-muted"
                >
                  {t.nav.contact}
                </Link>
                <button
                  type="button"
                  className="flex min-h-11 items-center rounded-lg px-2 text-start text-lg hover:bg-muted"
                  onClick={() => switchTo(other)}
                >
                  {t.switchToLabel}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
