import { Cover } from "@/components/cover";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { LinkButton } from "@/components/link-button";
import { faqs } from "@/data/faq";
import { getProduct, categories, products } from "@/data/products";
import { posts } from "@/data/blog";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { pageCountFor } from "@/lib/catalog";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site-url";
import { Download, LockKeyhole, Printer, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

const featuredGuides = products.filter((product) => product.featured && product.kind === "guide").slice(0, 4);

export default function HomePage() {
  const bundle = getProduct("health-fitness-bundle");
  const heroCovers = ["12-week-reset", "the-quiet-budget", "first-client"]
    .map((slug) => getProduct(slug))
    .filter((product) => product !== undefined);
  const siteUrl = getSiteUrl();

  return (
    <div>
      <JsonLd data={websiteSchema(siteUrl)} />
      <JsonLd data={organizationSchema(siteUrl)} />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-12 md:py-20">
        <div className="rise min-w-0 md:col-span-6">
          <p className="text-xs tracking-[0.16em] text-copper uppercase sm:tracking-[0.22em]">Digital guides · Instant download</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] md:text-6xl">
            Practical guides for eating, training, money, and focus.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            {site.name} publishes PDFs you can finish, print, and keep. No membership. No drip course. Pay once.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop" className="h-11 px-5">
              Shop the library
            </LinkButton>
            <LinkButton href="/product/12-week-reset" variant="outline" className="h-11 px-5">
              Preview a sample
            </LinkButton>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Guides</dt>
              <dd className="font-serif text-2xl">8</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Refund window</dt>
              <dd className="font-serif text-2xl">30 days</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Format</dt>
              <dd className="font-serif text-2xl">PDF</dd>
            </div>
          </dl>
        </div>
        <div className="min-w-0 md:col-span-6">
          <div className="flex max-w-full gap-4 overflow-x-auto pb-2 md:hidden">
            {heroCovers.map((product) => (
              <Link key={product.slug} href={`/product/${product.slug}`} className="w-40 shrink-0" aria-label={product.title}>
                <Cover product={product} decorative className="rounded-md shadow-lg" />
              </Link>
            ))}
          </div>
          <div className="relative hidden h-[540px] md:block">
            <Link href="/product/first-client" className="absolute top-6 right-2 z-10 w-52 rotate-3" aria-label="First Client">
              <Cover product={heroCovers[2]} decorative />
            </Link>
            <Link href="/product/12-week-reset" className="absolute top-10 left-0 z-20 w-60 -rotate-6" aria-label="The 12-Week Reset">
              <Cover product={heroCovers[0]} decorative />
            </Link>
            <Link href="/product/the-quiet-budget" className="absolute bottom-2 left-28 z-30 w-52 rotate-2" aria-label="The Quiet Budget">
              <Cover product={heroCovers[1]} decorative />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y bg-card/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Download, title: "Instant download", text: "The receipt page hands you the PDFs." },
            { icon: LockKeyhole, title: "Signed links", text: "Full files stay off the public web." },
            { icon: Printer, title: "Print what you use", text: "Letter-size pages, checklists, tables." },
            { icon: RefreshCcw, title: "30-day refunds", text: "Email support if it is not the right guide." },
            { icon: ShieldCheck, title: "Card, PayPal, mada, or demo", text: "Stripe, PayPal, Apple Pay, or Moyasar. Demo is labeled." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-5 shrink-0 text-copper" aria-hidden />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bundle ? (
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
          <Link href={`/product/${bundle.slug}`} className="mx-auto w-full max-w-sm" aria-label={bundle.title}>
            <Cover product={bundle} decorative />
          </Link>
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">Bundle · save $21</p>
            <h2 className="mt-2 font-serif text-4xl">{bundle.title}</h2>
            <p className="mt-4 text-muted-foreground">{bundle.description[0]}</p>
            <Price price={bundle.price} compareAt={bundle.compareAtPrice} size="lg" className="mt-5" />
            <p className="mt-2 text-sm text-muted-foreground">{pageCountFor(bundle)} pages across three PDFs.</p>
            <LinkButton href={`/product/${bundle.slug}`} className="mt-6 h-11 px-5">
              View the bundle
            </LinkButton>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">Featured guides</h2>
          <Link href="/shop" className="text-sm underline underline-offset-4">
            Shop all
          </Link>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGuides.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-3xl">Categories</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="rounded-xl border bg-card p-4 transition hover:border-foreground/30"
            >
              <h3 className="font-serif text-xl">{category.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Choose a guide",
              text: "Read the contents, the page count, and a free sample before you spend anything.",
            },
            {
              step: "02",
              title: "Check out",
              text: "Pay with Stripe, PayPal, Apple Pay on Safari, or Moyasar (mada, cards, Apple Pay, and STC Pay in SAR) when those keys are set. Otherwise a labeled demo completes the order.",
            },
            {
              step: "03",
              title: "Download and keep it",
              text: "The receipt link is signed. Save the PDF. The license is personal, and it is yours.",
            },
          ].map((item) => (
            <div key={item.step}>
              <p className="text-xs tracking-[0.18em] text-copper">{item.step}</p>
              <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.18em] text-copper uppercase">Sample testimonials</p>
          <h2 className="mt-2 font-serif text-3xl">What the layout is standing in for</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            These quotations are sample content so the page has a finished shape. They are not verified customer reviews.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.id} className="rounded-2xl border bg-card p-5">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs tracking-wide uppercase">Sample</span>
              <blockquote className="mt-4 font-serif text-xl leading-snug">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                {item.name} · {item.detail}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">From the journal</h2>
          <Link href="/blog" className="text-sm underline underline-offset-4">
            All articles
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border bg-card p-5 hover:border-foreground/30">
              <p className="text-xs tracking-[0.16em] text-copper uppercase">{post.category}</p>
              <h3 className="mt-2 font-serif text-2xl">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-serif text-3xl">Questions</h2>
        <div className="mt-6">
          <FaqList items={faqs.slice(0, 5)} />
        </div>
        <Link href="/faq" className="mt-4 inline-block text-sm underline underline-offset-4">
          Read the full FAQ
        </Link>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-4xl">A note when a new guide is ready.</h2>
            <p className="mt-3 max-w-md text-background/75">
              Short, occasional, and only if you ask. No countdown clocks.
            </p>
          </div>
          <NewsletterForm inverted />
        </div>
      </section>
    </div>
  );
}
