import { ContactForm } from "@/components/contact-form";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Write to ${site.name} at ${site.email} about an order, a refund, or a licensing question.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:grid-cols-2">
      <div>
        <p className="text-xs tracking-[0.18em] text-copper uppercase">Support</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Contact</h1>
        <p className="mt-4 text-muted-foreground">
          For a missing download or a refund, include the order id from your receipt. We aim to reply within {site.responseTime}.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Orders and refunds</dt>
            <dd>
              <a className="underline underline-offset-4" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Everything else</dt>
            <dd>
              <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Where we are</dt>
            <dd>{site.location}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-2xl border bg-card p-5 md:p-6">
        <ContactForm />
      </div>
    </div>
  );
}
