import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { checkoutOptions } from "@/lib/payments";
import { notFound } from "next/navigation";

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

  return (
    <Providers locale={locale} checkout={checkoutOptions()}>
      <SkipLink />
      <SiteHeader />
      <div className="overflow-x-clip">
        <main id="main">{children}</main>
        <SiteFooter />
      </div>
    </Providers>
  );
}
