// MoneyQuest Learn page: module cards, lesson reading pages, "Mark as done" and quizzes.
// Progress is saved in localStorage under "moneyquest_learn" as { done: { lessonId: true }, quiz: { lessonId: bestScore0to4 } }.
// Pages are chosen with the URL hash: #m3 (a module), #l3-1 (a lesson). Needs turns.js (CHAPTERS), lessons.js and glossary.js.

const LEARN_KEY = "moneyquest_learn";
const learnRoot = document.getElementById("learn-root");

// ---------- Saved progress ----------

// Reads the saved progress (an empty one if nothing is saved or storage is blocked).
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEARN_KEY) || "{}");
    return { done: saved.done || {}, quiz: saved.quiz || {} };
  } catch (e) {
    return { done: {}, quiz: {} };
  }
}

// Saves the progress object.
function saveProgress(progress) {
  try { localStorage.setItem(LEARN_KEY, JSON.stringify(progress)); } catch (e) { /* storage may be blocked */ }
}

// ---------- Small helpers ----------

// Finds one lesson by its id like "3-1".
function findLesson(id) {
  return LESSONS.filter(function (l) { return l.id === id; })[0];
}

// Lessons that belong to a module number.
function lessonsOf(moduleId) {
  return LESSONS.filter(function (l) { return l.module === moduleId; });
}

// Makes the technical words in some HTML clickable (the shared glossary function).
function gl(html) {
  return linkGlossaryTerms(html);
}

// Draws a small progress bar for a number out of a total.
function progressBar(part, total) {
  const percent = total ? Math.round((part / total) * 100) : 0;
  return '<div class="progress"><span style="width:' + percent + '%"></span></div>';
}

// Puts HTML on the page and scrolls to the top.
function show(html) {
  learnRoot.innerHTML = html;
  window.scrollTo(0, 0);
}

// ---------- Home: the nine module cards ----------

// Shows all modules as glass cards with a small progress indicator.
function showLearnHome() {
  const progress = loadProgress();
  let cards = "";
  CHAPTERS.forEach(function (module) {
    const lessons = lessonsOf(module.id);
    const done = lessons.filter(function (l) { return progress.done[l.id]; }).length;
    const quizzes = lessons.filter(function (l) { return progress.quiz[l.id] !== undefined; });
    const quizText = quizzes.length ? " · quiz avg " + (quizzes.reduce(function (s, l) { return s + progress.quiz[l.id]; }, 0) / quizzes.length).toFixed(1) + "/4" : "";
    const body = lessons.length
      ? progressBar(done, lessons.length) + "<p class=\"note\">" + done + " of " + lessons.length + " lessons done" + quizText + "</p>"
      : '<p class="note">Lessons coming soon</p>';
    cards += '<a class="module-card glass' + (lessons.length ? "" : " soon") + '" href="#m' + module.id + '">' +
      '<span class="module-emoji">' + module.emoji + "</span>" +
      '<span class="chapter-label">Module ' + module.id + "</span>" +
      "<h3>" + module.name + "</h3><p>" + module.intro + "</p>" + body + "</a>";
  });
  show("<h1>📘 Learn</h1><p>Nine modules, three lessons each. Read, take the quiz, and score 3 of 4 to earn a small bonus in the game.</p>" +
    '<div class="module-grid">' + cards + "</div>");
}

// ---------- A module: its lessons ----------

// Shows the lessons of one module.
function showModule(moduleId) {
  const module = CHAPTERS[moduleId - 1];
  if (!module) { showLearnHome(); return; }
  const progress = loadProgress();
  let items = "";
  lessonsOf(moduleId).forEach(function (l, i) {
    const score = progress.quiz[l.id];
    items += '<a class="lesson-row glass" href="#l' + l.id + '"><span class="lesson-num">' + (progress.done[l.id] ? "✅" : i + 1) + "</span>" +
      "<span><strong>" + l.title + "</strong><br><span class=\"note\">" + l.hook + "</span></span>" +
      '<span class="note">' + (score !== undefined ? "Quiz " + score + "/4" : "") + "</span></a>";
  });
  show('<p><a href="#">← All modules</a></p><span class="module-emoji">' + module.emoji + "</span>" +
    "<h1>" + module.name + "</h1><p>" + module.intro + "</p>" +
    (items || '<p class="note">Lessons for this module are coming soon.</p>') +
    '<p class="note">For learning only, not financial advice.</p>');
}

// ---------- A lesson ----------

// Builds a bullet list from an array of strings.
function bulletList(items) {
  return "<ul>" + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>";
}

