"use client";

import { CartProvider } from "@/components/cart-provider";
import { CheckoutOptionsProvider } from "@/components/checkout-options";
import { LocaleProvider } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import type { CheckoutOptions } from "@/lib/payments";
import { ThemeProvider } from "next-themes";

export function Providers({
  locale,
  checkout,
  children,
}: {
  locale: Locale;
  checkout: CheckoutOptions;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <CheckoutOptionsProvider value={checkout}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </CheckoutOptionsProvider>
    </LocaleProvider>
  );
}
