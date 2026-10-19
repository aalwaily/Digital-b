import { LinkButton } from "@/components/link-button";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.notFound.title,
  description: staticSeo.notFound.description,
  path: "/404",
  index: false,
  locale: "ar",
});

export default function ArabicNotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.18em] text-copper">404</p>
      <h1 className="mt-3 font-serif text-5xl">الصفحة غير موجودة</h1>
      <p className="mt-4 text-muted-foreground">الرابط قديم أو الدليل انتقل. المتجر ما زال في مكانه.</p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/ar" className="h-11 px-5">
          الرئيسية
        </LinkButton>
        <LinkButton href="/" variant="outline" className="h-11 px-5">
          English
        </LinkButton>
      </div>
    </div>
  );
}
