// MoneyQuest extras: general life events (the EVENTS pool) and the "Scam or Real?" speed round.
// Events look just like turns in turns.js, so game.js plays them with the same screens.
// Each event also has: id, kind, minAge and maxAge (the ages it can show up at).

// ---------- Speed round content ----------

// The 5 messages of the speed round: 3 scams and 2 genuine ones.
const SPEED_MESSAGES = [
  {
    scam: true, from: "UPI-HELP", text: "Money is waiting for you! Approve this request and enter your UPI PIN to receive ₹2,000.", link: "",
    why: "A PIN is only for sending money. You never need it to receive money."
  },
  {
    scam: false, from: "YOURBANK", text: "123456 is your OTP for the payment you just made. Do not share it with anyone, even bank staff.", link: "",
    why: "This one is real. You started the payment yourself, and the message warns you not to share the OTP."
  },
  {
    scam: true, from: "Bank Officer", text: "Your account will close tonight. To save it, read out the OTP you just got.", link: "",
    why: "Banks never ask for your OTP, PIN or password. Anyone who does is a scammer."
  },
  {
    scam: false, from: "YOURBANK", text: "Reminder: your EMI of ₹1,100 is due on the 5th. Please keep enough balance in your account.", link: "",
    why: "This one is real. It only reminds you of a payment and asks for no OTP, PIN or link."
  },
  {
    scam: true, from: "NEW-OFFER", text: "Update your banking app now for rewards. Install the file from this link:", link: "bank-update-app.apk",
    why: "Some frauds use fake banking app files and need no OTP at all. Update apps only from your bank's official app."
  }
];

// ---------- Helpers ----------

// Returns the HTML of a phone message card (sender, text and an optional link).
function buildPhoneHtml(sms) {
  return '<div class="phone-frame"><div class="sms-sender">' + sms.from + "</div>" +
    '<div class="sms-bubble">' + sms.text +
    (sms.link ? ' <span class="sms-link">' + sms.link + "</span>" : "") + "</div></div>";
}

// Returns a shuffled copy of a list.
function shuffleList(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]; copy[i] = copy[j]; copy[j] = temp;
  }
  return copy;
}

// Notes a decision (for the Report Card) and the concept learned.
function recordDecision(chapterName, title, choice, score, concept) {
  state.decisions.push({ chapter: chapterName, title: title, choice: choice, score: score });
  if (concept && state.concepts.indexOf(concept) === -1) state.concepts.push(concept);
}

// Builds the 3 choices of a scam message from this event's own texts: safe (3), pause and ask (2), fall for it (0).
function scamChoices(loss, t) {
  return [
    { text: t[0][0], score: 3, effects: {}, note: t[0][1] },
    { text: t[1][0], score: 2, effects: {}, note: t[1][1] },
    { text: t[2][0], score: 0, effects: { cash: -loss }, note: t[2][1] }
  ];
}

// Builds the 3 choices of a surprise bill from this event's own texts: use savings (3), borrow (1), delay (0, costs 30% more).
function billChoices(cost, t) {
  return [
    { text: t[0][0], score: 3, effects: { savings: -cost }, note: t[0][1] },
    { text: t[1][0], score: 1, effects: { debt: cost }, note: t[1][1] },
    { text: t[2][0], score: 0, effects: { cash: -Math.round(cost * 1.3) }, note: t[2][1] }
  ];
}

// ---------- General life events (about 3 per age) ----------

