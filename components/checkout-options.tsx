"use client";

import { createContext, useContext } from "react";
import type { CheckoutOptions } from "@/lib/payments";

const closed: CheckoutOptions = { stripe: false, moyasar: false, hala: false, open: false };

const CheckoutOptionsContext = createContext<CheckoutOptions>(closed);

export function CheckoutOptionsProvider({
  value,
  children,
}: {
  value: CheckoutOptions;
  children: React.ReactNode;
}) {
  return <CheckoutOptionsContext.Provider value={value}>{children}</CheckoutOptionsContext.Provider>;
}

export function useCheckoutOptions() {
  return useContext(CheckoutOptionsContext);
}
