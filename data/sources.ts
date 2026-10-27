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
    note: "Checked 27 October 2026. The fact sheet says people older than 10 should aim for at least 400 grams of fruit and vegetables a day, and that a healthy diet varies by person. This PDF does not calculate that target.",
  },
  ar: {
    label: "منظمة الصحة العالمية: النظام الغذائي الصحي",
    href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    note: "رُوجعت في 27 أكتوبر 2026. صحيفة الوقائع تقول إن من تجاوز 10 سنوات يستهدف 400 غرام على الأقل من الفاكهة والخضار يوميًا، وإن النظام الصحي يختلف من شخص لآخر. هذا الملف لا يحسب ذلك الهدف.",
  },
};

const myPlate: Pair = {
  en: {
    label: "USDA and HHS: Start Simple with MyPlate",
    href: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/DGA_2020-2025_StartSimple_withMyPlate_English_color.pdf",
    note: "Checked 27 October 2026. The sheet says to make half your plate fruits and vegetables, vary protein, and make half your grains whole. It also includes dairy. It is not a review of this PDF.",
  },
  ar: {
    label: "وزارة الزراعة الأمريكية ووزارة الصحة: ابدأ ببساطة مع طبقي",
    href: "https://www.dietaryguidelines.gov/sites/default/files/2020-12/DGA_2020-2025_StartSimple_withMyPlate_English_color.pdf",
    note: "رُوجعت في 27 أكتوبر 2026. الورقة تقول اجعل نصف الطبق فاكهة وخضارًا، ونوّع البروتين، واجعل نصف الحبوب كاملة. وتشمل الألبان. ليست مراجعة لهذا الملف.",
  },
};

const niddk: Pair = {
  en: {
    label: "NIDDK: Eating and physical activity to lose or maintain weight",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity",
    note: "Checked 27 October 2026. A US National Institutes of Health page. It says adults who want to lose weight should reduce calories from food and drink, and that activity helps use more calories. It is not a plan for this PDF.",
  },
  ar: {
    label: "المعهد الوطني الأمريكي: الأكل والنشاط لخسارة الوزن أو تثبيته",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity",
    note: "رُوجعت في 27 أكتوبر 2026. صفحة من معاهد الصحة الوطنية الأمريكية. تقول إن البالغ الذي يريد خسارة الوزن يقلل سعرات الطعام والشراب، وإن النشاط يساعد على استهلاك سعرات أكثر. ليست خطة لهذا الملف.",
  },
};

const nhsWeight: Pair = {
  en: {
    label: "NHS: Tips to help you lose weight",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "Checked 27 October 2026. The page says to get active for 150 minutes a week and to aim to lose 1 to 2 lb (0.5 to 1 kg) a week. This guide does not adopt that weekly weight target.",
  },
  ar: {
    label: "هيئة الخدمات الصحية البريطانية: نصائح لإنقاص الوزن",
    href: "https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/",
    note: "رُوجعت في 27 أكتوبر 2026. الصفحة تقول: نشّط نفسك 150 دقيقة في الأسبوع، واستهدف خسارة 1 إلى 2 رطل (0.5 إلى 1 كغ) في الأسبوع. هذا الدليل لا يتبنّى هدف الوزن هذا.",
  },
};

const whoActivity: Pair = {
  en: {
    label: "WHO: Physical activity recommendations",
    href: "https://www.who.int/initiatives/behealthy/physical-activity",
    note: "Checked 27 October 2026. For adults 18 to 64, WHO lists at least 150 minutes of moderate activity a week, or 75 minutes of vigorous activity, plus muscle-strengthening on 2 or more days. This PDF is not a WHO program and does not count those minutes for you.",
  },
  ar: {
    label: "منظمة الصحة العالمية: توصيات النشاط البدني",
    href: "https://www.who.int/initiatives/behealthy/physical-activity",
    note: "رُوجعت في 27 أكتوبر 2026. للبالغين من 18 إلى 64 تذكر المنظمة 150 دقيقة على الأقل من النشاط المتوسط أسبوعيًا، أو 75 دقيقة شديدًا، مع تقوية العضلات في يومين أو أكثر. هذا الملف ليس برنامج المنظمة ولا يعدّ لك تلك الدقائق.",
  },
};

