import { formatSar } from "@/lib/sar";

export type SeoEntry = {
  title: string;
  description: string;
  keyword: string;
};

export const staticSeo = {
  home: {
    title: "Buy PDF Guides | Instant Download",
    description:
      "Buy practical PDF guides and download them instantly. Plans, templates, and kits from $6. PayPal checkout. All sales are final.",
    keyword: "buy PDF guides instant download",
  },
  shop: {
    title: "Shop PDF Guides & Bundles | From $6",
    description:
      "Shop PDF guides and bundles. Download a plan, template, or kit from $6. PayPal checkout. All sales are final.",
    keyword: "shop PDF guides and bundles",
  },
  about: {
    title: "About Vellum Press | PDF Guides, Dammam",
    description:
      "Vellum Press in Dammam sells practical PDF guides you download once and keep. PayPal checkout. All sales are final.",
    keyword: "Vellum Press PDF guides Dammam",
  },
  contact: {
    title: "Contact Vellum Press | PDF Order Help",
    description:
      "Contact Vellum Press about a PDF order or a failed download. Email glarz.com@gmail.com. All sales are final.",
    keyword: "contact PDF order help",
  },
  faq: {
    title: "PDF Download FAQ | PayPal, Sales Final",
    description:
      "FAQ on PDF downloads, PayPal checkout, the personal license, and the all-sales-final policy. Guides from $6.",
    keyword: "PDF download FAQ PayPal",
  },
  blog: {
    title: "PDF Plans & Templates Blog | Vellum",
    description:
      "Buyer guides to PDF plans, templates, and kits: budgets, ATS CVs, Saudi freelance documents, and fat-loss plans.",
    keyword: "PDF plans templates kits blog",
  },
  privacy: {
    title: "Privacy Policy | Vellum Press PDFs",
    description:
      "Privacy policy for Vellum Press PDF purchases, email, and PayPal checkout. The publisher is in Dammam.",
    keyword: "privacy policy PDF store",
  },
  terms: {
    title: "PDF Guide Terms of Sale | Vellum",
    description:
      "Terms for buying a Vellum Press PDF guide. Personal license, PayPal checkout, and all sales are final.",
    keyword: "PDF guide terms of sale",
  },
  refunds: {
    title: "All Sales Final | No PDF Refunds",
    description:
      "All sales are final. No refunds on Vellum Press PDF downloads. Email us if a file is corrupted or missing.",
    keyword: "all sales final no PDF refunds",
  },
  delivery: {
    title: "Instant PDF Download Policy | Vellum",
    description:
      "Instant PDF download after PayPal checkout. How the receipt link and file delivery work at Vellum Press.",
    keyword: "instant PDF download delivery",
  },
  cart: {
    title: "Your PDF Cart | Vellum Press",
    description: "Review PDF guides in your cart before PayPal checkout. All sales are final.",
    keyword: "PDF cart checkout",
  },
  checkout: {
    title: "PayPal Checkout for PDF Guides",
    description: "PayPal checkout for Vellum Press PDF guides. You pay in US dollars. All sales are final.",
    keyword: "PayPal checkout PDF guides",
  },
  success: {
    title: "PDF Payment Confirmation | Vellum",
    description: "Confirming your PDF guide payment. The receipt page is where the download starts.",
    keyword: "PDF payment confirmation",
  },
  orders: {
    title: "Download Your PDF Guides | Receipt",
    description: "Download the PDF guides from your Vellum Press receipt. All sales are final.",
    keyword: "download PDF guides receipt",
  },
  notFound: {
    title: "Page Not Found | Vellum Press PDFs",
    description: "That PDF guide page was not found. Browse the shop or the Arabic pages to buy a download.",
    keyword: "PDF guide page not found",
  },
  arabicHome: {
    title: "أدلة PDF للشراء | تحميل فوري",
    description:
      "اشترِ أدلة PDF وحمّلها فوراً. خطط وقوالب من 6 دولارات. الدفع بـ PayPal، والسعر بالريال تقريبي. المبيعات نهائية.",
    keyword: "شراء أدلة PDF تحميل فوري",
  },
  arabicBlog: {
    title: "مدونة PDF | قوالب وخطط للشراء",
    description:
      "مقالات قبل الشراء: قالب سيرة ATS، وثيقة العمل الحر، جدول ميزانية، وخطة نزول الوزن. الدليل باللغة الإنجليزية.",
    keyword: "مقالات شراء قوالب وخطط PDF",
  },
} as const satisfies Record<string, SeoEntry>;

function productEntry(title: string, description: string, keyword: string): SeoEntry {
  return { title, description, keyword };
}

