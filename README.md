# Vellum Press

Vellum Press is a small storefront for practical PDF guides: health, home training, money, habits, freelance work, study, and stress. Customers pay once, download the files, and keep them. There is no membership and no account.

Customers pay through PayPal. Checkout shows Pay with PayPal, and the Apple Pay button when Safari on this device is eligible. PayPal accepts a card or a PayPal balance. If PayPal keys are not set, checkout stays a labeled demo and still produces a signed download link.

Stripe and Moyasar stay in the repository and stay off the checkout page unless you set `ENABLE_STRIPE=true` or `ENABLE_MOYASAR=true` and add that provider's keys. Demo checkout also stays off once PayPal, or an enabled provider, can take payment, unless `ALLOW_DEMO_CHECKOUT=true`.

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
| Saudi Freelancer Starter Kit | $17 | Freelance & work (English edition) |
| Irregular-Income Budget + Invoice Sheets | $15 | Personal finance |
| Saudi & Gulf Job-Search and ATS CV Kit | $12 | Freelance & work |
| Health & Fitness Bundle | $59 (was $80) | Reset, Weeknight Table, and Floor & Form |
| Work & Money Bundle | $58 (was $73) | Quiet Budget, Habit Ledger, and First Client |
| Gulf Work Bundle | $36 (was $44) | Freelancer kit, irregular-income sheets, and the Gulf CV kit |

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
```

Copy `.env.example` to `.env.local` when you want to override the defaults. The app runs with no env file.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | For production | Canonical URLs, sitemap, Open Graph. Example: `https://guides.example.com` |
| `DOWNLOAD_SECRET` | Required in production | HMAC secret for download links. Use a long random string (16+ characters). |
| `DOWNLOAD_LINK_DAYS` | No | Lifetime of a download link. Default 14. |
| `ENABLE_STRIPE` | No | Set to exactly `true` to show Stripe. Off by default, even if `STRIPE_SECRET_KEY` is set. |
| `STRIPE_SECRET_KEY` | For Stripe charges | Secret key from the Stripe dashboard. Hidden until `ENABLE_STRIPE=true`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Unused by hosted Checkout. Kept for a future Stripe.js form. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret for `POST /api/stripe/webhook`. |
| `PAYPAL_CLIENT_ID` | For PayPal | Client ID from a PayPal REST app. Both this and the secret are required before the PayPal button appears. |
| `PAYPAL_CLIENT_SECRET` | For PayPal | Secret from the same REST app. Never commit it. |
| `PAYPAL_ENV` | No | `sandbox` (default) or `live`. Any value other than `live` uses the sandbox API. |
| `PAYPAL_WEBHOOK_ID` | No | Webhook id for `POST /api/paypal/webhook`. Downloads are issued on the return URL, not by the webhook. |
| `APPLE_PAY_DOMAIN_ASSOCIATION` | For PayPal Apple Pay | Raw contents of PayPal's Apple Pay domain association file. |
| `ENABLE_MOYASAR` | No | Set to exactly `true` to show Moyasar. Off by default, even if the Moyasar keys are set. |
| `MOYASAR_PUBLISHABLE_KEY` | For Moyasar | Publishable key (`pk_test_` or `pk_live_`) for the Moyasar payment form. Hidden until `ENABLE_MOYASAR=true` and the secret matches the same mode. |
| `MOYASAR_SECRET_KEY` | For Moyasar | Secret key (`sk_test_` or `sk_live_`) used only on the server to fetch and verify payments. Never commit it. Must be the same mode as the publishable key. |
| `MOYASAR_WEBHOOK_SECRET` | No | Shared secret you choose in the Moyasar webhook settings. `POST /api/moyasar/webhook` checks it. Downloads are issued on the callback, not by the webhook. |
| `USD_TO_SAR_RATE` | No | USD to SAR rate for Moyasar charges. Default `3.75` (the official peg). Amounts are converted to halalas on the server. |
| `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` | For Moyasar Apple Pay | Body of the domain association file from the Moyasar dashboard. |
| `ALLOW_DEMO_CHECKOUT` | No | Set to `true` only if demo checkout should stay available after PayPal is connected or an enabled provider is on. Leave unset on a live store. |
| `CONTACT_WEBHOOK_URL` | No | JSON endpoint that receives contact-form posts. |
| `NEWSLETTER_WEBHOOK_URL` | No | JSON endpoint for newsletter signups and free-sample requests. If unset, those addresses are written to the server log. |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification token. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is also accepted. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 id (`G-…`). The snippet loads only when this is set and well formed. |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel id (digits only). Loads only when set. |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | No | TikTok Pixel id. Loads only when set. |

## Checkout and delivery

Prices are read from `data/products.ts` on the server. The browser cannot set the amount.

