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
      "Practical PDF guides from $6, with a free sample of each. Online payment opens very soon. All sales are final.",
    keyword: "buy PDF guides instant download",
  },
  shop: {
    title: "Shop PDF Guides & Bundles | From $6",
    description:
      "Shop PDF guides and bundles from $6. Read a free sample first. Online payment opens very soon. All sales are final.",
    keyword: "shop PDF guides and bundles",
  },
  about: {
    title: "About Vellum Press | PDF Guides, Dammam",
    description:
      "Vellum Press in Dammam publishes practical PDF guides you download once and keep. All sales are final.",
    keyword: "Vellum Press PDF guides Dammam",
  },
  contact: {
    title: "Contact Vellum Press | PDF Order Help",
    description:
      "Write to Vellum Press about an order or a failed download. Email glarz.com@gmail.com. All sales are final.",
    keyword: "contact PDF order help",
  },
  faq: {
    title: "PDF Download FAQ | Sales Are Final",
    description:
      "Answers on PDF downloads, the personal license, and the all-sales-final policy. Guides from $6.",
    keyword: "PDF download FAQ",
  },
  blog: {
    title: "PDF Plans & Templates Blog | Vellum",
    description:
      "Notes on PDF plans and templates: budgets, ATS CVs, Saudi freelance documents, and fat-loss plans.",
    keyword: "PDF plans templates kits blog",
  },
  privacy: {
    title: "Privacy Policy | Vellum Press PDFs",
    description:
      "Privacy policy for Vellum Press PDF purchases and email. The publisher is in Dammam.",
    keyword: "privacy policy PDF store",
  },
  terms: {
    title: "PDF Guide Terms of Sale | Vellum",
    description:
      "Terms for buying a Vellum Press PDF guide. Personal license, and all sales are final.",
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
      "How the receipt link and PDF file delivery work at Vellum Press. All sales are final.",
    keyword: "instant PDF download delivery",
  },
  cart: {
    title: "Your PDF Cart | Vellum Press",
    description: "Review the PDF guides in your cart. All sales are final. Online payment opens very soon.",
    keyword: "PDF cart checkout",
  },
  checkout: {
    title: "Checkout for PDF Guides",
    description: "Checkout for Vellum Press PDF guides. Online payment opens very soon. All sales are final.",
    keyword: "PDF guide checkout",
  },
  success: {
    title: "PDF Payment Confirmation | Vellum",
    description: "Confirming your PDF payment. The download starts on the receipt page.",
    keyword: "PDF payment confirmation",
  },
  orders: {
    title: "Download Your PDF Guides | Receipt",
    description: "Download the PDF guides from your Vellum Press receipt. All sales are final.",
    keyword: "download PDF guides receipt",
  },
  notFound: {
    title: "Page Not Found | Vellum Press PDFs",
    description: "That page was not found. Browse the shop, or switch to Arabic. Free samples are still available.",
    keyword: "PDF guide page not found",
  },
  arabicHome: {
    title: "أدلة PDF عملية | من 6 دولارات",
    description:
      "أدلة PDF عملية من 6 دولارات، مع عيّنة مجانية لكل دليل. الدفع عبر الإنترنت يفتح قريبًا. كل المبيعات نهائية.",
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
      "تسوق أدلة PDF وباقات من 6 دولارات. عيّنة مجانية لكل دليل. الدليل باللغة الإنجليزية. الدفع يفتح قريبًا. كل المبيعات نهائية.",
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
    description: "راجع أدلة PDF في سلتك. كل المبيعات نهائية. الدفع عبر الإنترنت يفتح قريبًا.",
    keyword: "سلة أدلة PDF",
  },
  arabicCheckout: {
    title: "إتمام شراء أدلة PDF",
    description: "إتمام الطلب لأدلة Vellum Press. الدفع عبر الإنترنت يفتح قريبًا. كل المبيعات نهائية.",
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
    "Download the Saudi freelance kit PDF for $8.50. A freelance.sa checklist, SAR pricing, a proposal, and an invoice. Not legal advice.",
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
    "Health and nutrition PDF guides from $12. Fat-loss plan and weeknight meal prep. Free samples. Not medical advice.",
    "health nutrition PDF guides",
  ),
  fitness: productEntry(
    "Home Workout PDF Guides | $13.50",
    "Home workout PDF guide for $13.50. Floor sessions and an eight-week progression. Free sample. Not medical advice.",
    "home workout PDF guides",
  ),
  finance: productEntry(
    "Personal Finance PDF Guides | From $7.50",
    "Personal finance PDF guides from $7.50. Monthly budget and irregular income. Free samples. Not financial advice.",
    "personal finance PDF guides",
  ),
  productivity: productEntry(
    "Habit & Productivity PDF Guides | $9.50",
    "Weekly habit planner PDF for $9.50. A one-page review and a thirty-day ledger. Free sample. All sales are final.",
    "habit productivity PDF guide",
  ),
  career: productEntry(
    "Freelance & Work PDF Guides | From $6",
    "Freelance and work PDF guides from $6. Offers, a Saudi freelance checklist, and a Gulf ATS CV. Not legal advice.",
    "freelance work PDF guides",
  ),
  learning: productEntry(
    "Exam Study PDF Guides | $10.50",
    "Exam study plan PDF for $10.50. Retrieval practice and a weekly plan. Free sample. No score promise.",
    "exam study PDF guides",
  ),
  mindfulness: productEntry(
    "Mindfulness PDF Guides | $9",
    "Stress relief guide PDF for $9. Short practices and a four-week plan. Free sample. Not therapy or medical advice.",
    "mindfulness PDF guides",
  ),
  bundles: productEntry(
    "PDF Guide Bundles | From $18",
    "PDF guide bundles from $18. Health, work, and Gulf kits cost less than the separate guides. All sales are final.",
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
