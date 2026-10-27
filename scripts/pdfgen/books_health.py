from pdfgen.helpers import B, C, H, N, P, T, TIP, chapter, cover

RESET = {
    "slug": "12-week-reset",
    "title": "The 12-Week Reset",
    "subtitle": "A steady plan for fat loss without a crash diet",
    "disclaimer": "health",
    "cover": cover("#1E3A32", "#F3EDE2", "#E4B15A", "path", ["The 12-Week", "Reset"], "Health & nutrition", "A steady fat-loss plan"),
    "intro": [
        "This is a twelve-week structure for adults who want to lose fat without a crash diet. You will use a modest deficit, a protein target, daily steps, and two or three short strength sessions.",
        "Read the disclaimer before you change how you eat or train. The plan assumes you are medically able to exercise and that you are not pregnant, under 18, or in treatment for an eating disorder.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Do the baseline week before you cut anything. People who skip straight to a smaller plate usually guess the wrong problem: they were already under-eating protein, or they were walking very little, or they were sleeping five hours and calling it a motivation issue."),
            P("After the baseline, run the plan in weeks, not in moods. A week that includes a dinner out is still a successful week if the other days match the plate and you do the sessions you scheduled. The review checklist at the end is the tool you use when the scale argues with you."),
            B(
                "Week 0 is measurement, not punishment.",
                "Weeks 1 to 12 follow the schedule in chapter 5.",
                "Change one variable at a time when progress stalls.",
                "Print the tracker. A phone note is fine if you will actually open it.",
            ),
            TIP("Put the weekly review on Sunday evening or Monday morning, the same slot every week, for twenty minutes. When the slot is vague, the review does not happen."),
        ),
        chapter(
            "What actually moves the scale",
            P("Fat loss requires a calorie deficit over time. You can create one by eating a bit less, moving a bit more, or both. Extreme cuts are hard to repeat, and they make training feel worse. This guide uses a smaller plate you can describe on a Tuesday. It does not promise that a harsh week will be followed by a regain."),
            P("The scale also moves because of salt, a late meal, a hard workout, or a menstrual cycle. A single morning is not a verdict. Weigh yourself under similar conditions, then look at the weekly average. Strength sessions keep the week from being only a smaller plate. They are not a promise that you will keep every pound of muscle. Steps add movement you can repeat without living in a gym."),
            T(
                ["Lever", "What it does", "What we use"],
                [
                    ["Deficit", "Lowers stored energy over weeks", "A slightly smaller plate, not a crash"],
                    ["Protein", "Keeps meals satisfying and protects muscle", "A target at each meal"],
                    ["Steps", "Adds movement you can repeat daily", "A floor, not a hero number"],
                    ["Strength", "Keeps the week from being only food", "2 or 3 short sessions"],
                    ["Sleep", "Makes hunger and training easier", "A real bedtime"],
                ],
            ),
            N("If you have a medical condition that changes fluid, appetite, or safe exercise, this table is not your plan. Take it to a clinician."),
        ),
        chapter(
            "Set your baseline",
            P("For seven days, change as little as possible. Weigh yourself each morning after the bathroom, before breakfast, and write the number. Do not average in your head. Record steps if your phone already counts them. Note bedtime and roughly when you ate the largest meal."),
            P("On two of those days, write down what you ate with amounts you can defend: a palm of chicken, two slices of bread, a bowl of rice that you actually measured once. You are not starting a food diary for life. You are learning what a normal day already contains. Look for whether protein is low at breakfast and whether evenings are where extra calories collect. Do not assume that pattern until the notes show it."),
            C(
                "Seven morning weights recorded.",
                "Average steps for the week written down.",
                "Bedtime on at least five nights.",
                "Two days of honest food notes.",
                "Any pain that already shows up when you walk or squat.",
            ),
            TIP("If weighing daily makes you spiral, weigh three mornings instead and still average them. The point is a trend, not a ritual that harms you."),
        ),
        chapter(
            "Protein, plates, and weekends",
            P("Build meals as a plate, not as a banned-food list. Fill about half the plate with vegetables or fruit, and use the rest for protein and starch in portions you have measured once. USDA's Start Simple with MyPlate sheet says to make half the plate fruits and vegetables, vary protein, and make half your grains whole. It also includes dairy. It does not set a thumb of fat or a calorie number. A visible spoon of olive oil or a few nuts is a reminder that the meal has fat, not a dose. A stew can still match the shape if you can point to the protein and the plants."),
            P("WHO's healthy-diet fact sheet says people older than 10 should aim for at least 400 grams of fruit and vegetables a day, and that the exact diet varies by person. This plate is a shape. It does not add up to 400 grams for you, and it is not a medical target."),
            P("Set a protein anchor at breakfast and lunch so dinner is not doing all the work. Greek yogurt, eggs, tofu, fish, cottage cheese, lentils, and leftover chicken all count. You do not need a shake. If you want one because it is easy, use it as food, not as a personality."),
            H("A weekend that does not erase the week"),
            P("Choose one meal to be unplanned. Eat it, then return to the plate at the next meal. Do not 'make up for it' by skipping breakfast. Skipping usually creates a larger dinner. A planned social meal is part of the plan."),
            T(
                ["Meal", "Protein examples", "Plant examples", "Starch examples"],
                [
                    ["Breakfast", "Eggs, yogurt, tofu", "Berries, tomatoes", "Oats, toast"],
                    ["Lunch", "Chicken, tuna, lentils", "Big salad, leftover veg", "Rice, potato, bread"],
                    ["Dinner", "Fish, beans, lean meat", "Roasted tray", "The quarter plate"],
                    ["Snack", "Cottage cheese, edamame", "Fruit", "Only if you are actually hungry"],
                ],
            ),
        ),
        chapter(
            "The 12-week schedule",
            P("Weeks 1 to 4 teach the plate and the step floor. Do not add extra workouts yet. Weeks 5 to 8 keep the food and add a third strength session if recovery is fine. Weeks 9 to 12 hold the same structure. If the weekly average weight has not moved for three weeks and you are following the plate, reduce the starch portion slightly or add 1,000 steps. Not both in the same week."),
            T(
                ["Weeks", "Food", "Steps", "Strength", "Review"],
                [
                    ["0", "Baseline, no cut", "Just record", "None new", "Set the floor"],
                    ["1 to 4", "Plate method", "Baseline plus 1,000 if easy", "2 sessions", "Sunday"],
                    ["5 to 8", "Same plate", "Hold the floor", "2 or 3 sessions", "Sunday"],
                    ["9 to 12", "Adjust once if stalled", "Hold or add 1,000", "2 or 3 sessions", "Sunday"],
                ],
            ),
            P("The step floor is a number you can hit on a busy day, not your best day. If baseline steps were 4,000, a floor of 6,000 is plenty. If you already walk 9,000, keep 9,000 and do not invent a 15,000 target to feel serious."),
            TIP("Write the twelve weeks on one page with a box for average weight, steps, and sessions. Empty boxes are information. They are not a moral event."),
        ),
        chapter(
            "Strength without a gym",
            P("Twice a week, do a short full-body session from Floor & Form or the simple circuit here. The goal is to keep muscle while you eat a bit less. You are not training to exhaustion. Leave one or two reps in reserve: the set is hard, and you could do another clean rep if you had to."),
            B(
                "Squat to a chair, 3 sets of 8.",
                "Push-up on a counter or the floor, 3 sets of 6 to 10.",
                "Hip hinge, hands on a counter, 3 sets of 8.",
                "Inverted row under a sturdy table, or a backpack row, 3 sets of 8.",
                "Side plank, 2 sets of 20 seconds each side.",
            ),
            P("Rest about a minute between sets. The whole session fits in half an hour. If a movement hurts a joint, stop that movement and use a smaller range. Sharp pain is a stop sign, not a cue to toughen up."),
            N("This circuit is general exercise. It is not rehabilitation. If you are cleared only for specific movements, follow that clearance."),
        ),
        chapter(
            "Steps, sleep, and hunger",
            P("Walk as part of the day you already have: a stop early on the commute, a phone call on foot, ten minutes after lunch. Steps spread across the day beat a single punishing walk you dread. If the weather is bad, walk inside. A hallway counts."),
            P("Hunger in a deficit is a signal to check the plate, not a signal that the plan is failing. Ask whether the meal had protein and plants, whether you slept, and whether you are actually thirsty or bored. A planned snack with protein is allowed. Grazing from the pan is how the deficit disappears without a memorable meal."),
            T(
                ["If you notice", "Check first", "Then"],
                [
                    ["Evening hunger", "Protein at lunch", "Add a planned snack, not a skip-breakfast rule"],
                    ["Afternoon crash", "Sleep and caffeine timing", "A short walk and a real lunch"],
                    ["Sore but fine", "Session load", "Keep the next session easier"],
                    ["Wired at midnight", "Screens and late caffeine", "A fixed lights-out"],
                ],
            ),
            TIP("Pick a bedtime you can keep five nights a week. Protect the hour before it from work email. If hunger is louder after a short night, protect bedtime before you add another food rule. This guide does not set a required number of hours."),
        ),
        chapter(
            "Plateaus, travel, and social meals",
            P("A plateau is three weeks where the average weight, the waist of your usual trousers, and the mirror all refuse to move, while you were actually following the plate. One flat week is noise. When it is real, change one thing: a slightly smaller starch portion, or 1,000 more steps, for the next two weeks. Then reassess."),
            P("Travel days get a minimum version. Protein at breakfast, a walk you can do in the hotel neighborhood, and one strength session replaced by the chair squat and the counter push-up if the room allows. Do not attempt to 'save calories' all day for an unknown dinner. Eat normally at lunch so dinner is a meal, not a rescue."),
            C(
                "I changed only one variable this week.",
                "I compared weekly averages, not one morning.",
                "Social meals were planned, not punished afterward.",
                "Travel had a minimum plan written before I left.",
                "I am not using a plateau as a reason to add a second diet.",
            ),
        ),
        chapter(
            "Weekly review checklist",
            P("The review is twenty minutes. You are looking for compliance and trend, not for a new identity. If you skipped it, do a shorter version: average weight, sessions done, and one sentence about next week."),
            C(
                "Average the morning weights you recorded.",
                "Count strength sessions actually completed.",
                "Note whether the step floor held on weekdays.",
                "Name one meal that worked and one that did not.",
                "Choose next week's single adjustment, or choose none.",
                "Look ahead at travel or social events and plan the minimum.",
                "Stop when the twenty minutes end.",
            ),
            T(
                ["Week", "Avg weight", "Sessions", "Step floor", "Note"],
                [[str(n), "", "", "", ""] for n in range(1, 13)],
            ),
            TIP("If you miss a week of data, restart the count. Do not backfill numbers you do not remember. Invented data makes the next decision worse."),
        ),
        chapter(
            "When to get more help",
            P("Stop this plan and get personal care if you feel faint, develop chest pain, notice pain that wakes you, or find yourself afraid of ordinary meals. Get care before you start if you are pregnant, under 18, recovering from an eating disorder, or managing a condition your clinician has already given you a diet or exercise limit for."),
            P("A registered dietitian is the right person if you want a plan built around a medical condition, a sport, or a cultural food pattern this PDF only sketches. A qualified coach is useful if you want someone to watch your lifting. This file cannot see you. That is a limit, not a flaw you can outwork."),
            B(
                "Bring your tracker to the appointment. It is better than a vague summary.",
                "Ask what you should stop, not only what you should add.",
                "If a program promises a fixed amount of weight by a date, leave.",
                "In the United States, call or text 988 if you are in crisis.",
            ),
            N("Nothing in these pages is a diagnosis or a prescription. The useful outcome is a repeatable week, not a number you owe anyone."),
        ),
    ],
}

