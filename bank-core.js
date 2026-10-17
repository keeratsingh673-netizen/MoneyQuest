/* bank-core.js - state, ledger, time engine and helpers for the MoneyQuest Practice Bank.
   Everything here is fictional. Screens live in bank-screens.js and register themselves with BQ.register(). */
"use strict";
(function () {
  const KEY = "moneyquest_bank_v2", VER = 1, DAY = 864e5;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const BQ = window.BQ = { screens: [], acts: {}, session: { ok: false }, pend: null, DAY: DAY };
  let S = null, cur = "overview";

  // ---------- Small helpers ----------
  const $ = BQ.$ = function (sel, root) { return (root || document).querySelector(sel); };
  const round2 = BQ.round2 = function (x) { return Math.round(x * 100) / 100; };
  const uid = BQ.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  const pick = BQ.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  const digits = BQ.digits = function (n) { let s = ""; for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10); return s; };
  // Roughly bell-shaped random number around mu with spread sd.
  const rnd = function (mu, sd) { return mu + sd * (Math.random() + Math.random() + Math.random() - 1.5) * 2; };

  // Escapes text so it is safe inside HTML.
  const esc = BQ.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  // Formats a number as rupees with Indian digit grouping.
  const inr = BQ.inr = function (n) {
    n = Number(n) || 0;
    const t = Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
    return (n < 0 ? "-" : "") + "₹" + t;
  };
  // Links glossary words in fixed text using the shared glossary function when it exists.
  BQ.gl = function (t) { return typeof linkGlossaryTerms === "function" ? linkGlossaryTerms(t) : t; };
  // A made-up 12 character reference number.
  BQ.ref = function (p) { return (p || "MQ") + digits(10); };

  // Date helpers: dates are UTC midnight timestamps.
  const dp = BQ.dp = function (ms) { const d = new Date(ms); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() }; };
  BQ.dstr = function (ms) { const p = dp(ms); return p.d + " " + MON[p.m] + " " + p.y; };
  BQ.addMonths = function (ms, n) { const p = dp(ms); return Date.UTC(p.y, p.m + n, Math.min(p.d, 28)); };
  // The next date (after today) that falls on day-of-month `day`.
  BQ.nextOn = function (day) { const p = dp(S.date); return Date.UTC(p.y, p.m + (p.d < day ? 0 : 1), day); };

  // ---------- Reference data (all made up, "for example") ----------
  BQ.BILLERS = [
    { id: "elec", name: "Electricity - Sample Power Co.", due: 5, lo: 900, hi: 1700, icon: "💡" },
    { id: "mob", name: "Mobile - Sample Telecom", due: 8, lo: 399, hi: 399, icon: "📱" },
    { id: "bb", name: "Broadband - Sample Fibre", due: 12, lo: 699, hi: 699, icon: "🌐" },
    { id: "sub", name: "StreamBox+ subscription (made-up)", due: 15, lo: 299, hi: 299, icon: "🎬" }
  ];
  BQ.INCOME = {
    savings: { amt: 15000, label: "Monthly income (sample)", open: 5000, minBal: 2000, name: "Savings account" },
    zero: { amt: 8000, label: "Monthly income (sample)", open: 1000, minBal: 0, name: "Zero-balance account" },
    salary: { amt: 30000, label: "Salary - Sample Employer Pvt Ltd", open: 2000, minBal: 0, name: "Salary account" }
  };
  BQ.FD_RATES = { 3: 6.0, 6: 6.5, 12: 7.0, 24: 7.0, 36: 6.75 };
  BQ.RD_RATES = { 6: 6.25, 12: 6.75, 24: 6.75, 36: 6.5 };
  BQ.FUNDS = {
    index: { name: "Sample Nifty Index Fund", risk: "High", mu: 0.01, sd: 0.045 },
    bal: { name: "Sample Balanced Mix Fund", risk: "Medium", mu: 0.007, sd: 0.025 },
    debt: { name: "Sample Debt Safe Fund", risk: "Low", mu: 0.005, sd: 0.006 }
  };
  BQ.MISSIONS = [
    { id: "open", t: "Open your account", d: "Finish onboarding to open an account with a mock KYC step. KYC is how the bank checks who you are before it holds your money." },
    { id: "send100", t: "Send ₹100 safely", d: "Pay ₹100 by UPI and read the payee name on the confirm screen before you enter your UPI PIN. You never need a PIN to receive money." },
    { id: "spotfake", t: "Spot the fake collect request", d: "Open Transfers and decline the collect request that is a scam. A collect request pulls money out of your account, so check it first." },
    { id: "rd", t: "Set up an RD", d: "Open a recurring deposit under Deposits with a small monthly instalment. A recurring deposit builds the habit of saving every month." },
    { id: "bill", t: "Pay a bill", d: "Pay any bill under Bills and Autopay. Paying by the due date avoids a late fee." },
    { id: "block", t: "Block a lost card", d: "In Cards, block the debit card as if it were lost. Blocking quickly stops others using it, and you can unblock it later." },
    { id: "ccfull", t: "Pay the credit card in full", d: "Make a credit card purchase, then pay the whole outstanding balance. Paying in full by the due date means no interest." },
    { id: "loan", t: "Take a loan and prepay it", d: "Take a small loan, then prepay part of it. Prepaying can cut your total interest, but the bank may charge a foreclosure fee." }
  ];
  BQ.FAKES = [
    { from: "VM-KYCINF", text: "URGENT: Your KYC expires today! Account will be blocked. Update now: http://mq-kyc-update.example/verify", scam: true, link: true, why: "Banks do not ask you to update KYC through a message link. Use the bank's own app or visit the branch." },
    { from: "AX-PRIZE", text: "Congratulations! You won ₹25,00,000 in our Lucky Draw. Pay a ₹4,999 processing fee here to claim: http://mq-prize.example/claim", scam: true, link: true, why: "Real prizes never ask you to pay a fee first, and you cannot win a draw you never entered." },
    { from: "LN-FAST", text: "Instant loan ₹2,00,000 approved, no documents! Install the LoanFast app: http://mq-loanfast.example/app.apk", scam: true, link: true, why: "Fake loan apps steal phone data and harass borrowers. Borrow only from lenders registered with RBI and never install apps from message links." },
    { from: "CASH-DESK", text: "Refund of ₹1,850 is pending. Approve the collect request in your UPI app and enter your UPI PIN to receive it.", scam: true, why: "You never enter a UPI PIN to receive money. A collect request takes money out of your account." },
    { from: "+91 90000 11111", text: "I am a bank officer from MoneyQuest Practice Bank security. A fraud is in progress. Reply with the OTP you just received to cancel it.", scam: true, otp: true, why: "No bank officer ever needs your OTP or PIN. The OTP is the key to your money." },
    { from: "MQ-BANK", text: "Your account statement is ready in the MoneyQuest app (Passbook). We never ask for your OTP, PIN or CVV. Do not share them with anyone.", scam: false, why: "Genuine: it comes from the bank's usual sender name, has no link and asks you for nothing." },
    { from: "MQ-BANK", text: "Your debit card ending 4821 expires next month. A new card will be posted to your registered address. No action is needed.", scam: false, why: "Genuine: no link, no request for money or codes, and it asks you to do nothing." }
  ];

  // ---------- State and storage ----------
  // A brand new state object.
  function fresh() {
    return {
      v: VER, onboarded: false, acct: null, pins: null, date: Date.UTC(2026, 3, 1), ledger: [], alerts: [], bens: [], collects: [],
      credit: 700, why: [], missions: {}, bills: [], autopay: {}, sub: null, rds: [], fds: [], sips: [], loans: [],
      navs: { index: 100, bal: 100, debt: 100 }, navHist: { index: [100], bal: [100], debt: [100] },
      card: { limit: 20000, blocked: false, stmt: null }, deb: { blocked: false, limit: 10000, spent: { day: 0, amt: 0 } },
      out: { day: 0, amt: 0 }, tries: 0, upiLock: false, lastEvt: 0, complaints: []
    };
  }
  // Loads saved state, or starts fresh if missing or from another version.
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === VER) return Object.assign(fresh(), s);
    } catch (e) { /* private mode or bad data: start fresh */ }
    return fresh();
  }
  // Saves the state object to localStorage.
  BQ.save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } };
  Object.defineProperty(BQ, "S", { get: function () { return S; } });

  // ---------- The one ledger ----------
  // Adds one transaction. acct "sav" is the savings account, "cc" is the credit card.
  BQ.post = function (o) {
    const e = { id: uid(), date: S.date, desc: o.desc, cat: o.cat || "Other", dir: o.dir, amt: round2(o.amt), acct: o.acct || "sav", mode: o.mode || "", ref: o.ref || "" };
    S.ledger.push(e);
    return e;
  };
  // Savings balance: sum of all savings entries.
  BQ.bal = function () { return round2(S.ledger.reduce(function (a, e) { return e.acct === "sav" ? a + (e.dir === "cr" ? e.amt : -e.amt) : a; }, 0)); };
  // Credit card outstanding: sum of all card entries.
  BQ.ccOut = function () { return round2(S.ledger.reduce(function (a, e) { return e.acct === "cc" ? a + (e.dir === "dr" ? e.amt : -e.amt) : a; }, 0)); };
  // Takes money from savings if there is enough; returns the entry, or null if not enough.
  BQ.spend = function (amt, desc, cat, mode, ref) {
    if (BQ.bal() < amt - 0.001) return null;
    return BQ.post({ desc: desc, cat: cat, dir: "dr", amt: amt, mode: mode, ref: ref });
  };
  // Puts money into savings.
  BQ.earn = function (amt, desc, cat, mode) { if (window.MQ && MQ.burst) MQ.burst("gain"); return BQ.post({ desc: desc, cat: cat, dir: "cr", amt: amt, mode: mode }); };
  // Money sent out today through UPI/IMPS/NEFT (for the daily limit).
  BQ.outToday = function () { return S.out.day === S.date ? S.out.amt : 0; };
  BQ.addOut = function (a) { S.out = { day: S.date, amt: BQ.outToday() + a }; };
  // Spending by category over the last N days (card payments are skipped so nothing counts twice).
  BQ.spendByCat = function (days) {
    const from = S.date - days * DAY, m = {};
    S.ledger.forEach(function (e) {
      if (e.dir !== "dr" || e.date < from || e.cat === "Card payment") return;
      m[e.cat] = (m[e.cat] || 0) + e.amt;
    });
    return Object.keys(m).map(function (k) { return [k, round2(m[k])]; }).sort(function (a, b) { return b[1] - a[1]; });
  };

  // ---------- Alerts, credit score, missions ----------
  // Adds an SMS-style message to the Alerts inbox.
  BQ.sms = function (text, o) {
    o = o || {};
    S.alerts.unshift(Object.assign({ id: uid(), date: S.date, from: "MQ-BANK", text: text, kind: "real", read: false }, o));
    if (S.alerts.length > 150) S.alerts.length = 150;
  };
  // Adds one of the practice fake/genuine-looking messages (unlabelled until the player answers).
  BQ.sendQuiz = function (i) {
    const f = BQ.FAKES[i % BQ.FAKES.length];
    BQ.sms(f.text, { from: f.from, kind: "quiz", scam: f.scam, link: !!f.link, otp: !!f.otp, why: f.why, verdict: null, acted: false });
  };
  // Moves the credit score (300 to 900) and remembers why.
  BQ.credit = function (d, why) {
    const old = S.credit;
    S.credit = Math.max(300, Math.min(900, S.credit + d));
    if (S.credit !== old) { S.why.unshift({ date: S.date, d: S.credit - old, t: why }); if (S.why.length > 8) S.why.length = 8; }
  };
  // Marks a mission done and shows a toast the first time.
  BQ.done = function (id) {
    if (S.missions[id]) return;
    S.missions[id] = true;
    const m = BQ.MISSIONS.filter(function (x) { return x.id === id; })[0];
    BQ.toast("🎯 Mission complete: " + (m ? m.t : id), "good");
  };
  // Pays a generated bill from savings. Returns true if it worked.
  BQ.payBill = function (b, mode) {
    const bl = BQ.BILLERS.filter(function (x) { return x.id === b.biller; })[0];
    if (!BQ.spend(b.amt, bl.name + " bill", "Bills", mode)) return false;
    b.paid = true; b.paidOn = S.date;
    if (mode !== "Autopay") BQ.done("bill");
    return true;
  };
  // Monthly EMI for a loan (reducing balance).
  BQ.emi = function (P, rate, n) {
    const r = rate / 1200;
    return Math.round(r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n);
  };
  // Full amortisation schedule: [{i, emi, int, prin, bal}].
  BQ.schedule = function (P, rate, n) {
    const r = rate / 1200, e = BQ.emi(P, rate, n), rows = [];
    let b = P;
    for (let i = 1; i <= n; i++) {
      const int = round2(b * r), pay = i === n ? round2(b + int) : e, prin = round2(pay - int);
      b = round2(b - prin);
      rows.push({ i: i, emi: pay, int: int, prin: prin, bal: Math.max(0, b) });
    }
    return rows;
  };
  // Upcoming payments in date order: bills, EMIs, RDs, SIPs, card due date, FD maturity.
  BQ.upcoming = function () {
    const u = [];
    S.bills.forEach(function (b) { if (!b.paid) u.push({ date: b.due, t: BQ.BILLERS.filter(function (x) { return x.id === b.biller; })[0].name, amt: b.amt }); });
    S.loans.forEach(function (L) { if (L.status === "active") u.push({ date: BQ.nextOn(L.day), t: "Loan EMI - " + L.name, amt: L.emi }); });
    S.rds.forEach(function (r) { if (r.status === "active") u.push({ date: BQ.nextOn(r.day), t: "RD instalment - " + r.name, amt: r.inst }); });
    S.sips.forEach(function (s) { if (s.status === "active") u.push({ date: BQ.nextOn(5), t: "SIP - " + BQ.FUNDS[s.fund].name, amt: s.monthly }); });
    if (S.card.stmt && !S.card.stmt.checked) u.push({ date: S.card.stmt.due, t: "Credit card minimum due", amt: Math.max(0, S.card.stmt.min - S.card.stmt.paid) });
    S.fds.forEach(function (f) { if (f.status === "active") u.push({ date: f.end, t: "FD matures - " + f.name, amt: f.payout ? f.amt : f.maturity, inflow: true }); });
    return u.sort(function (a, b) { return a.date - b.date; });
  };

  // ---------- UI helpers: toast, modal, fields, tables, OTP ----------
  // Shows a short message at the bottom of the screen.
  BQ.toast = function (msg, kind) {
    const box = $("#bq-toast"); if (!box) return;
    const t = document.createElement("div");
    t.className = "bq-toast " + (kind || "");
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.remove(); }, 4200);
  };
  // Opens a glass dialog. btns: [{t, act, arg, cls}]
  BQ.modal = function (title, html, btns) {
    const m = $("#bq-modal");
    btns = btns || [{ t: "Close" }];
    m.innerHTML = '<div class="bq-dlg glass" role="dialog" aria-modal="true"><h3>' + title + '</h3><div class="bq-dlg-body">' + html + '</div><div class="bq-dlg-btns">' +
      btns.map(function (b) { return '<button class="btn ' + (b.cls === undefined ? "" : b.cls) + '" data-act="' + (b.act || "close") + '"' + (b.arg !== undefined ? ' data-arg="' + esc(b.arg) + '"' : "") + ">" + b.t + "</button>"; }).join("") + "</div></div>";
    m.classList.remove("hidden");
    const first = $("input,select", m); if (first) first.focus();
  };
  BQ.closeModal = function () { const m = $("#bq-modal"); m.classList.add("hidden"); m.innerHTML = ""; };
  // One labelled form field. o: {type, val, ph, hint, opts, max, mode}
  BQ.field = function (id, label, o) {
    o = o || {};
    let inp;
    if (o.type === "select") {
      inp = '<select id="' + id + '">' + o.opts.map(function (x) {
        const v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x;
        return '<option value="' + esc(v) + '"' + (String(v) === String(o.val) ? " selected" : "") + ">" + esc(l) + "</option>";
      }).join("") + "</select>";
    } else {
      inp = '<input id="' + id + '" type="' + (o.type === "pin" ? "text" : o.type || "text") + '" value="' + esc(o.val || "") + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") +
        (o.max ? ' maxlength="' + o.max + '"' : "") + (o.mode ? ' inputmode="' + o.mode + '"' : "") + (o.type === "pin" ? ' class="bq-pin" inputmode="numeric"' : "") + ' autocomplete="off">';
    }
    return '<label class="bq-f"><span>' + label + "</span>" + inp + (o.hint ? "<small>" + o.hint + "</small>" : "") + "</label>";
  };
  BQ.val = function (id) { const el = $("#" + id); return el ? el.value.trim() : ""; };
  BQ.num = function (id) { return Math.round((parseFloat(BQ.val(id)) || 0) * 100) / 100; };
  // A simple responsive table. rows: arrays of HTML strings.
  BQ.table = function (heads, rows) {
    return '<div class="bq-tw"><table class="bq-t"><thead><tr>' + heads.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      (rows.length ? rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") : '<tr><td colspan="' + heads.length + '" class="note">Nothing here yet.</td></tr>') + "</tbody></table></div>";
  };
  // Registers an action name for buttons with data-act="name".
  BQ.on = function (name, fn) { BQ.acts[name] = fn; };
  // Registers a screen in the sidebar. s: {id, label, icon, render(el), show()}
  BQ.register = function (s) { BQ.screens.push(s); };

  // Asks for an OTP: the code only appears as an SMS in Alerts and is never filled in for the player.
  BQ.askOtp = function (purpose, cb) {
    const code = String(100000 + Math.floor(Math.random() * 900000));
    BQ.sms(code + " is your OTP for " + purpose + ". Do NOT share it with anyone, not even bank staff. - MoneyQuest Practice Bank", { otp: true });
    BQ.pend = { purpose: purpose, code: code, cb: cb };
    BQ.refresh();
    BQ.otpModal();
  };
  BQ.otpModal = function () {
    if (!BQ.pend) return;
    BQ.modal("🔐 Enter OTP", "<p>We sent a 6-digit OTP by SMS for: <b>" + esc(BQ.pend.purpose) + "</b>. Open <b>Alerts</b> to read it, then type it here. It is never filled in for you, and you must never share it.</p>" +
      BQ.field("otp-in", "OTP", { mode: "numeric", max: 6, ph: "6 digits" }),
      [{ t: "Verify" }, { t: "Open Alerts", act: "otpAlerts", cls: "btn-ghost" }, { t: "Cancel", act: "otpCancel", cls: "btn-ghost" }].map(function (b, i) { if (i === 0) b.act = "otpOk"; return b; }));
  };

  // ---------- Time engine ----------
  // Runs one simulated day. Order: new beneficiaries, salary, bills, RD, SIP, EMI, FD, card, interest, charges, random events.
  function tick() {
    S.date += DAY;
    const today = S.date, p = dp(today), D = p.d, A = BQ.INCOME[S.acct.type];
    S.upiLock = false; S.tries = 0;
    S.bens.forEach(function (b) { if (!b.active && today >= b.activeOn) { b.active = true; BQ.sms("Beneficiary " + b.name + " is now active. You can send NEFT, IMPS or RTGS to them."); } });

    // 1. Salary and new bills on the 1st
    if (D === 1) {
      BQ.earn(A.amt, A.label, "Income", "NEFT");
      BQ.sms("Credit alert: " + inr(A.amt) + " credited (" + A.label + "). Avl bal " + inr(BQ.bal()) + ".");
      BQ.BILLERS.forEach(function (bl) {
        if (bl.id === "sub" && (!S.sub || today < S.sub.freeUntil)) return;
        const amt = Math.round(bl.lo + Math.random() * (bl.hi - bl.lo));
        S.bills.push({ id: uid(), biller: bl.id, amt: amt, due: Date.UTC(p.y, p.m, bl.due), paid: false, late: false });
        BQ.sms("New bill: " + bl.name + " " + inr(amt) + " due on " + bl.due + " " + MON[p.m] + ".");
      });
      if (S.bills.length > 40) S.bills = S.bills.filter(function (b) { return !b.paid; }).concat(S.bills.filter(function (b) { return b.paid; }).slice(-12));
    }
    if (S.sub && today === S.sub.freeUntil) BQ.sms("StreamBox+: your free trial has ended. " + inr(299) + " a month will now be charged. Cancel in Bills and Autopay if you do not want it.");

    // 2. Bill due dates, reminders, autopay and late fees
    S.bills.forEach(function (b) {
      if (b.paid) return;
      const bl = BQ.BILLERS.filter(function (x) { return x.id === b.biller; })[0], ap = S.autopay[b.biller], left = Math.round((b.due - today) / DAY);
      if (left === 0) {
        if (ap && b.amt <= ap.limit) {
          if (BQ.payBill(b, "Autopay")) BQ.sms("Autopay: " + inr(b.amt) + " paid to " + bl.name + ". Avl bal " + inr(BQ.bal()) + ".");
          else BQ.sms("Autopay FAILED for " + bl.name + ": low balance. Pay now to avoid a late fee.");
        } else if (ap) BQ.sms("Autopay skipped for " + bl.name + ": bill " + inr(b.amt) + " is above your limit " + inr(ap.limit) + ". Pay it yourself.");
        else BQ.sms("Reminder: " + bl.name + " " + inr(b.amt) + " is due today.");
      } else if (left === 2 && !ap) BQ.sms("Reminder: " + bl.name + " " + inr(b.amt) + " is due in 2 days.");
      else if (left < 0 && !b.late) { b.late = true; b.amt += 50; BQ.credit(-3, "Late bill payment"); BQ.sms("Late fee of " + inr(50) + " added to " + bl.name + ". Pay now."); }
    });

    // 3. RD instalments
    S.rds.forEach(function (r) {
      if (r.status !== "active" || D !== r.day) return;
      r.val = round2(r.val * (1 + r.rate / 1200));
      if (BQ.spend(r.inst, "RD instalment " + r.name, "Investing", "Auto")) { r.paid++; r.val = round2(r.val + r.inst); BQ.sms("RD " + r.name + ": instalment " + inr(r.inst) + " debited (" + r.paid + "/" + r.months + ")."); }
      else { r.missed++; const pen = Math.round(r.inst * 0.02); r.val = Math.max(0, round2(r.val - pen)); BQ.credit(-3, "Missed RD instalment"); BQ.sms("RD " + r.name + ": instalment MISSED (low balance). A penalty of " + inr(pen) + " was applied to your RD."); }
      if (r.paid + r.missed >= r.months) { r.status = "matured"; BQ.earn(r.val, "RD maturity " + r.name, "Investing", "Auto"); BQ.sms("RD " + r.name + " matured. " + inr(r.val) + " credited."); }
    });

    // 4. SIP: NAV moves on the 1st, instalments on the 5th
    if (D === 1) Object.keys(BQ.FUNDS).forEach(function (k) {
      S.navs[k] = round2(S.navs[k] * (1 + rnd(BQ.FUNDS[k].mu, BQ.FUNDS[k].sd)));
      S.navHist[k].push(S.navs[k]); if (S.navHist[k].length > 24) S.navHist[k].shift();
    });
    if (D === 5) S.sips.forEach(function (s) {
      if (s.status !== "active") return;
      if (BQ.spend(s.monthly, "SIP " + BQ.FUNDS[s.fund].name, "Investing", "Auto")) { s.units += s.monthly / S.navs[s.fund]; s.invested += s.monthly; BQ.sms("SIP: " + inr(s.monthly) + " invested in " + BQ.FUNDS[s.fund].name + " at NAV " + S.navs[s.fund] + "."); }
      else BQ.sms("SIP instalment of " + inr(s.monthly) + " skipped: low balance.");
    });

    // 5. Loan EMIs (and overdue amounts)
    S.loans.forEach(function (L) {
      if (L.status !== "active") return;
      if (L.arrears > 0 && BQ.spend(L.arrears, "Overdue EMI + late fee " + L.name, "Loans", "Auto")) { BQ.sms("Overdue amount " + inr(L.arrears) + " for loan " + L.name + " recovered."); L.arrears = 0; }
      if (D === L.day && L.bal > 0) {
        const int = round2(L.bal * L.rate / 1200), emi = L.paid + 1 >= L.months ? round2(L.bal + int) : Math.min(L.emi, round2(L.bal + int));
        L.bal = round2(L.bal - (emi - int)); L.paid++;
        if (BQ.spend(emi, "Loan EMI " + L.name, "Loans", "Auto")) { BQ.credit(1, "On-time loan EMI"); BQ.sms("EMI " + inr(emi) + " debited for loan " + L.name + " (" + L.paid + "/" + L.months + ")."); }
        else { L.missed++; L.arrears = round2(L.arrears + emi + 300); BQ.credit(-30, "Missed loan EMI"); BQ.sms("EMI " + inr(emi) + " BOUNCED for loan " + L.name + ". Late fee " + inr(300) + " added. Add money soon; your credit score has dropped."); }
        if (L.paid >= L.months) L.bal = 0;
      }
      if (L.bal <= 0.5 && L.arrears <= 0) { L.status = "closed"; L.bal = 0; BQ.sms("Loan " + L.name + " is fully repaid. Congratulations!"); }
    });

    // 6. Fixed deposits: monthly payout, then maturity
    S.fds.forEach(function (f) {
      if (f.status !== "active") return;
      if (f.payout && D === f.day && today <= f.end) { const i = round2(f.amt * f.rate / 1200); BQ.earn(i, "FD interest " + f.name, "Interest", "Auto"); f.paid = round2(f.paid + i); BQ.sms("FD " + f.name + ": interest " + inr(i) + " credited."); }
      if (today >= f.end) { const amt = f.payout ? f.amt : f.maturity; BQ.earn(amt, "FD maturity " + f.name, "Investing", "Auto"); f.status = "matured"; BQ.sms("FD " + f.name + " matured. " + inr(amt) + " credited to your account."); }
    });

    // 7. Credit card statement on the 20th and the due-date check
    const C = S.card;
    if (D === 20) {
      const out = BQ.ccOut();
      if (out > 0) {
        const min = out < 200 ? out : Math.max(200, Math.round(out * 0.05));
        C.stmt = { date: today, total: out, min: min, due: Date.UTC(p.y, p.m + 1, 5), paid: 0, checked: false };
        BQ.sms("Credit card statement: total due " + inr(out) + ", minimum due " + inr(min) + ", pay by " + BQ.dstr(C.stmt.due) + ".");
      }
    }
    if (C.stmt && !C.stmt.checked) {
      const st = C.stmt, left = Math.round((st.due - today) / DAY), rem = round2(st.total - st.paid);
      if (left === 3 && rem > 0) BQ.sms("Reminder: credit card payment of " + inr(rem) + " is due in 3 days.");
      if (today >= st.due) {
        st.checked = true;
        if (rem <= 0) BQ.credit(5, "Paid card bill in full");
        else {
          const int = round2(rem * 0.035);
          BQ.post({ desc: "Interest on unpaid balance", cat: "Fees", dir: "dr", amt: int, acct: "cc" });
          if (st.paid < st.min) { BQ.post({ desc: "Late payment fee", cat: "Fees", dir: "dr", amt: 500, acct: "cc" }); BQ.credit(-20, "Missed card minimum due"); BQ.sms("Card due date missed. Late fee " + inr(500) + " and interest " + inr(int) + " charged."); }
          else { BQ.credit(-3, "Paid only part of the card bill"); BQ.sms("You paid only part of the card bill. Interest " + inr(int) + " charged on the unpaid " + inr(rem) + "."); }
        }
      }
    }

    // 8. Quarterly savings interest, minimum balance charge
    if (D === 1 && p.m % 3 === 0 && BQ.bal() > 0) { const i = round2(BQ.bal() * 0.03 / 4); BQ.earn(i, "Savings interest (quarterly)", "Interest", "Auto"); BQ.sms("Interest of " + inr(i) + " credited to your savings account (rate for example 3% a year)."); }
    if (D === 28 && A.minBal > 0 && BQ.bal() < A.minBal && BQ.bal() > 0) { const f = Math.min(150, BQ.bal()); BQ.spend(f, "Minimum balance charge", "Fees", "Auto"); BQ.sms("Minimum balance charge " + inr(f) + " debited: balance was below " + inr(A.minBal) + "."); }

    // 9. Occasional random events
    if (Math.random() < 0.06 && today - S.lastEvt >= 5 * DAY) { S.lastEvt = today; randomEvent(); }
  }

  // One random event: cashback, gift, repair cost, collect request or a fake message.
  function randomEvent() {
    const r = Math.floor(Math.random() * 6);
    if (r === 0) { BQ.earn(50, "Cashback - sample shop", "Income", "Auto"); BQ.sms("Cashback of " + inr(50) + " credited."); }
    else if (r === 1) { BQ.earn(500, "Gift from relative (sample)", "Income", "UPI"); BQ.sms("Credit alert: " + inr(500) + " received by UPI from a relative."); }
    else if (r === 2) { const a = 700 + Math.floor(Math.random() * 800); if (BQ.spend(a, "Unexpected repair - sample workshop", "Other", "Debit card")) BQ.sms("Debit alert: " + inr(a) + " paid to sample workshop (an unexpected repair)."); }
    else if (r === 3) { S.collects.unshift({ id: uid(), from: "Cashback Desk", upi: "cashback.desk@mqbank", amt: 1200, note: "Approve to RECEIVE your cashback", scam: true, status: "pending" }); BQ.sms("New UPI collect request pending in Transfers. Check it carefully before approving."); }
    else if (r === 4) { S.collects.unshift({ id: uid(), from: "Priya Nair", upi: "priya.sample@mqbank", amt: 250, note: "Movie tickets split", scam: false, status: "pending" }); BQ.sms("New UPI collect request pending in Transfers. Check who it is from."); }
    else BQ.sendQuiz(Math.floor(Math.random() * BQ.FAKES.length));
  }

  // Skips forward by n simulated days, running everything that is due in order.
  BQ.skip = function (n) {
    if (!S.onboarded) return;
    const before = S.alerts.length;
    for (let i = 0; i < n; i++) tick();
    BQ.save();
    BQ.refresh();
    BQ.toast("Moved to " + BQ.dstr(S.date) + ". " + Math.max(0, S.alerts.length - before) + " new alert(s).");
  };

  // ---------- Chrome (sidebar, top bar), router, login ----------
  // Redraws the sidebar, top bar and OTP banner.
  BQ.chrome = function () {
    const unread = S.alerts.filter(function (a) { return !a.read; }).length;
    $("#bq-side").innerHTML = BQ.screens.filter(function (s) { return S.onboarded ? (!s.show || s.show()) : s.id === "onboard"; }).map(function (s) {
      return '<button class="bq-nav' + (s.id === cur ? " on" : "") + '" data-act="go" data-arg="' + s.id + '"><span class="bq-ic">' + s.icon + '</span><span class="bq-lb">' + s.label + "</span></button>";
    }).join("");
    $("#bq-top").innerHTML = '<span class="bq-date">📅 ' + BQ.dstr(S.date) + '</span><span class="bq-skips">' +
      (S.onboarded ? '<button class="btn btn-ghost" data-act="skip" data-arg="1">Skip 1 day</button><button class="btn btn-ghost" data-act="skip" data-arg="7">Skip 1 week</button><button class="btn btn-ghost" data-act="skip" data-arg="30">Skip 1 month</button>' : "") +
      '</span><button class="btn btn-ghost bq-bell" data-act="go" data-arg="alerts" aria-label="Alerts">🔔 <b>' + unread + '</b></button><button class="btn btn-ghost" data-act="resetAsk">Reset</button>';
    $("#bq-banner").innerHTML = BQ.pend ? '<div class="bq-otp-banner">🔐 OTP needed for: ' + esc(BQ.pend.purpose) + '. Read it in Alerts; never share it. <button class="btn btn-ghost" data-act="otpShow">Enter OTP</button></div>' : "";
  };
  // Shows the login PIN screen at the start of each visit.
  function renderLogin(main) {
    main.innerHTML = '<div class="card bq-login"><h2>🔒 Log in</h2><p>Enter your 4-digit practice login PIN.</p>' + BQ.field("login-pin", "Login PIN", { type: "pin", max: 4 }) +
      '<button class="btn" data-act="login">Log in</button><p class="note">Forgot it? Use Reset at the top to start over.</p></div>';
  }
  // Draws the current screen (or the login / onboarding gate).
  BQ.render = function () {
    if (!S.onboarded) cur = "onboard"; else if (cur === "onboard") cur = "overview";
    BQ.chrome();
    const main = $("#bq-main");
    if (S.onboarded && !BQ.session.ok) return renderLogin(main);
    const sc = BQ.screens.filter(function (s) { return s.id === cur; })[0];
    if (!sc) { main.innerHTML = '<div class="card"><h2>Screen not available</h2><p>This part of the bank has not loaded.</p></div>'; return; }
    main.oninput = main.onchange = null;
    try { main.innerHTML = ""; sc.render(main); } catch (err) { main.innerHTML = '<div class="card"><h2>Something went wrong</h2><p class="note">' + esc(err.message) + "</p></div>"; }
  };
  // Saves and redraws without losing the scroll position.
  BQ.refresh = function () { BQ.save(); const y = window.scrollY; BQ.render(); window.scrollTo(0, y); };
  BQ.go = function (id) { cur = id; BQ.render(); window.scrollTo(0, 0); };
  BQ.cur = function () { return cur; };

  // Built-in button actions.
  BQ.on("go", function (el) { BQ.go(el.dataset.arg); });
  BQ.on("close", BQ.closeModal);
  BQ.on("skip", function (el) { BQ.skip(parseInt(el.dataset.arg, 10) === 30 ? Math.round((BQ.addMonths(S.date, 1) - S.date) / DAY) : parseInt(el.dataset.arg, 10)); });
  BQ.on("login", function () {
    if (BQ.val("login-pin") === S.pins.login) { BQ.session.ok = true; BQ.render(); } else BQ.toast("Wrong login PIN. Try again.", "bad");
  });
  BQ.on("resetAsk", function () { BQ.modal("Reset Practice Bank?", "<p>This deletes your practice account and starts again from the beginning. Nothing real is affected.</p>", [{ t: "Yes, reset", act: "reset" }, { t: "Cancel", cls: "btn-ghost" }]); });
  BQ.on("reset", function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } S = fresh(); BQ.pend = null; BQ.session.ok = false; BQ.closeModal(); cur = "onboard"; BQ.render(); });
  BQ.on("otpShow", BQ.otpModal);
  BQ.on("otpAlerts", function () { BQ.closeModal(); BQ.go("alerts"); });
  BQ.on("otpCancel", function () { BQ.pend = null; BQ.closeModal(); BQ.refresh(); });
  BQ.on("otpOk", function () {
    if (!BQ.pend) return;
    if (BQ.val("otp-in") !== BQ.pend.code) { BQ.toast("That OTP is not correct. Check the SMS in Alerts.", "bad"); return; }
    const cb = BQ.pend.cb; BQ.pend = null; BQ.closeModal(); cb(); BQ.refresh();
  });

  // Builds the page frame, starts listening for clicks, and opens the first screen.
  BQ.start = function () {
    S = load();
    $("#bq-app").innerHTML = '<aside id="bq-side" class="bq-side glass"></aside><div class="bq-body"><header id="bq-top" class="bq-top glass"></header><div id="bq-banner"></div>' +
      '<div class="bq-warn">Practice only. Never type your real details here.</div><main id="bq-main"></main>' +
      '<p class="note bq-foot">For learning only, not financial advice. All money, names, rates, fees and limits here are made up or "for example".</p></div>';
    document.body.insertAdjacentHTML("beforeend", '<div id="bq-modal" class="bq-modal hidden"></div><div id="bq-toast" aria-live="polite"></div>');
    document.addEventListener("click", function (e) {
      const el = e.target.closest("[data-act]");
      if (el && BQ.acts[el.dataset.act]) { e.preventDefault(); BQ.acts[el.dataset.act](el, e); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") BQ.closeModal(); });
    BQ.render();
  };
})();