// Shows one lesson as a full reading page, with the quiz at the bottom.
function showLesson(id) {
  const lesson = findLesson(id);
  if (!lesson) { showLearnHome(); return; }
  const progress = loadProgress();
  const module = CHAPTERS[lesson.module - 1];
  const list = lessonsOf(lesson.module);
  const index = list.indexOf(lesson);
  const next = list[index + 1];

  let sections = "";
  lesson.sections.forEach(function (s) {
    sections += gl("<h2>" + s.h + "</h2>" + s.p.map(function (t) { return "<p>" + t + "</p>"; }).join(""));
  });

  const example = '<div class="worked glass"><h3>🧮 ' + lesson.example.title + "</h3>" +
    gl("<ol>" + lesson.example.steps.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>") + "</div>";
  const india = '<div class="india-box"><strong>🇮🇳 Indian example</strong><p>' + gl(lesson.india) + "</p></div>";
  const links = lesson.links.map(function (l) {
    return '<li><a href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + " ↗</a></li>";
  }).join("");

  show('<p><a href="#m' + lesson.module + '">← ' + module.name + "</a></p>" +
    '<span class="chapter-label">' + module.emoji + " Module " + lesson.module + " · Lesson " + (index + 1) + "</span>" +
    "<h1>" + lesson.title + "</h1>" +
    '<p class="hook">' + gl(lesson.hook) + "</p>" +
    '<div class="learn-box glass"><strong>What you will learn</strong>' + bulletList(lesson.learn) + "</div>" +
    sections + example + india +
    "<h2>⚠️ Common mistakes</h2>" + gl(bulletList(lesson.mistakes)) +
    "<h2>✅ Key takeaways</h2>" + gl(bulletList(lesson.takeaways)) +
    "<h2>🔗 Where to learn more</h2><ul>" + links + "</ul>" +
    '<div class="lesson-actions"><button class="btn" id="done-btn" type="button"></button></div>' +
    '<h2>📝 Quick quiz</h2><div id="quiz-box"></div>' +
    (next ? '<p><a class="btn btn-ghost" href="#l' + next.id + '">Next lesson: ' + next.title + " →</a></p>" : "") +
    '<p class="note">For learning only, not financial advice. All amounts are made up for teaching.</p>');

  setupDoneButton(lesson);
  drawQuiz(lesson);
}

// Sets up the "Mark as done" button for a lesson.
function setupDoneButton(lesson) {
  const button = document.getElementById("done-btn");
  // Writes the button label from the saved progress.
  function paint() {
    const done = !!loadProgress().done[lesson.id];
    button.textContent = done ? "✅ Done (click to undo)" : "Mark as done";
    button.classList.toggle("btn-ghost", done);
  }
  button.addEventListener("click", function () {
    const progress = loadProgress();
    if (progress.done[lesson.id]) delete progress.done[lesson.id]; else progress.done[lesson.id] = true;
    saveProgress(progress);
    paint();
  });
  paint();
}

// ---------- The quiz ----------

// Draws the 4 questions with a "Check answers" button.
function drawQuiz(lesson) {
  const box = document.getElementById("quiz-box");
  const saved = loadProgress().quiz[lesson.id];
  let html = "";
  lesson.quiz.forEach(function (q, qi) {
    html += '<fieldset class="quiz-q"><legend>' + (qi + 1) + ". " + gl(q.q) + "</legend>";
    q.o.forEach(function (option, oi) {
      html += '<label class="quiz-opt"><input type="radio" name="q' + qi + '" value="' + oi + '"> <span>' + option + "</span></label>";
    });
    html += '<div class="quiz-why hidden" id="why' + qi + '"></div></fieldset>';
  });
  html += '<button class="btn" id="quiz-check" type="button">Check answers</button>' +
    '<p id="quiz-result" class="note">' + (saved !== undefined ? "Your best score so far: " + saved + " of 4." : "") + "</p>";
  box.innerHTML = html;
  document.getElementById("quiz-check").addEventListener("click", function () { checkQuiz(lesson); });
}

// Marks the answers, shows a one-sentence explanation for each, and saves the best score.
function checkQuiz(lesson) {
  let score = 0, unanswered = 0;
  lesson.quiz.forEach(function (q, qi) {
    const picked = document.querySelector('input[name="q' + qi + '"]:checked');
    const why = document.getElementById("why" + qi);
    if (!picked) { unanswered++; return; }
    const right = Number(picked.value) === q.a;
    if (right) score++;
    why.className = "quiz-why " + (right ? "right" : "wrong");
    why.innerHTML = (right ? "✅ Correct. " : "❌ Not quite. The answer is: " + q.o[q.a] + ". ") + gl(q.why);
  });
  const result = document.getElementById("quiz-result");
  if (unanswered > 0) { result.textContent = "Please answer all 4 questions first."; return; }
  const progress = loadProgress();
  const best = Math.max(score, progress.quiz[lesson.id] === undefined ? 0 : progress.quiz[lesson.id]);
  progress.quiz[lesson.id] = best;
  saveProgress(progress);
  result.innerHTML = "<strong>You scored " + score + " of 4.</strong> " +
    (score >= 3 ? "Great! A score of 3 or more earns a small bonus in the game." : "Read the lesson again and try once more.") +
    " Best score: " + best + " of 4.";
}

// ---------- Choosing the page from the URL hash ----------

// Shows the home, a module or a lesson depending on the hash.
function route() {
  const hash = location.hash.replace(/^#/, "");
  if (hash.charAt(0) === "l") showLesson(hash.slice(1));
  else if (hash.charAt(0) === "m") showModule(Number(hash.slice(1)));
  else showLearnHome();
}

window.addEventListener("hashchange", route);
route();
