"""Extra field pages so each guide includes printable worksheets, not only explanation."""

from pdfgen.helpers import C, H, P, T, chapter


def _rows(labels: list[str], columns: int) -> list[list[str]]:
    return [[label, *([""] * (columns - 1))] for label in labels]


def log_chapter(slug: str) -> dict:
    headers = {
        "12-week-reset": ["Day", "Weight", "Steps", "Protein", "Train", "Note"],
        "weeknight-table": ["Day", "Meal one", "Meal two", "Used prep?", "Threw out?", "Note"],
        "floor-and-form": ["Day", "Session", "Main lift", "Reps", "Pain", "Note"],
        "the-quiet-budget": ["Date", "In", "Out", "Pile", "On plan?", "Note"],
        "habit-ledger": ["Day", "Cue", "Habit 1", "Habit 2", "Review", "Note"],
        "first-client": ["Day", "Outreach", "Reply", "Money", "Hours", "Note"],
        "exam-room-method": ["Day", "Retrieved", "New questions", "Minutes", "Sleep", "Note"],
        "steady-mind": ["Day", "Practice", "Minutes", "Hard hour", "Helped?", "Note"],
    }
    head = headers[slug]
    blocks = [
        P("This log is the part you write. Print it. A guide you only read is a brochure. Thirty lines is a month, and a month is long enough to see whether the method fits."),
        H("Days 1 to 15"),
        T(head, _rows([str(n) for n in range(1, 16)], len(head)), row_height=28),
        P("Do not backfill a day you forgot. Leave it blank. A blank line is more useful next month than a number you invented. The lines are tall enough to write in, not just to type a checkmark."),
        H("Days 16 to 30"),
        T(head, _rows([str(n) for n in range(16, 31)], len(head)), row_height=28),
        H("Weekly notes"),
        T(
            ["Week", "What repeated", "What I will change"],
            _rows(["1", "2", "3", "4", "5"], 3),
            row_height=52,
        ),
        H("Open notes"),
        T([" ", "Write in the lines"], _rows([""] * 12, 2), row_height=36),
        H("End of the month"),
        T(
            ["Question", "Your answer"],
            [
                ["What actually repeated?", ""],
                ["What did I abandon, and should it stay abandoned?", ""],
                ["What is the one change for next month?", ""],
                ["Do I need a person, not a PDF?", ""],
                ["Where is the file saved on my own device?", ""],
            ],
        ),
        C(
            "I can find this PDF without the download link.",
            "The license is mine. I have not posted the file.",
            "Next month's first action is written in one sentence.",
            "If the guide was the wrong tool, I know what I will do instead.",
        ),
    ]
    return chapter("Thirty-day log", *blocks)


