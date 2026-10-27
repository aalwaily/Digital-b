from pdfgen.helpers import B, C, H, N, P, T, TIP, chapter, cover

BUDGET = {
    "slug": "the-quiet-budget",
    "title": "The Quiet Budget",
    "subtitle": "A calm system for spending, saving, and debt",
    "disclaimer": "finance",
    "cover": cover("#1C2A44", "#F6F1E7", "#D4A574", "ledger", ["The Quiet", "Budget"], "Personal finance", "Spending, saving, and debt"),
    "intro": [
        "This is a one-evening snapshot and a monthly hour. It will not pick investments for you, and it will not fix an income that cannot cover rent.",
        "If you cannot make minimum payments, stop and talk to the lenders before you pay a third party. A worksheet is the wrong tool for that problem.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Block one evening. Use the account you actually spend from. Finish the snapshot before you download a new app. The monthly hour comes later, on the calendar, or this becomes a document you wrote once."),
            B(
                "Bring statements or a banking export for one full month.",
                "Use a pen if the screen makes you tidy the truth.",
                "Round to the dollar. Precision is not the point.",
                "Stop when the evening's checklist is done.",
            ),
            TIP("Tell anyone who shares the money that you are doing this. A budget built in secret tends to break at the first shared bill."),
        ),
        chapter(
            "See the month honestly",
            P("Write three numbers: money in, money out, and what remained. If they do not match the story you tell at dinner, believe the numbers. Then sort the outflows into four piles only: fixed bills, operating costs (food, transit, medicine, phone), chosen spending, and anything that actually landed in savings."),
            P("Look for two or three items in the chosen pile that are large. Ignore the coffee until the large items are visible. A budget that starts with small shames does not survive the rent."),
            T(
                ["Pile", "Examples", "Flexes?"],
                [
                    ["Fixed", "Rent, insurance, minimum debt payments", "Rarely"],
                    ["Operating", "Groceries, fuel, medicine", "A little"],
                    ["Chosen", "Eating out, subscriptions, shopping", "Yes"],
                    ["Future", "Transfers to savings", "Only on purpose"],
                ],
            ),
        ),
        chapter(
            "Give every dollar a job",
            P("List the next two paydays and the bills that must clear before the payday after that. Move bill money the day you are paid. What remains is the number you can choose with. If it is smaller than you hoped, the budget is working."),
            P("Transfer a fixed amount to savings on payday, before you decide the chosen spending. 'Save what is left' is a story you edit every Friday. If income varies, budget the low month. A larger deposit is surplus, not a new baseline."),
            H("A simple split, if you want one"),
            P("Fifty percent of take-home to needs, thirty to wants, and twenty to savings and extra debt payments is a popular sketch, not a law and not a Consumer Financial Protection Bureau rule. High rent breaks the fifty. Use the sketch to notice the break. Then assign dollars anyway, starting with minimums and housing."),
            TIP("Name the account that holds bill money. If bills and spending share one balance, you will spend the electric bill."),
        ),
        chapter(
            "Debt, in an order that works",
            P("Pay every minimum. That is not optional. Then choose one balance to hit with extra money. The US Consumer Financial Protection Bureau describes two methods. Highest interest rate first can cost less over time. Snowball, the smallest balance first, finishes an account sooner and may cost more in interest. Neither is required, and neither is written for every country. Pick one and write the name of the account on the monthly page."),
            T(
                ["Method", "Order", "Best when", "Watch out"],
                [
                    ["Avalanche", "Highest interest first", "You can tolerate a slow first win", "You quit because nothing finishes"],
                    ["Snowball", "Smallest balance first", "You need a finished account", "You ignore a painful rate"],
                ],
            ),
            P("Do not open a new card to feel organized. Do not move a balance you do not understand. If a consolidation offer has a fee and a teaser rate, write the total cost before you say yes. This is not a recommendation to take any particular loan."),
            N("If minimums are already impossible, call the lender and ask what hardship options exist before you pay a third party to fix the debt."),
        ),
        chapter(
            "Emergency fund and sinking funds",
            P("An emergency fund is for the unplanned: a job gap, a medical bill you did not schedule, a repair that stops you working. Start with a small target you can finish, such as one month of operating costs, or even $500 if that is the number that will stop a new card charge. Then build toward a few months if your income is unstable."),
            P("Sinking funds are for expenses you can see coming: registration, gifts, annual software, dental work you already expect. Divide the yearly cost by twelve. Move that amount monthly. Mixing these with the emergency fund is why December empties a 'fully funded' account."),
            T(
                ["Fund", "For", "Not for", "Starter target"],
                [
                    ["Emergency", "Unplanned shocks", "Holidays", "One month of operating costs"],
                    ["Sinking", "Known irregular bills", "Vacations you have not planned", "Annual cost divided by 12"],
                    ["Goal", "A choice, like a trip", "Minimum debt payments", "A date and a number"],
                ],
            ),
        ),
        chapter(
            "The monthly money hour",
            P("Put it on the calendar a few days before your largest payday. The agenda is fixed so the hour does not become a mood."),
            C(
                "Balances of spending, bills, and savings.",
                "Bills due before the next payday.",
                "The debt you are targeting, and this month's extra payment.",
                "Sinking funds: what is short.",
                "One chosen expense to keep, cut, or pause.",
                "Anything you are avoiding. Write one sentence.",
                "Stop at sixty minutes.",
            ),
            TIP("If you share money, do the hour together or send the one-page summary the same day. Silence is how two budgets appear."),
        ),
        chapter(
            "Leaks, scripts, and tradeoffs",
            P("A leak is a charge you do not remember wanting. Subscriptions are the obvious ones. The less obvious ones are convenience fees you pay because the week is unstructured: delivery on the nights you did not shop, rides you take because you left late. Fix the structure once. Canceling a streaming service will not repair a missing grocery plan."),
            H("Short scripts"),
            B(
                "To a partner: 'I want an hour on Thursday to look at the month. I am not arriving with a verdict.'",
                "To yourself, at a cart: 'Is this inside the chosen number, or am I inventing a new number?'",
                "To a friend about a plan you cannot afford: 'I want to see you. I cannot do that price this month. Here is what I can do.'",
            ),
            P("A tradeoff is allowed to be sad. You can want the dinner and still decline it because the emergency fund is the priority you wrote down. The writing is what makes it a choice instead of a private failure."),
        ),
        chapter(
            "What this guide will not do",
            P("It will not tell you which fund to buy, how to file your taxes, or whether to refinance a house. It will not make a low income into a high one. If the fixed pile is larger than money in, the problem is the gap, and the useful next step is income, housing help, or a counselor, not a stricter latte rule."),
            P("It will not shame you into a streak. Miss the monthly hour and schedule the next one. The system is the repetition, not a perfect month."),
            N("This is general education. It is not financial, tax, or credit advice. Laws and products change. For a decision that could cost you a lot, hire a qualified person where you live."),
        ),
    ],
}

