import { formatSar } from "@/lib/sar";

export type SeoEntry = {
  title: string;
  description: string;
  keyword: string;
};

export const staticSeo = {
  home: {
    title: "Practical PDF Guides | From $6",
    description:
      "Practical PDF guides from $6, with a free sample of each. Online payment is not available yet. All sales are final.",
    keyword: "practical PDF guides instant download",
  },
  shop: {
    title: "Shop PDF Guides and Bundles | From $6",
    description:
      "Shop Vellum Press PDF guides and bundles from $6. Read a free sample first. Online payment is not available yet. All sales are final.",
    keyword: "shop PDF guides and bundles",
  },
  about: {
    title: "About Vellum Press | PDF Guides, Dammam",
    description:
      "Vellum Press in Dammam publishes practical PDF guides you download once and keep. All sales are final.",
    keyword: "Vellum Press PDF guides Dammam",
  },
  contact: {
    title: "Contact Vellum Press | Order Help",
    description:
      "Write to Vellum Press about an order or a download that failed. Email glarz.com@gmail.com. All sales are final.",
    keyword: "contact Vellum Press order help",
  },
  faq: {
    title: "PDF Guide FAQ | All Sales Are Final",
    description:
      "Answers on PDF downloads, the personal license, and why all sales are final. Guides from $6.",
    keyword: "PDF guide download FAQ",
  },
  blog: {
    title: "Journal | PDF Guides from Vellum Press",
    description:
      "Notes on meal prep, budgets, study plans, and freelance work. Each note points to the PDF guide it belongs with.",
    keyword: "Vellum Press journal PDF guides",
  },
  privacy: {
    title: "Privacy Policy | Vellum Press",
    description:
      "How Vellum Press handles email, checkout, and downloads. The publisher is in Dammam. All sales are final.",
    keyword: "Vellum Press privacy policy",
  },
  terms: {
    title: "Terms of Sale | Vellum Press PDFs",
    description:
      "Terms for buying a Vellum Press PDF guide. The license is personal, and all sales are final.",
    keyword: "Vellum Press PDF terms of sale",
  },
  refunds: {
    title: "All Sales Final | Vellum Press PDFs",
    description:
      "All sales are final. No refunds on Vellum Press PDF downloads. Email us if a file is corrupted or missing.",
    keyword: "all sales final no PDF refunds",
  },
  delivery: {
    title: "PDF Download Delivery | Vellum Press",
    description:
      "How the receipt link and PDF delivery work at Vellum Press. Save the file. All sales are final.",
    keyword: "Vellum Press PDF download delivery",
  },
  cart: {
    title: "Your Cart | Vellum Press PDFs",
    description: "Review the PDF guides in your cart. All sales are final. Online payment is not available yet.",
    keyword: "Vellum Press PDF cart",
  },
  checkout: {
    title: "Checkout | Vellum Press PDF Guides",
    description: "Checkout for Vellum Press PDF guides. Online payment is not available yet. All sales are final.",
    keyword: "Vellum Press PDF checkout",
  },
  success: {
    title: "Payment Confirmation | Vellum Press",
    description: "Confirming your Vellum Press payment. The download starts on the receipt page.",
    keyword: "Vellum Press payment confirmation",
  },
  orders: {
    title: "Your PDF Receipt | Vellum Press",
    description: "Download the PDF guides from your Vellum Press receipt. Save the files. All sales are final.",
    keyword: "Vellum Press PDF receipt",
  },
  notFound: {
    title: "Page Not Found | Vellum Press",
    description: "That page was not found. Browse the shop, or switch to Arabic. Free samples are still available.",
    keyword: "Vellum Press page not found",
  },
  arabicHome: {
    title: "أدلة PDF عملية | من 6 دولارات",
    description:
      "أدلة PDF عملية من 6 دولارات، مع عيّنة مجانية لكل دليل. الدفع عبر الإنترنت غير متاح حاليًا. كل المبيعات نهائية.",
    keyword: "شراء أدلة PDF تنزيل فوري",
  },
  arabicBlog: {
    title: "مدونة PDF | قوالب وخطط للشراء",
    description:
      "مقالات قبل الشراء: قالب سيرة ATS، وثيقة العمل الحر، جدول ميزانية، وخطة نزول الوزن. الدليل باللغة الإنجليزية.",
    keyword: "مقالات شراء قوالب وخطط PDF",
  },
  arabicShop: {
    title: "تسوق أدلة وباقات PDF | من $6",
    description:
      "تسوق أدلة PDF وباقات من 6 دولارات. عيّنة مجانية لكل دليل. الدليل باللغة الإنجليزية. الدفع غير متاح حاليًا. كل المبيعات نهائية.",
    keyword: "تسوق أدلة PDF",
  },
  arabicAbout: {
    title: "عن Vellum Press | أدلة PDF بالدمام",
    description:
      "تصدر Vellum Press في الدمام أدلة PDF عملية تنزّلها مرة وتحتفظ بها. الدليل باللغة الإنجليزية. كل المبيعات نهائية.",
    keyword: "عن Vellum Press الدمام",
  },
  arabicContact: {
    title: "تواصل مع Vellum Press | مساعدة الطلب",
    description: "راسل Vellum Press عن طلب أو تنزيل لم ينجح. البريد glarz.com@gmail.com. كل المبيعات نهائية.",
    keyword: "تواصل مساعدة طلب PDF",
  },
  arabicFaq: {
    title: "أسئلة تنزيل PDF | المبيعات نهائية",
    description:
      "إجابات عن تنزيل PDF والترخيص الشخصي وأن كل المبيعات نهائية. الأدلة من 6 دولارات. الدليل باللغة الإنجليزية.",
    keyword: "أسئلة تنزيل PDF",
  },
  arabicPrivacy: {
    title: "سياسة الخصوصية | Vellum Press",
    description: "سياسة الخصوصية لمشتريات PDF والبريد في Vellum Press. الناشر في الدمام. كل المبيعات نهائية.",
    keyword: "سياسة الخصوصية",
  },
  arabicTerms: {
    title: "شروط بيع أدلة PDF | Vellum",
    description: "شروط شراء دليل PDF من Vellum Press. ترخيص شخصي، وكل المبيعات نهائية. الدليل باللغة الإنجليزية.",
    keyword: "شروط بيع أدلة PDF",
  },
  arabicRefunds: {
    title: "كل المبيعات نهائية | بلا استرداد",
    description: "كل المبيعات نهائية. لا استرداد لتنزيلات PDF من Vellum Press. راسلنا إذا كان الملف تالفًا أو ناقصًا.",
    keyword: "كل المبيعات نهائية",
  },
  arabicDelivery: {
    title: "سياسة التنزيل الفوري لملفات PDF",
    description: "كيف يعمل رابط الإيصال وتسليم ملف PDF في Vellum Press. كل المبيعات نهائية.",
    keyword: "سياسة التنزيل الفوري",
  },
  arabicCart: {
    title: "سلة أدلة PDF | Vellum Press",
    description: "راجع أدلة PDF في سلتك. كل المبيعات نهائية. الدفع عبر الإنترنت غير متاح حاليًا.",
    keyword: "سلة أدلة PDF",
  },
  arabicCheckout: {
    title: "إتمام شراء أدلة PDF",
    description: "إتمام الطلب لأدلة Vellum Press. الدفع عبر الإنترنت غير متاح حاليًا. كل المبيعات نهائية.",
    keyword: "إتمام شراء أدلة PDF",
  },
  arabicSuccess: {
    title: "تأكيد دفع أدلة PDF",
    description: "جارٍ تأكيد دفع أدلة PDF. يبدأ التنزيل من صفحة الإيصال. كل المبيعات نهائية.",
    keyword: "تأكيد دفع PDF",
  },
  arabicOrders: {
    title: "تنزيل أدلة PDF | الإيصال",
    description: "نزّل أدلة PDF من إيصال Vellum Press. احفظ الملفات. كل المبيعات نهائية.",
    keyword: "تنزيل أدلة PDF إيصال",
  },
  arabicNotFound: {
    title: "الصفحة غير موجودة | Vellum Press",
    description: "هذه الصفحة غير موجودة. تصفّح المتجر، أو انتقل إلى الإنجليزية. العيّنات المجانية ما زالت متاحة.",
    keyword: "صفحة غير موجودة",
  },
} as const satisfies Record<string, SeoEntry>;