**What customers see.** PayPal is the checkout. The page says payments are processed by PayPal, covering cards, a PayPal balance, and Apple Pay where the browser can offer it. Stripe and Moyasar buttons render only when their `ENABLE_` flag is exactly `true` and their keys are valid.

**Demo mode** (PayPal is not configured, and Stripe and Moyasar are not enabled): the checkout page says no payment will be collected. Confirming the order signs a download token and opens the receipt. The receipt is stamped as a demo. Keys for Stripe or Moyasar do not turn the demo off by themselves.

**Stripe mode** (only when `ENABLE_STRIPE=true` and `STRIPE_SECRET_KEY` is set): `POST /api/checkout` creates a Checkout Session with `price_data` in USD and redirects the buyer to Stripe. You do not have to pre-create Products in the dashboard. Success returns to `/checkout/success?session_id=...`. The server retrieves the session, checks `payment_status === "paid"`, recomputes the files from the catalog, and signs the same kind of token. Cancel returns to `/checkout?canceled=1`. The cart in the browser is unchanged until payment is confirmed. With the flag unset, that route will not open a Stripe session.

`POST /api/stripe/webhook` verifies `STRIPE_WEBHOOK_SECRET` and acknowledges `checkout.session.completed`. Fulfillment already happens on the success page, which is enough for a single digital delivery. Use the webhook later if you email files from a worker. In the Stripe dashboard, point the endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` and subscribe to `checkout.session.completed`.

**PayPal mode**: `POST /api/paypal/checkout` recomputes the cart from `data/products.ts` (bundle prices included; the browser total is ignored) and creates a PayPal Orders v2 order with `intent: CAPTURE`. The buyer is redirected to PayPal to approve it. Cancel returns to `/cart?canceled=1`. Approval returns to `GET /api/paypal/return`, which captures the order, requires status `COMPLETED`, and checks that the captured currency is USD and the captured amount matches the catalog total. Only then does it sign a download token with the usual 14-day expiry and redirect to the receipt. Private PDFs are not sent before that check. A mismatch or a failed capture sends the buyer back to checkout with an explanation and does not issue a link.

`POST /api/paypal/webhook` verifies the transmission with `PAYPAL_WEBHOOK_ID` when that variable is set. It acknowledges the event and does not release files. Point the webhook at `https://YOUR_DOMAIN/api/paypal/webhook`.

**Apple Pay through PayPal** uses the same PayPal account and the same Orders v2 capture check. It appears only when PayPal is configured, and only when the browser can pay with Apple Pay. Checkout loads the PayPal JS SDK with `components=applepay` from `GET /api/paypal/config`. That route returns `PAYPAL_CLIENT_ID` and the sandbox or live SDK URL. It does not return `PAYPAL_CLIENT_SECRET`. You do not need `NEXT_PUBLIC_PAYPAL_CLIENT_ID`. The button is rendered only when `ApplePaySession.canMakePayments()` is true and `paypal.Applepay().config()` reports `isEligible`. Pay with PayPal, Stripe, Moyasar, and demo checkout stay as they are.

The sheet total is the catalog price. `POST /api/paypal/applepay/order` ignores any amount in the request and creates an order with no PayPal redirect `payment_source` (Apple Pay confirms that order in the browser). `paypal.Applepay().confirmOrder()` sends the Apple Pay token to PayPal. `POST /api/paypal/applepay/capture` then captures on the server and signs the 14-day receipt only when the order status is `COMPLETED` and the captured currency and amount match the catalog total. Cancel and a failed confirm leave the cart in place and do not issue a link. Stripe and Moyasar stay hidden unless their flags are on.

### PayPal setup

1. Open the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications) and create a REST app. Use the sandbox app while testing, and a live app when you are ready to charge real PayPal accounts.
2. Copy that app's Client ID and Secret.
3. In the Vercel project, set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV` (`sandbox` or `live`). Set `NEXT_PUBLIC_SITE_URL` to the https origin PayPal will redirect back to.
4. Optional: in the same app, add a webhook for `https://YOUR_DOMAIN/api/paypal/webhook` and set `PAYPAL_WEBHOOK_ID` to the webhook id PayPal shows. Checkout works without it.

### Apple Pay through PayPal

Apple Pay charged through PayPal uses the same PayPal business account. It is not a separate processor, and it is separate from Moyasar's Apple Pay button. Sandbox support is limited: a sandbox business account often cannot complete a real Apple Pay sheet, and PayPal does not treat sandbox as a substitute for a live domain registration. Plan to verify the button on the production domain.

The PayPal Apple Pay button appears only when PayPal keys are set and all of these are true:

- the browser is Safari (macOS) or Safari on iOS
- the device has a card in Wallet (`ApplePaySession.canMakePayments()`)
- PayPal reports the merchant as eligible (`paypal.Applepay().config().isEligible`)
- the page is HTTPS on a domain registered in PayPal's Apple Pay settings

