// All game content lives here: the 9 chapters and the turns (situations).
// Each turn has a situation, 2-3 choices and a "Why?" card.
// A choice's "effects" can change: cash, savings, fd, sip, debt, credit,
// sipMonthly (monthly SIP amount) and emi: { amount, months }.
// "score" is 0 (worst) to 3 (best) and is used for the Report Card.

const CHAPTERS = [
  { id: 1, emoji: "🪙", name: "Money Basics", intro: "Needs vs wants, budgets and your emergency fund." },
  { id: 2, emoji: "🏷️", name: "Prices and Currency", intro: "Why prices rise and what an exchange rate means." },
  { id: 3, emoji: "🏦", name: "Banking", intro: "Accounts, KYC and how banks work." },
  { id: 4, emoji: "🛡️", name: "Scams and Safe Banking", intro: "UPI, OTP and phishing safety." },
  { id: 5, emoji: "🌱", name: "Compounding", intro: "Simple vs compound interest and starting early." },
  { id: 6, emoji: "🔒", name: "Safe Savings", intro: "FD, RD and PPF." },
  { id: 7, emoji: "💳", name: "Borrowing and Credit", intro: "EMI, credit cards and your CIBIL score." },
  { id: 8, emoji: "📊", name: "Stocks", intro: "Shares, Sensex, Nifty and risk." },
  { id: 9, emoji: "🚀", name: "SIPs and First Investment", intro: "Mutual funds, SIPs and index funds." }
];

// What each age is about. "modules" are the module numbers (from CHAPTERS) its situations come from.
const AGE_THEMES = {
  18: { emoji: "🪙", title: "Money Basics", modules: [1], intro: "You are 18. Needs, wants, budgets and your first emergency fund." },
  19: { emoji: "🏦", title: "Banking and Prices", modules: [3, 2], intro: "Bank accounts, UPI safety, and why prices keep creeping up." },
  20: { emoji: "🛡️", title: "Scams and Compounding", modules: [4, 5], intro: "Spot scams, and see how money grows when it earns on its earnings." },
  21: { emoji: "🔒", title: "Safe Savings", modules: [6], intro: "Savings accounts, FDs, RDs and PPF, where safety comes first." },
  22: { emoji: "💳", title: "Borrowing and Credit", modules: [7], intro: "EMIs, credit cards and your credit score." },
  23: { emoji: "📊", title: "Credit and Stocks", modules: [7, 8], intro: "Borrow wisely, and meet shares, Sensex and Nifty." },
  24: { emoji: "📈", title: "Stocks", modules: [8], intro: "How shares work, why prices move, and why tips are risky." },
  25: { emoji: "🚀", title: "Your First Investment", modules: [9, 0], intro: "SIPs, mutual funds and index funds, plus a review of what you learned." }
};

