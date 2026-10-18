# Vellum Press

Vellum Press is a small storefront for practical PDF guides: health, home training, money, habits, freelance work, study, and stress. Customers pay once, download the files, and keep them. There is no membership and no account.

The shop runs without payment keys. Checkout is labeled as a demo and still produces a signed download link. Add Stripe keys to charge cards, or PayPal keys to offer PayPal, or both.

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
| `STRIPE_SECRET_KEY` | For card charges | Secret key from the Stripe dashboard. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Unused by hosted Checkout. Kept for a future Stripe.js form. |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | Signing secret for `POST /api/stripe/webhook`. |
| `PAYPAL_CLIENT_ID` | For PayPal | Client ID from a PayPal REST app. Both this and the secret are required before the PayPal button appears. |
| `PAYPAL_CLIENT_SECRET` | For PayPal | Secret from the same REST app. Never commit it. |
| `PAYPAL_ENV` | No | `sandbox` (default) or `live`. Any value other than `live` uses the sandbox API. |
| `PAYPAL_WEBHOOK_ID` | No | Webhook id for `POST /api/paypal/webhook`. Downloads are issued on the return URL, not by the webhook. |
| `APPLE_PAY_DOMAIN_ASSOCIATION` | For Apple Pay | Raw contents of PayPal's Apple Pay domain association file. Served at `/.well-known/apple-developer-merchantid-domain-association`. |
| `ALLOW_DEMO_CHECKOUT` | No | Set to `true` only if demo checkout should stay available after Stripe or PayPal is connected. Leave unset on a live store. |
| `CONTACT_WEBHOOK_URL` | No | JSON endpoint that receives contact-form posts. |
| `NEWSLETTER_WEBHOOK_URL` | No | JSON endpoint that receives newsletter signups. |

## Checkout and delivery

Prices are read from `data/products.ts` on the server. The browser cannot set the amount.

**Demo mode** (no `STRIPE_SECRET_KEY` and no PayPal client id/secret): the checkout page says no payment will be collected. Confirming the order signs a download token and opens the receipt. The receipt is stamped as a demo. If only one of Stripe or PayPal is configured, that option is shown alone. If both are configured, checkout offers a card button and a Pay with PayPal button. If neither is configured, demo mode stays.

**Stripe mode**: `POST /api/checkout` creates a Checkout Session with `price_data` in USD and redirects the buyer to Stripe. You do not have to pre-create Products in the dashboard. Success returns to `/checkout/success?session_id=...`. The server retrieves the session, checks `payment_status === "paid"`, recomputes the files from the catalog, and signs the same kind of token. Cancel returns to `/checkout?canceled=1`. The cart in the browser is unchanged until payment is confirmed.

`POST /api/stripe/webhook` verifies `STRIPE_WEBHOOK_SECRET` and acknowledges `checkout.session.completed`. Fulfillment already happens on the success page, which is enough for a single digital delivery. Use the webhook later if you email files from a worker. In the Stripe dashboard, point the endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` and subscribe to `checkout.session.completed`.

**PayPal mode**: `POST /api/paypal/checkout` recomputes the cart from `data/products.ts` (bundle prices included; the browser total is ignored) and creates a PayPal Orders v2 order with `intent: CAPTURE`. The buyer is redirected to PayPal to approve it. Cancel returns to `/cart?canceled=1`. Approval returns to `GET /api/paypal/return`, which captures the order, requires status `COMPLETED`, and checks that the captured currency is USD and the captured amount matches the catalog total. Only then does it sign a download token with the usual 14-day expiry and redirect to the receipt. Private PDFs are not sent before that check. A mismatch or a failed capture sends the buyer back to checkout with an explanation and does not issue a link.

`POST /api/paypal/webhook` verifies the transmission with `PAYPAL_WEBHOOK_ID` when that variable is set. It acknowledges the event and does not release files. Point the webhook at `https://YOUR_DOMAIN/api/paypal/webhook`.

**Apple Pay** uses the same PayPal account and the same Orders v2 capture check. Checkout loads the PayPal JS SDK with `components=applepay` from `GET /api/paypal/config`. That route returns `PAYPAL_CLIENT_ID` and the sandbox or live SDK URL. It does not return `PAYPAL_CLIENT_SECRET`. You do not need `NEXT_PUBLIC_PAYPAL_CLIENT_ID`. The Apple Pay button is rendered only when `ApplePaySession.canMakePayments()` is true and `paypal.Applepay().config()` reports `isEligible`. The Pay with PayPal button, Stripe, and demo checkout stay as they are.

