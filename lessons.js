// MoneyQuest lessons: 3 per module. Facts come only from RESEARCH.md; all rupee numbers are rounded and made up for learning.
// Each lesson: id, module, title, hook, summary (used in the game's Lesson time), learn (3 bullets),
// sections [{ h, p: [paragraphs] }], example { title, steps }, india, mistakes, takeaways,
// links [[label, url]], quiz [{ q, o: [4 options], a: index of the right one, why }].
// Text may contain simple HTML. learn.html makes technical words clickable with linkGlossaryTerms().

const LESSONS = [
  // ===================== Module 1: Money Basics =====================
  {
    id: "1-1", module: 1, title: "What Money Is",
    hook: "Money is a shared promise: everyone agrees that these rupees are worth something.",
    summary: "Money is anything people accept in exchange for goods. It does three jobs: it is used to buy things, to measure prices, and to store value for later. UPI moves real bank money, just in digital form.",
    learn: ["Why people invented money instead of swapping things", "The three jobs money does", "Why UPI money is as real as cash"],
    sections: [
      { h: "Life before money", p: [
        "Long ago, people used barter, which means swapping goods directly. A farmer with extra rice had to find a potter who wanted rice at the very moment the farmer wanted a pot. That is hard to arrange.",
        "Money fixes this. You sell what you have for money to anyone, then use that money to buy what you want from someone else, at any time."] },
      { h: "The three jobs of money", p: [
        "RBI describes money as doing three jobs. First, it is a <strong>medium of exchange</strong>: you hand it over to buy goods and services. Second, it is a <strong>unit of account</strong>: it lets us put a price on everything, so we can compare a notebook and a cricket ball. Third, it is a <strong>store of value</strong>: you can set it aside and use it later.",
        "Notice that the third job depends on trust. If prices rise quickly, stored money buys less. You will see this in the Inflation lesson."] },
      { h: "Money today is mostly digital", p: [
        "Money is not only coins and notes. When you pay by UPI, your bank reduces your balance and increases the seller's balance. It is the same money, moved by computers. That is why a UPI payment is as real as handing over cash, and why you must protect your UPI PIN."] }
    ],
    example: { title: "Worked example: barter versus money", steps: [
      "Aman has 6 notebooks. He wants a cricket ball that the shopkeeper values at 3 notebooks. But the shopkeeper does not want notebooks today.",
      "With money, notebooks sell for ₹40 each. 6 × ₹40 = ₹240.",
      "The ball costs ₹120. Aman pays ₹120, so ₹240 − ₹120 = ₹120 is left.",
      "That ₹120 is a store of value: he can spend it next week on something else. Barter could not do that."] },
    india: "At a chai stall, the seller does not need your old notebooks. She accepts ₹15 by cash or UPI, and uses that same money to buy milk from someone else. Money lets thousands of strangers trade without knowing each other.",
    mistakes: ["Thinking UPI is \"not real money\" and spending it carelessly", "Believing that having more money always means being richer, even if prices rise", "Keeping all your money as cash at home where it can be lost"],
    takeaways: ["Money solves the problem of barter", "It is a medium of exchange, a unit of account and a store of value", "Digital money is real money; protect your PIN", "Trust in money's value is what makes it work"],
    links: [["RBI concept note on money and its functions", "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/CONCEPTNOTEACB531172E0B4DFC9A6E506C2C24FFB6.PDF"], ["SEBI investor site: Money Matters", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "What is barter?", o: ["Swapping goods directly without money", "Paying by UPI", "Saving in a bank", "Borrowing from a friend"], a: 0, why: "Barter is exchanging goods for goods, with no money in between." },
      { q: "Which is NOT one of money's three jobs?", o: ["Medium of exchange", "Guaranteed profit", "Unit of account", "Store of value"], a: 1, why: "Money has no guaranteed profit; its jobs are exchange, measuring prices and storing value." },
      { q: "Pricing a notebook at ₹40 and a ball at ₹120 shows money as a...", o: ["Loan", "Dividend", "Unit of account", "Tax"], a: 2, why: "A unit of account lets us put a number on every item so we can compare them." },
      { q: "A UPI payment is...", o: ["Pretend money", "Free money", "Only for large businesses", "Real bank money moved digitally"], a: 3, why: "UPI changes balances in real bank accounts, so it is real money." }
    ]
  },
  {
    id: "1-2", module: 1, title: "Needs, Wants and the 50/30/20 Rule",
    hook: "A budget is not a punishment. It is a plan that tells your money where to go before it disappears.",
    summary: "A need is something you must have; a want is nice to have. The 50/30/20 rule is a simple guide: about 50% of income for needs, 30% for wants and 20% for savings. Tracking real spending shows how your own split looks.",
    learn: ["How to tell a need from a want", "How the 50/30/20 rule splits income", "How to start a simple budget"],
    sections: [
      { h: "Needs and wants", p: [
        "A <strong>need</strong> is something you must have to live and work: food, a bus pass, rent, a working phone for studies. A <strong>want</strong> is something nice to have: a cafe trip, new sneakers, a game.",
        "Some things sit in the middle. A phone is a need; the newest, most expensive phone is a want. Ask: \"What is the cheapest option that still does the job?\" Anything above that is a want."] },
      { h: "Why a budget helps", p: [
        "Without a plan, money gets spent on whatever comes first. A <strong>budget</strong> is a plan for your income. SEBI's investor site suggests two starting steps: track what you actually spend, and separate fixed costs, such as rent and loan repayments, from variable costs, such as food and entertainment. Variable costs are usually easier to trim."] },
      { h: "The 50/30/20 rule", p: [
        "This popular guide splits your income into three parts: about 50% for needs, 30% for wants, and 20% for savings. It is a starting point, not a law. If your rent is high, needs may take 60%, and you adjust the others.",
        "The best habit is to move the savings part first, as soon as money arrives. What is left is for needs and wants."] }
    ],
    example: { title: "Worked example: splitting pocket money and a first salary", steps: [
      "Pocket money of ₹3,000. Needs: 50% × ₹3,000 = ₹1,500 (bus pass, snacks, recharge).",
      "Wants: 30% × ₹3,000 = ₹900 (movie, cafe). Savings: 20% × ₹3,000 = ₹600.",
      "Check: ₹1,500 + ₹900 + ₹600 = ₹3,000. Nothing is missing.",
      "Now a first salary of ₹25,000: needs ₹12,500, wants ₹7,500, savings ₹5,000. The percentages stay the same; only the rupees grow."] },
    india: "Priya gets ₹3,000 on the 1st. She moves ₹600 to her savings account at once, pays her bus pass, and keeps ₹900 for fun. When her friends plan a ₹1,500 trip in the middle of the month, she knows exactly what she can afford.",
    mistakes: ["Calling every want a need (\"I need that jacket\")", "Saving only \"what is left\" at the end, which is often nothing", "Treating 50/30/20 as a strict law instead of a guide you can adjust"],
    takeaways: ["Need = must have; want = nice to have", "Track your spending to see where money really goes", "50/30/20 is a guide: needs, wants, savings", "Move savings first, then spend the rest"],
    links: [["SEBI investor site: Money Matters (income and expenses)", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "Which is most clearly a want?", o: ["A new gaming console", "Bus pass to college", "Food for the week", "Rent"], a: 0, why: "A gaming console is nice to have, not essential to live or work." },
      { q: "On ₹20,000 income, what does the 50/30/20 guide suggest for savings?", o: ["₹2,000", "₹4,000", "₹6,000", "₹10,000"], a: 1, why: "20% × ₹20,000 = ₹4,000." },
      { q: "What does SEBI's site suggest you do first when budgeting?", o: ["Buy shares", "Take a loan", "Track what you actually spend", "Open a credit card"], a: 2, why: "Knowing real spending, split into fixed and variable costs, comes first." },
      { q: "Why move savings first?", o: ["It looks neat", "Banks demand it", "It is a law", "What is left after spending is often nothing"], a: 3, why: "Saving first makes sure it happens, instead of hoping something is left." }
    ]
  },
  {
    id: "1-3", module: 1, title: "Your Emergency Fund",
    hook: "Surprises are certain; you just do not know when. An emergency fund turns a crisis into an inconvenience.",
    summary: "An emergency fund is money kept aside for surprises, like a broken phone or a medical bill. It should be safe and easy to reach, and it is built a little at a time. Its job is safety, not growth.",
    learn: ["What an emergency fund is and why it matters", "Where to keep it", "How to build it step by step"],
    sections: [
      { h: "Why you need one", p: [
        "Life throws sudden costs at you: a cracked screen, a doctor visit, a broken laptop before an exam. Without savings you must borrow, and a loan adds interest on top of the problem. An <strong>emergency fund</strong> is money set aside only for such moments. SEBI's materials describe saving as the way to meet short-term needs and provide a safety net for emergency expenses."] },
      { h: "How big, and where to keep it", p: [
        "There is no official number. A common rule of thumb is a few months of your basic costs, but start smaller. Even ₹2,000 stops many small crises from becoming loans.",
        "Keep it safe and easy to reach. A savings account is often a good fit, because you can withdraw quickly. Money that must be ready in a hurry should not sit in something that can fall in value or is locked for years. Its job is safety, not high growth."] },
      { h: "How to build it", p: [
        "Pick a monthly amount and move it the day money arrives. When you use the fund, refill it. Keep it separate from your spending money so you are not tempted. Only genuine surprises count: a sale is not an emergency."] }
    ],
    example: { title: "Worked example: a goal of three months of costs", steps: [
      "Your basic monthly costs are ₹10,000. Goal: 3 × ₹10,000 = ₹30,000.",
      "You save ₹1,500 a month. ₹30,000 ÷ ₹1,500 = 20 months (ignoring the small interest).",
      "Raise it to ₹2,500 a month and it takes ₹30,000 ÷ ₹2,500 = 12 months.",
      "Halfway there, at ₹15,000, a ₹4,000 phone repair no longer needs a loan: you pay it, then refill."] },
    india: "Arjun's laptop dies a week before his project deadline. The repair costs ₹4,000. Because he keeps a small fund in his savings account, he pays at once and finishes on time. His friend without a fund borrows from a relative and has to repay with awkwardness.",
    mistakes: ["Treating sales or wants as \"emergencies\"", "Locking the fund in something you cannot reach quickly", "Never refilling it after using it"],
    takeaways: ["An emergency fund pays for surprises so you do not borrow", "Keep it safe and easy to reach", "Start small, add every month", "Refill it after you use it"],
    links: [["SEBI: saving and planning for emergencies", "https://www.sebi.gov.in/sebi_data/investors/financial_literacy/Investment%20Planning%20for%20Retired%20People.pdf"], ["SEBI investor site: Money Matters", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "What is an emergency fund for?", o: ["Genuine surprise costs", "Shopping sales", "Buying shares", "Holidays"], a: 0, why: "It is kept for unexpected needs like repairs or medical bills." },
      { q: "Where should it be kept?", o: ["In a risky share", "Somewhere safe and easy to reach", "Locked away for 10 years", "With a friend"], a: 1, why: "You may need it quickly, so safety and easy access matter most." },
      { q: "With ₹10,000 monthly costs, what is a 3-month fund?", o: ["₹10,000", "₹20,000", "₹30,000", "₹3,000"], a: 2, why: "3 × ₹10,000 = ₹30,000." },
      { q: "After you use the fund, you should...", o: ["Forget it", "Close the account", "Borrow instead", "Refill it step by step"], a: 3, why: "A fund only protects you if it is topped up again." }
    ]
  },

  // ===================== Module 2: Prices and Currency =====================
  {
    id: "2-1", module: 2, title: "What Inflation Is",
    hook: "The samosa that cost ₹10 when you were small costs more now. That quiet change has a name.",
    summary: "Inflation is a sustained rise in the general level of prices. It is measured in India by the CPI, and RBI aims for around 4% with a band of 2% either side. Inflation means each rupee buys a little less than before.",
    learn: ["What inflation is and how India measures it", "How a small yearly rise adds up", "Why RBI watches it"],
    sections: [
      { h: "A rise in prices", p: [
        "<strong>Inflation</strong> means a sustained rise in the general level of prices. Note the words \"general\" and \"sustained\": one shop raising the price of one item for one week is not inflation. It is when prices across many things keep rising over time.",
        "Shops raise prices for many reasons. For example, when it costs more to make or carry goods, sellers may pass part of that on to customers."] },
      { h: "How India measures it", p: [
        "India tracks inflation with the <strong>Consumer Price Index (CPI)</strong>. Think of a shopping basket of everyday things: food, travel, clothes, rent. The CPI follows how much that basket costs over time.",
        "RBI's target for inflation is 4%, with a comfort band of 2% above or below. That means RBI tries to keep price rises moderate: not zero, but not too fast."] },
      { h: "Small numbers add up", p: [
        "A 5% rise sounds tiny. But it repeats every year, and each year's rise is on top of the last. After a few years, the total is bigger than 5% times the years."] }
    ],
    example: { title: "Worked example: a ₹100 shopping basket at 5% a year", steps: [
      "Today the basket costs ₹100.",
      "After 1 year: ₹100 × 1.05 = ₹105.",
      "After 2 years: ₹105 × 1.05 = ₹110.25.",
      "After 3 years: ₹110.25 × 1.05 = ₹115.76. The same basket costs about ₹16 more, though it holds the same things.",
      "Rates here are examples only; real inflation changes over time."] },
    india: "Ravi's college canteen sold a samosa for ₹10 two years ago and now sells it for ₹15, while his pocket money stayed at ₹1,500. He can buy fewer samosas than before, even though his rupees did not change.",
    mistakes: ["Thinking inflation is one shop raising its price", "Believing prices fall back to old levels", "Ignoring inflation when planning savings"],
    takeaways: ["Inflation is a sustained rise in general prices", "India measures it with CPI", "RBI's target is around 4% with a 2% band either side", "Small yearly rises compound into big changes"],
    links: [["RBI: inflation explained", "https://rbidocs.rbi.org.in/rdocs/Speeches/PDFs/IAEDF140110.pdf"], ["RBI: inflation target and CPI", "https://www.rbi.org.in/commonman/english/scripts/PressReleases.aspx?Id=2601"]],
    quiz: [
      { q: "Inflation is...", o: ["A sustained rise in general prices", "A rise in one shop's price", "A fall in prices", "A bank fee"], a: 0, why: "It is a general and sustained price rise, not one item." },
      { q: "India measures inflation using...", o: ["NAV", "CPI", "EMI", "KYC"], a: 1, why: "The Consumer Price Index tracks a basket of everyday goods." },
      { q: "RBI's inflation target is around...", o: ["0%", "20%", "4%", "50%"], a: 2, why: "RBI aims for 4% with a band of 2% above or below." },
      { q: "A ₹100 basket rising 5% a year costs about ___ after 2 years.", o: ["₹105", "₹120", "₹100", "₹110.25"], a: 3, why: "₹100 × 1.05 × 1.05 = ₹110.25." }
    ]
  },
  {
    id: "2-2", module: 2, title: "Why Your Money Buys Less Over Time",
    hook: "₹10,000 today and ₹10,000 in five years are the same number but not the same power.",
    summary: "When prices rise, the same rupees buy less. This lost buying power is why cash kept idle slowly loses value, and why the interest you earn should be compared with inflation.",
    learn: ["What purchasing power is", "How idle cash loses value", "Why to compare interest with inflation"],
    sections: [
      { h: "Purchasing power", p: [
        "<strong>Purchasing power</strong>, also called buying power, is what your money can actually buy. If a bag of rice costs ₹100 today and ₹105 next year, your ₹100 buys a little less than a full bag. The number on a note stays the same; the amount it buys shrinks. This is the real value of your savings."] },
      { h: "Idle cash loses ground", p: [
        "Cash kept under a mattress earns nothing. While it sits, inflation reduces what it can buy. A savings account pays interest, which helps, but if the interest is lower than inflation, your buying power still shrinks slowly, only more slowly.",
        "This does not mean you should rush into risky things. It means you should know the two numbers: the interest rate and the inflation rate, and compare them."] },
      { h: "Real versus nominal", p: [
        "The rupee amount in your account is the <em>nominal</em> amount. What it can buy is the <em>real</em> value. To see real value, divide by how much prices have grown."] }
    ],
    example: { title: "Worked example: ₹10,000 for 5 years at 5% inflation", steps: [
      "Prices grow 5% a year for 5 years: 1.05 × 1.05 × 1.05 × 1.05 × 1.05 ≈ 1.276.",
      "Cash under the mattress: ₹10,000 ÷ 1.276 ≈ ₹7,835 in today's buying power. You lost about ₹2,165 of power.",
      "In a savings account at 3% (an example): ₹10,000 × 1.03⁵ ≈ ₹11,593 nominal.",
      "Real value: ₹11,593 ÷ 1.276 ≈ ₹9,083. Still below ₹10,000, but much better than idle cash.",
      "These rates are illustrations; real rates change."] },
    india: "Meera's grandfather kept ₹50,000 in a steel cupboard for many years. The note value never changed, but the things it buys did: the same ₹50,000 buys far fewer groceries now than when he saved it.",
    mistakes: ["Judging savings only by the rupee amount", "Keeping large sums as idle cash", "Chasing very high returns to beat inflation, which often means higher risk"],
    takeaways: ["Purchasing power is what money can buy", "Inflation lowers it every year", "Compare interest rates with inflation", "Idle cash loses buying power fastest"],
    links: [["RBI: inflation explained", "https://rbidocs.rbi.org.in/rdocs/Speeches/PDFs/IAEDF140110.pdf"]],
    quiz: [
      { q: "Purchasing power means...", o: ["What your money can buy", "How much cash you hold", "Your bank's size", "Your salary slip"], a: 0, why: "It is the real amount of goods and services your money buys." },
      { q: "Which loses buying power fastest?", o: ["Idle cash", "Money earning interest above inflation", "Both equally", "Neither"], a: 0, why: "Idle cash earns nothing while prices rise." },
      { q: "If interest is 3% and inflation is 5%, buying power...", o: ["Grows", "Slowly shrinks", "Stays equal", "Doubles"], a: 1, why: "Prices rise faster than your money grows." },
      { q: "₹10,000 at 5% inflation for 5 years has a buying power of about...", o: ["₹10,000", "₹12,763", "₹7,835", "₹5,000"], a: 2, why: "₹10,000 ÷ 1.276 ≈ ₹7,835." }
    ]
  },
  {
    id: "2-3", module: 2, title: "Exchange Rates",
    hook: "A game that costs $20 can cost different rupees on different days. Here is why.",
    summary: "An exchange rate tells you how many rupees one unit of a foreign currency costs. A higher number for the dollar means a weaker rupee. Banks and money changers add a spread, so you get a slightly worse rate than the one in the news.",
    learn: ["What an exchange rate is", "What a weaker or stronger rupee means", "What a spread is and how to compare"],
    sections: [
      { h: "Rupees per dollar", p: [
        "Each country has its own <strong>currency</strong>: rupees in India, dollars in the USA. The <strong>exchange rate</strong> tells you how many rupees you need for one unit of a foreign currency. If $1 = ₹85 (a made-up example), a $20 item costs 20 × ₹85 = ₹1,700.",
        "RBI explains that the exchange rate is set by the market and is quoted as rupees per unit of foreign currency. It changes every day."] },
      { h: "Stronger and weaker rupee", p: [
        "If the rate moves from ₹85 to ₹88 per dollar, you need more rupees to buy the same dollar. People say the rupee has become weaker. If it moves to ₹82, the rupee is stronger, and foreign goods cost fewer rupees."] },
      { h: "The spread", p: [
        "Banks and money changers do not exchange at the exact published rate. They add a small gap called the <strong>spread</strong>, so you get slightly less when you sell dollars, or pay slightly more when you buy them. Spreads differ between places, so compare before you exchange."] }
    ],
    example: { title: "Worked example: a $50 gift", steps: [
      "Suppose the published rate is $1 = ₹85. $50 × ₹85 = ₹4,250.",
      "Counter A offers ₹84: $50 × ₹84 = ₹4,200 (a spread of ₹1 per dollar).",
      "Counter B offers ₹82: $50 × ₹82 = ₹4,100.",
      "Choosing A over B gives ₹100 more for the same gift. Comparing takes minutes.",
      "If the market rate itself moves to ₹88 tomorrow, the same $20 game costs 20 × ₹88 = ₹1,760, which is ₹60 more than at ₹85."] },
    india: "Nisha's cousin abroad sends her $50 for her birthday. She checks two banks and a currency counter before exchanging, and picks the one that gives the most rupees. She also remembers that the rate she saw in the news is not the rate she will get.",
    mistakes: ["Assuming the news rate is the rate you will get", "Using the first counter you see", "Thinking the rate stays the same for long"],
    takeaways: ["An exchange rate is rupees per unit of foreign currency", "A higher number for the dollar means a weaker rupee", "Rates change daily", "Spreads make your rate slightly worse; compare places"],
    links: [["RBI FAQ on exchange rates", "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=1877"]],
    quiz: [
      { q: "If $1 = ₹85, what does a $20 item cost in rupees?", o: ["₹85", "₹20", "₹105", "₹1,700"], a: 3, why: "20 × ₹85 = ₹1,700." },
      { q: "The rate moves from ₹85 to ₹88 per dollar. The rupee has become...", o: ["Weaker", "Stronger", "Unchanged", "Fixed by the bank"], a: 0, why: "More rupees are needed for one dollar, so the rupee is weaker." },
      { q: "A spread is...", o: ["A tax", "The gap between published rate and the rate you get", "A bank holiday", "A type of loan"], a: 1, why: "Money changers add a small gap, so you get a slightly worse rate." },
      { q: "Best way to exchange a gift?", o: ["Use the first counter", "Wait for the news", "Compare rates in a few places", "Ask a stranger online"], a: 2, why: "Spreads differ, so comparing gives you more rupees." }
    ]
  },

  // ===================== Module 3: Banking =====================
  {
    id: "3-1", module: 3, title: "How Banks Work and Deposit Insurance",
    hook: "Your money in the bank is not sitting in a box with your name on it. So how is it safe?",
    summary: "A bank takes deposits from many people and lends part of that money to others, earning interest. DICGC insures deposits up to ₹5 lakh per depositor per bank, principal and interest together, and the bank pays the premium.",
    learn: ["What a bank does with your deposit", "What deposit insurance covers", "How the ₹5 lakh limit works"],
    sections: [
      { h: "What a bank does", p: [
        "A <strong>bank</strong> keeps your money safe and lets you pay and receive money easily. It also uses the deposits of many people to give loans to others, such as families buying a home or shops buying stock. Borrowers pay interest, and the bank pays some of that as interest to depositors.",
        "So your money is not in a box with your name on it. Many depositors' money is pooled, and only a part is ever withdrawn on a given day."] },
      { h: "Deposit insurance", p: [
        "If a bank ever fails, <strong>DICGC</strong> (Deposit Insurance and Credit Guarantee Corporation) insures bank deposits up to ₹5 lakh per depositor per bank. This covers savings, current, fixed and recurring deposits, and the ₹5 lakh includes principal and interest together.",
        "The bank pays the insurance premium, not you. You do not need to do anything to get this cover."] },
      { h: "Per depositor, per bank", p: [
        "The limit is for each depositor in each bank. All your accounts in one bank are added together before the limit applies. Money above ₹5 lakh in the same bank is not covered. One way to stay within the limit is to keep large sums in more than one bank."] }
    ],
    example: { title: "Worked example: Meera's ₹6.5 lakh", steps: [
      "Meera's family keeps ₹3,00,000 in a savings account and ₹3,50,000 in an FD in the same bank.",
      "Add them: ₹3,00,000 + ₹3,50,000 = ₹6,50,000 in one bank.",
      "Insured: ₹5,00,000. Not covered if the bank fails: ₹6,50,000 − ₹5,00,000 = ₹1,50,000.",
      "If she moves the FD to a second bank, each bank holds less than ₹5 lakh, so everything is inside the limit.",
      "This is how the rule works; it is not a suggestion to hold any amount."] },
    india: "When a neighbourhood bank hits trouble, a family worries about their savings. Because deposits up to ₹5 lakh per bank are insured, those with small savings are protected, which is why knowing this rule removes panic.",
    mistakes: ["Thinking all deposits in a bank are fully insured", "Forgetting that all accounts in one bank are added together", "Taking money out in panic and keeping cash at home"],
    takeaways: ["Banks pool deposits and lend part of them", "DICGC insures up to ₹5 lakh per depositor per bank", "Interest and principal are counted together", "The bank pays the premium, not you"],
    links: [["DICGC guide to deposit insurance", "https://www.dicgc.org.in/guide-to-deposit-insurance"]],
    quiz: [
      { q: "DICGC insures deposits up to...", o: ["₹50,000", "₹5 lakh per depositor per bank", "₹1 crore", "Nothing"], a: 1, why: "The cover is ₹5 lakh per depositor per bank." },
      { q: "Who pays the insurance premium?", o: ["You", "Your parents", "The government", "The bank"], a: 3, why: "The bank pays the premium, not the depositor." },
      { q: "₹3 lakh savings + ₹3.5 lakh FD in one bank: how much is insured?", o: ["₹5 lakh", "₹6.5 lakh", "₹3 lakh", "₹3.5 lakh"], a: 0, why: "Accounts in one bank are added, and cover stops at ₹5 lakh." },
      { q: "Does the ₹5 lakh include interest?", o: ["No, only interest", "Yes, principal and interest together", "No, only principal", "Only for FDs"], a: 1, why: "The limit covers principal and interest together." }
    ]
  },
  {
    id: "3-2", module: 3, title: "Account Types and KYC",
    hook: "Before a bank opens an account, it asks who you are. That check is called KYC, and it protects you too.",
    summary: "Savings accounts are for individuals; current accounts are for businesses. A Basic Savings Bank Deposit Account needs no minimum balance. KYC means the bank checks your identity with a photo and an officially valid document.",
    learn: ["The main kinds of bank accounts", "What a basic savings account offers", "What KYC is and how to update it safely"],
    sections: [
      { h: "Kinds of accounts", p: [
        "A <strong>savings account</strong> is for individuals to keep money and earn some interest. A <strong>current account</strong> is meant for businesses that make many payments every day. Banks also offer <strong>fixed deposits (FD)</strong> and <strong>recurring deposits (RD)</strong>, where you lock money for a period to earn interest.",
        "Many ordinary savings accounts ask you to keep a minimum balance and may charge a fee if you fall below it. Always ask before opening."] },
      { h: "The basic savings account", p: [
        "RBI has a <strong>Basic Savings Bank Deposit Account</strong> (BSBDA). It needs no minimum balance and no initial deposit. Cash deposits and withdrawals at the branch and ATM, and receiving money electronically, are free. You get at least four free withdrawals a month, including ATM withdrawals (banks may allow more).",
        "It still follows KYC rules, and a holder cannot also open another savings account in that same bank, though FDs and RDs are allowed."] },
      { h: "What KYC means", p: [
        "<strong>KYC</strong> stands for Know Your Customer. The bank checks who you are with a photo and an <strong>officially valid document</strong>, such as a passport, driving licence, voter ID, PAN or Aadhaar letter. The list can change, so ask your bank. Banks can also ask you to update your details later.",
        "A real bank updates KYC inside its own app or at a branch. A random message with a link, or a call asking for an OTP, is a scam."] }
    ],
    example: { title: "Worked example: what a minimum balance rule can cost", steps: [
      "Suppose an ordinary account needs ₹1,000 minimum, and charges ₹100 a month (a made-up fee) when you fall below.",
      "If your balance stays under ₹1,000 for 12 months, the cost is 12 × ₹100 = ₹1,200.",
      "A basic savings account has no minimum balance, so this charge does not apply.",
      "The trade-off: at least four free withdrawals a month (banks may allow more). If you withdraw ₹500 each time, four free withdrawals take out 4 × ₹500 = ₹2,000.",
      "Choose by how you actually use the account."] },
    india: "Kabir turns 18 and wants his own account. He brings his photo and PAN card to the branch, asks about the minimum balance, and chooses an account that fits his small pocket money. Later, a fake \"KYC expired\" SMS arrives, and he ignores the link and checks his bank's own app.",
    mistakes: ["Skipping the minimum balance question", "Believing a message that says KYC has expired and gives a link", "Using a friend's account instead of your own"],
    takeaways: ["Savings accounts are for individuals; current accounts are for businesses", "A basic savings account has no minimum balance but limited withdrawals", "KYC = photo + officially valid document", "Update KYC only through the bank's own app or branch"],
    links: [["RBI Kehta Hai: Basic Savings Bank Deposit Account", "https://rbikehtahai.rbi.org.in/bsbd-account.html"], ["RBI FAQ on BSBDA", "https://www.rbi.org.in/CommonPerson/english/Scripts/FAQs.aspx?Id=1556"]],
    quiz: [
      { q: "A current account is mainly for...", o: ["Students", "Children", "Businesses with many payments", "Gold loans"], a: 2, why: "Current accounts suit businesses with frequent daily transactions." },
      { q: "A basic savings account (BSBDA) has...", o: ["A ₹10,000 minimum", "Unlimited withdrawals", "No KYC", "No minimum balance"], a: 3, why: "It needs no minimum balance and no initial deposit, but KYC still applies." },
      { q: "KYC stands for...", o: ["Know Your Customer", "Keep Your Cash", "Key Yearly Charge", "Know Your Charges"], a: 0, why: "Know Your Customer: the bank verifies who you are." },
      { q: "A text says your KYC expired and gives a link. You should...", o: ["Tap the link", "Check the bank's own app or branch", "Send your OTP", "Forward it"], a: 1, why: "Real banks update KYC in their own app or branch, not through random links." }
    ]
  },
  {
    id: "3-3", module: 3, title: "Using Your Account Safely",
    hook: "Your money is only as safe as your habits. Three small habits stop most trouble.",
    summary: "Never share your PIN or OTP. Receiving money never needs a PIN. Check your statement regularly, and if something looks wrong, contact your bank through its own app, branch, or the number on your card.",
    learn: ["How to use a debit card and UPI safely", "How to read an account statement", "Who to contact when something is wrong"],
    sections: [
      { h: "Debit card and UPI basics", p: [
        "A <strong>debit card</strong> takes money straight from your account when you pay or withdraw at an ATM. <strong>UPI</strong> lets you send money from your account using your phone and a UPI PIN.",
        "The rule for every PIN: never share it. NPCI says UPI PIN should not be shared with anyone, and that your bank's customer support will never ask for it. Not even close friends need your PIN."] },
      { h: "Receiving never needs a PIN", p: [
        "RBI's rule is simple: you never need a PIN or a QR scan to receive money. If an app asks for your PIN, you are about to send money, not receive it. Also, entering a wrong PIN three times in a row can make UPI block you for a short time, so type slowly."] },
      { h: "Read your statement", p: [
        "An <strong>account statement</strong> or passbook lists every credit (money in) and debit (money out). Read it regularly. If a charge looks strange, ask your bank through its own app, branch, or the number on the back of your card. Do not use a number from a search result, since fake numbers can appear there."] }
    ],
    example: { title: "Worked example: reading a mini statement", steps: [
      "Opening balance: ₹5,000.",
      "Credit: pocket money ₹3,000 → ₹5,000 + ₹3,000 = ₹8,000.",
      "Debit: books ₹450 → ₹8,000 − ₹450 = ₹7,550. Debit: UPI to a friend ₹1,200 → ₹6,350.",
      "Debit: \"₹250 unknown charge\" → ₹6,100. That last one you do not recognise.",
      "Closing balance on paper: ₹6,100. Ask your bank about the ₹250 charge. It may be a fee or a mistake, and only the bank can tell you."] },
    india: "Aman sells his old cricket bat online. The \"buyer\" sends a request and says, \"Enter your UPI PIN to receive ₹2,000.\" Aman remembers that receiving never needs a PIN, declines, and blocks the buyer. His ₹2,000 stays safe.",
    mistakes: ["Sharing a PIN with a friend \"just this once\"", "Never checking the statement", "Calling a helpline number found in a search result"],
    takeaways: ["Never share a PIN or OTP", "Receiving money never needs a PIN or QR scan", "Check your statement regularly", "Contact your bank via its app, branch or the number on your card"],
    links: [["NPCI UPI FAQ", "https://upi.npci.org.in/static/faq/en_US/"], ["RBI BE(A)WARE booklet", "https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf"]],
    quiz: [
      { q: "To receive money by UPI, you need to...", o: ["Enter your PIN", "Scan a QR", "Nothing like that", "Share your OTP"], a: 2, why: "Receiving never needs a PIN or QR scan; entering a PIN means you are sending." },
      { q: "Who may ask for your UPI PIN?", o: ["Bank customer support", "A friend", "Nobody", "A delivery person"], a: 2, why: "Nobody should be given your PIN, including bank support." },
      { q: "On a statement, a debit is...", o: ["Money in", "A free gift", "Interest", "Money out"], a: 3, why: "A debit is money leaving your account." },
      { q: "You find a strange ₹250 charge. First step?", o: ["Ask the bank via its app or branch", "Ignore it", "Call a number from a search ad", "Share your OTP"], a: 0, why: "Use official channels: the bank's app, branch or the number on your card." }
    ]
  },

  // ===================== Module 4: Scams and Safe Banking =====================
  {
    id: "4-1", module: 4, title: "How UPI and OTP Scams Work",
    hook: "Scammers rarely break into systems. They trick people into opening the door.",
    summary: "Scammers create urgency and pretend to be someone you trust. In a UPI request scam, they ask you to approve a request with your PIN, which sends money away. Banks, RBI and genuine entities never ask for your OTP, PIN or passwords.",
    learn: ["How a UPI collect-request scam works", "Why scammers want your OTP", "The golden rules that stop most scams"],
    sections: [
      { h: "The trick behind every scam", p: [
        "Scammers use two tools: <strong>pretending</strong> and <strong>pressure</strong>. They pretend to be a buyer, a bank officer or a delivery agent, and they push you to act fast so you do not stop to think. Your best defence is to slow down."] },
      { h: "The UPI request scam", p: [
        "In a <strong>collect request scam</strong>, a fraudster poses as a buyer for something you listed. They send a request and say, \"Approve it and enter your PIN to receive the money.\" But a UPI PIN is for <em>sending</em>. When you enter it, money leaves your account. RBI's rule: you never need a PIN to receive money."] },
      { h: "The OTP trick", p: [
        "An <strong>OTP</strong> (one-time password) is a secret code that approves one action. A caller who sounds like a bank official says your card is blocked and asks you to read out the OTP. But banks, RBI and genuine entities never ask for your OTP, PIN or passwords. If you share them yourself, you bear the loss until you report it to your bank."] }
    ],
    example: { title: "Worked example: the cricket bat scam", steps: [
      "Your balance: ₹8,000. You list your bat for ₹2,000.",
      "A \"buyer\" sends a ₹2,000 request and says, \"Enter your PIN to receive.\"",
      "You enter the PIN. ₹2,000 leaves your account: ₹8,000 − ₹2,000 = ₹6,000.",
      "The buyer now has ₹2,000, and you have neither the bat money nor your bat if it was a swap.",
      "If you had declined, the balance would remain ₹8,000. Report the request at cybercrime.gov.in or on 1930."] },
    india: "Sana gets a call: \"Your card is blocked. Tell me the OTP now to unblock it.\" The voice is polite and urgent. Sana hangs up and calls the number on the back of her card. The bank says her card is fine.",
    mistakes: ["Trusting a caller because they know your name", "Entering a PIN to \"receive\" a refund", "Staying on the call when the caller says \"don't tell anyone\""],
    takeaways: ["Scammers pretend and pressure", "You never need a PIN to receive money", "Banks never ask for OTP, PIN or passwords", "Sharing them yourself means you bear the loss until you report"],
    links: [["RBI BE(A)WARE booklet", "https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf"], ["RBI Kehta Hai: cautions", "https://rbikehtahai.rbi.org.in/rbi-cautions.html"]],
    quiz: [
      { q: "Entering your UPI PIN on a \"receive money\" request means you are...", o: ["Receiving money", "Sending money", "Doing KYC", "Saving money"], a: 1, why: "A PIN approves sending. Receiving never needs one." },
      { q: "Who asks for your OTP?", o: ["Bank officers", "RBI", "Genuine entities", "None of them"], a: 3, why: "None of them. Anyone asking for your OTP is a scammer." },
      { q: "What do scammers use to rush you?", o: ["Patience", "Good manners only", "Urgency and pressure", "Silence"], a: 2, why: "They push you to act fast, so you do not think." },
      { q: "If you share your OTP yourself and lose money, you...", o: ["Are always refunded", "Are fined", "Are charged a fee by the bank", "Bear the loss until you report it to your bank"], a: 3, why: "You bear the loss until you report it, so report at once." }
    ]
  },
  {
    id: "4-2", module: 4, title: "Phishing and Fake Apps",
    hook: "A message can look exactly like your bank's and still be a trap.",
    summary: "Phishing is a fake message pretending to be a trusted company. Never tap unknown links, never install apps from links, and only download apps from verified sources. A screen-sharing app lets a stranger see your phone.",
    learn: ["What phishing, smishing and vishing are", "How to spot fake links and fake apps", "Why a screen-sharing app is dangerous"],
    sections: [
      { h: "Three names, one trick", p: [
        "<strong>Phishing</strong> is a fake message pretending to be a trusted sender, to make you give details. When it comes by SMS it is <strong>smishing</strong>, and when it comes by a phone call it is <strong>vishing</strong>. Vishing callers pose as bankers or officials and create urgency to get your password, OTP, PIN or CVV."] },
      { h: "Spotting fake links", p: [
        "RBI advises: do not click unknown links in SMS or email; delete them. Do not give bank details through links. Before typing anything on a website, check the spelling of the address and look for https with a padlock. A fake KYC message will have an address that looks close to your bank's but is not.",
        "Be careful with phone numbers too: numbers found through internet search can be fake. Use the number on the back of your card or on the bank's official site."] },
      { h: "Fake apps and screen-sharing", p: [
        "Some messages carry a link to install an app file. Installing it can give a fraudster access to your phone, and some frauds need no OTP at all. Download apps only from verified sources, check the publisher, and give only the permissions the app truly needs.",
        "A <strong>screen-sharing</strong> app lets someone see your screen. Never install one because a caller or message asks you to."] }
    ],
    example: { title: "Worked example: checking a fake KYC SMS", steps: [
      "SMS: \"Your KYC has expired. Update now or the account is blocked: bank-kyc-verify.in\".",
      "Red flag 1: urgency (\"blocked\"). Red flag 2: an unknown link. Red flag 3: your bank updates KYC in its app or branch. That makes 3 red flags.",
      "Safe action: delete the message, open your own bank app and check for any real request.",
      "If you had tapped and shared an OTP, a scammer could take, say, ₹3,000 from your account.",
      "Report to your bank, then 1930 or cybercrime.gov.in."] },
    india: "Rohan gets a message: \"Get free cashback! Install this bank app file.\" The link ends with an app file name. He ignores it, checks the real bank app in the official store, and sees no such offer.",
    mistakes: ["Tapping a link because the message has your name", "Installing an app file sent in a chat", "Letting a \"support agent\" share your screen"],
    takeaways: ["Phishing = fake messages; smishing = by SMS; vishing = by call", "Never tap unknown links or install apps from links", "Check the address spelling and https padlock", "Never install a screen-sharing app because a caller or message asks you to"],
    links: [["RBI Kehta Hai: cautions", "https://rbikehtahai.rbi.org.in/rbi-cautions.html"], ["RBI BE(A)WARE booklet", "https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf"]],
    quiz: [
      { q: "Vishing is phishing by...", o: ["Phone call", "SMS", "Email", "Post"], a: 0, why: "Vishing is done through voice calls." },
      { q: "A message with a link says your account will be blocked. Best action?", o: ["Tap the link fast", "Delete it and check your bank's own app", "Reply with OTP", "Forward it"], a: 1, why: "Delete suspicious links and verify only through official channels." },
      { q: "Where should you download apps from?", o: ["Links in chats", "Any website", "Verified sources", "Pop-up ads"], a: 2, why: "Use verified sources only, and check the publisher." },
      { q: "Install a screen-sharing app when...", o: ["A stranger asks", "A friend forwards a link", "A pop-up says so", "Never because a caller or message asks you to"], a: 3, why: "A caller or message asking you to install one is a common fraud. Do not install it because someone asks." }
    ]
  },
  {
    id: "4-3", module: 4, title: "What to Do If You Are Scammed",
    hook: "Even careful people get tricked. What you do in the next minutes matters most.",
    summary: "If you lose money to fraud, tell your bank at once, call 1930, and file a report at cybercrime.gov.in. Keep screenshots and transaction details ready. Never pay anyone who offers to \"recover\" your money.",
    learn: ["The first steps after a scam", "What details to keep ready", "How to avoid being scammed twice"],
    sections: [
      { h: "Step 1: act fast", p: [
        "Speed matters. Contact your bank right away through its official app, branch or the number on your card, and tell them what happened. If you shared your PIN, OTP or password yourself, you bear the loss until you report it, so every minute counts.",
        "Do not feel ashamed. Scammers are professionals. Reporting quickly is what helps."] },
      { h: "Step 2: 1930 and the portal", p: [
        "Call <strong>1930</strong>, the national helpline for cyber financial fraud, run with the Indian Cyber Crime Coordination Centre (I4C) with support from RBI and banks. Then report at <strong>cybercrime.gov.in</strong>, the national portal. Reporting helps authorities trace where the money went and may help stop it from moving further.",
        "No one can promise that money will come back. Report as fast as you can and follow the bank's guidance."] },
      { h: "Step 3: keep the proof", p: [
        "Have these ready: the bank or UPI app used, the transaction ID or UTR number, the date and time, the amount, and the scammer's phone number, website or profile. Take screenshots of messages and do not delete them. Then change your passwords and PINs."] },
      { h: "Step 4: beware of the second scam", p: [
        "After a fraud, \"recovery agents\" may contact you and ask for a fee. This is often a second scam. Use only official channels."] }
    ],
    example: { title: "Worked example: a ₹5,000 loss", steps: [
      "7:00 pm: ₹5,000 leaves your account after you approve a fake request. Balance falls from ₹12,000 to ₹7,000.",
      "7:05 pm: you call your bank through the number on your card and report the unauthorised transaction.",
      "7:10 pm: you call 1930 with the details: UPI app, UTR number, 7:00 pm, ₹5,000, scammer's number.",
      "Later: you file a report at cybercrime.gov.in and keep screenshots.",
      "Compare: waiting two days would let the money move further, so the faster you report, the better the chances. Outcomes are never guaranteed."] },
    india: "Leela clicks a fake link and loses ₹3,000 in a minute. Instead of hiding it, she calls her bank, then 1930, and files on cybercrime.gov.in the same evening. She also tells her family so they know about the trick.",
    mistakes: ["Waiting a day to see if the money comes back", "Deleting messages that are your evidence", "Paying a stranger who offers to recover your money"],
    takeaways: ["Tell your bank at once", "Call 1930 and file at cybercrime.gov.in", "Keep transaction ID, time, amount and scammer details", "Never pay a \"recovery agent\""],
    links: [["RBI Kehta Hai: cautions", "https://rbikehtahai.rbi.org.in/rbi-cautions.html"], ["Cyber crime reporting portal", "https://cybercrime.gov.in"]],
    quiz: [
      { q: "Your first move after losing money to fraud?", o: ["Contact your bank at once", "Wait a week", "Post on social media", "Pay a recovery agent"], a: 0, why: "Quick contact with the bank limits the damage." },
      { q: "The national cyber fraud helpline is...", o: ["100", "1930", "108", "1800"], a: 1, why: "1930 is the national helpline for cyber financial fraud." },
      { q: "Which detail helps when reporting?", o: ["Transaction ID or UTR", "Your monthly income", "Your branch's opening hours", "Nothing"], a: 0, why: "The transaction ID, date, time and amount help trace the money." },
      { q: "A stranger offers to recover your lost money for a fee. This is...", o: ["A good idea", "Official", "Likely a second scam", "Free"], a: 2, why: "Recovery agents asking for a fee are often another scam." }
    ]
  },

  // ===================== Module 5: Compounding =====================
  {
    id: "5-1", module: 5, title: "Simple vs Compound Interest",
    hook: "Two schemes can pay the same rate yet end up far apart. The difference is interest on interest.",
    summary: "Simple interest is paid only on your original amount. Compound interest is paid on your original amount plus the interest already added, so growth speeds up over time.",
    learn: ["How simple interest is worked out", "How compound interest is worked out", "Why the gap grows with time"],
    sections: [
      { h: "Interest in one line", p: [
        "<strong>Interest</strong> is the price of using money. A bank pays you interest for keeping money with it, and charges you interest for lending to you. The original amount is the <strong>principal</strong>."] },
      { h: "Simple interest", p: [
        "<strong>Simple interest</strong> is calculated only on the principal. The formula is: Interest = P × r × t, where P is the principal, r is the yearly rate and t is the years. Each year's interest is the same."] },
      { h: "Compound interest", p: [
        "With <strong>compound interest</strong>, each year's interest is added to the principal, and the next year's interest is calculated on the bigger amount. Formula: A = P × (1 + r)ᵗ for yearly compounding. This is why it is called interest on interest.",
        "The gap is small at first and grows large. The longer the time, the bigger the difference."] }
    ],
    example: { title: "Worked example: ₹10,000 at 8% a year", steps: [
      "Simple, 5 years: 10,000 × 8% = ₹800 a year. 5 × 800 = ₹4,000. Total ₹14,000.",
      "Compound, year by year: Year 1: 10,000 × 1.08 = ₹10,800. Year 2: ₹11,664. Year 3: ₹12,597. Year 4: ₹13,605. Year 5: ₹14,693.",
      "Difference after 5 years: 14,693 − 14,000 = ₹693.",
      "After 20 years: simple = 10,000 + 20 × 800 = ₹26,000; compound = 10,000 × 1.08²⁰ ≈ ₹46,610.",
      "The 8% is an example. Real rates change, and no return is guaranteed."] },
    india: "Dev's grandfather says his first FD \"doubled and then doubled again\" without him adding a rupee. That is compounding: the interest was added back and also earned interest.",
    mistakes: ["Assuming both kinds give the same amount", "Forgetting to compare how often interest is added", "Taking an example rate as a promise"],
    takeaways: ["Simple interest = P × r × t, on the principal only", "Compound interest is earned on principal plus past interest", "The gap grows the longer money stays invested", "Borrowing with compound interest works against you too"],
    links: [["SEBI investor site: Money Matters", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "Simple interest is paid on...", o: ["Principal only", "Principal and past interest", "Nothing", "Only the interest"], a: 0, why: "Simple interest uses only the original amount." },
      { q: "₹10,000 at 8% simple for 5 years gives a total of...", o: ["₹14,693", "₹18,000", "₹10,800", "₹14,000"], a: 3, why: "10,000 + 5 × 800 = ₹14,000." },
      { q: "Compound interest means interest earned on...", o: ["Only the principal", "Principal plus earlier interest", "Taxes", "Nothing"], a: 1, why: "It is interest on interest." },
      { q: "Why does the gap between simple and compound grow?", o: ["Interest keeps being added to the base", "Banks change rules", "Prices rise", "It does not grow"], a: 0, why: "Each year's base is larger under compounding." }
    ]
  },
  {
    id: "5-2", module: 5, title: "The Rule of 72 and Starting Early",
    hook: "A quick calculation in your head can tell you roughly how long money takes to double.",
    summary: "The Rule of 72 says: years to double is about 72 divided by the yearly rate. It is only an estimate. It shows why a small difference in rate, or a few extra years of time, can matter a lot.",
    learn: ["How to use the Rule of 72", "What a doubling means over many years", "Why starting early helps"],
    sections: [
      { h: "A mental shortcut", p: [
        "The <strong>Rule of 72</strong> is a rough shortcut: divide 72 by the yearly rate, and you get the approximate years for money to double with compounding. At 8% a year, 72 ÷ 8 = 9 years. At 6%, 72 ÷ 6 = 12 years. At 9%, 72 ÷ 9 = 8 years.",
        "It is an estimate, not a promise. Real rates change, and some investments can lose value."] },
      { h: "Doubling stacks up", p: [
        "If money doubles every 9 years, it does not just double once. It doubles again from the new amount. ₹10,000 becomes ₹20,000, then ₹40,000, then ₹80,000, as long as the same rate holds. Each doubling is bigger than the last."] },
      { h: "Why starting early matters", p: [
        "Each extra doubling needs time. Someone who starts 9 years earlier gets one more doubling at the end, and that last one is the biggest. This is why even small amounts started early can end up larger than bigger amounts started late."] }
    ],
    example: { title: "Worked example: starting at 20 or at 29", steps: [
      "Assume about 8% a year (an example). Doubling time: 72 ÷ 8 = 9 years.",
      "Start at 20 with ₹10,000: age 29 → ₹20,000; age 38 → ₹40,000; age 47 → ₹80,000.",
      "Start at 29 with the same ₹10,000: age 38 → ₹20,000; age 47 → ₹40,000.",
      "At 47 the early starter has about ₹80,000 and the late starter about ₹40,000. Nine years of waiting halved the result.",
      "Exact maths: 10,000 × 1.08²⁷ ≈ ₹79,900, so the shortcut is close."] },
    india: "Tara's uncle says, \"I'll start saving when I earn more.\" Tara starts with a small amount at 20. By the time her uncle starts, her money has already doubled once, and has years left to double again.",
    mistakes: ["Treating the Rule of 72 as exact or guaranteed", "Waiting for the \"right time\" or a bigger amount", "Using it with very high promised rates without asking if they are realistic"],
    takeaways: ["Years to double ≈ 72 ÷ yearly rate", "Doubling stacks: each one is bigger", "Time is the key ingredient", "Rates here are examples only"],
    links: [["SEBI investor site: Money Matters", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "At 6% a year, money doubles in about...", o: ["6 years", "12 years", "72 years", "3 years"], a: 1, why: "72 ÷ 6 = 12 years." },
      { q: "The Rule of 72 is...", o: ["An exact law", "A bank rule", "A rough estimate", "A tax rule"], a: 2, why: "It is a quick estimate, not exact." },
      { q: "₹10,000 doubling twice becomes...", o: ["₹20,000", "₹30,000", "₹80,000", "₹40,000"], a: 3, why: "10,000 → 20,000 → 40,000." },
      { q: "Starting 9 years earlier (at about 8%) gives...", o: ["Nothing extra", "One extra doubling", "A guaranteed profit", "Lower results"], a: 1, why: "9 years is about one doubling period at 8%." }
    ]
  },
  {
    id: "5-3", module: 5, title: "Time Beats Amount",
    hook: "Who ends up with more: someone who invests a little for 10 years, or someone who invests three times as much for 30?",
    summary: "Compounding rewards time more than size. A small amount invested early can grow larger than a bigger amount invested later. These are illustrations with assumed rates, not promises.",
    learn: ["Why early money does more work", "How to compare two saving plans", "Why the habit matters more than the amount"],
    sections: [
      { h: "A fair comparison", p: [
        "Imagine two friends. Asha invests ₹1,000 a month from age 20 to 30, then stops and leaves it. Bala waits until age 30 and invests ₹1,000 a month until age 60. Asha pays in for 10 years, Bala for 30. Who ends up with more at 60?",
        "For this example we assume 8% a year, added every month. Real returns will differ, and nothing is guaranteed."] },
      { h: "Why early money wins", p: [
        "Asha's money has 40 years of compounding for the first rupee and 30 years for the last. Bala's first rupee has 30 years, and his last has only a few months. Early rupees do the most work because they have the most time to earn interest on interest."] },
      { h: "What this teaches", p: [
        "It does not mean Bala should not start; starting late is far better than never. It means the best time to begin is now, even with a small amount, and that consistency matters. Do not take risks to \"catch up\"."] }
    ],
    example: { title: "Worked example: Asha versus Bala at 8% a year", steps: [
      "Monthly rate = 8% ÷ 12 ≈ 0.667%.",
      "Asha, ages 20-30: 120 payments of ₹1,000 = ₹1,20,000 paid. Value at 30 ≈ ₹1.83 lakh.",
      "From 30 to 60 her money just grows: ₹1.83 lakh grows about 10.9 times in 30 years → about ₹20 lakh.",
      "Bala, ages 30-60: 360 payments = ₹3,60,000 paid. Value at 60 ≈ ₹14.9 lakh.",
      "Asha paid in ₹1.2 lakh and ends with about ₹20 lakh; Bala paid in ₹3.6 lakh and ends with about ₹14.9 lakh. These are illustrations at an assumed rate."] },
    india: "Riya starts a tiny ₹500 monthly habit at 20 while her cousin says, \"I'll begin with ₹5,000 when I get a big job.\" Ten years later, Riya's habit is solid and her money has had a decade of compounding. Her cousin has not started.",
    mistakes: ["Waiting for a big amount before starting", "Taking high risk to catch up for lost time", "Treating an assumed rate as a promise"],
    takeaways: ["Time has more power than amount", "Early money earns interest for the longest", "Starting small is better than not starting", "All rates here are examples, not promises"],
    links: [["SEBI investor site: Money Matters", "https://investor.sebi.gov.in/moneymatters-inc-exp.html"]],
    quiz: [
      { q: "Why does early money do more work?", o: ["It has more time to compound", "It is bigger", "Banks prefer it", "It is tax-free"], a: 0, why: "More years mean more interest on interest." },
      { q: "In the example, who paid in less but ended with more?", o: ["Asha", "Bala", "Both equal", "Neither"], a: 0, why: "Asha paid in ₹1.2 lakh and ended with more." },
      { q: "Should someone who started late give up?", o: ["Yes", "No, starting now still helps", "Take big risks", "Borrow to invest"], a: 1, why: "Starting late is still better than never; avoid taking big risks to catch up." },
      { q: "The 8% rate in the example is...", o: ["Guaranteed", "An assumption for illustration", "Bank law", "Always available"], a: 1, why: "Real returns vary, and nothing is guaranteed." }
    ]
  },

  // ===================== Module 6: Safe Savings =====================
  {
    id: "6-1", module: 6, title: "Fixed Deposits (FD)",
    hook: "An FD is a deal with the bank: you promise to leave your money alone, and the bank promises a fixed interest rate.",
    summary: "In a fixed deposit you lock a sum with a bank for a fixed time and earn a fixed rate of interest. Breaking it early is usually allowed, but the bank may charge a penalty and pay a lower rate. FDs are covered by deposit insurance up to ₹5 lakh per depositor per bank.",
    learn: ["How an FD works and why the rate is fixed", "What happens if you break it early", "How FD interest compares with a savings account"],
    sections: [
      { h: "How an FD works", p: [
        "A <strong>fixed deposit (FD)</strong> lets you put a lump sum in a bank for a chosen period, called the <strong>tenure</strong>, such as one year. The bank agrees to pay a fixed <strong>interest rate</strong> for that time, so you know in advance what you will earn. When the FD <strong>matures</strong>, which means the period ends, you get your money plus interest.",
        "RBI guidance says interest on deposits is paid at quarterly or longer intervals. In many FDs, the interest is added to the deposit and paid at the end."] },
      { h: "Why the bank pays more than a savings account", p: [
        "In a savings account you can withdraw any time, so the bank cannot count on that money. In an FD the bank knows it can use your money for the whole period, so it usually pays a higher rate. You give up easy access and get a higher, predictable rate in return."] },
      { h: "Breaking an FD early", p: [
        "RBI says banks may not normally refuse early withdrawal of an individual's term deposit, but they may charge a <strong>penalty</strong>, and early closure usually pays a lower interest rate. So an FD is for money you will not need soon, and your <strong>emergency fund</strong> should stay in an easy-to-reach place.",
        "Like other deposits, FDs are insured by DICGC up to ₹5 lakh per depositor per bank, principal and interest together."] }
    ],
    example: { title: "Worked example: ₹10,000 in an FD", steps: [
      "Suppose an FD pays about 7% a year (an example; real rates change).",
      "1 year, interest paid at the end: ₹10,000 × 7% = ₹700. You get ₹10,700.",
      "3 years, with interest added back each year: ₹10,000 × 1.07 × 1.07 × 1.07 ≈ ₹12,250.",
      "A savings account at about 3% would give ₹300 in the first year, so the FD earns ₹400 more.",
      "If you break it after 6 months and the bank pays a lower rate, say 5%: ₹10,000 × 5% × ½ = ₹250, instead of ₹350 at 7%, and a penalty may apply too."] },
    india: "Nisha gets ₹10,000 from Diwali gifts and does not need it for a year. She puts it in a one-year FD instead of leaving it in her wallet. Six months later her phone breaks. Because she has a separate emergency fund, she does not have to break the FD.",
    mistakes: ["Locking money you may need within the year", "Assuming an early break costs nothing", "Treating an example rate as today's rate"],
    takeaways: ["An FD locks money for a fixed time at a fixed rate", "Breaking early may bring a penalty and a lower rate", "Interest is paid at quarterly or longer intervals", "Deposits are insured up to ₹5 lakh per depositor per bank"],
    links: [["RBI FAQ: term deposits and premature withdrawal", "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=325"], ["DICGC guide to deposit insurance", "https://www.dicgc.org.in/guide-to-deposit-insurance"]],
    quiz: [
      { q: "An FD pays...", o: ["A rate that changes daily", "No interest", "A fixed rate for a fixed time", "A guaranteed 20%"], a: 2, why: "The rate is agreed in advance for the whole tenure." },
      { q: "If you break an FD early, the bank may...", o: ["Give a bonus", "Double your money", "Refuse always", "Charge a penalty and pay a lower rate"], a: 3, why: "Early closure usually pays less, and a penalty may apply." },
      { q: "₹10,000 at 7% for one year (interest at the end) gives...", o: ["₹10,700", "₹10,070", "₹17,000", "₹10,007"], a: 0, why: "7% of ₹10,000 is ₹700, so the total is ₹10,700." },
      { q: "Matures means...", o: ["The bank closed", "The FD period has ended", "Rates fell", "You must pay tax"], a: 1, why: "At maturity you get back the money plus interest." }
    ]
  },
  {
    id: "6-2", module: 6, title: "Recurring Deposits (RD)",
    hook: "Cannot lock a big sum? A recurring deposit lets you build one, a small amount at a time.",
    summary: "In a recurring deposit you put in a fixed amount every month for a fixed period, and the bank pays interest. It builds the saving habit and suits goals with a known date.",
    learn: ["How an RD works", "How to estimate what an RD gives", "When an RD fits better than an FD"],
    sections: [
      { h: "A monthly habit with interest", p: [
        "A <strong>recurring deposit (RD)</strong> is a deposit where you pay a fixed amount every month for a fixed period. For example, SBI offers tenures from 12 months to 120 months. At the end, you receive all your deposits plus interest.",
        "Think of it as an FD that you fill slowly. You do not need a big sum on day one."] },
      { h: "Why it works", p: [
        "An RD turns saving into an automatic rule: the same date, the same amount. This is the \"pay yourself first\" idea in practice. It is useful for goals with a date, such as a bike, a course fee or a trip next year."] },
      { h: "What to remember", p: [
        "Each instalment earns interest only from the day it is deposited, so the first instalment earns the most and the last earns very little. Choose an amount you can keep paying every month. As with FDs, breaking early may bring a penalty and a lower rate. RDs are also covered by deposit insurance within the ₹5 lakh limit."] }
    ],
    example: { title: "Worked example: ₹1,000 a month for 12 months", steps: [
      "Total you deposit: 12 × ₹1,000 = ₹12,000.",
      "Suppose the rate is about 7% a year (an example).",
      "A simple estimate: the first instalment earns for 12 months, the second for 11, and so on down to 1 month. That is 12 + 11 + ... + 1 = 78 instalment-months.",
      "Interest ≈ ₹1,000 × 78 × (7% ÷ 12) ≈ ₹455.",
      "Maturity ≈ ₹12,000 + ₹455 = ₹12,455. Banks add interest in their own way, so the real figure differs a little."] },
    india: "Dev wants a ₹12,000 second-hand bike next year. He starts a ₹1,000 monthly RD on salary day. Twelve months later he has about ₹12,400 and buys the bike without a loan.",
    mistakes: ["Choosing an instalment you cannot keep paying", "Breaking the RD early for a want", "Expecting the total interest to look like an FD of the full amount"],
    takeaways: ["RD = fixed amount every month for a fixed period", "It builds a saving habit", "Early instalments earn interest for longer", "It suits goals with a known date"],
    links: [["SBI: recurring deposit", "https://sbi.co.in/portal/web/personal-banking/recurring-deposit"], ["RBI FAQ: term deposits", "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=325"]],
    quiz: [
      { q: "In an RD you deposit...", o: ["One lump sum", "Whatever you like, never", "A fixed amount every month", "Only on festivals"], a: 2, why: "An RD is a fixed monthly deposit for a fixed period." },
      { q: "₹1,000 a month for 12 months means you deposit...", o: ["₹1,000", "₹6,000", "₹13,000", "₹12,000"], a: 3, why: "12 × ₹1,000 = ₹12,000." },
      { q: "Which instalment earns interest for the longest?", o: ["The first", "The last", "All the same", "None"], a: 0, why: "The first instalment stays in the bank for the whole period." },
      { q: "An RD is good for...", o: ["Sudden emergencies you cannot plan for", "Goals with a known date", "Guaranteed 20%", "Buying shares"], a: 1, why: "A fixed schedule suits planned goals." }
    ]
  },
  {
    id: "6-3", module: 6, title: "PPF, and Risk versus Return",
    hook: "Why does a long, safe scheme pay less than a risky one? Because risk and return travel together.",
    summary: "PPF is a 15-year government-backed saving scheme with a rate revised every quarter. In general, higher possible returns come with higher risk, and anyone promising a very high guaranteed return should make you careful.",
    learn: ["What PPF is and how it works", "What risk and return mean", "How to spot an unrealistic promise"],
    sections: [
      { h: "The Public Provident Fund", p: [
        "<strong>PPF</strong> is a government-backed scheme with a 15-year tenure that can be extended in 5-year blocks. India Post's scheme document says the rate is revised every quarter, and interest is compounded yearly. Non-official sources say you can deposit between ₹500 and ₹1.5 lakh a year, and that its interest is currently tax-free. Rules can change, so check the latest on the official site before you act."] },
      { h: "Risk and return", p: [
        "<strong>Return</strong> is what you gain from money; <strong>risk</strong> is the chance you gain less than hoped or lose some. Generally, safer options such as deposits and PPF pay lower, more predictable returns. Options that can pay more, such as shares, can also fall in value.",
        "That is why safety and growth are a trade-off. Money for emergencies and near goals belongs in safe places; money for goals many years away can accept some risk."] },
      { h: "Be careful with big promises", p: [
        "SEBI advises being suspicious of anyone who promises assured or guaranteed returns. A high, guaranteed return is a classic sign of a scam. If it were safe and high, everyone would already be doing it."] }
    ],
    example: { title: "Worked example: ₹500 a month in PPF", steps: [
      "₹500 × 12 = ₹6,000 a year, for 15 years: you deposit 15 × ₹6,000 = ₹90,000.",
      "Assume about 7% a year, compounded yearly (an example; the real rate is revised every quarter).",
      "Value ≈ ₹6,000 × ((1.07¹⁵ − 1) ÷ 0.07) = ₹6,000 × 25.13 ≈ ₹1,50,800.",
      "Interest earned ≈ ₹1,50,800 − ₹90,000 = ₹60,800.",
      "If the rate is lower, the result is lower. Nothing here is a promise."] },
    india: "Meera's parents open a PPF account for her. A distant relative says, \"Put it in my scheme, it pays 20% guaranteed.\" Meera remembers that a safe 20% does not exist, says no, and keeps the PPF going.",
    mistakes: ["Putting money you need soon into a 15-year scheme", "Believing a \"guaranteed\" high return", "Using an old rate as today's rate"],
    takeaways: ["PPF: 15 years, rate revised every quarter", "Higher possible return usually means higher risk", "Safe tools pay less but more predictably", "Be suspicious of guaranteed high returns"],
    links: [["India Post: Public Provident Fund Scheme", "https://www.indiapost.gov.in/documents/offerings/schemesandservices/posb/PublicProvidentFundScheme2019English.pdf"], ["SEBI: how to spot a scam", "https://investor.sebi.gov.in/spot-any-scam.html"]],
    quiz: [
      { q: "PPF has a tenure of...", o: ["1 year", "5 years", "15 years", "50 years"], a: 2, why: "PPF runs for 15 years and can be extended in 5-year blocks." },
      { q: "Generally, higher possible returns come with...", o: ["No risk", "A free gift", "Lower tax", "Higher risk"], a: 3, why: "Risk and return travel together." },
      { q: "Someone promises a guaranteed 20% a year. You should...", o: ["Be very suspicious", "Invest all savings", "Tell all your friends", "Borrow to invest"], a: 0, why: "SEBI says to be suspicious of assured or guaranteed returns." },
      { q: "Who revises the PPF rate every quarter?", o: ["Your bank manager", "The government", "A friend", "The stock exchange"], a: 1, why: "The government sets the PPF rate and revises it every quarter." }
    ]
  },

  // ===================== Module 7: Borrowing and Credit =====================
  {
    id: "7-1", module: 7, title: "EMI: How a Loan Really Costs",
    hook: "An EMI looks small each month. The real question is what the whole loan costs.",
    summary: "An EMI is a fixed monthly payment that covers some principal and some interest. Interest is charged on the outstanding balance, so early EMIs are mostly interest. Always compare the total you will pay with the price.",
    learn: ["What an EMI is made of", "How interest falls as the balance falls", "How to compare the total cost"],
    sections: [
      { h: "What an EMI is", p: [
        "An <strong>EMI</strong> (Equated Monthly Instalment) is a fixed amount you pay every month to repay a <strong>loan</strong>. Each EMI has two parts: some <strong>principal</strong> (the amount you borrowed) and some interest (the price of borrowing)."] },
      { h: "Reducing balance", p: [
        "RBI explains that on a reducing-balance loan, each month's principal part reduces what you still owe, and interest is worked out on the new, lower balance. So early EMIs are mostly interest, and later ones are mostly principal, even though the EMI stays the same."] },
      { h: "Look at the total", p: [
        "A small EMI can hide a big cost. Multiply the EMI by the number of months and compare it with the price. RBI also requires lenders to give a Key Facts Statement, a plain-language summary of the loan, including the APR, which is the yearly cost of credit with interest and all other charges. Read it before you sign.",
        "RBI also says a \"no-cost\" or \"zero-interest\" EMI must not hide an interest component. Check the total anyway."] }
    ],
    example: { title: "Worked example: a ₹12,000 phone for 12 months", steps: [
      "Suppose the loan rate is about 12% a year, so 1% a month (an example).",
      "Formula: EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), with P = ₹12,000, r = 0.01, n = 12.",
      "(1.01)¹² ≈ 1.1268, so EMI ≈ 12,000 × 0.01 × 1.1268 ÷ 0.1268 ≈ ₹1,066.",
      "Total paid: 12 × ₹1,066 ≈ ₹12,794. The extra cost is about ₹794.",
      "Month 1: interest = 1% × ₹12,000 = ₹120, so principal paid = ₹1,066 − ₹120 = ₹946, and the balance falls to ₹11,054."] },
    india: "Arjun sees a phone at \"₹1,100 a month\". He multiplies: 12 × ₹1,100 = ₹13,200, while the tag price is ₹12,000. The ₹1,200 difference is what the loan costs. He decides whether the phone is worth the extra.",
    mistakes: ["Looking only at the monthly figure", "Taking an EMI for a want without checking the total", "Missing an EMI, which can hurt your credit score"],
    takeaways: ["EMI = principal part + interest part", "Interest is charged on the outstanding balance", "Early EMIs are mostly interest", "Compare total paid with the price"],
    links: [["RBI FAQ: home loans and EMI", "https://www.rbi.org.in/commonperson/english/scripts/FAQs.aspx?Id=701"], ["RBI: Key Facts Statement for loans", "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0"]],
    quiz: [
      { q: "An EMI covers...", o: ["Only interest", "Principal and interest", "Only a fee", "Nothing"], a: 1, why: "Each EMI repays some principal and pays some interest." },
      { q: "On a reducing-balance loan, interest is charged on...", o: ["The original loan always", "The outstanding balance", "Your income", "Nothing"], a: 1, why: "As the balance falls, the interest part falls." },
      { q: "12 EMIs of ₹1,100 for a ₹12,000 phone cost an extra...", o: ["₹0", "₹12,000", "₹1,200", "₹100"], a: 2, why: "12 × ₹1,100 = ₹13,200, and 13,200 − 12,000 = ₹1,200." },
      { q: "What does APR show?", o: ["Only the monthly EMI", "The lender's profit", "Your score", "The loan's yearly cost with interest and charges"], a: 3, why: "APR is the annual cost of credit including interest and all other charges." }
    ]
  },
  {
    id: "7-2", module: 7, title: "Credit Cards",
    hook: "A credit card is not free money. It is a loan that you take, a swipe at a time.",
    summary: "A credit card lets you spend borrowed money. If you pay the full bill by the due date you avoid interest. If you pay less, interest is charged on the outstanding amount, and paying only the minimum keeps the balance alive longer.",
    learn: ["How a credit card works", "What happens if you pay only part of the bill", "Habits that keep a card safe"],
    sections: [
      { h: "Borrowing with a swipe", p: [
        "A <strong>credit card</strong> lets you buy now and pay later, up to a <strong>credit limit</strong>. The limit is the most you can borrow, not money you own. When you pay the full bill by the due date, you normally pay nothing extra."] },
      { h: "When you pay only part", p: [
        "RBI's rules explain that if you do not clear the full bill by the due date, the interest-free period is lost, and interest is charged on the amount still outstanding. Late fees apply on the outstanding amount after the due date. Every statement must also warn that paying only the <strong>minimum due</strong> keeps the balance outstanding longer and increases interest.",
        "The minimum due is the smallest payment that avoids a late-payment penalty. It is not the amount that clears your debt."] },
      { h: "Smart habits", p: [
        "Only spend what you could pay in full. Track your card spends like any other spends. Set a reminder or auto-pay for the full amount, and keep your card details private. Late payments and high borrowing can lower your credit score."] }
    ],
    example: { title: "Worked example: an ₹8,000 bill", steps: [
      "Your bill is ₹8,000. The minimum due is ₹400.",
      "Option A: pay ₹8,000 in full. You owe nothing more and no interest is added.",
      "Option B: pay ₹400. Paying less than the full bill means interest is usually charged on the outstanding ₹7,600, and the interest-free period is lost.",
      "Suppose the card charges 3% a month (a made-up figure). Interest for the first month ≈ 3% × ₹7,600 = ₹228.",
      "Next month you would owe about ₹7,600 + ₹228 = ₹7,828 before any new spends. Real card rates vary, so read your card's terms."] },
    india: "Kabir gets his first card with a ₹30,000 limit. His friend says, \"Use the full limit, you can always pay later.\" Kabir keeps spending to what he can pay in full each month and sets a reminder for the due date.",
    mistakes: ["Treating the limit as extra income", "Paying only the minimum every month", "Forgetting the due date"],
    takeaways: ["A card is borrowed money", "Pay the full bill by the due date", "Partial payment loses the interest-free period", "Minimum due is not the amount that clears your debt"],
    links: [["RBI FAQ: credit card and debit card", "https://www.rbi.org.in/commonperson/english/Scripts/FAQs.aspx?Id=3580"]],
    quiz: [
      { q: "A credit limit is...", o: ["The most you can borrow", "Your money", "Your score", "A gift"], a: 0, why: "It is a borrowing ceiling, not money you own." },
      { q: "If you pay only the minimum due...", o: ["The debt disappears", "The balance stays and interest is usually charged", "You get a bonus", "Nothing changes"], a: 1, why: "Paying less than the full bill means interest is usually charged on the outstanding amount and the interest-free period is lost. Read your card's terms." },
      { q: "How can you avoid interest on a card?", o: ["Pay the minimum", "Pay the full bill by the due date", "Ignore the bill", "Use it more"], a: 1, why: "Paying in full by the due date normally avoids interest." },
      { q: "Late payments and high borrowing can...", o: ["Raise your score", "Do nothing", "Lower your credit score", "Remove your debt"], a: 2, why: "Both can lower your score." }
    ]
  },
  {
    id: "7-3", module: 7, title: "Your CIBIL Score",
    hook: "Before a bank lends you money, it asks a simple question: do you pay people back on time?",
    summary: "A credit score from 300 to 900 summarises how reliably you repay. Paying EMIs and card bills on time helps; late payments and high borrowing hurt. You can get one free full credit report every year.",
    learn: ["What a credit score and a credit bureau are", "What raises and lowers a score", "How to check your free report"],
    sections: [
      { h: "What it is", p: [
        "A <strong>credit score</strong> is a number from 300 to 900 that shows how reliably you repay borrowed money. A higher number is better. <strong>CIBIL</strong> is one of the credit bureaus authorised by RBI. A <strong>credit bureau</strong> collects information about your loans and card payments from lenders and prepares your <strong>credit report</strong>."] },
      { h: "What moves it", p: [
        "Paying EMIs and card bills on time helps your score. Late payments and high borrowing lower it. There is no official name for score bands, and lenders set their own cut-offs. For example, 750 or above is often seen as comfortable, but this is only an example.",
        "A score is built over time with steady habits. Be careful about anyone who promises to fix it instantly for a fee."] },
      { h: "Your free report", p: [
        "RBI requires credit bureaus to give you one free full credit report each calendar year, and it includes your score. Check it for mistakes, such as a loan you never took. If you find an error, tell the lender and the bureau."] }
    ],
    example: { title: "Worked example: borrowing against a limit", steps: [
      "Priya's card limit is ₹30,000.",
      "Month A: she uses ₹6,000. That is 6,000 ÷ 30,000 = 20% of her limit.",
      "Month B: she uses ₹28,000. That is 28,000 ÷ 30,000 ≈ 93% of her limit.",
      "High borrowing can lower a score, so Month B looks riskier to a lender than Month A.",
      "If she pays Month B's bill late too, the effect is worse. Paying on time and using only a part of the limit are both good signs."] },
    india: "Rohan applies for a ₹60,000 bike loan. The bank checks his credit report and sees on-time EMIs on his earlier phone loan. A good record gives lenders confidence. He also checks his free yearly report to be sure it has no mistakes.",
    mistakes: ["Missing due dates", "Using almost the full card limit every month", "Never checking the report for errors"],
    takeaways: ["Scores run from 300 to 900; higher is better", "On-time payments help; late payments and high borrowing hurt", "Lenders set their own cut-offs", "One free full report per calendar year"],
    links: [["CIBIL: free credit score", "https://www.cibil.com/freecibilscore"], ["RBI: free credit report notification", "https://www.rbi.org.in/commonman/english/scripts/Notification.aspx?Id=1884"]],
    quiz: [
      { q: "Credit scores run from...", o: ["0 to 100", "1 to 10", "100 to 500", "300 to 900"], a: 3, why: "A credit score ranges from 300 to 900." },
      { q: "What helps your score?", o: ["Paying on time", "Paying late", "Borrowing the maximum", "Ignoring bills"], a: 0, why: "On-time EMIs and card payments help." },
      { q: "How many free full credit reports can you get each calendar year?", o: ["None", "One", "Twelve", "Unlimited"], a: 1, why: "RBI requires one free full report each calendar year." },
      { q: "A website promises to fix your score in 3 days for a fee. You should...", o: ["Pay at once", "Share your OTP", "Be careful; scores build over time", "Borrow more"], a: 2, why: "A score reflects habits over time, and quick fixes are suspect." }
    ]
  },

  // ===================== Module 8: Stocks =====================
  {
    id: "8-1", module: 8, title: "What a Share Is",
    hook: "Owning a share means owning a small slice of a real business.",
    summary: "A share is a part-ownership of a company. Shareholders may receive dividends and may vote, but the price can go up and down and nobody can promise a rise.",
    learn: ["What a share represents", "What a dividend is", "Why prices move and why that matters"],
    sections: [
      { h: "A slice of a company", p: [
        "A company is divided into many equal slices called <strong>shares</strong>. If you own one, you are part-owner of the company, a very small one. NSE explains that shareholders may receive a part of profits and may vote on certain matters."] },
      { h: "Dividends", p: [
        "A <strong>dividend</strong> is a share of a company's profit paid to its shareholders. A company may pay one, pay less, or pay none, so it is never certain."] },
      { h: "Why prices change", p: [
        "A share's price goes up when more people want to buy it than sell it, and down when the opposite happens. News about the company, the economy and people's moods all affect the price. This shifting is called <strong>volatility</strong>.",
        "Because prices move, a share can be worth less than you paid, and nobody can promise it will rise. Only invest money you can leave alone for years, and never money you need for emergencies."] }
    ],
    example: { title: "Worked example: 10 shares", steps: [
      "A company has 1,000 shares in total. You buy 10 shares at ₹200 each: 10 × ₹200 = ₹2,000.",
      "You own 10 ÷ 1,000 = 1% of the company.",
      "If the price rises to ₹230: 10 × ₹230 = ₹2,300, a gain of ₹300 on paper.",
      "If it falls to ₹170: 10 × ₹170 = ₹1,700, a loss of ₹300 on paper.",
      "If the company pays a ₹3 dividend per share, you receive 10 × ₹3 = ₹30. All numbers are made up."] },
    india: "Anil buys a few shares of a large company through a registered broker. He gets a notice about a shareholder vote and reads it. He knows his shares can fall as well as rise, so he treats them as money for the long term only.",
    mistakes: ["Thinking a share is a sure thing", "Investing money needed for emergencies", "Judging a company only by its price"],
    takeaways: ["A share is part-ownership of a company", "Shareholders may get dividends and may vote", "Share prices go up and down", "No one can promise a rise"],
    links: [["NSE: first-time investor guide", "https://www.nseindia.com/static/invest/first-time-investor-getting-started"], ["BSE: investor services", "https://www.bseindia.com/static/investors/services.aspx"]],
    quiz: [
      { q: "A share is...", o: ["A loan to the company", "A bank account", "A tax", "Part-ownership of a company"], a: 3, why: "A share makes you a part-owner." },
      { q: "A dividend is...", o: ["A share of profit paid to shareholders, not guaranteed", "A fee", "A loan", "A fine"], a: 0, why: "Companies may pay dividends, but they can also pay less or none." },
      { q: "You own 10 of 1,000 shares. Your ownership is...", o: ["10%", "1%", "0.1%", "100%"], a: 1, why: "10 ÷ 1,000 = 1%." },
      { q: "Can anyone promise a share will rise?", o: ["Yes, experts", "Yes, friends", "No, nobody", "Yes, apps"], a: 2, why: "Share prices move both ways and nobody can promise a rise." }
    ]
  },
  {
    id: "8-2", module: 8, title: "Exchanges, Sensex and Nifty",
    hook: "News says, \"Sensex is up 300 points.\" What does that actually tell you?",
    summary: "Shares are traded on stock exchanges such as NSE and BSE through a SEBI-registered broker. Nifty 50 tracks 50 large NSE companies and Sensex tracks 30 large BSE companies, giving a quick picture of the market.",
    learn: ["What a stock exchange does", "How you buy shares", "What Sensex and Nifty are"],
    sections: [
      { h: "Where shares are traded", p: [
        "A <strong>stock exchange</strong> is a marketplace where buyers and sellers of shares meet. India's two main exchanges are the <strong>NSE</strong> (National Stock Exchange) and the <strong>BSE</strong> (Bombay Stock Exchange). The first time a company sells shares to the public is the <strong>IPO</strong>, in the primary market. After that, investors trade among themselves in the secondary market."] },
      { h: "How you buy", p: [
        "You do not walk into the exchange. You buy through a <strong>broker</strong> who is registered with <strong>SEBI</strong>, India's regulator for securities markets. For this you need a bank account and a <strong>trading account</strong>. SEBI also advises dealing only with registered advisers and checking registration on its website."] },
      { h: "Reading an index", p: [
        "An <strong>index</strong> is a number that tracks a group of companies. The <strong>Nifty 50</strong> follows 50 large companies on the NSE. The <strong>Sensex</strong> follows 30 large companies on the BSE. If the Sensex rises, it means those large companies, taken together, have risen. It does not mean every share rose, or that yours did."] }
    ],
    example: { title: "Worked example: a tiny index", steps: [
      "Imagine an index of only three companies, A, B and C, counted equally (real indices are more detailed).",
      "Today A rises 2%, B falls 1% and C rises 4%.",
      "Average change: (2 − 1 + 4) ÷ 3 = 5 ÷ 3 ≈ +1.7%.",
      "So the tiny index is up about 1.7%, though B fell. One number hides differences.",
      "On a day when the index is up 0.5%, a single share in it may be up 5% or down 3%."] },
    india: "Sana's father says, \"Nifty is up today.\" Sana asks, \"Does that mean my one share is up?\" He explains that the Nifty tracks 50 large companies together, so her share may have moved differently.",
    mistakes: ["Thinking an index move means every share moved", "Buying through unregistered \"agents\"", "Confusing IPO (primary) with everyday trading (secondary)"],
    takeaways: ["NSE and BSE are India's main exchanges", "Buy through a SEBI-registered broker with a bank and trading account", "Nifty 50 = 50 large NSE companies; Sensex = 30 large BSE companies", "Indices summarise the market, not your share"],
    links: [["NSE: how to invest in the capital market", "https://www.nseindia.com/static/invest/how-to-invest-in-capital-market"], ["BSE: investor services", "https://www.bseindia.com/static/investors/services.aspx"]],
    quiz: [
      { q: "India's two main stock exchanges are...", o: ["RBI and SEBI", "UPI and NPCI", "SBI and HDFC", "NSE and BSE"], a: 3, why: "NSE and BSE are the two main exchanges." },
      { q: "Sensex follows...", o: ["30 large BSE companies", "50 NSE companies", "All banks", "Your shares"], a: 0, why: "Sensex tracks 30 large companies on the BSE." },
      { q: "To buy shares you use...", o: ["A friend's cash", "A SEBI-registered broker with a trading account", "A phone call", "Any website"], a: 1, why: "Use a registered broker with a bank and trading account." },
      { q: "The first sale of shares to the public is...", o: ["A SIP", "An EMI", "An IPO", "A KYC"], a: 2, why: "It is the Initial Public Offering, in the primary market." }
    ]
  },
  {
    id: "8-3", module: 8, title: "Risk, and Why Not to Chase Tips",
    hook: "\"This share will double next week!\" If it were that easy, nobody would need to tell you.",
    summary: "Shares can fall as well as rise, and a loss needs a bigger gain to recover. Spreading money reduces the damage from any one company. SEBI warns against stock tips from unregistered sources and against anyone promising guaranteed returns.",
    learn: ["Why losses hurt more than gains help", "How spreading money reduces risk", "How to treat tips and promises"],
    sections: [
      { h: "Losses are lopsided", p: [
        "If a share falls 30%, it needs a rise of about 43%, not 30%, to get back to where you started. That is because the gain is calculated on a smaller amount. So big falls are hard to recover from, and big risks deserve respect."] },
      { h: "Do not put everything in one place", p: [
        "<strong>Diversification</strong> means spreading money across several companies. If one falls badly, the others may cushion the blow. It reduces risk but does not remove it, because markets as a whole can fall."] },
      { h: "Tips, and borrowing to invest", p: [
        "SEBI warns investors against acting on stock tips from unregistered people on SMS, websites and social media, and says to be suspicious of anyone promising assured or guaranteed returns. Use only SEBI-registered advisers and check their registration on SEBI's website.",
        "Never borrow to invest. A loan must be repaid whether the share rises or falls."] }
    ],
    example: { title: "Worked example: one share versus five", steps: [
      "You have ₹5,000. Option 1: put all ₹5,000 in one share. It falls 30%: ₹5,000 × 0.70 = ₹3,500, a loss of ₹1,500.",
      "To get back to ₹5,000 from ₹3,500, you need ₹5,000 ÷ ₹3,500 ≈ 1.43, which is a 43% rise.",
      "Option 2: put ₹1,000 in each of five companies. One falls 30%: ₹1,000 × 0.70 = ₹700. The others stay flat at ₹4,000. Total ₹4,700, a loss of ₹300.",
      "A tip says a share will \"double in a week\". Doubling is a 100% gain. Nobody can promise that.",
      "These are made-up numbers to show the idea, not forecasts."] },
    india: "A WhatsApp message says, \"Buy this share now, it will double by Friday. Don't tell anyone.\" Tara ignores it. She remembers that SEBI warns against such tips and that urgency and secrecy are signs of a trap.",
    mistakes: ["Following tips from strangers or chats", "Putting everything in one company", "Borrowing money to buy shares"],
    takeaways: ["A 30% fall needs a 43% rise to recover", "Spreading money reduces the damage from one company", "Be wary of tips and guaranteed returns; check SEBI registration", "Never borrow to invest"],
    links: [["SEBI: how to spot a scam", "https://investor.sebi.gov.in/spot-any-scam.html"], ["SEBI caution to investors", "https://investor.sebi.gov.in/cautiontoinvestor.html"]],
    quiz: [
      { q: "A share falls 30%. To recover it needs about...", o: ["A 30% rise", "A 10% rise", "No rise", "A 43% rise"], a: 3, why: "₹100 → ₹70 needs a gain of about 43% to return to ₹100." },
      { q: "Diversification means...", o: ["Spreading money across several investments", "Borrowing more", "Selling all", "Following tips"], a: 0, why: "It reduces the damage from any one investment." },
      { q: "SEBI's advice about stock tips from unregistered sources is...", o: ["Follow them", "Be careful and avoid acting on them", "Forward them", "Pay for them"], a: 1, why: "SEBI warns against acting on tips from unregistered sources." },
      { q: "Why not borrow to invest?", o: ["Banks forbid it", "It is illegal", "The loan must be repaid even if shares fall", "Shares never rise"], a: 2, why: "A loan must be repaid whatever the market does." }
    ]
  },

  // ===================== Module 9: SIPs and First Investment =====================
  {
    id: "9-1", module: 9, title: "Mutual Funds and NAV",
    hook: "A mutual fund is like a shared shopping basket: many people chip in, and an expert buys the items.",
    summary: "A mutual fund pools money from many investors and invests it. You buy units at the fund's NAV, which is published daily. Every fund has a risk-o-meter with six levels from low to very high.",
    learn: ["What a mutual fund is", "What NAV and units mean", "What the risk-o-meter tells you"],
    sections: [
      { h: "A shared basket", p: [
        "A <strong>mutual fund</strong> collects money from many investors and invests it in shares or other assets, managed by a professional team. You own a share of the whole pool, in the form of <strong>units</strong>. You do not have to pick individual companies."] },
      { h: "NAV", p: [
        "The price of one unit is the <strong>NAV</strong>, or Net Asset Value. SEBI explains it as the fund's total assets minus its liabilities, divided by the number of units, and it is published daily. When you invest, you buy units at that day's NAV. A fund with a low NAV is not \"cheaper\" in any real sense, since the NAV only tells you the value of one unit."] },
      { h: "The risk-o-meter", p: [
        "Every mutual fund shows a <strong>risk-o-meter</strong> with six levels, from low to very high. A higher level means larger possible ups and downs. Check it before you invest, and choose a level you can live with. A fund does not guarantee profit."] }
    ],
    example: { title: "Worked example: NAV and units", steps: [
      "A fund has assets worth ₹1,050 (in lakhs, to keep numbers small) and liabilities of ₹50. 1,050 − 50 = ₹1,000.",
      "It has 100 lakh units. NAV = ₹1,000 ÷ 100 = ₹10 per unit.",
      "You invest ₹500 at ₹10: you get 500 ÷ 10 = 50 units.",
      "A month later the NAV is ₹11. Your 50 units are worth 50 × ₹11 = ₹550.",
      "If the NAV had dropped to ₹9, they would be worth ₹450. Values go both ways."] },
    india: "Ishaan hears two friends: one says the fund with NAV ₹20 is \"cheaper\", the other likes the one with NAV ₹200. Ishaan realises the NAV is just the value of one unit. He checks each fund's risk-o-meter and goal instead.",
    mistakes: ["Choosing a fund because its NAV is low", "Ignoring the risk-o-meter", "Expecting a fixed return"],
    takeaways: ["A mutual fund pools many investors' money", "NAV = (assets − liabilities) ÷ units, published daily", "Units are bought at the day's NAV", "Check the six-level risk-o-meter"],
    links: [["SEBI mutual fund FAQ", "https://www.sebi.gov.in/sebi_data/faqfiles/sep-2024/1727242783639.pdf"]],
    quiz: [
      { q: "NAV is...", o: ["A tax", "A bank fee", "Your score", "The value of one unit of the fund"], a: 3, why: "NAV is the per-unit value, worked out from assets minus liabilities, divided by units." },
      { q: "₹500 at an NAV of ₹10 buys...", o: ["50 units", "5 units", "500 units", "10 units"], a: 0, why: "500 ÷ 10 = 50 units." },
      { q: "The risk-o-meter has how many levels?", o: ["Two", "Six", "Ten", "One"], a: 1, why: "It has six levels from low to very high." },
      { q: "Does a mutual fund guarantee profit?", o: ["Yes", "No", "Only large ones", "Only old ones"], a: 1, why: "No fund guarantees profit." }
    ]
  },
  {
    id: "9-2", module: 9, title: "SIP: Investing a Little, Regularly",
    hook: "You do not need to time the market. A SIP lets you take the same small step every month.",
    summary: "A SIP is a way of investing a fixed amount at regular intervals. Each instalment buys units at that day's NAV, so a lower NAV buys more units. A SIP is a method, not a product, and it does not guarantee a profit.",
    learn: ["What a SIP is", "How a falling NAV buys more units", "What a SIP does not promise"],
    sections: [
      { h: "A method, not a product", p: [
        "A <strong>SIP</strong> (Systematic Investment Plan) means investing a fixed amount at regular intervals, such as ₹500 on the 5th of every month. The fund you pick decides the risk; the SIP is just the way you invest."] },
      { h: "Why regular investing helps", p: [
        "Each instalment buys units at that day's NAV. When the NAV is low, the same money buys more units; when it is high, fewer. Over time this averages your buying price. It also removes the pressure of guessing the \"right day\" to invest, and it builds a habit."] },
      { h: "What it does not do", p: [
        "A SIP does not guarantee profit or protect you from loss. If the fund falls and stays low, your SIP can show a loss. Choose a fund whose risk-o-meter you are comfortable with, and invest only what you can leave alone for years."] }
    ],
    example: { title: "Worked example: three months of ₹500", steps: [
      "Month 1: NAV ₹10 → 500 ÷ 10 = 50 units.",
      "Month 2: NAV falls to ₹8 → 500 ÷ 8 = 62.5 units.",
      "Month 3: NAV rises to ₹12 → 500 ÷ 12 ≈ 41.7 units.",
      "Total: invested ₹1,500; units = 50 + 62.5 + 41.7 = 154.2. Average cost ≈ 1,500 ÷ 154.2 ≈ ₹9.73 per unit.",
      "At NAV ₹12 the units are worth 154.2 × 12 ≈ ₹1,850. If NAV had stayed at ₹8, they would be worth about ₹1,234, below ₹1,500. Nothing is guaranteed."] },
    india: "Tara earns her first salary and sets up a ₹500 monthly SIP on salary day. When the market dips and the news looks gloomy, she remembers that her ₹500 is buying more units. She keeps going and checks the fund's risk level once a year.",
    mistakes: ["Stopping the SIP in a panic when the NAV falls", "Thinking a SIP guarantees profit", "Choosing a fund without checking its risk-o-meter"],
    takeaways: ["SIP = fixed amount at regular intervals", "Lower NAV buys more units", "It is a method; the fund decides the risk", "It never guarantees a profit"],
    links: [["SEBI mutual fund FAQ", "https://www.sebi.gov.in/sebi_data/faqfiles/sep-2024/1727242783639.pdf"]],
    quiz: [
      { q: "A SIP is...", o: ["A product with guaranteed returns", "A tax", "A method of investing regularly", "A loan"], a: 2, why: "A SIP is a method; the fund decides the risk." },
      { q: "When NAV falls, your SIP instalment buys...", o: ["Fewer units", "The same units", "No units", "More units"], a: 3, why: "The same money buys more units at a lower NAV." },
      { q: "₹500 at NAV ₹8 buys...", o: ["62.5 units", "50 units", "40 units", "8 units"], a: 0, why: "500 ÷ 8 = 62.5 units." },
      { q: "Does a SIP guarantee profit?", o: ["Yes", "No", "After one year", "Only for large amounts"], a: 1, why: "A SIP does not guarantee profit." }
    ]
  },
  {
    id: "9-3", module: 9, title: "Index Funds and Starting Small",
    hook: "You do not have to be an expert to start. You just have to start, small, and keep going.",
    summary: "An index fund tries to copy an index by holding the same companies in the same proportion. Small tracking differences can exist. A small start with money you can leave alone is a sensible way to learn, and returns are never guaranteed.",
    learn: ["What an index fund is", "What tracking difference means", "How to start small and stay safe"],
    sections: [
      { h: "Copying an index", p: [
        "An <strong>index fund</strong> tries to copy an index, such as the Nifty 50, by investing in the same companies in the same proportion. It does not try to beat the market; it tries to follow it. Because it holds many companies, it spreads risk, though it still moves up and down with the market."] },
      { h: "Tracking difference", p: [
        "No index fund copies its index perfectly. The small gap between the fund's return and the index's return is called the <strong>tracking error</strong> or tracking difference. When comparing two index funds on the same index, compare how closely each follows it. Check the risk-o-meter as well."] },
      { h: "Starting small", p: [
        "You can start with a small monthly amount. The goal of the first year is to learn how it feels when values move, not to get rich. Keep your emergency fund separate, invest only money you will not need for years, and be wary of anyone who promises guaranteed returns."] }
    ],
    example: { title: "Worked example: ₹500 a month for 10 years", steps: [
      "You invest ₹500 × 12 × 10 = ₹60,000 over 10 years.",
      "Assume the fund grows about 8% a year, added monthly (an example only; real returns vary, and can be lower or negative).",
      "Monthly rate = 8% ÷ 12 ≈ 0.667%. Value ≈ ₹500 × ((1.00667¹²⁰ − 1) ÷ 0.00667) × 1.00667.",
      "(1.00667¹²⁰ ≈ 2.22, so the middle part ≈ 182.9.) Value ≈ ₹500 × 182.9 × 1.00667 ≈ ₹92,000.",
      "So ₹60,000 paid in might become about ₹92,000 at the assumed 8%. At a lower rate, it would be less. It is a lesson in habits, not a forecast."] },
    india: "Aman starts a ₹500 SIP in an index fund copying the Nifty 50 after checking its risk-o-meter. A friend says, \"Put it all in my sure-profit fund.\" Aman remembers that no fund can promise profit, and sticks to his plan.",
    mistakes: ["Starting with money you may need soon", "Believing a fund is \"sure profit\"", "Ignoring tracking difference and the risk-o-meter when comparing"],
    takeaways: ["An index fund copies an index", "A small tracking difference between fund and index is normal", "Start small with money you can leave alone", "Returns are never guaranteed"],
    links: [["SEBI mutual fund FAQ", "https://www.sebi.gov.in/sebi_data/faqfiles/sep-2024/1727242783639.pdf"], ["SEBI: how to spot a scam", "https://investor.sebi.gov.in/spot-any-scam.html"]],
    quiz: [
      { q: "An index fund tries to...", o: ["Guarantee profit", "Copy an index", "Pay a fixed rate", "Beat every fund"], a: 1, why: "It holds the same companies in the same proportion as the index." },
      { q: "Tracking difference is...", o: ["A tax", "A bank charge", "The small gap between a fund and its index", "A guarantee"], a: 2, why: "It is the small gap between the fund's return and the index's return." },
      { q: "A friend offers a \"sure-profit\" fund. You should...", o: ["Invest all", "Borrow", "Share OTP", "Remember no fund can promise profit"], a: 3, why: "No fund can promise profit." },
      { q: "A good first-year goal is to...", o: ["Learn with a small amount you can leave alone", "Get rich fast", "Borrow to invest", "Copy tips"], a: 0, why: "A small start teaches you how investing feels without big risk." }
    ]
  }
  // --- end of lessons ---
];
