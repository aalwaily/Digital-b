"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

export function MobileMenu({
  open,
  onOpenChange,
  side,
  navLabel,
  items,
  contactHref,
  contactLabel,
  switchLabel,
  onSwitch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: "left" | "right";
  navLabel: string;
  items: { href: string; label: string }[];
  contactHref: string;
  contactLabel: string;
  switchLabel: string;
  onSwitch: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-[min(100%,20rem)]">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            <bdi dir="ltr">Vellum Press</bdi>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label={navLabel}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="flex min-h-11 items-center rounded-lg px-2 text-lg hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={contactHref}
            onClick={() => onOpenChange(false)}
            className="flex min-h-11 items-center rounded-lg px-2 text-lg hover:bg-muted"
          >
            {contactLabel}
          </Link>
          <button
            type="button"
            className="flex min-h-11 items-center rounded-lg px-2 text-start text-lg hover:bg-muted"
            onClick={onSwitch}
          >
            {switchLabel}
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
