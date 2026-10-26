import { isolateEmbeds } from "@/lib/i18n/bidi";
import type { Locale } from "@/lib/i18n/config";

/**
 * Who each guide is for, restated from that product's own description and FAQ.
 * Limits are included on purpose. These are not reviews or results.
 */
export const audience: Record<string, { en: string[]; ar: string[] }> = {
  "12-week-reset": {
    en: [
      "Adults who want a modest calorie deficit, a protein target, daily steps, and two or three short strength sessions, without a crash diet.",
      "Not for anyone pregnant, under 18, in treatment for an eating disorder, or not medically able to exercise. The guide says to talk with a licensed clinician first.",
    ],
    ar: [
      "للبالغين الذين يريدون عجزًا معتدلًا في السعرات، وهدف بروتين، وخطوات يومية، وجلستين أو ثلاث قوة قصيرة، من غير حمية قاسية.",
      "لا يناسب الحامل، ولا من هم دون 18 عامًا، ولا من هو تحت علاج لاضطراب أكل، ولا من لا يستطيع التمرين طبيًا. يطلب الدليل مراجعة مختص مرخّص أولًا.",
    ],
  },
  "weeknight-table": {
    en: [
      "People who want to eat well on a weeknight without turning cooking into a second job.",
      "Written for someone who can boil pasta and roast a sheet pan. Omnivore recipes with a vegetarian swap. Not a medical meal plan.",
    ],
    ar: [
      "لمن يريد أن يأكل جيدًا في يوم الأسبوع من غير أن يتحول الطبخ إلى وظيفة ثانية.",
      "لمن يستطيع سلق المعكرونة وشوي صينية. وصفات عادية مع بديل نباتي. ليست خطة وجبات طبية.",
    ],
  },
  "floor-and-form": {
    en: [
      "Someone training alone in a room with a floor and a doorframe. No bands to buy and no machines to book.",
      "Every push and pull has an easier variation, including wall and incline versions. Not a replacement for physical therapy.",
    ],
    ar: [
      "لمن يتدرّب وحده في غرفة فيها أرض وإطار باب. بلا أحزمة تُشترى وبلا أجهزة تُحجز.",
      "لكل تمرين دفع وسحب نسخة أسهل، ومنها نسخة الحائط والمستوى المائل. ليس بديلًا للعلاج الطبيعي.",
    ],
  },
  "the-quiet-budget": {
    en: [
      "People tired of apps that scold them and spreadsheets they abandon.",
      "Includes a variable-income version of the monthly plan. Not investment advice or tax advice.",
    ],
    ar: [
      "لمن تعب من التطبيقات التي توبّخه، ومن جداول يتركها.",
      "يتضمن نسخة من الخطة الشهرية للدخل المتغير. ليست نصيحة استثمار أو ضريبة.",
    ],
  },
  "habit-ledger": {
    en: [
      "People who have tried several planners and still lose the week. The cap is three active habits.",
      "Time-block examples include a shift week and a caregiver week, not only an office calendar.",
    ],
    ar: [
      "لمن جرّب أكثر من مخطط وما زال يضيع الأسبوع. الحد ثلاثة عادات نشطة.",
      "أمثلة توزيع الوقت تشمل أسبوع وردية وأسبوع رعاية، لا تقويم مكتب فقط.",
    ],
  },
  "first-client": {
    en: [
      "A service you can sell beside a job: design, writing, bookkeeping, tutoring, consulting, and similar work.",
      "Not for a physical product that needs inventory and shipping. It does not promise income.",
    ],
    ar: [
      "لخدمة تبيعها إلى جانب وظيفة: تصميم، أو كتابة، أو مسك دفاتر، أو تدريس، أو استشارة، وما يشبهها.",
      "ليس لمنتج مادي يحتاج مخزونًا وشحنًا. لا يعد بدخل.",
    ],
  },
  "exam-room-method": {
    en: [
      "Courses and licensing exams. You get methods and blank plans to fill with your own syllabus.",
      "A high school student can use it with a teacher or parent if under 18. It does not promise a score.",
    ],
    ar: [
      "للمقررات واختبارات الترخيص. طرق وخطط فارغة تملؤها بمنهجك أنت.",
      "يستطيع طالب الثانوية استخدامه مع معلم أو ولي أمر إن كان دون 18. لا يعد بدرجة.",
    ],
  },
  "steady-mind": {
    en: [
      "Short practices for stress and attention. Ten minutes is the default.",
      "Wellness education, not therapy and not a meditation course. It says when to contact a licensed clinician.",
    ],
    ar: [
      "تمارين قصيرة للتوتر والانتباه. الأساس عشر دقائق.",
      "تعليم في العافية، لا علاج نفسي ولا دورة تأمل. يبيّن متى تتواصل مع مختص مرخّص.",
    ],
  },
  "saudi-freelancer-starter-kit": {
    en: [
      "Someone in Saudi Arabia who wants to sell a service and read the official freelance platform before applying.",
      "Not legal advice. The PDF does not issue the freelance document, and it does not promise clients or income.",
    ],
    ar: [
      "لمن في السعودية يريد بيع خدمة، ويقرأ منصة العمل الحر الرسمية قبل أن يقدّم.",
      "ليست استشارة قانونية. الملف لا يصدر وثيقة العمل الحر، ولا يعد بعملاء أو دخل.",
    ],
  },
  "irregular-income-budget": {
    en: [
      "Freelancers, commission, and other pay that is not the same size every month.",
      "The worksheets and invoice are pages in the PDF, not a spreadsheet. Not tax, credit, or investment advice.",
    ],
    ar: [
      "للعمل الحر والعمولة وأي دخل لا يأتي بالحجم نفسه كل شهر.",
      "أوراق العمل والفاتورة صفحات داخل PDF، لا جدول بيانات. ليست نصيحة ضريبة أو ائتمان أو استثمار.",
    ],
  },
  "gulf-ats-cv-kit": {
    en: [
      "People applying in Saudi Arabia and elsewhere in the Gulf who want a single-column CV a screener can read.",
      "It does not promise an interview, a visa, or a job. Follow the posting on who may apply.",
    ],
    ar: [
      "لمن يتقدّم إلى عمل في السعودية أو الخليج ويريد سيرة بعمود واحد يقرأها مسؤول الفرز.",
      "لا يعد بمقابلة أو تأشيرة أو وظيفة. التزم بالإعلان فيمن يحق له التقديم.",
    ],
  },
  "health-fitness-bundle": {
    en: [
      "A practical set: twelve weeks of structure, food you will cook, and training in the room you have.",
      "Three separate PDFs. Buying them together does not make the set medical advice or a supervised program.",
    ],
    ar: [
      "مجموعة عملية: اثنا عشر أسبوعًا من الهيكل، وطعام ستطبخه، وتمرين في الغرفة التي عندك.",
      "ثلاثة ملفات PDF منفصلة. شراؤها معًا لا يجعلها نصيحة طبية ولا برنامجًا تحت إشراف.",
    ],
  },
  "work-money-bundle": {
    en: [
      "People building something beside a job who want a budget, a habit planner, and a first freelance offer.",
      "Education, not financial, legal, or tax advice. No promise of clients or income.",
    ],
    ar: [
      "لمن يبني شيئًا إلى جانب وظيفة ويريد ميزانية، ومخطط عادات، وأول عرض عمل حر.",
      "تعليم، لا نصيحة مالية أو قانونية أو ضريبية. بلا وعد بعملاء أو دخل.",
    ],
  },
  "gulf-work-bundle": {
    en: [
      "Looking for work or selling a service: the freelance-document guide, irregular-income sheets, and the Gulf CV kit.",
      "Three separate PDFs. Not legal, tax, or career advice, and no promise of a client, a visa, or a job.",
    ],
    ar: [
      "للبحث عن عمل أو بيع خدمة: دليل وثيقة العمل الحر، وأوراق الدخل غير الثابت، وعدة السيرة الخليجية.",
      "ثلاثة ملفات PDF منفصلة. ليست نصيحة قانونية أو ضريبية أو مهنية، وبلا وعد بعميل أو تأشيرة أو وظيفة.",
    ],
  },
};

export function audienceFor(slug: string, locale: Locale) {
  const copy = audience[slug];
  if (!copy) return [];
  const lines = copy[locale];
  return locale === "ar" ? lines.map((line) => isolateEmbeds(line)) : lines;
}
