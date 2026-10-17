"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/data/products";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <Accordion multiple className="divide-y divide-border border-y">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="py-4 text-left font-serif text-lg font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
