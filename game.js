// MoneyQuest game engine: dashboard, ages, situations and monthly money logic.
// Content lives in turns.js (modules, age themes, situations) and events.js (life events, speed round).

// Change these numbers to change the game's length. Everything else follows from them.
const CONFIG = {
  SITUATIONS_PER_AGE: 12,  // screens per age in "Full life" mode (10 themed + 2 life events)
  QUICK_PER_AGE: 3,        // situations per age in "Quick" mode
  EVENT_SHARE: 3,          // about 1 in this many situations is a general life event
  START_AGE: 18,
  END_AGE: 25,
  MONTHS_PER_YEAR: 12
};

let state;   // everything about the current playthrough

// ---------- Small helpers ----------

// Shows a number as rupees, e.g. 12500 becomes "₹12,500".
function formatMoney(amount) {
  const rounded = Math.round(Math.abs(amount));
  const text = "₹" + rounded.toLocaleString("en-IN");
  return amount < 0 ? "-" + text : text;
}

// Makes sure the credit score stays between 300 and 900.
function limitCredit(score) {
  return Math.max(300, Math.min(900, score));
}

// Changes the credit score by a number of points.
function changeCredit(points) {
  state.credit = limitCredit(state.credit + points);
}

// The player's current age (it goes up once a year at the Year summary).
function getAge() {
  return state.age;
}

// Net worth = everything you own minus what you owe.
function getNetWorth() {
  return state.cash + state.savings + state.fd + state.sip - state.debt;
}

// Takes a copy of the numbers so we can show what changed.
function takeSnapshot() {
  return {
    cash: state.cash, savings: state.savings, fd: state.fd, sip: state.sip,
    debt: state.debt, credit: state.credit, net: getNetWorth()
  };
}

// ---------- Starting a new game ----------

// Creates a fresh starting state. mode is "quick" or "full".
function newState(mode) {
  return {
    mode: mode,
    age: CONFIG.START_AGE,
    monthsElapsed: 0,
    cash: 5000,
    savings: 2000,
    fd: 0,
    sip: 0,
    sipMonthly: 0,      // amount moved into the SIP every month
    debt: 0,
    credit: 650,
    emis: [],           // each EMI: { amount, monthsLeft }
    queue: [],          // the situations of the current age
    qIndex: 0,          // which situation of the queue we are on
    used: {},           // situations already played (so none repeats)
    year: null,         // numbers collected during the current age
    ageLog: [],         // net worth and credit score at the end of each age
    decisions: [],      // every choice the player made
    concepts: [],       // concept names learned
    incomeBoost: 0,     // extra monthly income from pay raises
    expenseBoost: 0,    // extra monthly spending after pay raises
    bonusClaimed: {},   // lessons whose quiz bonus was already given
    currentLesson: null,
    speedDone: false,   // has the "Scam or Real?" speed round been played?
    speedScore: null    // speed round score out of 5
  };
}

// Starts the game from the beginning in the chosen mode.
function startGame(mode) {
  state = newState(mode === "quick" ? "quick" : "full");
  document.getElementById("dashboard").classList.remove("hidden");
  updateDashboard(takeSnapshot());
  beginAge();
}

// ---------- Dashboard ----------

// Writes one stat and a small up/down arrow showing how much it changed.
function setStat(name, newValue, oldValue, isDebt) {
  document.getElementById("d-" + name).textContent = formatMoney(newValue);
  const deltaBox = document.getElementById("dd-" + name);
  const change = Math.round(newValue - oldValue);
  if (!deltaBox) return;
  if (change === 0) { deltaBox.textContent = ""; return; }
  const isGood = isDebt ? change < 0 : change > 0;
  deltaBox.textContent = (change > 0 ? "▲" : "▼") + formatMoney(Math.abs(change)).replace("-", "");
  deltaBox.className = "delta " + (isGood ? "up" : "down");
}