def example_chapter(slug: str) -> dict:
    stories = {
        "12-week-reset": [
            "This is a composite, not a client. Call her A. She is 41, works at a desk, and has started diets on Mondays for years. Her baseline week averaged 171 pounds, about 4,500 steps, and a breakfast of coffee. She was not a beginner at caring. She was a beginner at repeating a modest week.",
            "Weeks 1 to 4 she used the plate and a step floor of 6,500. She did two strength sessions. Average weight moved to 169. The number was small. The useful change was that lunch had protein, so dinner stopped being a rescue. She kept one Friday dinner unplanned and did not skip Saturday breakfast to pay for it.",
            "At week 6 the average stalled. She did not add a second diet. She reduced the starch at dinner by about a quarter and kept everything else. Week 8 average was 167. Energy was fine. She added a third short session in week 9 because her knees were quiet and sleep was intact.",
            "Week 11 included travel. The minimum plan was protein at breakfast, a walk in the neighborhood, and chair squats in the room. She came home one pound up on the morning scale and ignored it until the weekly average, which was flat, not a collapse.",
            "At week 12 the average was 165. Trousers fit differently. She did not 'start over.' She kept the plate, the step floor, and two sessions, and she booked a checkup she had been delaying. The guide did not give her a body. It gave her a week she could describe.",
        ],
        "weeknight-table": [
            "B cooks for himself and a partner who gets home late. The first Sunday he tried to make four recipes and a new salad. The timer hit ninety minutes with the sink full and the sauce unmade. Thursday, half the vegetables were soft and they ordered food. That is the failure this system is designed around.",
            "The second Sunday he cooked thighs, rice, a tray of cabbage, and the yogurt sauce. He froze two portions of rice the same night. Monday was a bowl. Tuesday was tacos only in the sense that the cabbage and chicken met a tortilla. Wednesday used the chili-lime he mixed in ten minutes. Thursday the fridge was almost empty, which was the point.",
            "The one-person cut matters when the partner travels. He cooks half the protein and still makes a full sauce, because sauce is what makes the second dinner different. He shops with the list in store order and swaps eggs in when thighs are priced like a holiday.",
            "A month later the rotation is boring in the way a good tool is boring. He can say what is for dinner without a decision. The unplanned night is Wednesday, written down, so a friend can claim it. Food safety is a card on the fridge: four days, then freezer or trash. Nothing in this story is a medical diet. It is a clock and a fridge that stay honest.",
        ],
        "floor-and-form": [
            "C had not trained in years and could not do a floor push-up. Week 1 was wall push-ups, a high chair squat, and a hinge with hands on the counter. The sessions felt too easy and too awkward. Both were correct. The film from the side showed his back rounding on the hinge, so week 2 stayed at the counter.",
            "Week 4 he moved push-ups to the kitchen counter and squats to a lower chair. Soreness was dull and in the legs. A sharp pinch in the right shoulder on the floor push-up, which he tested once, sent him back to the counter. He did not 'push through.' The program still counted.",
            "Week 6 he slowed the lowering to a three-count. Reps dropped. That was the progression, not a failure. Week 8 he added session C because sleep was fine and stairs felt ordinary. He still cannot do a perfect floor push-up. He can do eight clean counter push-ups and a squat he trusts. That is the result the log was for.",
        ],
        "the-quiet-budget": [
            "D's income is two paychecks and a small freelance deposit that sometimes skips a month. Averaging the good months had made the bad months look like a character flaw. The snapshot used a low month: money in, fixed bills, groceries and transit, the chosen pile, and almost nothing saved.",
            "The large chosen items were a bundle of subscriptions and two delivery nights that were really a missing grocery plan. D paused three subscriptions and moved a grocery block to Sunday. The minimums on two cards were already being paid. Extra money went to the higher-rate card, written by name on the monthly page.",
            "An emergency target of one month of operating costs looked far away. D started with $500 in a separate account and a sinking fund for car registration, twelve dollars at a time. The freelance deposit, when it came, was surplus: half to the card, half to the emergency account. It was not a new lifestyle.",
            "The monthly hour is on the Thursday before the larger paycheck. D and their partner look at one page. The first month was tense and useful. The third month was shorter. Nothing here invested their money or filed their taxes. It stopped the bill money from living in the same pile as dinner.",
        ],
        "habit-ledger": [
            "E works rotating shifts and had a list of eleven habits, which is a wish list. The ledger cut it to one: after the shoes come off, a two-minute stretch and a glass of water. The cue existed on every kind of day. The habit was small enough to survive a night shift.",
            "Week 2 added the weekly review, done after the longer sleep, not on a fictional Sunday. The review dropped 'read twenty pages' because it had no cue. It kept the stretch. Week 3 added a second habit: when the shift schedule is posted, copy next week's two protected blocks onto a card. That is a calendar habit, not a personality.",
            "E missed four days during a run of nights and restarted at the next shoe-off, not the next month. The thirty-day page shows gaps. The gaps are why the page is honest. At day 30 the stretch was mostly there and the blocks were written. A third habit waited. The waiting was the method.",
        ],
        "first-client": [
            "F is employed as an in-house designer and wanted freelance branding work, which is a fog. The offer became: a one-page menu and a simple poster template for independent cafes, delivered in ten business days, two revision rounds, not a full identity system. The floor price came from twelve honest hours.",
            "F checked the employment agreement before sending anything. A clause restricted work for competitors. Cafes were not competitors. F still asked the person at work who answers that question, and kept the email. Proof was a sample for a fictional cafe, not the employer's files.",
            "Five outreaches went to former classmates and one local roaster F already knew. Two replied. One became a proposal. The deposit arrived in week 4, which is the first time the side hustle was real. The other conversation stayed a compliment. Compliments are not a pipeline stage.",
            "Day 30, F decided to continue for another thirty days with the same offer, not a wider one. The evenings were two blocks, and they ended. Taxes were a separate account, a percentage set aside, and a note to ask a preparer before filing. The guide did not find the client. The sentence and the five emails did.",
        ],
        "exam-room-method": [
            "G is studying for a licensing exam after work. The first plan said four hours a night. It died on day 3. The replacement counted real hours: forty minutes on weeknights and one longer block on Saturday. The forty minutes started with old questions, not with rereading.",
            "Notes became a claim and a question. The questions lived in a list on the left page. G peeked for two days, noticed that the score on a practice set did not move, and put the answers in another notebook. The weekly mix included topics from week 1 even when week 4 felt urgent.",
            "A practice test missed were mostly misreads and two missing facts. The facts became questions. The misreads became a first-five-minutes routine: read the stem, underline the verb, then look at choices. Sleep stayed at a fixed time the week of the exam. The morning was a short retrieval, not a new chapter.",
            "G passed. The guide will not claim the method was the only reason. It will claim that the hours stopped being highlights and became answers. A classmate who reread the same binder felt ready and froze on questions that required producing a rule from memory. Feeling ready is not the same test.",
        ],
        "steady-mind": [
            "H's hard hour was 4 p.m., between the last meeting and collecting a child. The log showed a tight jaw and a phone scroll, not a mysterious lack of mindfulness. Week 1 was a long exhale in the parked car, three times, before going inside. It did not make H calm. It made the next ten minutes less automatic.",
            "The body scan on the couch at night, eyes closed, felt worse, not better. H stopped it. That was the correct use of the stop rule. The scan moved to a chair before breakfast, eyes open, four minutes. It was dull. Dull was acceptable.",
            "Week 3 the boundary sentence was 'I will reply to that thread tomorrow.' H failed it twice and kept it anyway. The phone change was small: the work app left the first screen after 6 p.m. The stress log's repeating context got quieter. It did not disappear.",
            "Week 4 kept the car exhale and dropped the longer scan to three days. A smaller practice that stayed was the result. H also had a therapist already. The PDF sat beside that care and did not pretend to replace it. On a worse week, H knew the number to call. The practice was never the crisis plan.",
        ],
    }
    paragraphs = stories[slug]
    blocks = [P(text) for text in paragraphs]
    blocks.append(
        P(
            "If your week does not look like this one, do not force the resemblance. Copy the structure: a baseline, one change at a time, a written review, and a stop when the tool is the wrong tool. The names above are teaching composites, not testimonials and not promises."
        )
    )
    return chapter("A worked example", *blocks)