const nhsStrength: Pair = {
  en: {
    label: "NHS: Strength and flexibility",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "Checked 27 October 2026. The NHS lists push-ups among muscle-strengthening examples and suggests those activities on at least 2 days a week, plus 150 minutes of aerobic activity. This PDF is not an NHS program.",
  },
  ar: {
    label: "هيئة الخدمات الصحية البريطانية: القوة والمرونة",
    href: "https://www.nhs.uk/live-well/exercise/how-to-improve-strength-flexibility/",
    note: "رُوجعت في 27 أكتوبر 2026. تذكر الهيئة تمارين الضغط ضمن أمثلة التقوية، وتقترحها في يومين على الأقل أسبوعيًا، مع 150 دقيقة نشاط هوائي. هذا الملف ليس برنامج الهيئة.",
  },
};

const usdaLeftovers: Pair = {
  en: {
    label: "USDA FSIS: Leftovers and food safety",
    href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety",
    note: "Checked 27 October 2026. Cook poultry to 165°F (74°C) with a food thermometer. Refrigerate leftovers within 2 hours (1 hour above 90°F). Keep them 3 to 4 days, or freeze 3 to 4 months for quality. Reheat to 165°F. The page does not treat color as the test.",
  },
  ar: {
    label: "وزارة الزراعة الأمريكية: بقايا الطعام وسلامته",
    href: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety",
    note: "رُوجعت في 27 أكتوبر 2026. اطبخ الدواجن إلى 165°ف (74°م) بمقياس حرارة. برّد البقايا خلال ساعتين (ساعة إذا تجاوز الجو 90°ف). تُحفظ 3 إلى 4 أيام، أو تُجمّد 3 إلى 4 أشهر للجودة. أعد التسخين إلى 165°ف. الصفحة لا تجعل اللون اختبارًا للنضج.",
  },
};

const whoFood: Pair = {
  en: {
    label: "WHO: Food safety",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "Checked 27 October 2026. Background on foodborne illness, including undercooked poultry. It is not a storage chart for these recipes and not a certification.",
  },
  ar: {
    label: "منظمة الصحة العالمية: سلامة الغذاء",
    href: "https://www.who.int/news-room/fact-sheets/detail/food-safety",
    note: "رُوجعت في 27 أكتوبر 2026. خلفية عن الأمراض المنقولة بالغذاء، ومنها الدواجن غير المكتملة الطهي. ليست جدول حفظ لهذه الوصفات وليست شهادة.",
  },
};

const cfpbDebt: Pair = {
  en: {
    label: "CFPB: How to reduce your debt",
    href: "https://www.consumerfinance.gov/archive/blog/how-reduce-your-debt/",
    note: "Checked 27 October 2026. A US Consumer Financial Protection Bureau article. Minimums stay in place. Extra money goes either to the highest interest rate or to the smallest balance. It is not advice on Saudi or Gulf credit products.",
  },
  ar: {
    label: "مكتب الحماية المالية الأمريكي: كيف تخفّض دينك",
    href: "https://www.consumerfinance.gov/archive/blog/how-reduce-your-debt/",
    note: "رُوجعت في 27 أكتوبر 2026. مقال من مكتب الحماية المالية للمستهلك في أمريكا. الحدود الدنيا تبقى. المبلغ الزائد يذهب إما للأعلى فائدة أو للأصغر رصيدًا. ليست نصيحة عن منتجات الائتمان في السعودية أو الخليج.",
  },
};

