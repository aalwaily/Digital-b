import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { faqs } from "@/data/faq";
import { faqSchema } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Delivery, printing, refunds, licenses, and what the health guides are not.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <JsonLd data={faqSchema(faqs)} />
      <p className="text-xs tracking-[0.18em] text-copper uppercase">Help</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Frequently asked questions</h1>
      <p className="mt-4 text-muted-foreground">
        Product pages have their own questions about that guide. This page covers buying, delivery, and the license.
      </p>
      <div className="mt-8">
        <FaqList items={faqs} />
      </div>
    </div>
  );
}