TABLE = {
    "slug": "weeknight-table",
    "title": "Weeknight Table",
    "subtitle": "Meal prep and healthy recipes for busy weeks",
    "disclaimer": "health",
    "cover": cover("#8C3A2F", "#FBF6EF", "#F0D2B4", "plate", ["Weeknight", "Table"], "Health & nutrition", "Meal prep that holds up"),
    "intro": [
        "Weeknight Table is a cooking system: one short Sunday prep, building blocks that recombine, and recipes with storage notes. It is ordinary food, not a medical meal plan.",
        "If a clinician has given you a diet, use that diet. Use this guide only for the logistics of when the cooking happens.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Cook the Sunday sequence once before you try to be clever. The first week teaches the clock. The recipes come after you trust that ninety minutes is enough. If you cook for one, use the one-person cut in the prep chapter instead of storing a family tray you will throw out."),
            B(
                "Read the food-safety table before you store anything.",
                "Pick two sauces, not five.",
                "Leave one dinner unplanned.",
                "Judge the system on Thursday, when hope has worn off.",
            ),
            TIP("Set a timer for ninety minutes including cleanup. When it rings, you stop chopping."),
        ),
        chapter(
            "The 90-minute Sunday prep",
            P("Minute 0 to 10: start the grain or potatoes, and heat the oven. Minute 10 to 35: sheet-pan vegetables with oil and salt, in the oven. Minute 15 to 45: the protein, on another tray or in a pot. Minute 45 to 70: one sauce, and a jar of something crunchy if you have it. Minute 70 to 90: cool, portion, wash up."),
            P("Cool food before you lid it. Put sauces where you can see them. Label the day. The one-person cut is half the protein, half the grain, and one sheet of vegetables. You are not required to eat the same bowl five times. You are required to have parts."),
            T(
                ["Block", "Default", "One-person cut", "Holds"],
                [
                    ["Protein", "Tray of thighs or a pot of lentils", "Half", "3 to 4 days, or freeze"],
                    ["Starch", "Rice, farro, or potatoes", "Four portions", "3 to 4 days"],
                    ["Vegetables", "One hot sheet pan", "One pan", "3 to 4 days"],
                    ["Sauce", "One jar", "One small jar", "3 to 4 days"],
                ],
            ),
        ),
        chapter(
            "Building blocks that recombine",
            P("A block is cooked plain enough to accept a sauce later. Salt it. Do not bury it in a single flavor on Sunday or Wednesday will taste like a compromise. Chicken thighs are done when a food thermometer in the thickest part reads 165°F (74°C). USDA's leftovers page does not treat color as the test. Lentils simmered in salted water, tofu pressed and baked, and canned fish kept for the night you do not want to reheat anything all count as blocks."),
            P("Vegetables that hold their shape are better prep citizens than delicate salads. Cabbage, broccoli, peppers, carrots, and onions survive a reheating. Dress greens the day you eat them. A limp dressed salad is why people say prep does not work."),
            B(
                "Salt early. Pale food will not be saved by a sauce you forget to make.",
                "Keep one raw option: carrots, cucumber, or an apple.",
                "Freeze a portion on Sunday if you already know Friday is unlikely.",
                "Eggs still count as protein when the tray runs out.",
            ),
        ),
        chapter(
            "Sauces that rescue leftovers",
            P("A sauce is how the same chicken becomes two dinners. Make them in a jar. Thin with a spoon of water if they tighten in the fridge. Taste for salt before you blame the protein."),
            T(
                ["Sauce", "Base", "Add", "Good on"],
                [
                    ["Yogurt herb", "Plain yogurt", "Salt, lemon, chopped herbs", "Chicken, potatoes, greens"],
                    ["Chili lime", "Oil and lime", "Chili, garlic, salt", "Tofu, cabbage, fish"],
                    ["Tomato simmer", "Crushed tomato", "Onion, oregano", "Lentils, eggs, beans"],
                    ["Peanut", "Peanut butter", "Soy sauce, vinegar, hot water", "Tofu, broccoli, rice"],
                ],
            ),
            P("You need two. The third sauce is how Sunday becomes a project. If you hate yogurt, skip it. A sauce you will not eat is not a system."),
            TIP("Write the sauce name on the jar lid. Future you, standing in the fridge light, is not a careful reader."),
        ),
        chapter(
            "A four-week rotation",
            P("Repeat the shape of the week and rotate the blocks. Week A is chicken and rice. Week B is lentils and potatoes. Week C is tofu and farro. Week D is fish or eggs and whatever vegetable is cheap. The sauces swap so Week A does not taste like last Week A."),
            T(
                ["Week", "Protein", "Starch", "Sauce", "Unplanned dinner"],
                [
                    ["A", "Chicken thighs", "Rice", "Yogurt herb", "Friday"],
                    ["B", "Lentils", "Potatoes", "Tomato", "Wednesday"],
                    ["C", "Baked tofu", "Farro or rice", "Peanut", "Saturday"],
                    ["D", "Fish or eggs", "Bread or potato", "Chili lime", "Thursday"],
                ],
            ),
            P("If a week collapses, repeat it. Novelty is not the goal. A rotation you can shop from memory is the goal."),
        ),
        chapter(
            "Eight recipes",
            H("Sheet-pan chicken and cabbage"),
            P("Heat the oven to 425°F (220°C). Toss chicken thighs with salt and oil. Toss sliced cabbage and onion the same way on the other half of the pan. Roast about 30 to 35 minutes, until a thermometer in the thickest part of the chicken reads 165°F (74°C) and the cabbage has dark edges. Rest five minutes. Four servings. Fridge: 3 to 4 days."),
            H("Lentils with tomato and greens"),
            P("Simmer 1 cup dry lentils in salted water until tender, about 20 minutes. Drain. Warm crushed tomato with garlic and a pinch of chili, then fold in the lentils and a handful of spinach until it wilts. Finish with vinegar. Four servings. Fridge: 3 to 4 days."),
            H("Baked tofu"),
            P("Press tofu for 15 minutes. Tear it into chunks so the edges crisp. Toss with salt and oil. Bake at 425°F until the edges color, about 25 minutes. Sauce it later, not now. Three servings. Fridge: 3 to 4 days."),
            H("Yogurt herb sauce and chili lime"),
            P("Stir yogurt with salt, lemon, and herbs. Separately, shake oil, lime, salt, garlic, and chili. Keep both 3 to 4 days. Use on any block."),
            H("Rice or farro, plainly"),
            P("Rinse rice. Simmer in salted water until tender. Farro takes longer and likes a generous pot. Spread on a tray to cool before you box it. Four to six servings. Fridge: 3 to 4 days. Freeze what you will not eat in that window."),
            H("Peanut noodles with leftover vegetables"),
            P("Boil noodles. Thin peanut butter with hot water, soy sauce, and vinegar. Toss with noodles and chopped leftover vegetables. Add tofu if you have it. Two servings. Best the day you make it."),
            H("Egg fried rice, honestly"),
            P("Cold rice in a hot pan with oil. Scramble in two eggs. Add frozen peas or leftover vegetables. Soy sauce at the end. This is a use-it-up dinner, not a new prep. One or two servings."),
            H("Bean toast"),
            P("Warm white beans with olive oil, garlic, and chili. Pile on toast with a squeeze of lemon and a handful of greens. Ten minutes. One serving. The beans keep 3 to 4 days."),
            N("Times assume a working oven. Poultry is done at 165°F (74°C) in the thickest part, measured with a food thermometer. USDA's leftovers page does not treat color as the test. When you cannot measure, do not serve the chicken."),
        ),
        chapter(
            "Shopping, storage, and safety",
            P("Write the list in the order of the store: plants, protein, dairy, dry goods. Buy the vegetables you have cooked before. If thighs cost more than the week can bear, buy eggs or lentils instead and keep the plate."),
            T(
                ["Food", "Fridge", "Freeze", "Reheat"],
                [
                    ["Cooked poultry", "3 to 4 days", "3 to 4 months", "165°F (74°C)"],
                    ["Cooked lentils and grains", "3 to 4 days", "3 to 4 months", "165°F (74°C)"],
                    ["Sauce, including dairy", "3 to 4 days", "Not the plan", "165°F, or boil"],
                    ["Cut raw vegetables", "Use while crisp", "Not the plan", "Cook or eat cold"],
                ],
            ),
            B(
                "Fridge at or below 40°F (4°C).",
                "Refrigerate perishable food within 2 hours, or within 1 hour if the room is above 90°F (32°C).",
                "Cool in a shallow container, then lid it. Do not leave a large pot on the counter to cool for hours.",
                "Reheat leftovers to 165°F (74°C). Sauces and soups can come to a rolling boil.",
                "If it smells wrong, discard it. Smell is not a substitute for the time and temperature limits.",
                "These lines follow USDA leftover guidance checked in October 2026. Frozen leftovers can stay safe longer than 3 to 4 months; quality is what drops. If a local authority is stricter, follow that.",
            ),
        ),
        chapter(
            "Cooking on a tighter budget",
            P("The expensive failure is food you throw away, not the dried lentils. Cook the amount you will eat. Use cabbage, carrots, oats, eggs, canned tomatoes, peanut butter, and dried beans as the spine. Meat is a flavor and a protein, not the requirement for every dinner."),
            P("A cheaper week is still the same shape: protein, starch, plants, sauce. Swap chicken for eggs two nights. Use canned fish once. Buy the store brand of yogurt. The rotation still holds."),
            C(
                "I shopped from the blocks, not from a craving list.",
                "I froze the portion I will not eat within 3 to 4 days.",
                "I used one sauce I already like.",
                "I left one dinner unplanned so the plan can bend.",
            ),
            TIP("Price the protein per serving once. After that, you will stop being surprised in the aisle."),
        ),
    ],
}

