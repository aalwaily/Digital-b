import { site } from "@/data/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Vellum Press publishes practical PDF guides you buy once and keep.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.18em] text-copper uppercase">The press</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">Guides worth keeping.</h1>
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
        <p>
          {site.name} is a small digital press. We publish practical guides on food, training, money, work, study, and stress. Each one is a PDF with a beginning, a middle, and worksheets you can print. There is no membership and no lesson that unlocks next week.
        </p>
        <p>
          The writing is specific on purpose. A budget guide that will not name a debt order is not finished. A workout guide that skips regressions is not finished. We would rather be narrow and usable than broad and inspiring.
        </p>
        <p>
          We are not a clinic, a brokerage, or a law office. Health guides are education, with disclaimers and red flags. Money and freelance guides tell you where a licensed professional has to take over. If a page promises a body, a grade, or an income, it is not one of ours.
        </p>
      </div>
      <h2 className="mt-12 font-serif text-3xl">How a purchase works</h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed">
        <li>1. You read the contents and a free sample.</li>
        <li>2. You pay once with Stripe, PayPal, or Moyasar (mada, cards, Apple Pay, or STC Pay) when the store is connected. Until then, checkout is clearly marked as a demo and does not charge you.</li>
        <li>3. A signed receipt link lets you download the files. Save them. The link expires.</li>
      </ol>
      <h2 className="mt-12 font-serif text-3xl">Publisher details</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd>{site.legalName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Location</dt>
          <dd>{site.location}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>
            <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Support</dt>
          <dd>
            <a className="underline underline-offset-4" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
          </dd>
        </div>
      </dl>
      <p className="mt-6 rounded-xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        Before you launch, replace the business name, location, emails, and governing law in <code>data/site.ts</code>. The addresses above are placeholders, including the <span className="whitespace-nowrap">.example</span> inbox.
      </p>
      <p className="mt-8">
        <Link href="/shop" className="text-sm underline underline-offset-4">
          Browse the library
        </Link>
      </p>
    </div>
  );
}