The sheet total is the catalog price. `POST /api/paypal/applepay/order` ignores any amount in the request and creates an order with no PayPal redirect `payment_source` (Apple Pay confirms that order in the browser). `paypal.Applepay().confirmOrder()` sends the Apple Pay token to PayPal. `POST /api/paypal/applepay/capture` then captures on the server and signs the 14-day receipt only when the order status is `COMPLETED` and the captured currency and amount match the catalog total. Cancel and a failed confirm leave the cart in place and do not issue a link.

### PayPal setup

1. Open the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications) and create a REST app. Use the sandbox app while testing, and a live app when you are ready to charge real PayPal accounts.
2. Copy that app's Client ID and Secret.
3. In the Vercel project, set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV` (`sandbox` or `live`). Set `NEXT_PUBLIC_SITE_URL` to the https origin PayPal will redirect back to.
4. Optional: in the same app, add a webhook for `https://YOUR_DOMAIN/api/paypal/webhook` and set `PAYPAL_WEBHOOK_ID` to the webhook id PayPal shows. Checkout works without it.

### Apple Pay setup

Apple Pay is charged through the same PayPal business account. It is not a separate processor. Sandbox support is limited: a sandbox business account often cannot complete a real Apple Pay sheet, and PayPal does not treat sandbox as a substitute for a live domain registration. Plan to verify the button on the production domain.

The button appears only when all of these are true:

- the browser is Safari (macOS) or Safari on iOS
- the device has a card in Wallet (`ApplePaySession.canMakePayments()`)
- PayPal reports the merchant as eligible (`paypal.Applepay().config().isEligible`)
- the page is HTTPS on a domain registered in PayPal's Apple Pay settings

Other browsers keep Pay with PayPal and, when Stripe is configured, the card button.

1. Use a live PayPal business account that is eligible for Apple Pay via PayPal. Advanced Credit and Debit Card Payments has to be approved on that account. A standard sandbox app is not enough for production.
2. Enable Apple Pay under Account settings > Payment methods > Apple Pay. In the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications), switch to Live, open the live REST app, and confirm Apple Pay is enabled under Features (Accept payments > Advanced Credit and Debit Card Payments > Apple Pay).
3. Set `PAYPAL_ENV=live` and set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from that live app. Set `NEXT_PUBLIC_SITE_URL` to the https origin buyers use, with no trailing path.
4. Register that production domain in PayPal's Apple Pay domain settings. In the live app, open Apple Pay and choose Manage, then Add Domain. Register each host that serves checkout. `www` and the apex are different domains. The host you register must be the host Apple will request. A redirect to another host fails registration.
5. Download the domain association file PayPal shows for that domain. Paste the file contents into the Vercel (or host) environment variable `APPLE_PAY_DOMAIN_ASSOCIATION`. Do not wrap the value in quotes and do not commit the file. Redeploy if the host only reads env vars at build time. This app reads the variable on each request.
6. Confirm `https://YOUR_DOMAIN/.well-known/apple-developer-merchantid-domain-association` returns HTTP 200 with the file body, `Content-Type: application/octet-stream`, and no redirect. PayPal and Apple reject a 3xx and reject an HTML page. The route serves the env value as that raw file.
7. Open checkout in Safari on a Mac or iPhone that has a card in Wallet. The Apple Pay button sits beside Pay with PayPal. PayPal's redirect button is unchanged.

`GET /api/paypal/config` is the only place the client id is sent to the browser, inside the PayPal SDK script URL. Never put `PAYPAL_CLIENT_SECRET` in `NEXT_PUBLIC_PAYPAL_CLIENT_ID` or any other public variable.

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
3. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` when you want card charges.
4. Add `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_ENV` when you want PayPal. See the PayPal setup steps above.
5. For Apple Pay, set `PAYPAL_ENV=live`, enable Apple Pay on the live business account, register the production domain, and set `APPLE_PAY_DOMAIN_ASSOCIATION` to the downloaded file. See the Apple Pay setup steps above.
6. Deploy. `npm run build` is the build command. No database is required.

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
- add Stripe keys and a webhook, PayPal REST app credentials, or both
- for Apple Pay, enable it on the live PayPal account, register the domain, and set `APPLE_PAY_DOMAIN_ASSOCIATION`
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