FLOOR = {
    "slug": "floor-and-form",
    "title": "Floor & Form",
    "subtitle": "A no-equipment workout program",
    "disclaimer": "health",
    "cover": cover("#243028", "#F4F1EA", "#C6D98A", "form", ["Floor", "& Form"], "Home fitness", "Strength, no equipment"),
    "intro": [
        "Floor & Form is strength training for a room with a floor. No bands, no machines. You will learn three sessions, a warm-up, and an eight-week progression.",
        "Get cleared for general exercise if you are injured, pregnant, newly postpartum, or managing a condition that changes what you can do. Sharp pain is a stop, not a cue.",
    ],
    "chapters": [
        chapter(
            "How to use this guide",
            P("Train two days a week for the first two weeks even if you feel ambitious. Add the third day only when you can walk downstairs the next morning without a new complaint. Sessions are full body. You do not need a split."),
            P("Leave one or two reps in reserve. The last rep should be clean. If your back rounds, your knees cave, or you hold your breath until you are dizzy, the set was too hard. Make it easier and continue."),
            B(
                "Clear a space the size of a yoga mat.",
                "A sturdy table is optional for rows. Skip the row if the table is not sturdy.",
                "Train in shoes or barefoot, the same way each week, so you can compare.",
                "Write the session down. Memory flatters you.",
            ),
        ),
        chapter(
            "Principles before sweat",
            P("You are practicing patterns: squat, hinge, push, pull, and a brace through the middle. Bodyweight work gets harder by slowing the lowering, adding a pause, or moving to a harder angle. It does not get harder by thrashing."),
            P("Breathe out on the effort. If a set makes you gasp, rest longer. Rest is part of the session. Sixty to ninety seconds between sets is enough for this program."),
            T(
                ["Pattern", "Easier", "Standard", "Harder"],
                [
                    ["Squat", "Sit to a high chair", "Sit to a low chair", "Slower lower, pause"],
                    ["Hinge", "Hands on a counter", "Good morning, hands at chest", "Single-leg with support"],
                    ["Push", "Wall", "Counter or knee", "Floor push-up"],
                    ["Pull", "Towel row standing", "Table row", "Slower lower"],
                    ["Brace", "Dead bug, short lever", "Dead bug, long lever", "Side plank"],
                ],
            ),
        ),
        chapter(
            "Warm-up and positions",
            P("Five minutes. Do not skip it because you are busy. Cold joints are how a short program becomes a week off."),
            C(
                "30 seconds of easy marching.",
                "10 slow squats to a chair.",
                "10 hip hinges with hands on thighs.",
                "8 wall push-ups.",
                "Open and close the hips: 5 gentle circles each direction.",
                "2 breaths in a tall standing position, ribs stacked over pelvis.",
            ),
            P("The tall position is the one you return to between exercises. Ribs down, feet planted, jaw unclenched. If you cannot find it, you are rushing."),
        ),
        chapter(
            "Sessions A, B, and C",
            P("Session A emphasizes squat and push. Session B emphasizes hinge and pull. Session C is a lighter mix for the week you add a third day. Do A and B first. Rest at least one day between A and B."),
            T(
                ["Session", "Order", "Sets x reps", "Rest"],
                [
                    ["A", "Chair squat", "3 x 8", "75 sec"],
                    ["A", "Push-up variation", "3 x 6 to 10", "75 sec"],
                    ["A", "Table row or towel row", "3 x 8", "75 sec"],
                    ["A", "Dead bug", "2 x 6 each side", "45 sec"],
                    ["B", "Hinge", "3 x 8", "75 sec"],
                    ["B", "Row", "3 x 8", "75 sec"],
                    ["B", "Push-up variation", "2 x 8", "75 sec"],
                    ["B", "Side plank", "2 x 20 sec each", "45 sec"],
                    ["C", "Squat", "2 x 8", "60 sec"],
                    ["C", "Hinge", "2 x 8", "60 sec"],
                    ["C", "Push", "2 x 8", "60 sec"],
                    ["C", "Dead bug", "2 x 5 each", "45 sec"],
                ],
            ),
            TIP("If you only have twenty minutes, do two sets of the first three movements and leave. A short session counts. A skipped week does not get paid back by a heroic Sunday."),
        ),
        chapter(
            "The eight-week progression",
            P("Weeks 1 and 2: learn the easier variation and hit the reps cleanly. Weeks 3 and 4: move toward the standard variation or add a one-second pause at the bottom. Weeks 5 and 6: slow the lowering to a three-count. Weeks 7 and 8: add the third session if recovery is good, or add one rep to each set if it is not."),
            T(
                ["Weeks", "Change", "Days", "Stop if"],
                [
                    ["1 to 2", "Learn positions", "2", "Form breaks"],
                    ["3 to 4", "Harder angle or a pause", "2", "Joint pain"],
                    ["5 to 6", "Three-count lower", "2", "You dread the session"],
                    ["7 to 8", "Third day or one more rep", "2 or 3", "Sleep or pain worsens"],
                ],
            ),
            P("Do not add a variation and a slower tempo in the same week. One change. Write it at the top of the log so you remember what you are testing."),
        ),
        chapter(
            "Form cues when you train alone",
            P("Squat: sit back to the chair, knees track over mid-foot, chest stays proud enough that you can take a breath at the bottom. Stand by pushing the floor away."),
            P("Hinge: soft knees, push the hips back, spine stays long. You should feel the back of the thighs, not a pinch in the low back. Push: body in a line from head to knees or heels, elbows about 45 degrees from your sides. Pull: start the row by pulling the shoulder blades toward each other, then the elbows."),
            B(
                "Film one set from the side every other week. Watch it once.",
                "If the film and the feeling disagree, believe the film.",
                "Pain on one side only is a reason to regress, not to match the other side's reps.",
                "Hold the brace without holding your breath.",
            ),
        ),
        chapter(
            "Soreness, joints, and rest",
            P("Muscle soreness that is dull and spread out is ordinary in weeks 1 and 2. Joint pain that is sharp, local, or still there after you warm up is not something to train through. Skip the movement that causes it. Keep the others."),
            T(
                ["Feeling", "Likely meaning", "Action"],
                [
                    ["Dull muscle ache", "New work", "Keep the plan, maybe fewer sets"],
                    ["Sharp joint pain", "Too much load or angle", "Regress or stop that move"],
                    ["Pain at night", "Not simple soreness", "Stop and get it checked"],
                    ["Dizzy during a set", "Breath or blood pressure", "Sit down. End the session"],
                ],
            ),
            N("Chest pain, fainting, or sudden shortness of breath is an emergency, not a line in a training log. Seek urgent care."),
        ),
        chapter(
            "A short conditioning finisher",
            P("After the last set, optional: four minutes of easy work. Forty seconds of marching or step-ups on the bottom stair, twenty seconds of rest, repeated four times. You should be able to speak in short sentences. If you cannot, you are going too hard and you will start skipping the strength."),
            P("The finisher is not the program. Strength is the program. On a week when time is short, delete the finisher first."),
            C(
                "Session letter written down.",
                "Variation used for push and squat.",
                "Reps completed, honestly.",
                "Any pain, and which movement.",
                "Next session's single change, or none.",
            ),
            TIP("Lay out the space the night before if mornings are when you train. The decision is smaller when the floor is already clear."),
        ),
    ],
}

BOOKS_HEALTH = [RESET, TABLE, FLOOR]
