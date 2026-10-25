import { Analytics } from "@/components/analytics";
import { site } from "@/data/site";
import { CANONICAL_ORIGIN, verificationMetadata } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-sans",
  display: "swap",
  preload: false,
});

const arabicSerif = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  variable: "--font-arabic-serif",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${outfit.variable} ${fraunces.variable} ${arabicSans.variable} ${arabicSerif.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: localeBoot }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