function productEntry(title: string, description: string, keyword: string): SeoEntry {
  return { title, description, keyword };
}

export const productSeo: Record<string, SeoEntry> = {
  "12-week-reset": productEntry(
    "The 12-Week Reset | Fat-loss PDF, $14.50",
    "The 12-Week Reset is a $14.50 fat-loss PDF: protein targets, steps, no-gym sessions, and a tracker. Free sample. Not medical advice.",
    "The 12-Week Reset PDF",
  ),
  "weeknight-table": productEntry(
    "Weeknight Table | Meal-prep PDF, $12",
    "Weeknight Table is a $12 meal-prep PDF: a Sunday plan, recipes, and shopping lists. Free sample. Not a medical diet.",
    "Weeknight Table PDF",
  ),
  "floor-and-form": productEntry(
    "Floor & Form | Home-workout PDF, $13.50",
    "Floor & Form is a $13.50 workout PDF: three home sessions and an eight-week plan. Free sample. Not medical advice.",
    "Floor & Form PDF",
  ),
  "the-quiet-budget": productEntry(
    "The Quiet Budget | Monthly planner, $11",
    "The Quiet Budget is an $11 planner for spending, saving, and debt. One evening to start. Free sample. Not financial advice.",
    "The Quiet Budget PDF",
  ),
  "habit-ledger": productEntry(
    "The Habit Ledger | Weekly planner, $9.50",
    "The Habit Ledger is a $9.50 weekly planner: a one-page review and a thirty-day ledger you can print. Free sample.",
    "The Habit Ledger PDF",
  ),
  "first-client": productEntry(
    "First Client | Freelance kit PDF, $16",
    "First Client is a $16 freelance PDF: an offer, pricing, and a proposal outline. Free sample. No income promise. Not legal advice.",
    "First Client PDF",
  ),
  "exam-room-method": productEntry(
    "The Exam Room Method | Study PDF, $10.50",
    "The Exam Room Method is a $10.50 study PDF: retrieval practice, a weekly plan, and an exam-morning checklist. Free sample.",
    "The Exam Room Method PDF",
  ),
  "steady-mind": productEntry(
    "Steady Mind | Stress-relief PDF, $9",
    "Steady Mind is a $9 stress-relief PDF: short practices and a four-week plan. Free sample. Not therapy or medical advice.",
    "Steady Mind PDF",
  ),
  "saudi-freelancer-starter-kit": productEntry(
    "Saudi Freelancer Starter Kit | $8.50",
    "The Saudi Freelancer Starter Kit is an $8.50 PDF: a freelance.sa checklist, SAR pricing, a proposal, and an invoice. Not legal advice.",
    "Saudi Freelancer Starter Kit PDF",
  ),
  "irregular-income-budget": productEntry(
    "Irregular-Income Budget + Invoice Sheets | $7.50",
    "Irregular-Income Budget + Invoice Sheets is a $7.50 PDF. Plan from a low month and track invoices. Not financial advice.",
    "Irregular-Income Budget PDF",
  ),
  "gulf-ats-cv-kit": productEntry(
    "Saudi & Gulf Job-Search and ATS CV Kit | $6",
    "The Saudi & Gulf Job-Search and ATS CV Kit is a $6 PDF: a single-column CV, a cover letter, and interview notes. No job promise.",
    "Saudi and Gulf ATS CV kit",
  ),
  "health-fitness-bundle": productEntry(
    "Health & Fitness Bundle | 3 PDFs, $29.50",
    "Health & Fitness Bundle is $29.50 (list $40): The 12-Week Reset, Weeknight Table, and Floor & Form. Not medical advice.",
    "Health & Fitness Bundle",
  ),
  "work-money-bundle": productEntry(
    "Work & Money Bundle | 3 PDFs, $29",
    "Work & Money Bundle is $29 (list $36.50): The Quiet Budget, The Habit Ledger, and First Client.",
    "Work & Money Bundle",
  ),
  "gulf-work-bundle": productEntry(
    "Gulf Work Bundle | 3 PDFs, $18",
    "Gulf Work Bundle is $18 (list $22): Saudi Freelancer Starter Kit, Irregular-Income Budget + Invoice Sheets, and the Gulf CV kit.",
    "Gulf Work Bundle",
  ),
};

