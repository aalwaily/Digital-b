import type { Faq } from "@/data/products";
import { ChevronDown } from "lucide-react";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-border border-y">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 py-4 text-start [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-lg font-medium">{item.question}</h3>
            <ChevronDown aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="max-w-3xl pb-4 text-base leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