export const productSeo: Record<string, SeoEntry> = {
  "12-week-reset": productEntry(
    "12-Week Fat Loss Plan PDF | $14.50",
    "Download the 12-week fat loss plan PDF for $14.50. Protein targets, no-gym sessions, and a tracker. Not medical advice.",
    "12 week fat loss plan pdf",
  ),
  "weeknight-table": productEntry(
    "Meal Prep Recipes PDF Download | $12",
    "Download the Weeknight Table meal prep PDF for $12. A Sunday plan, recipes, and shopping lists. Not a medical diet.",
    "meal prep plan pdf",
  ),
  "floor-and-form": productEntry(
    "No-Gym Workout Plan PDF | $13.50",
    "Download the no-gym workout plan PDF for $13.50. Three home sessions and an eight-week progression. Not medical advice.",
    "no gym workout plan pdf",
  ),
  "the-quiet-budget": productEntry(
    "Monthly Budget Planner PDF | $11",
    "Download the monthly budget planner PDF for $11. One evening to plan spending, saving, and debt. Not financial advice.",
    "monthly budget planner pdf",
  ),
  "habit-ledger": productEntry(
    "Weekly Habit Planner PDF | $9.50",
    "Download the weekly habit planner PDF for $9.50. A one-page review and a thirty-day ledger you can print.",
    "weekly habit planner pdf",
  ),
  "first-client": productEntry(
    "First Client Freelance Kit PDF | $16",
    "Download the first client kit PDF for $16. Offer, pricing, and a proposal outline. No income promise. Not legal advice.",
    "first client guide pdf",
  ),
  "exam-room-method": productEntry(
    "Exam Study Plan PDF Download | $10.50",
    "Download the exam study plan PDF for $10.50. Retrieval practice, a weekly plan, and an exam-morning checklist.",
    "exam study plan pdf",
  ),
  "steady-mind": productEntry(
    "Stress Relief Guide PDF | $9",
    "Download the stress relief guide PDF for $9. Short practices and a four-week plan. Not therapy or medical advice.",
    "stress relief guide pdf",
  ),
  "saudi-freelancer-starter-kit": productEntry(
    "Saudi Freelance Kit PDF | $8.50",
    "Download the Saudi freelance kit PDF for $8.50. freelance.sa checklist, SAR pricing, proposal, and invoice. Not legal advice.",
    "Saudi freelance starter kit PDF",
  ),
  "irregular-income-budget": productEntry(
    "Freelance Budget Template PDF | $7.50",
    "Download the freelance budget template PDF for $7.50. Plan from a low month and track invoices. Not financial advice.",
    "freelance budget template for irregular income",
  ),
  "gulf-ats-cv-kit": productEntry(
    "ATS CV Template PDF, Gulf | $6",
    "Download the Gulf ATS CV template PDF for $6. Single-column structure, cover letter, and interview notes. No job promise.",
    "ATS CV template for Saudi jobs",
  ),
  "health-fitness-bundle": productEntry(
    "Health & Fitness PDF Bundle | $29.50",
    "Download three health PDFs for $29.50 (list $40): fat-loss plan, meal prep, and no-gym workouts. Not medical advice.",
    "health and fitness PDF bundle",
  ),
  "work-money-bundle": productEntry(
    "Work & Money PDF Bundle | $29",
    "Download the work and money PDF bundle for $29 (list $36.50): budget planner, habit plan, and first-client kit.",
    "budget and freelance PDF bundle",
  ),
  "gulf-work-bundle": productEntry(
    "Gulf Work PDF Kit Bundle | $18",
    "Download the Gulf work PDF bundle for $18 (list $22): freelance kit, budget template, and ATS CV template.",
    "Saudi freelance CV budget PDF bundle",
  ),
};

