import { NewsletterForm } from "@/components/newsletter-form";
import { categories } from "@/data/products";
import { legalNav, site } from "@/data/site";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="font-serif text-2xl">Vellum Press</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{site.description}</p>
          <p className="mt-4 text-sm">
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <span className="text-muted-foreground"> · {site.location}</span>
          </p>
          <PaymentMarks />
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:underline">
                All guides
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop?category=${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 sm:col-span-2 lg:col-span-3">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">Notes</p>
          <div className="mt-3 max-w-sm">
            <NewsletterForm stack />
          </div>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <span>Prices in USD. Payments are processed by PayPal.</span>
        </p>
      </div>
    </footer>
  );
}

function PaymentMarks() {
  const marks = [
    { icon: Wallet, label: "PayPal" },
    { icon: CreditCard, label: "Cards" },
    { icon: Smartphone, label: "Apple Pay" },
  ];
  return (
    <div className="mt-5">
      <ul className="flex flex-wrap gap-2" aria-label="Accepted payments">
        {marks.map((mark) => (
          <li
            key={mark.label}
            className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] font-medium tracking-wide"
          >
            <mark.icon className="size-3.5" aria-hidden />
            {mark.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
        Payments are processed by PayPal (cards and PayPal balance, Apple Pay where available).
      </p>
    </div>
  );
}
