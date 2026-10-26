import type { Locale } from "@/lib/i18n/config";

const limits: Record<string, { en: string; ar: string }> = {
  "12-week-reset": {
    en: "General information, not medical advice or a diet prescription. A calorie deficit is not safe for everyone. Talk with a licensed clinician before you change how you eat or train if you are pregnant, under 18, injured, managing an illness, or in treatment for an eating disorder. The plate in this guide is a template. It does not calculate a gram target for you, and it does not promise a weight.",
    ar: "معلومات عامة، وليست نصيحة طبية ولا وصفة حمية. عجز السعرات لا يناسب الجميع. تحدث مع مختص مرخّص قبل أن تغيّر أكلك أو تمرينك إذا كنتِ حاملًا، أو دون 18 عامًا، أو مصابًا، أو تعالج مرضًا، أو تتابع اضطراب أكل. الطبق في هذا الدليل قالب. لا يحسب لك غرامات، ولا يعدك برقم على الميزان.",
  },
  "weeknight-table": {
    en: "General cooking information, not a medical meal plan. Cooked leftovers in this file follow USDA guidance: 3 to 4 days in the fridge, then freeze or discard, and reheat to 165°F (74°C). Poultry is done when a thermometer in the thickest part reads 165°F (74°C), not when the juice looks clear. If a local authority sets a stricter rule, follow that.",
    ar: "معلومات طبخ عامة، وليست خطة وجبات طبية. بقايا الطعام المطبوخ في هذا الملف تتبع إرشاد وزارة الزراعة الأمريكية: 3 إلى 4 أيام في الثلاجة ثم التجميد أو الرمي، وإعادة التسخين إلى 165°ف (74°م). الدجاج ينضج حين يقرأ مقياس الحرارة 165°ف (74°م) في أسمك موضع، لا حين يبدو العصير صافيًا. إذا وضعت جهة محلية حدًا أشد، فاتبعه.",
  },
  "floor-and-form": {
    en: "General exercise education, not physical therapy and not a WHO or NHS program. Stop for sharp pain, chest pain, fainting, or dizziness. WHO and the NHS describe muscle-strengthening on at least 2 days a week for adults. This PDF does not claim to meet your aerobic minutes or to treat an injury.",
    ar: "تعليم عام للتمرين، وليس علاجًا طبيعيًا ولا برنامجًا لمنظمة الصحة العالمية أو لهيئة الخدمات الصحية البريطانية. توقف عند الألم الحاد أو ألم الصدر أو الإغماء أو الدوخة. توصي الجهتان بتمارين تقوية للعضلات في يومين على الأقل أسبوعيًا للبالغين. هذا الملف لا يدّعي أنه يكمّل دقائق نشاطك الهوائي ولا أنه يعالج إصابة.",
  },
  "the-quiet-budget": {
    en: "General education, not financial, tax, credit, or investment advice. After minimum payments, the US Consumer Financial Protection Bureau describes two choices for extra money: the highest interest rate, or the smallest balance (snowball). Neither is required, and neither is written for every country or every debt. If you cannot pay minimums, contact the lender and a nonprofit counselor. Do not pay a company that promises to delete accurate debt.",
    ar: "تعليم عام، وليس نصيحة مالية أو ضريبية أو ائتمانية أو استثمارية. بعد سداد الحدود الدنيا، يصف مكتب الحماية المالية للمستهلك في أمريكا خيارين للمبلغ الزائد: الدين الأعلى فائدة، أو الرصيد الأصغر. لا أحد منهما إلزام، ولا هما مكتوبين لكل بلد أو كل دين. إذا عجزت عن الحدود الدنيا، تواصل مع الجهة الدائنة ومع مستشار غير ربحي. لا تدفع لجهة تعدك بحذف دين صحيح.",
  },
  "habit-ledger": {
    en: "A planning method, not a scientific prescription. It does not claim a habit becomes automatic after 21 days, or after any fixed number of days. A missed day is a reason to restart at the next cue, not a verdict on you.",
    ar: "طريقة تخطيط، وليست وصفة علمية. لا يدّعي الدليل أن العادة تصبح تلقائية بعد 21 يومًا، ولا بعد أي عدد ثابت من الأيام. اليوم الفائت سبب لتعود عند الإشارة التالية، لا حكمًا عليك.",
  },
  "first-client": {
    en: "Practical education for a small service offer. It is not legal, tax, or employment advice. Contracts and taxes depend on where you live. Have a qualified person review anything you will sign or file. The guide does not promise clients or income.",
    ar: "تعليم عملي لعرض خدمة صغير. ليس استشارة قانونية أو ضريبية أو وظيفية. العقود والضرائب تعتمد على بلدك. اطلب من شخص مؤهل مراجعة أي شيء ستوقّعه أو تقدّمه. الدليل لا يعد بعملاء أو دخل.",
  },
  "exam-room-method": {
    en: "Study methods, not a promise of a grade or a license. Spacing study over time and quizzing yourself are techniques described for learning. They do not replace your syllabus, a missing prerequisite, or accommodations from your institution. This guide does not set how many hours you must sleep.",
    ar: "طرق دراسة، وليست وعدًا بدرجة أو رخصة. توزيع المذاكرة على الوقت واختبار نفسك أسلوبان موصوفان للتعلّم. لا يغنيان عن منهجك، ولا عن متطلب ناقص، ولا عن التسهيلات التي تمنحها جهتك. هذا الدليل لا يحدد كم ساعة يجب أن تنام.",
  },
  "steady-mind": {
    en: "Wellness education, not therapy, a diagnosis, or crisis care. Stop a practice that leaves you more distressed. A breathing exercise is not treatment for panic or depression. If you might hurt yourself, contact local emergency services. In the United States, call or text 988. That line is not a hotline for other countries.",
    ar: "تعليم للعافية، وليس علاجًا نفسيًا ولا تشخيصًا ولا رعاية أزمة. توقف عن تمرين يزيد ضيقك. تمرين التنفس ليس علاجًا للهلع أو الاكتئاب. إذا كنت قد تؤذي نفسك، تواصل مع طوارئ منطقتك. في الولايات المتحدة اتصل أو أرسل 988. هذا الخط ليس خطًا لدول أخرى.",
  },
  "saudi-freelancer-starter-kit": {
    en: "General information, not legal, tax, zakat, or employment advice. The freelance document is issued only on freelance.sa. Checked on 26 October 2026, the HRSD service page, ministerial decision 99439, and the English user guide do not tell one story about the upper age, how fast a document is issued, or how renewal works. If they disagree with the screen you are logged into, believe the screen. The freelance contact block and the user guide list 920002654. The service page header also shows 19911. Do not follow a link that leaves freelance.sa, including a renewal answer on the HRSD page that pointed at the National Volunteer Portal. VAT and e-invoicing belong to ZATCA. This file does not register you, and a scan of the invoice page is not an electronic invoice.",
    ar: "معلومات عامة، وليست استشارة قانونية أو ضريبية أو زكوية أو وظيفية. وثيقة العمل الحر لا تصدر إلا من freelance.sa. عند المراجعة في 26 أكتوبر 2026، صفحة خدمة الوزارة وقرار 99439 ودليل المستخدم الإنجليزي لا يروون قصة واحدة عن سقف العمر، أو سرعة الإصدار، أو طريقة التجديد. إذا خالفت الشاشة التي دخلت إليها، فصدّق الشاشة. خانة تواصل العمل الحر ودليل المستخدم يذكران 920002654. وترويسة صفحة الخدمة تذكر أيضًا 19911. لا تتبع رابطًا يخرجك من freelance.sa، ومنها إجابة تجديد في صفحة الوزارة كانت تشير إلى المنصة الوطنية للعمل التطوعي. الضريبة والفوترة الإلكترونية عند هيئة الزكاة والضريبة والجمارك. هذا الملف لا يسجّلك، وصورة صفحة الفاتورة ليست فاتورة إلكترونية.",
  },
  "irregular-income-budget": {
    en: "General education, not financial, tax, or credit advice. Planning from a low month you can document is a choice, not a forecast. After minimums, pick one debt method and stay with it. The guide does not promise a saved amount or a debt-free date, and the invoice page is not tax advice.",
    ar: "تعليم عام، وليس نصيحة مالية أو ضريبية أو ائتمانية. التخطيط من شهر منخفض تستطيع توثيقه اختيار، لا توقّع. بعد الحدود الدنيا اختر طريقة واحدة للدين والتزم بها. الدليل لا يعد بمبلغ تدّخره أو بتاريخ خروج من الدين، وصفحة الفاتورة ليست استشارة ضريبية.",
  },
  "gulf-ats-cv-kit": {
    en: "Education about CVs and applications, not a promise of an interview, a job, a visa, or a salary. Some career offices suggest one column and plain headings because some screening software mishandles tables, images, and text that lives only in a header. Software differs, so this is a precaution, not a map of every portal. HRSD's Nitaqat calculator is a tool for employers, based on worker counts and the establishment's activity. A CV does not change a band, and it cannot tell you whether a job matches the profession on a residency. Read the posting. Profession and contract questions are handled on Qiwa and with the employer, not in this file.",
    ar: "تعليم عن السير والتقديم، وليس وعدًا بمقابلة أو وظيفة أو تأشيرة أو راتب. تنصح بعض مكاتب التوظيف الجامعي بعمود واحد وعناوين واضحة لأن بعض برامج الفرز تتعثر في الجداول والصور والنص الذي يعيش في الترويسة فقط. البرامج تختلف، فهذا احتياط لا خريطة لكل بوابة. حاسبة نطاقات في موقع الوزارة أداة لأصحاب العمل، بحسب عدد العاملين ونشاط المنشأة. السيرة لا تغيّر النطاق، ولا تقول لك إن كانت الوظيفة تطابق مهنة الإقامة. اقرأ الإعلان. أسئلة المهنة والعقد تُعالج في قوى ومع صاحب العمل، لا في هذا الملف.",
  },
  "health-fitness-bundle": {
    en: "Three educational PDFs, not a supervised medical or training program. Read the limit inside each file. Plates, storage times, and exercise cues are general information. Buying them together does not turn them into a prescription.",
    ar: "ثلاثة ملفات تعليمية، وليست برنامجًا طبيًا أو تدريبيًا تحت إشراف. اقرأ حدّ كل ملف. الأطباق ومدد الحفظ وتنبيهات التمرين معلومات عامة. شراؤها معًا لا يحوّلها إلى وصفة.",
  },
  "work-money-bundle": {
    en: "Three educational PDFs. They are not financial, legal, or tax advice, and they do not promise a habit, clients, or a debt-free date.",
    ar: "ثلاثة ملفات تعليمية. ليست نصيحة مالية أو قانونية أو ضريبية، ولا تعد بعادة أو عملاء أو خروج من الدين.",
  },
  "gulf-work-bundle": {
    en: "Three educational PDFs. They are not legal, tax, immigration, or career advice, and they do not promise a freelance document, a client, a visa, or a job. Confirm the live rule on the official screen before you apply, invoice, or send a CV.",
    ar: "ثلاثة ملفات تعليمية. ليست استشارة قانونية أو ضريبية أو خاصة بالهجرة أو بالمسار المهني، ولا تعد بوثيقة عمل حر أو عميل أو تأشيرة أو وظيفة. تأكد من القاعدة الظاهرة على الشاشة الرسمية قبل أن تقدّم أو تصدر فاتورة أو ترسل سيرة.",
  },
};

export function limitFor(slug: string, locale: Locale): string {
  return limits[slug]?.[locale] ?? "";
}
