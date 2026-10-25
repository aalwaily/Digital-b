import { Analytics } from "@/components/analytics";
import { site } from "@/data/site";
import { dirFor, htmlLang, isLocale, LOCALE_HEADER } from "@/lib/i18n/config";
import { CANONICAL_ORIGIN, verificationMetadata } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  // Preload per locale. A global preload would fetch these on Arabic pages too.
  preload: false,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

// Runs before the header is parsed. Prefixed URLs win; the bare homepage
// uses the cookie middleware set while rewriting / to /en or /ar.
const localeBoot = `(function(){try{var p=location.pathname;var path=p==="/ar"||p.indexOf("/ar/")===0?"ar":p==="/en"||p.indexOf("/en/")===0?"en":"";var m=document.cookie.match(/(?:^|; )vellum_locale=(en|ar)/);var locale=path||(m?m[1]:"en");var root=document.documentElement;root.lang=locale;root.dir=locale==="ar"?"rtl":"ltr";}catch(e){}})();`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
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
  verification: verificationMetadata(),
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
  const requested = (await headers()).get(LOCALE_HEADER);
  const locale = isLocale(requested) ? requested : "en";
  return (
    <html
      lang={htmlLang(locale)}
      dir={dirFor(locale)}
      suppressHydrationWarning
      className={`${outfit.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: localeBoot }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