const habitReview: Pair = {
  en: {
    label: "BJGP review: Making health habitual",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/",
    note: "Checked 27 October 2026. A British Journal of General Practice review on PubMed Central. It reports an average near 66 days for one study, a wide spread, and that missing an occasional performance did not seriously impair the process. It is not a 21-day rule and not a result promised by this PDF. Listing on PubMed Central is not an NIH endorsement.",
  },
  ar: {
    label: "مراجعة المجلة البريطانية للممارسة العامة: جعل الصحة عادة",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/",
    note: "رُوجعت في 27 أكتوبر 2026. مراجعة في المجلة البريطانية للممارسة العامة عبر PubMed Central. تذكر متوسطًا قريبًا من 66 يومًا في دراسة واحدة، مع مدى واسع، وأن فوات مرة لم يُضعف المسار بشكل جدي في تلك الدراسة. ليست قاعدة 21 يومًا وليست نتيجة يعد بها هذا الملف. وجودها في الأرشيف ليس اعتمادًا من معاهد الصحة الأمريكية.",
  },
};

const iesStudy: Pair = {
  en: {
    label: "IES: Organizing Instruction and Study to Improve Student Learning",
    href: "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    note: "Checked 27 October 2026. A US What Works Clearinghouse practice guide released in September 2007. It recommends spacing learning over time and quizzing with active retrieval. It is written for instruction, not as a score guarantee, and this PDF is not an IES program.",
  },
  ar: {
    label: "معهد علوم التعليم الأمريكي: تنظيم التدريس والمذاكرة",
    href: "https://ies.ed.gov/ncee/wwc/PracticeGuide/1",
    note: "رُوجع في 27 أكتوبر 2026. دليل ممارسة من مركز «ما الذي ينجح»، وتاريخ إصداره سبتمبر 2007. يوصي بتوزيع التعلّم على الوقت وباختبارات تستدعي المعلومة. كُتب للتدريس، لا كضمان درجة، وهذا الملف ليس برنامج المعهد.",
  },
};

const whoMind: Pair = {
  en: {
    label: "WHO: Mental health",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "Checked 27 October 2026. The fact sheet discusses the care gap for depression and anxiety, and community-based mental health care. This PDF is not therapy and not a WHO program.",
  },
  ar: {
    label: "منظمة الصحة العالمية: الصحة النفسية",
    href: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    note: "رُوجعت في 27 أكتوبر 2026. صحيفة الوقائع تتحدث عن فجوة الرعاية في الاكتئاب والقلق، وعن الرعاية النفسية في المجتمع. هذا الملف ليس علاجًا ولا برنامجًا للمنظمة.",
  },
};

const lifeline: Pair = {
  en: {
    label: "SAMHSA: 988 Suicide & Crisis Lifeline",
    href: "https://www.samhsa.gov/mental-health/988",
    note: "Checked 27 October 2026. SAMHSA's page says if you are in crisis, call or text 988, and that 988 offers support 24 hours a day. It is a United States line. It is not a hotline for other countries, and it is not a source for the exercises.",
  },
  ar: {
    label: "سامهسا: خط 988 للأزمات في الولايات المتحدة",
    href: "https://www.samhsa.gov/mental-health/988",
    note: "رُوجع في 27 أكتوبر 2026. صفحة سامهسا تقول: إذا كنت في أزمة فاتصل أو أرسل 988، وإن الخط يعمل 24 ساعة. خط أمريكي. ليس خطًا لدول أخرى، وليس مصدرًا للتمارين.",
  },
};

const freelance: Pair = {
  en: {
    label: "Freelance.sa",
    href: "https://freelance.sa/",
    note: "The official Saudi freelance platform. The PDF does not issue a document and does not log in for you. Checked as the host named on the HRSD service page, 27 October 2026.",
  },
  ar: {
    label: "منصة العمل الحر",
    href: "https://freelance.sa/",
    note: "منصة العمل الحر الرسمية في السعودية. الملف لا يصدر وثيقة ولا يدخل عنك. رُوجع بوصفه النطاق الذي تسميه صفحة خدمة الوزارة، 27 أكتوبر 2026.",
  },
};

