"use client";

import { NewsletterForm } from "@/components/newsletter-form";
import { useI18n } from "@/components/locale-provider";
import { localizedCategories } from "@/lib/i18n/content";
import { legalNav, site } from "@/data/site";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  const { t, href, locale } = useI18n();
  const categories = localizedCategories(locale);

  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="min-w-0 sm:col-span-2 lg:col-span-4">
          <p className="font-serif text-2xl">Vellum Press</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.home.metaDescription}</p>
          <p className="mt-4 text-sm break-all">
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <span className="text-muted-foreground"> · {locale === "ar" ? t.about.locationValue : site.location}</span>
          </p>
          <PaymentMarks />
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.footer.shop}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={href("/shop")} className="inline-flex min-h-11 items-center hover:underline">
                {t.footer.allGuides}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={href(`/shop?category=${category.slug}`)} className="inline-flex min-h-11 items-center hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.footer.company}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={href("/about")} className="inline-flex min-h-11 items-center hover:underline">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link href={href("/blog")} className="inline-flex min-h-11 items-center hover:underline">
                {t.nav.journal}
              </Link>
            </li>
            <li>
              <Link href={href("/faq")} className="inline-flex min-h-11 items-center hover:underline">
                {t.nav.faq}
              </Link>
            </li>
            <li>
              <Link href={href("/contact")} className="inline-flex min-h-11 items-center hover:underline">
                {t.nav.contact}
              </Link>
            </li>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={href(item.href)} className="inline-flex min-h-11 items-center hover:underline">
                  {locale === "ar" ? legalLabel(item.href) : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 sm:col-span-2 lg:col-span-3">
          <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.footer.notes}</p>
          <div className="mt-3 max-w-sm">
            <NewsletterForm stack />
          </div>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>{t.footer.rights(new Date().getFullYear(), site.legalName)}</span>
          <span>{t.footer.prices}</span>
        </p>
      </div>
    </footer>
  );
}

function legalLabel(href: string) {
  if (href.endsWith("/privacy")) return "الخصوصية";
  if (href.endsWith("/terms")) return "الشروط";
  if (href.endsWith("/refunds")) return "كل المبيعات نهائية";
  if (href.endsWith("/delivery")) return "التسليم";
  return href;
}

function PaymentMarks() {
  const { t } = useI18n();
  const marks = [
    { icon: Wallet, label: t.footer.paypal },
    { icon: CreditCard, label: t.footer.cards },
    { icon: Smartphone, label: t.footer.applePay },
  ];
  return (
    <div className="mt-5">
      <ul className="flex flex-wrap gap-2" aria-label={t.footer.payments}>
        {marks.map((mark) => (
          <li
            key={mark.label}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border bg-card px-2 text-[11px] font-medium tracking-wide"
          >
            <mark.icon className="size-3.5" aria-hidden />
            {mark.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">{t.footer.paymentsNote}</p>
    </div>
  );
}