Other browsers keep Pay with PayPal. Stripe and Moyasar appear only when their flags are on.

1. Use a live PayPal business account that is eligible for Apple Pay via PayPal. Advanced Credit and Debit Card Payments has to be approved on that account. A standard sandbox app is not enough for production.
2. Enable Apple Pay under Account settings > Payment methods > Apple Pay. In the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications), switch to Live, open the live REST app, and confirm Apple Pay is enabled under Features (Accept payments > Advanced Credit and Debit Card Payments > Apple Pay).
3. Set `PAYPAL_ENV=live` and set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from that live app. Set `NEXT_PUBLIC_SITE_URL` to the https origin buyers use, with no trailing path.
4. Register that production domain in PayPal's Apple Pay domain settings. In the live app, open Apple Pay and choose Manage, then Add Domain. Register each host that serves checkout. `www` and the apex are different domains. The host you register must be the host Apple will request. A redirect to another host fails registration.
5. Download the domain association file PayPal shows for that domain. Paste the file contents into `APPLE_PAY_DOMAIN_ASSOCIATION`. Do not wrap the value in quotes and do not commit the file. This app reads the variable on each request.
6. Confirm `https://YOUR_DOMAIN/.well-known/apple-developer-merchantid-domain-association` returns HTTP 200 with the file body, `Content-Type: application/octet-stream`, and no redirect. PayPal and Apple reject a 3xx and reject an HTML page.
7. Open checkout in Safari on a Mac or iPhone that has a card in Wallet. The Apple Pay button sits beside Pay with PayPal.

`GET /api/paypal/config` is the only place the PayPal client id is sent to the browser, inside the PayPal SDK script URL. Never put `PAYPAL_CLIENT_SECRET` in `NEXT_PUBLIC_PAYPAL_CLIENT_ID` or any other public variable.

