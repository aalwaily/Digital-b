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
    note: "Checked October 2026. The fact sheet says people older than 10 should aim for at least 400 grams of fruit and vegetables a day, and that a healthy diet varies by person. This PDF does not calculate that target.",
  },
  ar: {
    label: "منظمة الصحة العالمية: النظام الغذائي الصحي",
    href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    note: "رُاجعت في أكتوبر 2026. صحيفة الوقائع تقول إن من تجاوز 10 سنوات يستهدف 400 غرام على الأقل من الفاكهة والخضار يوميًا، وإن النظام الصحي يختلف من شخص لآخر. هذا الملف لا يحسب ذلك الهدف.",
  },
};

const myPlate: Pair = {
  en: {
    label: "USDA and HHS: Start Simple with MyPlate",
    href: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/DGA_2020-2025_StartSimple_withMyPlate_English_color.pdf",
    note: "Checked October 2026. The sheet says to make half your plate fruits and vegetables, vary protein, and make half your grains whole. It also includes dairy. It is not a review of this PDF.",
  },
  ar: {
    label: "وزارة الزراعة الأمريكية ووزارة الصحة: ابدأ ببساطة مع طبقي",
    href: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/DGA_2020-2025_StartSimple_withMyPlate_English_color.pdf",
    note: "رُاجعت في أكتوبر 2026. الورقة تقول اجعل نصف الطبق فاكهة وخضارًا، ونوّع البروتين، واجعل نصف الحبوب كاملة. وتشمل الألبان. ليست مراجعة لهذا الملف.",
  },
};

const niddk: Pair = {
  en: {
    label: "NIDDK: Eating and physical activity to lose or maintain weight",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity",
    note: "Checked October 2026. A US National Institutes of Health page. It says adults who want to lose weight should reduce calories from food and drink, and that activity helps use more calories. It is not a plan for this PDF.",
  },
  ar: {
    label: "المعهد الوطني الأمريكي: الأكل والنشاط لخسارة الوزن أو تثبيته",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity",
    note: "رُاجعت في أكتوبر 2026. صفحة من معاهد الصحة الوطنية الأمريكية. تقول إن البالغ الذي يريد خسارة الوزن يقلل سعرات الطعام والشراب، وإن النشاط يساعد على استهلاك سعرات أكثر. ليست خطة لهذا الملف.",
  },
};

const nhsWeight: Pair = {
  en: {
    label: "NHS: Tips to help you lose weight",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "Checked October 2026. The NHS page suggests gradual loss and 150 minutes of activity a week. This guide does not adopt a weekly weight target.",
  },
  ar: {
    label: "هيئة الخدمات الصحية البريطانية: نصائح لإنقاص الوزن",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "رُاجعت في أكتوبر 2026. الصفحة تقترح خسارة تدريجية و150 دقيقة نشاط في الأسبوع. هذا الدليل لا يتبنّى هدف وزن أسبوعيًا.",
  },
};

const whoActivity: Pair = {
  en: {
    label: "WHO: Physical activity recommendations",
    href: "https://www.who.int/initiatives/behealthy/physical-activity",
    note: "Checked October 2026. For adults 18 to 64, WHO lists at least 150 minutes of moderate activity a week, or 75 minutes vigorous, plus muscle-strengthening on 2 or more days. This PDF is not a WHO program and does not count those minutes for you.",
  },
  ar: {
    label: "منظمة الصحة العالمية: توصيات النشاط البدني",
    href: "https://www.who.int/initiatives/behealthy/physical-activity",
    note: "رُاجعت في أكتوبر 2026. للبالغين من 18 إلى 64 تذكر المنظمة 150 دقيقة على الأقل من النشاط المتوسط أسبوعيًا، أو 75 دقيقة شديدًا، مع تقوية العضلات في يومين أو أكثر. هذا الملف ليس برنامج المنظمة ولا يعدّ لك تلك الدقائق.",
  },
};

