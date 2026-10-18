export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "How do I receive a guide after I pay?",
    answer:
      "Checkout returns you to a receipt page with a download button for each PDF. The link is signed and expires after the window set by the store, 14 days by default. Save the files to your own device. There is no physical shipment.",
  },
  {
    question: "Can I print the guides?",
    answer:
      "Yes. A personal license includes printing a copy for yourself or your household. It does not include uploading the file, reselling it, or sharing it with a class, team, or client list.",
  },
  {
    question: "Do I need a subscription or an account?",
    answer:
      "No. Each guide and bundle is a one-time purchase. You do not create an account. Keep the receipt link, or email support if you need a fresh link inside the refund window and can confirm the purchase email.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "You can request a refund within 30 days of purchase by emailing the support address with your order id and the email you used at checkout. Payments are processed by PayPal, so the refund goes back through PayPal to the original method: the card, the PayPal balance, or Apple Pay. Demo orders do not charge anything, so there is nothing to refund. Read the refund policy for the full terms.",
  },
  {
    question: "Which devices open the PDFs?",
    answer:
      "Any current PDF reader on a phone, tablet, or computer. The files are standard PDFs with selectable text, headings, tables, and checklists. They are not locked to a proprietary app.",
  },
  {
    question: "Are the health and stress guides medical advice?",
    answer:
      "No. Guides on weight, food, exercise, and stress are educational. They include disclaimers, red flags, and pointers toward licensed care. They are not a diagnosis, a diet prescription, or therapy. If you are in crisis in the United States, call or text 988.",
  },
  {
    question: "How can I pay?",
    answer:
      "Payments are processed by PayPal. You can pay with a card or your PayPal balance. Apple Pay appears on Safari on a Mac, iPhone, or iPad that has a card in Wallet, when the store is served over HTTPS on a domain registered with PayPal. Other browsers still offer the card and PayPal balance checkout. The receipt is issued only after PayPal confirms the payment and the amount matches the price on the site.",
  },
  {
    question: "Can I pay with Apple Pay?",
    answer:
      "Yes, where Apple Pay is available. The Apple Pay button is processed by PayPal and appears in Safari when this device has a card in Wallet and the store's domain is registered for Apple Pay. If you do not see it, pay with a card or your PayPal balance on the PayPal page. Vellum Press never sees your card number or your PayPal password.",
  },
  {
    question: "Why does checkout say it is a demo?",
    answer:
      "That label appears when PayPal is not configured. No payment form is shown and no charge is made. The demo still opens a download receipt so delivery can be reviewed. Once PayPal is connected, checkout charges through PayPal and the demo path turns off.",
  },
  {
    question: "Can I share a file with a friend?",
    answer:
      "The license is personal. Send them the product page, not the file. Bulk or classroom use needs written permission.",
  },
  {
    question: "Will you email me a new copy if I lose the download?",
    answer:
      "Email support from the address you used at checkout and include the order id on your receipt. We can reissue a link. After the link expires, the receipt page explains that it has expired.",
  },
  {
    question: "Do you update a guide after I buy it?",
    answer:
      "If we correct a meaningful error, we note it in the edition and can send an updated file to the purchase email on request. You are not buying a membership or a stream of new editions.",
  },
];
