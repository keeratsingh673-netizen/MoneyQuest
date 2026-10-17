// Glossary terms (facts only from RESEARCH.md; numbers are examples, not current rates).
// Each entry: [term, category, meaning, Indian example, optional list of words to link in Why? cards].
// Meaning + example are kept under 35 words together.
const GLOSSARY_CATEGORIES = ["Basics", "Banking", "Credit", "Investing", "Markets", "Scams"];

const GLOSSARY_RAW = [
  // --- Basics ---
  ["Inflation", "Basics", "A sustained rise in general prices, so your money buys less over time.", "A ₹100 snack costing ₹105 next year means your ₹100 buys less."],
  ["CPI", "Basics", "Consumer Price Index, the measure India uses to track inflation.", "RBI watches CPI to see how fast everyday prices are rising."],
  ["Budget", "Basics", "A plan that shares your income between needs, wants and savings.", "Riya sets aside rent and bus pass money first, then plans fun spending."],
  ["50/30/20 rule", "Basics", "A budget split of needs, wants and savings, in that 50, 30, 20 proportion.", "On ₹20,000 a month, about ₹4,000 would go to savings.", ["50/30/20"]],
  ["Emergency fund", "Basics", "Money kept aside for surprises like a hospital bill or a broken phone.", "Arjun keeps a few months of expenses in his savings account for emergencies."],
  ["Exchange rate", "Basics", "How many rupees one unit of a foreign currency costs; it changes every day.", "If $1 costs ₹80, a $20 gift card costs about ₹1,600."],
  ["Interest", "Basics", "The extra money a bank pays you for saving, or charges you for borrowing.", "Your bank adds interest to your savings account every few months."],
  ["Simple interest", "Basics", "Interest worked out only on the original amount: P × r × t.", "₹1,000 at 10% simple interest earns ₹100 each year, always."],
  ["Compound interest", "Basics", "Interest earned on your money and on the interest added before.", "₹1,000 at 10% becomes ₹1,100, then earns interest on ₹1,100."],

  // --- Banking ---
  ["Savings account", "Banking", "A bank account that keeps your money safe and pays you some interest.", "Meera opens a savings account to keep her pocket money safe."],
  ["Minimum balance", "Banking", "The least amount some accounts need; below it, the bank may charge a fee.", "Falling under the required balance can cost a small charge. Ask before opening."],
  ["KYC", "Banking", "Know Your Customer: the bank checks who you are using a photo and an ID.", "Kabir shows his PAN or Aadhaar letter and a photo to open an account.", ["KYC", "Know Your Customer"]],
  ["Officially valid document", "Banking", "An ID, such as a passport, driving licence, voter ID, PAN or Aadhaar letter, accepted for KYC.", "A driving licence can prove who you are.", ["officially valid document", "OVD", "Aadhaar", "PAN"]],
  ["Fixed deposit (FD)", "Banking", "You lock a sum with the bank for a fixed time and earn interest.", "Nisha puts ₹10,000 in an FD for a year at, for example, around 7%.", ["fixed deposit", "FD"]],
  ["Recurring deposit (RD)", "Banking", "You deposit a fixed amount every month for a fixed period.", "Dev puts ₹500 into an RD every month for 12 months.", ["recurring deposit", "RD"]],
  ["Premature withdrawal", "Banking", "Taking out an FD before its end date; the bank may charge a penalty.", "Closing an FD early usually pays a lower interest rate.", ["premature withdrawal", "early closure", "premature"]],
  ["DICGC", "Banking", "The body that insures bank deposits up to ₹5 lakh per depositor per bank; the bank pays the premium.", "If your bank fails, up to ₹5 lakh of your money is insured."],
  ["PPF", "Banking", "Public Provident Fund: a 15-year government-backed savings scheme with tax-free interest.", "A parent deposits up to ₹1.5 lakh a year; the rate is set quarterly."],
  ["UPI", "Banking", "A way to send money from your bank account using your phone and a UPI PIN.", "Aman pays the chai seller by scanning a QR code with UPI."],

  // --- Credit ---
  ["Credit score", "Credit", "A number from 300 to 900 showing how reliably you repay; higher is better.", "Paying EMIs on time helps your score; late payments lower it.", ["credit score"]],
  ["CIBIL", "Credit", "One of the credit bureaus authorised by RBI that creates your credit score and report.", "A lender checks your CIBIL score before approving a loan."],
  ["Credit report", "Credit", "A record of your loans and repayments; you can get one free report each calendar year.", "Check your free yearly report for mistakes."],
  ["EMI", "Credit", "Equated Monthly Instalment: a fixed monthly payment of principal plus interest.", "A phone loan of ₹12,000 might be repaid as ₹1,100 EMIs.", ["EMI", "Equated Monthly Instalment", "instalment"]],
  ["Zero-cost EMI", "Credit", "An EMI offer sold as free of interest; RBI says no interest may be hidden.", "Read the bill closely, because a discount or fee may hide the cost.", ["zero-cost EMI", "no-cost EMI"]],
  ["Debt", "Credit", "Money you have borrowed and must pay back, usually with interest.", "A student loan is debt you repay over several years."],
  ["Principal", "Credit", "The original amount borrowed or invested, before any interest.", "On a ₹50,000 loan, the principal is ₹50,000."],

  // --- Investing ---
  ["SIP", "Investing", "Systematic Investment Plan: investing a fixed amount at regular intervals. It does not guarantee profit.", "Tara invests ₹1,000 every month in a mutual fund."],
  ["Mutual fund", "Investing", "A fund that pools many people's money and invests it in shares or other assets.", "Ishaan puts ₹500 a month into a mutual fund through a SIP."],
  ["NAV", "Investing", "Net Asset Value: the price of one fund unit, published daily.", "If NAV falls, your next SIP buys more units."],
  ["Index fund", "Investing", "A fund that copies an index by holding the same companies in the same proportion.", "An index fund copying the Nifty 50 holds those 50 companies."],
  ["Risk-o-meter", "Investing", "A six-level label on mutual funds, from low risk to very high risk.", "Check the risk-o-meter before choosing a fund."],
  ["Tracking error", "Investing", "The small gap between an index fund's returns and the index it copies.", "An index fund may trail its index by a tiny amount.", ["tracking error", "tracking difference"]],

  // --- Markets ---
  ["Share", "Markets", "A small part-ownership of a company; owners may get dividends and vote.", "Owning one share of a company makes you a tiny owner.", ["a share", "shares", "stocks"]],
  ["Stock exchange", "Markets", "A marketplace where shares are bought and sold; India's main ones are NSE and BSE.", "Orders to buy shares go through a stock exchange."],
  ["NSE", "Markets", "National Stock Exchange, one of India's two main stock exchanges.", "The Nifty 50 index is based on NSE companies."],
  ["BSE", "Markets", "Bombay Stock Exchange, one of India's two main stock exchanges.", "The Sensex index is based on BSE companies."],
  ["Nifty 50", "Markets", "An index of 50 large companies listed on the NSE.", "News saying 'Nifty is up' means those big companies rose on average.", ["Nifty 50", "Nifty"]],
  ["Sensex", "Markets", "An index of 30 large companies listed on the BSE.", "A rising Sensex shows large BSE companies doing well."],
  ["IPO", "Markets", "Initial Public Offering: a company sells its shares to the public for the first time.", "A new company lists on the exchange through an IPO."],
  ["Primary market", "Markets", "Where companies first sell new shares, as in an IPO.", "Buying shares in an IPO happens in the primary market."],
  ["Secondary market", "Markets", "Where investors trade existing shares on the exchange.", "Selling your shares to another investor happens here."],
  ["Broker", "Markets", "A SEBI-registered firm through which you buy and sell shares using a trading account.", "Anil opens a trading account with a registered broker."],

  // --- Scams ---
  ["OTP", "Scams", "A one-time code sent to you; banks and RBI never ask you to share it.", "A caller asks for your OTP: hang up, because that is a scam."],
  ["UPI PIN", "Scams", "The secret code for sending money; you never need it to receive money.", "A request asking for your PIN to 'receive' cash is a scam."],
  ["Collect request scam", "Scams", "A fraudster sends a money request and tricks you into approving it with your PIN.", "Rohan gets a 'refund' request; approving it sends money away.", ["collect request", "money request"]],
  ["Screen-sharing scam", "Scams", "A fraudster makes you install a screen-sharing app and watches your phone.", "A fake helpline asks Sana to install an app: do not.", ["screen-sharing", "screen sharing"]],
  ["Fake APK", "Scams", "A fake banking app file sent by message that can steal money without any OTP.", "A link says 'install bank app.apk': ignore it, use the official store.", ["fake APK", "APK"]],
  ["Fake KYC message", "Scams", "A message with a link saying your KYC has expired. Real banks update KYC in their own app or branch.", "Never click such links; open your bank's own app.", ["fake KYC"]],
  ["Cyber fraud helpline", "Scams", "Report cyber fraud quickly on 1930 or at cybercrime.gov.in; keep screenshots.", "After a scam call, Leela reports it on 1930 at once.", ["1930", "cybercrime.gov.in", "helpline"]],
  ["Phishing", "Scams", "A message pretending to be your bank to trick you into giving details.", "An SMS asks for your card details: delete it and call your bank."],
  ["Vishing", "Scams", "A fraud phone call where a fake banker creates urgency to get your OTP, PIN or CVV.", "A caller says your card is blocked: hang up and call the number on your card.", ["vishing", "fraudulent call"]],
  ["Smishing", "Scams", "Phishing done through SMS messages that carry a harmful link.", "A text says 'claim your prize here': delete it without opening the link."],
  ["Unauthorised transaction", "Scams", "A payment from your account that you did not make or approve. Tell your bank at once.", "Kiran sees an unknown debit and reports it to the bank immediately.", ["unauthorised transaction", "fraudulent transaction"]],
  ["Fraud", "Scams", "Cheating someone to take their money or information.", "A fake job offer asking for a registration fee is fraud.", ["fraudster", "frauds", "fraud"]],
  ["PIN", "Scams", "A secret number that approves a payment or card use. Never share it with anyone.", "Your debit card PIN is for you alone, even a friend should not know it."],
  ["CVV", "Scams", "The 3-digit security number on the back of a card. Never tell it to a caller.", "A caller asks for your CVV to 'unblock' your card: that is a scam."],
  ["Password", "Scams", "A secret word that locks your accounts. Banks never ask you to tell it.", "Use a different password for your bank app than for games."],
  ["QR code", "Scams", "A square pattern your phone scans to pay. You never scan one to receive money.", "A 'buyer' asks you to scan a QR to get paid: refuse.", ["QR code", "QR"]],
  ["Net banking", "Banking", "Using your bank's website or app to check balance and send money.", "Asha checks her balance in the bank app before paying rent.", ["net banking", "internet banking", "mobile banking"]],
  ["Bank", "Banking", "A safe place that holds your money, pays interest and lends to others.", "Your savings sit in a bank, and the bank lends part of it to borrowers.", ["banks"]],
  ["Deposit", "Banking", "Money you put into a bank account.", "Putting ₹1,000 into your savings account is a deposit.", []],
  ["Current account", "Banking", "An account meant for businesses with many daily payments, not for saving.", "A shop owner uses a current account for daily sales and bills."],
  ["Basic savings account", "Banking", "A savings account with no minimum balance and no initial deposit, with at least four free withdrawals a month.", "Rina opens a basic savings account with simplified KYC.", ["basic savings bank deposit account", "BSBDA", "basic savings account"]],
  ["Debit card", "Banking", "A bank card that takes money straight from your account when you pay.", "Pay at a shop with your debit card and your balance falls at once.", ["debit card"]],
  ["ATM", "Banking", "A machine where you withdraw cash or check your balance with your card and PIN.", "Ravi withdraws ₹500 at an ATM near the bus stop."],
  ["Account statement", "Banking", "A list of every credit and debit in your account. Check it for charges you do not know.", "Spot a ₹250 charge you do not recognise? Ask the bank.", ["account statement", "statement", "passbook"]],
  ["Maturity", "Banking", "The end date of an FD or RD, when you get your money and interest.", "A 1-year FD matures on the same date next year.", ["maturity", "matures", "mature"]],
  ["Interest rate", "Banking", "The percentage a bank pays you, or charges you, in a year.", "An FD at, for example, 7% a year pays ₹70 on ₹1,000.", ["interest rate", "rate of interest"]],
  ["Liquidity", "Banking", "How quickly you can turn something into usable cash without losing value.", "Savings in a bank account are more liquid than a 5-year deposit.", ["liquid", "liquidity"]],
  ["Money", "Basics", "Anything people accept in exchange for goods and services, which also stores value and measures prices.", "You hand over ₹20 for chai because the seller accepts rupees.", []],
  ["Barter", "Basics", "Swapping goods directly without using money.", "Trading your old cricket bat for a friend's comic books is barter.", ["barter"]],
  ["Currency", "Basics", "The money of a country, such as the rupee in India.", "The rupee is India's currency; the dollar is America's.", ["currencies"]],
  ["Need", "Basics", "Something you must have to live or work, like food, rent or a working phone.", "A bus pass for college is a need.", []],
  ["Want", "Basics", "Something nice to have but not essential.", "The latest sneakers are a want.", []],
  ["Income", "Basics", "Money that comes to you, such as pocket money, a stipend or salary.", "Your first salary is your income.", []],
  ["Expense", "Basics", "Money you spend on needs and wants.", "Chai, travel and phone recharge are monthly expenses.", ["expenses"]],
  ["Saving", "Basics", "Setting money aside instead of spending it, to use later.", "Putting ₹500 away each month is saving.", []],
  ["Net worth", "Basics", "Everything you own minus everything you owe.", "₹10,000 in savings minus a ₹2,000 debt is a net worth of ₹8,000.", ["net worth"]],
  ["Purchasing power", "Basics", "How much you can buy with your money. Inflation lowers it.", "If prices rise, your ₹100 buys fewer samosas.", ["purchasing power", "buying power", "real value"]],
  ["Spread", "Basics", "The gap banks add when converting currency, so you get a slightly worse rate.", "A money changer quotes you ₹84 for a dollar when the market rate is ₹85.", ["spread"]],
  ["Rule of 72", "Basics", "A shortcut estimate: 72 divided by the yearly rate gives the years to double.", "At around 8% a year, money may double in about 9 years.", ["Rule of 72"]],
  ["Pay yourself first", "Basics", "Moving money to savings as soon as you get it, then spending what is left.", "Asha moves ₹500 to savings on salary day before spending.", ["pay yourself first"]],
  ["Compounding", "Basics", "The effect of earning interest on your interest, so growth speeds up over time.", "Over many years, ₹500 a month grows faster each year.", ["compounding", "compounded"]],
  ["Credit card", "Credit", "A card that lets you spend borrowed money and repay later. Late or partial payment adds interest.", "Pay the full card bill each month to avoid interest.", ["credit card"]],
  ["Credit limit", "Credit", "The most a card lets you borrow; it is not your own money.", "A ₹30,000 limit means you can owe up to ₹30,000.", ["credit limit"]],
  ["Minimum due", "Credit", "The smallest part of a card bill you must pay to avoid a late fee; the rest still gets interest.", "Paying only ₹400 of an ₹8,000 bill means interest is charged and the interest-free period is lost.", ["minimum due"]],
  ["Credit bureau", "Credit", "A company authorised by RBI that keeps your credit history and scores.", "CIBIL is a credit bureau that lenders check before lending.", ["credit bureau", "bureau"]],
  ["Loan", "Credit", "Money you borrow and repay, usually with interest.", "A bike loan is repaid in monthly EMIs.", ["loans", "loan"]],
  ["Tenure", "Credit", "The length of time over which a loan or deposit runs.", "A 12-month EMI plan has a tenure of one year.", ["tenure"]],
  ["Return", "Investing", "The gain or loss on money you invested. It is never guaranteed.", "A fund that rises from ₹100 to ₹110 has a 10% return.", ["returns", "return"]],
  ["Risk", "Investing", "The chance that an investment loses value or earns less than hoped.", "Share prices can fall, so shares carry risk.", ["risks", "risk"]],
  ["Diversification", "Investing", "Spreading money across many investments so one bad one hurts less.", "Owning many companies is safer than only one.", ["diversification", "spreading", "diversify"]],
  ["Unit", "Investing", "One small slice of a mutual fund. Your money buys units at that day's NAV.", "₹500 at an NAV of ₹25 buys 20 units.", ["units"]],
  ["Dividend", "Markets", "A share of a company's profit paid to shareholders. It is not guaranteed.", "A ₹3 dividend on 100 shares pays ₹300.", ["dividend"]],
  ["Asset", "Investing", "Something you own that has value, like savings, an FD or shares.", "Your FD and your phone are assets.", ["asset"]],
  ["Index", "Markets", "A number that tracks how a group of companies is doing.", "Sensex tracks 30 big BSE companies.", ["indices", "index"]],
  ["Trading account", "Markets", "The account you use with a broker to buy and sell shares, linked to your bank account.", "Dev opens a trading account with a registered broker.", ["trading account"]],
  ["Volatility", "Markets", "How much and how fast a price goes up and down.", "A share that jumps ±5% in a day is volatile.", ["volatile", "volatility"]],
  ["Stock tip", "Markets", "An unverified claim that a share will rise. Nobody can promise that.", "A chat says 'buy now, it will double': ignore it.", ["stock tip", "tip"]],
  ["SEBI", "Markets", "India's regulator for shares and mutual funds; brokers should be registered with it.", "Check that a broker is SEBI-registered before opening an account."],
  ["RBI", "Banking", "Reserve Bank of India, the country's central bank that oversees banks.", "RBI sets rules for banks and watches inflation."],
  ["NPCI", "Banking", "The organisation that runs UPI and other payment systems in India.", "Every UPI payment you make runs on NPCI's system."],
  ["Lump sum", "Investing", "Putting in a whole amount at once, instead of in monthly parts.", "Investing ₹6,000 in one day is a lump sum; a SIP is in parts.", ["lump sum"]],
  ["Investment", "Investing", "Putting money into something to grow it over time, with some risk.", "Buying a mutual fund unit is an investment.", ["investing", "invest"]],
  ["Premium", "Banking", "The regular price paid for insurance cover. For deposit insurance, the bank pays it, not you.", "Your bank pays DICGC's premium; you pay nothing extra.", ["premium"]],
  ["Depositor", "Banking", "A person who keeps money in a bank account.", "Meera is a depositor in one bank, so ₹5 lakh of her money is insured.", ["depositor"]],
  ["Lender", "Credit", "A bank or company that gives you a loan.", "A bank is the lender when you take a bike loan.", ["lender", "lenders"]],
  ["Borrower", "Credit", "A person who takes a loan and must repay it.", "When you take an EMI phone, you are the borrower.", ["borrower"]],
  ["APR", "Credit", "Annual Percentage Rate: the yearly cost of a loan including interest and all other charges.", "Compare the APR of two loans, not just the monthly EMI.", ["APR", "annual percentage rate"]],
  ["Key Facts Statement", "Credit", "A plain-language summary of a loan's main terms that lenders give you before you sign.", "Read the Key Facts Statement before agreeing to a phone loan.", ["Key Facts Statement", "KFS"]],
  ["Reducing balance", "Credit", "A loan where interest is worked out on the amount still owed, which falls with each EMI.", "Your second EMI has less interest than your first.", ["reducing balance", "reducing-balance"]],
  ["Outstanding balance", "Credit", "The amount you still owe on a loan or card.", "After paying ₹400 of an ₹8,000 bill, ₹7,600 is outstanding.", ["outstanding balance", "outstanding"]],
  ["Late fee", "Credit", "A charge for paying a bill after its due date.", "Paying your card bill two days late can add a late fee.", ["late fee", "late-payment penalty"]],
  ["Due date", "Credit", "The last day by which a bill or EMI must be paid.", "Set a reminder for your card's due date.", ["due date"]],
  ["Penalty", "Banking", "An extra charge for breaking a rule, like closing an FD early.", "Closing an FD early may cost a small penalty.", ["penalty"]],
  ["Nominal value", "Basics", "The rupee amount on paper, before considering what it can buy.", "₹10,000 stays ₹10,000 nominally, even if prices rise.", ["nominal"]],
  ["Liability", "Basics", "Something you owe, such as a loan or card dues.", "A ₹2,000 loan from a friend is a liability.", ["liability", "liabilities"]],
  ["Regulator", "Markets", "An official body that makes and enforces rules for a sector, like RBI for banks and SEBI for markets.", "SEBI keeps a register of approved brokers.", ["regulator"]],
  ["Profit", "Markets", "The money a business or investor gains after costs. It is never guaranteed.", "A shop earns a profit if it sells for more than it paid.", ["profit", "profits"]],
  ["Tax", "Basics", "Money collected by the government. Tax rules can change, so check the latest.", "PPF interest is tax-free under current rules.", ["tax", "tax-free"]],
  ["Withdrawal", "Banking", "Taking money out of an account.", "Taking ₹500 from an ATM is a withdrawal.", ["withdrawal", "withdraw"]],
  ["Debit and credit entries", "Banking", "On a statement, a debit is money going out and a credit is money coming in.", "Pocket money is a credit; a UPI payment is a debit.", ["debit", "debits", "credit (money in)"]],
  ["UTR", "Scams", "Unique Transaction Reference: a number that identifies one payment, useful when you report fraud.", "Keep the UTR number from your UPI payment screen.", ["UTR", "transaction ID"]],
  ["I4C", "Scams", "Indian Cyber Crime Coordination Centre, which runs the 1930 helpline with support from RBI and banks.", "A call to 1930 reaches this national system.", ["I4C"]],
  ["Lakh and crore", "Basics", "Indian number units: 1 lakh is 1,00,000 and 1 crore is 1,00,00,000.", "₹5 lakh is ₹5,00,000.", ["lakh", "crore"]],
  ["IFSC", "Banking", "An 11-character code that identifies a bank branch for transfers.", "You give the payee's account number and IFSC to send a NEFT transfer.", ["IFSC"]],
  ["NEFT", "Banking", "A bank-to-bank transfer settled in batches through the day, usually within hours.", "Paying rent to a landlord's account by NEFT.", ["NEFT"]],
  ["IMPS", "Banking", "An instant bank-to-bank transfer that works 24x7, including holidays.", "Sending ₹2,000 to a friend's account at midnight by IMPS.", ["IMPS"]],
  ["RTGS", "Banking", "A real-time transfer meant for large payments, with a high minimum amount.", "A family paying a ₹5 lakh fee to a college by RTGS.", ["RTGS"]],
  ["Beneficiary", "Banking", "A person or business you have registered to send money to.", "Add your landlord as a beneficiary before your first NEFT.", ["beneficiary", "beneficiaries"]],
  ["Autopay", "Banking", "A standing instruction that lets a biller take a bill from your account on its due date, up to a limit.", "Electricity autopay with a ₹2,000 limit.", ["autopay", "mandate"]],
  ["Amortisation", "Credit", "The step-by-step plan showing how each EMI splits into interest and principal.", "In month 1 of a loan, most of your EMI is interest.", ["amortisation"]],
  ["Foreclosure", "Credit", "Paying off a whole loan before its end date, sometimes with a charge.", "Closing a bike loan early may cost a small foreclosure fee.", ["foreclosure", "foreclose", "prepay"]]
];