HABIT = {
    "slug": "habit-ledger",
    "title": "The Habit Ledger",
    "subtitle": "A planner for habits and time",
    "disclaimer": "general",
    "cover": cover("#3E342C", "#F7F1E8", "#E6C07B", "grid", ["The Habit", "Ledger"], "Productivity", "Habits and time, one page"),
    "intro": [
        "Pick fewer habits. Attach them to cues you already have. Review the week on one page. That is the whole method.",
        "A missed day is part of the practice. The restart chapter is not optional reading.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Choose the habits before you design a beautiful spread. The printable pages at the end are blank on purpose. If you fill them with twelve ambitions, you have recreated the problem this guide is for."),
            B(
                "One to three active habits.",
                "A cue that already happens.",
                "Two time blocks that can survive a bad week.",
                "One weekly review, thirty minutes or less.",
            ),
        ),
        chapter(
            "Pick fewer habits",
            P("A keystone habit makes other things easier: a walk, a shutdown ritual at the end of work, a regular bedtime, ten minutes of practice for a skill that pays you. Most other wishes are projects. Projects get a deadline. Habits get a cue. Mixing them is how a list becomes a verdict on your character."),
            P("Write the candidates. Circle the one that, if it happened, would make the others less necessary. That is the first habit. You may add a second if it lives in a different part of the day. A third is allowed only after two weeks in which the first two mostly happened."),
            T(
                ["Wish", "Treat it as", "Because"],
                [
                    ["Run a race", "Project, with a date", "It ends"],
                    ["Walk after lunch", "Habit", "It can repeat forever"],
                    ["Inbox zero", "Standard, not a habit", "It is a description of work"],
                    ["Read 20 pages", "Habit, if the cue is real", "Otherwise it is a hope"],
                ],
            ),
        ),
        chapter(
            "Design the cue",
            P("A cue is something that already happens: the kettle, the end of a meeting, putting the child to bed, closing the laptop. Attach the habit to it in one sentence. 'After I close the laptop, I write tomorrow's first task.' If the sentence needs a mood, it is not designed yet."),
            P("Friction is the rest of the design. Put the shoes by the door. Leave the book on the pillow you will move. Remove the app from the first screen if the habit is 'do not open it.' Environment beats a speech you give yourself."),
            C(
                "The cue already happens on the days I care about.",
                "The habit starts in under two minutes.",
                "The materials are where the cue is.",
                "I removed one piece of friction, not ten.",
            ),
            TIP("Make the habit smaller before you make the cue clever. Two minutes of the real habit beats a complicated system for a habit you have not started."),
        ),
        chapter(
            "Time blocks for a real week",
            P("A time block is a draft. Protect two of them: one for the work that needs a quiet hour, one for the life task that otherwise lands at 10 p.m. Leave slack around them. A calendar with no slack is a fiction, and you will abandon it on the first day someone is sick."),
            T(
                ["Week shape", "Block to protect", "Slack you must leave"],
                [
                    ["Office days", "One deep hour before meetings", "A buffer after lunch"],
                    ["Shift work", "The hour after sleep, not 'evening'", "A day with nothing new"],
                    ["Caregiving", "The nap or the school block", "One evening with no habit"],
                ],
            ),
            P("Put the habit inside a block only if it needs time. A two-minute cue does not need a block. Giving it one makes it look optional and large."),
        ),
        chapter(
            "The weekly review",
            P("Same time each week. Thirty minutes. You are not journaling your entire life. You are deciding what next week is for."),
            C(
                "Which habits happened, and on which days.",
                "Which cue failed, and whether the cue was the problem.",
                "What must move on the calendar.",
                "One thing to drop.",
                "The two blocks for next week, written.",
                "Stop.",
            ),
            TIP("If you miss the review, do a five-minute version the next morning: habits, one drop, two blocks. Do not wait for a free Sunday that is not coming."),
        ),
        chapter(
            "When you miss",
            P("Missing is the data. A habit that fails every Wednesday has a Wednesday problem: the cue does not exist that day, or the day is already full. Change the cue or shrink the habit. Do not start a new tracker to punish the miss."),
            P("Do not treat day 21, or any fixed day, as the day a habit becomes automatic. A review in the British Journal of General Practice, checked for this edition, reports an average near 66 days in one study, a wide spread, and that missing an occasional performance did not seriously impair the process in that study. That average is not your target. Restart at the next cue. If the same day fails every week, the cue is the question. Answer it in one sentence on the ledger."),
            B(
                "Restart at the next cue, not next Monday.",
                "Do the two-minute version if the full version feels ruined.",
                "Do not add a replacement habit to 'make up for it.'",
                "If you are ill, the habit is paused. Write 'paused.'",
            ),
        ),
        chapter(
            "A thirty-day starter",
            P("Days 1 to 7: one habit, two-minute version, cue written on the page. Days 8 to 14: keep it, and add the weekly review. Days 15 to 21: if the first habit happened on at least four days each week, add a second. Days 22 to 30: hold. Do not add a third yet."),
            T(
                ["Days", "Habits allowed", "Review", "Success looks like"],
                [
                    ["1 to 7", "One, tiny", "Optional note", "The cue fired"],
                    ["8 to 14", "One", "First real review", "You can name the cue"],
                    ["15 to 21", "Two, if the first held", "Weekly", "Four days each"],
                    ["22 to 30", "Hold", "Weekly", "No new systems"],
                ],
            ),
        ),
        chapter(
            "Printable ledger pages",
            P("Copy this page three times if you want a month on paper. One row is a day. The checkbox is the tiny version. The note is optional and should be one line."),
            T(
                ["Day", "Habit 1", "Habit 2", "Block kept?", "One line"],
                [
                    ["Mon", "[ ]", "[ ]", "[ ]", ""],
                    ["Tue", "[ ]", "[ ]", "[ ]", ""],
                    ["Wed", "[ ]", "[ ]", "[ ]", ""],
                    ["Thu", "[ ]", "[ ]", "[ ]", ""],
                    ["Fri", "[ ]", "[ ]", "[ ]", ""],
                    ["Sat", "[ ]", "[ ]", "[ ]", ""],
                    ["Sun", "[ ]", "[ ]", "[ ]", "Review"],
                ],
            ),
            H("Weekly page"),
            C(
                "Habits that happened often enough to keep.",
                "Cue to change.",
                "One drop.",
                "Two blocks next week.",
                "Anything that needs a project plan instead of a habit.",
            ),
        ),
    ],
}