const EVENTS = [
  // --- Scam messages ---
  {
    id: "ev-card-blocked", kind: "scam", minAge: 18, maxAge: 25, module: 0, title: "Card Blocked Call", concept: "Spotting scams",
    sms: { from: "+91 98xxxx", text: "Hello, I am from your bank. Your card is blocked. Please tell me the OTP now to unblock it.", link: "" },
    situation: "Your phone buzzes with a message. It sounds urgent and official.",
    choices: scamChoices(1500, [
      ["Hang up and call the number on my card", "Your card was fine. Banks never ask for an OTP, and the number on your card is the real one."],
      ["Tell the caller I will check with my family first", "Pausing to ask someone you trust is smart. A real bank can wait while you check."],
      ["Share the OTP quickly so the card stays usable", "The caller used the OTP to take ₹1,500. Tell your bank and report on 1930 quickly."]
    ]),
    why: "Banks, RBI and genuine entities never ask for your OTP, PIN or passwords. Even if the caller sounds like a bank official, never share them."
  },
  {
    id: "ev-refund", kind: "scam", minAge: 18, maxAge: 25, module: 0, title: "The Refund Request", concept: "Spotting scams",
    sms: { from: "UPI-REFUND", text: "You have a refund of ₹1,500. Approve the request and enter your UPI PIN to receive it.", link: "" },
    situation: "A message says money is waiting for you. All you must do is approve a request.",
    choices: scamChoices(1500, [
      ["Open my UPI app and look for the refund myself", "No refund was there. A PIN is only for sending money. You can report such requests on 1930."],
      ["Show the message to a friend who uses UPI daily", "Your friend knew a PIN is never needed to receive money. Good pause."],
      ["Approve the request to get my ₹1,500 back", "Entering your PIN sent ₹1,500 away. Tell your bank and report on 1930 quickly."]
    ]),
    why: "You never need a PIN to receive money. Entering your UPI PIN means you are sending money, not receiving it."
  },
  {
    id: "ev-cashback-app", kind: "scam", minAge: 18, maxAge: 25, module: 0, title: "Free Cashback App", concept: "Spotting scams",
    sms: { from: "CASHBACK-OFFER", text: "Get free cashback! Install our bank app file to claim it.", link: "bank-cashback-app.apk" },
    situation: "An offer says you can claim free cashback by installing an app file.",
    choices: scamChoices(1500, [
      ["Look for the offer inside my bank's official app", "It was not there. Apps installed from links can read your screen and messages."],
      ["Ask my cousin who works in IT about it", "Smart to ask. Official apps come only from the Play Store or App Store."],
      ["Install the file to claim the cashback", "The app copied your messages and took ₹1,500. Tell your bank and report on 1930 quickly."]
    ]),
    why: "Some frauds need no OTP at all, like fake banking app files and screen-sharing apps. Install apps only from official stores, and report fraud on 1930."
  },
  {
    id: "ev-prize-link", kind: "scam", minAge: 18, maxAge: 25, module: 0, title: "You Won a Phone!", concept: "Spotting scams",
    sms: { from: "WIN-PRIZE", text: "Congratulations! You won a new phone. Pay a ₹99 delivery fee on this page to claim:", link: "claim-prize-now.in" },
    situation: "You never entered any contest, yet a message says you have won a prize.",
    choices: scamChoices(1200, [
      ["Search for the contest name and check if it is real", "No such contest existed. A prize you never entered for is a warning sign."],
      ["Ask friends if they got the same message", "Several friends got it too. Identical messages point to mass fraud."],
      ["Pay the ₹99 fee, it is small for a new phone", "The page took your card details and ₹1,200. Tell your bank and report on 1930 quickly."]
    ]),
    why: "A prize you never entered for is a warning sign. Genuine entities never ask for your OTP, PIN or passwords. If you share them yourself, you bear the loss until you report it."
  },
  {
    id: "ev-power-cut", kind: "scam", minAge: 19, maxAge: 25, module: 0, title: "Electricity Cut Warning", concept: "Spotting scams",
    sms: { from: "VM-POWERBL", text: "Your electricity will be cut tonight. Call now and install our support app:", link: "support-help.apk" },
    situation: "A message threatens to cut your home's electricity tonight unless you act fast.",
    choices: scamChoices(2000, [
      ["Check my bill on the electricity board's own app", "No dues were shown. A real board does not ask you to install apps by message."],
      ["Call my parent who handles the home bills", "They confirmed the bill was paid. Good pause before acting."],
      ["Call and install the support app to keep the power on", "The app shared your screen and ₹2,000 left your account. Report on 1930 quickly."]
    ]),
    why: "Fraudsters use urgency to stop you thinking. Some frauds need no OTP at all, like fake app files. Check with the real office, and report fraud on 1930."
  },

  // --- Emergency bills ---
  {
    id: "ev-cracked-screen", kind: "emergency", minAge: 18, maxAge: 21, module: 0, title: "Cracked Phone Screen", concept: "Emergency fund",
    situation: "Your phone slips from your hand and the screen cracks. The repair shop says it costs ₹1,500.",
    choices: billChoices(1500, [
      ["Use my emergency savings for the repair", "That is what an emergency fund is for. Try to refill it soon."],
      ["Borrow ₹1,500 from a friend until payday", "The screen is fixed, but you now owe the money back."],
      ["Use the cracked phone and repair it later", "The crack spread and the repair later cost ₹1,950."]
    ]),
    why: "An emergency fund is money kept aside for surprises, so you do not have to borrow. Even a small one helps. Refill it as soon as you can."
  },
  {
    id: "ev-doctor", kind: "emergency", minAge: 18, maxAge: 21, module: 0, title: "Doctor Visit", concept: "Emergency fund",
    situation: "A bad fever means a doctor visit and medicines. The bill comes to ₹2,000.",
    choices: billChoices(2000, [
      ["Pay the doctor and pharmacy from my savings", "Your savings handled it calmly. Plan to refill them."],
      ["Ask a cousin to cover it for now", "You got treated at once, but you owe ₹2,000."],
      ["Rest at home and skip the medicines", "The fever got worse and treatment later cost ₹2,600."]
    ]),
    why: "Health costs often come without warning. Savings kept for surprises let you pay quickly and calmly. Borrowing for it adds a second worry."
  },
  {
    id: "ev-laptop", kind: "emergency", minAge: 20, maxAge: 23, module: 0, title: "Laptop Won't Start", concept: "Emergency fund",
    situation: "Your laptop dies a week before your work deadline. The repair costs ₹4,000.",
    choices: billChoices(4000, [
      ["Pay for the repair from my savings", "Your laptop works again and the deadline is safe. Rebuild your fund."],
      ["Borrow ₹4,000 from a colleague", "Fixed on time, but a colleague now expects it back."],
      ["Borrow a friend's laptop and repair it later", "The fault grew and the later repair cost ₹5,200."]
    ]),
    why: "Big surprises are why we keep an emergency fund. A common idea is to save a few months of basic costs. Pay yourself back into it after the shock."
  },
  {
    id: "ev-bike-repair", kind: "emergency", minAge: 22, maxAge: 25, module: 0, title: "Bike Breakdown", concept: "Emergency fund",
    situation: "Your bike's engine fails on the way to work. The mechanic quotes ₹5,000.",
    choices: billChoices(5000, [
      ["Pay the mechanic from my savings", "You are back on the road without a loan. Top up the fund soon."],
      ["Take an advance from a relative", "The bike runs again, but you owe ₹5,000."],
      ["Take buses for now and fix the bike next month", "Bus fares piled up and the fault worsened. Total cost ₹6,500."]
    ]),
    why: "Needs like getting to work cannot wait. Money set aside for surprises keeps you moving without a loan. Delays often cost more."
  },
  {
    id: "ev-medical", kind: "emergency", minAge: 23, maxAge: 25, module: 0, title: "Family Medical Bill", concept: "Emergency fund",
    situation: "A relative falls ill and the family needs ₹8,000 right now. You want to help.",
    choices: billChoices(8000, [
      ["Give the money from my savings", "You helped right away without borrowing. Plan to rebuild your cushion."],
      ["Borrow it so my savings stay untouched", "Your savings are safe, but now you owe ₹8,000."],
      ["Promise to send help next week", "The hospital added charges for the delay. It cost ₹10,400."]
    ]),
    why: "Emergencies are why savings matter. A cushion lets you help without borrowing at a bad time. Plan to rebuild it afterwards."
  },

  // --- Festivals and family ---
  {
    id: "ev-festival-sale", kind: "festival", minAge: 19, maxAge: 25, module: 0, title: "Festival Shopping Rush", concept: "Needs vs wants",
    situation: "Every shop and app shouts \"Festival Sale!\". You planned to buy a ₹1,500 kurta, but five more \"deals\" look tempting.",
    choices: [
      { text: "Buy only what is on my list", score: 3, effects: { cash: -1500 }, note: "You enjoyed the festival and stayed on budget." },
      { text: "Add three \"deals\" to the cart", score: 0, effects: { cash: -4500 }, note: "The bill tripled. Most of it was not planned." },
      { text: "Skip the sale, wear what I have", score: 2, effects: {}, note: "Very disciplined, though a planned treat is fine too." }
    ],
    why: "Sales are made to make you buy more. A shopping list separates needs from impulses. A discount on something you did not need is still money spent."
  },
  {
    id: "ev-rakhi-gift", kind: "festival", minAge: 18, maxAge: 25, module: 0, title: "Rakhi Gift Budget", concept: "Budgeting",
    situation: "Rakhi is near and you want to give your sibling a gift. A fancy one costs ₹2,000, but you set aside ₹1,000 for it.",
    choices: [
      { text: "Pick a thoughtful gift within ₹1,000", score: 3, effects: { cash: -1000 }, note: "A caring gift, and no stress on your wallet." },
      { text: "Buy the ₹2,000 one by borrowing", score: 0, effects: { cash: -1000, debt: 1000 }, note: "Now a happy day comes with a debt." },
      { text: "Skip the gift this year", score: 1, effects: {}, note: "Safe for your wallet, but you missed a joyful moment." }
    ],
    why: "A budget lets you give happily without borrowing. A thoughtful gift often means more than its price. Borrowing for a gift turns joy into worry."
  },
  {
    id: "ev-shagun", kind: "festival", minAge: 20, maxAge: 25, module: 0, title: "Cousin's Wedding", concept: "Budgeting",
    situation: "A cousin's wedding is coming and custom says to give shagun. You planned ₹1,100, but a friend says to give ₹5,000 to look generous.",
    choices: [
      { text: "Give the ₹1,100 I planned", score: 3, effects: { cash: -1100 }, note: "You honoured the custom within your means." },
      { text: "Give ₹5,000 to impress", score: 0, effects: { cash: -5000 }, note: "Your savings took a big hit for show." },
      { text: "Skip the wedding to save money", score: 1, effects: {}, note: "You saved money but missed a family moment." }
    ],
    why: "Spend on what matters to you, not to impress others. A plan keeps family occasions joyful. Your wallet should fit your own budget."
  },

  // --- A friend asks for money ---
  {
    id: "ev-friend-2000", kind: "friend", minAge: 18, maxAge: 21, module: 0, title: "Friend Needs ₹2,000", concept: "Lending to friends",
    situation: "A friend asks to borrow ₹2,000 for a trip and promises to return it next month. You have ₹3,000 spare.",
    choices: [
      { text: "Lend only ₹500 I can afford to lose", score: 3, effects: { cash: -500 }, note: "You helped without risking your own plans." },
      { text: "Lend the full ₹2,000", score: 1, effects: { cash: -2000 }, note: "Risky. Money lent to friends is not always returned." },
      { text: "Say no politely", score: 2, effects: {}, note: "It felt awkward, but your money stays safe." }
    ],
    why: "Lend only an amount you could live without getting back. Saying no politely can protect a friendship better than an unpaid loan. Note down any loan you make."
  },
  {
    id: "ev-friend-10000", kind: "friend", minAge: 22, maxAge: 25, module: 0, title: "A Big Favour", concept: "Lending to friends",
    situation: "A colleague asks to borrow ₹10,000 until next payday. They have been late with repayments before.",
    choices: [
      { text: "Lend ₹2,000 I can afford to lose", score: 3, effects: { cash: -2000 }, note: "You helped within your limits." },
      { text: "Lend the full ₹10,000", score: 0, effects: { cash: -10000 }, note: "Your savings took a big hit and the repayment is uncertain." },
      { text: "Say no politely", score: 2, effects: {}, note: "A clear, kind no avoids later awkwardness." }
    ],
    why: "A past habit of paying late is a warning. Never lend money you need yourself. A smaller gift you can forgive is safer than a large loan."
  },
  {
    id: "ev-pay-for-all", kind: "friend", minAge: 19, maxAge: 25, module: 0, title: "\"You Pay, I'll UPI You Later\"", concept: "Lending to friends",
    situation: "After dinner, the bill is ₹3,000 for five friends. One says, \"You pay on your card, we'll all send you our share later.\"",
    choices: [
      { text: "Pay only my own share", score: 3, effects: { cash: -600 }, note: "Clean and simple. Everyone pays for themselves." },
      { text: "Pay it all and ask them on the spot", score: 2, effects: { cash: -1000 }, note: "Most paid right away, but you are still waiting for two." },
      { text: "Pay it all and hope they remember", score: 0, effects: { cash: -2500 }, note: "Most \"later\" payments never arrive." }
    ],
    why: "Split bills at the table with UPI, while everyone is there. \"Later\" often becomes \"never\". Do not become the group's bank."
  },

  // --- Pay raises (they change your monthly income) ---
  {
    id: "ev-raise-small", kind: "raise", minAge: 20, maxAge: 23, module: 0, title: "Pay Raise!", concept: "Pay raise habits",
    situation: "Good news! Your pay goes up by ₹1,000 a month. What will you do with it?",
    choices: [
      { text: "Start a ₹500 SIP and enjoy the rest", score: 3, effects: { incomeBoost: 1000, expenseBoost: 500, sipMonthly: 500 },
        note: "Your income rose and ₹500 now goes into a SIP every month." },
      { text: "Keep my lifestyle and bank the whole raise", score: 2, effects: { incomeBoost: 1000 },
        note: "Your extra ₹1,000 piles up as cash each month." },
      { text: "Treat myself with the extra ₹1,000 each month", score: 1, effects: { incomeBoost: 1000, expenseBoost: 1000 },
        note: "Your income rose, but your spending rose too, so you save no extra." }
    ],
    why: "A raise is a good time to save more. When you save part of it right away, you never miss it. Habits that grow with your income last."
  },
  {
    id: "ev-raise-big", kind: "raise", minAge: 23, maxAge: 25, module: 0, title: "Promotion Time", concept: "Pay raise habits",
    situation: "You get a promotion and your pay goes up by ₹3,000 a month. Your friends say it is time to upgrade your lifestyle.",
    choices: [
      { text: "Put ₹1,500 into a SIP and upgrade a little", score: 3, effects: { incomeBoost: 3000, expenseBoost: 1500, sipMonthly: 1500 },
        note: "Your income rose and ₹1,500 now goes into a SIP every month." },
      { text: "Save the whole ₹3,000 for the next year", score: 2, effects: { incomeBoost: 3000 },
        note: "Your extra ₹3,000 piles up as cash each month." },
      { text: "Move to a pricier flat and buy new gadgets", score: 1, effects: { incomeBoost: 3000, expenseBoost: 3000 },
        note: "A nicer life now, but nothing extra saved." }
    ],
    why: "When pay rises, spending tends to rise with it. Deciding in advance where the extra goes keeps you in control. A small, steady habit beats a big splurge."
  },

  // --- Everyday surprises ---
  {
    id: "ev-lost-wallet", kind: "misc", minAge: 18, maxAge: 25, module: 0, title: "Lost Wallet", concept: "Reporting fast",
    situation: "You realise your wallet is missing. It had ₹800 cash, your ID and your debit card.",
    choices: [
      { text: "Block the card in the bank app now", score: 3, effects: { cash: -800 }, note: "Only the cash is lost. Your card cannot be misused." },
      { text: "Block it later this week", score: 1, effects: { cash: -1500 }, note: "Someone used the card before you blocked it." },
      { text: "Wait to see if it turns up", score: 0, effects: { cash: -2500 }, note: "Waiting cost you far more than the cash." }
    ],
    why: "Tell your bank quickly if a card is lost. Fast reporting limits the damage. Keep your PIN secret and never write it on the card."
  },
  {
    id: "ev-check-name", kind: "misc", minAge: 18, maxAge: 25, module: 0, title: "Unknown Name on UPI", concept: "UPI safety",
    situation: "You are about to pay ₹1,000 to a number a seller gave you. Your UPI app shows a name that does not match the seller.",
    choices: [
      { text: "Stop and check the number first", score: 3, effects: {}, note: "Good catch. The seller had given a wrong number." },
      { text: "Send ₹10 first as a test", score: 2, effects: { cash: -10 }, note: "A careful trick. The name still did not match." },
      { text: "Pay anyway, it is probably fine", score: 0, effects: { cash: -1000 }, note: "The money went to a stranger and is hard to get back." }
    ],
    why: "A UPI app shows the receiver's name before you pay, so read it. Money sent to the wrong person may be hard to get back. Checking takes five seconds."
  },
  {
    id: "ev-free-trial", kind: "misc", minAge: 18, maxAge: 25, module: 0, title: "The Free Trial Trap", concept: "Reading the fine print",
    situation: "A video app offers a free month. After that, it charges ₹499 every month unless you cancel.",
    choices: [
      { text: "Set a reminder and cancel in time", score: 3, effects: {}, note: "You watched for free and paid nothing." },
      { text: "Keep it, I might use it", score: 1, effects: { cash: -499 }, note: "You pay ₹499 now, and again every month." },
      { text: "Forget about it", score: 0, effects: { cash: -1500 }, note: "Three months of charges passed before you noticed." }
    ],
    why: "Many free trials turn into paid plans automatically. Read the terms and set a reminder. Small monthly charges add up over a year."
  },
  {
    id: "ev-birthday-money", kind: "misc", minAge: 18, maxAge: 21, module: 0, title: "Birthday Money", concept: "Saving for a goal",
    situation: "An aunt sends ₹1,500 for your birthday. You want a ₹1,200 game, but you are also saving for a ₹5,000 headset.",
    choices: [
      { text: "Put all ₹1,500 toward the headset", score: 3, effects: { savings: 1500 }, note: "Your goal fund jumped ahead." },
      { text: "Buy the game and keep the rest", score: 2, effects: { cash: 300 }, note: "You enjoyed a treat and saved a little." },
      { text: "Spend it all on treats", score: 0, effects: {}, note: "A fun day, but the goal did not move." }
    ],
    why: "A clear goal makes saving easier. Gifts are a chance to move closer to it. It is fine to enjoy a treat, as long as it is a choice."
  },
  {
    id: "ev-side-gig", kind: "misc", minAge: 20, maxAge: 25, module: 0, title: "Weekend Gig Offer", concept: "Earning more",
    situation: "A neighbour offers ₹3,000 to design posters this weekend. It clashes with a friend's party.",
    choices: [
      { text: "Take the gig, party another day", score: 3, effects: { cash: 3000 }, note: "Extra income, and your friend understood." },
      { text: "Do half the work for ₹1,500", score: 2, effects: { cash: 1500 }, note: "You made some money and still saw your friends." },
      { text: "Go to the party", score: 1, effects: {}, note: "Great memories, but no extra income." }
    ],
    why: "Extra income gives you more to save and invest. Your time has value, but so do friendships. Balance both."
  },
  {
    id: "ev-recharge-upsell", kind: "misc", minAge: 18, maxAge: 25, module: 0, title: "Recharge Upsell", concept: "Needs vs wants",
    situation: "A shopkeeper pushes a ₹2,000 \"premium\" yearly recharge. Your own usage fits a ₹800 pack.",
    choices: [
      { text: "Pick the pack that fits my use", score: 3, effects: { cash: -800 }, note: "You paid for what you actually use." },
      { text: "Ask for a month-by-month pack", score: 2, effects: { cash: -1000 }, note: "Flexible, though slightly dearer overall." },
      { text: "Take the premium one", score: 0, effects: { cash: -2000 }, note: "You paid for features you will never use." }
    ],
    why: "Pay for what you need, not for what sounds fancy. Compare price against your real use. It is a need versus want choice."
  }
];

