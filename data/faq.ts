import { site } from "@/data/site";

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "How do I receive a guide after I pay?",
    answer:
      "Checkout returns you to a receipt page with a download button for each PDF. The link is signed and expires after 14 days by default. Save the files to your own device. There is no physical shipment.",
  },
  {
    question: "Can I print the guides?",
    answer:
      "Yes. A personal license includes printing a copy for yourself or your household. It does not include uploading the file, reselling it, or sharing it with a class, team, or client list.",
  },
  {
    question: "Do I need a subscription or an account?",
    answer:
      `No. Each guide and bundle is a one-time purchase. You do not create an account. Keep the receipt link. If it expires, or a file is missing, email ${site.email} from the purchase address and include the order id. We can re-send a working copy.`,
  },
  {
    question: "Can I get a refund?",
    answer:
      `No. All sales are final. Digital PDF guides and bundles are not refundable. If a file is corrupted, missing, or the download link fails, email ${site.email} with your order id and the email you used at checkout and we will re-send a working copy. That is a replacement of the file, not a return of the price you paid. Read the all-sales-final policy for the full terms.`,
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
    answer: `Online payment opens very soon. Email ${site.email} to be notified, or to request the file. Until a payment provider is turned on, checkout does not show a card form and nothing is charged. The free sample still downloads.`,
  },
  {
    question: "Can I pay with Apple Pay?",
    answer: `Not on this store today. Apple Pay is not offered. Email ${site.email} if you want a note when online payment opens.`,
  },
  {
    question: "Why is there no pay button?",
    answer:
      "Online payment is not open yet. The product, cart, and checkout pages say so and give an email address. They do not show a button that fails, and they do not give away the full file.",
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
