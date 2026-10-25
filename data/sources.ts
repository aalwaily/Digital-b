import type { Locale } from "@/lib/i18n/config";

export type PublicSource = {
  label: string;
  href: string;
  note: string;
};

type Pair = { en: PublicSource; ar: PublicSource };

const whoDiet: Pair = {
  en: {
    label: "WHO: Healthy diet",
    href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    note: "World Health Organization fact sheet on a healthy diet. Public background, not a meal plan for this PDF.",
  },
  ar: {
    label: "منظمة الصحة العالمية: النظام الغذائي الصحي",
    href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    note: "صحيفة وقائع من منظمة الصحة العالمية عن النظام الغذائي الصحي. خلفية عامة، وليست خطة وجبات لهذا الملف.",
  },
};

const whoActivity: Pair = {
  en: {
    label: "WHO: Physical activity",
    href: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    note: "World Health Organization fact sheet on physical activity. The sessions in the PDF are education, not a clinical program.",
  },
  ar: {
    label: "منظمة الصحة العالمية: النشاط البدني",
    href: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    note: "صحيفة وقائع من منظمة الصحة العالمية عن النشاط البدني. جلسات الملف تعليم، وليست برنامجًا علاجيًا.",
  },
};

const nhsWeight: Pair = {
  en: {
    label: "NHS: Tips to help you lose weight",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "UK National Health Service page on weight loss. It is not a review of this guide.",
  },
  ar: {
    label: "هيئة الخدمات الصحية الوطنية: نصائح لإنقاص الوزن",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "صفحة هيئة الخدمات الصحية الوطنية في بريطانيا عن إنقاص الوزن. ليست مراجعة لهذا الدليل.",
  },
};

const nhsStrength: Pair = {
  en: {
    label: "NHS: How to improve strength and flexibility",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "UK National Health Service page on strength and flexibility. The PDF is not an NHS program.",
  },
  ar: {
    label: "هيئة الخدمات الصحية الوطنية: تحسين القوة والمرونة",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "صفحة هيئة الخدمات الصحية الوطنية في بريطانيا عن القوة والمرونة. الملف ليس برنامجًا تابعًا لها.",
  },
};

const whoFood: Pair = {
  en: {
    label: "WHO: Food safety",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "World Health Organization fact sheet on food safety. Use it as background for storage and handling, not as a certification of the recipes.",
  },
  ar: {
    label: "منظمة الصحة العالمية: سلامة الغذاء",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "صحيفة وقائع من منظمة الصحة العالمية عن سلامة الغذاء. خلفية للتخزين والتعامل، وليست شهادة للوصفات.",
  },
};

const whoMind: Pair = {
  en: {
    label: "WHO: Mental health",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "World Health Organization fact sheet on mental health. This PDF is not therapy and not a WHO program.",
  },
  ar: {
    label: "منظمة الصحة العالمية: الصحة النفسية",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "صحيفة وقائع من منظمة الصحة العالمية عن الصحة النفسية. هذا الملف ليس علاجًا ولا برنامجًا تابعًا للمنظمة.",
  },
};

const lifeline: Pair = {
  en: {
    label: "988 Suicide & Crisis Lifeline",
    href: "https://988lifeline.org/",
    note: "United States crisis line. If you are in crisis there, call or text 988. This is not a source for the exercises in the PDF.",
  },
  ar: {
    label: "خط 988 للأزمات في الولايات المتحدة",
    href: "https://988lifeline.org/",
    note: "خط أزمات في الولايات المتحدة. إذا كنت في أزمة هناك، اتصل أو أرسل 988. ليس مصدرًا لتمارين الملف.",
  },
};

const freelance: Pair = {
  en: {
    label: "Freelance.sa",
    href: "https://freelance.sa/",
    note: "Official Saudi freelance portal. The PDF does not issue a freelance document and does not log in for you. Check the current screens yourself.",
  },
  ar: {
    label: "منصة العمل الحر",
    href: "https://freelance.sa/",
    note: "البوابة الرسمية للعمل الحر في السعودية. الملف لا يصدر الوثيقة ولا يدخل المنصة نيابة عنك. راجع الشاشات الحالية بنفسك.",
  },
};

const zatca: Pair = {
  en: {
    label: "ZATCA",
    href: "https://zatca.gov.sa/en/Pages/default.aspx",
    note: "Zakat, Tax and Customs Authority. Confirm tax, zakat, and e-invoicing with the portal or an accountant. The PDF is not tax advice.",
  },
  ar: {
    label: "هيئة الزكاة والضريبة والجمارك",
    href: "https://zatca.gov.sa/en/Pages/default.aspx",
    note: "هيئة الزكاة والضريبة والجمارك. تأكد من الضريبة والزكاة والفوترة الإلكترونية من البوابة أو من محاسب. الملف ليس استشارة ضريبية.",
  },
};

const einvoice: Pair = {
  en: {
    label: "ZATCA: What is e-invoicing",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "Official introduction to e-invoicing (Fatoora). Do not fill a tax field on an invoice unless you are registered.",
  },
  ar: {
    label: "هيئة الزكاة: ما هي الفوترة الإلكترونية",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "تعريف رسمي بالفوترة الإلكترونية (فاتورة). لا تملأ خانة الضريبة في فاتورة إلا إذا كنت مسجّلًا.",
  },
};

function pack(pairs: Pair[], locale: Locale): PublicSource[] {
  return pairs.map((pair) => pair[locale]);
}

const bySlug: Record<string, Pair[]> = {
  "12-week-reset": [whoDiet, whoActivity, nhsWeight],
  "weeknight-table": [whoFood],
  "floor-and-form": [whoActivity, nhsStrength],
  "steady-mind": [whoMind, lifeline],
  "health-fitness-bundle": [whoDiet, whoActivity, whoFood, nhsWeight],
  "saudi-freelancer-starter-kit": [freelance, zatca, einvoice],
  "gulf-work-bundle": [freelance, zatca, einvoice],
};

export function sourcesFor(slug: string, locale: Locale): PublicSource[] {
  return pack(bySlug[slug] ?? [], locale);
}
