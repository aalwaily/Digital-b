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
import { nav } from "@/data/site";
import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const count = cart.ready ? cart.slugs.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="border-b border-border/70 bg-foreground text-background">
        <p className="mx-auto max-w-6xl px-5 py-2 text-center text-xs tracking-wide">
          Instant PDF delivery · Personal license · 30-day refunds
        </p>
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="mr-2 font-serif text-xl tracking-tight">
          Vellum <span className="text-copper">Press</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-copper">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
            aria-label={count ? `Cart, ${count} items` : "Cart"}
          >
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">Vellum Press</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-3 text-lg hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-lg hover:bg-muted">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