// Difficulty of every event (easy to extreme), used to order situations within an age.
const EVENT_LEVELS = {
  "ev-card-blocked": "medium", "ev-refund": "medium", "ev-cashback-app": "hard", "ev-prize-link": "easy", "ev-power-cut": "hard",
  "ev-cracked-screen": "easy", "ev-doctor": "easy", "ev-laptop": "medium", "ev-bike-repair": "medium", "ev-medical": "hard",
  "ev-festival-sale": "easy", "ev-rakhi-gift": "easy", "ev-shagun": "medium",
  "ev-friend-2000": "easy", "ev-friend-10000": "hard", "ev-pay-for-all": "medium",
  "ev-raise-small": "medium", "ev-raise-big": "hard",
  "ev-lost-wallet": "medium", "ev-check-name": "hard", "ev-free-trial": "easy", "ev-birthday-money": "easy",
  "ev-side-gig": "medium", "ev-recharge-upsell": "easy"
};
EVENTS.forEach(function (e) { e.difficulty = EVENT_LEVELS[e.id] || "medium"; });

// ---------- Scam or Real? speed round ----------

// Starts the speed round with the 5 messages in a random order.
function startSpeedRound() {
  state.speed = { list: shuffleList(SPEED_MESSAGES), index: 0, right: 0 };
  showSpeedMessage();
}