def field_chapter(slug: str) -> dict:
    if slug == "12-week-reset":
        return chapter(
            "Field pages",
            P("Print this chapter. The point of the reset is a week you can see, not a feeling about a week. Write in pencil. If a number is ugly, write it anyway."),
            H("Daily line"),
            T(
                ["Day", "Weight", "Protein anchor hit?", "Steps", "Session", "Note"],
                _rows(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 6),
            ),
            H("Plate check for two real days"),
            T(
                ["Meal", "Protein", "Plants", "Starch", "Unplanned?"],
                _rows(["Breakfast", "Lunch", "Dinner", "Snack"], 5),
            ),
            C(
                "I compared the weekly average, not one morning.",
                "I changed at most one variable.",
                "Social meals were planned.",
                "Pain, if any, is named and not trained through.",
                "Next week's step floor is a number I can hit on a bad day.",
            ),
        )
    if slug == "weeknight-table":
        return chapter(
            "Field pages",
            P("A prep system fails in the grocery aisle and in the fridge, not in the recipe. Fill this before you shop, then again on Thursday."),
            H("This week's blocks"),
            T(
                ["Block", "What I will cook", "Amount", "Day it must be eaten by"],
                _rows(["Protein", "Starch", "Vegetables", "Sauce", "Raw option"], 4),
            ),
            H("Shopping list in store order"),
            T(
                ["Aisle", "Item", "Got it"],
                _rows(["Produce", "Produce", "Protein", "Protein", "Dairy", "Dry goods", "Freezer"], 3),
            ),
            H("Thursday test"),
            C(
                "I ate the food I prepped.",
                "Assembly took under twenty minutes.",
                "Nothing important was thrown out.",
                "If something was thrown out, next week I will cook less of it.",
                "One dinner stayed unplanned.",
            ),
        )
    if slug == "floor-and-form":
        return chapter(
            "Field pages",
            P("Log the session you did, not the session you imagined. Variation matters more than a round number of reps."),
            H("Session log"),
            T(
                ["Date", "A/B/C", "Squat variation", "Push variation", "Pull variation", "Pain?"],
                _rows(["1", "2", "3", "4", "5", "6", "7", "8"], 6),
            ),
            H("Eight-week change"),
            T(
                ["Weeks", "The one change I am testing", "Did form hold?"],
                _rows(["1 to 2", "3 to 4", "5 to 6", "7 to 8"], 3),
            ),
            C(
                "Warm-up happened.",
                "Last reps were clean.",
                "I left a rep in reserve.",
                "Sharp pain stopped the movement.",
                "Next session is already on the calendar.",
            ),
        )
    if slug == "the-quiet-budget":
        return chapter(
            "Field pages",
            P("One month, in dollars, not in intentions. Round to the nearest dollar. The monthly hour uses this page."),
            H("The snapshot"),
            T(
                ["Line", "Amount"],
                _rows(["Money in", "Fixed bills", "Operating costs", "Chosen spending", "Sent to savings", "Left over"], 2),
            ),
            H("Debts"),
            T(
                ["Account", "Balance", "Interest rate", "Minimum", "Extra this month"],
                _rows(["1", "2", "3", "4"], 5),
            ),
            H("Sinking funds"),
            T(
                ["Expense", "Yearly cost", "Monthly set-aside", "Saved so far"],
                _rows(["", "", "", ""], 4),
            ),
            C(
                "Minimums are covered.",
                "One debt is the target.",
                "Bill money moves on payday.",
                "The next money hour is on the calendar.",
            ),
        )
    if slug == "habit-ledger":
        return chapter(
            "Field pages",
            P("Three habits is the cap. If you need a fourth row, you are collecting wishes. Turn the extra into a project with an end date or delete it."),
            H("Cue design"),
            T(
                ["Habit", "Cue that already happens", "Two-minute version", "Friction I removed"],
                _rows(["1", "2", "3"], 4),
            ),
            H("Thirty days"),
            T(
                ["Day", "H1", "H2", "H3", "Note"],
                _rows([str(n) for n in range(1, 16)], 5),
            ),
            P("Copy the table for days 16 to 30. Do not add a habit in the second half unless the first survived four days a week."),
            C(
                "Weekly review happened.",
                "I dropped one thing.",
                "Two blocks are written for next week.",
                "A miss was restarted at the next cue.",
            ),
        )
    if slug == "first-client":
        return chapter(
            "Field pages",
            P("Fill the offer before you design anything visual. If a box is vague, the email you send will be vague."),
            H("The offer"),
            T(
                ["Box", "Write it in one sentence"],
                _rows(["Buyer", "Problem", "What they hold at the end", "What is not included", "Floor price", "Target price"], 2),
            ),
            H("Pipeline"),
            T(
                ["Name", "Stage", "Last contact", "Next step", "Date"],
                _rows(["1", "2", "3", "4", "5"], 5),
            ),
            C(
                "Employment agreement checked.",
                "Deposit rule written.",
                "Five outreaches sent or scheduled.",
                "Day 30 decision: continue, change the sentence, or stop.",
            ),
        )
    if slug == "exam-room-method":
        return chapter(
            "Field pages",
            P("Questions on the left, answers somewhere else. If the answer sits beside the question, you will peek, and the peek feels like studying."),
            H("Question list"),
            T(
                ["#", "Question I must produce", "Fact, misread, or time?", "Reviewed on"],
                _rows([str(n) for n in range(1, 11)], 4),
            ),
            H("Weekly hours I actually have"),
            T(
                ["Block", "Hours", "Job of the block"],
                _rows(["Old questions first", "New material", "Write new questions", "Mixed review", "Buffer"], 3),
            ),
            C(
                "Next session starts with retrieval.",
                "Misses are sorted.",
                "The day before has no new chapter.",
                "Sleep is on the plan.",
                "Accommodations, if I need them, are requested early.",
            ),
        )
    return chapter(
        "Field pages",
        P("Use the log for seven days before you decide the practice 'does not work.' One calm morning is not a pattern. One bad practice is a reason to stop that practice, not a reason to quit noticing."),
        H("Stress log"),
        T(
            ["When", "What was happening", "Body signal", "What I did next"],
            _rows(["Morning", "Midday", "Evening", "Morning", "Midday", "Evening", "Morning"], 4),
        ),
        H("Four-week card"),
        T(
            ["Week", "Practice I kept", "Did it help, hurt, or neither?", "Boundary sentence"],
            _rows(["1", "2", "3", "4"], 4),
        ),
        C(
            "I stopped any practice that made distress worse.",
            "One phone cue matches the hard hour in the log.",
            "I know who I would call if this PDF is not enough.",
            "If I am in crisis, I will use local emergency services or 988 in the United States.",
        ),
    )
