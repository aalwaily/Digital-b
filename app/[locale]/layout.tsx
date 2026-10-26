import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { checkoutOptions } from "@/lib/payments";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const shell = (
    <>
      <SkipLink label={getDictionary(locale).skip} />
      <SiteHeader />
      <div className="overflow-x-clip">
        <main id="main">{children}</main>
        <SiteFooter locale={locale} />
      </div>
      <WhatsAppButton label={getDictionary(locale).whatsapp.label} dir={locale === "ar" ? "rtl" : "ltr"} />
    </>
  );

  return (
    <Providers locale={locale} checkout={checkoutOptions()}>
      {locale === "ar" ? (
        <ArabicShell>{shell}</ArabicShell>
      ) : (
        shell
      )}
    </Providers>
  );
}

async function ArabicShell({ children }: { children: ReactNode }) {
  const { ArabicFontScope } = await import("@/components/arabic-font-scope");
  return <ArabicFontScope>{children}</ArabicFontScope>;
}
