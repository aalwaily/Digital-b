import { site } from "@/data/site";

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const note = `These pages are written for ${site.legalName}, a small publisher of digital guides based in ${site.location}. They are a practical starting point, not a law-firm opinion. The owner must still confirm the registered legal name and the commercial registration (or other license) that covers online sales. Governing law is set to ${site.jurisdiction}. Have a lawyer review these pages before you rely on them.`;

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    description: `How ${site.name} handles email addresses, checkout, and data stored in your browser.`,
    updated: "2026-10-18",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "Who we are",
        paragraphs: [
          `${site.legalName} ("we") publishes digital PDF guides. You can reach us at ${site.email}. We are based in ${site.location}.`,
          "This policy describes this store. Online card payment is not open yet. It does not cover third-party sites we link to.",
        ],
      },
      {
        heading: "What we collect",
        paragraphs: [
          "When online payment is open, checkout asks for an email address so we can build your receipt and download link. Card details are entered on the payment provider's pages, not on ours. We do not receive your full card number. Until then, the site asks you to email us and does not charge a card.",
          "The contact form collects your name, email, topic, and message. The newsletter form collects an email address and your consent to hear about new guides. The free-sample form collects an email address in exchange for the sample PDF.",
          "The cart and the theme preference are stored in your browser (local storage). They are not sent to us until you choose to check out.",
        ],
      },
      {
        heading: "What we do not do",
        paragraphs: [
          "We do not sell personal information. We do not ask you to create a password. Google Analytics, the Meta Pixel, and the TikTok Pixel are not loaded unless the store owner sets the matching public id. When one of those ids is set, that provider's script loads, and a completed purchase can send an order id, total, and product names from the receipt page. When the ids are unset, those scripts are not included.",
          "We do not use the health, money, or stress content you might type into a worksheet. Those worksheets live in the PDF on your device.",
        ],
      },
      {
        heading: "Why we use the information",
        paragraphs: [
          "We use your email to deliver downloads, send a receipt, respond to support requests (including a request to re-send a file that is corrupted, missing, or whose download link failed), and, if you opted in, to send occasional notes about new guides. You can unsubscribe from those notes by replying to one.",
          "If a contact webhook URL is configured, contact-form submissions are forwarded to that endpoint. If it is not, the contact form is validated and nothing is emailed, and the form says so. Newsletter signups and free-sample requests are forwarded when a newsletter webhook URL is set. Otherwise they are written to the server log, and the form still confirms that the address was recorded.",
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
          "No payment processor is contacted while online payment is closed. Stripe and Moyasar are not offered unless the owner explicitly enables them. Hala is not offered unless the payment provider flag is set to hala. If a provider is enabled, that company processes the payment under its own privacy policy.",
          "If you deploy this store, your host (for example Vercel) will also process technical logs such as IP address and user agent as part of running the site. Review that host's policy.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "This store does not include a database of orders. A payment provider, once enabled, retains payments according to its own policy. Newsletter and free-sample addresses are sent to the configured webhook, or, when no webhook is set, written to the server log. Webhook forwards are retained by whatever service receives them.",
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
          `Email ${site.supportEmail} to ask what a given address was used for, to request deletion of a newsletter signup or a contact message we still have, or to opt out of non-essential notes. We may keep a record of a purchase where we need it for tax, fraud prevention, or a payment-network dispute.`,
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
    updated: "2026-10-18",
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
          "When your payment is confirmed, we grant you a personal, non-exclusive, non-transferable license to download and use the PDFs for yourself and your household.",
          "You may print a copy for your own use. You may not resell, share, upload, or distribute the files, in whole or in part, and you may not present the text as your own work. Classroom, company, or client use needs written permission from us.",
        ],
      },
      {
        heading: "Prices and checkout",
        paragraphs: [
          "Prices in the catalog are in US dollars and are shown before you pay. We may change prices of future purchases at any time. A confirmed order keeps the price you paid.",
          "Catalog prices are in US dollars. Online payment is not open yet, so checkout does not charge a card and does not issue the full file. Email us if you want a note when payment opens, or if you want to request a file. When a provider is enabled, that provider processes the payment and we do not see your full card number.",
          "You must provide an email address you can access. The download link is tied to that address and to the products in the order.",
          "All sales are final. A completed purchase of a digital PDF is not refundable. See the all-sales-final policy for the replacement we offer when a file is corrupted, missing, or the download link fails.",
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
          `Questions about these terms: ${site.email}. Download problems: ${site.supportEmail}.`,
        ],
      },
    ],
  },
  {
    slug: "refunds",
    title: "All sales are final",
    description: `Digital PDF purchases from ${site.name} are final. There are no refunds. If a file is corrupted, missing, or the download link fails, email ${site.email} and we will re-send a working copy.`,
    updated: "2026-10-18",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "No refunds",
        paragraphs: [
          "Every guide and bundle on this store is a digital download. All sales are final. We do not offer refunds, returns, or exchanges, and we do not return the price you paid.",
          "A change of mind, a result you hoped for (a grade, a client, a habit, or a mood), or deciding the guide was not the right fit does not entitle you to the price back. The products are education, not outcomes. Checkout states this before you pay.",
        ],
      },
      {
        heading: "A working copy, not a refund",
        paragraphs: [
          `If a file is corrupted, missing, or the download link fails, email ${site.email} from the address you used at checkout. Include the order id from your receipt and the name of the guide. We will re-send a working copy or a fresh download link.`,
          "That replacement is the file you already bought. It is not a refund, and it does not change the price you paid. Asking for a file before payment is open is not a sale, and there is no charge to reverse.",
        ],
      },
      {
        heading: "Bundles",
        paragraphs: [
          "A bundle is one purchase of several PDFs at a single price. The sale is final, the same as a single guide. If one file in the bundle is corrupted, missing, or will not download, we will re-send that file. We do not split a bundle or return part of the price.",
        ],
      },
      {
        heading: "Your license stays",
        paragraphs: [
          "Because the sale is final, the personal license described in the terms continues after delivery. You still may not resell, share, upload, or distribute the files. Re-sending a working copy does not add seats or a new license.",
        ],
      },
      {
        heading: "Chargebacks",
        paragraphs: [
          `If you do not recognize a charge, email ${site.email} before opening a dispute with your bank or card provider so we can look at the order. A chargeback does not expand the license, and we will answer the payment network with the order record. Opening a dispute is not a refund from this store.`,
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Digital delivery policy",
    description: "How PDF delivery, download links, and reprints of a lost file work.",
    updated: "2026-10-18",
    sections: [
      { heading: "Read this first", paragraphs: [note] },
      {
        heading: "Instant delivery",
        paragraphs: [
          "There is no shipping. After the payment provider confirms the payment, you land on a receipt page with a download button for each full PDF you bought. A bundle lists each included guide. Until online payment is open, the full files are not released from checkout.",
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
        heading: "Failed payments",
        paragraphs: [
          "If you cancel a payment, you return to the cart or stay on checkout. Nothing is charged and the full files stay locked.",
          "While online payment is closed, checkout explains that and asks you to email us. That page is not a receipt and it is not proof of payment.",
        ],
      },
      {
        heading: "Outages",
        paragraphs: [
          `If a file is corrupted, missing, or the download link fails, email ${site.supportEmail} and we will re-send a working copy. Keep the error text if you have it. Replacing the file does not refund the purchase. All sales are final.`,
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