// Gives a friendly word for the credit score (just a game label).
function creditLabel(score) {
  if (score < 550) return "😟 Low";
  if (score < 700) return "🙂 Medium";
  if (score < 800) return "😀 High";
  return "🌟 Very high";
}

// Refreshes the whole dashboard. "before" is a snapshot used to show changes.
function updateDashboard(before) {
  setStat("cash", state.cash, before.cash, false);
  setStat("savings", state.savings, before.savings, false);
  setStat("fd", state.fd, before.fd, false);
  setStat("sip", state.sip, before.sip, false);
  setStat("debt", state.debt, before.debt, true);
  document.getElementById("d-age").textContent = getAge();
  document.getElementById("d-net").textContent = formatMoney(getNetWorth());
  document.getElementById("credit-value").textContent = Math.round(state.credit);
  document.getElementById("credit-label").textContent = creditLabel(state.credit);
  const percent = ((state.credit - 300) / 600) * 100;
  document.getElementById("credit-marker").style.left = percent + "%";
}

// ---------- Changing the money ----------

// If cash goes below zero, use savings first, then borrow the rest as debt.
function coverShortfall() {
  if (state.cash >= 0) return;
  let missing = -state.cash;
  const fromSavings = Math.min(state.savings, missing);
  state.savings -= fromSavings;
  missing -= fromSavings;
  if (missing > 0) {
    state.debt += missing;   // emergency borrowing
    changeCredit(-10);
  }
  state.cash = 0;
}

// Applies a choice's effects to the state. Returns short notes about anything adjusted
// (repaying only what is owed, or taking the rest from cash).
function applyEffects(effects) {
  const notes = [];
  const moneyKeys = ["cash", "savings", "fd", "sip"];
  moneyKeys.forEach(function (key) {
    if (effects[key]) state[key] += effects[key];
  });
  if (effects.debt) {
    if (effects.debt < 0 && -effects.debt > state.debt) {
      const extra = -effects.debt - state.debt;   // the part that was never owed
      state.cash += extra;                        // give it back, it was not spent
      state.debt = 0;
      notes.push("You only owed " + formatMoney(-effects.debt - extra) + ", so you repaid just that.");
    } else {
      state.debt += effects.debt;
    }
  }
  if (effects.credit) changeCredit(effects.credit);
  if (effects.sipMonthly) state.sipMonthly = Math.max(0, state.sipMonthly + effects.sipMonthly);
  if (effects.incomeBoost) state.incomeBoost += effects.incomeBoost;
  if (effects.expenseBoost) state.expenseBoost += effects.expenseBoost;
  if (effects.emi) {
    state.emis.push({ amount: effects.emi.amount, monthsLeft: effects.emi.months });
    state.debt += effects.emi.amount * effects.emi.months;   // total still to pay
  }
  // If savings, FD or SIP would go below zero, the missing part comes out of cash instead.
  ["savings", "fd", "sip"].forEach(function (key) {
    if (state[key] < 0) {
      state.cash += state[key]; state[key] = 0;
      if (notes.indexOf("The rest came from cash.") === -1) notes.push("The rest came from cash.");
    }
  });
  if (state.debt < 0) state.debt = 0;
  coverShortfall();
  return notes;
}

// Monthly pocket money / stipend / salary depending on age.
function monthlyIncome() {
  const age = getAge();
  const base = age < 20 ? 3000 : age < 22 ? 9000 : 25000;
  return base + state.incomeBoost;
}

// Monthly living costs depending on age (chai, travel, phone recharge...).
function monthlyExpenses() {
  const age = getAge();
  const base = age < 20 ? 2500 : age < 22 ? 7000 : 19000;
  return base + state.expenseBoost;
}

