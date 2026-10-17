# Vellum Press

Vellum Press is a small storefront for practical PDF guides: health, home training, money, habits, freelance work, study, and stress. Customers pay once, download the files, and keep them. There is no membership and no account.

The shop runs without Stripe keys. Checkout is labeled as a demo and still produces a signed download link. Add Stripe keys when you are ready to charge cards.

![Vellum Press home page](docs/screenshots/home.png)

![Shop](docs/screenshots/shop.png)

![The 12-Week Reset product page](docs/screenshots/product.png)

![Home page on a phone](docs/screenshots/home-mobile.png)

## What’s in the library

| Guide | Price | Category |
| --- | ---: | --- |
| The 12-Week Reset | $29 | Health & nutrition |
| Weeknight Table | $24 | Health & nutrition |
| Floor & Form | $27 | Home fitness |
| The Quiet Budget | $22 | Personal finance |
| The Habit Ledger | $19 | Productivity |
| First Client | $32 | Freelance & work |
| The Exam Room Method | $21 | Study skills |
| Steady Mind | $18 | Mindfulness |
| Health & Fitness Bundle | $59 (was $80) | Reset, Weeknight Table, and Floor & Form |
| Work & Money Bundle | $58 (was $73) | Quiet Budget, Habit Ledger, and First Client |

Each guide has a free sample PDF in `public/samples/` and a full PDF in `private/pdfs/`. Full files are not served as public URLs. A purchase creates a signed link that expires after `DOWNLOAD_LINK_DAYS` (14 by default).

Health, fitness, and stress guides include a plain-language disclaimer. They are education, not medical care or therapy. Finance and freelance guides say where a licensed professional has to take over.

Testimonials on the home page, and the reviews on product pages, are marked **Sample**. They are layout content, not verified buyers. Do not turn them into structured rating data.

## Run it locally

Node 20+ and npm. Python 3 is only needed if you regenerate the PDFs.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm test
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` when you want to override the defaults. The app runs with no env file.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | For production | Canonical URLs, sitemap, Open Graph. Example: `https://guides.example.com` |
| `DOWNLOAD_SECRET` | Required in production | HMAC secret for download links. Use a long random string (16+ characters). |
| `DOWNLOAD_LINK_DAYS` | No | Lifetime of a download link. Default 14. |
| `STRIPE_SECRET_KEY` | For live charges | Secret key from the Stripe dashboard. When this is empty, checkout stays in demo mode. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Unused by hosted Checkout. Kept for a future Stripe.js form. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret for `POST /api/stripe/webhook`. |
| `ALLOW_DEMO_CHECKOUT` | No | Set to `true` only if demo checkout should stay available after Stripe is connected. Leave unset on a live store. |
| `CONTACT_WEBHOOK_URL` | No | JSON endpoint that receives contact-form posts. |
| `NEWSLETTER_WEBHOOK_URL` | No | JSON endpoint that receives newsletter signups. |

## Checkout and delivery

Prices are read from `data/products.ts` on the server. The browser cannot set the amount.

**Demo mode** (no `STRIPE_SECRET_KEY`): the checkout page says no card will be charged. Confirming the order signs a download token and opens the receipt. The receipt is stamped as a demo.

**Stripe mode**: `POST /api/checkout` creates a Checkout Session with `price_data` in USD and redirects the buyer to Stripe. You do not have to pre-create Products in the dashboard. Success returns to `/checkout/success?session_id=...`. The server retrieves the session, checks `payment_status === "paid"`, recomputes the files from the catalog, and signs the same kind of token. Cancel returns to `/checkout?canceled=1`. The cart in the browser is unchanged until payment is confirmed.