const hrsdService: Pair = {
  en: {
    label: "HRSD: Issue and renew the freelance document",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D9%88%D8%AB%D9%8A%D9%82%D8%A9-%D8%A7%D9%84%D8%B9%D9%85%D9%84-%D8%A7%D9%84%D8%AD%D8%B1",
    note: "Checked 27 October 2026. Fee free, languages Arabic and English, duration immediate, and the issuance steps say the document is issued after operations reviews the attachments. Conditions shown: 18 or older, Saudi, active Absher, plus extra conditions for some categories. The renewal FAQ links to nvg.gov.sa, not freelance.sa. A separate unlabeled line in the FAQ section says the process is automatic and names no step. Header phone 19911. Freelance contact line 920002654.",
  },
  ar: {
    label: "وزارة الموارد البشرية: إصدار وتجديد وثيقة العمل الحر",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF-%D9%88%D8%AB%D9%8A%D9%82%D8%A9-%D8%A7%D9%84%D8%B9%D9%85%D9%84-%D8%A7%D9%84%D8%AD%D8%B1",
    note: "رُوجعت في 27 أكتوبر 2026. الرسوم مجانية، واللغتان العربية والإنجليزية، والمدة فورية، وخطوات الإصدار تقول إن الوثيقة تصدر بعد مراجعة فريق العمليات للمرفقات. الشروط: 18 فأكثر، سعودي، أبشر مفعّل، مع شروط إضافية لبعض الفئات. سؤال «كيف يتم تجديد الوثيقة؟» رابطه إلى nvg.gov.sa لا إلى freelance.sa. وفي قسم الأسئلة سطر بلا عنوان يقول إن الإجراء يتم آليًا ولا يسمّي الخطوة. هاتف الترويسة 19911. هاتف تواصل العمل الحر 920002654.",
  },
};

const hrsdDecision: Pair = {
  en: {
    label: "HRSD: Ministerial decision 99439",
    href: "https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/ministerial-decisions/808083",
    note: "Checked 27 October 2026. Publication date shown as 2 March 2021. Says the document term is one year, renewable, for citizens aged 18 to 60, after eligibility is checked on the approved platform. That age range is not the same as the service page.",
  },
  ar: {
    label: "وزارة الموارد البشرية: قرار العمل الحر 99439",
    href: "https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/ministerial-decisions/808083",
    note: "رُوجع في 27 أكتوبر 2026. تاريخ النشر الظاهر 2 مارس 2021. يقول إن مدة الوثيقة سنة قابلة للتجديد، للمواطنين من 18 إلى 60، بعد التحقق من الأهلية على المنصة المعتمدة. هذا المدى العمري ليس مطابقًا لصفحة الخدمة.",
  },
};

const hrsdGuide: Pair = {
  en: {
    label: "HRSD: Freelance Platform user guide (English PDF)",
    href: "https://www.hrsd.gov.sa/sites/default/files/2026-08/dlyl-almstkhdm-lmnst-al-ml-alhr---tqryr-anjlyzy.pdf",
    note: "Checked 27 October 2026. File path dated August 2026. The 'Creating a New Account' steps are freelance.sa, Login, Nafath, then an OTP. They do not repeat the service page's new-beneficiary path of an ID number and a date of birth. Issuance says to wait until attachments are reviewed. Document management can view status (active, expired, rejected), renew, cancel, or download. Support number in the guide: 920002654.",
  },
  ar: {
    label: "وزارة الموارد البشرية: دليل مستخدم منصة العمل الحر (PDF إنجليزي)",
    href: "https://www.hrsd.gov.sa/sites/default/files/2026-08/dlyl-almstkhdm-lmnst-al-ml-alhr---tqryr-anjlyzy.pdf",
    note: "رُوجع في 27 أكتوبر 2026. مسار الملف مؤرخ بأغسطس 2026. خطوات «إنشاء حساب» هي freelance.sa ثم Login ثم نفاذ ثم رمز OTP. لا تكرر مسار المستفيد الجديد في صفحة الخدمة (رقم الهوية وتاريخ الميلاد). الإصدار يقول انتظر مراجعة المرفقات. إدارة الوثيقة تعرض الحالة (سارية، منتهية، مرفوضة) وتتيح التجديد والإلغاء والتنزيل. رقم الدعم في الدليل: 920002654.",
  },
};