CLIENT = {
    "slug": "first-client",
    "title": "First Client",
    "subtitle": "A freelancing and side-hustle starter guide",
    "disclaimer": "career",
    "cover": cover("#1A1D24", "#F4F0E8", "#7EB6C9", "mark", ["First", "Client"], "Freelance & work", "A side hustle you can start"),
    "intro": [
        "This is a thirty-day start for a service you can sell beside a job. It does not promise income, and it is not a contract template.",
        "Read your employment agreement before you sell anything near your employer's work. If the clause is unclear, ask someone qualified.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("You will leave this PDF with a sentence a stranger can buy, a floor price, and five conversations. You will not leave it with a logo. Design the offer before the identity."),
            B(
                "One service, not a menu.",
                "A floor price written down.",
                "A deposit rule.",
                "Two weekly blocks that end.",
            ),
        ),
        chapter(
            "An offer someone can buy",
            P("An offer names the buyer, the problem, the thing they hold when you are done, and what you will not do. 'I help people with marketing' is not an offer. 'I write the monthly email and one landing page for independent clinics' is an offer. The non-example matters: if you cannot say what is out of scope, the project will expand into your evenings."),
            C(
                "The buyer is specific enough to exclude people.",
                "The outcome is a thing, not 'support.'",
                "The number of revision rounds is a number.",
                "I can say who this is not for.",
            ),
            TIP("Read the sentence aloud to someone who does not do your job. If they cannot repeat it, it is not finished."),
        ),
        chapter(
            "Pricing without guessing wildly",
            P("Estimate hours including email and revisions. Multiply by a rate that respects taxes and the fact that you cannot do this for forty hours while employed. That product is the floor. Work below the floor is a no, not a discount that eats a weekend."),
            T(
                ["Number", "How you get it", "Use"],
                [
                    ["Floor", "Hours times a survivable rate, plus costs", "The walk-away"],
                    ["Target", "Floor plus the value of a clear outcome", "What you quote"],
                    ["Ceiling", "The point where scope must change", "When you re-quote"],
                ],
            ),
            P("Quote a price for the outcome, not an open hourly meter, unless the work truly cannot be scoped. An open meter trains the client to watch the clock and trains you to feel guilty for thinking."),
            N("This is not advice about what your market will pay. It is a way to stop inventing a number in the email."),
        ),
        chapter(
            "Proof before a big audience",
            P("You do not need a following. You need proof that you can do the thing: a before-and-after from your own job with confidential details removed, a sample made for a fictional brief, or a short paid pilot. Ask permission before you show an employer's work. When in doubt, make a sample that is clearly yours."),
            P("Three pieces of proof are enough to start the conversations. Ten pieces are a portfolio project that delays the ask."),
        ),
        chapter(
            "Five ways to the first clients",
            B(
                "Former colleagues who already trust your work. One clear email, not a manifesto.",
                "A local or professional association where the buyer complains about this problem.",
                "A specific person who serves the same buyer and does not do what you do. Offer a referral, not a partnership fantasy.",
                "A past client from any smaller job, asked whether the next version would help.",
                "One relevant community, with a useful answer first and the offer second.",
            ),
            P("Send five of these in the first two weeks. Track them. A conversation is not a client. A paid deposit is a client."),
            TIP("The email is six sentences: who you are, the offer, the proof, the price range or the next step, and a question. Then stop writing."),
        ),
        chapter(
            "Proposals, scope, and deposits",
            P("A proposal fits on one page: outcome, what is included, what is not, timeline in business days you can actually hit, price, and how you get paid. Ask for a deposit before you start. Half to begin and half on delivery is a common pattern for small jobs. Full payment up front is reasonable when the job is small."),
            P("Do not copy a contract from the internet and send it. Use a checklist with a qualified professional: who owns the work, what happens if they disappear, how revisions work, and how either of you can end it. Your employment agreement may already limit outside work. Read it."),
            C(
                "Outcome described as a deliverable.",
                "Exclusions written.",
                "Dates that match my real blocks.",
                "Deposit stated.",
                "A person qualified to review the agreement, if money or risk is real.",
            ),
        ),
        chapter(
            "Delivery, invoices, and a pipeline",
            P("Deliver on the date you named. Send the invoice the same day, with the payment method and the due date. A pipeline is a list: name, last contact, next step, date. If the next step is 'someday,' you do not have a pipeline."),
            T(
                ["Stage", "Meaning", "Next step is"],
                [
                    ["Talk", "They understand the offer", "Send the one-pager"],
                    ["Proposal", "Price and scope are written", "Ask for the deposit"],
                    ["Active", "Deposit is in", "Do the work inside the blocks"],
                    ["Done", "Delivered and paid", "Ask if a next version helps"],
                ],
            ),
            N("Taxes on side income are real and local. Set aside a portion of every payment in a separate place so the bill is not a surprise. This PDF will not tell you the rate. A tax preparer or your revenue agency will."),
        ),
        chapter(
            "Thirty days beside a job",
            T(
                ["Days", "Work", "Hours"],
                [
                    ["1 to 3", "Write the offer and the floor price", "Two evenings"],
                    ["4 to 7", "Make or gather three proofs", "One weekend block"],
                    ["8 to 14", "Send five outreaches", "Three short sessions"],
                    ["15 to 21", "Have the conversations. Send one proposal.", "Two evenings"],
                    ["22 to 30", "Decide: continue, change the sentence, or stop", "One review"],
                ],
            ),
            P("Stopping is a result. An endless 'I am still working on it' is how the job you already have loses its evenings. Do not quit because one person sounded interested. Interest is not an invoice."),
            TIP("Put the two blocks on the calendar before day 1. A plan that waits for free time will meet a month with none."),
        ),
    ],
}