// Pays this month's EMIs. Missing one lowers the credit score.
function payEmis(result) {
  state.emis.forEach(function (emi) {
    if (state.cash >= emi.amount) {
      state.cash -= emi.amount;
      state.debt = Math.max(0, state.debt - emi.amount);
      changeCredit(1);                 // paid on time
      result.emiPaid += 1;
    } else {
      changeCredit(-30);               // missed payment
      state.debt += 300;               // late fee
      result.missed += 1;
    }
    emi.monthsLeft -= 1;
  });
  state.emis = state.emis.filter(function (emi) { return emi.monthsLeft > 0; });
}

// Runs a number of months: income, spending, interest, SIP growth and EMIs.
function runMonths(months) {
  const result = { months: months, saved: 0, emiPaid: 0, missed: 0, interest: 0, sipGrowth: 0 };
  for (let i = 0; i < months; i++) {
    const surplus = monthlyIncome() - monthlyExpenses();
    state.cash += surplus;
    result.saved += surplus;
    coverShortfall();

    // Interest: savings at about 3% a year and FD at about 7% a year (for example), added monthly.
    const interest = state.savings * 0.03 / 12 + state.fd * 0.07 / 12;
    state.savings *= 1 + 0.03 / 12;
    state.fd *= 1 + 0.07 / 12;
    result.interest += interest;

    // SIP: grows by a random monthly return (some months it dips), then adds the new instalment.
    const randomReturn = 0.008 + (Math.random() - 0.5) * 0.08;
    result.sipGrowth += state.sip * randomReturn;
    state.sip *= 1 + randomReturn;
    if (state.sipMonthly > 0 && state.cash >= state.sipMonthly) {
      state.cash -= state.sipMonthly;
      state.sip += state.sipMonthly;
    }

    payEmis(result);
    state.monthsElapsed += 1;
  }
  return result;
}

// Adds the result of some months to this age's running totals.
function addYearResult(result) {
  ["months", "saved", "emiPaid", "missed", "interest", "sipGrowth"].forEach(function (key) {
    state.year[key] += result[key];
  });
}

// ---------- Building the situations of an age ----------

// How many situations the player gets each age in the chosen mode.
function situationsThisAge() {
  return state.mode === "quick" ? CONFIG.QUICK_PER_AGE : CONFIG.SITUATIONS_PER_AGE;
}

const LEVELS = ["easy", "medium", "hard", "superhard", "extreme"];
const LEVEL_NAMES = { easy: "Easy", medium: "Medium", hard: "Hard", superhard: "Super hard", extreme: "Extreme" };
const LEVEL_COLORS = { easy: "mint", medium: "gold", hard: "coral", superhard: "rose", extreme: "violet" };

// A situation's difficulty; anything without one counts as "medium".
function levelOf(item) {
  return LEVELS.indexOf(item.difficulty) === -1 ? "medium" : item.difficulty;
}

// Orders situations easy to extreme, shuffling within each level.
function sortByDifficulty(items) {
  return shuffleList(items).sort(function (a, b) {
    return LEVELS.indexOf(levelOf(a)) - LEVELS.indexOf(levelOf(b));
  });
}

// Quick mode: one medium, one hard, one superhard-or-extreme (any level if one is missing).
function pickQuickSet(pool) {
  const picked = [];
  [["medium"], ["hard"], ["superhard", "extreme"]].forEach(function (levels) {
    const found = shuffleList(pool.filter(function (item) {
      return picked.indexOf(item) === -1 && levels.indexOf(levelOf(item)) !== -1;
    }));
    if (found.length) picked.push(found[0]);
  });
  shuffleList(pool.filter(function (item) { return picked.indexOf(item) === -1; })).forEach(function (item) {
    if (picked.length < CONFIG.QUICK_PER_AGE) picked.push(item);
  });
  return picked;
}