export const arabicProductSeo: Record<string, SeoEntry> = {
  "12-week-reset": productEntry(
    "خطة نزول وزن PDF | $14.50",
    `نزّل خطة نزول الوزن PDF بـ $14.50 (حوالي ${formatSar(14.5)}). الدليل باللغة الإنجليزية. محتوى تعليمي وليس نصيحة طبية.`,
    "خطة نزول الوزن PDF",
  ),
  "weeknight-table": productEntry(
    "وصفات تحضير أسبوعي PDF | $12",
    `نزّل دليل تحضير الأكل الأسبوعي PDF بـ $12 (حوالي ${formatSar(12)}). الدليل باللغة الإنجليزية. ليس نظامًا طبيًا.`,
    "خطة وجبات أسبوعية PDF",
  ),
  "floor-and-form": productEntry(
    "تمارين منزلية PDF | $13.50",
    `نزّل خطة تمارين منزلية بدون أدوات PDF بـ $13.50 (حوالي ${formatSar(13.5)}). الدليل باللغة الإنجليزية. ليست نصيحة طبية.`,
    "تمارين منزلية بدون أدوات PDF",
  ),
  "the-quiet-budget": productEntry(
    "جدول ميزانية شهرية PDF | $11",
    `نزّل جدول ميزانية شهرية PDF بـ $11 (حوالي ${formatSar(11)}). الدليل باللغة الإنجليزية. ليس استشارة مالية.`,
    "جدول ميزانية شهرية PDF",
  ),
  "habit-ledger": productEntry(
    "مخطط عادات أسبوعي PDF | $9.50",
    `نزّل مخطط العادات والمراجعة الأسبوعية PDF بـ $9.50 (حوالي ${formatSar(9.5)}). الدليل باللغة الإنجليزية.`,
    "مخطط عادات أسبوعي PDF",
  ),
  "first-client": productEntry(
    "دليل أول عميل PDF | $16",
    `نزّل دليل أول عميل حر PDF بـ $16 (حوالي ${formatSar(16)}). الدليل باللغة الإنجليزية. لا وعد بدخل. ليس استشارة قانونية.`,
    "دليل أول عميل PDF",
  ),
  "exam-room-method": productEntry(
    "خطة مذاكرة للاختبار PDF | $10.50",
    `نزّل خطة مذاكرة للاختبار PDF بـ $10.50 (حوالي ${formatSar(10.5)}). الدليل باللغة الإنجليزية. لا وعد بدرجة.`,
    "خطة مذاكرة للاختبار PDF",
  ),
  "steady-mind": productEntry(
    "دليل هدوء وتوتر PDF | $9",
    `نزّل دليل تمارين هدوء قصيرة PDF بـ $9 (حوالي ${formatSar(9)}). الدليل باللغة الإنجليزية. ليس علاجًا نفسيًا.`,
    "دليل تخفيف التوتر PDF",
  ),
  "saudi-freelancer-starter-kit": productEntry(
    "دليل العمل الحر PDF | $8.50",
    `نزّل دليل وثيقة العمل الحر والتسعير PDF بـ $8.50 (حوالي ${formatSar(8.5)}). الدليل باللغة الإنجليزية. ليس استشارة قانونية.`,
    "وثيقة العمل الحر دليل PDF",
  ),
  "irregular-income-budget": productEntry(
    "ميزانية دخل متغير PDF | $7.50",
    `نزّل قالب ميزانية للدخل غير الثابت PDF بـ $7.50 (حوالي ${formatSar(7.5)}). الدليل باللغة الإنجليزية. ليس استشارة مالية.`,
    "قالب ميزانية دخل متغير PDF",
  ),
  "gulf-ats-cv-kit": productEntry(
    "قالب سيرة ATS للخليج | $6",
    `نزّل قالب سيرة ذاتية ATS PDF بـ $6 (حوالي ${formatSar(6)}). الدليل باللغة الإنجليزية. لا وعد بوظيفة.`,
    "قالب سيرة ذاتية ATS",
  ),
  "health-fitness-bundle": productEntry(
    "باقة صحة ولياقة PDF | $29.50",
    `نزّل باقة 3 أدلة PDF بـ $29.50 (حوالي ${formatSar(29.5)}). الدليل باللغة الإنجليزية. ليست استشارة طبية.`,
    "باقة صحة ولياقة PDF",
  ),
  "work-money-bundle": productEntry(
    "باقة عمل ومال PDF | $29",
    `نزّل باقة الميزانية والعادات وأول عميل PDF بـ $29 (حوالي ${formatSar(29)}). الدليل باللغة الإنجليزية.`,
    "باقة عمل ومال PDF",
  ),
  "gulf-work-bundle": productEntry(
    "باقة عمل الخليج PDF | $18",
    `نزّل باقة العمل الحر والميزانية والسيرة PDF بـ $18 (حوالي ${formatSar(18)}). الدليل باللغة الإنجليزية.`,
    "باقة عمل الخليج PDF",
  ),
};

