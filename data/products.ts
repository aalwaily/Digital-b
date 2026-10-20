export const categories = [
  {
    slug: "health",
    name: "Health & nutrition",
    description: "Weight loss structure and weeknight cooking that can survive a busy calendar.",
  },
  {
    slug: "fitness",
    name: "Home fitness",
    description: "Strength sessions that use a floor, a wall, and time you actually have.",
  },
  {
    slug: "finance",
    name: "Personal finance",
    description: "A calmer way to see spending, saving, debt, and months when income is uneven.",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description: "Fewer habits, a weekly review, and a schedule that bends when life does.",
  },
  {
    slug: "career",
    name: "Freelance & work",
    description: "Freelance offers, Saudi freelance-document basics, and CVs a screener can read.",
  },
  {
    slug: "learning",
    name: "Study skills",
    description: "Study methods that hold up in the exam room, not just in a highlighted notebook.",
  },
  {
    slug: "mindfulness",
    name: "Mindfulness",
    description: "Short practices for stress, attention, and days that feel too loud.",
  },
  {
    slug: "bundles",
    name: "Bundles",
    description: "Full guides grouped at a lower price, delivered as separate PDFs.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type CoverMotif =
  | "path"
  | "plate"
  | "form"
  | "ledger"
  | "grid"
  | "mark"
  | "bars"
  | "breath"
  | "bundle";

export type Faq = { question: string; answer: string };

type Shared = {
  slug: string;
  title: string;
  subtitle: string;
  category: CategorySlug;
  price: number;
  /** Last USD price actually charged, before the 50% reduction. */
  previousPrice?: number;
  /** Whole riyals for Hala. New USD price × 3.75, rounded to the nearest riyal. */
  priceSar: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string[];
  included: string[];
  contents: string[];
  pageCount: number;
  faqs: Faq[];
  featured?: boolean;
  published: string;
  cover: {
    bg: string;
    fg: string;
    accent: string;
    motif: CoverMotif;
    titleLines: string[];
    eyebrow: string;
    deck: string;
  };
};

export type Guide = Shared & { kind: "guide" };
export type Bundle = Shared & { kind: "bundle"; includes: string[] };
export type Product = Guide | Bundle;

export const products: Product[] = [
  {
    kind: "guide",
    slug: "12-week-reset",
    title: "The 12-Week Reset",
    subtitle: "A steady plan for fat loss without a crash diet",
    category: "health",
    price: 14.5,
    previousPrice: 29,
    priceSar: 54,
    shortDescription:
      "Twelve weeks of protein, steps, strength, and weekends that still include your life.",
    description: [
      "The 12-Week Reset is a field manual for losing fat without turning your kitchen into a second job. It uses a modest calorie deficit, a protein target you can hit with ordinary food, daily steps, and two or three short strength sessions.",
      "The schedule is written in weeks, not moods. You will set a baseline, build a plate you can repeat, and use a Sunday review when the scale sticks, travel shows up, or a social meal blows the plan.",
      "This is education, not medical care. The guide tells you when a doctor, a registered dietitian, or a qualified coach is the right next step, and it does not promise a number on the scale.",
    ],
    included: [
      "A 12-week schedule with training days, step floors, and review points",
      "Protein and plate templates for breakfast, lunch, dinner, and snacks",
      "Three no-gym strength sessions with progressions",
      "Hunger, travel, and social-meal playbooks",
      "A weekly review checklist and a 12-week tracker",
      "A plain-language medical disclaimer and red-flag list",
    ],
    contents: [
      "How to use this guide",
      "What actually moves the scale",
      "Set your baseline",
      "Protein, plates, and weekends",
      "The 12-week schedule",
      "Strength without a gym",
      "Steps, sleep, and hunger",
      "Plateaus, travel, and social meals",
      "Weekly review checklist",
      "When to get more help",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 14,
    featured: true,
    published: "2026-02-03",
    cover: {
      bg: "#1E3A32",
      fg: "#F3EDE2",
      accent: "#E4B15A",
      motif: "path",
      titleLines: ["The 12-Week", "Reset"],
      eyebrow: "Health & nutrition",
      deck: "A steady fat-loss plan",
    },
    faqs: [
      {
        question: "Is this a diet with meal-by-meal menus?",
        answer:
          "No. You get plate templates, protein targets, and example days, then you fit them to the food you already cook. Weeknight Table is the recipe companion if you want a prep system.",
      },
      {
        question: "Do I need a gym or a tracker?",
        answer:
          "No gym. A kitchen scale is useful for two baseline days, then optional. Steps can come from a phone. The workouts use the floor and a chair.",
      },
      {
        question: "Who should not follow a deficit from a PDF?",
        answer:
          "Anyone pregnant, under 18, managing an eating disorder, or under medical care for a condition affected by diet or exercise. Read the disclaimer and talk with a licensed clinician first.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "weeknight-table",
    title: "Weeknight Table",
    subtitle: "Meal prep and healthy recipes for busy weeks",
    category: "health",
    price: 12,
    previousPrice: 24,
    priceSar: 45,
    shortDescription:
      "A 90-minute Sunday prep plus recipes that recombine into lunches and dinners.",
    description: [
      "Weeknight Table is a cooking system for people who want to eat well on a Tuesday and do not want a second full-time job. You prep a few building blocks, then assemble meals instead of starting from zero.",
      "The guide includes a four-week rotation, sauce formulas that make the same chicken taste different, and full recipes with servings, times, and storage notes. Shopping lists are grouped the way a store is actually walked.",
      "Nutrition here is practical, not clinical. The recipes lean on vegetables, protein, and fiber. They are not a medical meal plan, and the guide says so.",
    ],
    included: [
      "A 90-minute Sunday prep sequence",
      "Building-block formulas for proteins, grains, and vegetables",
      "Four sauce formulas and a four-week rotation",
      "Eight complete recipes with storage times",
      "A grouped shopping list and a food-safety table",
      "Budget swaps when produce or protein prices jump",
    ],
    contents: [
      "How to use this guide",
      "The 90-minute Sunday prep",
      "Building blocks that recombine",
      "Sauces that rescue leftovers",
      "A four-week rotation",
      "Eight recipes",
      "Shopping, storage, and safety",
      "Cooking on a tighter budget",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 14,
    published: "2026-02-17",
    cover: {
      bg: "#8C3A2F",
      fg: "#FBF6EF",
      accent: "#F0D2B4",
      motif: "plate",
      titleLines: ["Weeknight", "Table"],
      eyebrow: "Health & nutrition",
      deck: "Meal prep that holds up",
    },
    faqs: [
      {
        question: "Are the recipes written for a specific diet?",
        answer:
          "They are omnivore by default, with a noted vegetarian swap on each recipe. They are not keto, and they are not a plan for a medical condition.",
      },
      {
        question: "How much cooking experience do I need?",
        answer:
          "If you can boil pasta and roast a sheet pan, you can cook these. Each recipe lists time, heat, and what 'done' looks like.",
      },
      {
        question: "Can I prep for one person?",
        answer:
          "Yes. The Sunday sequence has a one-person cut so you are not storing a week's food for a family of four.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "floor-and-form",
    title: "Floor & Form",
    subtitle: "A no-equipment workout program",
    category: "fitness",
    price: 13.5,
    previousPrice: 27,
    priceSar: 51,
    shortDescription:
      "Three full-body sessions, an eight-week progression, and form cues for a living room.",
    description: [
      "Floor & Form is strength training for a room with a floor and a doorframe. There are no bands to buy and no machines to book. Sessions A, B, and C cover squat, hinge, push, pull, and carry patterns using your body and gravity.",
      "The eight-week progression tells you when to add reps, slow the lowering, or move to a harder variation. Form cues are written for someone training alone, including what to feel and when to stop a set.",
      "Exercise is not medical treatment. The guide includes joint flags, a warm-up, and a clear note to get in-person coaching or clinical care if pain is sharp, swelling, or unexplained.",
    ],
    included: [
      "Sessions A, B, and C with sets, reps, and rest",
      "An eight-week progression table",
      "A five-minute warm-up and a finisher",
      "Form cues and regressions for each pattern",
      "A soreness versus pain checklist",
      "A training log you can print",
    ],
    contents: [
      "How to use this guide",
      "Principles before sweat",
      "Warm-up and positions",
      "Sessions A, B, and C",
      "The eight-week progression",
      "Form cues when you train alone",
      "Soreness, joints, and rest",
      "A short conditioning finisher",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 13,
    published: "2026-03-03",
    cover: {
      bg: "#243028",
      fg: "#F4F1EA",
      accent: "#C6D98A",
      motif: "form",
      titleLines: ["Floor", "& Form"],
      eyebrow: "Home fitness",
      deck: "Strength, no equipment",
    },
    faqs: [
      {
        question: "I cannot do a push-up yet. Is this still for me?",
        answer:
          "Yes. Every push and pull pattern has an easier variation, including wall and incline versions. Start where the last reps are hard but clean.",
      },
      {
        question: "How long is a session?",
        answer:
          "About 30 to 40 minutes, including the warm-up. Two sessions a week is the minimum written into the plan. Three is the standard.",
      },
      {
        question: "Will this replace physical therapy?",
        answer:
          "No. If you are rehabbing an injury, follow your clinician. Use this program only if you are cleared for general exercise.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "the-quiet-budget",
    title: "The Quiet Budget",
    subtitle: "A personal finance guide to spending, saving, and debt",
    category: "finance",
    price: 11,
    previousPrice: 22,
    priceSar: 41,
    shortDescription:
      "One evening to see your money clearly, then a monthly hour that does not rely on shame.",
    description: [
      "The Quiet Budget is a personal system for people who are tired of apps that scold them and spreadsheets they abandon. You will list what comes in, give every dollar a job, and separate true bills from leaks.",
      "Debt gets an order: minimums first, then either avalanche or snowball, chosen on purpose. Sinking funds cover the expenses that are not monthly but are not surprises either, like car registration and gifts.",
      "Nothing here is investment advice, tax advice, or a promise that a budget will fix a structural income problem. The last chapter is explicit about what a PDF cannot do.",
    ],
    included: [
      "A one-evening money snapshot",
      "A pay-yourself-first monthly plan",
      "Avalanche and snowball comparison tables",
      "Emergency fund and sinking-fund worksheets",
      "Scripts for awkward money conversations",
      "A one-hour monthly review agenda",
    ],
    contents: [
      "How to use this guide",
      "See the month honestly",
      "Give every dollar a job",
      "Debt, in an order that works",
      "Emergency fund and sinking funds",
      "The monthly money hour",
      "Leaks, scripts, and tradeoffs",
      "What this guide will not do",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 13,
    featured: true,
    published: "2026-03-18",
    cover: {
      bg: "#1C2A44",
      fg: "#F6F1E7",
      accent: "#D4A574",
      motif: "ledger",
      titleLines: ["The Quiet", "Budget"],
      eyebrow: "Personal finance",
      deck: "Spending, saving, and debt",
    },
    faqs: [
      {
        question: "Do I need a particular app?",
        answer:
          "No. The worksheets are printable and also easy to copy into a notes app or spreadsheet. Use a bank's export if you have one.",
      },
      {
        question: "Does this cover investing?",
        answer:
          "Only at the level of 'fund the emergency buffer before you invest extra.' It does not recommend funds, stocks, or allocation percentages.",
      },
      {
        question: "What if my income changes every month?",
        answer:
          "There is a variable-income version of the monthly plan that budgets off a low month and parks the surplus, instead of pretending every month looks like the average.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "habit-ledger",
    title: "The Habit Ledger",
    subtitle: "A planner for habits and time",
    category: "productivity",
    price: 9.5,
    previousPrice: 19,
    priceSar: 36,
    shortDescription:
      "Keystone habits, time blocks, and a weekly review that fits on one page.",
    description: [
      "The Habit Ledger is for people who own three planners and still lose the week. It asks you to pick fewer habits, attach each one to a cue that already happens, and review the week on a single page.",
      "Time blocking is treated as a draft, not a moral document. The guide shows how to protect two deep-work blocks, leave slack, and restart after a missed day without a new personality.",
      "There are printable ledger pages for thirty days. The point is repetition you can see, not a perfect streak.",
    ],
    included: [
      "A method for choosing one to three keystone habits",
      "Cue, friction, and environment worksheets",
      "A weekly time-block template with slack built in",
      "A one-page weekly review",
      "A thirty-day starter plan",
      "Printable ledger pages",
    ],
    contents: [
      "How to use this guide",
      "Pick fewer habits",
      "Design the cue",
      "Time blocks for a real week",
      "The weekly review",
      "When you miss",
      "A thirty-day starter",
      "Printable ledger pages",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 12,
    featured: true,
    published: "2026-04-07",
    cover: {
      bg: "#3E342C",
      fg: "#F7F1E8",
      accent: "#E6C07B",
      motif: "grid",
      titleLines: ["The Habit", "Ledger"],
      eyebrow: "Productivity",
      deck: "Habits and time, one page",
    },
    faqs: [
      {
        question: "Is this a daily diary?",
        answer:
          "No. The daily page is a few checkboxes and a time-block draft. The longer writing happens once a week, and it is short on purpose.",
      },
      {
        question: "Can I use it for work and home habits together?",
        answer:
          "Yes. The cap is three active habits so a work habit and a home habit do not become a list of twelve.",
      },
      {
        question: "Does it assume a 9-to-5 schedule?",
        answer:
          "No. The time-block examples include a shift week and a caregiver week, not only an office calendar.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "first-client",
    title: "First Client",
    subtitle: "A freelancing and side-hustle starter guide",
    category: "career",
    price: 16,
    previousPrice: 32,
    priceSar: 60,
    shortDescription:
      "Choose an offer, price it, and find the first paying clients without quitting your job.",
    description: [
      "First Client is a thirty-day start for a service you can sell beside a job. You will narrow an offer until a stranger can understand it, price it with a floor and a ceiling, and ask for work in places you already have access to.",
      "The guide covers proposals, deposits, scope, a simple pipeline, and invoices. It is blunt about contracts and taxes: those depend on where you live, and a PDF is not your lawyer or your accountant.",
      "It does not promise income. It gives you a sequence that has a stopping point, so a side hustle does not quietly become an unpaid second shift.",
    ],
    included: [
      "An offer worksheet that forces a specific buyer and outcome",
      "A pricing table with floor, target, and walk-away numbers",
      "Five outreach paths that do not require an audience",
      "A one-page proposal outline and a deposit rule",
      "A pipeline you can run in a notebook",
      "A thirty-day plan that fits evenings and one weekend block",
    ],
    contents: [
      "How to use this guide",
      "An offer someone can buy",
      "Pricing without guessing wildly",
      "Proof before a big audience",
      "Five ways to the first clients",
      "Proposals, scope, and deposits",
      "Delivery, invoices, and a pipeline",
      "Thirty days beside a job",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 14,
    featured: true,
    published: "2026-04-21",
    cover: {
      bg: "#1A1D24",
      fg: "#F4F0E8",
      accent: "#7EB6C9",
      motif: "mark",
      titleLines: ["First", "Client"],
      eyebrow: "Freelance & work",
      deck: "A side hustle you can start",
    },
    faqs: [
      {
        question: "Does this work for products, or only services?",
        answer:
          "It is written for services: design, writing, bookkeeping, tutoring, consulting, and similar work. A physical product needs inventory and shipping this guide does not cover.",
      },
      {
        question: "Will you tell me what to charge?",
        answer:
          "You will calculate a floor from your time and costs, then a target. The guide does not pretend there is one market rate for every city and skill.",
      },
      {
        question: "Is the contract language something I can copy into a client agreement?",
        answer:
          "No. You get a checklist of clauses to discuss with a qualified professional. Copying a template into a contract is how people get surprised.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "exam-room-method",
    title: "The Exam Room Method",
    subtitle: "Study skills and exam preparation",
    category: "learning",
    price: 10.5,
    previousPrice: 21,
    priceSar: 39,
    shortDescription:
      "Retrieval practice, spacing, and a weekly plan you can apply to any subject.",
    description: [
      "The Exam Room Method is a study system for courses and licensing exams. It replaces rereading with retrieval, spaces reviews before you feel ready, and turns a vague 'I'll study this weekend' into a weekly plan.",
      "You will build a small set of notes worth keeping, write questions as you learn, and use practice tests as information rather than as a verdict on your character.",
      "The guide does not know your syllabus. It gives you methods and blank plans you fill with the course in front of you. It also treats sleep as part of studying, because all-nighters are a poor strategy with a long research trail.",
    ],
    included: [
      "A retrieval and spacing schedule",
      "A note format that produces questions, not transcripts",
      "A weekly study plan table",
      "Practice-test review sheets",
      "An exam-morning checklist",
      "A section on sleep, caffeine, and asking for accommodations",
    ],
    contents: [
      "How to use this guide",
      "Why rereading fails",
      "Retrieval and spacing",
      "Notes worth keeping",
      "The weekly study plan",
      "Practice tests as information",
      "The day before and the morning of",
      "Energy, sleep, and asking for help",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 12,
    published: "2026-05-12",
    cover: {
      bg: "#2C2460",
      fg: "#F6F2EA",
      accent: "#F0C36A",
      motif: "bars",
      titleLines: ["The Exam", "Room Method"],
      eyebrow: "Study skills",
      deck: "Preparation that holds up",
    },
    faqs: [
      {
        question: "Will this raise my score by a set amount?",
        answer:
          "No. Better methods improve the odds of remembering what you practiced. They do not override a missing prerequisite or an exam you have not prepared for.",
      },
      {
        question: "Does it matter whether the exam is multiple choice?",
        answer:
          "The weekly plan works for both. The practice-test chapter has a separate pass for essays and for multiple choice.",
      },
      {
        question: "Can a high school student use it?",
        answer:
          "Yes, with a teacher's or parent's involvement if the student is under 18. The tone is adult and direct, not a children's workbook.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "steady-mind",
    title: "Steady Mind",
    subtitle: "A mindfulness and stress-relief guide",
    category: "mindfulness",
    price: 9,
    previousPrice: 18,
    priceSar: 34,
    shortDescription:
      "Ten-minute practices, a stress log, and a four-week plan for steadier days.",
    description: [
      "Steady Mind is a small set of practices for stress and attention. You will learn a breath pattern you can use in a meeting, a ten-minute body scan with a script, and a log that shows which hours of the week actually cost you.",
      "The four-week plan is short on purpose. Each day has one practice, not a stack of apps. There is a chapter on phones, boundaries, and the difference between rest and avoidance.",
      "This is wellness education, not therapy. The guide says when to stop self-managing and talk with a licensed clinician, and it includes the 988 line for people in the United States who are in crisis.",
    ],
    included: [
      "Three breath practices with timings",
      "A ten-minute body-scan script",
      "A one-page stress log",
      "A four-week practice plan",
      "Boundary scripts for work and home",
      "A clear note on crisis care and what this PDF is not",
    ],
    contents: [
      "How to use this guide",
      "A smaller definition of practice",
      "Breath you can use in public",
      "A ten-minute body scan",
      "The stress log",
      "Attention, phones, and boundaries",
      "Four weeks, written out",
      "When to reach past this PDF",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 12,
    published: "2026-06-02",
    cover: {
      bg: "#3D4F55",
      fg: "#F4F7F6",
      accent: "#D5E2DC",
      motif: "breath",
      titleLines: ["Steady", "Mind"],
      eyebrow: "Mindfulness",
      deck: "Short practices for stress",
    },
    faqs: [
      {
        question: "Is this a meditation course?",
        answer:
          "It is a short guide with a few practices, not a spiritual curriculum and not an eight-hour course. If a practice makes you more distressed, you stop. The last chapter explains why.",
      },
      {
        question: "How long do I need each day?",
        answer:
          "Ten minutes is the default. Two of the breath practices take under two minutes and are meant for hallways and parking lots.",
      },
      {
        question: "Can this replace counseling?",
        answer:
          "No. If worry, low mood, or panic is persistent, or if you might hurt yourself, contact a licensed clinician or local emergency services. In the United States, call or text 988.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "saudi-freelancer-starter-kit",
    title: "Saudi Freelancer Starter Kit",
    subtitle: "English edition: the freelance document, pricing, proposals, and invoices",
    category: "career",
    price: 8.5,
    previousPrice: 17,
    priceSar: 32,
    shortDescription:
      "How to use the official freelance platform, price work in SAR, and send a proposal and an invoice. Not legal advice.",
    description: [
      "The Saudi Freelancer Starter Kit is an English field guide for someone in Saudi Arabia who wants to sell a service. It walks through the Freelance Work Document on the official platform (freelance.sa), then pricing, a thirty-day plan, outreach, a proposal page, and an invoice page you can print.",
      "Rules change. The guide is dated October 2026 and tells you to read the screen on the official platform, and to ask a Saudi lawyer or accountant before you sign, register for VAT, or treat a template as a contract. It does not promise clients or income.",
      "This edition is English. The PDF fonts and layout do not shape Arabic right-to-left text, so Arabic headings are not in the file.",
    ],
    included: [
      "A checklist for the Freelance Work Document on the official platform, with a verify-the-rules box",
      "A SAR pricing worksheet: floor, target, and walk-away",
      "A thirty-day plan that fits beside a job",
      "Outreach scripts you edit, plus a proposal page",
      "A printable invoice page with a VAT line you use only if you are registered",
      "Questions to take to an accountant about VAT, zakat, and e-invoicing",
    ],
    contents: [
      "How to use this guide",
      "What the freelance document is",
      "Before you open the portal",
      "On the official platform",
      "Price the work in riyals",
      "Thirty days beside a job",
      "Where clients actually come from",
      "Messages you can edit",
      "Proposal page",
      "Scope, deposits, and contracts",
      "Invoice page",
      "VAT, zakat, and your accountant",
      "Records and a simple pipeline",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 16,
    featured: true,
    published: "2026-10-18",
    cover: {
      bg: "#1B3A34",
      fg: "#F6F1E7",
      accent: "#E2B15C",
      motif: "mark",
      titleLines: ["Saudi", "Freelancer"],
      eyebrow: "Freelance & work",
      deck: "Document, price, invoice",
    },
    faqs: [
      {
        question: "Does this file get me the freelance document?",
        answer:
          "No. You apply on the official platform, freelance.sa (منصة العمل الحر). The PDF tells you what to read there and what the document is not. Eligibility is decided by the portal, not by this guide.",
      },
      {
        question: "Is the proposal a contract I can send as legal advice?",
        answer:
          "No. The proposal page is a scope and price sheet you fill in. The contract chapter is a list of points to take to a qualified person. It is not a substitute for a lawyer, and it is not written for every activity or every city.",
      },
      {
        question: "Is the invoice a ZATCA e-invoice?",
        answer:
          "No. It is a paper or PDF bill with the fields a client needs to pay you. If you are registered for VAT, you still have to follow ZATCA's e-invoicing rules. Confirm the current rate and thresholds on zatca.gov.sa.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "irregular-income-budget",
    title: "Irregular-Income Budget + Invoice Sheets",
    subtitle: "A budget for months that are not the same size, plus invoice pages",
    category: "finance",
    price: 7.5,
    previousPrice: 15,
    priceSar: 28,
    shortDescription:
      "Plan from a low month, park surplus, track invoices, and review the month on paper. Not financial advice.",
    description: [
      "Irregular-Income Budget + Invoice Sheets is for freelancers, commission, and other lumpy pay. You plan from a low month you can document, move surplus from a high month into a buffer, and keep bills separate from spending money.",
      "The PDF includes the worksheets: a six-month income log, a bill calendar, sinking funds, a debt order you choose, an invoice, and a payment tracker. There is no spreadsheet file. Print the pages or fill them on screen.",
      "This is general education. It is not tax, credit, or investment advice, and it does not promise that you will save a particular amount or get out of debt.",
    ],
    included: [
      "A low-month baseline instead of an average that hides the thin months",
      "A buffer rule for moving surplus without inventing a new lifestyle",
      "Sinking-fund and debt worksheets",
      "A monthly review you can finish in an hour",
      "A blank invoice and a payment tracker",
      "A plain-language note on what this PDF will not decide for you",
    ],
    contents: [
      "How to use this guide",
      "Why the average month lies",
      "The low-month baseline",
      "Bills, buffer, and spending",
      "Sinking funds",
      "Debt in one order",
      "The monthly hour",
      "Invoices and getting paid",
      "Invoice page",
      "When the numbers do not fit",
      "A high month, written down",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 15,
    featured: true,
    published: "2026-10-18",
    cover: {
      bg: "#3B2A22",
      fg: "#F8F3EA",
      accent: "#E7A15A",
      motif: "ledger",
      titleLines: ["Irregular", "Income"],
      eyebrow: "Personal finance",
      deck: "Budget and invoice sheets",
    },
    faqs: [
      {
        question: "Do I get a Google Sheet or an Excel file?",
        answer:
          "No. The worksheets and the invoice are pages in the PDF, with room to write. Print them or fill the PDF. The Quiet Budget is the companion if you want the one-evening snapshot without the invoice pages.",
      },
      {
        question: "What if I only have one month of records?",
        answer:
          "Use that month as the baseline and mark it as thin evidence. Do not invent the other months. After two more real months, rewrite the baseline.",
      },
      {
        question: "Will this tell me which debt to pay off first?",
        answer:
          "It explains avalanche and snowball and gives you a page to pick one. It does not know your rates, and it is not a recommendation to open a new loan. If you cannot pay minimums, contact the lender and a nonprofit counselor.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "gulf-ats-cv-kit",
    title: "Saudi & Gulf Job-Search and ATS CV Kit",
    subtitle: "A single-column CV, a cover letter, and a LinkedIn draft for Gulf applications",
    category: "career",
    price: 6,
    previousPrice: 12,
    priceSar: 23,
    shortDescription:
      "Structure a CV a screener can read, with Gulf notes, a cover letter, and interview prep. No job promises.",
    description: [
      "The Saudi & Gulf Job-Search and ATS CV Kit shows how to build a single-column CV with ordinary headings, dates a form can read, and bullets you can prove. It includes a cover-letter page, LinkedIn headline and About prompts, and a short interview worksheet.",
      "Gulf notes cover language (send the language the posting asked for), Gregorian dates, why a photo and a text box often get dropped, and the limits of this PDF: it cannot change Saudization rules or an iqama profession.",
      "Nothing here promises an interview, a visa, or a job. If a posting says who may apply, believe the posting.",
    ],
    included: [
      "An ATS structure: one column, standard headings, no tables or icons in the CV itself",
      "A bilingual note: two files when the employer needs Arabic and English, not mixed scripts in one parser",
      "A cover-letter page and LinkedIn headline and About prompts",
      "An achievement worksheet that does not ask you to invent a percentage",
      "Interview prompts and an application tracker",
      "Gulf notes on dates, photos, Saudization, and iqama limits",
    ],
    contents: [
      "How to use this guide",
      "What a screener actually receives",
      "One column, plain headings",
      "Dates, language, and two files",
      "Bullets you can prove",
      "Gulf notes",
      "Cover letter page",
      "LinkedIn headline and About",
      "Interview prep",
      "Application tracker",
      "Before you submit",
      "A worked example",
      "Field pages",
      "Thirty-day log",
    ],
    pageCount: 15,
    published: "2026-10-18",
    cover: {
      bg: "#1E2F44",
      fg: "#F4F1EA",
      accent: "#7EB8B0",
      motif: "path",
      titleLines: ["Gulf Job", "Search"],
      eyebrow: "Freelance & work",
      deck: "ATS CV and applications",
    },
    faqs: [
      {
        question: "Will this CV get me an interview?",
        answer:
          "No. A clear CV is easier to read. Hiring depends on the role, the employer, and your record. The guide says so, and it does not include a success rate.",
      },
      {
        question: "Should I put a photo and my iqama number on the CV?",
        answer:
          "Follow the posting. Many applicant systems drop images and text in the header. Do not put an identity number or passport number on a file you upload to a general portal. If a form asks for a number in its own field, use that field.",
      },
      {
        question: "Is there an editable Word file?",
        answer:
          "This edition is a PDF with fill-in pages and a structure you copy into your own document. It is not a locked template, and it is not a promise that every employer portal will parse every file the same way.",
      },
    ],
  },
  {
    kind: "bundle",
    slug: "health-fitness-bundle",
    title: "Health & Fitness Bundle",
    subtitle: "Reset, Weeknight Table, and Floor & Form",
    category: "bundles",
    price: 29.5,
    previousPrice: 59,
    priceSar: 111,
    compareAtPrice: 40,
    includes: ["12-week-reset", "weeknight-table", "floor-and-form"],
    shortDescription:
      "The weight-loss guide, the meal-prep cookbook, and the no-equipment program, together.",
    description: [
      "This bundle is the practical health shelf: how to structure twelve weeks, how to cook food you will actually eat, and how to train in the room you have.",
      "You receive three separate PDFs, not a single merged file, so you can print the workout log without printing the recipes. The price is lower than buying the three guides one by one.",
      "Read the health disclaimers in each guide. Buying them together does not turn the set into medical advice or a supervised program.",
    ],
    included: [
      "The 12-Week Reset, full PDF",
      "Weeknight Table, full PDF",
      "Floor & Form, full PDF",
      "A free sample of each guide before you buy",
      "One receipt link that downloads all three files",
    ],
    contents: [
      "The 12-Week Reset, complete guide",
      "Weeknight Table, complete guide",
      "Floor & Form, complete guide",
      "Samples available on each product page",
      "Personal license for each file",
    ],
    pageCount: 41,
    featured: true,
    published: "2026-03-03",
    cover: {
      bg: "#2A2420",
      fg: "#F6F1E8",
      accent: "#C4622D",
      motif: "bundle",
      titleLines: ["Health &", "Fitness"],
      eyebrow: "Bundle · save $10.50",
      deck: "Three guides, one checkout",
    },
    faqs: [
      {
        question: "Do I get one file or three?",
        answer:
          "Three full PDFs. Your download page lists each guide separately so you can save the one you need.",
      },
      {
        question: "Can I buy a single guide later?",
        answer:
          "Yes. Each guide is sold on its own. If you already own one, check out carefully so you do not buy it twice. Checkout warns you when a bundle overlaps a guide in your cart.",
      },
      {
        question: "Is the training program included, or only the nutrition guides?",
        answer:
          "All three: the 12-week reset, the recipe and prep guide, and the no-equipment workouts.",
      },
    ],
  },
  {
    kind: "bundle",
    slug: "work-money-bundle",
    title: "Work & Money Bundle",
    subtitle: "Budget, habits, and a first freelance offer",
    category: "bundles",
    price: 29,
    previousPrice: 58,
    priceSar: 109,
    compareAtPrice: 36.5,
    includes: ["the-quiet-budget", "habit-ledger", "first-client"],
    shortDescription:
      "A budget, a habit planner, and the side-hustle guide for people building something beside a job.",
    description: [
      "Work & Money puts the practical business of a side project in one checkout: see your cash clearly, protect time on the calendar, and make an offer someone can pay for.",
      "The three guides stay separate PDFs. Read the budget before you price a freelance offer. Use the ledger to keep the thirty-day plan from eating your evenings whole.",
      "These guides are education. They are not financial, legal, or tax advice, and they do not promise clients or income.",
    ],
    included: [
      "The Quiet Budget, full PDF",
      "The Habit Ledger, full PDF",
      "First Client, full PDF",
      "Samples of each guide",
      "One receipt link for all three downloads",
    ],
    contents: [
      "The Quiet Budget, complete guide",
      "The Habit Ledger, complete guide",
      "First Client, complete guide",
      "Samples available on each product page",
      "Personal license for each file",
    ],
    pageCount: 39,
    featured: true,
    published: "2026-04-21",
    cover: {
      bg: "#1F2E2A",
      fg: "#F4F0E6",
      accent: "#D7B48A",
      motif: "bundle",
      titleLines: ["Work &", "Money"],
      eyebrow: "Bundle · save $7.50",
      deck: "Budget, habits, clients",
    },
    faqs: [
      {
        question: "Which guide should I read first?",
        answer:
          "If cash feels unclear, start with The Quiet Budget. If time is the constraint, start with The Habit Ledger. First Client assumes you can name a skill someone might pay for.",
      },
      {
        question: "Does First Client include contract templates I can send?",
        answer:
          "No. It includes a clause checklist and tells you to have a qualified professional review any agreement. The bundle does not change that.",
      },
      {
        question: "How much do I save?",
        answer:
          "The three guides are $36.50 together. The bundle is $29.",
      },
    ],
  },
  {
    kind: "bundle",
    slug: "gulf-work-bundle",
    title: "Gulf Work Bundle",
    subtitle: "Freelance starter kit, irregular-income sheets, and the Gulf CV kit",
    category: "bundles",
    price: 18,
    previousPrice: 36,
    priceSar: 68,
    compareAtPrice: 22,
    includes: ["saudi-freelancer-starter-kit", "irregular-income-budget", "gulf-ats-cv-kit"],
    shortDescription:
      "The Saudi freelance kit, the variable-income budget, and the Gulf CV kit, in one checkout.",
    description: [
      "Gulf Work Bundle is the practical set for looking for work and for selling a service: the freelance-document guide, the irregular-income budget with invoice pages, and the ATS CV kit.",
      "You receive three separate PDFs. Read the CV kit if you are applying for a job. Read the freelance kit if you are selling a service. Use the budget when the money does not arrive on the same day each month.",
      "These guides are education. They are not legal, tax, or career advice, and they do not promise a client, a visa, or a job. All sales are final.",
    ],
    included: [
      "Saudi Freelancer Starter Kit, full PDF",
      "Irregular-Income Budget + Invoice Sheets, full PDF",
      "Saudi & Gulf Job-Search and ATS CV Kit, full PDF",
      "A free sample of each guide before you buy",
      "One receipt link that downloads all three files",
    ],
    contents: [
      "Saudi Freelancer Starter Kit, complete guide",
      "Irregular-Income Budget + Invoice Sheets, complete guide",
      "Saudi & Gulf Job-Search and ATS CV Kit, complete guide",
      "Samples available on each product page",
      "Personal license for each file",
    ],
    pageCount: 46,
    featured: true,
    published: "2026-10-18",
    cover: {
      bg: "#1A2420",
      fg: "#F6F1E8",
      accent: "#D7A15A",
      motif: "bundle",
      titleLines: ["Gulf", "Work"],
      eyebrow: "Bundle · save $4",
      deck: "Freelance, budget, CV",
    },
    faqs: [
      {
        question: "Do I get one file or three?",
        answer:
          "Three full PDFs. The receipt lists each guide so you can save the one you need.",
      },
      {
        question: "Does this include The Quiet Budget or First Client?",
        answer:
          "No. Those stay in the Work & Money Bundle. This bundle is the Saudi freelance kit, the irregular-income sheets, and the Gulf CV kit.",
      },
      {
        question: "How much do I save?",
        answer:
          "The three guides are $22 together. The bundle is $18.",
      },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function isBundle(product: Product): product is Bundle {
  return product.kind === "bundle";
}

export const guides = products.filter((product): product is Guide => product.kind === "guide");
export const bundles = products.filter((product): product is Bundle => product.kind === "bundle");
