# Vellum Press

Vellum Press is a small storefront for practical PDF guides: health, home training, money, habits, freelance work, study, and stress. Customers pay once, download the files, and keep them. There is no membership and no account.

Online payment is closed until a provider can take a charge. Product, cart, and checkout pages say that payment is not available yet and give `glarz.com@gmail.com`, plus the WhatsApp button, as the way to request a file. They do not show a pay button that errors, and they do not give away the full PDF. The free sample still downloads. All sales are final.

Stripe and Moyasar stay in the repository and stay off the checkout page unless you set `ENABLE_STRIPE=true` or `ENABLE_MOYASAR=true` and add that provider's keys. `ALLOW_DEMO_CHECKOUT=true` only lets a direct `POST /api/checkout` sign a test receipt. The storefront never shows that path.

Hala Payments (هلا للمدفوعات, [hala.com](https://hala.com)) is the hosted provider this store is ready to plug in. `lib/checkout-provider.ts` is the switch: only `PAYMENT_PROVIDER=hala` selects it. The pay button stays hidden until `HALA_HOSTED_CHECKOUT_IMPLEMENTED` in `lib/hala.ts` is true, because Hala has not published API docs and the route cannot return a payment URL. With the flag set and that constant still false, `POST /api/hala/checkout` returns 501 and the page keeps the email request. `POST /api/hala/webhook` checks `HALA_WEBHOOK_SECRET` and signs a download only after a paid event matches the catalog SAR total. Each product has a `priceSar` for that future charge: the USD price times 3.75, rounded to the nearest whole riyal.

![Vellum Press home page](docs/screenshots/home.png)

![Shop](docs/screenshots/shop.png)

![The 12-Week Reset product page](docs/screenshots/product.png)

![Home page on a phone](docs/screenshots/home-mobile.png)

## What’s in the library

| Guide | Price | Category |
| --- | ---: | --- |
| The 12-Week Reset | $14.50 | Health & nutrition |
| Weeknight Table | $12 | Health & nutrition |
| Floor & Form | $13.50 | Home fitness |
| The Quiet Budget | $11 | Personal finance |
| The Habit Ledger | $9.50 | Productivity |
| First Client | $16 | Freelance & work |
| The Exam Room Method | $10.50 | Study skills |
| Steady Mind | $9 | Mindfulness |
| Saudi Freelancer Starter Kit | $8.50 | Freelance & work (English edition) |
| Irregular-Income Budget + Invoice Sheets | $7.50 | Personal finance |
| Saudi & Gulf Job-Search and ATS CV Kit | $6 | Freelance & work |
| Health & Fitness Bundle | $29.50 (separate $40; previously $59) | Reset, Weeknight Table, and Floor & Form |
| Work & Money Bundle | $29 (separate $36.50; previously $58) | Quiet Budget, Habit Ledger, and First Client |
| Gulf Work Bundle | $18 (separate $22; previously $36) | Freelancer kit, irregular-income sheets, and the Gulf CV kit |

Each guide has a free sample PDF in `public/samples/` and a full PDF in `private/pdfs/`. Full files are not served as public URLs. A purchase creates a signed link that expires after `DOWNLOAD_LINK_DAYS` (14 by default).

Health, fitness, and stress guides include a plain-language disclaimer. They are education, not medical care or therapy. Finance and freelance guides say where a licensed professional has to take over.

There are no star ratings and no sample testimonials. Do not add quotations or an `aggregateRating` until they come from verified buyers.

## Run it locally

Node 20+ and npm. Python 3 is only needed if you regenerate the PDFs.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123). The first visit follows `Accept-Language`: `ar` and `ar-*` go to `/ar`, and every other language goes to `/en`. A choice in the language switcher is stored in the `vellum_locale` cookie and overrides that detection. Crawlers are not redirected; `/en` and `/ar` are the canonical URLs, with hreflang alternates. Older unprefixed paths redirect visitors to the same page under their locale.

The PDF files stay in English. Arabic product and receipt pages say so. Prices are shown in USD and as an approximate amount in SAR at 3.75.

```bash
npm test
npm run lint
npm run build
npm run links
```

`npm test` runs the unit tests, then the same link check as `npm run links`. That check builds the app (unless `LINK_CHECK_SKIP_BUILD=1` and `.next` already exists) and starts a local production server. To point it at a server you already started:

```bash
npm run build
npm start
npm run links -- http://127.0.0.1:43123
```

It opens every URL in `/sitemap.xml` in Arabic and English. An internal link must answer 200, or one 301 or 308 that lands on 200. Links to the old `/products` address fail until they point at the shop. Images, fonts, scripts, stylesheets, Open Graph images, favicons, manifests, sample PDFs, and preview images referenced on the page must answer 200. The canonical URL must be that page's own language on `https://getvellumpress.com`. hreflang alternates must match the sitemap, point back at one another, and answer 200. An article that exists in only one language publishes that language and `x-default`, not the missing translation. External links are checked only as well-formed `https` URLs. Mailto addresses must be `glarz.com@gmail.com`. WhatsApp links must be well-formed `https` URLs.

`npm run mobile` checks the storefront in Arabic and English at 320, 360, 375, 390, 412, 430, a 667×375 landscape phone, and 768. It fails on horizontal overflow, a clipped wordmark, inputs under 16px, and a missing or covered primary action. Start the app first (`npm run dev` or `npm start`), with Chrome installed. It stays out of `npm test` so a machine without a browser can still run the unit tests.

Copy `.env.example` to `.env.local` when you want to override the defaults. The app runs with no env file.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | For production | Checkout return origin. Example: `https://getvellumpress.com`. SEO canonicals and the sitemap always use `https://getvellumpress.com`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console HTML-tag content value. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | No | Bing Webmaster `msvalidate.01` content value. |
| `DOWNLOAD_SECRET` | Required in production | HMAC secret for download links. Use a long random string (16+ characters). |
| `DOWNLOAD_LINK_DAYS` | No | Lifetime of a download link. Default 14. |
| `ENABLE_STRIPE` | No | Set to exactly `true` to show Stripe. Off by default, even if `STRIPE_SECRET_KEY` is set. |
| `STRIPE_SECRET_KEY` | For Stripe charges | Secret key from the Stripe dashboard. Hidden until `ENABLE_STRIPE=true`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Unused by hosted Checkout. Kept for a future Stripe.js form. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret for `POST /api/stripe/webhook`. |
| `ENABLE_MOYASAR` | No | Set to exactly `true` to show Moyasar. Off by default, even if the Moyasar keys are set. |
| `MOYASAR_PUBLISHABLE_KEY` | For Moyasar | Publishable key (`pk_test_` or `pk_live_`) for the Moyasar payment form. Hidden until `ENABLE_MOYASAR=true` and the secret matches the same mode. |
| `MOYASAR_SECRET_KEY` | For Moyasar | Secret key (`sk_test_` or `sk_live_`) used only on the server to fetch and verify payments. Never commit it. Must be the same mode as the publishable key. |
| `MOYASAR_WEBHOOK_SECRET` | No | Shared secret you choose in the Moyasar webhook settings. `POST /api/moyasar/webhook` checks it. Downloads are issued on the callback, not by the webhook. |
| `USD_TO_SAR_RATE` | No | USD to SAR rate for Moyasar charges. Default `3.75` (the official peg). Amounts are converted to halalas on the server. |
| `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` | For Moyasar Apple Pay | Body of the domain association file from the Moyasar dashboard. |
| `PAYMENT_PROVIDER` | No | Set to exactly `hala` to select Hala. The pay button stays hidden until `HALA_HOSTED_CHECKOUT_IMPLEMENTED` is true. Any other value leaves Hala off. |
| `HALA_API_KEY` | For a future Hala charge | Ignored until `PAYMENT_PROVIDER=hala`. The route still returns 501. |
| `HALA_WEBHOOK_SECRET` | For the Hala webhook stub | HMAC secret for `POST /api/hala/webhook`. Ignored until the flag is `hala`. |
| `ALLOW_DEMO_CHECKOUT` | No | Set to exactly `true` only to let `POST /api/checkout` sign a test receipt. Hidden from the storefront. Leave unset on a live store. |
| `CONTACT_WEBHOOK_URL` | No | JSON endpoint that receives contact-form posts. |
| `NEWSLETTER_WEBHOOK_URL` | No | JSON endpoint for newsletter signups and free-sample requests. If unset, those addresses are written to the server log. |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is also accepted. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 id (`G-…`). The snippet loads only when this is set and well formed. |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel id (digits only). Loads only when set. |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | No | TikTok Pixel id. Loads only when set. |

## Checkout and delivery

Prices are read from `data/products.ts` on the server. The browser cannot set the amount.

**What customers see.** With no provider able to charge, checkout, the cart, shop cards, and the product page say online payment is not available yet, link to `glarz.com@gmail.com`, and link to WhatsApp. All sales are final is on that note. There is no pay button. The free sample still works. The Hala button appears only when `PAYMENT_PROVIDER=hala`, `HALA_API_KEY` is set, and `HALA_HOSTED_CHECKOUT_IMPLEMENTED` is true. Stripe and Moyasar buttons render only when their `ENABLE_` flag is exactly `true` and their keys are valid.

**Closed checkout** does not sign a download token. `ALLOW_DEMO_CHECKOUT=true` is the only way `POST /api/checkout` will sign a test receipt, and the page never offers that button.

**Hala** (`PAYMENT_PROVIDER=hala`): the button posts to `POST /api/hala/checkout` only after hosted checkout is implemented. Until then that route returns 501 and the page does not show the button. `POST /api/hala/webhook` checks `HALA_WEBHOOK_SECRET` and signs a download only after a paid event matches the catalog SAR total. A client-sent price is ignored.

**Stripe mode** (only when `ENABLE_STRIPE=true` and `STRIPE_SECRET_KEY` is set): `POST /api/checkout` creates a Checkout Session with `price_data` in USD and redirects the buyer to Stripe. You do not have to pre-create Products in the dashboard. Success returns to `/checkout/success?session_id=...`. The server retrieves the session, checks `payment_status === "paid"`, recomputes the files from the catalog, and signs the same kind of token. Cancel returns to `/checkout?canceled=1`. The cart in the browser is unchanged until payment is confirmed. With the flag unset, that route will not open a Stripe session.

`POST /api/stripe/webhook` verifies `STRIPE_WEBHOOK_SECRET` and acknowledges `checkout.session.completed`. Fulfillment already happens on the success page, which is enough for a single digital delivery. Use the webhook later if you email files from a worker. In the Stripe dashboard, point the endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` and subscribe to `checkout.session.completed`.

**Moyasar mode** (only when `ENABLE_MOYASAR=true` and the publishable and secret keys are a matching pair): `POST /api/moyasar/session` recomputes the cart from `data/products.ts`, including bundle prices, and ignores any amount sent by the browser. It converts the USD subtotal to SAR halalas with `USD_TO_SAR_RATE` (default 3.75) and returns the publishable key plus that amount. The checkout page then mounts [Moyasar's payment form](https://docs.moyasar.com/guides/card-payments/basic-integration) (`moyasar-payment-form` 2.3.0) with methods `creditcard` (mada, Visa, Mastercard), `applepay`, and `stcpay`. The Moyasar option is hidden until both Moyasar keys are set. Card data is entered in that form and sent to Moyasar, not to this server. After payment, Moyasar redirects to `GET /api/moyasar/callback` with the payment id. The callback fetches `GET https://api.moyasar.com/v1/payments/:id` with the secret key and signs a download token only when status is `paid`, the currency is `SAR`, the amount matches the server-computed halalas, the payment is not refunded, and the payment's callback URL is the signed checkout state for this cart. Anything else returns the buyer to `/checkout?moyasar=failed` and does not issue a link. The SAR amount is shown on the checkout page before the form is used.

`POST /api/moyasar/webhook` checks the `secret_token` field against `MOYASAR_WEBHOOK_SECRET` when that variable is set, and for `payment_paid` it fetches the payment again. It acknowledges the event and does not release files. Point the webhook at `https://YOUR_DOMAIN/api/moyasar/webhook`.

### Apple Pay domain file

Moyasar's domain association file is served from one URL:

`https://YOUR_DOMAIN/.well-known/apple-developer-merchantid-domain-association`

Set `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` to the file body. The response is the raw file with status 200, `Content-Type: application/octet-stream`, and no redirect. If the variable is empty, the route returns 404.

### Moyasar setup

1. Create a Moyasar account at the [Moyasar dashboard](https://dashboard.moyasar.com/). Start in test mode. Sandbox keys start with `pk_test_` and `sk_test_`.
2. Copy the publishable key and the secret key. In the Vercel project, set `MOYASAR_PUBLISHABLE_KEY` and `MOYASAR_SECRET_KEY`. Do not commit them. Set `NEXT_PUBLIC_SITE_URL` to the https origin Moyasar will redirect back to, and set `DOWNLOAD_SECRET`.
3. Leave `USD_TO_SAR_RATE` at `3.75` unless you have a reason to charge a different riyal rate. The catalog stays in US dollars. Checkout shows the converted SAR total before the customer pays.
4. Use Moyasar's [test cards](https://docs.moyasar.com/guides/card-payments/test-cards). A name of at least two words, any future expiry, and any 3-digit CVC are accepted. Examples that return `paid`: mada `4201320111111010`, Visa `4111111111111111` and `4111114005765430`. Other numbers in that table simulate declines. Random card numbers fail in test mode.
5. Optional webhook: in Moyasar, open Settings → Webhooks, add `https://YOUR_DOMAIN/api/moyasar/webhook`, choose POST, set a secret token, and subscribe to `payment_paid`. Put that same token in `MOYASAR_WEBHOOK_SECRET`. Checkout works without the webhook.
6. Apple Pay on the web needs [Moyasar domain registration](https://docs.moyasar.com/guides/apple-pay/web-registration). Register the exact hostname the payment starts from (a Vercel subdomain must be registered as that subdomain, not the parent domain). Download the association file and set `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` to its contents, with no `.txt` extension. See "Apple Pay domain file" above. In the dashboard, click Validate, then Register. Apple Pay inside the Moyasar form only appears on supported Apple devices over HTTPS. The form asks Moyasar to start the session at `https://api.moyasar.com/v1/applepay/initiate`, so you do not need a separate Apple Developer merchant certificate for this web flow.
7. STC Pay has to be enabled on the Moyasar account. Ask Moyasar (care@moyasar.com) if the STC Pay button does not appear. The form still offers the card methods without it.
8. Going live needs a live Moyasar account. Moyasar activates live payments after you provide a commercial registration or a freelance document. Then replace the keys with `pk_live_` and `sk_live_`, keep the site on HTTPS, and register the production domain for Apple Pay again.

Download links look like `/orders/<token>` and `/api/download/<token>/<slug>`. The token is `base64url(payload)~hmac`. The payload holds the order id, email, line items, file slugs, and expiry. The API checks the signature, the expiry, and that the file belongs to the order, then streams the PDF from `private/pdfs/`. Anyone with the link can download until it expires, so the receipt should be treated like a secret.

The cart is stored in `localStorage` under `vellum-cart-v1`.

Contact and newsletter forms validate input. A hidden company field is a honeypot. If `CONTACT_WEBHOOK_URL` is unset, the contact form says the message was validated and not emailed. Newsletter signups and free-sample requests are posted to `NEWSLETTER_WEBHOOK_URL` when that variable is set. Otherwise the server logs the address and the form still confirms the signup. The free sample on a product page asks for an email, then shows the sample PDF.

Optional analytics load only when set: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, and `NEXT_PUBLIC_TIKTOK_PIXEL_ID`. A real receipt (not a demo) sends a purchase event to whichever of those scripts loaded. Public pages have buyer-intent titles and descriptions, canonical URLs on `https://getvellumpress.com`, hreflang for Arabic pages under `/ar`, Open Graph images, and JSON-LD for products, the organization, FAQs, and articles. `/sitemap.xml` and `/robots.txt` list products, bundles, journal posts, and Arabic pages, and keep the cart, checkout, orders, and API out of the index. Arabic pages state that the PDF is in English. Search Console and Bing verification meta tags render only when their env vars are set. Product pages include copy-link and share actions.

## Add or edit a guide

1. Add the product to `data/products.ts`. Guides use `kind: "guide"`. Bundles use `kind: "bundle"` and an `includes` array of guide slugs. Set `compareAtPrice` on a bundle to the sum of the included prices. Set `priceSar` to the nearest whole riyal of `price × 3.75`. Set `previousPrice` only when that amount was actually charged. The 50% off label appears only when `previousPrice` is exactly twice `price`. The tests check that.
2. Add the chapter text in `scripts/pdfgen/books_health.py`, `scripts/pdfgen/books_life.py`, or `scripts/pdfgen/books_gulf.py`. Chapter titles should match the `contents` list on the product.
3. Give the cover the same colors and motif the site uses (`path`, `plate`, `form`, `ledger`, `grid`, `mark`, `bars`, `breath`, `bundle`).
4. Regenerate the PDFs (below). `data/pdf-meta.json` picks up the page counts the site displays.
5. Optional: add a journal post in `data/blog.ts`. Add a review in `data/reviews.ts` only when it comes from a verified buyer. Do not invent stars, quotations, or an `aggregateRating`.

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
3. Leave `PAYMENT_PROVIDER` unset until Hala can charge. Set it to `hala`, add `HALA_API_KEY` and `HALA_WEBHOOK_SECRET`, and set `HALA_HOSTED_CHECKOUT_IMPLEMENTED` to true in the same change that returns Hala's hosted URL. Until that constant is true, the storefront keeps the email request and the checkout route returns 501.
4. Leave `ENABLE_STRIPE` and `ENABLE_MOYASAR` unset. Set `ENABLE_STRIPE=true` plus `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` only if you also want Stripe. Set `ENABLE_MOYASAR=true` plus the Moyasar keys only if you also want mada, cards, Apple Pay, or STC Pay through Moyasar.
5. Optional: set `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, or `NEXT_PUBLIC_TIKTOK_PIXEL_ID`. Blank values add no script.
6. For Moyasar Apple Pay, set `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` to that provider's domain file.
7. Deploy. `npm run build` is the build command. No database is required.

The success URL is built from `NEXT_PUBLIC_SITE_URL` in production, so set that before the first real payment.

### Netlify

Next.js on Netlify needs the [Next.js runtime](https://docs.netlify.com/frameworks/next-js/overview/). Set the same environment variables. API routes and server-rendered receipt pages have to run on the Next runtime, not as a purely static export. Do not set `output: "export"`.

## Before you take real payments

The contact and support address in `data/site.ts` is `glarz.com@gmail.com`. Mailto links and the contact page use it.

Digital PDF sales are final. The store does not offer refunds. If a file is corrupted, missing, or the download link fails, the customer emails that address and receives a working copy. The policy lives at `/legal/refunds` (footer label: All sales final). Checkout states that all sales are final before payment.

These business details still need the owner. There is a TODO in `data/site.ts` with the same list:

- legal name (`legalName` is still `Vellum Press` until the owner provides the registered name)
- commercial registration number, or the license that covers online sales in Saudi Arabia
- VAT / zakat status
- a street address, if the store must show one

Location is Dammam, Saudi Arabia. Governing law is the Kingdom of Saudi Arabia. Have a lawyer read `data/legal.ts` before you rely on it. The pages are a practical starting point, not a law-firm opinion.

Then:

- set `NEXT_PUBLIC_SITE_URL` and `DOWNLOAD_SECRET`
- set `PAYMENT_PROVIDER=hala` and `HALA_HOSTED_CHECKOUT_IMPLEMENTED` only when Hala's hosted checkout returns a URL, and keep the storefront honest until then
- leave `ENABLE_STRIPE` and `ENABLE_MOYASAR` unset unless you intend to show those processors too
- for Moyasar Apple Pay, register the domain and set `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION`
- leave `ALLOW_DEMO_CHECKOUT` unset
- point `CONTACT_WEBHOOK_URL` and `NEWSLETTER_WEBHOOK_URL` at your inbox tool (a Zapier, Make, or Formspark endpoint is enough)
- add reviews only when they come from verified buyers
- put your own domain on the host and confirm `/sitemap.xml` and `/robots.txt`

## Project map

- `data/products.ts` — catalog, prices, contents, FAQs, cover art
- `data/site.ts` — business name, emails, location
- `data/blog.ts`, `data/legal.ts`, `data/faq.ts` — journal, policies, store FAQ
- `app/` — pages and route handlers
- `private/pdfs/` — full guides, served only through the signed download route
- `public/samples/` — free previews
- `scripts/generate_pdfs.py` — rebuilds every PDF