const TURNS = [
  // ---------- Chapter 1: Money Basics ----------
  {
    module: 1, age: 18,
    title: "Pocket Money Day",
    difficulty: "medium",
    concept: "Needs vs wants",
    situation: "It's pocket money day! Your friends plan a ₹800 cafe trip. Your phone screen is also cracked, and fixing it costs ₹1,200.",
    choices: [
      { text: "Fix phone, skip cafe, save ₹500", score: 3, effects: { cash: -1700, savings: 500 },
        note: "You covered your need first and still saved a little." },
      { text: "Go to the cafe, fix phone later", score: 1, effects: { cash: -800 },
        note: "Fun today, but the cracked screen is still waiting." },
      { text: "Cafe trip, plus a ₹1,500 earbuds deal", score: 0, effects: { cash: -2300 },
        note: "Both wants together drained your cash fast." }
    ],
    why: "A need is something you must have, like a working phone. A want is nice to have, like a cafe trip. A budget means needs first, then savings, then fun."
  },
  {
    module: 1, age: 18,
    title: "Dad's Savings Match",
    difficulty: "superhard",
    concept: "Emergency fund",
    situation: "Dad will add ₹1 for every ₹1 you save, up to ₹1,000, if you decide by Friday. You have ₹3,000 cash and a ₹2,500 college fee due soon.",
    choices: [
      { text: "Save ₹1,000 now for the full match", score: 1, effects: { cash: -3500, savings: 2000 },
        note: "The full match came in, but the fee left you ₹500 short." },
      { text: "Save ₹500 now for a smaller match", score: 3, effects: { cash: -3000, savings: 1000 },
        note: "The fee was covered and you still collected half the match." },
      { text: "Pay the fee, plan to save next month", score: 2, effects: { cash: -2500 },
        note: "The fee is paid, but Friday's match offer passed." }
    ],
    why: "A match is free money, but only if saving doesn't leave a bill unpaid. Cover fixed bills first, then take as much of the match as your cash allows."
  },

  // ---------- Chapter 2: Prices and Currency ----------
  {
    module: 2, age: 19,
    title: "Samosa Price Shock",
    difficulty: "medium",
    concept: "Inflation",
    situation: "Two years ago, a canteen samosa cost ₹10. Now it costs ₹15, but your pocket money stayed the same. You have ₹1,500 spare.",
    choices: [
      { text: "Keep it as cash at home", score: 1, effects: { cash: -200 },
        note: "Cash earns nothing, so about ₹200 of buying power slipped away." },
      { text: "Move it to the savings account", score: 3, effects: { cash: -1500, savings: 1500 },
        note: "Your money now earns a little interest." },
      { text: "Buy a gadget on a festive discount", score: 0, effects: { cash: -1500 },
        note: "The discount felt good, but the money is gone." }
    ],
    why: "Inflation means prices slowly rise, so the same ₹100 buys less over time. Interest in a savings account can soften this. Cash lying at home earns nothing."
  },
  {
    module: 2, age: 19,
    title: "The Dollar Game Price",
    difficulty: "hard",
    concept: "Exchange rate",
    situation: "A game on a US website costs $20. Suppose $1 equals ₹85, so it is about ₹1,700. Your bank also adds a small conversion extra.",
    choices: [
      { text: "Buy it now for about ₹1,800", score: 1, effects: { cash: -1800 },
        note: "You paid the price plus the bank's extra." },
      { text: "Pick a ₹500 local game", score: 2, effects: { cash: -500 },
        note: "Fun and no currency conversion needed." },
      { text: "Skip it and save ₹1,000", score: 3, effects: { cash: -1000, savings: 1000 },
        note: "A game can wait, your savings can grow." }
    ],
    why: "An exchange rate tells you how many rupees one dollar costs. It changes every day, so the same $20 can cost different rupees. Banks add a small extra, so your rate is a bit worse."
  },

  // ---------- Chapter 3: Banking ----------
  {
    module: 3, age: 19,
    title: "Your First Bank Account",
    difficulty: "easy",
    concept: "KYC and deposit insurance",
    situation: "You want your own bank account. The bank asks for your photo and an ID document, such as Aadhaar or PAN, to finish KYC.",
    choices: [
      { text: "Complete KYC and deposit ₹1,000", score: 3, effects: { cash: -1000, savings: 1000 },
        note: "Your account is open and your money is safer." },
      { text: "Use a friend's account instead", score: 0, effects: { cash: -300 },
        note: "Messy! Some money got stuck and you lost track of it." },
      { text: "Skip the bank, keep everything as cash", score: 1, effects: { cash: -500 },
        note: "You lost some cash from your bag." }
    ],
    why: "KYC means Know Your Customer. The bank checks who you are with a photo and an ID document. This helps stop fraud."
  },
  {
    module: 3, age: 19,
    title: "Minimum Balance Charge",
    difficulty: "medium",
    concept: "Minimum balance and bank charges",
    situation: "You get an SMS: your balance fell below the minimum, so the bank charged you a penalty. You want to stop this happening again.",
    choices: [
      { text: "Top up to the minimum balance", score: 2, effects: { cash: -1000, savings: 1000 },
        note: "No more charges, and your savings grew." },
      { text: "Ignore the SMS", score: 0, effects: { savings: -300 },
        note: "More charges came every month the balance stayed low." },
      { text: "Ask the bank about account options", score: 3, effects: {},
        note: "You learned the rules and chose an account that fits you." }
    ],
    why: "Some accounts need a minimum balance, and the bank charges a fee if you go below it. Rules differ by bank and account type. Always ask and read the terms before you open one."
  },

  // ---------- Chapter 4: Scams and Safe Banking ----------
  // "sms" (optional) draws a phone message above the situation.
  {
    module: 4, age: 20,
    title: "The KYC Message",
    difficulty: "medium",
    concept: "Phishing and OTP safety",
    sms: { from: "VM-BNKKYC", text: "Dear customer, your KYC has expired. Update now or your account will be blocked. Tap and share the OTP:", link: "bank-kyc-verify.in/update" },
    situation: "A message says your bank KYC has expired. It wants you to tap a link and share an OTP. It sounds very urgent.",
    choices: [
      { text: "Tap the link and share the OTP", score: 0, effects: { cash: -3000 },
        note: "Oh no! The scammer used your OTP and took ₹3,000." },
      { text: "Ignore it and check the bank's own app", score: 2, effects: {},
        note: "Smart! Your own bank app shows what is really pending." },
      { text: "Check the bank's app and report on 1930", score: 3, effects: {},
        note: "Perfect! You stayed safe and helped stop the scammer." }
    ],
    why: "Banks don't ask for your OTP or PIN, and you should update KYC through the bank's own app or branch, not a message link. Reporting at cybercrime.gov.in or on 1930 helps stop it."
  },
  {
    module: 4, age: 20,
    title: "The Cricket Bat Buyer",
    difficulty: "easy",
    concept: "UPI collect-request scam",
    situation: "You listed your old cricket bat online for ₹2,000. A buyer sends a money request and says, \"Enter your UPI PIN to receive the payment.\"",
    choices: [
      { text: "Enter my PIN to receive ₹2,000", score: 0, effects: { cash: -2000 },
        note: "Ouch! Entering the PIN sent ₹2,000 away instead." },
      { text: "Decline it and check my bank app", score: 3, effects: {},
        note: "Great! No money moved and your PIN stayed secret." },
      { text: "Enter PIN, then tell my bank fast", score: 1, effects: { cash: -2000 },
        note: "The money left, but reporting quickly was the right next step." }
    ],
    why: "You never need a PIN to receive money. Entering it means you are sending. If you share a PIN or OTP yourself, you bear the loss until you report it to your bank, so report fast."
  },

  // ---------- Chapter 5: Compounding ----------
  {
    module: 5, age: 20,
    title: "Interest on Interest",
    difficulty: "medium",
    concept: "Simple vs compound interest",
    situation: "You have ₹3,000 you can set aside for years. One scheme pays interest only on your starting money. Another pays interest on your interest too.",
    choices: [
      { text: "Choose interest-on-interest (compound)", score: 3, effects: { cash: -3000, fd: 3000 },
        note: "Your money now earns on its earnings, so it grows faster." },
      { text: "Choose the simple interest scheme", score: 2, effects: { cash: -3000, savings: 3000 },
        note: "Safe, but it grows slower than compounding." },
      { text: "Buy a discounted gaming headset", score: 0, effects: { cash: -3000 },
        note: "Fun for a while, but nothing is growing now." }
    ],
    why: "Simple interest is paid only on your starting money. Compound interest is paid on interest too. At 10% a year for 3 years, ₹1,000 becomes ₹1,300 with simple and ₹1,331 with compound."
  },
  {
    module: 5, age: 20,
    title: "Start Now or Later?",
    difficulty: "superhard",
    concept: "Time and compounding",
    situation: "You have ₹3,000 free and a ₹2,500 trip in 4 months. An FD could start today at around 7%, and your cousin says to start after college.",
    choices: [
      { text: "Put all ₹3,000 in a 5-year FD today", score: 1, effects: { cash: -3000, fd: 3000 },
        note: "Time is on your side, but the trip money is now locked away." },
      { text: "₹500 in an FD, ₹2,500 for the trip", score: 3, effects: { cash: -3000, fd: 500, savings: 2500 },
        note: "You started early and the trip is still paid for." },
      { text: "Wait until after the trip to start", score: 1, effects: {},
        note: "The trip is covered, but the early years of growth are missed." }
    ],
    why: "Compounding needs time, but money for a near goal should not be locked up for years. Start with what is left after dated goals, even if it is small."
  },

  // ---------- Chapter 6: Safe Savings ----------
  {
    module: 6, age: 21,
    title: "Lock It in an FD",
    difficulty: "medium",
    concept: "Fixed deposit",
    situation: "You have ₹3,000 you won't need for a year. A bank FD pays fixed interest, for example around 7% a year. A friend says you can always break it early.",
    choices: [
      { text: "Open a 1-year FD and wait", score: 3, effects: { cash: -3000, fd: 3000 },
        note: "Your FD will grow quietly until it matures." },
      { text: "Open an FD, then break it early", score: 1, effects: { cash: -30 },
        note: "You got money back, but paid a small penalty and lost interest." },
      { text: "Keep all ₹3,000 as plain cash", score: 1, effects: {},
        note: "It's handy, but cash earns nothing." }
    ],
    why: "An FD pays fixed interest if you leave it till the end. Breaking early is usually allowed, but banks may charge a penalty and pay lower interest."
  },
  {
    module: 6, age: 21,
    title: "PPF or RD?",
    difficulty: "medium",
    concept: "PPF and RD",
    situation: "A parent suggests a PPF account. It runs for 15 years, and the government sets its rate every quarter, for example around 7%. You can also try a monthly RD.",
    choices: [
      { text: "Open PPF with ₹1,000 this year", score: 3, effects: { cash: -1000, fd: 1000 },
        note: "You've started a long, tax-free saving habit." },
      { text: "Start a ₹500 monthly RD", score: 2, effects: { cash: -1500, fd: 1500 },
        note: "Your first three RD instalments are in." },
      { text: "Skip it, 15 years is too long", score: 1, effects: {},
        note: "No risk, but no growth either." }
    ],
    why: "PPF runs for 15 years, you can add ₹500 to ₹1.5 lakh a year, and its interest is tax-free. An RD is shorter: you deposit a fixed amount every month for a fixed period."
  },

  // ---------- Chapter 7: Borrowing and Credit ----------
  {
    module: 7, age: 22,
    title: "Phone on EMI",
    concept: "EMI",
    situation: "A phone costs ₹12,000. The shop offers 12 EMIs of ₹1,100, which is ₹13,200 in total. You want it now.",
    choices: [
      { text: "Take the 12-month EMI", score: 2, effects: { emi: { amount: 1100, months: 12 } },
        note: "You got the phone, but you'll pay ₹1,200 extra." },
      { text: "Save two more months, then decide", score: 3, effects: {},
        note: "Waiting kept your money and your options." },
      { text: "Take EMI and pay it late", score: 0, effects: { emi: { amount: 1100, months: 12 }, credit: -30 },
        note: "Late payments hurt your credit score right away." }
    ],
    why: "An EMI is a loan repaid in equal monthly parts, each with some principal and some interest. So you pay more than the price. Missing EMIs lowers your credit score."
  },
  {
    module: 7, age: 22,
    title: "The Credit Card Bill",
    concept: "Credit score and CIBIL",
    situation: "Your first credit card has a ₹10,000 limit. You spent ₹4,000 this month and the bill is due now.",
    choices: [
      { text: "Pay the full ₹4,000 on time", score: 3, effects: { cash: -4000, credit: 20 },
        note: "On-time payment helps your score." },
      { text: "Pay ₹2,000 now, rest later", score: 1, effects: { cash: -2000, debt: 2000, credit: -5 },
        note: "You still owe ₹2,000, and borrowing stays on your record." },
      { text: "Forget it and pay next month", score: 0, effects: { cash: -4000, credit: -30 },
        note: "Paying late dropped your credit score." }
    ],
    why: "CIBIL is a credit bureau. Its score runs from 300 to 900, and higher is better. Paying EMIs and card bills on time helps; late payments hurt. You can get one free full credit report every year."
  },

  // ---------- Chapter 8: Stocks ----------
  {
    module: 8, age: 23,
    title: "Your First Share",
    concept: "Shares and exchanges",
    situation: "You want to own a share of a big company. A friend offers to buy it for you if you hand over ₹3,000.",
    choices: [
      { text: "Open an account with a SEBI-registered broker", score: 3, effects: { cash: -2000, sip: 2000 },
        note: "You own a small part of a company, in your own name." },
      { text: "Give my friend ₹3,000 to buy it", score: 0, effects: { cash: -3000 },
        note: "Nothing is in your name, and the money is gone." },
      { text: "Read about shares first, buy later", score: 2, effects: {},
        note: "A careful start. Learning is never wasted." }
    ],
    why: "A share is part ownership of a company. Shares trade on exchanges like NSE and BSE, through a SEBI-registered broker with a bank and trading account."
  },
  {
    module: 8, age: 24,
    title: "All Eggs in One Share",
    concept: "Risk and Sensex/Nifty",
    situation: "A friend says one company's share is sure to rise, so put all your ₹5,000 in it. Shares can go up or down.",
    choices: [
      { text: "Put all ₹5,000 in that one share", score: 0, effects: { cash: -5000, sip: 3500 },
        note: "The share fell, and your ₹5,000 became ₹3,500." },
      { text: "Spread ₹2,000 across a few companies", score: 3, effects: { cash: -2000, sip: 2100 },
        note: "One dipped, another rose. Spreading softened the blow." },
      { text: "Watch the market for a month first", score: 2, effects: {},
        note: "You learned how prices move before risking money." }
    ],
    why: "Share prices move up and down, and nobody can promise a rise. Nifty 50 tracks 50 large NSE companies; Sensex tracks 30 large BSE companies. Spreading money reduces the risk."
  },

  // ==================== New situations (Phase A: ages 18-21) ====================

  // ---------- Age 18: Money Basics (module 1) ----------
  {
    module: 1, age: 18,
    title: "Diwali Gift Money",
    difficulty: "hard",
    concept: "50/30/20 rule",
    situation: "Relatives give you ₹3,000 as Diwali money. A budget rule says: about 50% for needs, 30% for wants and 20% for saving. Your friends want to go shopping.",
    choices: [
      { text: "Save ₹600, spend the rest with a plan", score: 3, effects: { savings: 600 },
        note: "You saved the 20% and still enjoyed the festival." },
      { text: "Save all ₹3,000, no treats at all", score: 2, effects: { savings: 3000 },
        note: "Great saving, but a small treat keeps the habit fun." },
      { text: "Grab a big Diwali combo offer", score: 0, effects: {},
        note: "The festival deal felt great, but nothing was left to save." }
    ],
    why: "The 50/30/20 rule splits money into needs, wants and savings. It is a starting guide, not a law. Saving first makes sure your future self gets a share."
  },
  {
    module: 1, age: 18,
    title: "Auto or Bus?",
    difficulty: "hard",
    concept: "Small costs add up",
    situation: "Your college is 6 km away. The auto costs ₹80 a day for the round trip, the bus costs ₹20. Over a month, that difference is about ₹1,300.",
    choices: [
      { text: "Take the bus, move ₹600 to savings", score: 3, effects: { cash: -600, savings: 600 },
        note: "Your savings grew from a small daily choice." },
      { text: "Auto on rainy days only", score: 2, effects: { cash: -300 },
        note: "A sensible balance of comfort and cost." },
      { text: "Auto every day, it is comfy", score: 1, effects: { cash: -1300 },
        note: "Comfortable, but a big chunk of your pocket money." }
    ],
    why: "Small daily costs add up fast: ₹60 a day is about ₹1,300 a month. Travel to college is a need, but the comfort level is a choice. Knowing where money goes is step one of budgeting."
  },
  {
    module: 1, age: 18,
    title: "Where Did It All Go?",
    difficulty: "medium",
    concept: "What money is",
    situation: "UPI makes paying so easy that you stop noticing. At month end you wonder where your pocket money went.",
    choices: [
      { text: "Note down every spend for a week", score: 3, effects: { cash: -300, savings: 300 },
        note: "You spotted small spends and moved ₹300 to savings." },
      { text: "Only check the balance", score: 1, effects: { cash: -500 },
        note: "You know how much is left, but not why." },
      { text: "Skip it, cashback offers will make up for it", score: 0, effects: { cash: -900 },
        note: "Spends kept slipping away unnoticed." }
    ],
    why: "Money is anything people accept in exchange for things. UPI moves your bank money, so it is just as real as cash. Tracking spends shows what is a need and what is a want."
  },
  {
    module: 1, age: 18,
    title: "Charger and Earphones",
    difficulty: "easy",
    concept: "Emergency fund",
    situation: "Your phone charger dies and your earphones break on the same day. Repairs cost ₹1,200. You have a small emergency fund in savings.",
    choices: [
      { text: "Pay from your emergency savings", score: 3, effects: { savings: -1200 },
        note: "That is what the fund is for. Now top it up again." },
      { text: "Borrow from a friend", score: 1, effects: { debt: 1200 },
        note: "Solved for now, but you owe ₹1,200." },
      { text: "Buy cheap roadside ones and hope they last", score: 0, effects: { cash: -1500 },
        note: "The cheap ones broke again and cost more." }
    ],
    why: "An emergency fund is money set aside for surprises. It saves you from borrowing when something breaks. Refill it after you use it."
  },
  {
    module: 1, age: 18,
    title: "Selling Old Books",
    difficulty: "easy",
    concept: "What money is",
    situation: "A bookshop offers ₹600 cash for your old school books. A friend offers to swap them for a game you only half want, or buy them for ₹400.",
    choices: [
      { text: "Take the ₹600 in cash", score: 3, effects: { cash: 600 },
        note: "With money you can choose anything, or save it." },
      { text: "Sell them to the friend for ₹400", score: 2, effects: { cash: 400 },
        note: "Quick and friendly, but ₹200 less than the shop paid." },
      { text: "Swap the books for the game", score: 1, effects: {},
        note: "A swap only works if both sides want what the other has." }
    ],
    why: "Money works because everyone accepts it in exchange for things. A swap needs two people who want each other's item at the same time. Money lets you buy anything, save it, or compare prices."
  },
  {
    module: 1, age: 18,
    title: "Pay Yourself First",
    difficulty: "medium",
    concept: "Saving first",
    situation: "Last month you spent first and saved what was left. That was ₹0. A friend says to try saving first.",
    choices: [
      { text: "Move ₹800 to savings first, then spend", score: 3, effects: { cash: -800, savings: 800 },
        note: "Saving came first, and you still had enough to spend." },
      { text: "Save whatever is left again", score: 1, effects: {},
        note: "Another month with nothing saved." },
      { text: "Spend now, save from a future bonus", score: 0, effects: { cash: -500 },
        note: "You overspent a little and saved nothing." }
    ],
    why: "Saving first means moving money to savings the moment it arrives. What is left is what you spend. This makes saving a habit instead of a hope."
  },
  {
    module: 1, age: 18,
    title: "70% Off Sale",
    difficulty: "easy",
    concept: "Needs vs wants",
    situation: "A shop has a 70% off sale. You spot a ₹1,500 jacket that you do not really need, but it is such a good deal.",
    choices: [
      { text: "Wait three days, buy only if needed", score: 3, effects: {},
        note: "After three days you didn't miss it at all." },
      { text: "Buy it, it is cheap!", score: 0, effects: { cash: -1500 },
        note: "A deal on something you don't need is still money spent." },
      { text: "Buy it plus a matching shirt", score: 0, effects: { cash: -2800 },
        note: "The savings were an illusion. You spent more." }
    ],
    why: "A need is something you must have; a want is something nice to have. Sales are made to turn wants into feelings of need. A waiting rule gives your head time to catch up."
  },

  // ---------- Age 19: Banking (module 3) and Prices and Currency (module 2) ----------
  {
    module: 3, age: 19,
    title: "Borrowing Your Debit Card",
    difficulty: "easy",
    concept: "Debit card safety",
    situation: "At a mall, a friend says their phone died. They ask to use your debit card and PIN to pay ₹2,000, and promise to pay back soon.",
    choices: [
      { text: "Say no, offer to pay by UPI myself", score: 3, effects: {},
        note: "You kept your card and PIN private." },
      { text: "Let them swipe, but keep the PIN secret", score: 2, effects: { cash: -300 },
        note: "A risky halfway step. They kept the card longer than agreed." },
      { text: "Hand over the card and PIN just once", score: 0, effects: { cash: -2000 },
        note: "Anyone who knows your PIN can spend your money." }
    ],
    why: "Never share your card PIN, UPI PIN or OTP, not even with friends. If you share them yourself, you bear the loss until you report it to your bank."
  },
  {
    module: 3, age: 19,
    title: "Mystery Charge on the Statement",
    difficulty: "easy",
    concept: "Reading statements",
    situation: "While checking your account statement, you spot a ₹250 charge you do not recognise.",
    choices: [
      { text: "Ask the bank, in its app or branch", score: 3, effects: {},
        note: "The bank explained it, and you now check statements monthly." },
      { text: "Ignore it, it is only ₹250", score: 1, effects: { savings: -250 },
        note: "Small charges can repeat every month." },
      { text: "Call a number from a search ad", score: 0, effects: { cash: -2500 },
        note: "A fake helpline asked for your OTP." }
    ],
    why: "A statement lists every credit and debit in your account. Check it regularly. Contact the bank only through its own app, branch or the number on your card."
  },
  {
    module: 3, age: 19,
    title: "Is My Money Safe in the Bank?",
    difficulty: "medium",
    concept: "Deposit insurance",
    situation: "A news story about a troubled bank worries you. You keep your ₹20,000 savings in one bank account.",
    choices: [
      { text: "Learn the deposit insurance rule first", score: 3, effects: {},
        note: "You found that deposits are insured up to ₹5 lakh per depositor per bank." },
      { text: "Withdraw it all and keep it at home", score: 0, effects: { savings: -1000 },
        note: "Some cash was lost at home, and it earns no interest." },
      { text: "Ask a relative what to do", score: 2, effects: {},
        note: "Asking is fine. Checking the rules yourself is even better." }
    ],
    why: "DICGC insures deposits in a bank up to ₹5 lakh per depositor per bank, principal and interest together. The bank pays the premium, not you."
  },
  {
    module: 2, age: 19,
    title: "Auto Fare Hike",
    difficulty: "superhard",
    concept: "Inflation",
    situation: "Your auto fare rose from ₹30 to ₹40 a day, about ₹300 more a month. Your allowance is the same, you want ₹6,000 for a trip in 6 months, and your emergency fund is ₹2,000.",
    choices: [
      { text: "Pay the extra from the emergency fund", score: 1, effects: { savings: -300 },
        note: "Easy for now, but your cushion shrinks every month." },
      { text: "Take the bus on weekdays, keep ₹1,000 aside", score: 3, effects: { cash: -1000, savings: 1000 },
        note: "Cheaper travel kept both the trip and the cushion on track." },
      { text: "Cut the trip fund to ₹700 a month", score: 2, effects: { cash: -700, savings: 700 },
        note: "Fares are covered, but the trip is now a month late." }
    ],
    why: "Rising costs on a fixed allowance mean a goal needs a plan, not hope. Fix the cost you can change before you touch your emergency fund."
  },
  {
    module: 2, age: 19,
    title: "Dollar Gift from Cousin",
    difficulty: "hard",
    concept: "Exchange rate and spread",
    situation: "A cousin abroad sends you $50. Suppose $1 is ₹85, so it is ₹4,250. Three counters quote you different rates.",
    choices: [
      { text: "Compare all three, pick the best rate", score: 3, effects: { cash: 4200 },
        note: "A small effort gave you more rupees." },
      { text: "Take the first counter's offer", score: 1, effects: { cash: 3900 },
        note: "Quick, but you got fewer rupees." },
      { text: "Use the airport booth", score: 0, effects: { cash: 3600 },
        note: "Convenient, but the spread was large." }
    ],
    why: "An exchange rate says how many rupees one dollar costs. Banks and money changers add a spread, so you get slightly less than the published rate. Compare before you exchange."
  },

  // ---------- Age 20: Scams (module 4) and Compounding (module 5) ----------
  {
    module: 4, age: 20,
    title: "The Easy Job Offer",
    difficulty: "easy",
    concept: "Phishing",
    sms: { from: "WFH-JOBS", text: "Earn ₹5,000 a day from home! Pay a ₹500 registration fee now to start:", link: "earn-daily.in/register" },
    situation: "You get a message offering easy daily pay for no skills. You just have to pay a small fee first.",
    choices: [
      { text: "Ignore it and report the number", score: 3, effects: {},
        note: "You stopped a scam in its tracks." },
      { text: "Pay ₹500, it is a small risk", score: 0, effects: { cash: -500 },
        note: "The 'job' never existed, and the number vanished." },
      { text: "Ask a friend if they have tried it", score: 2, effects: {},
        note: "Asking is smart. Your friend said it was a scam." }
    ],
    why: "A real job never asks you to pay first. A promise of easy money is a warning sign. Report frauds on 1930 or at cybercrime.gov.in."
  },
  {
    module: 4, age: 20,
    title: "Helpful Caller with an App",
    difficulty: "medium",
    concept: "Screen-sharing fraud",
    situation: "A caller says your payment is stuck. To fix it, they ask you to install a 'support' app that lets them see your screen.",
    choices: [
      { text: "Hang up, call the number on my card", score: 3, effects: {},
        note: "The real bank said there was no problem." },
      { text: "Install the app, they sound polite", score: 0, effects: { cash: -4000 },
        note: "They watched your screen and moved your money." },
      { text: "Install it but don't share the OTP", score: 0, effects: { cash: -3000 },
        note: "Some frauds need no OTP at all once they see your screen." }
    ],
    why: "Some frauds need no OTP at all, such as screen-sharing apps and fake app files. Install apps only from official stores, and report fraud quickly on 1930."
  },
  {
    module: 4, age: 20,
    title: "Too-Good Sale Link",
    difficulty: "easy",
    concept: "Phishing",
    sms: { from: "MEGA-SALE", text: "Brand phones at ₹999! Pay now using this link. Only 5 left!", link: "megasale-deals.in/pay" },
    situation: "A message offers a branded phone at a tiny price if you pay through its link right now.",
    choices: [
      { text: "Skip it and search for the offer myself", score: 3, effects: {},
        note: "The official app had no such offer. It was bait." },
      { text: "Pay ₹999, it's worth a try", score: 0, effects: { cash: -999 },
        note: "No phone ever arrived." },
      { text: "Check the link with a friend first", score: 2, effects: {},
        note: "A good pause. Your friend spotted that it was fake." }
    ],
    why: "Phishing uses urgency and unbelievable prices to push you to act. Open offers through the official app or site you typed yourself, not through a random link."
  },
  {
    module: 5, age: 20,
    title: "The Rule of 72",
    difficulty: "hard",
    concept: "Rule of 72",
    situation: "Dad says money doubles in about 72 divided by the yearly rate. At around 8% a year, that is about 9 years. You have ₹1,000 spare.",
    choices: [
      { text: "Put it in a long-term deposit", score: 3, effects: { cash: -1000, fd: 1000 },
        note: "Time starts working for your money." },
      { text: "Keep it in my wallet", score: 1, effects: {},
        note: "It earns nothing while prices rise." },
      { text: "Buy shoes in a ₹1,000 sale", score: 0, effects: { cash: -1000 },
        note: "A nice buy, but nothing is left to grow." }
    ],
    why: "The Rule of 72 is a rough shortcut: 72 divided by the yearly rate gives the years to double. It is only an estimate, and rates are not promised. It shows why starting early matters."
  },
  {
    module: 5, age: 20,
    title: "Just ₹500 a Month",
    difficulty: "hard",
    concept: "Small amounts add up",
    situation: "You could set aside ₹500 each month. It feels small, but your cousin says small amounts add up over years.",
    choices: [
      { text: "Start a ₹500 monthly savings habit", score: 3, effects: { cash: -1500, fd: 1500 },
        note: "Three months in, ₹1,500 is already working for you." },
      { text: "Wait until I can save more", score: 1, effects: {},
        note: "Waiting for a bigger amount often means never starting." },
      { text: "Use that ₹500 for streaming subscriptions", score: 0, effects: { cash: -1500 },
        note: "Enjoyable, but nothing was kept." }
    ],
    why: "Saving ₹500 a month is ₹6,000 in a year before any interest. With interest on interest, the habit grows faster over many years. The habit matters more than the amount."
  },
  {
    module: 5, age: 20,
    title: "Time Beats Amount",
    difficulty: "superhard",
    concept: "Time and compounding",
    situation: "You can start saving ₹1,000 a month now, or wait a year and save ₹2,000 a month after an internship. You also owe a friend ₹1,500 within two months.",
    choices: [
      { text: "Wait a year, then save ₹2,000 a month", score: 1, effects: {},
        note: "Double the amount does not make up for a year of growth skipped." },
      { text: "Start ₹1,000 a month, repay the friend next month", score: 3, effects: { cash: -2500, fd: 1000 },
        note: "You started early and cleared the debt, so time and trust both grew." },
      { text: "Start ₹2,000 now, repay the friend later", score: 2, effects: { cash: -2000, fd: 2000 },
        note: "A bigger start, but a friend left waiting costs goodwill." }
    ],
    why: "Starting earlier gives money more years to earn on its earnings. Clear short debts first, then let time do the work."
  },

  // ---------- Age 21: Safe Savings (module 6) ----------
  {
    module: 6, age: 21,
    title: "Savings Account or FD?",
    difficulty: "easy",
    concept: "Fixed deposit",
    situation: "You have ₹5,000 you will not need for a year. A savings account pays, for example, around 3%, while a bank FD might pay around 7%.",
    choices: [
      { text: "Put it in a 1-year FD", score: 3, effects: { cash: -5000, fd: 5000 },
        note: "Your money earns more in return for being locked." },
      { text: "Keep it in the savings account", score: 2, effects: { cash: -5000, savings: 5000 },
        note: "Easy access, but lower interest." },
      { text: "Keep it as cash at home", score: 0, effects: {},
        note: "Cash earns nothing." }
    ],
    why: "An FD pays a fixed rate if you keep it till the end. Savings accounts pay less, but let you withdraw at once. Rates here are examples only; check the bank's current rates."
  },
  {
    module: 6, age: 21,
    title: "Breaking an FD Early",
    difficulty: "medium",
    concept: "Premature withdrawal",
    situation: "Your ₹5,000 FD has 4 months left. You suddenly want ₹5,000 for a short trip with friends.",
    choices: [
      { text: "Skip the trip, let the FD mature", score: 3, effects: {},
        note: "Your FD grows to maturity, and the trip can wait." },
      { text: "Break the FD early for the trip", score: 1, effects: { fd: -5000, cash: 4850 },
        note: "You got the money, but with a penalty and less interest." },
      { text: "Borrow for the trip, keep the FD", score: 1, effects: { debt: 5000, cash: 5000 },
        note: "You kept the FD but now owe ₹5,000." }
    ],
    why: "Banks usually allow early withdrawal of an individual's FD but may charge a penalty and pay a lower rate. Do not lock money you may need soon."
  },
  {
    module: 6, age: 21,
    title: "A Bike Fund with an RD",
    difficulty: "hard",
    concept: "Recurring deposit",
    situation: "You want a ₹12,000 second-hand bike next year. A recurring deposit (RD) lets you put in a fixed amount each month for a fixed time.",
    choices: [
      { text: "Start a ₹1,000 monthly RD", score: 3, effects: { cash: -3000, fd: 3000 },
        note: "Your first three instalments are in." },
      { text: "Save loose cash when I remember", score: 1, effects: { cash: -500, savings: 500 },
        note: "Irregular saving rarely reaches the goal." },
      { text: "Borrow for the bike next year", score: 0, effects: {},
        note: "Borrowing for a want means paying extra later." }
    ],
    why: "In an RD you deposit a fixed amount every month for a fixed period. The fixed schedule builds a habit. It suits a goal with a known date."
  },
  {
    module: 6, age: 21,
    title: "How Much Does Insurance Cover?",
    difficulty: "easy",
    concept: "Deposit insurance",
    situation: "An aunt keeps ₹7 lakh in one bank and asks how deposit insurance works, since you studied it. A private scheme has promised her a higher rate.",
    choices: [
      { text: "Suggest splitting it across two banks", score: 3, effects: {},
        note: "She moved part of it to a second bank and kept each within the limit." },
      { text: "Tell her a big bank means all is covered", score: 1, effects: {},
        note: "A bigger bank does not raise the insured amount." },
      { text: "Suggest the higher-rate private scheme", score: 0, effects: {},
        note: "The higher promise came with no insurance cover at all." }
    ],
    why: "DICGC insures deposits up to ₹5 lakh per depositor per bank, principal and interest together. Money above that is not covered. Splitting across banks is one way to stay within the limit."
  },
  {
    module: 6, age: 21,
    title: "Guaranteed 20%?",
    difficulty: "extreme",
    concept: "Risk and return",
    situation: "A relative's friend offers a 'guaranteed 20% a year' private scheme that closes tonight, saying FDs cannot beat rising prices. A bank FD pays around 7%. You have ₹4,000 free.",
    choices: [
      { text: "Put ₹4,000 in the scheme before it closes", score: 0, effects: { cash: -4000 },
        note: "The scheme collapsed and your money did not come back." },
      { text: "Put ₹1,000 in it and ₹3,000 in an FD", score: 1, effects: { cash: -4000, fd: 3000 },
        note: "The ₹1,000 vanished, while the FD kept the rest working." },
      { text: "Ask for proof tomorrow, open a ₹3,000 FD today", score: 3, effects: { cash: -3000, fd: 3000 },
        note: "No proof ever came, and your FD started earning." }
    ],
    why: "Very high guaranteed returns plus a tonight-only deadline are classic warning signs. Rising prices do not justify taking that risk."
  },
  {
    module: 6, age: 21,
    title: "Emergency Fund Top-Up",
    difficulty: "easy",
    concept: "Emergency fund",
    situation: "You want to build an emergency fund worth three months of basic costs. You have some free cash this month.",
    choices: [
      { text: "Move ₹3,000 into an easy-access account", score: 3, effects: { cash: -3000, savings: 3000 },
        note: "Your safety cushion grew, and it's easy to reach." },
      { text: "Lock it in a 5-year deposit", score: 1, effects: { cash: -3000, fd: 3000 },
        note: "Safe, but you cannot reach it fast in an emergency." },
      { text: "Use it on a weekend trip, top up later", score: 0, effects: { cash: -3000 },
        note: "Then an emergency came and you had no cushion." }
    ],
    why: "An emergency fund must be safe and easy to reach quickly. That is why it often sits in a savings account, not a long lock-in. Its job is safety, not high returns."
  },
  {
    module: 6, age: 21,
    title: "FD vs Rising Prices",
    difficulty: "hard",
    concept: "Inflation and real returns",
    situation: "Your FD pays, for example, around 7%. Prices have been rising by around 5% a year. Your friend says that means you are not really gaining much.",
    choices: [
      { text: "Compare the FD rate with inflation", score: 3, effects: {},
        note: "You saw that what matters is growth beyond rising prices." },
      { text: "Ignore inflation, only the rate matters", score: 1, effects: {},
        note: "Prices matter. Your buying power depends on both." },
      { text: "Break the FD for a friend's hot tip", score: 0, effects: { fd: -1000, cash: 900 },
        note: "You gave up growth and paid a penalty." }
    ],
    why: "Inflation lowers what your money can buy. A rate above inflation helps your buying power grow, while a rate below it lets it shrink slowly. Compare both numbers."
  },

  // ---------- Added in Part A: harder situations for ages 18-21 ----------
  {
    module: 1, age: 18,
    title: "Festival Phone Deal",
    difficulty: "superhard",
    concept: "Needs vs wants",
    situation: "A festival sale offers a ₹9,000 phone on a 6-month EMI of ₹1,600. Your phone still works. You have ₹2,000 saved and a ₹5,000 course fee due in 4 months.",
    choices: [
      { text: "Take the EMI deal, the phone is on sale", score: 0, effects: { emi: { amount: 1600, months: 6 } },
        note: "The monthly instalment crowded out your course fee savings." },
      { text: "Buy a ₹4,500 cheaper phone with savings", score: 1, effects: { cash: -2500, savings: -2000 },
        note: "A smaller buy, but it emptied your emergency cushion." },
      { text: "Keep the phone, save ₹1,250 a month", score: 3, effects: { cash: -1250, savings: 1250 },
        note: "The course fee is on track and the cushion stays whole." }
    ],
    why: "A sale price or a small instalment doesn't change whether you need the item. Check the dates your bigger bills fall due before you commit."
  },
  {
    module: 4, age: 18,
    title: "Double in a Week",
    difficulty: "extreme",
    concept: "Investment scam",
    situation: "A classmate you trust says a group will double your money in 7 days, but only if you join today. You set aside ₹3,000 for exam fees.",
    choices: [
      { text: "Join with the whole ₹3,000, others did", score: 0, effects: { cash: -3000 },
        note: "The group went silent and the exam fee money was gone." },
      { text: "Ask for proof of registration, then decide", score: 2, effects: {},
        note: "The proof was only a screenshot, which proves nothing." },
      { text: "Decline and report it on cybercrime.gov.in", score: 3, effects: {},
        note: "You kept the exam fee and helped warn others." }
    ],
    why: "Promises of doubled money in days are a warning sign, even from a friend. Report such schemes on 1930 or at cybercrime.gov.in."
  },
  {
    module: 1, age: 18,
    title: "Sold-Out Concert",
    difficulty: "extreme",
    concept: "Needs vs wants",
    situation: "Your favourite band's concert sells out online. A stranger offers two tickets for ₹6,000, with half paid now by UPI. Face value is ₹2,500 each, and you have ₹5,000.",
    choices: [
      { text: "Pay ₹3,000 now to lock the tickets", score: 0, effects: { cash: -3000 },
        note: "The seller blocked you right after the payment." },
      { text: "Offer to pay at handover outside the venue", score: 1, effects: { cash: -2500 },
        note: "The ticket looked real but had already been used." },
      { text: "Wait for the venue's returns, set ₹1,000 aside", score: 3, effects: { cash: -1000, savings: 1000 },
        note: "No pressure, no stranger, and a start on the next show." }
    ],
    why: "Pressure to pay fast is how fake sellers work, especially for sold-out items. If you cannot verify the seller or the ticket, a want can wait."
  },
  {
    module: 3, age: 19,
    title: "FD Offer vs Trip Deposit",
    difficulty: "superhard",
    concept: "Minimum balance and bank charges",
    situation: "Your account needs a ₹2,000 minimum balance. You hold ₹7,000, and a ₹4,000 trip deposit is due in 3 weeks. A 6-month FD at around 7% asks for ₹5,000.",
    choices: [
      { text: "Lock ₹5,000 in the FD, then pay trip", score: 1, effects: { cash: -9000, fd: 5000 },
        note: "The trip fee left you short, and savings had to cover the gap." },
      { text: "Pay the ₹4,000 deposit, keep the rest", score: 3, effects: { cash: -4000 },
        note: "The trip is booked and the balance stays above the minimum." },
      { text: "Put ₹1,000 in an FD, pay trip", score: 2, effects: { cash: -5000, fd: 1000 },
        note: "A small FD started and the minimum is met, with little cushion left." }
    ],
    why: "A minimum balance and a due date both limit how much you can lock away. Lock only money that no upcoming bill needs."
  },
  {
    module: 4, age: 19,
    title: "Wrong Transfer Plea",
    difficulty: "extreme",
    concept: "Fake credit SMS",
    situation: "A man calls in a panic, saying he sent you ₹5,000 by mistake and needs it back for a hospital bill. An SMS in your inbox says the money arrived.",
    choices: [
      { text: "Return the ₹5,000 right away, the SMS shows it", score: 0, effects: { cash: -5000 },
        note: "No credit had arrived. The SMS was fake and the money was gone." },
      { text: "Return half now and the rest after checking", score: 1, effects: { cash: -2500 },
        note: "You still lost ₹2,500 before you checked anything." },
      { text: "Check the bank app before sending anything", score: 3, effects: {},
        note: "Nothing had been credited, so you sent nothing." }
    ],
    why: "A fake credit SMS is not proof that money arrived. Check your bank app or statement before you send anything back."
  },
  {
    module: 3, age: 19,
    title: "Hostel Room Advance",
    difficulty: "extreme",
    concept: "Scam awareness",
    situation: "A hostel owner says a room you liked online will go today unless you transfer ₹6,000 advance to his personal number. Rents in the area have risen lately.",
    choices: [
      { text: "Send ₹6,000 now to hold the room", score: 0, effects: { cash: -6000 },
        note: "The number stopped working and the room did not exist." },
      { text: "Pay ₹3,000 now, the rest after visiting", score: 1, effects: { cash: -3000 },
        note: "Half your advance was still gone before you saw anything." },
      { text: "Visit first, then pay ₹1,000 token for a receipt", score: 3, effects: { cash: -1000 },
        note: "You saw the room and held it with a record of what you paid." }
    ],
    why: "Pressure to pay today before you can see the place is a classic trap. Pay only what you can match to a receipt, and only after seeing what you are paying for."
  },
  {
    module: 5, age: 20,
    title: "Compounding Claim",
    difficulty: "extreme",
    concept: "Rule of 72 and risk",
    situation: "A chat admin says 10% a month doubles money in about 7 months, by the Rule of 72, 'guaranteed'. You can join with ₹5,000 within 10 minutes.",
    choices: [
      { text: "Join with ₹5,000, the maths adds up", score: 0, effects: { cash: -5000 },
        note: "The admin vanished and the 'returns' never came." },
      { text: "Join with ₹1,000 first to test it", score: 1, effects: { cash: -1000 },
        note: "The small test amount was lost too." },
      { text: "Skip it, put ₹2,000 in a 1-year FD", score: 3, effects: { cash: -2000, fd: 2000 },
        note: "Slower growth, but a bank was holding it." }
    ],
    why: "The Rule of 72 gives a rough doubling time, but no honest scheme can guarantee 10% a month. A promise like that is a warning sign, however clever the maths."
  },
  {
    module: 4, age: 20,
    title: "Friend's Instant Loan",
    difficulty: "extreme",
    concept: "Loan app risk",
    situation: "A friend urgently needs ₹10,000. A loan app promises it instantly but asks for access to your contacts and photos, and warns it will message them if you are late.",
    choices: [
      { text: "Take the app loan, repay in a week", score: 0, effects: { debt: 11500, credit: -10 },
        note: "Hidden charges and messages to your contacts piled up." },
      { text: "Lend ₹2,000 from savings, ask his family to help", score: 3, effects: { savings: -2000 },
        note: "You helped within your means without using a pressure app." },
      { text: "Refuse everything, it is not my problem", score: 1, effects: {},
        note: "Your money stayed put, but your friend had to find help alone." }
    ],
    why: "Instant loan apps can charge hidden costs and pressure you through your contacts. Help within your means rather than borrowing for someone else."
  },
  {
    module: 6, age: 21,
    title: "Long Lock-in, Short Goal",
    difficulty: "superhard",
    concept: "PPF and RD",
    situation: "You have ₹4,000 free, ₹3,000 in an emergency fund and a ₹3,500 gadget goal in 8 months. PPF interest is tax-free, and ₹500 a year is its minimum.",
    choices: [
      { text: "Put all ₹4,000 into PPF, it is tax-free", score: 1, effects: { cash: -4000, fd: 4000 },
        note: "Locked for 15 years, so the gadget goal moved out of reach." },
      { text: "Put ₹500 in PPF, ₹3,500 in an 8-month RD", score: 3, effects: { cash: -4000, fd: 4000 },
        note: "PPF is started and the gadget money will be ready on time." },
      { text: "Skip both and keep cash for the gadget", score: 2, effects: {},
        note: "The gadget is covered, but nothing is growing." }
    ],
    why: "PPF runs for 15 years, so it suits money you will not need for a long time. A goal due in months needs a shorter tool, like an RD."
  },
  {
    module: 6, age: 21,
    title: "Gift, Exam and Cushion",
    difficulty: "superhard",
    concept: "Emergency fund and FD",
    situation: "You receive a ₹20,000 gift. You need ₹8,000 for an exam in 5 months and a ₹6,000 cushion, and a 1-year FD pays around 7% but charges a penalty if broken early.",
    choices: [
      { text: "Put all ₹20,000 into a 1-year FD", score: 1, effects: { fd: 20000 },
        note: "Top rate, but breaking it for the exam would cost you." },
      { text: "₹12,000 in an FD, ₹8,000 in savings", score: 2, effects: { savings: 8000, fd: 12000 },
        note: "The exam is covered, but you have no cushion left." },
      { text: "₹8,000 for the exam, ₹6,000 cushion, ₹6,000 FD", score: 3, effects: { savings: 14000, fd: 6000 },
        note: "Every rupee has a date, and the FD only holds spare money." }
    ],
    why: "Match each rupee to a date: money needed soon stays reachable, and only the spare part goes into a lock-in. A penalty for breaking early makes a big lock-in costly."
  },
  {
    module: 6, age: 21,
    title: "College Fair FD Pitch",
    difficulty: "extreme",
    concept: "Fake high-return offer",
    situation: "At a college fair, a man offers a 'bank-backed FD at 11%'. He wants a ₹3,000 cheque in his name today, with a free gift for the first ten sign-ups.",
    choices: [
      { text: "Give a ₹3,000 cheque in his name", score: 0, effects: { cash: -3000 },
        note: "The cheque was cashed, and the 11% FD never existed." },
      { text: "Give ₹500 as a trial first", score: 1, effects: { cash: -500 },
        note: "Even the trial amount was lost, with no receipt from a bank." },
      { text: "Open a ₹3,000 FD in the bank's own app", score: 3, effects: { cash: -3000, fd: 3000 },
        note: "A bank-issued FD at a normal rate beats a stranger's promise." }
    ],
    why: "FD interest is paid by the bank into your account, never through a person's cheque. A rate far above what banks show is a red flag."
  },

  // ==================== New situations (Phase B: ages 22-25) ====================

  // ---------- Age 22: Borrowing and Credit (module 7) ----------
  {
    module: 7, age: 22,
    title: "\"No-Cost\" EMI Offer",
    concept: "No-cost EMI",
    situation: "A shop advertises a \"no-cost EMI\" on a ₹24,000 laptop. The monthly instalment looks a little higher than ₹24,000 divided by 12.",
    choices: [
      { text: "Ask for the total price with all charges", score: 3, effects: {},
        note: "The shop admitted a processing fee was added. You compared and decided wisely." },
      { text: "Take it without checking", score: 1, effects: { emi: { amount: 2125, months: 12 } },
        note: "You paid ₹25,500 in total, ₹1,500 more than the price." },
      { text: "Skip it and save up instead", score: 2, effects: {},
        note: "Patience avoids all extra charges." }
    ],
    why: "RBI says a \"no-cost\" or \"zero-interest\" EMI must not hide an interest component. Always compare the total you will pay with the price on the tag."
  },
  {
    module: 7, age: 22,
    title: "Credit Limit Jump",
    concept: "Credit card limit",
    situation: "Your card limit rises from ₹30,000 to ₹50,000. A shopping app immediately shows you gadgets you could buy now.",
    choices: [
      { text: "Spend only what I can pay in full", score: 3, effects: { credit: 5 },
        note: "A higher limit is room, not extra money." },
      { text: "Buy a ₹20,000 gadget and pay later", score: 0, effects: { debt: 20000, credit: -15 },
        note: "You now owe ₹20,000, and heavy borrowing hurts your score." },
      { text: "Decline the higher limit", score: 2, effects: {},
        note: "A cautious choice if you worry about overspending." }
    ],
    why: "A credit limit is the most you can borrow, not money you own. High borrowing can lower your credit score. Treat the card like your own money and pay in full."
  },
  {
    module: 7, age: 22,
    title: "The Minimum Due Trap",
    concept: "Credit card interest",
    situation: "Your credit card bill is ₹8,000. The app shows a \"minimum due\" of only ₹400, and a big Pay Minimum button.",
    choices: [
      { text: "Pay the full ₹8,000 on time", score: 3, effects: { cash: -8000, credit: 10 },
        note: "No interest and a better score." },
      { text: "Pay just the ₹400 minimum", score: 1, effects: { cash: -400, debt: 7600 },
        note: "The rest still counts as debt, and interest is added to it." },
      { text: "Skip it, pay later", score: 0, effects: { cash: -300, debt: 8000, credit: -30 },
        note: "A late fee came, and your score dropped." }
    ],
    why: "Paying only the minimum leaves most of the bill as a loan, and the card adds interest to it. Late payments lower your credit score. Paying the full bill on time avoids both."
  },
  {
    module: 7, age: 22,
    title: "Your Free Credit Report",
    concept: "Credit report",
    situation: "A friend says you can see your credit report for free once a year. A website offers the same report for ₹500.",
    choices: [
      { text: "Request my free yearly report", score: 3, effects: { credit: 5 },
        note: "You found and fixed a wrong entry, and your score got a lift." },
      { text: "Pay ₹500 on the website", score: 0, effects: { cash: -500 },
        note: "You paid for something you could have had free." },
      { text: "Never check it", score: 1, effects: {},
        note: "Errors can sit there unnoticed." }
    ],
    why: "RBI requires credit bureaus to give you one free full credit report each calendar year, including the score. Check it for mistakes. CIBIL is one of the bureaus."
  },
  {
    module: 7, age: 22,
    title: "Too Many EMIs",
    concept: "EMI budget",
    situation: "You already pay two EMIs of ₹3,000 a month. A showroom now offers a bike EMI of ₹5,000. Your take-home pay is ₹25,000.",
    choices: [
      { text: "Say no until the old EMIs finish", score: 3, effects: {},
        note: "Your monthly budget stays comfortable." },
      { text: "Take the bike EMI too", score: 1, effects: { emi: { amount: 5000, months: 12 } },
        note: "Over half your salary now goes to EMIs." },
      { text: "Take it and skip some payments", score: 0, effects: { emi: { amount: 5000, months: 12 }, credit: -30 },
        note: "Missing EMIs hurt your credit score." }
    ],
    why: "An EMI is a fixed monthly repayment. Many EMIs together can eat most of your income, leaving no room for surprises. Missing them lowers your credit score."
  },
  {
    module: 7, age: 22,
    title: "Two Days Late",
    concept: "Late payment",
    situation: "Your card bill was due on the 5th. You remember on the 7th and find a late fee on the next statement.",
    choices: [
      { text: "Pay now and set an auto-reminder", score: 3, effects: { cash: -300, credit: -5 },
        note: "A small lesson, and it won't repeat." },
      { text: "Ignore it, it was only two days", score: 0, effects: { cash: -600, credit: -25 },
        note: "More fees and a bigger score drop followed." },
      { text: "Blame the bank and wait", score: 0, effects: { cash: -500, credit: -20 },
        note: "The bill stayed unpaid and cost more." }
    ],
    why: "Late payments lower your credit score and add fees. Setting a reminder or auto-pay avoids most of this. Paying on time, every time, is the biggest habit that helps."
  },
  {
    module: 7, age: 22,
    title: "Course on EMI",
    concept: "EMI",
    situation: "An online course costs ₹9,000. The platform offers 12 EMIs of ₹825, which is ₹9,900 in total. You have the money in savings.",
    choices: [
      { text: "Pay ₹9,000 from savings", score: 3, effects: { savings: -9000 },
        note: "No extra cost, no commitments." },
      { text: "Take the 12-month EMI", score: 2, effects: { emi: { amount: 825, months: 12 } },
        note: "Affordable monthly, but ₹900 extra overall." },
      { text: "Take the EMI and pay late", score: 0, effects: { emi: { amount: 825, months: 12 }, credit: -30 },
        note: "Late EMIs hurt your credit score." }
    ],
    why: "An EMI splits a price into monthly parts, with interest or fees added. If you can pay at once without hurting your emergency fund, you save the extra cost."
  },

  // ---------- Age 23: Borrowing and Credit (module 7) and Stocks (module 8) ----------
  {
    module: 7, age: 23,
    title: "The Maxed-Out Card",
    concept: "Credit usage",
    situation: "Your card limit is ₹30,000 and you have already used ₹28,000 this month, mostly on festival shopping.",
    choices: [
      { text: "Pay most of it off before the due date", score: 3, effects: { cash: -20000, debt: 8000, credit: 10 },
        note: "Lower borrowing is good for your score." },
      { text: "Pay the minimum and keep spending", score: 0, effects: { cash: -1500, debt: 28000, credit: -15 },
        note: "Interest and high use both pull the score down." },
      { text: "Stop using it until the bill is paid", score: 2, effects: { cash: -8000, debt: 20000 },
        note: "Good control, though a large balance remains." }
    ],
    why: "High borrowing and late payments can lower your credit score. Using only a part of your limit, and paying on time, is a sign of careful use."
  },
  {
    module: 7, age: 23,
    title: "Fix My Score Fast",
    concept: "CIBIL score",
    situation: "You want a bike loan, but your score is low. An ad promises to \"fix your CIBIL score in 3 days\" for ₹3,000.",
    choices: [
      { text: "Pay every bill on time and wait", score: 3, effects: { credit: 8 },
        note: "A real score improves slowly, with steady habits." },
      { text: "Pay ₹3,000 to the ad", score: 0, effects: { cash: -3000 },
        note: "Nothing changed, and the ₹3,000 is gone." },
      { text: "Apply to several lenders at once", score: 1, effects: { credit: -5 },
        note: "Many applications at once can lower a score, and the reasons behind it stay." }
    ],
    why: "A credit score reflects your payment habits over time. Paying EMIs and card bills on time helps it, and it takes time. Be careful with anyone promising an instant fix."
  },
  {
    module: 7, age: 23,
    title: "Clear Debt or Spend?",
    concept: "Paying off debt",
    situation: "You owe ₹10,000 on a card that charges interest. This month you have ₹10,000 extra from a bonus.",
    choices: [
      { text: "Pay off the debt", score: 3, effects: { cash: 0, debt: -10000, credit: 5 },
        note: "No more interest, and your score improved." },
      { text: "Pay half, keep half as savings", score: 2, effects: { cash: 5000, debt: -5000, credit: 2 },
        note: "A balanced step." },
      { text: "Spend it on a holiday", score: 0, effects: { cash: 0 },
        note: "A fun trip, but the debt keeps growing." }
    ],
    why: "Card debt often charges more interest than a savings account pays. Clearing it first saves money. Keep a small emergency fund so you don't need to borrow again."
  },
  {
    module: 8, age: 23,
    title: "A Company's First Day",
    concept: "IPO and primary market",
    situation: "A company is selling its shares to the public for the first time. This is called an IPO. Your friend is excited and says everyone is applying.",
    choices: [
      { text: "Read about the business before deciding", score: 3, effects: {},
        note: "You understood what the company does and decided calmly." },
      { text: "Apply with ₹2,000 for a trial", score: 2, effects: { cash: -2000, sip: 2000 },
        note: "A small amount, and you know it can go up or down." },
      { text: "Apply because everyone else is", score: 0, effects: { cash: -4000, sip: 3000 },
        note: "Following the crowd isn't a plan. The price dipped." }
    ],
    why: "In the primary market, a company sells shares for the first time (an IPO). Later, investors trade them on exchanges like NSE and BSE. Understand a business before buying its share."
  },
  {
    module: 8, age: 23,
    title: "Dividend Day",
    concept: "Dividend",
    situation: "A company whose shares you own announces a dividend of ₹3 per share. You hold 100 shares, so you receive ₹300.",
    choices: [
      { text: "Put the ₹300 back into investing", score: 3, effects: { sip: 300 },
        note: "Your holding grew. Remember, dividends are not guaranteed." },
      { text: "Keep it in my savings account", score: 2, effects: { savings: 300 },
        note: "Safe and simple." },
      { text: "Spend it on pizza", score: 1, effects: {},
        note: "A tasty treat, but it did not grow." }
    ],
    why: "Shareholders may get a share of a company's profit called a dividend. A company may pay one, but it can also pay less or none. Never count on a dividend as certain."
  },
  {
    module: 8, age: 23,
    title: "The Sensex Falls",
    concept: "Sensex and market moves",
    situation: "The news says, \"Sensex falls 800 points today!\" A relative panics and tells you to sell everything.",
    choices: [
      { text: "Check what Sensex shows before acting", score: 3, effects: {},
        note: "Sensex tracks 30 large BSE companies. One day is not the whole story." },
      { text: "Sell everything in panic", score: 0, effects: { sip: -1000, cash: 900 },
        note: "Selling in a panic locked in a loss." },
      { text: "Borrow to buy more at once", score: 0, effects: { debt: 5000, sip: 4200 },
        note: "Borrowing to invest added risk on top of risk." }
    ],
    why: "Sensex is an index of 30 large companies on BSE, and Nifty 50 covers 50 large companies on NSE. They go up and down. Decisions made in panic are rarely good ones."
  },
  {
    module: 8, age: 23,
    title: "The WhatsApp Tip",
    concept: "Stock tips",
    situation: "A group chat message says, \"Buy this share now, it will double in a week! Don't tell anyone.\"",
    choices: [
      { text: "Ignore the tip, do my own research", score: 3, effects: {},
        note: "No one can promise a share will double." },
      { text: "Ask the sender for proof", score: 2, effects: {},
        note: "They went quiet when you asked." },
      { text: "Follow the tip with ₹3,000", score: 0, effects: { cash: -3000, sip: 1800 },
        note: "The share fell, and your ₹3,000 became ₹1,800." }
    ],
    why: "No one can promise a share will rise. Tips from strangers are often traps, because they push you to buy fast. Use a SEBI-registered broker and do your own homework."
  },
  {
    module: 8, age: 23,
    title: "A Broker Who Wants Your OTP",
    concept: "Broker and account safety",
    situation: "Someone calls and says, \"I am your trading advisor. Give me your login and OTP, and I will trade for you and make big profits.\"",
    choices: [
      { text: "Hang up, never share login or OTP", score: 3, effects: {},
        note: "Genuine entities never ask for your OTP or passwords." },
      { text: "Share the login but keep the OTP", score: 0, effects: { cash: -2000 },
        note: "Half the secret is still enough for a clever fraud." },
      { text: "Share both, they sound professional", score: 0, effects: { cash: -6000 },
        note: "They emptied your account." }
    ],
    why: "You buy shares through a SEBI-registered broker, using your own bank and trading accounts. Genuine entities never ask for your OTP, PIN or passwords. Report fraud on 1930."
  },

  // ---------- Age 24: Stocks (module 8) ----------
  {
    module: 8, age: 24,
    title: "The Price Drops After You Buy",
    concept: "Volatility",
    situation: "You bought a share for ₹2,000. A week later it is worth ₹1,700, and your phone keeps buzzing with alerts.",
    choices: [
      { text: "Stay calm and review why it fell", score: 3, effects: { cash: -2000, sip: 1700 },
        note: "Prices move daily. A drop is not a verdict, but you should know why." },
      { text: "Sell immediately in a panic", score: 1, effects: { cash: -300 },
        note: "You locked in the loss and gained a lesson." },
      { text: "Borrow to buy more right away", score: 0, effects: { cash: -2000, sip: 1700, debt: 5000 },
        note: "More borrowing meant more risk." }
    ],
    why: "Share prices go up and down, and a fall does not always mean something is wrong. But no one can promise they will recover. Invest only money you can leave alone for years."
  },
  {
    module: 8, age: 24,
    title: "Exchange: Who Buys My Share?",
    concept: "Exchanges and brokers",
    situation: "You want to buy your first share. Your cousin says he will \"just ask a guy\" to buy it from his friend, in cash.",
    choices: [
      { text: "Use a SEBI-registered broker", score: 3, effects: { cash: -1500, sip: 1500 },
        note: "Your share is held in your own name, bought on an exchange." },
      { text: "Give cash to the cousin's friend", score: 0, effects: { cash: -1500 },
        note: "There was no share, and no record." },
      { text: "Wait and learn more first", score: 2, effects: {},
        note: "A careful choice." }
    ],
    why: "Shares trade on exchanges like NSE and BSE. You buy through a SEBI-registered broker, with a bank and a trading account. Cash deals with strangers leave you with no proof."
  },
  {
    module: 8, age: 24,
    title: "Nifty 50 or One Company?",
    concept: "Index and diversification",
    situation: "You have ₹3,000 to invest. Your friend likes one company. Another option is a fund that follows the Nifty 50, which covers 50 large NSE companies.",
    choices: [
      { text: "Spread across many companies", score: 3, effects: { cash: -3000, sip: 3000 },
        note: "A single company's bad news won't wreck all your money." },
      { text: "Pick my friend's single company", score: 1, effects: { cash: -3000, sip: 2400 },
        note: "A single company's bad news hit hard." },
      { text: "Wait and watch for a few months", score: 2, effects: {},
        note: "You are learning before risking money." }
    ],
    why: "Nifty 50 is an index of 50 large companies on NSE. Spreading money across many companies reduces the risk from any one of them. It does not remove risk."
  },
  {
    module: 8, age: 24,
    title: "Day-Trading Craze",
    concept: "Trading vs investing",
    situation: "Friends brag about quick profits from buying and selling shares every day. You are tempted to try with your ₹10,000 savings.",
    choices: [
      { text: "Practise first in the Trading Lab", score: 3, effects: {},
        note: "You learned how prices jump around, with no real money at risk." },
      { text: "Try it with ₹10,000 savings", score: 0, effects: { savings: -6000 },
        note: "Most of the quick trades lost money." },
      { text: "Skip stocks forever", score: 1, effects: {},
        note: "Safe, but you also missed learning." }
    ],
    why: "Friends mostly talk about their wins, not their losses. Fast trading is risky and no one can promise profit. Practising with pretend money first costs nothing."
  },
  {
    module: 8, age: 24,
    title: "Borrow to Invest?",
    concept: "Borrowing to invest",
    situation: "A colleague says, \"Take a ₹20,000 loan and buy shares. It will rise, then repay the loan easily.\"",
    choices: [
      { text: "Invest only money I can spare", score: 3, effects: { cash: -2000, sip: 2000 },
        note: "Losses, if any, won't push you into debt." },
      { text: "Take the loan and invest", score: 0, effects: { debt: 20000, sip: 15000 },
        note: "The shares fell, but the loan still has to be repaid." },
      { text: "Skip it, no investing for now", score: 2, effects: {},
        note: "A cautious path." }
    ],
    why: "Share prices can fall, but a loan must be repaid either way. Borrowing to invest turns a loss into a bigger problem. Invest only money you can spare."
  },
  {
    module: 8, age: 24,
    title: "Rumour or News?",
    concept: "Reliable information",
    situation: "A social media post says a company will be bought out tomorrow. Another source, the company's official announcement, says nothing.",
    choices: [
      { text: "Check official announcements before acting", score: 3, effects: {},
        note: "The rumour was false. You saved yourself a loss." },
      { text: "Buy now before the price jumps", score: 0, effects: { cash: -2500 },
        note: "The rumour was false, and the price fell." },
      { text: "Forward it to friends first", score: 0, effects: { cash: -500 },
        note: "You spread a rumour and lost friends' trust." }
    ],
    why: "Rumours spread fast on social media and may not be true. Check what the company or the exchange has officially announced. Never act on a rumour alone."
  },
  {
    module: 8, age: 24,
    title: "Shareholder Vote",
    concept: "Ownership rights",
    situation: "A company in which you own a few shares sends you a notice about a shareholders' vote. Most of your friends ignore such mails.",
    choices: [
      { text: "Read it and cast my vote", score: 3, effects: {},
        note: "As an owner, you used your say." },
      { text: "Ignore it, I only own a few", score: 1, effects: {},
        note: "A small stake still gives you a say." },
      { text: "Sell the shares because of the mail", score: 1, effects: {},
        note: "A notice alone is not a reason to sell." }
    ],
    why: "A share is part ownership of a company. Shareholders may get dividends and may vote on certain matters. Owning shares is more than watching a price."
  },
  {
    module: 8, age: 24,
    title: "Start Small",
    concept: "Starting small",
    situation: "You are nervous about investing real money. A mentor suggests starting with just ₹500 that you could afford to lose.",
    choices: [
      { text: "Invest ₹500 and learn from it", score: 3, effects: { cash: -500, sip: 520 },
        note: "A small start taught you how prices move." },
      { text: "Wait until I'm an expert", score: 1, effects: {},
        note: "Real learning comes from small experience." },
      { text: "Go all in with ₹10,000 to learn fast", score: 0, effects: { cash: -10000, sip: 8500 },
        note: "A big loss early on is a costly teacher." }
    ],
    why: "Starting with a small amount lets you learn without a big risk. Only invest money you can afford to leave alone. Returns are never guaranteed."
  },

  // ---------- Age 25: SIPs and First Investment (module 9) plus review ----------
  {
    module: 9, age: 25,
    title: "What Is NAV?",
    concept: "NAV",
    situation: "One mutual fund has an NAV of ₹20, and another has an NAV of ₹200. A friend says the ₹20 one is \"cheaper\", so it must be better.",
    choices: [
      { text: "NAV is a per-unit value, not good or bad", score: 3, effects: { cash: -1000, sip: 1000 },
        note: "You judged the fund on its risk and goal, not its NAV." },
      { text: "Pick the ₹20 NAV fund, it's cheap", score: 1, effects: { cash: -1000, sip: 1000 },
        note: "A low NAV doesn't mean a bargain." },
      { text: "Skip mutual funds", score: 1, effects: {},
        note: "You can learn more first, which is fine." }
    ],
    why: "NAV is the value of one unit: total assets minus liabilities, divided by the number of units. It is published daily. A low NAV is not cheaper in any real sense."
  },
  {
    module: 9, age: 25,
    title: "SIP When Prices Fall",
    concept: "SIP and NAV",
    situation: "You pay ₹500 into a SIP every month. This month the fund's NAV fell, and the news is gloomy. You are tempted to stop.",
    choices: [
      { text: "Keep the SIP going", score: 3, effects: { sipMonthly: 0 },
        note: "A lower NAV buys more units for the same ₹500." },
      { text: "Pause until the news is better", score: 1, effects: {},
        note: "You may miss the units bought while prices were low." },
      { text: "Withdraw everything in panic", score: 0, effects: { sip: -2000, cash: 1700 },
        note: "You exited at a low point and paid a cost." }
    ],
    why: "Each SIP instalment buys units at that day's NAV, so a fall in NAV gets you more units. A SIP does not guarantee profit, and the fund can still lose value."
  },
  {
    module: 9, age: 25,
    title: "Step Up Your SIP",
    concept: "Growing the SIP",
    situation: "Your pay went up. You currently invest ₹500 a month. You can raise the SIP by ₹500 or use the extra on weekends out.",
    choices: [
      { text: "Raise the SIP by ₹500", score: 3, effects: { sipMonthly: 500 },
        note: "Your habit grew with your income." },
      { text: "Keep the SIP as is", score: 2, effects: {},
        note: "Steady, though you could do more." },
      { text: "Stop the SIP for a lifestyle upgrade", score: 0, effects: { sipMonthly: -500 },
        note: "You gave up a growing habit." }
    ],
    why: "A SIP is a method of investing a fixed amount at regular intervals. Raising it as your income grows is one way to build the habit. It never promises a profit."
  },
  {
    module: 9, age: 25,
    title: "Read the Risk-o-meter",
    concept: "Risk-o-meter",
    situation: "You are choosing a mutual fund. Every fund shows a risk-o-meter, from low to very high. A friend says to always take the highest.",
    choices: [
      { text: "Pick a fund whose risk matches my comfort", score: 3, effects: { cash: -2000, sip: 2000 },
        note: "You can sleep well and stay invested." },
      { text: "Take the highest risk like my friend", score: 0, effects: { cash: -2000, sip: 1600 },
        note: "Big swings made you nervous, and you sold low." },
      { text: "Pick the lowest and expect big returns", score: 1, effects: { cash: -2000, sip: 2000 },
        note: "Lower risk usually means lower growth." }
    ],
    why: "Mutual funds show a risk-o-meter with six levels from low to very high. Higher risk can mean bigger swings in both directions. Choose a level you can live with."
  },
  {
    module: 9, age: 25,
    title: "Two Funds, Same Index",
    concept: "Index funds and tracking",
    situation: "Two index funds both follow the Nifty 50. Their returns differ slightly. You wonder why, and which to choose.",
    choices: [
      { text: "Compare how closely each tracks the index", score: 3, effects: { cash: -2000, sip: 2000 },
        note: "You learned that small tracking differences exist." },
      { text: "Pick the one with the nicer name", score: 1, effects: { cash: -2000, sip: 1950 },
        note: "A name tells you nothing about tracking." },
      { text: "Buy both without reading", score: 1, effects: { cash: -4000, sip: 3950 },
        note: "Two funds on the same index add little." }
    ],
    why: "An index fund tries to copy an index by holding the same companies in the same proportion. A small tracking difference or error can exist. It is still not risk-free."
  },
  {
    module: 4, age: 25,
    title: "Review: The Late-Night Call",
    concept: "Review: scams",
    situation: "At night a caller says, \"I am from your bank. A ₹40,000 payment is pending. Read out the OTP to cancel it.\" It sounds very real.",
    choices: [
      { text: "Hang up, check the bank app, report on 1930", score: 3, effects: {},
        note: "No money moved. You applied what you learned." },
      { text: "Read out the OTP to stop the payment", score: 0, effects: { cash: -8000 },
        note: "The OTP let them take your money." },
      { text: "Call back on the number they gave", score: 1, effects: { cash: -2000 },
        note: "That number led back to the same fraudster." }
    ],
    why: "Banks never ask for your OTP, PIN or password. If you share them yourself, you bear the loss until you report. Report cyber fraud quickly at cybercrime.gov.in or on 1930."
  },
  {
    module: 6, age: 25,
    title: "Review: Where Does ₹10,000 Go?",
    concept: "Review: savings choices",
    situation: "You have ₹10,000 spare. You have no emergency fund yet. A friend suggests investing all of it in a risky fund.",
    choices: [
      { text: "Start my emergency fund first", score: 3, effects: { cash: -10000, savings: 10000 },
        note: "Safety first. Investing can follow." },
      { text: "Put all of it in the risky fund", score: 1, effects: { cash: -10000, sip: 8800 },
        note: "A dip came just when you needed the money." },
      { text: "Spend it on a gadget", score: 0, effects: { cash: -10000 },
        note: "Fun now, but no cushion for surprises." }
    ],
    why: "An emergency fund comes first, in a safe, easy-to-reach place. After that, you can think about higher-risk investing. Safe tools pay less but are more predictable."
  },
  {
    module: 1, age: 25,
    title: "Review: Your Salary Plan",
    concept: "Review: budgeting",
    situation: "It is the end of the month and your salary has arrived. You remember the 50/30/20 idea, and also that wants can sneak up on you.",
    choices: [
      { text: "Split it: needs, wants, then savings and SIP first", score: 3, effects: { cash: -5000, savings: 2500, sip: 2500 },
        note: "Your salary went to a plan, not to chance." },
      { text: "Spend now, save what is left", score: 1, effects: {},
        note: "Little was left." },
      { text: "Spend it all, I earned it", score: 0, effects: { cash: -5000 },
        note: "No savings were built this month." }
    ],
    why: "The 50/30/20 rule is a guide: about half for needs, 30% for wants, 20% for savings. Moving savings first makes sure they happen. Adjust the split to your life."
  },

  // ---------- Chapter 9: SIPs and First Investment ----------
  {
    module: 9, age: 25,
    title: "Your First SIP",
    concept: "SIP",
    situation: "A mutual fund SIP lets you invest a fixed amount every month. You can start with ₹500 a month, or put ₹6,000 in at once.",
    choices: [
      { text: "Start a ₹500 monthly SIP", score: 3, effects: { sipMonthly: 500 },
        note: "A steady habit. ₹500 will go in every month." },
      { text: "Put ₹6,000 in all at once", score: 2, effects: { cash: -6000, sip: 6000 },
        note: "A big step, but all your money went in on one day." },
      { text: "Wait for the perfect moment", score: 1, effects: {},
        note: "The perfect moment rarely announces itself." }
    ],
    why: "A SIP invests a fixed amount at regular intervals. Each instalment buys units at that day's NAV, so a lower NAV buys more units. A SIP does not guarantee profit."
  },
  {
    module: 9, age: 25,
    title: "Choosing a Fund",
    concept: "Index funds and risk-o-meter",
    situation: "You have ₹2,000 to invest. One fund copies the Nifty 50. Another is called a sure-profit fund by a friend.",
    choices: [
      { text: "Index fund, after checking its risk-o-meter", score: 3, effects: { cash: -2000, sip: 2000 },
        note: "You picked a fund that fits your comfort with risk." },
      { text: "The friend's sure-profit fund", score: 0, effects: { cash: -2000, sip: 1700 },
        note: "No fund can promise profit. Yours dipped." },
      { text: "Skip investing until I'm rich", score: 1, effects: {},
        note: "Waiting to be rich means missing years of growth." }
    ],
    why: "An index fund tries to copy an index, like the Nifty 50. Every mutual fund shows a risk-o-meter with six levels, from low to very high. Check it before you invest."
  }
];
