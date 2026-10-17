// MoneyQuest visual effects: floating background, navigation highlight and screen animations.
// No game logic lives here. It only decorates what game.js already draws, by wrapping a few
// of its functions (setScreen, updateDashboard, chooseOption) and re-skinning the start screen.
// Loaded with "defer" on every page, so game.js has already run on the game page.

(function () {
  const osReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  let fxMode = readFxMode();      // "full", "lite" or "off" (see the Effects section below)
  let reduced = fxMode === "off"; // true when animation should be skipped
  const isGame = typeof setScreen === "function";

  // ---------- Small helpers ----------

  // Finds an element by its id.
  function $(id) { return document.getElementById(id); }

  // Creates an element with a class name and optional inner HTML.
  function make(tag, className, html) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  // Restarts a CSS animation by removing and re-adding its class.
  function replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  // Makes an element slide up and fade in after a delay (in seconds).
  function rise(el, delay) {
    el.classList.add("fx-rise");
    el.style.animationDelay = delay + "s";
  }

  // Slides up each child of a container one after another.
  function stagger(container, start, step) {
    Array.from(container.children).forEach(function (child, i) { rise(child, start + i * step); });
  }

  // Shows a number as rupees (same style as formatMoney in game.js, which is not on every page).
  function rupees(amount) {
    const text = "₹" + Math.round(Math.abs(amount)).toLocaleString("en-IN");
    return amount < 0 ? "-" + text : text;
  }

  // ---------- Count-up numbers ----------

  // Smoothly counts a number from one value to another. "each" is an optional per-frame callback.
  function countTo(el, from, to, format, ms, each) {
    if (el._raf) cancelAnimationFrame(el._raf);
    if (reduced || from === to) {
      el.textContent = format(to);
      if (each) each(to);
      return;
    }
    el.textContent = format(from);
    if (each) each(from);
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / ms);
      const value = from + (to - from) * (1 - Math.pow(1 - t, 3));   // ease-out
      el.textContent = format(value);
      if (each) each(value);
      if (t < 1) el._raf = requestAnimationFrame(step);
    }
    el._raf = requestAnimationFrame(step);
  }

  // Counts up every element marked with data-countup="123" (optional data-format="money" or "percent").
  function runCountUps(root) {
    root.querySelectorAll("[data-countup]").forEach(function (el) {
      const kind = el.dataset.format;
      const format = kind === "money" ? rupees
        : kind === "percent" ? function (v) { return v.toFixed(1) + "%"; }
        : function (v) { return String(Math.round(v)); };
      countTo(el, 0, parseFloat(el.dataset.countup), format, 1200);
    });
  }

  // ---------- Confetti / coin shower ----------

  // Drops about 30 coloured pieces inside a container (CSS does the falling).
  function confetti(host) {
    if (reduced) return;
    const colors = ["#FFB02E", "#FF4D6D", "#FFE3A3", "#8A5CFF", "#2EF2C4"];
    const layer = make("div", "confetti");
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 30; i++) {
      const piece = make("i", i % 4 === 0 ? "coin-piece" : "");
      if (i % 4 === 0) piece.textContent = "₹";
      else piece.style.background = colors[i % colors.length];
      piece.style.left = Math.round(Math.random() * 100) + "%";
      piece.style.setProperty("--dx", Math.round(Math.random() * 160 - 80) + "px");
      piece.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");
      piece.style.setProperty("--dur", (2.6 + Math.random() * 2) + "s");
      piece.style.setProperty("--dl", (Math.random() * 1.2) + "s");
      layer.appendChild(piece);
    }
    host.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 6500);
  }

  // ---------- Floating background (all pages) ----------

  // Adds the 4 aurora blobs and 8 floating rupee coins behind the page.
  function buildBackground() {
    const bg = make("div", "bg");
    bg.setAttribute("aria-hidden", "true");
    for (let i = 1; i <= 4; i++) bg.appendChild(make("div", "orb o" + i));
    // Each coin: [left %, size px, blur px (depth), seconds to float up, start delay]
    const coins = [[6, 46, 0, 26, 0], [20, 30, 3, 32, -8], [34, 64, 5, 38, -14], [48, 34, 1, 28, -5],
      [62, 52, 4, 36, -20], [76, 38, 1, 29, -3], [88, 56, 3, 34, -17], [95, 26, 2, 31, -9]];
    coins.forEach(function (c) {
      const coin = make("div", "coin", "₹");
      coin.style.left = c[0] + "%";
      coin.style.setProperty("--s", c[1] + "px");
      coin.style.setProperty("--b", c[2] + "px");
      coin.style.setProperty("--t", c[3] + "s");
      coin.style.setProperty("--dl", c[4] + "s");
      bg.appendChild(coin);
    });
    document.body.insertBefore(bg, document.body.firstChild);
  }

  // ---------- Navigation: icons and a sliding highlight ----------

  // Adds icons to the nav links and a highlight that slides from the previous tab to this one.
  function buildNav() {
    const nav = document.querySelector(".topnav");
    if (!nav) return;
    const icons = { "game.html": "🎮", "learn.html": "📘", "tools.html": "🧮", "bank.html": "🏦", "glossary.html": "📖" };
    const wrap = make("div", "nav-links");
    const glow = make("span", "nav-glow");
    wrap.appendChild(glow);
    const links = Array.from(nav.querySelectorAll("a:not(.logo)"));
    links.forEach(function (a) {
      a.innerHTML = '<span class="ico">' + (icons[a.getAttribute("href")] || "•") + '</span><span class="txt">' + a.textContent + "</span>";
      wrap.appendChild(a);
    });
    nav.appendChild(wrap);

    // Moves the highlight under a link (instantly when animate is false).
    function place(link, animate) {
      glow.style.transition = animate ? "" : "none";
      glow.style.width = link.offsetWidth + "px";
      glow.style.transform = "translateX(" + link.offsetLeft + "px)";
    }

    const active = links.filter(function (a) { return a.classList.contains("active"); })[0] || links[0];
    if (!links.some(function (a) { return a.classList.contains("active"); })) glow.style.display = "none";   // homepage: no tab highlighted
    let previous = null;
    try { previous = sessionStorage.getItem("mq-nav"); } catch (e) { /* storage may be blocked */ }
    const startLink = links.filter(function (a) { return a.getAttribute("href") === previous; })[0] || active;
    place(startLink, false);
    void glow.offsetWidth;
    requestAnimationFrame(function () { place(active, true); });
    try { sessionStorage.setItem("mq-nav", active.getAttribute("href")); } catch (e) { /* ignore */ }

    window.addEventListener("resize", function () { place(active, false); });
    window.addEventListener("load", function () { setTimeout(function () { place(active, false); }, 700); });
  }

  // ---------- Dashboard: counting numbers, gauge and charts ----------

  let history = [];       // net worth after each step, for the chart
  let lastState = null;   // used to notice when a new game starts

  // Turns a list of numbers into a smooth SVG line, a filled area under it and the last point.
  function buildShape(values, w, h, pad) {
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const n = values.length;
    const pts = values.map(function (v, i) {
      const frac = max === min ? 0.5 : (v - min) / (max - min);
      return { x: pad + (n === 1 ? 0 : i * (w - 2 * pad) / (n - 1)), y: h - pad - frac * (h - 2 * pad) };
    });
    if (n === 1) pts.push({ x: w - pad, y: pts[0].y });   // one point: draw a flat line
    let d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + " " + (p1.y + (p2.y - p0.y) / 6).toFixed(1) +
        " " + (p2.x - (p3.x - p1.x) / 6).toFixed(1) + " " + (p2.y - (p3.y - p1.y) / 6).toFixed(1) +
        " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
    }
    const first = pts[0], last = pts[pts.length - 1];
    return { line: d, area: d + " L" + last.x.toFixed(1) + " " + h + " L" + first.x.toFixed(1) + " " + h + " Z", last: last };
  }

  // Redraws the line from nothing to full, and fades the fill in.
  function animateDraw(line, area) {
    line.style.transition = "none";
    line.style.strokeDashoffset = "1";
    area.style.transition = "none";
    area.style.opacity = "0";
    void line.getBoundingClientRect();
    line.style.transition = "";
    area.style.transition = "";
    line.style.strokeDashoffset = "0";
    area.style.opacity = "1";
  }

  // Draws the big net worth area chart (animate = true plays the stroke animation).
  function drawChart(animate) {
    const line = $("chart-line");
    if (!line || history.length === 0) return;
    const box = $("chart");
    const w = box.clientWidth > 40 ? box.clientWidth : 560;
    const h = 150;
    $("chart-svg").setAttribute("viewBox", "0 0 " + w + " " + h);
    const shape = buildShape(history, w, h, 14);
    line.setAttribute("d", shape.line);
    $("chart-area").setAttribute("d", shape.area);
    const dot = $("chart-dot");
    dot.style.left = (shape.last.x / w * 100) + "%";
    dot.style.top = (shape.last.y / h * 100) + "%";
    if (animate) animateDraw(line, $("chart-area"));
  }

  // Draws the tiny sparkline inside the Net worth tile (last 12 points).
  function drawSpark() {
    const line = $("spark-line");
    if (!line || history.length === 0) return;
    const shape = buildShape(history.slice(-12), 120, 40, 4);
    line.setAttribute("d", shape.line);
    $("spark-area").setAttribute("d", shape.area);
  }

  // Moves the gauge needle, arc and colour to show a credit score (300-900).
  function paintGauge(score) {
    const gauge = $("gauge");
    if (!gauge) return;
    const pct = Math.max(0, Math.min(1, (score - 300) / 600));
    $("g-needle").style.transform = "rotate(" + (-90 + pct * 180) + "deg)";
    $("g-arc").style.strokeDashoffset = String(100 - pct * 100);
    // Colour: red (0) through amber (45) to green (130).
    const hue = pct < 0.5 ? pct * 2 * 45 : 45 + (pct - 0.5) * 2 * 85;
    gauge.style.setProperty("--gc", "hsl(" + Math.round(hue) + ", 90%, 58%)");
  }

  // Shows a small green/red change badge with a pop animation.
  function setBadge(box, change, goodWhenUp) {
    if (!box) return;
    if (change === 0) { box.textContent = ""; return; }
    const good = goodWhenUp ? change > 0 : change < 0;
    box.textContent = (change > 0 ? "▲" : "▼") + rupees(Math.abs(change));
    box.className = "delta " + (good ? "up" : "down");
    replay(box, "pop");
  }

  // Life-as-a-day sky: sets --sky (the age) and a stage name; CSS eases the page colours over 1.5 s.
  function paintSky(age) {
    const stage = age >= 25 ? 25 : age >= 24 ? 24 : age >= 22 ? 22 : age >= 20 ? 20 : 18;
    const root = document.documentElement;
    root.style.setProperty("--sky", age);
    root.dataset.sky = String(stage);
  }

  // Runs after game.js updates the dashboard: counts the numbers and redraws the charts.
  function animateDashboard(before) {
    paintSky(getAge());
    const names = ["cash", "savings", "fd", "sip", "debt"];
    names.forEach(function (name) {
      countTo($("d-" + name), before[name], state[name], rupees, 900);
      const badge = $("dd-" + name);
      if (badge && badge.textContent) replay(badge, "pop");
    });
    const net = getNetWorth();
    countTo($("d-net"), before.net, net, rupees, 1000);
    setBadge($("dd-net"), Math.round(net - before.net), true);
    if (Math.abs(net - before.net) >= 1) burst(net > before.net ? "gain" : "loss", $("d-net"));
    countTo($("credit-value"), before.credit, state.credit, function (v) { return String(Math.round(v)); }, 1100, paintGauge);

    if (state !== lastState) { history = []; lastState = state; }
    history.push(net);
    drawChart(true);
    drawSpark();
  }

  // ---------- Game screens ----------

  // The tips that scroll along the ribbons on the start screen.
  const TIPS = ["Never share your OTP", "Start early", "Check before you click", "Pay yourself first",
    "Banks never ask for your PIN", "Read the fine print"];

  // Builds one ribbon of scrolling tips (the list is doubled so the loop has no gap).
  function ribbonHtml(tips) {
    let group = "";
    for (let round = 0; round < 2; round++) {
      tips.forEach(function (tip) { group += "<span>" + tip + "</span><span>✦</span>"; });
    }
    return '<div class="ribbon-track">' + group + group + "</div>";
  }

  // The new start screen: big headline, two pill buttons, glass prisms and tilted ribbons.
  function showStartScreenFx() {
    paintSky(18);
    setScreen(
      '<div class="hero">' +
      '<div class="prism p1"></div><div class="prism p2"></div><div class="prism p3"></div><div class="prism p4"></div>' +
      '<div class="coin-cluster" aria-hidden="true"><span class="hcoin hc1">₹</span><span class="hcoin hc2">₹</span><span class="hcoin hc3">₹</span><span class="hcoin hc4">₹</span><span class="hcoin hc5">₹</span></div>' +
      '<span class="tag t1">💰 Budgeting</span><span class="tag t2">🛡️ Scam-proof</span><span class="tag t3">📈 Investing</span>' +
      '<div class="hero-content">' +
      '<span class="eyebrow">Age 18 → 25 · learn by playing</span>' +
      '<h1>Money<span class="grad">Quest</span></h1>' +
      '<p class="tagline">Live from age 18 to 25. Make money choices, see what happens, and learn why.</p>' +
      '<div class="hero-btns">' +
      '<button class="btn" onclick="startGame(\'quick\')">⚡ Quick (about 8 minutes)</button>' +
      '<button class="btn" onclick="startGame(\'full\')">🌟 Full life (about 20 minutes)</button>' +
      '<a class="btn btn-ghost" href="tools.html">🧮 Open tools</a>' +
      "</div></div>" +
      '<div class="ribbon-wrap"><div class="ribbon r1">' + ribbonHtml(TIPS) + "</div></div>" +
      "</div>"
    );
  }

  // Cinematic chapter card: huge number, name sliding in word by word, age pill, prism sweep.
  function decorateChapter(box) {
    const root = box.querySelector(".center");
    const label = box.querySelector(".chapter-label");
    const title = box.querySelector("h1");
    const number = (label.textContent.match(/\d+/) || ["1"])[0];
    root.classList.add("chapter-card");
    root.insertBefore(make("div", "chapter-num", number), root.firstChild);
    title.innerHTML = title.textContent.split(" ").map(function (word, i) {
      return '<span class="word" style="animation-delay:' + (0.55 + i * 0.14) + 's">' + word + "</span>";
    }).join(" ");
    const strong = box.querySelector("strong");
    if (strong) strong.parentElement.classList.add("age-pill");
    const button = box.querySelector("button");
    if (button) button.classList.add("late");
    root.appendChild(make("div", "prism-sweep"));
    root.appendChild(make("div", "sheen"));
    box.onclick = function (e) { if (e.target.tagName !== "BUTTON") box.classList.add("skip"); };
  }

  // Result screen: chips pop in one by one, then the Why? card unfolds.
  function decorateResult(box) {
    const chips = box.querySelectorAll(".chip");
    const why = box.querySelector(".why-card");
    const after = 0.9 + chips.length * 0.14;
    Array.from(box.children).forEach(function (child, i) {
      if (child.classList.contains("chips") || child.classList.contains("why-card")) return;
      rise(child, child.tagName === "BUTTON" ? after + 0.2 : i * 0.08);
    });
    chips.forEach(function (chip, i) {
      chip.classList.add("fx-pop");
      chip.style.animationDelay = (0.45 + i * 0.14) + "s";
    });
    if (why) {
      why.classList.add("fx-unfold");
      why.style.animationDelay = (0.55 + chips.length * 0.14) + "s";
    }
  }

  // Looks at the screen the game just drew and adds the right animations to it.
  function decorateScreen() {
    const box = $("screen");
    box.classList.remove("skip");
    box.onclick = null;
    replay(box, "slide-in");

    if (box.querySelector(".hero")) {
      stagger(box.querySelector(".hero-content"), 0.15, 0.12);
    } else if (box.querySelector('[onclick*="showTurn"]')) {
      decorateChapter(box);
    } else if (box.querySelector(".choice")) {
      stagger(box, 0.1, 0.12);           // situation first, then the choices one by one
    } else if (box.querySelector('[onclick*="nextSituation"]')) {
      decorateResult(box);
    } else if (box.querySelector(".year-summary")) {
      stagger(box.querySelector(".year-summary"), 0.05, 0.12);
    } else {
      stagger(box.children.length === 1 ? box.children[0] : box, 0.05, 0.1);
    }

    if (box.querySelector(".grade") || /Chapters finished/.test(box.textContent)) confetti(box);
    runCountUps(box);
    addWipe(box);
  }

  // Adds the diagonal glass wipe (400 ms, CSS animation) that plays when a new screen appears.
  function addWipe(box) {
    if (reduced) return;
    const wipe = make("div", "wipe");
    wipe.setAttribute("aria-hidden", "true");
    box.appendChild(wipe);
    setTimeout(function () { wipe.remove(); }, 600);
  }

  // Pauses every CSS animation while the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    document.documentElement.classList.toggle("paused", document.hidden);
  });

  // ---------- Effects: Full / Lite / Off ----------

  const FX_KEY = "mq_fx";
  const FX_LABEL = { full: "✨ Full", lite: "🌙 Lite", off: "⏸ Off" };
  const finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  let canvas = null, ctx = null, parts = [], pRaf = 0, watching = false;

  // Reads the saved effects mode (Off by default when the device asks for reduced motion).
  function readFxMode() {
    try {
      const v = localStorage.getItem(FX_KEY);
      if (v === "full" || v === "lite" || v === "off") return v;
    } catch (e) { /* storage may be blocked */ }
    return osReduced ? "off" : "full";
  }

  // Switches the effects mode, updates the page and nav button, and saves it when asked.
  function setFxMode(mode, save) {
    fxMode = mode;
    reduced = mode === "off";
    document.documentElement.dataset.fx = mode;
    if (save) { try { localStorage.setItem(FX_KEY, mode); } catch (e) { /* ignore */ } }
    const b = $("fx-toggle");
    if (b) {
      b.textContent = FX_LABEL[mode];
      b.setAttribute("aria-label", "Effects: " + mode + ". Press to change.");
    }
    if (mode !== "full") { parts = []; clearTransforms(); } else { watchFrames(); }
  }

  // Adds the Effects button to the top navigation; each press goes Full, Lite, Off.
  function buildFxToggle() {
    const nav = document.querySelector(".topnav");
    if (!nav) return;
    const b = make("button", "fx-toggle");
    b.id = "fx-toggle";
    b.type = "button";
    b.onclick = function () { setFxMode(fxMode === "full" ? "lite" : fxMode === "lite" ? "off" : "full", true); };
    nav.appendChild(b);
  }

  // Creates the one shared full-screen canvas the first time it is needed.
  function fxCanvas() {
    if (canvas) return;
    canvas = make("canvas", "fx-canvas");
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
  }

  // Matches the canvas size to the window.
  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Throws a small burst of gold coins (kind "gain") or red shards (kind "loss") from an element; never more than 30 particles.
  function burst(kind, from) {
    if (fxMode !== "full" || document.hidden) return;
    fxCanvas();
    let x = window.innerWidth / 2, y = window.innerHeight * 0.4;
    if (from && from.getBoundingClientRect) {
      const r = from.getBoundingClientRect();
      if (r.width || r.height) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
    }
    for (let i = 0; i < 12; i++) {
      const loss = kind === "loss";
      parts.push({ kind: kind, x: x, y: y, vx: (Math.random() - 0.5) * (loss ? 10 : 7), vy: loss ? (Math.random() - 0.7) * 8 : -2 - Math.random() * 6,
        s: 5 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 1 });
    }
    while (parts.length > 30) parts.shift();
    if (!pRaf) pRaf = requestAnimationFrame(tickParticles);
  }

  // Moves and draws every particle for one frame, then stops the loop when none are left.
  function tickParticles() {
    pRaf = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (document.hidden || fxMode !== "full") { parts = []; return; }
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.28; p.rot += p.vr; p.life -= 0.018;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.kind === "gain") {
        ctx.fillStyle = "#FFB02E";
        ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.283); ctx.fill();
        ctx.fillStyle = "#FFE3A3";
        ctx.beginPath(); ctx.arc(-p.s * 0.25, -p.s * 0.25, p.s * 0.4, 0, 6.283); ctx.fill();
      } else {
        ctx.fillStyle = "#FF3B6B";
        ctx.beginPath(); ctx.moveTo(-p.s, p.s * 0.6); ctx.lineTo(p.s, 0); ctx.lineTo(-p.s * 0.3, -p.s); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    if (parts.length) pRaf = requestAnimationFrame(tickParticles);
  }

  // Watches frame times in Full mode and drops to Lite if frames stay slow for about 3 seconds.
  function watchFrames() {
    if (watching || fxMode !== "full" || document.hidden) return;
    watching = true;
    let last = 0, slow = 0;
    function frame(t) {
      if (fxMode !== "full" || document.hidden) { watching = false; return; }
      if (last) {
        const dt = t - last;
        if (dt > 500) slow = 0; else if (dt > 40) slow += dt; else slow = Math.max(0, slow - dt);
      }
      last = t;
      if (slow > 3000) { watching = false; setFxMode("lite", false); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Clears any tilt or magnetic offset left on elements.
  function clearTransforms() {
    document.querySelectorAll(".fx-tilt, .fx-mag").forEach(function (el) { el.style.transform = ""; el.classList.remove("fx-tilt", "fx-mag"); });
  }

  // Gentle 3D tilt toward the cursor on cards (max 6 degrees) and magnetic pull on primary buttons; mouse only.
  document.addEventListener("pointermove", function (e) {
    if (fxMode !== "full" || !finePointer || e.pointerType === "touch" || !e.target.closest) return;
    const btn = e.target.closest(".btn:not(.btn-ghost)");
    if (btn) {
      const r = btn.getBoundingClientRect();
      btn.classList.add("fx-mag");
      btn.style.transform = "translate(" + (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + "px," + (((e.clientY - r.top) / r.height - 0.5) * 8 - 2).toFixed(1) + "px)";
    }
    const card = e.target.closest(".card, .module-card, .term-card, .tl-order, .tl-card, .bq-tile");
    if (card) {
      const r = card.getBoundingClientRect();
      if (r.width > 700 || r.height > 520) return;
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.classList.add("fx-tilt");
      card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 12).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 12).toFixed(2) + "deg)";
    }
  });
  // Puts a tilted card or pulled button back when the cursor leaves it.
  document.addEventListener("pointerout", function (e) {
    const el = e.target.closest && e.target.closest(".fx-tilt, .fx-mag");
    if (el && !el.contains(e.relatedTarget)) { el.style.transform = ""; el.classList.remove("fx-tilt", "fx-mag"); }
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) watchFrames(); });

  // ---------- Hook everything up ----------

  buildBackground();
  buildNav();
  buildFxToggle();
  setFxMode(fxMode, false);

  if (isGame) {
    // Every screen the game draws gets animated.
    const drawScreen = setScreen;
    setScreen = function (html) { drawScreen(html); decorateScreen(); };

    // Every dashboard update also animates numbers, gauge and charts.
    const drawDashboard = updateDashboard;
    updateDashboard = function (before) { drawDashboard(before); animateDashboard(before); };

    // Clicking a choice glows it and dims the others for a moment before the result appears.
    const pickOption = chooseOption;
    let picking = false;
    chooseOption = function (index) {
      const buttons = document.querySelectorAll("#screen .choice");
      if (picking) return;
      if (reduced || buttons.length === 0) { pickOption(index); return; }
      picking = true;
      buttons.forEach(function (button, i) { button.classList.add(i === index ? "picked" : "dim"); });
      setTimeout(function () { picking = false; pickOption(index); }, 420);
    };

    showStartScreen = showStartScreenFx;
    showStartScreen();

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { drawChart(false); }, 150);
    });
  } else {
    runCountUps(document);
  }

  // Small toolbox other pages (calculators, report card) can use.
  window.MQ = {
    countUp: function (el, to, kind) {
      el.dataset.format = kind || "number";
      const format = kind === "money" ? rupees : kind === "percent" ? function (v) { return v.toFixed(1) + "%"; } : function (v) { return String(Math.round(v)); };
      countTo(el, 0, to, format, 1200);
    },
    confetti: confetti,
    burst: burst
  };
})();