EXAM = {
    "slug": "exam-room-method",
    "title": "The Exam Room Method",
    "subtitle": "Study skills and exam preparation",
    "disclaimer": "general",
    "cover": cover("#2C2460", "#F6F2EA", "#F0C36A", "bars", ["The Exam", "Room Method"], "Study skills", "Preparation that holds up"),
    "intro": [
        "This is a method for courses and licensing exams. It replaces rereading with retrieval, and it will not promise a score.",
        "Fill the blank plans with the syllabus in front of you. The guide does not know your subject.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Start with the next lecture or chapter, not with a reorganization of your entire notebook. Write questions the same day. Answer them at the next session before you consume anything new. That loop is the method. The rest of the pages help you schedule it."),
            B(
                "One subject first if you are tempted to redesign everything.",
                "Questions live apart from answers.",
                "A weekly plan with hours you actually have.",
                "Sleep treated as part of studying.",
            ),
        ),
        chapter(
            "Why rereading fails",
            P("Rereading feels smooth because the page is familiar. Familiar is a check, not a memory you can produce when the page is gone. In the exam you get a question. Practice should look like that earlier than you want it to."),
            P("Close the book and write what you would say. If you cannot, you do not know it yet. The discomfort is the work. Highlighting can mark what to turn into a question. It is not itself studying."),
            TIP("At the end of a session, write three questions you cannot yet answer. Those are the start of the next session."),
        ),
        chapter(
            "Retrieval and spacing",
            P("Retrieval means producing the idea with the source closed. Spacing means you wait until the memory has started to fade, then you produce it again. A US What Works Clearinghouse practice guide, released in September 2007, recommends spacing learning over time and quizzing with active retrieval. It is not a score guarantee, and this PDF is not that program. Easy recall every hour is not the same as recall after a week."),
            T(
                ["When", "What you do", "What you do not do"],
                [
                    ["Same day", "Write questions", "Recopy the notes"],
                    ["Next session", "Answer them first", "Reread to 'warm up'"],
                    ["End of week", "Mix old and new questions", "Study one chapter in isolation only"],
                    ["Exam week", "Timed practice, then misses", "New chapters"],
                ],
            ),
        ),
        chapter(
            "Notes worth keeping",
            P("After a section, write the claim in one sentence and a question that would force you to explain it. If a diagram matters, redraw it from memory the next day. A transcript of the slides is a souvenir."),
            P("Keep a question list that does not show the answer. Peeking feels like progress and steals the retrieval. A second page, or the back of the card, is enough. You do not need a new app to hide an answer."),
        ),
        chapter(
            "The weekly study plan",
            P("Count the hours you actually have after sleep, work, and the rest of your life. Assign them. A plan that needs five hours a night will be abandoned, and then you will conclude that you are bad at the subject."),
            T(
                ["Block", "Job", "Example"],
                [
                    ["Before new material", "Answer old questions", "20 minutes"],
                    ["Input", "Lecture or reading", "The real assignment"],
                    ["Same day", "Write new questions", "10 minutes"],
                    ["Weekly mix", "Old topics plus new", "One sitting"],
                    ["Buffer", "Nothing scheduled", "So the plan can slip a day"],
                ],
            ),
            TIP("Put the retrieval block first. If you leave it until you 'finish the reading,' you will not retrieve."),
        ),
        chapter(
            "Practice tests as information",
            P("Sort every miss. A missing fact goes back to the question list. A misread question means you practice slowing the first sentence. A timing problem means you rehearse with a clock. More rereading repairs none of these reliably."),
            P("One timed set a week, reviewed properly, beats five sets you only score. For essays, outline from memory under a short timer, then compare to the source. For multiple choice, explain why the wrong options are wrong. The explanation is the study."),
            C(
                "Score recorded without a speech about your worth.",
                "Misses sorted: fact, misread, or time.",
                "Facts turned into questions.",
                "Next session starts with those questions.",
            ),
        ),
        chapter(
            "The day before and the morning of",
            P("The day before is for a short retrieval warm-up, gathering what you may bring, and sleep. New chapters belong to an earlier week. Caffeine has a cutoff you choose before you are panicking."),
            C(
                "Admission ticket, identification, allowed materials.",
                "A short list of questions to warm up, not a new topic.",
                "Bedtime set.",
                "Route and arrival time.",
                "One sentence: what I will do in the first five minutes of the exam.",
            ),
            P("In the first five minutes, read the instructions and sketch the time. Students lose points by discovering the format halfway through. You already know this. Do it anyway."),
        ),
        chapter(
            "Energy, sleep, and asking for help",
            P("An all-nighter is a poor trade for a short retrieval session you can remember. This guide does not set a required number of hours of sleep, and it does not claim a score. If you are sick or exhausted, the shorter session still beats a heroic reread."),
            P("If you need extended time, a quiet room, or another accommodation, ask on the institution's timeline, not the week of the exam. If you are lost in the subject itself, ask the instructor what the exam will require you to do, not whether you are 'behind.' The verb matters: define, compare, calculate, argue."),
            N("This guide cannot raise a score by a promised amount. It can make the hours you spend more likely to become answers you can produce."),
        ),
    ],
}