const nhsStrength: Pair = {
  en: {
    label: "NHS: Strength and flexibility",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "Checked October 2026. The NHS lists push-ups among muscle-strengthening examples and suggests those activities on at least 2 days a week, plus 150 minutes of aerobic activity. This PDF is not an NHS program.",
  },
  ar: {
    label: "هيئة الخدمات الصحية البريطانية: القوة والمرونة",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "رُاجعت في أكتوبر 2026. تذكر الهيئة تمارين الضغط ضمن أمثلة التقوية، وتقترحها في يومين على الأقل أسبوعيًا، مع 150 دقيقة نشاط هوائي. هذا الملف ليس برنامج الهيئة.",
  },
};

const usdaLeftovers: Pair = {
  en: {
    label: "USDA FSIS: Leftovers and food safety",
    href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety",
    note: "Checked October 2026. Cook poultry to 165°F (74°C). Refrigerate leftovers within 2 hours (1 hour above 90°F). Keep them 3 to 4 days, or freeze 3 to 4 months for quality. Reheat to 165°F. Clear juice is not the test.",
  },
  ar: {
    label: "وزارة الزراعة الأمريكية: بقايا الطعام وسلامته",
    href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety",
    note: "رُاجعت في أكتوبر 2026. اطبخ الدواجن إلى 165°ف (74°م). برّد البقايا خلال ساعتين (ساعة إذا تجاوز الجو 90°ف). تُحفظ 3 إلى 4 أيام، أو تُجمّد 3 إلى 4 أشهر للجودة. أعد التسخين إلى 165°ف. صفاء العصير ليس الاختبار.",
  },
};

const whoFood: Pair = {
  en: {
    label: "WHO: Food safety",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "Checked October 2026. Background on foodborne illness, including undercooked poultry. It is not a storage chart for these recipes and not a certification.",
  },
  ar: {
    label: "منظمة الصحة العالمية: سلامة الغذاء",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "رُاجعت في أكتوبر 2026. خلفية عن الأمراض المنقولة بالغذاء، ومنها الدواجن غير المكتملة الطهي. ليست جدول حفظ لهذه الوصفات وليست شهادة.",
  },
};

const cfpbDebt: Pair = {
  en: {
    label: "CFPB: How to reduce your debt",
    href: "https://www.consumerfinance.gov/archive/blog/how-reduce-your-debt/",
    note: "Checked October 2026. A US Consumer Financial Protection Bureau article. Minimums stay in place. Extra money goes either to the highest interest rate or to the smallest balance. It is not advice on Saudi or Gulf credit products.",
  },
  ar: {
    label: "مكتب الحماية المالية الأمريكي: كيف تخفّض دينك",
    href: "https://www.consumerfinance.gov/archive/blog/how-reduce-your-debt/",
    note: "رُاجعت في أكتوبر 2026. مقال من مكتب الحماية المالية للمستهلك في أمريكا. الحدود الدنيا تبقى. المبلغ الزائد يذهب إما للأعلى فائدة أو للأصغر رصيدًا. ليست نصيحة عن منتجات الائتمان في السعودية أو الخليج.",
  },
};

const habitReview: Pair = {
  en: {
    label: "BJGP review: Making health habitual",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/",
    note: "Checked October 2026. A British Journal of General Practice review on PubMed Central. It reports an average near 66 days for one study, a wide spread, and that an occasional miss did not erase progress. It is not a 21-day rule and not a result promised by this PDF. Listing on PubMed Central is not an NIH endorsement.",
  },
  ar: {
    label: "مراجعة المجلة البريطانية للممارسة العامة: جعل الصحة عادة",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/",
    note: "رُاجعت في أكتوبر 2026. مراجعة في المجلة البريطانية للممارسة العامة عبر PubMed Central. تذكر متوسطًا قريبًا من 66 يومًا في دراسة واحدة، مع مدى واسع، وأن فوات مرة لم يمحُ التقدّم. ليست قاعدة 21 يومًا وليست نتيجة يعد بها هذا الملف. وجودها في الأرشيف ليس اعتمادًا من معاهد الصحة الأمريكية.",
  },
};

