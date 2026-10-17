import { site } from "@/data/site";

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const note = `These terms are written for ${site.legalName}, a small publisher of digital guides based in ${site.location}. They are a practical starting point, not a law-firm opinion. Replace the business identity in data/site.ts and have a lawyer review them before you take live payments. Governing law is set to ${site.jurisdiction}.`;

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    description: `How ${site.name} handles email addresses, checkout, and data stored in your browser.`,
    updated: "2026-04-01",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "Who we are",
        paragraphs: [
          `${site.legalName} ("we") publishes digital PDF guides. You can reach us at ${site.email}. We are based in ${site.location}.`,
          "This policy describes the demo store and the same store after Stripe is connected. It does not cover third-party sites we link to.",
        ],
      },
      {
        heading: "What we collect",
        paragraphs: [
          "Checkout asks for an email address so we can build your receipt and download link. If you pay with Stripe, Stripe collects payment details on Stripe's pages. We do not receive your full card number.",
          "The contact form collects your name, email, topic, and message. The newsletter form collects an email address and your consent to hear about new guides.",
          "The cart and the theme preference are stored in your browser (local storage). They are not sent to us until you choose to check out.",
        ],
      },
      {
        heading: "What we do not do",
        paragraphs: [
          "We do not sell personal information. We do not run third-party advertising trackers on this site. We do not ask you to create a password.",
          "We do not use the health, money, or stress content you might type into a worksheet. Those worksheets live in the PDF on your device.",
        ],
      },
      {
        heading: "Why we use the information",
        paragraphs: [
          "We use your email to deliver downloads, send a receipt, respond to support and refund requests, and, if you opted in, to send occasional notes about new guides. You can unsubscribe from those notes by replying to one.",
          "If a webhook URL is configured by the owner, form submissions are forwarded to that endpoint so they can reach an inbox. If it is not configured, the form is validated and nothing is emailed. The form tells you which of those happened.",
        ],
      },
      {
        heading: "Download links",
        paragraphs: [
          `After purchase we sign a download token that contains the order id, the email you entered, the product names, and an expiry. The default expiry is ${site.downloadDays} days. Anyone with the link can download the files until it expires, so treat it like a receipt you do not post publicly.`,
          "The token is checked on our server. The full PDFs are not sitting in a public folder.",
        ],
      },
      {
        heading: "Processors",
        paragraphs: [
          "Stripe, Inc. processes live card payments under its own privacy policy when Stripe keys are configured. In demo mode no payment processor is contacted.",
          "If you deploy this store, your host (for example Vercel) will also process technical logs such as IP address and user agent as part of running the site. Review that host's policy.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "This template does not include a database. Live Stripe payments are retained by Stripe according to Stripe's retention and your dashboard settings. Webhook forwards, if you add them, are retained by whatever service receives them.",
          "Download tokens expire on their own. They are not a permanent archive of your library. Save the PDFs.",
        ],
      },
      {
        heading: "Children",
        paragraphs: [
          "The store is meant for adults buying educational PDFs. We do not knowingly collect personal information from children under 16. If you believe a child has given us an email, write to us and we will delete it from any inbox we control.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          `Email ${site.supportEmail} to ask what a given address was used for, to request deletion of a newsletter signup or a contact message we still have, or to opt out of non-essential notes. We may keep a record of a purchase where we need it for tax, fraud prevention, or a refund dispute.`,
          "You can clear the cart and theme preference in your browser settings.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "If we change this policy, we will update the date at the top of the page. Continued use of the site after the change means you have the new policy available. Material changes to how we use email will be described on this page before they take effect.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of service",
    description: `The license, the rules of purchase, and the limits of what a ${site.name} guide promises.`,
    updated: "2026-04-01",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "Agreement",
        paragraphs: [
          `By using this website or buying a guide, you agree to these terms. If you do not agree, do not buy a file. The seller is ${site.legalName}, ${site.location}.`,
        ],
      },
      {
        heading: "The products",
        paragraphs: [
          "Guides and bundles are digital PDFs delivered by download. A bundle is several PDFs sold together at a discount. Page counts on the site describe the current edition.",
          "Health, fitness, nutrition, and stress guides are educational. They are not medical advice, diagnosis, or treatment, and they are not a substitute for a licensed clinician. Finance guides are not financial, tax, or investment advice. The freelancing guide is not legal or accounting advice. You are responsible for decisions you make after reading.",
        ],
      },
      {
        heading: "License",
        paragraphs: [
          "When your payment is confirmed, or when a demo order is completed in an unconfigured store, we grant you a personal, non-exclusive, non-transferable license to download and use the PDFs for yourself and your household.",
          "You may print a copy for your own use. You may not resell, share, upload, or distribute the files, in whole or in part, and you may not present the text as your own work. Classroom, company, or client use needs written permission from us.",
        ],
      },
      {
        heading: "Prices and checkout",
        paragraphs: [
          "Prices are in US dollars and are shown before you pay. We may change prices of future purchases at any time. A confirmed order keeps the price you paid.",
          "If Stripe is configured, you pay on Stripe Checkout. If Stripe is not configured, checkout is a labeled demo: no card is charged and the download is issued so the flow can be reviewed. Do not present demo orders as real sales.",
          "You must provide an email address you can access. The download link is tied to that address and to the products in the order.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: [
          "Do not misuse the site, probe it for vulnerabilities, attempt to forge download tokens, or interfere with other people's orders. Do not use the contact form to send unlawful or abusive material.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          `The guides, cover art, and site copy are owned by ${site.legalName} or its licensors. Product names are used to identify the works. The Liberation fonts embedded in the PDFs are licensed under the SIL Open Font License; that license is included with the font files in the repository and does not expand your license to the guide text.`,
        ],
      },
      {
        heading: "Disclaimers",
        paragraphs: [
          "The guides are sold as educational documents. We do not warrant that a guide will produce a particular body weight, grade, income, client, or mood. Results depend on factors a PDF cannot see.",
          "The site is provided as available. We will try to keep downloads working, and we do not promise uninterrupted hosting.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the extent the law allows, our total liability for a purchase is the amount you paid for that purchase. We are not liable for indirect or consequential losses, including lost profits, lost data on your device, or decisions you made from a guide. Some jurisdictions do not allow these limits. In those places, the limits apply only as far as the law permits. Nothing in these terms limits liability that cannot legally be limited.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          `These terms are governed by the laws of ${site.jurisdiction}, excluding conflict-of-law rules. Courts in that jurisdiction are the venue, unless a consumer protection law where you live requires otherwise.`,
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          `Questions about these terms: ${site.email}. Support and refunds: ${site.supportEmail}.`,
        ],
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refund policy",
    description: `How to request a refund within ${site.refundDays} days of buying a ${site.name} guide.`,
    updated: "2026-04-01",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "The window",
        paragraphs: [
          `You may request a refund within ${site.refundDays} days of the purchase. Write to ${site.supportEmail} from the email you used at checkout. Include the order id from your receipt page and the name of the guide.`,
          "We would rather refund a guide that was not right for you than argue about a PDF. Ask plainly.",
        ],
      },
      {
        heading: "How the refund is paid",
        paragraphs: [
          "If you paid with Stripe, we refund the charge to the original payment method. Stripe's timing to your bank can take several business days after we issue it. We refund the amount you paid for the items you return, not an arbitrary portion, unless we agree otherwise in writing.",
          "Demo orders do not charge a card. There is no payment to reverse. The receipt page marks those orders as demos.",
        ],
      },
      {
        heading: "After a refund",
        paragraphs: [
          "Once a refund is issued, your license to those files ends. Delete your copies. Do not keep distributing a file you have been refunded for. We may refuse a repeat pattern of buying, downloading, and refunding.",
        ],
      },
      {
        heading: "What we may decline",
        paragraphs: [
          "We may decline a refund request made after the window, or a request tied to abuse of the license, such as posting the file publicly. If we decline, we will say why.",
          "A guide not matching a result you hoped for, such as a grade or a client, is not by itself outside the refund window. You can still ask within the window. It is also not a promise that the guide failed. The products are education, not outcomes.",
        ],
      },
      {
        heading: "Bundles",
        paragraphs: [
          "A bundle is one purchase. If you want to return it, ask within the window and we will refund the bundle price. We do not split a bundle into partial retail refunds after you have kept one of the files, unless we agree to that in the reply.",
        ],
      },
      {
        heading: "Chargebacks",
        paragraphs: [
          "If you do not recognize a charge, email us before opening a dispute with your bank so we can look at the order. A chargeback does not expand the license, and we will answer the payment network with the order record.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Digital delivery policy",
    description: "How PDF delivery, download links, and reprints of a lost file work.",
    updated: "2026-04-01",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "Instant delivery",
        paragraphs: [
          "There is no shipping. After a successful Stripe payment, or after you confirm a demo order, you land on a receipt page with a download button for each full PDF you bought. A bundle lists each included guide.",
          "Free samples are separate, shorter PDFs. They are available on the product page before you buy and are not a substitute for the full guide.",
        ],
      },
      {
        heading: "The download link",
        paragraphs: [
          `The receipt URL contains a signed token. Our server checks the signature, the expiry, and the file name before it sends a PDF. The default lifetime is ${site.downloadDays} days from the order. You can change that with the DOWNLOAD_LINK_DAYS environment variable.`,
          "The link is a secret. If you forward it, the recipient can download the files until it expires. We cannot tell from the download itself who clicked.",
        ],
      },
      {
        heading: "Save your copy",
        paragraphs: [
          "Download the PDFs and store them somewhere you control. The receipt link is not a permanent library. When it expires, the page explains that, and the buttons stop working.",
          `If the link expires or you lose the files, email ${site.supportEmail} from the purchase email with your order id. We can sign a fresh link for a purchase we can verify. Please do this yourself rather than sharing the old link in a public place.`,
        ],
      },
      {
        heading: "File format",
        paragraphs: [
          "Guides are PDF files with selectable text. You need a standard PDF reader. Files are sized for a desktop or phone screen and for printing on letter paper. We do not ship EPUB, Kindle, or paper copies.",
        ],
      },
      {
        heading: "Failed payments and demo mode",
        paragraphs: [
          "If you cancel Stripe Checkout, you are not charged and no full guide is delivered. Your browser cart remains so you can try again.",
          "Demo mode is labeled on the checkout page. It exists so the store works before Stripe keys are added. A demo receipt is not proof of payment.",
        ],
      },
      {
        heading: "Outages",
        paragraphs: [
          "If a download fails because of a problem on our side, email support and we will reissue the link even if you are inside the original window. Keep the error text if you have it.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