// Full life: picks up to 'target' themed situations, 2 per level (easy to extreme).
// A level with too few gives its spare places to the nearest levels. No difficulty tags = random picks.
function pickLadder(pool, target) {
  const shuffled = shuffleList(pool);
  if (!shuffled.some(function (t) { return LEVELS.indexOf(t.difficulty) !== -1; })) return shuffled.slice(0, target);
  const byLevel = LEVELS.map(function (lv) { return shuffled.filter(function (t) { return levelOf(t) === lv; }); });
  const picks = LEVELS.map(function (lv, i) { return byLevel[i].splice(0, 2); });
  let missing = target - picks.reduce(function (n, p) { return n + p.length; }, 0);
  for (let dist = 1; dist < LEVELS.length && missing > 0; dist++) {
    for (let i = 0; i < LEVELS.length && missing > 0; i++) {
      [i - dist, i + dist].forEach(function (j) {
        // Only levels that came up short ask their neighbours for extra situations.
        if (picks[i].length < 2 && j >= 0 && j < LEVELS.length && byLevel[j].length && missing > 0) {
          picks[i].push(byLevel[j].shift());
          missing--;
        }
      });
    }
  }
  // Still short (all levels hold 2 or more): top up from whatever is left.
  byLevel.forEach(function (rest) {
    while (rest.length && missing > 0) { picks[0].push(rest.shift()); missing--; }
  });
  return [].concat.apply([], picks);
}

// Picks the situations for one age: themed ones from turns.js plus general life events.
function buildAgeQueue(age) {
  const themedPool = TURNS.filter(function (t) { return t.age === age && !state.used[t.title]; });
  const eventPool = shuffleList(EVENTS.filter(function (e) {
    return age >= e.minAge && age <= e.maxAge && !state.used[e.id];
  }));
  let queue;

  if (state.mode === "quick") {
    // Quick mode: themed situations only.
    queue = sortByDifficulty(pickQuickSet(themedPool));
  } else {
    // Full life: up to 10 themed situations plus 2 life events (different kinds first).
    const themed = sortByDifficulty(pickLadder(themedPool, 10));
    const events = [];
    const kinds = {};
    eventPool.forEach(function (e) {
      if (events.length < 2 && !kinds[e.kind]) { events.push(e); kinds[e.kind] = true; }
    });
    eventPool.forEach(function (e) {
      if (events.length < 2 && events.indexOf(e) === -1) events.push(e);
    });
    // Events go after the easy and medium situations.
    let at = 0;
    themed.forEach(function (t, i) { if (levelOf(t) === "easy" || levelOf(t) === "medium") at = i + 1; });
    queue = themed.slice(0, at).concat(events, themed.slice(at));
  }

  queue.forEach(function (item) { state.used[item.id || item.title] = true; });

  // The "Scam or Real?" speed round always plays once, at age 20, around the middle.
  if (age === 20 && !state.speedDone) queue.splice(Math.ceil(queue.length / 2), 0, { speed: true });
  return queue;
}

// ---------- Screens ----------

// Puts new HTML into the main game card.
function setScreen(html) {
  document.getElementById("screen").innerHTML = html;
  window.scrollTo(0, 0);
}

// The first screen of the game, with the Quick / Full life choice.
function showStartScreen() {
  setScreen(
    '<div class="center">' +
    '<div class="big-emoji">💰</div>' +
    "<h1>MoneyQuest</h1>" +
    "<p>Live from age 18 to 25. Make money choices, see what happens, and learn why.</p>" +
    '<button class="btn" onclick="startGame(\'quick\')">⚡ Quick (about 8 minutes)</button> ' +
    '<button class="btn" onclick="startGame(\'full\')">🌟 Full life (about 20 minutes)</button>' +
    "</div>"
  );
}

// Starts a new age: picks its situations and shows the age title card.
function beginAge() {
  state.queue = buildAgeQueue(state.age);
  state.qIndex = 0;
  state.year = {
    months: 0, saved: 0, emiPaid: 0, missed: 0, interest: 0, sipGrowth: 0,
    startNet: getNetWorth(), startCredit: state.credit
  };
  showLessonTime();
}