export const categorySeo: Record<string, SeoEntry> = {
  health: productEntry(
    "Health & Nutrition PDF Guides | From $12",
    "Health and nutrition PDFs from $12: The 12-Week Reset and Weeknight Table. Free samples. Not medical advice.",
    "health and nutrition PDF guides",
  ),
  fitness: productEntry(
    "Home Fitness PDF Guides | From $13.50",
    "Floor & Form is a $13.50 home-workout PDF: floor sessions and an eight-week plan. Free sample. Not medical advice.",
    "home fitness PDF guides",
  ),
  finance: productEntry(
    "Personal Finance PDF Guides | From $7.50",
    "Finance PDFs from $7.50: The Quiet Budget and Irregular-Income Budget + Invoice Sheets. Free samples. Not financial advice.",
    "personal finance PDF guides",
  ),
  productivity: productEntry(
    "Productivity PDF Guides | The Habit Ledger",
    "The Habit Ledger is a $9.50 weekly planner: a one-page review and a thirty-day ledger. Free sample. All sales are final.",
    "productivity PDF guides",
  ),
  career: productEntry(
    "Freelance & Work PDF Guides | From $6",
    "Work PDFs from $6: First Client, the Saudi Freelancer Starter Kit, and the Gulf ATS CV kit. Not legal advice.",
    "freelance and work PDF guides",
  ),
  learning: productEntry(
    "Study Skills PDF Guides | Exam Room Method",
    "The Exam Room Method is a $10.50 study PDF: retrieval practice and a weekly plan. Free sample. No score promise.",
    "study skills PDF guides",
  ),
  mindfulness: productEntry(
    "Mindfulness PDF Guides | Steady Mind",
    "The mindfulness guide is Steady Mind, a $9 PDF of short practices and a four-week plan. Free sample. Not therapy or medical advice.",
    "mindfulness PDF guides",
  ),
  bundles: productEntry(
    "PDF Guide Bundles | From $18",
    "Bundles from $18: Health & Fitness, Work & Money, and Gulf Work. Each costs less than the guides alone. All sales are final.",
    "PDF guide bundles",
  ),
};