export const arabicProductSeo: Record<string, SeoEntry> = {
  "12-week-reset": productEntry(
    "خطة نزول وزن PDF | $14.50",
    `حمّل خطة نزول الوزن PDF بـ $14.50 (نحو ${formatSar(14.5)}). الدليل باللغة الإنجليزية. محتوى تعليمي وليس نصيحة طبية.`,
    "خطة نزول الوزن PDF",
  ),
  "weeknight-table": productEntry(
    "وصفات تحضير أسبوعي PDF | $12",
    `حمّل دليل تحضير الأكل الأسبوعي PDF بـ $12 (نحو ${formatSar(12)}). الدليل باللغة الإنجليزية. ليس نظاماً طبياً.`,
    "خطة وجبات أسبوعية PDF",
  ),
  "floor-and-form": productEntry(
    "تمارين منزلية PDF | $13.50",
    `حمّل خطة تمارين منزلية بدون أدوات PDF بـ $13.50 (نحو ${formatSar(13.5)}). الدليل باللغة الإنجليزية. ليست نصيحة طبية.`,
    "تمارين منزلية بدون أدوات PDF",
  ),
  "the-quiet-budget": productEntry(
    "جدول ميزانية شهرية PDF | $11",
    `حمّل جدول ميزانية شهرية PDF بـ $11 (نحو ${formatSar(11)}). الدليل باللغة الإنجليزية. ليس استشارة مالية.`,
    "جدول ميزانية شهرية PDF",
  ),
  "habit-ledger": productEntry(
    "مخطط عادات أسبوعي PDF | $9.50",
    `حمّل مخطط العادات والمراجعة الأسبوعية PDF بـ $9.50 (نحو ${formatSar(9.5)}). الدليل باللغة الإنجليزية.`,
    "مخطط عادات أسبوعي PDF",
  ),
  "first-client": productEntry(
    "دليل أول عميل PDF | $16",
    `حمّل دليل أول عميل حر PDF بـ $16 (نحو ${formatSar(16)}). الدليل باللغة الإنجليزية. لا وعد بدخل. ليس استشارة قانونية.`,
    "دليل أول عميل PDF",
  ),
  "exam-room-method": productEntry(
    "خطة مذاكرة للاختبار PDF | $10.50",
    `حمّل خطة مذاكرة للاختبار PDF بـ $10.50 (نحو ${formatSar(10.5)}). الدليل باللغة الإنجليزية. لا وعد بدرجة.`,
    "خطة مذاكرة للاختبار PDF",
  ),
  "steady-mind": productEntry(
    "دليل هدوء وتوتر PDF | $9",
    `حمّل دليل تمارين هدوء قصيرة PDF بـ $9 (نحو ${formatSar(9)}). الدليل باللغة الإنجليزية. ليس علاجاً نفسياً.`,
    "دليل تخفيف التوتر PDF",
  ),
  "saudi-freelancer-starter-kit": productEntry(
    "دليل العمل الحر PDF | $8.50",
    `حمّل دليل وثيقة العمل الحر والتسعير PDF بـ $8.50 (نحو ${formatSar(8.5)}). الدليل باللغة الإنجليزية. ليس استشارة قانونية.`,
    "وثيقة العمل الحر دليل PDF",
  ),
  "irregular-income-budget": productEntry(
    "ميزانية دخل متغير PDF | $7.50",
    `حمّل قالب ميزانية للدخل غير الثابت PDF بـ $7.50 (نحو ${formatSar(7.5)}). الدليل باللغة الإنجليزية. ليس استشارة مالية.`,
    "قالب ميزانية دخل متغير PDF",
  ),
  "gulf-ats-cv-kit": productEntry(
    "قالب سيرة ATS للخليج | $6",
    `حمّل قالب سيرة ذاتية ATS PDF بـ $6 (نحو ${formatSar(6)}). الدليل باللغة الإنجليزية. لا وعد بوظيفة.`,
    "قالب سيرة ذاتية ATS",
  ),
  "health-fitness-bundle": productEntry(
    "باقة صحة ولياقة PDF | $29.50",
    `حمّل باقة 3 أدلة PDF بـ $29.50 (نحو ${formatSar(29.5)}). الدليل باللغة الإنجليزية. ليست استشارة طبية.`,
    "باقة صحة ولياقة PDF",
  ),
  "work-money-bundle": productEntry(
    "باقة عمل ومال PDF | $29",
    `حمّل باقة الميزانية والعادات وأول عميل PDF بـ $29 (نحو ${formatSar(29)}). الدليل باللغة الإنجليزية.`,
    "باقة عمل ومال PDF",
  ),
  "gulf-work-bundle": productEntry(
    "باقة عمل الخليج PDF | $18",
    `حمّل باقة العمل الحر والميزانية والسيرة PDF بـ $18 (نحو ${formatSar(18)}). الدليل باللغة الإنجليزية.`,
    "باقة عمل الخليج PDF",
  ),
};

export const legacyPostSeo: Record<string, SeoEntry> = {
  "sunday-prep-that-holds": productEntry(
    "Meal Prep Plan PDF: Sunday That Holds",
    "A meal prep plan you can cook on Sunday and still eat on Thursday. Pairs with the Weeknight Table PDF download, $12.",
    "meal prep plan pdf sunday",
  ),
  "one-evening-budget-reset": productEntry(
    "One-Evening Budget Reset Worksheet",
    "Reset a monthly budget in one evening with four piles and a payday plan. The Quiet Budget PDF is $11. Not financial advice.",
    "one evening budget reset worksheet",
  ),
  "stop-rereading-your-notes": productEntry(
    "Exam Study Plan PDF: Stop Rereading",
    "Replace rereading with a retrieval study plan. The Exam Room Method PDF download is $10.50. No score promise.",
    "exam study plan retrieval practice",
  ),
  "side-hustle-beside-a-job": productEntry(
    "First Client Kit PDF Beside a Job",
    "Narrow a freelance offer and set a price floor beside a job. The First Client PDF kit is $16. No income promise.",
    "first client kit beside a job",
  ),
};