// Picks the lesson for this age: the age's main module, using its next lesson in turn.
function lessonForAge(age) {
  const main = AGE_THEMES[age].modules[0];
  let earlier = 0;
  for (let a = CONFIG.START_AGE; a < age; a++) {
    if (AGE_THEMES[a].modules[0] === main) earlier++;
  }
  const lessons = LESSONS.filter(function (l) { return l.module === main; });
  return lessons.length ? lessons[earlier % lessons.length] : null;
}

// Reads the best quiz score saved for a lesson by learn.html (0 to 4, or null if never taken).
function savedQuizScore(lessonId) {
  try {
    const saved = JSON.parse(localStorage.getItem("moneyquest_learn") || "{}");
    const score = (saved.quiz || {})[lessonId];
    return score === undefined ? null : score;
  } catch (e) {
    return null;
  }
}

// Gives a small bonus (₹500 pocket money) once per lesson when its quiz was passed with 3 of 4 or more.
// Returns a line of text to show, or "" when there is nothing new to say.
function claimLessonBonus(lesson) {
  const score = savedQuizScore(lesson.id);
  if (score === null) return "";
  if (state.bonusClaimed[lesson.id]) return "✅ Quiz score " + score + " / 4. Your bonus is already added.";
  if (score < 3) return "Quiz score " + score + " / 4. Score 3 or more to earn ₹500 pocket money.";
  state.bonusClaimed[lesson.id] = true;
  const before = takeSnapshot();
  applyEffects({ cash: 500 });
  updateDashboard(before);
  return "🎉 Quiz score " + score + " / 4. Bonus: +₹500 pocket money!";
}

// Shows the skippable "Lesson time" screen before each age starts.
function showLessonTime() {
  const lesson = lessonForAge(state.age);
  if (!lesson) { showAgeCard(); return; }
  state.currentLesson = lesson;
  const bonusLine = claimLessonBonus(lesson);
  setScreen(
    '<div class="lesson-time">' +
    '<div class="chapter-label">📘 Lesson time · Age ' + state.age + "</div>" +
    "<h2>" + lesson.title + "</h2>" +
    "<p>" + renderWhyText(lesson.summary) + "</p>" +
    '<p class="note">Read the full lesson and score 3 of 4 on its quiz for ₹500 pocket money. It opens in a new tab, so your game stays here.</p>' +
    '<p id="lesson-bonus" class="year-line">' + bonusLine + "</p>" +
    '<a class="btn" href="learn.html#l' + lesson.id + '" target="_blank" rel="noopener">📖 Read the full lesson</a> ' +
    '<button class="btn btn-ghost" type="button" onclick="recheckLessonBonus()">🔄 Check my quiz score</button> ' +
    '<button class="btn btn-ghost" type="button" onclick="showAgeCard()">Skip ▶</button>' +
    "</div>"
  );
}

// Re-reads the quiz score (after the player took the quiz in the other tab) and shows the result.
function recheckLessonBonus() {
  const line = claimLessonBonus(state.currentLesson) || "No quiz score yet. Take the quiz at the end of the lesson.";
  document.getElementById("lesson-bonus").textContent = line;
}

// Shows the title card for the current age.
function showAgeCard() {
  const theme = AGE_THEMES[state.age];
  setScreen(
    '<div class="center">' +
    '<div class="big-emoji">' + theme.emoji + "</div>" +
    '<div class="chapter-label">Age ' + state.age + " · Year " + (state.age - CONFIG.START_AGE + 1) +
    " of " + (CONFIG.END_AGE - CONFIG.START_AGE + 1) + "</div>" +
    "<h1>" + theme.title + "</h1>" +
    "<p>" + theme.intro + "</p>" +
    "<p><strong>🎂 You are " + state.age + " years old</strong></p>" +
    '<button class="btn" onclick="showTurn()">Begin age ' + state.age + "</button>" +
    "</div>"
  );
}

