export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "tip"; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  category: string;
  relatedProduct?: string;
  blocks: PostBlock[];
};

export const posts: Post[] = [
  {
    slug: "sunday-prep-that-holds",
    title: "The Sunday prep that still works on Thursday",
    description:
      "A smaller meal-prep routine: a few building blocks, sauces that change the meal, and an honest clock.",
    date: "2026-03-24",
    readingMinutes: 8,
    category: "Health & nutrition",
    relatedProduct: "weeknight-table",
    blocks: [
      {
        type: "p",
        text: "Most meal-prep advice fails on Wednesday, not on Sunday. Sunday is hopeful. You buy too many vegetables, cook four proteins, and stack containers that you will not want by midweek. The fix is not more discipline. It is a smaller system that assumes Thursday is tired.",
      },
      {
        type: "h2",
        text: "Start with a clock, not a menu",
      },
      {
        type: "p",
        text: "Give the prep ninety minutes, including cleanup. If it does not fit, the menu is too big. A reliable Sunday for one or two people is one protein, one grain or potato, one tray of vegetables, and one sauce. That is four components, not twelve recipes.",
      },
      {
        type: "p",
        text: "Put a timer on the counter. When it ends, you stop chopping and you eat whatever is done. A system you abandon is more expensive than takeout, because the food goes soft in the fridge and you order anyway.",
      },
      {
        type: "h2",
        text: "Cook building blocks, then assemble",
      },
      {
        type: "ul",
        items: [
          "Protein: roast a tray of chicken thighs, or simmer a pot of lentils, or bake tofu that has been pressed and salted.",
          "Starch: a pot of rice, farro, or potatoes. Cook the amount you will eat in four days, not fourteen.",
          "Vegetables: high heat, one sheet pan, oil and salt. Broccoli, cabbage, and peppers hold up better than dressed salad.",
          "Sauce: make enough to change Tuesday into a different meal. A yogurt herb sauce and a chili-lime mix will carry the same chicken.",
        ],
      },
      {
        type: "p",
        text: "Assembly is the weeknight skill. Grain in the bowl, protein, vegetables, sauce, something crunchy if you have it. You are not 'reheating Sunday dinner.' You are building a plate from parts. That difference is why people keep the habit.",
      },
      {
        type: "tip",
        text: "Leave one dinner unplanned on purpose. A rigid seven-dinner grid breaks the first night you are invited out, and then the whole plan feels like a failure.",
      },
      {
        type: "h2",
        text: "Store food the way you will actually use it",
      },
      {
        type: "p",
        text: "Cool food before you lid it. Put the sauce in a jar you can see, not buried under the grain. Label the day you cooked it. Most cooked grains and poultry are at their best within four days in the refrigerator. If you will not eat it by then, freeze a portion on Sunday night while it is still good, not on Thursday when you are negotiating with yourself.",
      },
      {
        type: "p",
        text: "Food safety is not a personality. Keep the fridge at or below 40°F (4°C). Do not leave a pot on the stove to 'cool' for three hours. Reheat leftovers until they are steaming. When something smells wrong, it is wrong.",
      },
      {
        type: "h2",
        text: "Shop for the blocks, not for a fantasy week",
      },
      {
        type: "p",
        text: "Write the list in store order: produce, then protein, then dry goods. Buy the vegetables you have cooked before. A new bitter green is not the week to test your system. If the protein you planned is priced like a holiday, swap it. Thighs for breasts, eggs for meat, canned fish for a roast. The plate still works.",
      },
      {
        type: "p",
        text: "This is ordinary cooking, not a medical diet. If you are managing a condition that changes what you can eat, a registered dietitian should be the person who sets the plan. A prep routine only decides when the cooking happens.",
      },
      {
        type: "h2",
        text: "A Thursday test",
      },
      {
        type: "p",
        text: "Judge the prep on Thursday, not on Sunday night when the containers still look like a magazine. Did you eat the food? Did you spend less than twenty minutes assembling it? Did anything get thrown out? If the answer to the last question is a full tray of vegetables, cook less next week. Shrinking the plan is success.",
      },
      {
        type: "p",
        text: "If you want the sequence written out, with recipes and a four-week rotation, that is what Weeknight Table is for. The point of this article is smaller: four components, ninety minutes, and a sauce that makes Wednesday worth opening the fridge.",
      },
    ],
  },
  {
    slug: "one-evening-budget-reset",
    title: "A budget reset you can finish in one evening",
    description:
      "Skip the perfect spreadsheet. See one month honestly, name the leaks, and give the next paycheck a job.",
    date: "2026-05-06",
    readingMinutes: 8,
    category: "Personal finance",
    relatedProduct: "the-quiet-budget",
    blocks: [
      {
        type: "p",
        text: "A budget reset fails when it starts with a new app and a promise to track every coffee. You do not need a new personality by midnight. You need a picture of one recent month and a decision about the next paycheck.",
      },
      {
        type: "h2",
        text: "Use one month, not your ideal month",
      },
      {
        type: "p",
        text: "Open the account you actually live in. Export or scroll the last full month. Write three numbers only: money that came in, money that left, and what remained. If those three do not match the story you tell yourself, believe the numbers.",
      },
      {
        type: "p",
        text: "Then sort the outflows into four piles, not forty categories. Fixed bills. Food and transport. Everything you chose. Debt payments above the minimum. The 'everything you chose' pile is where the evening gets useful. You are looking for two or three items that are large, not for moral lessons about small ones.",
      },
      {
        type: "ul",
        items: [
          "Fixed: rent or mortgage, utilities, insurance, minimum debt payments, childcare that does not flex.",
          "Operating: groceries, fuel or transit, medicine, phone.",
          "Chosen: subscriptions, eating out, shopping, hobbies.",
          "Future: anything you moved to savings, even if it was accidental.",
        ],
      },
      {
        type: "h2",
        text: "Give the next paycheck a job before it lands",
      },
      {
        type: "p",
        text: "List the next two paydays and the bills that must clear before the one after that. Move the bill money the day the paycheck arrives, not the day the bill is due. What remains is the number you can actually choose with. If that number is smaller than you hoped, the budget is working. It is showing you the constraint.",
      },
      {
        type: "p",
        text: "Pay yourself a transfer to savings on payday, even if it is small, before you decide the chosen spending. A transfer of a fixed amount beats a plan to 'save what is left,' because what is left is a story you edit every Friday.",
      },
      {
        type: "tip",
        text: "If your income changes, budget the low month. When a larger deposit arrives, the extra is surplus, not a new lifestyle. Averaging a good month and a bad month is how people overspend the bad one.",
      },
      {
        type: "h2",
        text: "Debt has an order",
      },
      {
        type: "p",
        text: "Keep paying minimums on everything. That is not optional. Then pick one balance to hit harder. Avalanche means the highest interest rate first, which usually costs less over time. Snowball means the smallest balance first, which gives you a finished account sooner. Choose one and write it down. Switching methods every month is a third method called 'no method.'",
      },
      {
        type: "p",
        text: "If you cannot make minimums, a PDF is the wrong tool. Call the lenders, ask what hardship options exist, and look for a nonprofit credit counselor in your area. That is a different problem from overspending on delivery.",
      },
      {
        type: "h2",
        text: "Name the expenses that are not monthly",
      },
      {
        type: "p",
        text: "Car registration, gifts, annual software, dental work you already expect. These are not emergencies. Divide the yearly cost by twelve and move that amount into a separate sink each month. The emergency fund is for the unplanned. Mixing the two is why a 'fully funded' emergency account disappears in December.",
      },
      {
        type: "h2",
        text: "Close the evening with one cut and one calendar hold",
      },
      {
        type: "p",
        text: "Pick one chosen expense to pause for thirty days. Not five. One. Then put a one-hour money review on the calendar a few days before your largest paycheck. The review has an agenda: balances, upcoming bills, the debt you are targeting, and whether the pause is still worth it. When the hour ends, you stop.",
      },
      {
        type: "p",
        text: "None of this is tax, legal, or investment advice. It will not fix an income that cannot cover rent. It will show you, in one evening, whether the problem is a leak you can close or a gap that needs more money coming in. The Quiet Budget is the longer version, with worksheets for the snapshot, the sinking funds, and that monthly hour.",
      },
    ],
  },
  {
    slug: "stop-rereading-your-notes",
    title: "Stop rereading your notes",
    description:
      "Recognition feels like learning. Retrieval is slower and works better. A weekly plan you can use for any exam.",
    date: "2026-07-15",
    readingMinutes: 9,
    category: "Study skills",
    relatedProduct: "exam-room-method",
    blocks: [
      {
        type: "p",
        text: "Rereading a highlighted chapter feels productive because the page looks familiar. Familiar is not the same as remembered. In the exam room you do not get the paragraph beside the answer. You get a question, and you have to produce the idea yourself. Study should look like that, earlier than you want it to.",
      },
      {
        type: "h2",
        text: "Recognition is a trap",
      },
      {
        type: "p",
        text: "When you reread, your brain checks the text against a vague memory and says 'yes, I have seen this.' That check is cheap. Producing the idea with the book closed is expensive, which is why people avoid it, and it is the expense that builds a memory you can use under a time limit.",
      },
      {
        type: "p",
        text: "A simple test: close the notes and write five questions a teacher might ask. Answer them on a blank page. If you cannot, you do not know it yet, no matter how many colors are on the printout. The discomfort is the method. It is not a sign that you are bad at the subject.",
      },
      {
        type: "h2",
        text: "Space the reviews",
      },
      {
        type: "p",
        text: "Cramming can get you through a quiz tomorrow. It is a poor way to still know the material in three weeks, which is when most final exams and licensing tests actually happen. Spacing means you review after a delay, when the memory has started to fade. The fade is the point. Retrieval is stronger when it is not effortless.",
      },
      {
        type: "ul",
        items: [
          "Same day: write questions while the lecture or chapter is still unfinished in your head.",
          "Next session: answer those questions before you take in anything new.",
          "End of the week: a mixed set, old topics and new topics in one pile, so you have to choose the right idea.",
          "The week before the exam: practice under a timer, then review only what you missed.",
        ],
      },
      {
        type: "h2",
        text: "Notes should produce questions",
      },
      {
        type: "p",
        text: "Stop transcribing. After a section, write the claim in one sentence and a question that would force you to explain it. 'What changes if this assumption is false?' is a better note than a paragraph you copied because the slide was dense. If a diagram matters, redraw it from memory the next day. Looking at the original and nodding does not count.",
      },
      {
        type: "tip",
        text: "Keep the questions in a separate list from the explanations. If the answer sits next to the question, you will peek, and the peek feels like studying.",
      },
      {
        type: "h2",
        text: "Use practice tests as a map",
      },
      {
        type: "p",
        text: "A low score is information if you sort the misses. Was it a missing fact, a misread question, or a timing problem? Those have different fixes. More rereading repairs none of them reliably. A missing fact goes back into the question list. A misread question means you practice slowing the first sentence. A timing problem means you rehearse with a clock, not with more highlighters.",
      },
      {
        type: "p",
        text: "Do not take a full practice test every night. One timed set a week, reviewed properly, beats five sets you only score. Review is the session. The test is the input.",
      },
      {
        type: "h2",
        text: "The day before is not for new chapters",
      },
      {
        type: "p",
        text: "The day before an exam is for a short retrieval warm-up, gathering what you need to bring, and sleep. Sleep is not a luxury add-on. Memory consolidation does not happen because you stared at a page until 2 a.m. If you are using caffeine, decide the cutoff in advance so the decision is not made by panic.",
      },
      {
        type: "p",
        text: "If you need extended time, a quiet room, or another accommodation, ask early. The week of the exam is a bad time to discover the form. That is logistics, and logistics are part of preparation.",
      },
      {
        type: "p",
        text: "None of this guarantees a score. It raises the chance that the hours you spend become memories you can use. The Exam Room Method turns the sequence above into a weekly table, a note format, and a morning-of checklist you can print.",
      },
    ],
  },
  {
    slug: "side-hustle-beside-a-job",
    title: "A side hustle that fits beside a job",
    description:
      "Narrow the offer, put a floor under the price, and protect the evenings you did not mean to give away.",
    date: "2026-09-09",
    readingMinutes: 8,
    category: "Freelance & work",
    relatedProduct: "first-client",
    blocks: [
      {
        type: "p",
        text: "A side hustle becomes a problem when it is a mood instead of an offer. You tell people you are 'figuring something out' for six months, answer messages at 11 p.m., and never send a price. The version that fits beside a job is smaller. It has a buyer, an outcome, a number, and a stopping time.",
      },
      {
        type: "h2",
        text: "Sell an outcome, not your availability",
      },
      {
        type: "p",
        text: "Availability is how you end up on a Slack workspace you do not want. An outcome is a sentence a stranger can repeat. 'I set up a monthly bookkeeping close for shops with under ten people' is an offer. 'I do finance stuff' is a conversation that never ends.",
      },
      {
        type: "p",
        text: "Write the buyer, the problem, the thing they receive, and what you will not do. The last part is the one people skip, and it is the one that keeps a $400 project from becoming a second job. If you cannot name a non-example, the scope is still fog.",
      },
      {
        type: "ul",
        items: [
          "Who is this for, specifically enough that other people are excluded?",
          "What do they have in their hands when you are done?",
          "How many rounds of revision are included?",
          "What would make you decline the work?",
        ],
      },
      {
        type: "h2",
        text: "Put a floor under the price",
      },
      {
        type: "p",
        text: "Estimate the hours honestly, including email and revisions. Multiply by a rate that respects the fact that you will pay taxes on this and that you cannot do it for forty hours while employed. That product is your floor. If a client cannot pay the floor, the answer is no, not a discount that eats your weekend.",
      },
      {
        type: "p",
        text: "Ask for a deposit before you start. A common pattern is half to begin and half on delivery, or payment in full for small jobs. Deposits are not rude. They are how you avoid being the bank for a stranger. This is not legal advice. The deposit terms belong in an agreement someone qualified can review for where you live.",
      },
      {
        type: "tip",
        text: "Do not quit the job because one person sounded interested. Interest is not an invoice. A side hustle earns the right to grow after several paid projects, not after a compliment.",
      },
      {
        type: "h2",
        text: "Look for clients where you already have trust",
      },
      {
        type: "p",
        text: "You do not need an audience. You need ten conversations with people who already know you do careful work. Former colleagues, a local association, a specific forum where the buyer complains about the problem you solve. One clear email is better than a month of posts that perform expertise.",
      },
      {
        type: "p",
        text: "Keep a list: name, last contact, next step, date. That is a pipeline. If the next step is always 'follow up someday,' you do not have a pipeline. You have a wish.",
      },
      {
        type: "h2",
        text: "Protect the hours the job does not own",
      },
      {
        type: "p",
        text: "Choose two evenings or one weekend block and stop when they end. Tell prospects your turnaround in business days that match those blocks. Speed is a product you may not be able to sell while employed. Slower and finished beats fast and resentful.",
      },
      {
        type: "p",
        text: "Check your employment agreement before you sell anything adjacent to your employer's work. Moonlighting clauses and conflicts are real. A guide cannot read your contract. You can, and if it is unclear, ask a lawyer or the person at your company who is supposed to answer that question.",
      },
      {
        type: "h2",
        text: "Give the experiment an end date",
      },
      {
        type: "p",
        text: "Thirty days is long enough to send an offer, have five conversations, and either get a paid yes or learn that the sentence is wrong. At the end, decide: continue, change the offer, or stop. Stopping is a result. An endless 'I'm still working on it' is how evenings disappear.",
      },
      {
        type: "p",
        text: "First Client is the worksheet version of this argument: the offer, the floor price, the outreach paths, and a thirty-day calendar that assumes you still have a job. It will not find the clients for you. It will stop you from spending a year preparing to begin.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