// Turns the raw list into objects with named fields.
const GLOSSARY = GLOSSARY_RAW.map(function (r) {
  return { term: r[0], category: r[1], meaning: r[2], example: r[3], link: r[4] || [r[0]] };
});

// Escapes special characters so a word can be used inside a regular expression.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
}

// Builds a list of every linkable word, longest first, so "compound interest" beats "interest".
function buildGlossaryLookup() {
  const list = [];
  GLOSSARY.forEach(function (g) {
    g.link.forEach(function (w) { list.push({ word: w, entry: g }); });
  });
  list.sort(function (a, b) { return b.word.length - a.word.length; });
  return list;
}

const GLOSSARY_LOOKUP = buildGlossaryLookup();

// Wraps known terms in a Why? card text with clickable spans (first use of each term only).
function linkGlossaryTerms(text) {
  const used = {};
  const spans = [];
  const parts = String(text).split(/(<[^>]+>)/);
  const linked = parts.map(function (part) {
    if (part.charAt(0) === "<") return part;
    let out = part;
    GLOSSARY_LOOKUP.forEach(function (item) {
      if (used[item.entry.term]) return;
      const re = new RegExp("(^|[^A-Za-z0-9\\u20B9/])(" + escapeRegex(item.word) + "(?:s|es)?)(?![A-Za-z0-9])", "i");
      if (!re.test(out)) return;
      used[item.entry.term] = true;
      // A placeholder keeps later terms from matching inside this span.
      out = out.replace(re, function (m, pre, word) {
        spans.push('<span class="gloss-term" tabindex="0" role="button" data-term="' + item.entry.term.replace(/"/g, "&quot;") + '">' + word + "</span>");
        return pre + "\u0001" + (spans.length - 1) + "\u0002";
      });
    });
    return out;
  }).join("");
  return linked.replace(/\u0001(\d+)\u0002/g, function (m, i) { return spans[Number(i)]; });
}

// Removes the little meaning popup if one is open.
function closeGlossPopup() {
  const old = document.querySelector(".gloss-popup");
  if (old) old.remove();
}

// Opens a small popup under a clicked term with its meaning and a link to the glossary page.
function openGlossPopup(el) {
  closeGlossPopup();
  const entry = GLOSSARY.filter(function (g) { return g.term === el.getAttribute("data-term"); })[0];
  if (!entry) return;
  const pop = document.createElement("div");
  pop.className = "gloss-popup";
  pop.setAttribute("role", "dialog");
  pop.innerHTML = "<strong>" + entry.term + "</strong><br>" + entry.meaning +
    '<br><span class="gloss-pop-ex">🇮🇳 ' + entry.example + "</span>" +
    '<br><a href="glossary.html#' + termSlug(entry.term) + '" target="_blank" rel="noopener">Open in glossary →</a>';
  pop.style.maxWidth = Math.min(340, window.innerWidth - 16) + "px";
  document.body.appendChild(pop);
  const r = el.getBoundingClientRect();
  const w = pop.offsetWidth, h = pop.offsetHeight;
  let left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
  let top = r.bottom + 8;
  if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
  pop.style.left = left + "px";
  pop.style.top = top + "px";
}

// Listens for clicks on glossary words anywhere on the page, and closes the popup on outside click or Escape.
function setupGlossaryClicks() {
  document.addEventListener("click", function (e) {
    const term = e.target.closest && e.target.closest(".gloss-term");
    if (term) { openGlossPopup(term); return; }
    if (!(e.target.closest && e.target.closest(".gloss-popup"))) closeGlossPopup();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeGlossPopup(); return; }
    const term = e.target.closest && e.target.closest(".gloss-term");
    if (term && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openGlossPopup(term); }
  });
}

// Turns a term into a safe link name, e.g. "Fixed deposit (FD)" becomes "fixed-deposit-fd".
function termSlug(term) {
  return String(term).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

setupGlossaryClicks();

// Draws the glossary page: sorted term cards, search box and category chips.
function setupGlossaryPage() {
  const grid = document.getElementById("gloss-grid");
  if (!grid) return;
  const search = document.getElementById("gloss-search");
  const chipRow = document.getElementById("gloss-chips");
  const empty = document.getElementById("gloss-empty");
  const count = document.getElementById("gloss-count");
  let category = "All";

  const sorted = GLOSSARY.slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
  grid.innerHTML = sorted.map(function (g) {
    return '<article class="term-card" id="' + termSlug(g.term) + '" data-cat="' + g.category + '" data-term="' + g.term.replace(/"/g, "&quot;") + '">' +
      "<h3>" + g.term + '</h3><span class="term-cat">' + g.category + "</span>" +
      "<p>" + g.meaning + '</p><p class="term-ex">🇮🇳 ' + g.example + "</p></article>";
  }).join("");

  chipRow.innerHTML = ["All"].concat(GLOSSARY_CATEGORIES).map(function (c) {
    return '<button type="button" class="filter-chip' + (c === "All" ? " active" : "") + '" data-cat="' + c + '">' + c + "</button>";
  }).join("");

  // Shows only the cards that match the search words and the chosen category.
  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    grid.querySelectorAll(".term-card").forEach(function (card) {
      const okCat = category === "All" || card.getAttribute("data-cat") === category;
      const okText = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
      card.classList.toggle("hide", !(okCat && okText));
      if (okCat && okText) shown++;
    });
    empty.classList.toggle("hidden", shown !== 0);
    count.textContent = shown + " of " + GLOSSARY.length + " terms";
  }

  chipRow.addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    category = btn.getAttribute("data-cat");
    chipRow.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.toggle("active", c === btn); });
    applyFilters();
  });
  search.addEventListener("input", applyFilters);

  // A link like glossary.html#sip clears any filter, scrolls to that card and highlights it for a moment.
  function showHashTerm() {
    let slug = decodeURIComponent(location.hash.replace(/^#/, ""));
    const old = new URLSearchParams(location.search).get("term");   // older links: ?term=SIP
    if (!slug && old) slug = termSlug(old);
    if (!slug) return;
    search.value = "";
    category = "All";
    chipRow.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-cat") === "All"); });
    applyFilters();
    const card = document.getElementById(slug);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("term-focus");
    setTimeout(function () { card.classList.remove("term-focus"); }, 3500);
  }

  applyFilters();
  showHashTerm();
  window.addEventListener("hashchange", showHashTerm);
}

document.addEventListener("DOMContentLoaded", setupGlossaryPage);