// Shows the current situation and its choices (or starts the speed round).
function showTurn() {
  const turn = state.queue[state.qIndex];
  if (!turn) { showYearSummary(); return; }
  if (turn.speed) { startSpeedRound(); return; }

  // Shuffle the choices (each keeps its own score, effects and note); chooseOption reads state.shown.
  state.shown = shuffleList(turn.choices);
  const level = levelOf(turn);
  const chip = ' <span class="difficulty-chip" style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:.75em;' +
    "font-weight:600;color:var(--" + LEVEL_COLORS[level] + ");border:1px solid var(--" + LEVEL_COLORS[level] +
    ");background:rgb(var(--" + LEVEL_COLORS[level] + '-rgb) / .12)">' + LEVEL_NAMES[level] + "</span>";
  let choicesHtml = "";
  state.shown.forEach(function (choice, index) {
    choicesHtml += '<button class="choice" onclick="chooseOption(' + index + ')">' + choice.text + "</button>";
  });
  const topic = turn.kind ? "🎲 Life event" : CHAPTERS[turn.module - 1].name;
  setScreen(
    '<div class="chapter-label">' + topic + " · Situation " + (state.qIndex + 1) + " of " + state.queue.length + chip + "</div>" +
    "<h2>" + turn.title + "</h2>" +
    (turn.sms ? buildPhoneHtml(turn.sms) : "") +
    '<p class="situation">' + turn.situation + "</p>" +
    choicesHtml
  );
}

// Builds small coloured chips that show what a choice changed.
function buildChangeChips(before) {
  const items = [
    ["Cash", "cash", false], ["Savings", "savings", false], ["FD", "fd", false],
    ["SIP", "sip", false], ["Debt", "debt", true]
  ];
  let html = "";
  items.forEach(function (item) {
    const change = Math.round(state[item[1]] - before[item[1]]);
    if (change === 0) return;
    const isGood = item[2] ? change < 0 : change > 0;
    html += '<span class="chip ' + (isGood ? "up" : "down") + '">' + item[0] + " " +
      (change > 0 ? "+" : "-") + formatMoney(Math.abs(change)) + "</span>";
  });
  const creditChange = Math.round(state.credit - before.credit);
  if (creditChange !== 0) {
    html += '<span class="chip ' + (creditChange > 0 ? "up" : "down") + '">Credit score ' +
      (creditChange > 0 ? "+" : "") + creditChange + "</span>";
  }
  return html;
}

// Turns the Why? text into HTML (glossary words become clickable once glossary.js can do it).
function renderWhyText(text) {
  if (typeof linkGlossaryTerms === "function") return linkGlossaryTerms(text);
  return text;
}

// Runs when the player clicks a choice.
function chooseOption(index) {
  const turn = state.queue[state.qIndex];
  const choice = state.shown[index];
  const before = takeSnapshot();

  const notes = applyEffects(choice.effects);
  state.decisions.push({
    chapter: turn.kind ? "Life event" : CHAPTERS[turn.module - 1].name, title: turn.title,
    choice: choice.text, score: choice.score
  });
  if (state.concepts.indexOf(turn.concept) === -1) state.concepts.push(turn.concept);
  updateDashboard(before);

  setScreen(
    '<div class="chapter-label">' + turn.title + "</div>" +
    "<h2>You chose: " + choice.text + "</h2>" +
    "<p>" + choice.note + (notes.length ? " <em>(" + notes.join(" ") + ")</em>" : "") + "</p>" +
    '<div class="chips">' + buildChangeChips(before) + "</div>" +
    '<div class="why-card"><strong>💡 Why?</strong><br>' + renderWhyText(turn.why) + "</div>" +
    '<button class="btn" onclick="nextSituation()">Continue ⏩</button>'
  );
}

// After every situation about one month passes, then the next situation (or the Year summary) comes.
function nextSituation() {
  const before = takeSnapshot();
  addYearResult(runMonths(1));
  updateDashboard(before);
  state.qIndex += 1;
  if (state.qIndex < state.queue.length) showTurn();
  else showYearSummary();
}