const iesStudy: Pair = {
  en: {
    label: "IES: Organizing Instruction and Study to Improve Student Learning",
    href: "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    note: "Checked October 2026. A US What Works Clearinghouse practice guide. It recommends spacing learning over time and quizzing with active retrieval. It is written for instruction, not as a score guarantee, and this PDF is not an IES program.",
  },
  ar: {
    label: "معهد علوم التعليم الأمريكي: تنظيم التدريس والمذاكرة",
    href: "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    note: "رُاجع في أكتوبر 2026. دليل ممارسة من مركز «ما الذي ينجح». يوصي بتوزيع التعلّم على الوقت وباختبارات تستدعي المعلومة. كُتب للتدريس، لا كضمان درجة، وهذا الملف ليس برنامج المعهد.",
  },
};

const whoMind: Pair = {
  en: {
    label: "WHO: Mental health",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "Checked October 2026. World Health Organization fact sheet. Care for depression and anxiety belongs with health services. This PDF is not therapy and not a WHO program.",
  },
  ar: {
    label: "منظمة الصحة العالمية: الصحة النفسية",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "رُاجعت في أكتوبر 2026. صحيفة وقائع من منظمة الصحة العالمية. رعاية الاكتئاب والقلق مكانها الخدمات الصحية. هذا الملف ليس علاجًا ولا برنامجًا للمنظمة.",
  },
};

const lifeline: Pair = {
  en: {
    label: "988 Suicide & Crisis Lifeline",
    href: "https://988lifeline.org/",
    note: "Checked October 2026. United States crisis line, 24 hours, call or text 988. It is not a source for the exercises, and it is not a hotline for other countries.",
  },
  ar: {
    label: "خط 988 للأزمات في الولايات المتحدة",
    href: "https://988lifeline.org/",
    note: "رُاجع في أكتوبر 2026. خط أزمات أمريكي على مدار الساعة، اتصال أو رسالة إلى 988. ليس مصدرًا للتمارين، وليس خطًا لدول أخرى.",
  },
};

const freelance: Pair = {
  en: {
    label: "Freelance.sa",
    href: "https://freelance.sa/",
    note: "The official Saudi freelance platform. The PDF does not issue a document and does not log in for you. Checked as the host named on the HRSD service page, October 2026.",
  },
  ar: {
    label: "منصة العمل الحر",
    href: "https://freelance.sa/",
    note: "منصة العمل الحر الرسمية في السعودية. الملف لا يصدر وثيقة ولا يدخل عنك. رُاجع بوصفه النطاق الذي تسميه صفحة خدمة الوزارة، أكتوبر 2026.",
  },
};

const hrsdService: Pair = {
  en: {
    label: "HRSD: Issue and renew the freelance document",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D9%88%D8%AB%D9%8A%D9%82%D8%A9-%D8%A7%D9%84%D8%B9%D9%85%D9%84-%D8%A7%D9%84%D8%AD%D8%B1",
    note: "Checked 26 October 2026. Lists the fee as free, languages Arabic and English, and duration as immediate, and also says the document is issued after operations reviews the attachments. Conditions shown: 18 or older, Saudi, active Absher, plus extra conditions for some categories. The renewal FAQ linked to nvg.gov.sa, not freelance.sa. Header phone 19911. Freelance contact line 920002654.",
  },
  ar: {
    label: "وزارة الموارد البشرية: إصدار وتجديد وثيقة العمل الحر",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D9%88%D8%AB%D9%8A%D9%82%D8%A9-%D8%A7%D9%84%D8%B9%D9%85%D9%84-%D8%A7%D9%84%D8%AD%D8%B1",
    note: "رُاجعت في 26 أكتوبر 2026. تذكر الرسوم مجانية، واللغتين العربية والإنجليزية، والمدة فورية، وتقول أيضًا إن الوثيقة تصدر بعد مراجعة فريق العمليات للمرفقات. الشروط المعروضة: 18 فأكثر، سعودي، أبشر مفعّل، مع شروط إضافية لبعض الفئات. سؤال التجديد كان رابطه إلى nvg.gov.sa لا إلى freelance.sa. هاتف الترويسة 19911. هاتف تواصل العمل الحر 920002654.",
  },
};