MIND = {
    "slug": "steady-mind",
    "title": "Steady Mind",
    "subtitle": "A mindfulness and stress-relief guide",
    "disclaimer": "mind",
    "cover": cover("#3D4F55", "#F4F7F6", "#D5E2DC", "breath", ["Steady", "Mind"], "Mindfulness", "Short practices for stress"),
    "intro": [
        "These are short practices for stress and attention. They are not therapy, and they are not a crisis service.",
        "If a practice makes you more distressed, stop. If you might hurt yourself, contact local emergency services. In the United States, call or text 988.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Pick one practice and do it for a week before you collect more. The four-week plan is already short. Adding apps on top of it is how people avoid the ten minutes."),
            B(
                "One daily practice, ten minutes or less.",
                "A two-minute breath you can use in public.",
                "A stress log for one week so you can see the pattern.",
                "A stop rule if practice makes things worse.",
            ),
        ),
        chapter(
            "A smaller definition of practice",
            P("Practice here means noticing what is happening and choosing one small response. It does not mean emptying your mind, adopting a belief, or feeling calm on command. Calm is sometimes a result. It is a poor requirement."),
            P("You can practice in a chair, on a bus, or in a parked car. You do not need a cushion, a special time of day, or an identity as someone who meditates. If the word meditation gets in the way, call it a pause."),
        ),
        chapter(
            "Breath you can use in public",
            P("Physiological sigh: inhale through the nose, take a second short inhale to top it off, then a long slow exhale through the mouth. Do this three to five times. It is useful in a hallway because it is quiet and short."),
            P("Box breath, if you prefer counting: inhale four, hold four, exhale four, hold four, for one minute. If holding the breath makes you anxious, skip the holds and just lengthen the exhale. Longer exhales are the point for many people, not the performance of a count."),
            T(
                ["Practice", "Time", "Use when", "Skip if"],
                [
                    ["Sigh", "Under a minute", "You are spiked and in public", "You feel lightheaded"],
                    ["Long exhale", "Two minutes", "Before a hard conversation", "Breath focus panics you"],
                    ["Box", "One minute", "You like a count", "Holds feel bad"],
                ],
            ),
            N("Stop if you feel dizzy, numb, or more panicked. Sit down. These are ordinary exercises, not a treatment for panic or depression, and not a test of will."),
        ),
        chapter(
            "A ten-minute body scan",
            P("Sit or lie down. Set a ten-minute timer so you are not watching the clock. Start at the feet. Notice contact, temperature, and effort, without trying to relax them on command. Move to the legs, the hips, the belly, the hands, the shoulders, the jaw, and the face. When attention leaves, bring it back to the last place you remember. That return is the practice."),
            P("A script you can read once and then paraphrase: 'Feet. Feel the floor. Legs. Notice weight. Belly. Let it move with the breath if that is easy. Hands. Shoulders. Unclench the jaw if you find it tight, or leave it and notice. Face. Then the breath at the nose for the last minute.'"),
            TIP("If lying down makes you dissociate or panic, do the scan seated with eyes open and a soft gaze on the floor. Eyes-closed is optional."),
        ),
        chapter(
            "The stress log",
            P("For seven days, three times a day, write one line: time, what was happening, body signal, and what you did next. You are looking for the hour of the week that costs you, not for a theory of your personality."),
            T(
                ["Time", "What was happening", "Body", "What I did"],
                [
                    ["Morning", "", "", ""],
                    ["Midday", "", "", ""],
                    ["Evening", "", "", ""],
                ],
            ),
            P("At the end of the week, circle the repeating context. A practice aimed at that context beats a general promise to be calmer. If the log shows you are depleted because of workload or harm, the next chapter on boundaries matters more than a longer meditation."),
        ),
        chapter(
            "Attention, phones, and boundaries",
            P("Attention is a place you return to, not a substance you store. The phone is a cue machine. Move the apps that fragment you off the first screen during the hours you named in the log. You do not need a new philosophy of technology. You need the first screen to match the hour."),
            P("A boundary is a sentence and a behavior. 'I do not answer work messages after 7' only works if you do not answer them. Scripts: 'I can do that tomorrow.' 'I am not available for that topic right now.' 'I need an hour before I decide.' Rest is not the same as avoidance. Avoidance shrinks your life. Rest has an end time and a return."),
            B(
                "One notification change tied to the log, not a total detox.",
                "One boundary sentence you will use this week.",
                "One recovery activity that is not a screen, scheduled.",
            ),
        ),
        chapter(
            "Four weeks, written out",
            T(
                ["Week", "Daily", "Extra", "Review"],
                [
                    ["1", "Two-minute exhale after one cue", "Start the log", "Which hour repeats"],
                    ["2", "Keep the exhale. Add the body scan three days", "Finish the log", "Did the scan help or hurt"],
                    ["3", "Scan or breath, plus one boundary sentence", "Change one phone cue", "Did the boundary hold"],
                    ["4", "Keep the smallest practice that helped", "Drop the rest", "What you will continue"],
                ],
            ),
            P("Week 4 is allowed to be smaller than week 2. A practice you keep is the result. A abandoned stack is not a moral failure."),
        ),
        chapter(
            "When to reach past this PDF",
            P("Reach past it if distress is persistent, if you are not sleeping, if panic is narrowing your life, if substances are the main way you come down, or if you have thoughts of harming yourself. A licensed clinician is the right next person. This file can sit beside care. It cannot be care."),
            P("If you are in immediate danger, contact local emergency services. In the United States, call or text 988 for the Suicide and Crisis Lifeline. If a practice in this guide makes you feel worse, stop using it. That is a successful use of the guide."),
            N("Nothing here diagnoses anxiety, depression, or trauma. Nothing here replaces medication or therapy that a clinician has recommended."),
        ),
    ],
}

BOOKS_LIFE = [BUDGET, HABIT, CLIENT, EXAM, MIND]