// Gives one friendly line about how the year went.
function yearLine(netChange, creditChange, year) {
  if (year.missed > 0) return "A missed EMI cost you credit points this year. Paying on time protects your score.";
  if (netChange < 0) return "Your net worth dipped this year. Check what you spent or borrowed, and try again next year.";
  if (netChange > 0 && creditChange > 0) return "A strong year: your money grew and your credit score improved.";
  if (netChange > 0) return "Your net worth grew this year. Small, steady habits do the work.";
  return "A quiet year. Your money stayed about the same.";
}

// Finishes the rest of the year's months, then shows the Year summary with the age-up animation.
function showYearSummary() {
  const before = takeSnapshot();
  addYearResult(runMonths(Math.max(0, CONFIG.MONTHS_PER_YEAR - state.year.months)));
  updateDashboard(before);

  const year = state.year;
  const netChange = getNetWorth() - year.startNet;
  const creditChange = Math.round(state.credit - year.startCredit);
  const last = state.age >= CONFIG.END_AGE;
  state.ageLog.push({ age: state.age, net: getNetWorth(), credit: Math.round(state.credit) });

  let lines = "<li>You saved " + formatMoney(year.saved) + " from your income after spending.</li>";
  if (year.interest >= 1) lines += "<li>Interest on savings and FD added " + formatMoney(year.interest) + ".</li>";
  if (state.sip > 0 || year.sipGrowth !== 0) {
    lines += "<li>Your SIP " + (year.sipGrowth >= 0 ? "grew by " : "fell by ") + formatMoney(Math.abs(year.sipGrowth)) +
      " from market moves (it can go up or down).</li>";
  }
  if (year.emiPaid > 0) lines += "<li>You paid " + year.emiPaid + " EMI instalment(s) on time.</li>";
  if (year.missed > 0) lines += "<li>⚠️ You missed " + year.missed + " EMI payment(s).</li>";

  setScreen(
    '<div class="year-summary">' +
    '<div class="chapter-label">Year summary · Age ' + state.age + "</div>" +
    '<div class="age-up">' +
    '<span class="age-old">' + state.age + "</span>" +
    '<span class="age-arrow">→</span>' +
    '<span class="age-new">' + (last ? "🎓" : state.age + 1) + "</span></div>" +
    '<div class="report-stats">' +
    buildTile("Net worth change", '<span data-countup="' + Math.round(netChange) + '" data-format="money">₹0</span>', netChange >= 0 ? "best" : "worst") +
    buildTile("Credit score change", (creditChange > 0 ? "+" : "") + creditChange, creditChange >= 0 ? "best" : "worst") +
    "</div>" +
    "<ul>" + lines + "</ul>" +
    '<p class="year-line">' + yearLine(netChange, creditChange, year) + "</p>" +
    '<button class="btn" onclick="nextAge()">' + (last ? "See my Report Card ▶" : "Start age " + (state.age + 1) + " ▶") + "</button>" +
    "</div>"
  );
}

// Moves to the next age, or to the Report Card after the last one.
function nextAge() {
  if (state.age >= CONFIG.END_AGE) { showEnd(); return; }
  const before = takeSnapshot();
  state.age += 1;
  updateDashboard(before);
  beginAge();
}

// ---------- Report Card ----------

// Turns the decision scores and credit score into a grade letter.
function calcGrade() {
  const maxPoints = state.decisions.length * 3;
  const sum = state.decisions.reduce(function (total, d) { return total + d.score; }, 0);
  const decisionPart = maxPoints > 0 ? (sum / maxPoints) * 80 : 0;
  const creditPart = ((state.credit - 300) / 600) * 20;
  const points = decisionPart + creditPart - (getNetWorth() < 0 ? 10 : 0);
  if (points >= 90) return "A+";
  if (points >= 80) return "A";
  if (points >= 70) return "B";
  if (points >= 55) return "C";
  return "D";
}