const hrsdDecision: Pair = {
  en: {
    label: "HRSD: Ministerial decision 99439",
    href: "https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/ministerial-decisions/808083",
    note: "Checked 26 October 2026. Publication date shown as 2 March 2021. Says the document term is one year, renewable, for citizens aged 18 to 60, after eligibility is checked on the approved platform. That age range is not the same as the service page.",
  },
  ar: {
    label: "وزارة الموارد البشرية: قرار العمل الحر 99439",
    href: "https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/ministerial-decisions/808083",
    note: "رُاجع في 26 أكتوبر 2026. تاريخ النشر الظاهر 2 مارس 2021. يقول إن مدة الوثيقة سنة قابلة للتجديد، للمواطنين من 18 إلى 60، بعد التحقق من الأهلية على المنصة المعتمدة. هذا المدى العمري ليس مطابقًا لصفحة الخدمة.",
  },
};

const hrsdGuide: Pair = {
  en: {
    label: "HRSD: Freelance Platform user guide (English PDF)",
    href: "https://www.hrsd.gov.sa/sites/default/files/2026-08/dlyl-almstkhdm-lmnst-al-ml-alhr---tqryr-anjlyzy.pdf",
    note: "Checked October 2026. File path dated August 2026. Login is freelance.sa, then Nafath, then a one-time code. Document management can view, renew, cancel, or download. Support number printed in the guide: 920002654.",
  },
  ar: {
    label: "وزارة الموارد البشرية: دليل مستخدم منصة العمل الحر (PDF إنجليزي)",
    href: "https://www.hrsd.gov.sa/sites/default/files/2026-08/dlyl-almstkhdm-lmnst-al-ml-alhr---tqryr-anjlyzy.pdf",
    note: "رُاجع في أكتوبر 2026. مسار الملف مؤرخ بأغسطس 2026. الدخول من freelance.sa ثم نفاذ ثم رمز تحقق. إدارة الوثيقة تتيح العرض والتجديد والإلغاء والتنزيل. رقم الدعم في الدليل: 920002654.",
  },
};

const zatcaIndividuals: Pair = {
  en: {
    label: "ZATCA: VAT registration for individuals",
    href: "https://zatca.gov.sa/en/eServices/Pages/eServices-002.aspx",
    note: "Checked October 2026. Says the service is for annual revenues that exceed SAR 375,000, and is optional when revenues exceed SAR 187,500 and are less than SAR 375,000. The page says revenues. Do not calculate your own threshold from this shop.",
  },
  ar: {
    label: "هيئة الزكاة: تسجيل الأفراد في ضريبة القيمة المضافة",
    href: "https://zatca.gov.sa/en/eServices/Pages/eServices-002.aspx",
    note: "رُاجعت في أكتوبر 2026. تقول إن الخدمة لمن تجاوزت إيراداته السنوية 375,000 ريال، وإن التسجيل اختياري إذا تجاوزت الإيرادات 187,500 ريال وكانت أقل من 375,000. الصفحة تتحدث عن الإيرادات. لا تحسب حدّك من هذا المتجر.",
  },
};

const zatcaRate: Pair = {
  en: {
    label: "ZATCA: 15% VAT took effect on 1 July 2020",
    href: "https://zatca.gov.sa/en/MediaCenter/News/Pages/News-342.aspx",
    note: "Checked October 2026. ZATCA's announcement that the standard rate rose from 5% to 15% on 1 July 2020, after Royal Order A/638. Confirm the rate on the portal before you charge it. Do not add 15% if you are not registered.",
  },
  ar: {
    label: "هيئة الزكاة: نسبة 15% بدأت في 1 يوليو 2020",
    href: "https://zatca.gov.sa/en/MediaCenter/News/Pages/News-342.aspx",
    note: "رُاجع في أكتوبر 2026. إعلان الهيئة أن النسبة الأساسية ارتفعت من 5% إلى 15% في 1 يوليو 2020 بعد الأمر الملكي أ/638. تأكد من النسبة في البوابة قبل أن تفرضها. لا تضف 15% إذا لم تكن مسجّلًا.",
  },
};