`POST /api/stripe/webhook` verifies `STRIPE_WEBHOOK_SECRET` and acknowledges `checkout.session.completed`. Fulfillment already happens on the success page, which is enough for a single digital delivery. Use the webhook later if you email files from a worker. In the Stripe dashboard, point the endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` and subscribe to `checkout.session.completed`.

Download links look like `/orders/<token>` and `/api/download/<token>/<slug>`. The token is `base64url(payload)~hmac`. The payload holds the order id, email, line items, file slugs, and expiry. The API checks the signature, the expiry, and that the file belongs to the order, then streams the PDF from `private/pdfs/`. Anyone with the link can download until it expires, so the receipt should be treated like a secret.

The cart is stored in `localStorage` under `vellum-cart-v1`.

Contact and newsletter forms validate input. If the matching webhook URL is unset, they tell the sender that the message was validated and not emailed. A hidden company field is a honeypot.

## Add or edit a guide

1. Add the product to `data/products.ts`. Guides use `kind: "guide"`. Bundles use `kind: "bundle"` and an `includes` array of guide slugs. Set `compareAtPrice` on a bundle to the sum of the included prices. The tests check that.
2. Add the chapter text in `scripts/pdfgen/books_health.py` or `scripts/pdfgen/books_life.py`. Chapter titles should match the `contents` list on the product.
3. Give the cover the same colors and motif the site uses (`path`, `plate`, `form`, `ledger`, `grid`, `mark`, `bars`, `breath`, `bundle`).
4. Regenerate the PDFs (below). `data/pdf-meta.json` picks up the page counts the site displays.
5. Optional: add sample reviews in `data/reviews.ts` with `sample: true`, and a journal post in `data/blog.ts`.

Do not put full PDFs in `public/`. Samples belong in `public/samples/<slug>-sample.pdf`.

## Regenerate the PDFs

```bash
python3 -m pip install -r scripts/requirements.txt
python3 scripts/generate_pdfs.py
```

The script uses ReportLab and the SIL Open Font License Liberation fonts in `scripts/fonts/` (see `scripts/fonts/OFL.txt`). It writes full guides, sample previews, and `data/pdf-meta.json`. It refuses to finish if a full guide is under 10 pages, a sample is under 3, or a chapter title or disclaimer is missing from the extracted text.

## Deploy

### Vercel

1. Import the repository.
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin, and set `DOWNLOAD_SECRET`.
3. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` when you want live charges.
4. Deploy. `npm run build` is the build command. No database is required.

The success URL is built from `NEXT_PUBLIC_SITE_URL` in production, so set that before the first real payment.

### Netlify

Next.js on Netlify needs the [Next.js runtime](https://docs.netlify.com/frameworks/next-js/overview/). Set the same environment variables. API routes and server-rendered receipt pages have to run on the Next runtime, not as a purely static export. Do not set `output: "export"`.

## Before you take real payments

Replace the placeholder business in `data/site.ts`:

- legal name (`Vellum Press` is the working name)
- `hello@vellumpress.example` and `support@vellumpress.example`
- location and the governing law used by the legal pages (currently Oregon)
- the refund window if 30 days is not your policy

Have a lawyer read `data/legal.ts` before you rely on it. The pages are a practical starting point for a US digital-goods shop, not a law-firm opinion.

Then:

- set `NEXT_PUBLIC_SITE_URL` and `DOWNLOAD_SECRET`
- add Stripe keys and a webhook
- leave `ALLOW_DEMO_CHECKOUT` unset
- point `CONTACT_WEBHOOK_URL` and `NEWSLETTER_WEBHOOK_URL` at your inbox tool (a Zapier, Make, or Formspark endpoint is enough)
- remove or replace the sample testimonials and sample reviews when you have real ones
- put your own domain on the host and confirm `/sitemap.xml` and `/robots.txt`

## Project map

- `data/products.ts` — catalog, prices, contents, FAQs, cover art
- `data/site.ts` — business name, emails, location
- `data/blog.ts`, `data/legal.ts`, `data/faq.ts` — journal, policies, store FAQ
- `app/` — pages and route handlers
- `private/pdfs/` — full guides, served only through the signed download route
- `public/samples/` — free previews
- `scripts/generate_pdfs.py` — rebuilds every PDF
