/* bank-screens.js - the 9 screens of the MoneyQuest Practice Bank. Everything is fictional.
   Each screen registers itself with BQ.register(); buttons use data-act names handled by BQ.on(). */
"use strict";
(function () {
  const B = window.BQ;
  if (!B) return;
  const S = function () { return B.S; };
  const inr = B.inr, esc = B.esc, gl = B.gl, F = B.field, $ = B.$, DAY = B.DAY;

  // ---------- Shared small helpers ----------
  // A glass card with a heading.
  const card = function (h, body, cls) { return '<section class="card ' + (cls || "") + '"><h2>' + h + "</h2>" + body + "</section>"; };
  // A small number tile.
  const tile = function (l, v, s) { return '<div class="bq-tile"><small>' + l + "</small><b>" + v + "</b>" + (s ? "<small>" + s + "</small>" : "") + "</div>"; };
  // A button wired to a data-act name.
  const btn = function (t, act, arg, cls) { return '<button class="btn ' + (cls || "") + '" data-act="' + act + '"' + (arg !== undefined ? ' data-arg="' + esc(arg) + '"' : "") + ">" + t + "</button>"; };
  // A result dialog (ok or failed) with a closing button.
  const result = function (ok, title, html) { B.modal((ok ? "✅ " : "❌ ") + title, html); };
  // Finds an item in an array by id.
  const byId = function (arr, id) { return arr.filter(function (x) { return x.id === id; })[0]; };
  // The "for learning only" reminder used under forms.
  const NOTE = '<p class="note">All rates, fees and limits here are made up, "for example".</p>';

  // ================= 1. Onboarding =================
  const ob = { step: 1, type: "savings", name: "", mobile: "", dob: "", addr: "", doc: "Aadhaar", login: "", upi: "" };
  const DOCS = ["Aadhaar", "Passport", "Voter ID", "Driving licence", "PAN card"];

  // Draws the 3-step account opening flow.
  function renderOnboard(el) {
    const steps = '<div class="bq-steps">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= ob.step ? "on" : "") + '"></i>'; }).join("") + "</div>";
    let body = "";
    if (ob.step === 1) {
      body = "<h2>Welcome to MoneyQuest Practice Bank</h2><p>Step 1 of 3: choose an account type.</p>" +
        Object.keys(B.INCOME).map(function (k) {
          const t = { savings: "Pays interest and has a minimum balance rule (for example ₹2,000).", zero: "No minimum balance. Great for beginners.", salary: "For people whose employer pays them each month." }[k];
          return '<button class="bq-pick' + (ob.type === k ? " on" : "") + '" data-act="obType" data-arg="' + k + '"><b>' + B.INCOME[k].name + "</b><br><small>" + t + "</small></button>";
        }).join("") + '<div class="bq-row">' + btn("Next", "obNext") + "</div>";
    } else if (ob.step === 2) {
      body = "<h2>Mock KYC</h2><p>Step 2 of 3: the bank checks who you are.</p>" +
        '<div class="bq-row">' + btn("Fill sample details", "obFill", undefined, "btn-ghost") + "</div>" +
        F("k-name", "Full name", { val: ob.name, ph: "Sample name" }) + F("k-mob", "Mobile number", { val: ob.mobile, mode: "numeric", max: 10, ph: "Sample number" }) +
        F("k-dob", "Date of birth", { val: ob.dob, ph: "DD-MM-YYYY" }) + F("k-addr", "Address", { val: ob.addr, ph: "Sample address" }) +
        F("k-doc", "Identity document type", { type: "select", opts: DOCS, val: ob.doc, hint: "No document number is needed. This is only practice." }) +
        '<p class="note">' + gl("What is KYC? KYC (Know Your Customer) is the check a bank does to confirm who you are. You do it once, through the bank's own app or branch, and never through a message link.") + "</p>" +
        '<div class="bq-row">' + btn("Back", "obBack", undefined, "btn-ghost") + btn("Next", "obNext") + "</div>";
    } else {
      body = "<h2>Set your PINs</h2><p>Step 3 of 3: pick practice PINs. Do not reuse your real ones.</p>" +
        F("p-login", "Login PIN (4 digits)", { type: "pin", max: 4, val: ob.login }) + F("p-upi", "UPI PIN (6 digits)", { type: "pin", max: 6, val: ob.upi, hint: "You enter the UPI PIN only to PAY money." }) +
        '<div class="bq-row">' + btn("Back", "obBack", undefined, "btn-ghost") + btn("Open my account", "obOpen") + "</div>";
    }
    el.innerHTML = '<section class="card">' + steps + body + "</section>";
  }
  // Remembers what was typed on the KYC / PIN steps.
  function obRead() {
    if (ob.step === 2) { ob.name = B.val("k-name"); ob.mobile = B.val("k-mob"); ob.dob = B.val("k-dob"); ob.addr = B.val("k-addr"); ob.doc = B.val("k-doc"); }
    if (ob.step === 3) { ob.login = B.val("p-login"); ob.upi = B.val("p-upi"); }
  }
  B.on("obType", function (el) { ob.type = el.dataset.arg; B.render(); });
  B.on("obFill", function () { obRead(); ob.name = "Asha Sample"; ob.mobile = "9000000000"; ob.dob = "01-01-2000"; ob.addr = "12 Sample Street, Practice City"; B.render(); });
  B.on("obBack", function () { obRead(); ob.step--; B.render(); });
  B.on("obNext", function () {
    obRead();
    if (ob.step === 2 && (!ob.name || ob.mobile.length < 10 || !ob.dob || !ob.addr)) return B.toast("Fill every box, or tap Fill sample details.", "bad");
    ob.step++; B.render();
  });
  // Creates the account, welcome SMS, sample messages and requests.
  B.on("obOpen", function () {
    obRead();
    if (!/^\d{4}$/.test(ob.login) || !/^\d{6}$/.test(ob.upi)) return B.toast("Login PIN must be 4 digits and UPI PIN 6 digits.", "bad");
    const s = S(), A = B.INCOME[ob.type];
    s.acct = { type: ob.type, name: ob.name, mobile: ob.mobile, doc: ob.doc, no: "7700" + B.digits(8), ifsc: "MQPB0" + B.digits(6) };
    s.pins = { login: ob.login, upi: ob.upi };
    s.onboarded = true; B.session.ok = true;
    B.earn(A.open, "Opening deposit (practice money)", "Income", "Cash");
    B.sms("Welcome to MoneyQuest Practice Bank! A/c " + s.acct.no + ", IFSC " + s.acct.ifsc + ". Opening balance " + inr(A.open) + ". Never share your OTP or PIN.");
    for (let i = B.FAKES.length - 1; i >= 0; i--) B.sendQuiz(i);
    s.collects.push({ id: B.uid(), from: "Cashback Desk", upi: "cashback.desk@mqbank", amt: 1850, note: "Approve to RECEIVE your refund", scam: true, status: "pending" },
      { id: B.uid(), from: "Ravi Kumar", upi: "ravi.sample@mqbank", amt: 350, note: "Dinner split", scam: false, status: "pending" });
    B.done("open");
    const no = s.acct.no, ifsc = s.acct.ifsc;
    ob.step = 1; ob.login = ob.upi = "";
    B.save(); B.render();
    B.modal("🎉 Account opened", "<p>Account number: <b>" + no + "</b><br>IFSC: <b>" + ifsc + "</b> (made-up)</p><p>A welcome SMS is waiting in <b>Alerts</b>. Read your SMS messages there, including any OTP. Try the Missions on the Overview.</p>", [{ t: "Go to Overview" }]);
  });
  B.register({ id: "onboard", label: "Open account", icon: "📝", render: renderOnboard, show: function () { return !S().onboarded; } });

  // ================= 2. Overview =================
  // Value of FDs, RDs and SIPs.
  function investTotal() {
    const s = S(); let t = 0;
    s.fds.forEach(function (f) { if (f.status === "active") t += f.amt; });
    s.rds.forEach(function (r) { if (r.status === "active") t += r.val; });
    s.sips.forEach(function (x) { if (x.status !== "stopped") t += x.units * s.navs[x.fund]; });
    return B.round2(t);
  }
  // Total still owed on loans.
  function loanTotal() { let t = 0; S().loans.forEach(function (L) { if (L.status === "active") t += L.bal + L.arrears; }); return B.round2(t); }
  // Spending-by-category bar chart as inline SVG.
  function spendChart() {
    const d = B.spendByCat(30).slice(0, 7);
    if (!d.length) return '<p class="note">No spending in the last 30 days yet.</p>';
    const cols = ["#ffa733", "#6fa8ff", "#5be38f", "#ffd24a", "#ff7a7a", "#c79bff", "#7fe0e0"];
    let g = "";
    d.forEach(function (r, i) {
      const w = Math.max(4, r[1] / d[0][1] * 190), y = i * 34 + 4;
      g += '<text x="0" y="' + (y + 16) + '" fill="currentColor" font-size="12">' + esc(r[0]) + '</text><rect x="100" y="' + y + '" width="' + w + '" height="22" rx="6" fill="' + cols[i % 7] + '"></rect><text x="' + (106 + w) + '" y="' + (y + 16) + '" fill="currentColor" font-size="12">' + inr(r[1]) + "</text>";
    });
    return '<svg viewBox="0 0 420 ' + (d.length * 34 + 8) + '" width="100%" role="img" aria-label="Spending by category, last 30 days">' + g + "</svg>";
  }
  // Semi-circle credit score gauge (300 to 900).
  function gauge(score) {
    const L = Math.PI * 110, f = (score - 300) / 600, col = score < 600 ? "#ff7a7a" : score < 700 ? "#ffd24a" : "#5be38f";
    const band = score < 600 ? "Poor" : score < 700 ? "Fair" : score < 750 ? "Good" : "Excellent";
    const arc = '<path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke-width="18" stroke-linecap="round" ';
    return '<svg viewBox="0 0 300 172" width="100%" style="max-width:300px" role="img" aria-label="Credit score ' + score + ' out of 900">' + arc + 'stroke="rgba(255,238,220,.18)"/>' + arc + 'stroke="' + col + '" stroke-dasharray="' + (f * L).toFixed(1) + " " + L.toFixed(1) + '"/>' +
      '<text x="150" y="126" text-anchor="middle" font-size="40" font-weight="700" fill="currentColor">' + score + '</text><text x="150" y="150" text-anchor="middle" font-size="14" fill="currentColor">' + band + '</text><text x="30" y="170" font-size="11" fill="currentColor">300</text><text x="270" y="170" text-anchor="end" font-size="11" fill="currentColor">900</text></svg>';
  }
  // One transaction line for lists.
  function txLine(e) {
    return "<li><span>" + esc(e.desc) + '<br><small class="note">' + B.dstr(e.date) + (e.acct === "cc" ? " · Credit card" : "") + '</small></span><b class="' + ((e.acct === "sav") === (e.dir === "cr") ? "good" : "bad") + '">' + (e.dir === "cr" ? "+" : "-") + inr(e.amt) + "</b></li>";
  }
  // Draws the Overview screen.
  function renderOverview(el) {
    const s = S(), bal = B.bal(), out = B.ccOut(), inv = investTotal(), ln = loanTotal(), unread = s.alerts.filter(function (a) { return !a.read; }).length;
    const done = B.MISSIONS.filter(function (m) { return s.missions[m.id]; }).length;
    const up = B.upcoming().slice(0, 6), recent = s.ledger.slice(-6).reverse();
    el.innerHTML =
      '<div class="bq-grid" style="margin-bottom:20px">' + tile("Savings balance", inr(bal), s.acct.name + " · A/c " + s.acct.no) + tile("Credit card owed", inr(out), "Available " + inr(s.card.limit - out)) +
      tile("Deposits and SIP", inr(inv), "FD, RD and SIP value") + tile("Loans owed", inr(ln)) + tile("Net worth", inr(B.round2(bal + inv - out - ln))) +
      '<button class="bq-tile" data-act="go" data-arg="alerts" style="cursor:pointer;color:inherit;font:inherit;text-align:left;min-height:44px"><small>Alerts</small><b>🔔 ' + unread + "</b><small>unread messages</small></button></div>" +
      '<div class="bq-grid2">' +
      card("Spending by category", spendChart() + '<p class="note">Last 30 days, from your ledger.</p>') +
      card("Credit score", '<div style="text-align:center">' + gauge(s.credit) + "</div><h3>" + gl("Why it changed") + "</h3>" +
        (s.why.length ? '<ul class="bq-list">' + s.why.slice(0, 5).map(function (w) { return "<li><span>" + esc(w.t) + '<br><small class="note">' + B.dstr(w.date) + '</small></span><b class="' + (w.d > 0 ? "good" : "bad") + '">' + (w.d > 0 ? "+" : "") + w.d + "</b></li>"; }).join("") + "</ul>" : '<p class="note">No changes yet. Paying bills, EMIs and card dues on time helps your ' + gl("credit score") + ".</p>")) +
      card("Recent transactions", '<ul class="bq-list">' + (recent.length ? recent.map(txLine).join("") : '<li class="note">No transactions yet.</li>') + "</ul>" + btn("Open Passbook", "go", "passbook", "btn-ghost")) +
      card("Upcoming payments", '<ul class="bq-list">' + (up.length ? up.map(function (u) { return "<li><span>" + esc(u.t) + '<br><small class="note">' + B.dstr(u.date) + '</small></span><b class="' + (u.inflow ? "good" : "") + '">' + inr(u.amt) + "</b></li>"; }).join("") : '<li class="note">Nothing due. Skip time to see bills and EMIs arrive.</li>') + "</ul>") +
      "</div>" +
      card("🎯 Missions: " + done + " of " + B.MISSIONS.length, '<div class="bq-bar"><i style="width:' + (done / B.MISSIONS.length * 100) + '%"></i></div><ul class="bq-list">' +
        B.MISSIONS.map(function (m) { return "<li><span>" + (s.missions[m.id] ? "✅" : "⬜") + " <b>" + m.t + '</b><br><small class="note">' + gl(m.d) + "</small></span></li>"; }).join("") + "</ul>");
  }
  B.register({ id: "overview", label: "Overview", icon: "🏠", render: renderOverview, show: function () { return S().onboarded; } });

  // ================= 3. Passbook =================
  const pbf = { acct: "sav", q: "", dir: "", cat: "", from: "", to: "", min: "", max: "" };
  // Ledger rows with running balance, after applying the filters.
  function pbRows() {
    let run = 0; const all = [];
    S().ledger.forEach(function (e) {
      if (e.acct !== pbf.acct) return;
      run = B.round2(run + ((pbf.acct === "sav") === (e.dir === "cr") ? e.amt : -e.amt));
      all.push({ e: e, run: run });
    });
    const q = pbf.q.toLowerCase(), f = pbf.from ? Date.parse(pbf.from + "T00:00:00Z") : null, t = pbf.to ? Date.parse(pbf.to + "T00:00:00Z") : null;
    return all.filter(function (r) {
      const e = r.e;
      return (!q || (e.desc + " " + e.ref + " " + e.mode).toLowerCase().indexOf(q) >= 0) && (!pbf.dir || e.dir === pbf.dir) && (!pbf.cat || e.cat === pbf.cat) &&
        (f === null || e.date >= f) && (t === null || e.date <= t) && (pbf.min === "" || e.amt >= +pbf.min) && (pbf.max === "" || e.amt <= +pbf.max);
    }).reverse();
  }
  // Draws just the table part of the Passbook.
  function pbTable() {
    const rows = pbRows(), cr = pbf.acct === "sav" ? "cr" : "dr";
    $("#pb-out").innerHTML = B.table(["Date", "Description", "Mode", "Debit", "Credit", pbf.acct === "sav" ? "Balance" : "Owed"], rows.slice(0, 200).map(function (r) {
      const e = r.e, isCr = e.dir === "cr";
      return [B.dstr(e.date), esc(e.desc) + (e.ref ? '<br><small class="note">' + esc(e.ref) + "</small>" : ""), esc(e.mode), isCr ? "" : inr(e.amt), isCr ? inr(e.amt) : "", inr(r.run)];
    })) + '<p class="note">' + rows.length + " entries" + (rows.length > 200 ? " (showing the latest 200)" : "") + "." + (cr ? "" : "") + "</p>";
  }
  // Draws the Passbook screen with its filters.
  function renderPassbook(el) {
    const cats = []; S().ledger.forEach(function (e) { if (cats.indexOf(e.cat) < 0) cats.push(e.cat); });
    el.innerHTML = card("📒 Passbook", '<div class="bq-grid">' + F("pb-acct", "Account", { type: "select", opts: [["sav", "Savings account"], ["cc", "Credit card"]], val: pbf.acct }) +
      F("pb-q", "Search", { type: "search", val: pbf.q, ph: "Name, mode or reference" }) + F("pb-dir", "Type", { type: "select", opts: [["", "All"], ["cr", "Money in (credit)"], ["dr", "Money out (debit)"]], val: pbf.dir }) +
      F("pb-cat", "Category", { type: "select", opts: [["", "All"]].concat(cats), val: pbf.cat }) + F("pb-from", "From date", { type: "date", val: pbf.from }) + F("pb-to", "To date", { type: "date", val: pbf.to }) +
      F("pb-min", "Min amount", { type: "number", val: pbf.min, mode: "decimal" }) + F("pb-max", "Max amount", { type: "number", val: pbf.max, mode: "decimal" }) + '</div><div id="pb-out"></div>' +
      '<p class="note">' + gl("Debit and credit entries") + ": a debit is money out, a credit is money in. This is your " + gl("account statement") + ".</p>");
    pbTable();
    el.oninput = el.onchange = function (e) {
      const m = { "pb-acct": "acct", "pb-q": "q", "pb-dir": "dir", "pb-cat": "cat", "pb-from": "from", "pb-to": "to", "pb-min": "min", "pb-max": "max" }[e.target.id];
      if (!m) return;
      pbf[m] = e.target.value;
      if (m === "acct") B.render(); else pbTable();
    };
  }
  B.register({ id: "passbook", label: "Passbook", icon: "📒", render: renderPassbook });

  // ================= 4. Transfers and UPI =================
  const MODES = { upi: "UPI ID", phone: "UPI to phone number", neft: "NEFT", imps: "IMPS", rtgs: "RTGS" };
  const FEE = { upi: 0, phone: 0, neft: 0, imps: 5, rtgs: 25 }, CAPPED = ["upi", "phone", "imps"], DAILY = 25000;
  const DIR = { upi: { "ravi.sample@mqbank": "Ravi Kumar", "priya.sample@mqbank": "Priya Nair", "chai.corner@mqbank": "Chai Corner (shop)", "mom@mqbank": "Mother (sample)" },
    phone: { "9000000001": "Ravi Kumar", "9000000002": "Priya Nair", "9000000003": "Chai Corner (shop)" } };
  let xf = { mode: "upi" }, px = null;

  // Finds the name behind a UPI ID or phone number (sample directory plus your beneficiaries).
  function lookup(kind, v) {
    v = v.toLowerCase();
    let n = DIR[kind][v] || null;
    S().bens.forEach(function (b) { if ((kind === "upi" && b.upi && b.upi.toLowerCase() === v) || (kind === "phone" && b.phone === v)) n = b.name; });
    return n;
  }
  // Deliberate typos of the sample payees: they teach what "Payee not found" looks like.
  const TRAPS = ["ravi.sampel@mqbank", "priya.sample@mqbnk", "chai.corner@mqbamk", "mom@mqbank.in", "rav1.sample@mqbank", "9000000011"];
  const NAMES1 = ["Aarav", "Diya", "Kabir", "Isha", "Rohan", "Meera", "Vikram", "Anaya", "Arjun", "Nisha", "Sameer", "Tara"], NAMES2 = ["Sharma", "Verma", "Das", "Reddy", "Khan", "Joshi", "Menon", "Gill", "Bose", "Patil", "Singh", "Rao"];
  // Makes the same made-up display name for the same ID or number every time.
  function fakeName(id) {
    let h = 7;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return NAMES1[h % 12] + " " + NAMES2[(h >>> 4) % 12] + " (practice)";
  }
  // Tappable chips under the UPI ID / phone field: sample payees, recent payees and a typo trap.
  function payeeChips() {
    const k = xf.mode === "upi" ? "upi" : "phone", recent = (S().recent || []).filter(function (r) { return r.mode === k; });
    const chip = function (label, id) { return btn(label, "tFillId", id, "btn-ghost"); };
    return '<p class="note">Sample payees:</p><div class="bq-row">' + Object.keys(DIR[k]).map(function (id) { return chip(DIR[k][id], id); }).join("") + chip("Try a typo", k === "upi" ? TRAPS[0] : TRAPS[5]) + "</div>" +
      (recent.length ? '<p class="note">Recent payees:</p><div class="bq-row">' + recent.map(function (r) { return chip(r.name, r.id); }).join("") + "</div>" : "");
  }
  B.on("tFillId", function (el) { $("#t-to").value = el.dataset.arg; });
  // The send-money form for the chosen mode.
  function sendForm() {
    const act = S().bens.filter(function (b) { return b.active; });
    const to = xf.mode === "upi" ? F("t-to", "UPI ID", { ph: "name@bank", hint: "Sample IDs: ravi.sample@mqbank, priya.sample@mqbank, chai.corner@mqbank" }) :
      xf.mode === "phone" ? F("t-to", "Mobile number", { mode: "numeric", max: 10, ph: "10 digits", hint: "Sample numbers: 9000000001, 9000000002" }) :
      act.length ? F("t-ben", "Beneficiary", { type: "select", opts: act.map(function (b) { return [b.id, b.name + " (" + b.acct + ")"]; }) }) : '<p class="note">No active beneficiary yet. Add one below; it activates after a day (use Skip 1 day).</p>';
    return F("t-mode", "How to send", { type: "select", opts: Object.keys(MODES).map(function (k) { return [k, MODES[k]]; }), val: xf.mode }) + to + (xf.mode === "upi" || xf.mode === "phone" ? payeeChips() : "") +
      F("t-amt", "Amount (₹)", { type: "number", mode: "decimal", ph: "0" }) + '<div class="bq-row">' + btn("Continue", "tSend") + "</div>";
  }
  // Draws the Transfers screen.
  function renderTransfers(el) {
    const s = S(), pend = s.collects.filter(function (c) { return c.status === "pending"; }), old = s.collects.filter(function (c) { return c.status !== "pending"; }).slice(0, 4);
    el.innerHTML =
      card("💸 Send money", '<div id="send-box">' + sendForm() + "</div>" + (s.upiLock ? '<p class="bad"><b>UPI is locked after wrong PIN tries. Use Skip 1 day.</b></p>' : "") +
        '<p class="note">Daily limit for UPI and IMPS here: ' + inr(DAILY) + " (for example). Sent today: " + inr(B.outToday()) + ".</p>") +
      card("Which mode when? (illustrative)", B.table(["Mode", "Speed", "Best for", "Fee (e.g.)"], [
        [gl("UPI"), "Instant, 24x7", "Shops, friends, small payments", "₹0"], [gl("IMPS"), "Instant, 24x7", "Urgent bank-to-bank", "₹5"],
        [gl("NEFT"), "Within hours, in batches", "Regular transfers, rent", "₹0"], [gl("RTGS"), "Real-time", "Large payments (min ₹2,00,000 here)", "₹25"]])) +
      card("Collect requests", (pend.length ? '<ul class="bq-list">' + pend.map(function (c) {
        return "<li><span><b>" + esc(c.from) + "</b> wants " + inr(c.amt) + '<br><small class="note">' + esc(c.upi) + " · “" + esc(c.note) + "”</small></span><span>" + btn("Approve", "cApprove", c.id, "btn-ghost") + " " + btn("Decline", "cDecline", c.id, "btn-ghost") + "</span></li>";
      }).join("") + "</ul>" : '<p class="note">No pending requests.</p>') +
        '<p class="note">' + gl("A collect request takes money OUT of your account when you approve. Some are scams. Check who it is from before you approve.") + "</p>" +
        (old.length ? '<ul class="bq-list">' + old.map(function (c) { return '<li class="note"><span>' + esc(c.from) + " " + inr(c.amt) + "</span><span>" + c.status + "</span></li>"; }).join("") + "</ul>" : "")) +
      card("Beneficiaries", '<ul class="bq-list">' + (s.bens.length ? s.bens.map(function (b) { return "<li><span><b>" + esc(b.name) + '</b><br><small class="note">A/c ' + esc(b.acct) + " · " + esc(b.ifsc) + "</small></span>" + (b.active ? '<span class="bq-tag good">Active</span>' : '<span class="bq-tag warn">Activates ' + B.dstr(b.activeOn) + "</span>") + "</li>"; }).join("") : '<li class="note">None yet.</li>') + "</ul>" +
        "<h3>" + gl("Add a beneficiary") + "</h3>" + '<div class="bq-row">' + btn("Fill sample details", "bFill", undefined, "btn-ghost") + "</div>" + '<div class="bq-grid">' +
        F("b-name", "Name") + F("b-acct", "Account number", { mode: "numeric" }) + F("b-ifsc", "IFSC", { ph: "e.g. MQPB0123456" }) + F("b-upi", "UPI ID (optional)") + F("b-phone", "Phone (optional)", { mode: "numeric", max: 10 }) + "</div>" +
        btn("Add beneficiary", "bAdd") + '<p class="note">An OTP will arrive as an SMS in Alerts. New beneficiaries activate after a day, a safety delay.</p>');
    el.onchange = function (e) { if (e.target.id === "t-mode") { xf.mode = e.target.value; $("#send-box").innerHTML = sendForm(); } };
  }
  // Shows a failed-attempt dialog and an SMS. Nothing is debited.
  function fail(title, msg) {
    const r = B.ref("FAIL");
    if (px) B.sms("Transaction of " + inr(px.amt) + " to " + px.name + " FAILED (" + title + "). No money was debited. Ref " + r + ".");
    result(false, esc(title), "<p>" + msg + '</p><p class="note">No money left your account. Reference for this failed attempt: <b>' + r + "</b></p>");
    px = null; B.refresh();
  }
  // Opens the "check the payee" confirm dialog.
  function confirmModal() {
    B.modal("Confirm payment", '<div class="bq-tile"><small>You are paying</small><b>' + esc(px.name) + "</b><small>" + esc(px.id) + " · " + MODES[px.mode] + "</small></div>" +
      (px.note ? '<p class="note">Request note: “' + esc(px.note) + "”</p>" : "") + "<p>Amount: <b>" + inr(px.amt) + "</b>" + (px.fee ? " + fee " + inr(px.fee) + " (for example)" : "") + '</p><p class="note">Check the name. Enter your UPI PIN only to PAY money, never to receive it.</p>' +
      F("upi-pin", "UPI PIN (6 digits)", { type: "pin", max: 6 }), [{ t: "Pay " + inr(px.amt), act: "tPay" }, { t: "Cancel", cls: "btn-ghost" }]);
  }
  B.on("tSend", function () {
    const s = S(), m = xf.mode, amt = B.num("t-amt");
    if (amt <= 0) return B.toast("Enter an amount.", "bad");
    let name, id;
    if (m === "upi" || m === "phone") {
      id = B.val("t-to").replace(/\s/g, ""); name = lookup(m, id);
      px = { amt: amt, name: id || "(blank)" };
      // Known wrong IDs are checked first, so "mom@mqbank.in" says "Payee not found" rather than a format error.
      if (TRAPS.indexOf(id.toLowerCase()) >= 0) return fail("Payee not found", "No account matches “" + esc(id) + "”. Wrong UPI IDs and numbers are common, so always check spelling.");
      if (!(m === "upi" ? /^[a-z0-9.\-]+@[a-z0-9]+$/i : /^[6-9]\d{9}$/).test(id)) return fail("Invalid UPI ID or number", "Invalid UPI ID or number, check the format. A UPI ID looks like name@handle; a phone number has 10 digits starting with 6, 7, 8 or 9.");
      if (!name) {
        name = fakeName(id.toLowerCase());
        px = { kind: "send", mode: m, name: name, id: id, amt: amt, fee: FEE[m], isNew: true };
        return B.modal("Verify payee", '<div class="bq-tile"><small>New payee</small><b>' + esc(name) + "</b><small>" + esc(id) + "</small></div>" +
          '<p class="note">Always check the name shown matches who you meant to pay.</p>', [{ t: "Name is right, continue", act: "tVerified" }, { t: "Cancel", cls: "btn-ghost" }]);
      }
    } else {
      const b = byId(s.bens, B.val("t-ben"));
      if (!b) return B.toast("Add a beneficiary first. It activates after a day.", "bad");
      name = b.name; id = "A/c " + b.acct + " · " + b.ifsc; px = { amt: amt, name: name };
      if (m === "rtgs" && amt < 200000) return fail("Below RTGS minimum", "RTGS is for large payments: the minimum here is ₹2,00,000 (for example). Try NEFT or IMPS.");
    }
    px = { kind: "send", mode: m, name: name, id: id, amt: amt, fee: FEE[m] };
    confirmModal();
  });
  B.on("tVerified", function () { if (px) confirmModal(); });
  // Checks the UPI PIN and balance, then moves the money through the ledger.
  B.on("tPay", function () {
    const s = S();
    if (!px) return;
    if (s.upiLock) return fail("UPI PIN locked", "Too many wrong tries. UPI stays locked until the next day (use Skip 1 day).");
    if (B.val("upi-pin") !== s.pins.upi) {
      s.tries++;
      if (s.tries >= 3) { s.upiLock = true; return fail("UPI PIN locked", "Three wrong PIN tries. UPI is locked until the next day (use Skip 1 day). Never share your PIN to get it unlocked."); }
      B.toast("Wrong UPI PIN. " + (3 - s.tries) + " " + (s.tries === 2 ? "try" : "tries") + " left.", "bad"); $("#upi-pin").value = ""; return;
    }
    const total = px.amt + px.fee;
    if (B.bal() < total) return fail("Insufficient balance", "Your balance is " + inr(B.bal()) + " but this payment needs " + inr(total) + ".");
    if (CAPPED.indexOf(px.mode) >= 0 && B.outToday() + px.amt > DAILY) return fail("Daily limit reached", "The daily UPI/IMPS limit here is " + inr(DAILY) + " (for example). Already sent today: " + inr(B.outToday()) + ".");
    const ref = B.ref("UTR"), tag = MODES[px.mode];
    B.spend(px.amt, tag + " to " + px.name, "Transfers", tag, ref);
    if (px.fee) B.spend(px.fee, "Transfer fee (" + tag + ")", "Fees", tag, ref);
    B.addOut(px.amt); s.tries = 0;
    if (px.isNew) { s.recent = s.recent || []; s.recent.unshift({ mode: px.mode, id: px.id, name: px.name }); s.recent = s.recent.slice(0, 6); }
    B.sms("Debit alert: " + inr(px.amt) + " sent to " + px.name + ". Ref " + ref + ". Avl bal " + inr(B.bal()) + ".");
    const c = px.kind === "collect" ? byId(s.collects, px.cid) : null, amt = px.amt, name = px.name, mode = px.mode;
    if (c) c.status = "approved";
    if (!c && amt === 100 && (mode === "upi" || mode === "phone")) B.done("send100");
    px = null; B.refresh();
    if (c && c.scam) result(false, "What went wrong", "<p>That was a <b>scam collect request</b>. You approved it and lost " + inr(amt) + ".</p><ul><li>A collect request takes money out. You never enter a PIN to receive money.</li><li>The sender was not someone you know.</li></ul><p>If this happens for real, call <b>1930</b> or report at <b>cybercrime.gov.in</b> quickly.</p>");
    else result(true, "Payment successful", "<p>" + inr(amt) + " sent to <b>" + esc(name) + "</b>.</p><p>Reference (" + gl("UTR") + "): <b>" + ref + "</b><br>" + B.dstr(s.date) + "</p>");
  });
  B.on("cApprove", function (el) {
    const c = byId(S().collects, el.dataset.arg); if (!c) return;
    px = { kind: "collect", cid: c.id, mode: "upi", name: c.from, id: c.upi, amt: c.amt, fee: 0, note: c.note }; confirmModal();
  });
  B.on("cDecline", function (el) {
    const c = byId(S().collects, el.dataset.arg); if (!c) return;
    c.status = "declined"; B.refresh();
    if (c.scam) { B.done("spotfake"); result(true, "Good catch!", "<p>That collect request was a scam: it said you would <i>receive</i> money, but approving takes money out. Declining is right.</p>"); } else B.toast("Request declined.");
  });
  B.on("bFill", function () {
    const v = { "b-name": "Meena Iyer (sample)", "b-acct": "000123456789", "b-ifsc": "MQPB0123456", "b-upi": "meena.sample@mqbank", "b-phone": "9000000004" };
    Object.keys(v).forEach(function (k) { $("#" + k).value = v[k]; });
  });
  B.on("bAdd", function () {
    const b = { id: B.uid(), name: B.val("b-name"), acct: B.val("b-acct"), ifsc: B.val("b-ifsc").toUpperCase(), upi: B.val("b-upi"), phone: B.val("b-phone") };
    if (!b.name || !/^\d{8,16}$/.test(b.acct) || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(b.ifsc)) return B.toast("Need a name, an account number (8-16 digits) and a valid IFSC (like MQPB0123456).", "bad");
    B.askOtp("adding beneficiary " + b.name, function () {
      b.active = false; b.activeOn = S().date + DAY; S().bens.push(b);
      B.sms("Beneficiary " + b.name + " added. It will be active after 24 hours.");
      B.toast("Beneficiary added. It activates after a day.");
    });
  });
  B.register({ id: "transfers", label: "Transfers", icon: "💸", render: renderTransfers });

  // ================= 5. Cards =================
  const MERCH = [["Sample Cafe", "Food"], ["Sample Mart (groceries)", "Shopping"], ["Sample Fashion Store", "Shopping"], ["Sample Cab Rides", "Travel"], ["Sample Electronics Hub", "Shopping"], ["Sample Cinema", "Fun"]];
  // Minimum due: from the statement if there is one, else a 5% estimate.
  function minDue() {
    const st = S().card.stmt, out = B.ccOut();
    if (st && !st.checked) return Math.min(out, Math.max(0, B.round2(st.min - st.paid)));
    return Math.min(out, out < 200 ? out : Math.max(200, Math.round(out * 0.05)));
  }
  // Draws the Cards screen.
  function renderCards(el) {
    const s = S(), C = s.card, D = s.deb, out = B.ccOut(), st = C.stmt;
    const dSpent = D.spent.day === s.date ? D.spent.amt : 0;
    el.innerHTML = '<div class="bq-grid2">' +
      card("Debit card", '<div class="bq-card' + (D.blocked ? " off" : "") + '"><b>MoneyQuest Practice</b><div class="num">•••• •••• •••• 4821</div><small>' + esc(s.acct.name.toUpperCase()) + "</small>" + (D.blocked ? " · BLOCKED" : "") + "</div>" +
        "<p>Status: " + (D.blocked ? '<span class="bq-tag bad">Blocked</span>' : '<span class="bq-tag good">Active</span>') + "<br>Daily limit: <b>" + inr(D.limit) + "</b> · Spent today: " + inr(dSpent) + "</p>" +
        '<div class="bq-row">' + btn(D.blocked ? "Unblock card" : "Block card", "dBlock", undefined, "btn-ghost") + "</div>" + F("d-lim", "Daily limit (₹)", { type: "number", val: D.limit, mode: "numeric" }) + btn("Save limit", "dLimit", undefined, "btn-ghost")) +
      card("Credit card", '<div class="bq-card cc' + (C.blocked ? " off" : "") + '"><b>MoneyQuest Practice Credit</b><div class="num">•••• •••• •••• 7305</div><small>LIMIT ' + inr(C.limit) + "</small>" + (C.blocked ? " · BLOCKED" : "") + "</div>" +
        '<div class="bq-grid" style="margin-top:12px">' + tile("Outstanding", inr(out)) + tile("Available", inr(C.limit - out)) + "</div>" +
        '<div class="bq-row">' + btn("Pay minimum " + inr(minDue()), "ccPay", "min", "btn-ghost") + btn("Pay full " + inr(out), "ccPay", "full", "btn-ghost") + btn("Pay custom", "ccPay", "custom", "btn-ghost") + btn(C.blocked ? "Unblock" : "Block", "cBlock", undefined, "btn-ghost") + "</div>") + "</div>" +
      card("Credit card statement", (st ? '<div class="bq-grid">' + tile("Statement date", B.dstr(st.date)) + tile("Total due", inr(st.total)) + tile("Minimum due", inr(st.min)) + tile("Pay by", B.dstr(st.due), "Paid so far " + inr(st.paid)) + "</div>" : '<p class="note">No statement yet. One is made on the 20th of each month if you owe money.</p>') +
        '<p class="note">' + gl("Credit limit") + " and " + gl("minimum due") + ": if you pay only the minimum, interest (for example 3.5% a month) is charged on the rest. Missing the " + gl("due date") + " adds a " + gl("late fee") + " (for example ₹500) and lowers your credit score.</p>") +
      card("Make a purchase", "<p>Spend at a made-up merchant to see how card spending shows up in your Passbook and statement.</p>" + btn("🛍️ Make a purchase", "buy"));
  }
  B.on("dBlock", function () { const D = S().deb; D.blocked = !D.blocked; if (D.blocked) { B.done("block"); B.sms("Your debit card ending 4821 has been BLOCKED. Unblock it in the app if you find it."); } else B.sms("Your debit card ending 4821 is active again."); B.refresh(); });
  B.on("cBlock", function () { const C = S().card; C.blocked = !C.blocked; if (C.blocked) { B.done("block"); B.sms("Your credit card ending 7305 has been BLOCKED."); } B.refresh(); });
  B.on("dLimit", function () { const v = B.num("d-lim"); if (v < 500 || v > 100000) return B.toast("Pick a limit between ₹500 and ₹1,00,000.", "bad"); S().deb.limit = v; B.toast("Daily limit saved."); B.refresh(); });
  B.on("buy", function () {
    B.modal("Make a purchase", F("m-card", "Pay with", { type: "select", opts: [["deb", "Debit card (from savings)"], ["cc", "Credit card"]] }) + F("m-shop", "Merchant", { type: "select", opts: MERCH.map(function (m, i) { return [i, m[0]]; }) }) + F("m-amt", "Amount (₹)", { type: "number", mode: "decimal" }), [{ t: "Pay", act: "buyGo" }, { t: "Cancel", cls: "btn-ghost" }]);
  });
  B.on("buyGo", function () {
    const s = S(), amt = B.num("m-amt"), m = MERCH[+B.val("m-shop")], viaCc = B.val("m-card") === "cc";
    if (amt <= 0) return B.toast("Enter an amount.", "bad");
    let err = "";
    if (viaCc) {
      if (s.card.blocked) err = "Your credit card is blocked."; else if (amt > s.card.limit - B.ccOut()) err = "Over your available credit limit (" + inr(s.card.limit - B.ccOut()) + ").";
      else { B.post({ desc: "Card purchase - " + m[0], cat: m[1], dir: "dr", amt: amt, acct: "cc", mode: "Credit card" }); B.sms("Credit card spend: " + inr(amt) + " at " + m[0] + ". Outstanding " + inr(B.ccOut()) + "."); }
    } else {
      const D = s.deb, spent = D.spent.day === s.date ? D.spent.amt : 0;
      if (D.blocked) err = "Your debit card is blocked."; else if (spent + amt > D.limit) err = "Over your daily card limit of " + inr(D.limit) + ".";
      else if (!B.spend(amt, "Card purchase - " + m[0], m[1], "Debit card")) err = "Not enough balance.";
      else { D.spent = { day: s.date, amt: spent + amt }; B.sms("Debit alert: " + inr(amt) + " spent at " + m[0] + " using your debit card."); }
    }
    if (err) { B.modal("❌ Payment declined", "<p>" + err + "</p>"); return; }
    B.closeModal(); B.toast("Paid " + inr(amt) + " at " + m[0] + "."); B.refresh();
  });
  // Pays some amount of the credit card from savings.
  function payCard(amt) {
    const s = S(), out = B.ccOut();
    if (out <= 0) return B.toast("Nothing is owed on the card.");
    amt = Math.min(amt, out);
    if (amt <= 0) return B.toast("Enter an amount.", "bad");
    if (!B.spend(amt, "Credit card payment", "Card payment", "Net banking")) return B.toast("Not enough savings for that payment.", "bad");
    B.post({ desc: "Payment received - thank you", cat: "Card payment", dir: "cr", amt: amt, acct: "cc", mode: "Net banking" });
    if (s.card.stmt && !s.card.stmt.checked) s.card.stmt.paid = B.round2(s.card.stmt.paid + amt);
    B.sms("Credit card payment of " + inr(amt) + " received. Outstanding " + inr(B.ccOut()) + ".");
    if (B.ccOut() <= 0.005) B.done("ccfull");
    B.closeModal(); B.toast("Paid " + inr(amt) + " to the credit card."); B.refresh();
  }
  B.on("ccPay", function (el) {
    const k = el.dataset.arg;
    if (k === "min") payCard(minDue()); else if (k === "full") payCard(B.ccOut());
    else B.modal("Pay custom amount", F("cc-amt", "Amount (₹)", { type: "number", mode: "decimal", hint: "Owed: " + inr(B.ccOut()) }), [{ t: "Pay", act: "ccCustom" }, { t: "Cancel", cls: "btn-ghost" }]);
  });
  B.on("ccCustom", function () { payCard(B.num("cc-amt")); });
  B.register({ id: "cards", label: "Cards", icon: "💳", render: renderCards });

  // ================= 6. Deposits and SIP =================
  // Tiny line chart of recent NAV values.
  function spark(a) {
    const mn = Math.min.apply(null, a), mx = Math.max.apply(null, a), rng = (mx - mn) || 1;
    return '<svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true"><polyline points="' + a.map(function (v, i) { return (i / Math.max(a.length - 1, 1) * 120).toFixed(1) + "," + (30 - (v - mn) / rng * 28).toFixed(1); }).join(" ") + '" fill="none" stroke="#ffa733" stroke-width="2"/></svg>';
  }
  // Text estimate under the FD form.
  function fdEst() {
    const amt = B.num("fd-amt"), t = +B.val("fd-t"), r = B.FD_RATES[t];
    if (!amt) return "Enter an amount to see an estimate.";
    return "Rate " + r + "% a year (for example). " + (B.val("fd-pay") === "payout" ? "You get about " + inr(amt * r / 1200) + " every month and " + inr(amt) + " back at the end." : "You would get about " + inr(amt * Math.pow(1 + r / 400, t / 3)) + " after " + t + " months (interest added every 3 months).");
  }
  // Text estimate under the RD form.
  function rdEst() {
    const inst = B.num("rd-amt"), t = +B.val("rd-t"), r = B.RD_RATES[t];
    if (!inst) return "Enter a monthly amount to see an estimate.";
    let v = inst; for (let i = 2; i <= t; i++) v = v * (1 + r / 1200) + inst;
    return "Rate " + r + "% a year (for example). You would pay " + inr(inst * t) + " in total and get about " + inr(v) + " at the end. A missed instalment costs a penalty of 2% of it (for example).";
  }
  // Draws the Deposits and SIP screen.
  function renderDeposits(el) {
    const s = S();
    el.innerHTML =
      card("🏦 Fixed deposit (FD)", "<p>" + gl("A fixed deposit (FD) locks your money for a set time at a set rate.") + "</p>" + F("fd-amt", "Amount (₹, min 1,000)", { type: "number", mode: "numeric" }) +
        F("fd-t", "Tenure", { type: "select", opts: Object.keys(B.FD_RATES).map(function (k) { return [k, k + " months (" + B.FD_RATES[k] + "%)"]; }), val: 12 }) +
        F("fd-pay", "Interest", { type: "select", opts: [["reinvest", "Reinvest (grows to maturity)"], ["payout", "Payout every month"]] }) +
        '<p class="note" id="fd-est">' + fdEst() + "</p>" + btn("Open FD", "fdOpen") + NOTE +
        '<ul class="bq-list">' + (s.fds.filter(function (f) { return f.status === "active"; }).map(function (f) {
          return "<li><span><b>" + f.name + "</b> " + inr(f.amt) + " at " + f.rate + '%<br><small class="note">' + (f.payout ? "Monthly payout" : "Reinvest") + " · matures " + B.dstr(f.end) + "</small></span>" + btn("Break early", "fdBreak", f.id, "btn-ghost") + "</li>";
        }).join("") || '<li class="note">No active FDs.</li>') + "</ul>") +
      card("Recurring deposit (RD)", "<p>" + gl("A recurring deposit (RD) collects a fixed amount every month.") + "</p>" + F("rd-amt", "Monthly instalment (₹, min 100)", { type: "number", mode: "numeric" }) +
        F("rd-t", "Tenure", { type: "select", opts: Object.keys(B.RD_RATES).map(function (k) { return [k, k + " months (" + B.RD_RATES[k] + "%)"]; }), val: 12 }) +
        '<p class="note" id="rd-est">' + rdEst() + "</p>" + btn("Open RD", "rdOpen") + NOTE +
        '<ul class="bq-list">' + (s.rds.filter(function (r) { return r.status === "active"; }).map(function (r) {
          return "<li><span><b>" + r.name + "</b> " + inr(r.inst) + "/month<br><small class=\"note\">Paid " + r.paid + " of " + r.months + " · missed " + r.missed + " · value " + inr(r.val) + "</small></span>" + btn("Close early", "rdBreak", r.id, "btn-ghost") + "</li>";
        }).join("") || '<li class="note">No active RDs.</li>') + "</ul>") +
      card("SIP in mutual funds", "<p>" + gl("A SIP invests a fixed amount in a mutual fund every month.") + " The fund values below are made up.</p>" +
        '<div class="bq-grid">' + Object.keys(B.FUNDS).map(function (k) { return '<div class="bq-tile"><small>' + B.FUNDS[k].name + " · risk " + B.FUNDS[k].risk + "</small><b>NAV " + s.navs[k] + "</b>" + spark(s.navHist[k]) + "</div>"; }).join("") + "</div>" +
        F("sip-f", "Fund", { type: "select", opts: Object.keys(B.FUNDS).map(function (k) { return [k, B.FUNDS[k].name]; }) }) + F("sip-amt", "Monthly SIP (₹, min 500)", { type: "number", mode: "numeric" }) + btn("Start SIP", "sipStart") +
        '<p class="note">Returns are never guaranteed. Values move up and down, and you can lose money.</p>' +
        '<ul class="bq-list">' + (s.sips.filter(function (x) { return x.status !== "stopped"; }).map(function (x) {
          const cur = x.units * s.navs[x.fund], g = x.invested ? (cur / x.invested - 1) * 100 : 0;
          return "<li><span><b>" + B.FUNDS[x.fund].name + "</b> " + inr(x.monthly) + '/month <span class="bq-tag">' + x.status + '</span><br><small class="note">Invested ' + inr(x.invested) + " · Current " + inr(cur) + " (" + (g >= 0 ? "+" : "") + g.toFixed(1) + "%)</small></span><span>" +
            btn(x.status === "active" ? "Pause" : "Resume", "sipToggle", x.id, "btn-ghost") + " " + btn("Stop and redeem", "sipStop", x.id, "btn-ghost") + "</span></li>";
        }).join("") || '<li class="note">No SIPs yet.</li>') + "</ul>");
    el.oninput = el.onchange = function () { if ($("#fd-est")) { $("#fd-est").textContent = fdEst(); $("#rd-est").textContent = rdEst(); } };
  }
  B.on("fdOpen", function () {
    const s = S(), amt = B.num("fd-amt"), t = +B.val("fd-t"), r = B.FD_RATES[t];
    if (amt < 1000) return B.toast("Minimum FD is ₹1,000 (for example).", "bad");
    if (!B.spend(amt, "FD booked", "Investing", "Net banking")) return B.toast("Not enough savings balance.", "bad");
    s.fds.push({ id: B.uid(), name: "FD-" + (s.fds.length + 1), amt: amt, rate: r, months: t, start: s.date, end: B.addMonths(s.date, t), day: Math.min(B.dp(s.date).d, 28), payout: B.val("fd-pay") === "payout", paid: 0, maturity: B.round2(amt * Math.pow(1 + r / 400, t / 3)), status: "active" });
    B.sms("FD of " + inr(amt) + " booked for " + t + " months at " + r + "% (for example)."); B.toast("FD opened."); B.refresh();
  });
  B.on("fdBreak", function (el) {
    const f = byId(S().fds, el.dataset.arg); if (!f) return;
    const mths = (S().date - f.start) / DAY / 30.4375, int = f.amt * Math.max(0, f.rate - 1) / 1200 * mths, pen = f.amt * 0.005, pay = B.round2(Math.max(f.amt * 0.9, f.amt + int - pen - f.paid));
    B.modal("Break " + f.name + " early?", "<p>" + gl("Premature withdrawal") + " pays a lower rate (1% less, for example) and a " + gl("penalty") + " (0.5% of the amount, for example).</p><p>You would receive about <b>" + inr(pay) + "</b> instead of waiting until " + B.dstr(f.end) + ".</p>", [{ t: "Yes, break it", act: "fdBreakYes", arg: f.id + "|" + pay }, { t: "Keep it", cls: "btn-ghost" }]);
  });
  B.on("fdBreakYes", function (el) {
    const p = el.dataset.arg.split("|"), f = byId(S().fds, p[0]); if (!f) return;
    f.status = "closed"; B.earn(+p[1], "FD closed early " + f.name, "Investing", "Net banking"); B.sms("FD " + f.name + " closed early. " + inr(+p[1]) + " credited."); B.closeModal(); B.refresh();
  });
  B.on("rdOpen", function () {
    const s = S(), inst = B.num("rd-amt"), t = +B.val("rd-t");
    if (inst < 100) return B.toast("Minimum RD instalment is ₹100 (for example).", "bad");
    if (!B.spend(inst, "RD first instalment", "Investing", "Net banking")) return B.toast("Not enough savings balance.", "bad");
    s.rds.push({ id: B.uid(), name: "RD-" + (s.rds.length + 1), inst: inst, months: t, rate: B.RD_RATES[t], start: s.date, day: Math.min(B.dp(s.date).d, 28), paid: 1, missed: 0, val: inst, status: "active" });
    B.sms("RD opened: " + inr(inst) + " a month for " + t + " months. Keep your balance ready on the " + Math.min(B.dp(s.date).d, 28) + "th."); B.done("rd"); B.toast("RD opened."); B.refresh();
  });
  B.on("rdBreak", function (el) {
    const r = byId(S().rds, el.dataset.arg); if (!r) return;
    B.modal("Close " + r.name + " early?", "<p>Closing early pays a lower rate and a penalty (together about 1% of the value, for example). You would receive about <b>" + inr(r.val * 0.99) + "</b>.</p>", [{ t: "Yes, close it", act: "rdBreakYes", arg: r.id }, { t: "Keep it", cls: "btn-ghost" }]);
  });
  B.on("rdBreakYes", function (el) {
    const r = byId(S().rds, el.dataset.arg); if (!r) return;
    r.status = "closed"; B.earn(B.round2(r.val * 0.99), "RD closed early " + r.name, "Investing", "Net banking"); B.sms("RD " + r.name + " closed early."); B.closeModal(); B.refresh();
  });
  B.on("sipStart", function () {
    const s = S(), f = B.val("sip-f"), amt = B.num("sip-amt");
    if (amt < 500) return B.toast("Minimum SIP is ₹500 (for example).", "bad");
    if (!B.spend(amt, "SIP " + B.FUNDS[f].name, "Investing", "Net banking")) return B.toast("Not enough savings balance.", "bad");
    s.sips.push({ id: B.uid(), fund: f, monthly: amt, units: amt / s.navs[f], invested: amt, status: "active" });
    B.sms("SIP started: " + inr(amt) + " in " + B.FUNDS[f].name + ". Next instalments on the 5th of each month."); B.toast("SIP started."); B.refresh();
  });
  B.on("sipToggle", function (el) { const x = byId(S().sips, el.dataset.arg); if (x) { x.status = x.status === "active" ? "paused" : "active"; B.refresh(); } });
  B.on("sipStop", function (el) {
    const s = S(), x = byId(s.sips, el.dataset.arg); if (!x) return;
    const v = B.round2(x.units * s.navs[x.fund]); x.status = "stopped"; B.earn(v, "SIP redeemed " + B.FUNDS[x.fund].name, "Investing", "Net banking");
    B.sms("SIP stopped. " + inr(v) + " credited (you invested " + inr(x.invested) + ")."); B.refresh();
  });
  B.register({ id: "deposits", label: "Deposits", icon: "🏦", render: renderDeposits });

  // ================= 7. Loans =================
  const LTYPES = [["personal", "Personal loan"], ["education", "Education loan"], ["bike", "Two-wheeler loan"]];
  let lnAll = false;
  // Rate and maximum amount for a loan type, from the credit score. Under 650 is declined.
  function loanTerms(type) {
    const sc = S().credit, base = { personal: 12, education: 9.5, bike: 10.5 }[type], max0 = { personal: 200000, education: 500000, bike: 120000 }[type];
    const t = sc >= 750 ? [0, 1] : sc >= 700 ? [1.5, 0.6] : sc >= 650 ? [3, 0.3] : null;
    return t ? { ok: true, rate: base + t[0], max: Math.round(max0 * t[1]) } : { ok: false, rate: base, max: 0 };
  }
  // The live EMI / approval / schedule preview.
  function loanEst() {
    const type = B.val("ln-type"), amt = B.num("ln-amt"), n = +B.val("ln-n"), T = loanTerms(type);
    if (!T.ok) return '<p class="bad"><b>Not approved.</b> Your credit score is ' + S().credit + ". Loans need 650+ here (for example). Pay bills and EMIs on time to improve it.</p>";
    if (!amt) return '<p class="note">Approved for up to ' + inr(T.max) + " at " + T.rate + "% a year (for example). Enter an amount.</p>";
    if (amt > T.max) return '<p class="bad">Your credit score allows up to ' + inr(T.max) + " for this loan.</p>";
    const rows = B.schedule(amt, T.rate, n), e = B.emi(amt, T.rate, n), tot = rows.reduce(function (a, r) { return a + r.emi; }, 0);
    return '<div class="bq-grid">' + tile("EMI", inr(e), "per month") + tile("Rate", T.rate + "%", "for example") + tile("Total interest", inr(tot - amt)) + tile("Total payable", inr(tot)) + "</div><p>" + gl("Reducing balance") + ": each EMI pays more principal and less interest over time. A 1% processing fee applies (for example).</p>" +
      "<h3>" + gl("Amortisation") + " schedule</h3>" + B.table(["#", "EMI", "Interest", "Principal", "Balance"], rows.slice(0, lnAll ? n : 12).map(function (r) { return [r.i, inr(r.emi), inr(r.int), inr(r.prin), inr(r.bal)]; })) +
      (n > 12 ? btn(lnAll ? "Show first 12" : "Show all " + n, "lnAll", undefined, "btn-ghost") : "");
  }
  // Draws the Loans screen.
  function renderLoans(el) {
    const s = S(), act = s.loans.filter(function (L) { return L.status === "active"; });
    el.innerHTML = card("🤝 Apply for a loan", F("ln-type", "Loan type", { type: "select", opts: LTYPES }) + F("ln-amt", "Amount (₹, min 5,000)", { type: "number", mode: "numeric" }) +
      F("ln-n", "Tenure", { type: "select", opts: [[12, "12 months"], [24, "24 months"], [36, "36 months"], [48, "48 months"], [60, "60 months"]], val: 24 }) + '<div id="ln-est">' + loanEst() + "</div>" + btn("Apply", "lnApply") + NOTE +
      '<p class="note">' + gl("EMI") + " is debited automatically on the 10th. Approval depends on your " + gl("credit score") + " (now " + s.credit + "). A missed EMI costs a late fee (for example ₹300) and lowers your score.</p>") +
      card("Your loans", act.length ? act.map(function (L) {
        const sch = B.schedule(L.bal, L.rate, Math.max(1, L.months - L.paid));
        return '<div class="bq-tile" style="margin-bottom:12px"><b>' + esc(L.name) + "</b> · " + L.rate + '%<div class="bq-grid">' + tile("Owed", inr(L.bal)) + tile("EMI", inr(L.emi), "next " + B.dstr(B.nextOn(L.day))) + tile("Paid", L.paid + " of " + L.months) + "</div>" +
          (L.arrears > 0 ? '<p class="bad"><b>Overdue: ' + inr(L.arrears) + "</b> (missed EMI + late fee).</p>" + btn("Pay overdue now", "lnArrears", L.id) : "") +
          '<div class="bq-row">' + btn("Prepay part", "lnPrepay", L.id, "btn-ghost") + btn("Close loan (foreclose)", "lnClose", L.id, "btn-ghost") + '</div><details class="bq-d"><summary>Remaining schedule</summary>' +
          B.table(["#", "EMI", "Interest", "Principal", "Balance"], sch.slice(0, 24).map(function (r) { return [r.i, inr(r.emi), inr(r.int), inr(r.prin), inr(r.bal)]; })) + "</details></div>";
      }).join("") + '<p class="note">' + gl("Foreclosure") + " charge for prepaying: 2% of the amount (made up).</p>" : '<p class="note">No active loans.</p>');
    el.oninput = el.onchange = function (e) { if (e.target.id && e.target.id.indexOf("ln-") === 0 && $("#ln-est")) $("#ln-est").innerHTML = loanEst(); };
  }
  B.on("lnAll", function () { lnAll = !lnAll; $("#ln-est").innerHTML = loanEst(); });
  B.on("lnApply", function () {
    const type = B.val("ln-type"), amt = B.num("ln-amt"), n = +B.val("ln-n"), T = loanTerms(type);
    if (!T.ok) return B.toast("Not approved: credit score too low.", "bad");
    if (amt < 5000 || amt > T.max) return B.toast("Amount must be between ₹5,000 and " + inr(T.max) + ".", "bad");
    B.askOtp("signing your loan agreement", function () {
      const s = S(), name = LTYPES.filter(function (t) { return t[0] === type; })[0][1] + " #" + (s.loans.length + 1);
      s.loans.push({ id: B.uid(), name: name, type: type, principal: amt, rate: T.rate, months: n, emi: B.emi(amt, T.rate, n), bal: amt, paid: 0, missed: 0, day: 10, start: s.date, arrears: 0, status: "active" });
      B.earn(amt, "Loan disbursal " + name, "Loans", "NEFT"); B.spend(Math.round(amt * 0.01), "Loan processing fee", "Fees", "Auto");
      B.sms("Loan " + name + " of " + inr(amt) + " credited. EMI " + inr(B.emi(amt, T.rate, n)) + " will be debited on the 10th of each month.");
      B.toast("Loan approved and credited.");
    });
  });
  // Prepays part (or all) of a loan, with the made-up foreclosure charge.
  function doPrepay(L, amt) {
    const fee = B.round2(amt * 0.02);
    if (amt <= 0 || amt > L.bal + 0.01) return B.toast("Enter an amount up to " + inr(L.bal) + ".", "bad");
    if (B.bal() < amt + fee) return B.toast("Not enough savings. You need " + inr(amt + fee) + " (including the fee).", "bad");
    B.spend(amt, "Loan prepayment " + L.name, "Loans", "Net banking"); B.spend(fee, "Foreclosure charge " + L.name, "Fees", "Net banking");
    L.bal = B.round2(L.bal - amt);
    if (L.bal <= 0.5 && L.arrears <= 0) { L.bal = 0; L.status = "closed"; B.sms("Loan " + L.name + " is closed."); }
    else if (L.bal > 0.5) { const r = L.rate / 1200; L.months = L.paid + Math.max(1, Math.ceil(-Math.log(1 - L.bal * r / L.emi) / Math.log(1 + r))); }
    B.sms("Prepayment of " + inr(amt) + " received for " + L.name + ". Foreclosure charge " + inr(fee) + ".");
    B.done("loan"); B.closeModal(); B.toast("Prepaid " + inr(amt) + "."); B.refresh();
  }
  B.on("lnPrepay", function (el) { B.modal("Prepay part of the loan", F("lp-amt", "Amount (₹)", { type: "number", mode: "numeric", hint: "A 2% foreclosure charge applies (made up). EMI stays the same; the loan ends sooner." }), [{ t: "Prepay", act: "lnPrepayGo", arg: el.dataset.arg }, { t: "Cancel", cls: "btn-ghost" }]); });
  B.on("lnPrepayGo", function (el) { const L = byId(S().loans, el.dataset.arg); if (L) doPrepay(L, B.num("lp-amt")); });
  B.on("lnClose", function (el) {
    const L = byId(S().loans, el.dataset.arg); if (!L) return;
    if (L.arrears > 0) return B.toast("Pay the overdue amount first.", "bad");
    B.modal("Close the loan?", "<p>Pay the full " + inr(L.bal) + " plus a 2% foreclosure charge of " + inr(B.round2(L.bal * 0.02)) + " (made up).</p>", [{ t: "Close loan", act: "lnCloseGo", arg: L.id }, { t: "Cancel", cls: "btn-ghost" }]);
  });
  B.on("lnCloseGo", function (el) { const L = byId(S().loans, el.dataset.arg); if (L) doPrepay(L, L.bal); });
  B.on("lnArrears", function (el) {
    const L = byId(S().loans, el.dataset.arg); if (!L) return;
    if (!B.spend(L.arrears, "Overdue EMI + late fee " + L.name, "Loans", "Net banking")) return B.toast("Not enough savings for the overdue amount.", "bad");
    L.arrears = 0; B.sms("Overdue amount for " + L.name + " paid."); B.refresh();
  });
  B.on("lnEstRefresh", function () { /* placeholder so the registry never calls a missing action */ });
  B.register({ id: "loans", label: "Loans", icon: "🤝", render: renderLoans });

  // ================= 8. Bills and Autopay =================
  // Draws the Bills and Autopay screen.
  function renderBills(el) {
    const s = S(), un = s.bills.filter(function (b) { return !b.paid; }), paid = s.bills.filter(function (b) { return b.paid; }).slice(-5).reverse();
    const bl = function (b) { return B.BILLERS.filter(function (x) { return x.id === b.biller; })[0]; };
    el.innerHTML =
      card("🧾 Bills to pay", '<ul class="bq-list">' + (un.length ? un.map(function (b) {
        return "<li><span>" + bl(b).icon + " <b>" + bl(b).name + "</b><br><small class=\"note\">Due " + B.dstr(b.due) + (b.late ? " · includes ₹50 late fee" : "") + "</small></span><span><b>" + inr(b.amt) + "</b> " + btn("Pay now", "billPay", b.id, "btn-ghost") + "</span></li>";
      }).join("") : '<li class="note">No bills right now. Bills arrive on the 1st of each month: skip time to see them.</li>') + "</ul>" +
        (paid.length ? "<h3>Recently paid</h3><ul class=\"bq-list\">" + paid.map(function (b) { return '<li class="note"><span>' + bl(b).name + "</span><span>" + inr(b.amt) + "</span></li>"; }).join("") + "</ul>" : "")) +
      card("Autopay", "<p>" + gl("Autopay") + " lets a biller take the bill from your account on its due date, up to a limit you set. Set the limit just above your usual bill, and cancel it when you stop using the service.</p>" +
        B.BILLERS.map(function (x) {
          const ap = s.autopay[x.id];
          return "<div class=\"bq-tile\" style=\"margin:8px 0\"><div class=\"bq-row\" style=\"justify-content:space-between;align-items:center;margin:0\"><span>" + x.icon + " <b>" + x.name + "</b><br><small>" + (ap ? "Autopay ON, limit " + inr(ap.limit) : "Autopay off") + "</small></span>" +
            (ap ? btn("Cancel autopay", "apCancel", x.id, "btn-ghost") : btn("Set up autopay", "apSetup", x.id, "btn-ghost")) + "</div></div>";
        }).join("")) +
      card("🎬 StreamBox+ (made-up subscription)", s.sub ? "<p>Active. " + (s.date < s.sub.freeUntil ? "Free until " + B.dstr(s.sub.freeUntil) + ", then " : "Charged ") + inr(299) + " a month through autopay.</p>" + btn("Cancel subscription", "subCancel", undefined, "btn-ghost") :
        "<p>30-day free trial, then " + inr(299) + " a month. Starting the trial sets up an autopay mandate with a ₹500 limit.</p>" + btn("Start free trial", "subStart")) +
      '<p class="note">Forgot to cancel? After the trial, ' + inr(299) + ' leaves your account every month until you cancel. Check Passbook for repeat debits.</p>';
  }
  B.on("billPay", function (el) {
    const b = byId(S().bills, el.dataset.arg); if (!b) return;
    if (B.payBill(b, "Net banking")) { B.sms("Bill of " + inr(b.amt) + " paid."); B.toast("Bill paid."); B.refresh(); } else B.toast("Not enough savings balance.", "bad");
  });
  B.on("apSetup", function (el) {
    const x = B.BILLERS.filter(function (b) { return b.id === el.dataset.arg; })[0];
    B.modal("Autopay for " + x.name, F("ap-lim", "Maximum amount per bill (₹)", { type: "number", mode: "numeric", val: Math.ceil(x.hi * 1.2 / 100) * 100 }), [{ t: "Set up", act: "apGo", arg: x.id }, { t: "Cancel", cls: "btn-ghost" }]);
  });
  B.on("apGo", function (el) { const l = B.num("ap-lim"); if (l < 100) return B.toast("Enter a limit of at least ₹100.", "bad"); S().autopay[el.dataset.arg] = { limit: l, since: S().date }; B.sms("Autopay set up with limit " + inr(l) + "."); B.closeModal(); B.refresh(); });
  B.on("apCancel", function (el) { delete S().autopay[el.dataset.arg]; B.sms("Autopay cancelled."); B.refresh(); });
  B.on("subStart", function () { const s = S(); s.sub = { freeUntil: s.date + 30 * DAY }; s.autopay.sub = { limit: 500, since: s.date }; B.sms("StreamBox+ trial started. Autopay mandate (limit ₹500) created. Free until " + B.dstr(s.sub.freeUntil) + "."); B.refresh(); });
  B.on("subCancel", function () { const s = S(); s.sub = null; delete s.autopay.sub; s.bills = s.bills.filter(function (b) { return b.biller !== "sub" || b.paid; }); B.sms("StreamBox+ cancelled and its autopay removed."); B.toast("Subscription cancelled."); B.refresh(); });
  B.register({ id: "bills", label: "Bills", icon: "🧾", render: renderBills });

  // ================= 9. Alerts and Security =================
  // HTML for one message in the inbox.
  function smsHtml(a) {
    let tag, extra = "", acts = "";
    if (a.kind === "real") tag = a.otp ? '<span class="bq-tag warn">🔐 Real OTP: never share it</span>' : '<span class="bq-tag good">Real bank alert</span>';
    else if (!a.verdict) {
      tag = '<span class="bq-tag">Genuine or scam?</span>';
      acts = btn("✅ Genuine", "qAns", a.id + "|genuine", "btn-ghost") + btn("🚫 Scam", "qAns", a.id + "|scam", "btn-ghost");
      if (a.link && !a.acted) acts += btn("Tap the link", "qLink", a.id, "btn-ghost");
      if (a.otp && !a.acted) acts += btn("Reply with OTP", "qOtp", a.id, "btn-ghost");
    } else {
      const ok = (a.verdict === "scam") === a.scam;
      tag = '<span class="bq-tag ' + (a.scam ? "bad" : "good") + '">' + (a.scam ? "SCAM" : "Genuine") + '</span> <span class="bq-tag ' + (ok ? "good" : "bad") + '">' + (ok ? "You got it right" : "You got it wrong") + "</span>";
      extra = '<p class="note">' + esc(a.why) + "</p>";
    }
    return '<div class="bq-sms' + (a._new ? " unread" : "") + (a.kind !== "real" && !a.verdict ? " glitch" : "") + '"><div class="from"><span>' + esc(a.from) + " · " + B.dstr(a.date) + "</span>" + tag + "</div><p>" + esc(a.text) + "</p>" + extra + (acts ? '<div class="bq-row">' + acts + "</div>" : "") + "</div>";
  }
  // A short Help section as an open/close box.
  const help = function (title, body) { return '<details class="bq-d"><summary>' + title + "</summary>" + body + "</details>"; };
  // Draws the Alerts and Security screen.
  function renderAlerts(el) {
    const s = S();
    s.alerts.forEach(function (a) { a._new = !a.read; });
    const inbox = s.alerts.slice(0, 60).map(smsHtml).join("") || '<p class="note">No messages.</p>';
    s.alerts.forEach(function (a) { a.read = true; delete a._new; });
    B.save(); B.chrome();
    const debits = s.ledger.filter(function (e) { return e.acct === "sav" && e.dir === "dr"; }).slice(-15).reverse();
    el.innerHTML = card("🛡️ Alerts inbox", '<p class="note">Real alerts are labelled. Messages marked “Genuine or scam?” need your decision. ' + gl("OTP") + " codes appear here only, and are never filled in for you.</p>" + inbox) +
      card("Help and security", help("Block a card or report it lost", '<div class="bq-row">' + btn("Block debit card", "hpBlock", "deb") + btn("Block credit card", "hpBlock", "cc") + "</div>") +
        help("Dispute a transaction", debits.length ? F("hp-tx", "Which debit?", { type: "select", opts: debits.map(function (e) { return [e.id, B.dstr(e.date) + " " + e.desc.slice(0, 28) + " " + inr(e.amt)]; }) }) + F("hp-why", "Reason", { type: "select", opts: ["I did not make this payment", "I was charged twice", "Wrong amount charged", "Service not received"] }) + btn("Raise complaint", "hpDispute") : '<p class="note">No debits to dispute yet.</p>') +
        help("Change a PIN", F("hp-pt", "Which PIN", { type: "select", opts: [["login", "Login PIN (4 digits)"], ["upi", "UPI PIN (6 digits)"]] }) + F("hp-old", "Current PIN", { type: "pin", max: 6 }) + F("hp-new", "New PIN", { type: "pin", max: 6 }) + btn("Change PIN", "hpPin")) +
        help("Never share your OTP or PIN", "<ul><li>Your " + gl("OTP") + ", " + gl("PIN") + " and " + gl("CVV") + " are secret. No bank officer, courier or “government official” needs them.</li><li>Do not tap links in messages. Open the bank's own app instead.</li><li>You never enter a UPI PIN to receive money.</li><li>Check the payee name before you pay.</li><li>Money in a bank is insured by " + gl("DICGC") + " up to ₹5 lakh per depositor per bank.</li></ul>") +
        help("Report fraud", "<p>Call the national " + gl("cyber fraud helpline") + " <b>1930</b> or report at <b>cybercrime.gov.in</b>, and tell your bank straight away. Keep the " + gl("UTR") + " numbers of the payments. Reporting quickly gives the best chance of stopping the money.</p>") +
        (s.complaints.length ? "<h3>Your complaints</h3><ul class=\"bq-list\">" + s.complaints.slice(-5).reverse().map(function (c) { return "<li><span>" + esc(c.t) + '</span><b>' + c.ref + "</b></li>"; }).join("") + "</ul>" : ""));
  }
  B.on("qAns", function (el) {
    const p = el.dataset.arg.split("|"), a = byId(S().alerts, p[0]); if (!a || a.verdict) return;
    a.verdict = p[1]; const ok = (p[1] === "scam") === a.scam;
    B.toast(ok ? "✅ Correct! " + (a.scam ? "That was a scam." : "That was genuine.") : "❌ Not quite. " + (a.scam ? "That was a scam." : "That one was genuine."), ok ? "good" : "bad"); B.refresh();
  });
  // Loses simulated money after a click on a scam link or a shared OTP, and explains why.
  function scamLoss(a, amt, desc, title, steps) {
    const lost = Math.min(amt, B.bal()); a.acted = true;
    if (window.MQ && MQ.burst) MQ.burst("loss");
    if (lost > 0) B.spend(lost, desc, "Fraud loss", "Unknown");
    B.sms("Debit alert: " + inr(lost) + " debited (" + desc + "). If this was not you, call 1930.");
    B.refresh();
    result(false, title, "<p>You lost " + inr(lost) + " of practice money.</p><p><b>What went wrong</b></p><ul>" + steps + "</ul><p>Real life: call <b>1930</b> or report at <b>cybercrime.gov.in</b> quickly.</p>");
  }
  B.on("qLink", function (el) {
    const a = byId(S().alerts, el.dataset.arg); if (!a || a.acted) return;
    scamLoss(a, 2000, "Unknown online debit after fake link", "You tapped a fake link", "<li>The message looked urgent to rush you.</li><li>The link led to a copy of a bank page that steals your details.</li><li>Banks do not ask you to update KYC or claim prizes through links.</li>");
  });
  B.on("qOtp", function (el) {
    const a = byId(S().alerts, el.dataset.arg); if (!a || a.acted) return;
    scamLoss(a, 5000, "Unauthorised UPI debit after OTP shared", "You shared your OTP", "<li>The OTP is the final key to approve a payment.</li><li>A real bank officer never asks for it, even to “stop a fraud”.</li><li>Hang up or ignore, then call the number on the back of your card.</li>");
  });
  // Blocks a card and gives a complaint reference number.
  B.on("hpBlock", function (el) {
    const s = S(), d = el.dataset.arg === "deb", ref = "CMP" + B.digits(8);
    if (d) s.deb.blocked = true; else s.card.blocked = true;
    s.complaints.push({ ref: ref, t: (d ? "Debit" : "Credit") + " card blocked (lost)" });
    B.sms((d ? "Debit" : "Credit") + " card BLOCKED at your request. Complaint ref " + ref + "."); B.done("block");
    B.refresh(); result(true, "Card blocked", "<p>Your card is blocked. Complaint reference: <b>" + ref + "</b>. Keep it for follow-up. You can unblock it in Cards.</p>");
  });
  B.on("hpDispute", function () {
    const s = S(), e = byId(s.ledger, B.val("hp-tx")), ref = "CMP" + B.digits(8); if (!e) return;
    s.complaints.push({ ref: ref, t: "Dispute: " + e.desc.slice(0, 30) + " (" + B.val("hp-why") + ")" });
    B.sms("Dispute raised for " + inr(e.amt) + " (" + e.desc + "). Complaint ref " + ref + "."); B.refresh();
    result(true, "Complaint raised", "<p>Your complaint reference is <b>" + ref + "</b>. If the payment was fraud, also call 1930 or report at cybercrime.gov.in.</p>");
  });
  B.on("hpPin", function () {
    const s = S(), k = B.val("hp-pt"), n = k === "login" ? 4 : 6, old = B.val("hp-old"), nw = B.val("hp-new");
    if (old !== s.pins[k]) return B.toast("Current PIN is wrong.", "bad");
    if (!new RegExp("^\\d{" + n + "}$").test(nw)) return B.toast("New PIN must be " + n + " digits.", "bad");
    s.pins[k] = nw; B.sms("Your " + (k === "login" ? "login" : "UPI") + " PIN was changed. If this was not you, call your bank now."); B.toast("PIN changed."); B.refresh();
  });
  B.register({ id: "alerts", label: "Alerts", icon: "🛡️", render: renderAlerts, show: function () { return S().onboarded; } });
})();