const einvoice: Pair = {
  en: {
    label: "ZATCA: What is e-invoicing",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "Checked October 2026. An electronic invoice is generated in a structured format. A paper invoice that was copied or scanned is not an electronic invoice. Phase one is described from 4 December 2021. This shop's invoice page is not a Fatoora solution.",
  },
  ar: {
    label: "هيئة الزكاة: ما هي الفوترة الإلكترونية",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "رُاجعت في أكتوبر 2026. الفاتورة الإلكترونية تُنشأ بصيغة منظمة. الفاتورة الورقية التي نُسخت أو مُسحت ضوئيًا ليست فاتورة إلكترونية. الصفحة تصف المرحلة الأولى من 4 ديسمبر 2021. صفحة الفاتورة في هذا المتجر ليست حل فاتورة.",
  },
};

const nitaqat: Pair = {
  en: {
    label: "HRSD: Nitaqat calculator",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D9%86%D8%B7%D8%A7%D9%82%D8%A7%D8%AA",
    note: "Checked October 2026. An employer service that estimates an establishment's Nitaqat band from worker counts and economic activity. A CV template does not change that band.",
  },
  ar: {
    label: "وزارة الموارد البشرية: حاسبة نطاقات",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D9%86%D8%B7%D8%A7%D9%82%D8%A7%D8%AA",
    note: "رُاجعت في أكتوبر 2026. خدمة لأصحاب العمل تقدّر نطاق المنشأة من عدد العاملين والنشاط الاقتصادي. قالب السيرة لا يغيّر هذا النطاق.",
  },
};

const qiwaContracts: Pair = {
  en: {
    label: "Qiwa: Review a new employment contract",
    href: "https://qiwa.sa/en/employees/manage-your-career-qiwa/how-review-new-contracts",
    note: "Checked October 2026. Qiwa's help page says a worker reviews a pending contract and has 10 days to accept, reject, or request a change. A CV does not do that. Occupation management is a separate Qiwa service. This file does not decide whether a residency profession matches a job.",
  },
  ar: {
    label: "قوى: مراجعة عقد عمل جديد",
    href: "https://qiwa.sa/en/employees/manage-your-career-qiwa/how-review-new-contracts",
    note: "رُاجعت في أكتوبر 2026. تقول صفحة المساعدة في قوى إن العامل يراجع العقد المعلّق وله 10 أيام ليقبله أو يرفضه أو يطلب تعديله. السيرة لا تفعل ذلك. إدارة المهن خدمة أخرى في قوى. هذا الملف لا يقرر إن كانت مهنة الإقامة تطابق الوظيفة.",
  },
};

function pack(pairs: Pair[], locale: Locale): PublicSource[] {
  return pairs.map((pair) => pair[locale]);
}

const bySlug: Record<string, Pair[]> = {
  "12-week-reset": [whoDiet, myPlate, niddk, nhsWeight, whoActivity],
  "weeknight-table": [usdaLeftovers, whoFood, whoDiet],
  "floor-and-form": [whoActivity, nhsStrength],
  "the-quiet-budget": [cfpbDebt],
  "habit-ledger": [habitReview],
  "exam-room-method": [iesStudy],
  "steady-mind": [whoMind, lifeline],
  "saudi-freelancer-starter-kit": [freelance, hrsdService, hrsdDecision, hrsdGuide, zatcaIndividuals, zatcaRate, einvoice],
  "irregular-income-budget": [cfpbDebt],
  "gulf-ats-cv-kit": [nitaqat, qiwaContracts],
};

const bundleSlugs: Record<string, string[]> = {
  "health-fitness-bundle": ["12-week-reset", "weeknight-table", "floor-and-form"],
  "work-money-bundle": ["the-quiet-budget", "habit-ledger"],
  "gulf-work-bundle": ["saudi-freelancer-starter-kit", "irregular-income-budget", "gulf-ats-cv-kit"],
};

export function sourcesFor(slug: string, locale: Locale): PublicSource[] {
  const direct = bySlug[slug];
  if (direct) return pack(direct, locale);
  const children = bundleSlugs[slug];
  if (!children) return [];
  const seen = new Set<string>();
  const pairs: Pair[] = [];
  for (const child of children) {
    for (const pair of bySlug[child] ?? []) {
      if (seen.has(pair.en.href)) continue;
      seen.add(pair.en.href);
      pairs.push(pair);
    }
  }
  return pack(pairs, locale);
}