// Builds one small stat tile for the Report Card.
function buildTile(label, valueHtml, extraClass) {
  return '<div class="mini-tile ' + (extraClass || "") + '"><span class="label">' + label +
    '</span><span class="value">' + valueHtml + "</span></div>";
}

// Reads the lesson quiz scores saved by learn.html (empty until the player takes quizzes).
function getQuizSummary() {
  try {
    const saved = JSON.parse(localStorage.getItem("moneyquest_learn") || "{}");
    const scores = Object.keys(saved.quiz || {}).map(function (id) { return saved.quiz[id]; });
    if (scores.length === 0) return "No quizzes yet";
    const total = scores.reduce(function (a, b) { return a + b; }, 0);
    return scores.length + " taken · avg " + (total / scores.length).toFixed(1) + " / 4";
  } catch (e) {
    return "No quizzes yet";
  }
}

// Lists the best quiz score for each lesson the player has taken (empty text if none).
function quizScoreLines() {
  let html = "";
  LESSONS.forEach(function (lesson) {
    const score = savedQuizScore(lesson.id);
    if (score !== null) html += "<li>" + lesson.title + ": " + score + " / 4</li>";
  });
  return html ? "<p><strong>Lesson quiz scores</strong></p><ul>" + html + "</ul>" : "";
}

// Shows the Report Card for the whole life from 18 to 25.
function showEnd() {
  const grade = calcGrade();
  const messages = {
    "A+": "Amazing! You made smart money choices all the way.",
    "A": "Great job! Your money habits are strong.",
    "B": "Good work! A few smarter choices will make you even stronger.",
    "C": "Not bad! You learned a lot. Try again and beat this score.",
    "D": "Every expert started somewhere. Play again and try new choices!"
  };
  let best = state.decisions[0], worst = state.decisions[0];
  state.decisions.forEach(function (d) {
    if (d.score > best.score) best = d;
    if (d.score < worst.score) worst = d;
  });
  const speed = state.speedScore === null ? "–" : state.speedScore + " / 5";
  let ageLines = "";
  state.ageLog.forEach(function (row) {
    ageLines += "<li>Age " + row.age + ": net worth " + formatMoney(row.net) + ", credit score " + row.credit + "</li>";
  });

  setScreen(
    '<div class="report-card">' +
    '<div class="chapter-label">Report Card · Ages 18 to 25 · ' + (state.mode === "quick" ? "Quick" : "Full life") + "</div>" +
    "<h2>Your MoneyQuest Report Card</h2>" +
    '<div class="grade">' + grade + "</div>" +
    "<p>" + messages[grade] + "</p>" +
    '<div class="report-stats">' +
    buildTile("Final net worth", '<span data-countup="' + Math.round(getNetWorth()) + '" data-format="money">₹0</span>') +
    buildTile("Credit score", '<span data-countup="' + Math.round(state.credit) + '">0</span>') +
    buildTile("Debt", '<span data-countup="' + Math.round(state.debt) + '" data-format="money">₹0</span>') +
    buildTile("Scam or Real?", speed) +
    buildTile("Lesson quizzes", getQuizSummary()) +
    buildTile("Decisions made", String(state.decisions.length)) +
    "</div>" +
    '<div class="best-worst">' +
    buildTile("⭐ Best choice", best.title + ": " + best.choice, "best") +
    buildTile("💭 Learn from this", worst.title + ": " + worst.choice, "worst") +
    "</div>" +
    "<p><strong>Year by year</strong></p><ul>" + ageLines + "</ul>" +
    quizScoreLines() +
    "<p><strong>You learned:</strong> " + state.concepts.join(", ") + ".</p>" +
    '<button class="btn" onclick="showStartScreen(); document.getElementById(\'dashboard\').classList.add(\'hidden\')">Play again</button> ' +
    '<a class="btn btn-ghost" href="tools.html">🧮 Open tools</a>' +
    "</div>"
  );
}

// Show the start screen when the page opens.
showStartScreen();