const zatcaIndividuals: Pair = {
  en: {
    label: "ZATCA: VAT registration for individuals",
    href: "https://zatca.gov.sa/en/eServices/Pages/eServices-002.aspx",
    note: "Checked 27 October 2026. Says the service is for annual revenues that exceed SAR 375,000, and is optional when revenues exceed SAR 187,500 and are less than SAR 375,000. The page says revenues. Do not calculate your own threshold from this shop.",
  },
  ar: {
    label: "هيئة الزكاة: تسجيل الأفراد في ضريبة القيمة المضافة",
    href: "https://zatca.gov.sa/en/eServices/Pages/eServices-002.aspx",
    note: "رُوجعت في 27 أكتوبر 2026. تقول إن الخدمة لمن تجاوزت إيراداته السنوية 375,000 ريال، وإن التسجيل اختياري إذا تجاوزت الإيرادات 187,500 ريال وكانت أقل من 375,000. الصفحة تتحدث عن الإيرادات. لا تحسب حدّك من هذا المتجر.",
  },
};

const zatcaRate: Pair = {
  en: {
    label: "ZATCA: Guideline on raising the standard VAT rate to 15%",
    href: "https://zatca.gov.sa/ar/HelpCenter/guidelines/Documents/VAT15.pdf",
    note: "Checked 27 October 2026. Says VAT began in 2018 at 5%, that the Ministry of Finance announced on 11 May 2020 a rise of the standard rate to 15%, and that the revised rate applies from 1 July 2020. The older news URL now opens a not-found page, so this note does not name a royal order. Confirm the rate on zatca.gov.sa before you charge it. Do not add 15% if you are not registered.",
  },
  ar: {
    label: "هيئة الزكاة: دليل رفع النسبة الأساسية لضريبة القيمة المضافة إلى 15%",
    href: "https://zatca.gov.sa/ar/HelpCenter/guidelines/Documents/VAT15.pdf",
    note: "رُوجع في 27 أكتوبر 2026. يقول إن الضريبة بدأت عام 2018 بنسبة 5%، وإن وزارة المالية أعلنت في 11 مايو 2020 رفع النسبة الأساسية إلى 15%، وإن النسبة المعدّلة تُطبَّق من 1 يوليو 2020. رابط الخبر القديم يفتح صفحة غير موجودة، لذلك لا نذكر رقم أمر ملكي هنا. تأكد من النسبة في البوابة قبل أن تفرضها. لا تضف 15% إذا لم تكن مسجّلًا.",
  },
};

const einvoice: Pair = {
  en: {
    label: "ZATCA: What is e-invoicing",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "Checked 27 October 2026. An electronic invoice is generated in a structured format. A paper invoice that was copied or scanned is not an electronic invoice. Phase one is described from 4 December 2021. This shop's invoice page is not a Fatoora solution.",
  },
  ar: {
    label: "هيئة الزكاة: ما هي الفوترة الإلكترونية",
    href: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx",
    note: "رُوجعت في 27 أكتوبر 2026. الفاتورة الإلكترونية تُنشأ بصيغة منظمة. الفاتورة الورقية التي نُسخت أو مُسحت ضوئيًا ليست فاتورة إلكترونية. الصفحة تصف المرحلة الأولى من 4 ديسمبر 2021. صفحة الفاتورة في هذا المتجر ليست حل فاتورة.",
  },
};

