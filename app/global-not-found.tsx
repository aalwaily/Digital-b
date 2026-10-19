import { LinkButton } from "@/components/link-button";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import { Fraunces, Outfit } from "next/font/google";
import type { Metadata } from "next";
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

export const metadata: Metadata = pageMetadata({
  title: staticSeo.notFound.title,
  description: staticSeo.notFound.description,
  path: "/404",
  index: false,
});

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <SiteHeader />
          <main id="main">
            <div className="mx-auto max-w-xl px-5 py-24 text-center">
              <p className="text-xs tracking-[0.18em] text-copper uppercase">404</p>
              <h1 className="mt-3 font-serif text-5xl">That page is not on the shelf.</h1>
              <p className="mt-4 text-muted-foreground">
                The link may be old, or the guide may have moved. The library is still where you left it.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <LinkButton href="/" className="h-11 px-5">
                  Home
                </LinkButton>
                <LinkButton href="/shop" variant="outline" className="h-11 px-5">
                  Shop
                </LinkButton>
                <LinkButton href="/ar" variant="outline" className="h-11 px-5">
                  العربية
                </LinkButton>
              </div>
            </div>
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