export const arabicCategorySeo: Record<string, SeoEntry> = {
  health: productEntry(
    "أدلة صحة وتغذية PDF | من $12",
    "أدلة صحة وتغذية PDF من $12. الدليل باللغة الإنجليزية. عيّنة مجانية. ليست نصيحة طبية. كل المبيعات نهائية.",
    "أدلة صحة وتغذية PDF",
  ),
  fitness: productEntry(
    "أدلة تمارين منزلية PDF | $13.50",
    "دليل تمارين منزلية PDF بـ $13.50. الدليل باللغة الإنجليزية. عيّنة مجانية. ليست نصيحة طبية. كل المبيعات نهائية.",
    "أدلة تمارين منزلية PDF",
  ),
  finance: productEntry(
    "أدلة المال الشخصي PDF | من $7.50",
    "أدلة ميزانية PDF من $7.50. الدليل باللغة الإنجليزية. عيّنة مجانية. ليست استشارة مالية. كل المبيعات نهائية.",
    "أدلة المال الشخصي PDF",
  ),
  productivity: productEntry(
    "دليل عادات وإنتاجية PDF | $9.50",
    "مخطط عادات أسبوعي PDF بـ $9.50. الدليل باللغة الإنجليزية. عيّنة مجانية. كل المبيعات نهائية.",
    "دليل عادات وإنتاجية PDF",
  ),
  career: productEntry(
    "أدلة العمل الحر والوظيفة | من $6",
    "أدلة عمل حر وسيرة ATS من $6. الدليل باللغة الإنجليزية. عيّنة مجانية. ليست استشارة قانونية. كل المبيعات نهائية.",
    "أدلة العمل الحر PDF",
  ),
  learning: productEntry(
    "أدلة مهارات الدراسة PDF | $10.50",
    "خطة مذاكرة للاختبار PDF بـ $10.50. الدليل باللغة الإنجليزية. عيّنة مجانية. لا وعد بدرجة. كل المبيعات نهائية.",
    "أدلة مهارات الدراسة PDF",
  ),
  mindfulness: productEntry(
    "أدلة هدوء وانتباه PDF | $9",
    "دليل تمارين هدوء PDF بـ $9. الدليل باللغة الإنجليزية. عيّنة مجانية. ليس علاجًا نفسيًا. كل المبيعات نهائية.",
    "أدلة هدوء PDF",
  ),
  bundles: productEntry(
    "باقات أدلة PDF | من $18",
    "باقات أدلة PDF من $18. الدليل باللغة الإنجليزية. السعر أقل من شراء الأدلة منفصلة. كل المبيعات نهائية.",
    "باقات أدلة PDF",
  ),
};

