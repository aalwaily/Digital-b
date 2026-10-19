import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { rootMetadata } from "@/lib/seo";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { Fraunces, Outfit } from "next/font/google";
import "../globals.css";

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

export const metadata = rootMetadata("en");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <JsonLd data={websiteSchema(CANONICAL_ORIGIN)} />
          <JsonLd data={organizationSchema(CANONICAL_ORIGIN)} />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