const uvaAts: Pair = {
  en: {
    label: "University of Virginia Career Center: Navigating ATS",
    href: "https://career.virginia.edu/navigating-ats/",
    note: "Checked 27 October 2026. Says images, columns, tables, and graphics are difficult for applicant systems to read, that text inside a text box is often not read, and that most systems cannot read a phone number or email left only in the header or footer. One university office, not a map of every Gulf portal, and not a promise of an interview.",
  },
  ar: {
    label: "مركز التوظيف في جامعة فرجينيا: أنظمة فرز الطلبات",
    href: "https://career.virginia.edu/navigating-ats/",
    note: "رُوجع في 27 أكتوبر 2026. يقول إن الصور والأعمدة والجداول والرسوم صعبة على أنظمة التقديم، وإن النص داخل مربع غالبًا لا يُقرأ، وإن أكثر الأنظمة لا تقرأ هاتفًا أو بريدًا في الترويسة أو التذييل فقط. مكتب جامعي واحد، لا خريطة لكل بوابة في الخليج، ولا وعد بمقابلة.",
  },
};

const nitaqat: Pair = {
  en: {
    label: "HRSD: Nitaqat calculator",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D9%86%D8%B7%D8%A7%D9%82%D8%A7%D8%AA",
    note: "Checked 27 October 2026. An employer service that estimates an establishment's Nitaqat band from worker counts and economic activity. A CV template does not change that band.",
  },
  ar: {
    label: "وزارة الموارد البشرية: حاسبة نطاقات",
    href: "https://www.hrsd.gov.sa/ministry-services/services/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D9%86%D8%B7%D8%A7%D9%82%D8%A7%D8%AA",
    note: "رُوجعت في 27 أكتوبر 2026. خدمة لأصحاب العمل تقدّر نطاق المنشأة من عدد العاملين والنشاط الاقتصادي. قالب السيرة لا يغيّر هذا النطاق.",
  },
};

const qiwaContracts: Pair = {
  en: {
    label: "Qiwa: Review a new employment contract",
    href: "https://qiwa.sa/en/employees/manage-your-career-qiwa/how-review-new-contracts",
    note: "Checked 27 October 2026. Qiwa's help article says a worker has 10 days to accept, reject, or request a modification of a pending contract. If there is no response, it says the pending contract is canceled. It does not say silence counts as acceptance. A CV does not do that, and it does not decide whether a residency profession matches a job.",
  },
  ar: {
    label: "قوى: مراجعة عقد عمل جديد",
    href: "https://qiwa.sa/en/employees/manage-your-career-qiwa/how-review-new-contracts",
    note: "رُوجعت في 27 أكتوبر 2026. مقال المساعدة في قوى يقول إن للعامل 10 أيام ليقبل العقد المعلّق أو يرفضه أو يطلب تعديله. وإذا لم يُجب، يقول المقال إن العقد المعلّق يُلغى. لا يقول إن السكوت قبول. السيرة لا تفعل ذلك، ولا تقرر إن كانت مهنة الإقامة تطابق الوظيفة.",
  },
};

function pack(pairs: Pair[], locale: Locale): PublicSource[] {
  return pairs.map((pair) => pair[locale]);
}

const bySlug: Record<string, Pair[]> = {
  "12-week-reset": [whoDiet, myPlate, niddk, nhsWeight, whoActivity, lifeline],
  "weeknight-table": [usdaLeftovers, whoFood, whoDiet, lifeline],
  "floor-and-form": [whoActivity, nhsStrength, lifeline],
  "the-quiet-budget": [cfpbDebt],
  "habit-ledger": [habitReview],
  "exam-room-method": [iesStudy],
  "steady-mind": [whoMind, lifeline],
  "saudi-freelancer-starter-kit": [freelance, hrsdService, hrsdDecision, hrsdGuide, zatcaIndividuals, zatcaRate, einvoice],
  "irregular-income-budget": [cfpbDebt],
  "gulf-ats-cv-kit": [uvaAts, nitaqat, qiwaContracts],
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