**Moyasar mode** (only when `ENABLE_MOYASAR=true` and the publishable and secret keys are a matching pair): `POST /api/moyasar/session` recomputes the cart from `data/products.ts`, including bundle prices, and ignores any amount sent by the browser. It converts the USD subtotal to SAR halalas with `USD_TO_SAR_RATE` (default 3.75) and returns the publishable key plus that amount. The checkout page then mounts [Moyasar's payment form](https://docs.moyasar.com/guides/card-payments/basic-integration) (`moyasar-payment-form` 2.3.0) with methods `creditcard` (mada, Visa, Mastercard), `applepay`, and `stcpay`. The Moyasar option is hidden until both Moyasar keys are set. Card data is entered in that form and sent to Moyasar, not to this server. After payment, Moyasar redirects to `GET /api/moyasar/callback` with the payment id. The callback fetches `GET https://api.moyasar.com/v1/payments/:id` with the secret key and signs a download token only when status is `paid`, the currency is `SAR`, the amount matches the server-computed halalas, the payment is not refunded, and the payment's callback URL is the signed checkout state for this cart. Anything else returns the buyer to `/checkout?moyasar=failed` and does not issue a link. The SAR amount is shown on the checkout page before the form is used.

`POST /api/moyasar/webhook` checks the `secret_token` field against `MOYASAR_WEBHOOK_SECRET` when that variable is set, and for `payment_paid` it fetches the payment again. It acknowledges the event and does not release files. Point the webhook at `https://YOUR_DOMAIN/api/moyasar/webhook`.

### One Apple Pay domain file

PayPal and Moyasar each give you a domain association file, and Apple looks up only one URL:

`https://YOUR_DOMAIN/.well-known/apple-developer-merchantid-domain-association`

That route serves whichever variable is set:

- `APPLE_PAY_DOMAIN_ASSOCIATION` for PayPal's file
- `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` for Moyasar's file

The response is the raw file with status 200, `Content-Type: application/octet-stream`, and no redirect. If only one variable is set, that file is served. If both are set to the same bytes, that file is served. If both are set and the bytes differ, the route returns 409 and serves neither file, because Apple cannot verify two different files at one path. Pick the provider whose Apple Pay you are registering and leave the other variable empty. PayPal's file will not satisfy Moyasar's domain check, and Moyasar's file will not satisfy PayPal's.

### Moyasar setup

1. Create a Moyasar account at the [Moyasar dashboard](https://dashboard.moyasar.com/). Start in test mode. Sandbox keys start with `pk_test_` and `sk_test_`.
2. Copy the publishable key and the secret key. In the Vercel project, set `MOYASAR_PUBLISHABLE_KEY` and `MOYASAR_SECRET_KEY`. Do not commit them. Set `NEXT_PUBLIC_SITE_URL` to the https origin Moyasar will redirect back to, and set `DOWNLOAD_SECRET`.
3. Leave `USD_TO_SAR_RATE` at `3.75` unless you have a reason to charge a different riyal rate. The catalog stays in US dollars. Checkout shows the converted SAR total before the customer pays.
4. Use Moyasar's [test cards](https://docs.moyasar.com/guides/card-payments/test-cards). A name of at least two words, any future expiry, and any 3-digit CVC are accepted. Examples that return `paid`: mada `4201320111111010`, Visa `4111111111111111` and `4111114005765430`. Other numbers in that table simulate declines. Random card numbers fail in test mode.
5. Optional webhook: in Moyasar, open Settings → Webhooks, add `https://YOUR_DOMAIN/api/moyasar/webhook`, choose POST, set a secret token, and subscribe to `payment_paid`. Put that same token in `MOYASAR_WEBHOOK_SECRET`. Checkout works without the webhook.
6. Apple Pay on the web needs [Moyasar domain registration](https://docs.moyasar.com/guides/apple-pay/web-registration). Register the exact hostname the payment starts from (a Vercel subdomain must be registered as that subdomain, not the parent domain). Download the association file and set `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` to its contents, with no `.txt` extension. Leave `APPLE_PAY_DOMAIN_ASSOCIATION` empty unless you are registering PayPal's file instead. See "One Apple Pay domain file" above. In the dashboard, click Validate, then Register. Apple Pay inside the Moyasar form only appears on supported Apple devices over HTTPS. The form asks Moyasar to start the session at `https://api.moyasar.com/v1/applepay/initiate`, so you do not need a separate Apple Developer merchant certificate for this web flow.
7. STC Pay has to be enabled on the Moyasar account. Ask Moyasar (care@moyasar.com) if the STC Pay button does not appear. The form still offers the card methods without it.
8. Going live needs a live Moyasar account. Moyasar activates live payments after you provide a commercial registration or a freelance document. Then replace the keys with `pk_live_` and `sk_live_`, keep the site on HTTPS, and register the production domain for Apple Pay again.

Download links look like `/orders/<token>` and `/api/download/<token>/<slug>`. The token is `base64url(payload)~hmac`. The payload holds the order id, email, line items, file slugs, and expiry. The API checks the signature, the expiry, and that the file belongs to the order, then streams the PDF from `private/pdfs/`. Anyone with the link can download until it expires, so the receipt should be treated like a secret.

The cart is stored in `localStorage` under `vellum-cart-v1`.

Contact and newsletter forms validate input. A hidden company field is a honeypot. If `CONTACT_WEBHOOK_URL` is unset, the contact form says the message was validated and not emailed. Newsletter signups and free-sample requests are posted to `NEWSLETTER_WEBHOOK_URL` when that variable is set. Otherwise the server logs the address and the form still confirms the signup. The free sample on a product page asks for an email, then shows the sample PDF.

Optional analytics load only when set: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, and `NEXT_PUBLIC_TIKTOK_PIXEL_ID`. A real receipt (not a demo) sends a purchase event to whichever of those scripts loaded. Public pages have titles, descriptions, canonical URLs, Open Graph images, and JSON-LD for products, the organization, FAQs, and articles. `/sitemap.xml` and `/robots.txt` list the public pages and keep the cart, checkout, orders, and API out of the index. Product pages include copy-link and share actions.

## Add or edit a guide

1. Add the product to `data/products.ts`. Guides use `kind: "guide"`. Bundles use `kind: "bundle"` and an `includes` array of guide slugs. Set `compareAtPrice` on a bundle to the sum of the included prices. The tests check that.
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
3. Add `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV` for the checkout customers see. See the PayPal setup steps above.
4. For Apple Pay through PayPal, set `PAYPAL_ENV=live`, enable Apple Pay on the live business account, register the production domain, and set `APPLE_PAY_DOMAIN_ASSOCIATION`. See the Apple Pay through PayPal steps above.
5. Leave `ENABLE_STRIPE` and `ENABLE_MOYASAR` unset. Set `ENABLE_STRIPE=true` plus `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` only if you also want Stripe. Set `ENABLE_MOYASAR=true` plus the Moyasar keys only if you also want mada, cards, Apple Pay, or STC Pay through Moyasar.
6. Optional: set `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, or `NEXT_PUBLIC_TIKTOK_PIXEL_ID`. Blank values add no script.
7. Put only one Apple Pay domain file in the environment. `APPLE_PAY_DOMAIN_ASSOCIATION` and `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION` share one URL. If both are set to different files, that URL returns 409.
8. Deploy. `npm run build` is the build command. No database is required.

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
- add PayPal REST app credentials so checkout leaves demo mode
- leave `ENABLE_STRIPE` and `ENABLE_MOYASAR` unset unless you intend to show those processors too
- for Apple Pay, register the domain with the provider you use and set only that provider's domain file (`APPLE_PAY_DOMAIN_ASSOCIATION` or `MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION`)
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