// Shows the current message with the two answer buttons.
function showSpeedMessage() {
  const round = state.speed;
  setScreen(
    '<div class="chapter-label">⚡ Speed round · Message ' + (round.index + 1) + " of " + round.list.length + "</div>" +
    "<h2>Scam or Real?</h2>" +
    "<p>Decide fast. Is this message safe?</p>" +
    buildPhoneHtml(round.list[round.index]) +
    '<div class="scam-actions">' +
    '<button class="btn btn-report" onclick="answerSpeed(true)">🚩 It\'s a scam</button>' +
    '<button class="btn btn-click" onclick="answerSpeed(false)">✅ It\'s real</button>' +
    "</div>"
  );
}

// Checks the player's answer and shows why.
function answerSpeed(saidScam) {
  const round = state.speed;
  const message = round.list[round.index];
  const correct = saidScam === message.scam;
  const before = takeSnapshot();
  let note;
  if (correct) {
    round.right += 1;
    note = message.scam ? "Right! You spotted the scam." : "Right! This message is genuine.";
  } else if (message.scam) {
    applyEffects({ cash: -500 });
    updateDashboard(before);
    note = "Oops, that was a scam. You lost ₹500.";
  } else {
    note = "That one was genuine. Not everything is a scam.";
  }
  const last = round.index === round.list.length - 1;
  setScreen(
    '<div class="center"><div class="big-emoji">' + (correct ? "✅" : "❌") + "</div></div>" +
    "<h2>" + note + "</h2>" +
    '<div class="why-card"><strong>💡 Why?</strong><br>' + renderWhyText(message.why) + "</div>" +
    '<button class="btn" onclick="nextSpeed()">' + (last ? "See my score ▶" : "Next message ▶") + "</button>"
  );
}

// Goes to the next message, or finishes the round.
function nextSpeed() {
  state.speed.index += 1;
  if (state.speed.index < state.speed.list.length) showSpeedMessage();
  else finishSpeedRound();
}

// Shows the speed round score and saves it for the Report Card.
function finishSpeedRound() {
  const right = state.speed.right;
  const total = state.speed.list.length;
  const score = right >= 4 ? 3 : right === 3 ? 2 : right === 2 ? 1 : 0;
  state.speedDone = true;
  state.speedScore = right;
  recordDecision("Scams and Safe Banking", "Scam or Real? speed round",
    right + " of " + total + " correct", score, "Spotting scams");
  const verdict = right === total ? "Perfect! You are scam-proof."
    : right >= 3 ? "Nice! You spot most scams."
    : "Keep practising. Scammers sound convincing.";
  setScreen(
    '<div class="center"><div class="big-emoji">🛡️</div></div>' +
    "<h2>You got " + right + " of " + total + " right</h2>" +
    "<p>" + verdict + "</p>" +
    '<button class="btn" onclick="nextSituation()">Continue ⏩</button>'
  );
}
