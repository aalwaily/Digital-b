import { Analytics } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/data/site";
import { getDictionary } from "@/lib/i18n/dictionary";
import { dirFor, htmlLang, isLocale, LOCALE_HEADER } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-sans",
});

const arabicSerif = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  variable: "--font-arabic-serif",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} · Practical PDF guides`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "digital guides",
    "PDF ebooks",
    "meal prep",
    "budgeting",
    "home workouts",
    "study skills",
    "freelancing",
    "أدلة رقمية",
    "كتب PDF",
  ],
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · Practical PDF guides`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Practical PDF guides`,
    description: site.description,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerStore = await headers();
  const requested = headerStore.get(LOCALE_HEADER);
  const locale = isLocale(requested) ? requested : "en";
  const t = getDictionary(locale);

  return (
    <html
      lang={htmlLang(locale)}
      dir={dirFor(locale)}
      suppressHydrationWarning
      className={`${outfit.variable} ${fraunces.variable} ${arabicSans.variable} ${arabicSerif.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <Providers locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            {t.skip}
          </a>
          <SiteHeader />
          <div className="overflow-x-clip">
            <main id="main">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