export const arabicLegacyPostSeo: Record<string, SeoEntry> = {
  "sunday-prep-that-holds": productEntry(
    "خطة تحضير وجبات PDF حتى الخميس",
    "خطة تحضير وجبات تصمد حتى الخميس. دليل التحضير الأسبوعي PDF بـ $12. الدليل باللغة الإنجليزية. ليس نظامًا طبيًا.",
    "خطة تحضير وجبات PDF",
  ),
  "one-evening-budget-reset": productEntry(
    "إعادة ضبط الميزانية في أمسية واحدة",
    "أعد ضبط ميزانية شهرية في أمسية واحدة. جدول الميزانية PDF بـ $11. الدليل باللغة الإنجليزية. ليس استشارة مالية.",
    "إعادة ضبط الميزانية",
  ),
  "stop-rereading-your-notes": productEntry(
    "خطة مذاكرة PDF بلا إعادة قراءة",
    "استبدل إعادة القراءة بخطة استرجاع. خطة المذاكرة PDF بـ $10.50. الدليل باللغة الإنجليزية. لا وعد بدرجة.",
    "خطة مذاكرة PDF",
  ),
  "side-hustle-beside-a-job": productEntry(
    "عمل جانبي PDF إلى جانب الوظيفة",
    "ضيّق عرض العمل الحر وضع حدًا للسعر وأنت موظف. دليل أول عميل PDF بـ $16. الدليل باللغة الإنجليزية. لا وعد بدخل.",
    "عمل جانبي PDF",
  ),
};

export const legacyPostSeo: Record<string, SeoEntry> = {
  "sunday-prep-that-holds": productEntry(
    "Weeknight Table: Sunday Prep That Holds",
    "A meal prep you can cook on Sunday and still eat on Thursday. It pairs with Weeknight Table, $12. Not a medical diet.",
    "Weeknight Table Sunday prep",
  ),
  "one-evening-budget-reset": productEntry(
    "The Quiet Budget: One Evening",
    "Reset a monthly budget in one evening. The Quiet Budget PDF is $11. Not financial advice.",
    "The Quiet Budget one evening",
  ),
  "stop-rereading-your-notes": productEntry(
    "The Exam Room Method: Stop Rereading",
    "Replace rereading with retrieval practice. The Exam Room Method PDF is $10.50. No score promise.",
    "The Exam Room Method retrieval",
  ),
  "side-hustle-beside-a-job": productEntry(
    "First Client: A Kit Beside a Job",
    "Narrow a freelance offer and set a price floor beside a job. First Client is $16. No income promise.",
    "First Client beside a job",
  ),
};
