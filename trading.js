// Trading Lab: made-up companies, made-up prices, virtual money. It never predicts real markets.
const TRADE_KEY = "moneyquest_trading_lab";
const TRADE_CASH = 1000000;
const TRADE_MAX_DAYS = 120;
const TRADE_START_DAYS = 30;
const TRADE_COMPANIES = [
  { id: "ZP", name: "Zippy Snacks Ltd", sector: "Food", price: 120, vol: 0.03 },
  { id: "BL", name: "BlueLeaf Power", sector: "Energy", price: 340, vol: 0.025 },
  { id: "NM", name: "Nimbus Cloudworks", sector: "Tech", price: 880, vol: 0.04 },
  { id: "KR", name: "Kiran Roadways", sector: "Transport", price: 210, vol: 0.02 },
  { id: "TG", name: "Tiger Threads", sector: "Textiles", price: 95, vol: 0.045 },
  { id: "SH", name: "Sunhill Foods", sector: "Food", price: 560, vol: 0.015 },
  { id: "OR", name: "Orbit Gadgets", sector: "Tech", price: 1450, vol: 0.05 },
  { id: "PM", name: "Peacock Metals", sector: "Metals", price: 275, vol: 0.03 }
];
// Made-up headlines. "co" targets one company, "sector" targets a sector ("ALL" = whole market). pct = typical price nudge.
const TRADE_NEWS = [
  { co: "BL", text: "BlueLeaf Power wins a state solar contract", pct: 0.07 },
  { co: "BL", text: "BlueLeaf Power pays a fine after a grid outage", pct: -0.05 },
  { co: "ZP", text: "Zippy Snacks launches a new spicy range", pct: 0.05 },
  { co: "ZP", text: "Zippy Snacks recalls one batch over packaging", pct: -0.06 },
  { co: "NM", text: "Nimbus Cloudworks signs a big bank client", pct: 0.07 },
  { co: "NM", text: "Nimbus Cloudworks reports a data centre glitch", pct: -0.06 },
  { co: "KR", text: "Kiran Roadways adds 200 new trucks", pct: 0.04 },
  { co: "KR", text: "Kiran Roadways hit by a highway strike", pct: -0.05 },
  { co: "TG", text: "Tiger Threads bags a festival export order", pct: 0.07 },
  { co: "TG", text: "Tiger Threads faces a jump in cotton costs", pct: -0.06 },
  { co: "SH", text: "Sunhill Foods reports a record harvest", pct: 0.04 },
  { co: "SH", text: "Sunhill Foods hit by a delayed monsoon", pct: -0.04 },
  { co: "OR", text: "Orbit Gadgets unveils a popular new phone", pct: 0.08 },
  { co: "OR", text: "Orbit Gadgets delays its next launch", pct: -0.07 },
  { co: "PM", text: "Peacock Metals lands a rail steel order", pct: 0.06 },
  { co: "PM", text: "Peacock Metals faces higher power costs", pct: -0.05 },
  { sector: "Tech", text: "Tech firms cheer a new digital-skills scheme", pct: 0.03 },
  { sector: "Tech", text: "Tech firms slip on a chip shortage", pct: -0.03 },
  { sector: "Food", text: "Cheaper grain helps food makers", pct: 0.03 },
  { sector: "ALL", text: "Market mood turns cheerful this week", pct: 0.015 },
  { sector: "ALL", text: "Worried headlines make the whole market jittery", pct: -0.015 }
];
const TRADE_TIPS = [
  "Guaranteed 300% returns, buy {n} now!",
  "Secret insider tip: {n} will double by Friday!",
  "A chat group says {n} is the next big thing. Buy before it's too late!",
  "Zero risk, sure profit in {n}. Today only!"
];
const TRADE_LESSON = "Lesson: don't chase tips. Nobody can guarantee returns, and prices are uncertain.";
const TRADE_BADGES = [
  { id: "first", icon: "🎯", name: "First trade" },
  { id: "diversified", icon: "🧺", name: "Diversified (4+ stocks)" },
  { id: "held10", icon: "⏳", name: "Held 10 days" },
  { id: "ignored", icon: "🛡️", name: "Ignored a tip trap" }
];
const TRADE_COLORS = ["#FFB02E", "#2EF2C4", "#8A5CFF", "#FF4D6D", "#E040FB", "#FFE3A3", "#5CC8FF", "#9BE564", "#B8B2D6"];
const TRADE_SECTORS = ["All", "Food", "Tech", "Energy", "Transport", "Textiles", "Metals"];
const TRADE_CHASE = "Lesson: you bought because a stranger promised big returns. Real returns are never guaranteed, and chasing tips often means buying near a peak. Decide with your own plan instead.";
let trade = null;
let tlPrev = {};
let tlParts = null;
let tlOpener = null;
let tlHover = null;
let tlGeo = { padL: 0, slot: 1, n: 0 };
let tlTickerDay = -1;
let tlToastTimer = null;

// Tells whether animations should be skipped (effects set to Off, or the device asks for reduced motion).
function tlOff() {
  return document.documentElement.dataset.fx === "off" || !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.dataset.fx);
}

// Formats a number as rupees with Indian digit grouping.
function tMoney(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Formats a rupee change with a + or - sign.
function tSigned(n) {
  return (n >= 0 ? "+" : "-") + tMoney(Math.abs(n));
}

// Finds a company by its short id.
function tCompany(id) {
  return TRADE_COMPANIES.filter(function (c) { return c.id === id; })[0];
}

// Makes a small repeatable random-number generator from a text seed (so the starting history is always the same).
function tSeeded(seed) {
  let a = 0;
  for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Moves a price one day with a basic random walk (a small random up or down step).
function tradeStep(price, vol, rnd) {
  const change = ((rnd ? rnd() : Math.random()) * 2 - 1) * vol;
  return Math.max(5, price * (1 + change));
}

// Makes a fresh lab: 30 days of made-up past prices (always the same), full cash, no shares.
function tradeFresh() {
  const t = {
    cash: TRADE_CASH, day: 0, prices: {}, held: {}, trades: [], news: [], badges: {},
    tip: null, ignored: 0, dayStart: TRADE_CASH, history: [[0, TRADE_CASH]], tradeCount: 0,
    ui: { sel: TRADE_COMPANIES[0].id, side: "buy", range: "1M", mode: "line", sector: "All" }
  };
  TRADE_COMPANIES.forEach(function (c) {
    const rnd = tSeeded(c.id + "-start"), h = [c.price];
    for (let i = 1; i < TRADE_START_DAYS; i++) h.push(tradeStep(h[h.length - 1], c.vol, rnd));
    t.prices[c.id] = h;
    t.held[c.id] = { qty: 0, cost: 0, since: 0 };
  });
  return t;
}

// Loads the saved lab from localStorage (or starts a new one) and fills in any fields older saves lack.
function tradeLoad() {
  try {
    const raw = localStorage.getItem(TRADE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s.cash === "number" && s.prices && s.held && TRADE_COMPANIES.every(function (c) { return s.prices[c.id] && s.held[c.id]; })) {
        const f = tradeFresh();
        ["trades", "news", "badges", "ignored", "dayStart", "tip", "ui", "history", "tradeCount"].forEach(function (k) { if (s[k] === undefined) s[k] = f[k]; });
        s.tradeCount = Math.max(s.tradeCount, s.trades.length);
        if (s.tip && s.tip.resolved === undefined) s.tip.resolved = null;
        s.ui = Object.assign({}, f.ui, s.ui);
        if (!tCompany(s.ui.sel)) s.ui.sel = f.ui.sel;
        TRADE_COMPANIES.forEach(function (c) { if (s.held[c.id].since === undefined) s.held[c.id].since = s.day; });
        return s;
      }
    }
  } catch (e) { /* ignore broken saved data */ }
  return tradeFresh();
}

// Saves the lab to localStorage.
function tradeSave() {
  try { localStorage.setItem(TRADE_KEY, JSON.stringify(trade)); } catch (e) { /* storage may be blocked */ }
}

// Returns today's price for a company.
function tradePrice(id) {
  const h = trade.prices[id];
  return h[h.length - 1];
}

// Returns the percent change from yesterday to today for a company.
function tradeChange(id) {
  const h = trade.prices[id];
  return (h[h.length - 1] / h[h.length - 2] - 1) * 100;
}

// Returns the total value of all shares owned at today's prices.
function tradeHoldings() {
  let v = 0;
  TRADE_COMPANIES.forEach(function (c) { v += trade.held[c.id].qty * tradePrice(c.id); });
  return v;
}

// Shows the order error line (bad = true) or a toast (good news).
function tradeMsg(text, bad) {
  if (bad) {
    const el = document.getElementById("tl-err");
    el.textContent = text;
    el.classList.toggle("hidden", !text);
  } else if (text) {
    tradeToast(text);
  }
}

// Shows a short toast message at the bottom of the lab (badge = true gives it a small pop).
function tradeToast(text, badge) {
  const el = document.getElementById("tl-toast");
  if (!el) return;
  el.textContent = (badge ? "🏅 " : "") + text;
  el.classList.remove("badge");
  if (badge && !tlOff()) { void el.offsetWidth; el.classList.add("badge"); }
  el.classList.add("show");
  clearTimeout(tlToastTimer);
  tlToastTimer = setTimeout(function () { el.classList.remove("show"); }, 2800);
}

// Throws a short burst of CSS coins out of the order panel (skipped for reduced motion).
function tradeCoins() {
  const box = document.getElementById("tl-coins");
  if (window.MQ && MQ.burst) { MQ.burst("gain", box); return; }
  if (!box || tlOff()) return;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "tl-coin";
    s.style.setProperty("--dx", Math.round((Math.random() * 2 - 1) * 90) + "px");
    s.style.setProperty("--dy", -Math.round(50 + Math.random() * 70) + "px");
    s.style.animationDelay = Math.round(Math.random() * 120) + "ms";
    box.appendChild(s);
    setTimeout(function () { s.remove(); }, 1000);
  }
}

// Flashes the profit/loss tile green or red after a sale.
function tradeFlash(good) {
  const el = document.getElementById("tl-pl-tile");
  if (window.MQ && MQ.burst) MQ.burst(good ? "gain" : "loss", el);
  if (!el || tlOff()) return;
  el.classList.remove("flash-up", "flash-down");
  void el.offsetWidth;
  el.classList.add(good ? "flash-up" : "flash-down");
  setTimeout(function () { el.classList.remove("flash-up", "flash-down"); }, 900);
}

// Shows a number in an element, counting up/down quickly (skipped for reduced motion or a hidden tab).
function tCount(el, value, fmt) {
  const from = el._tv;
  el._tv = value;
  if (from === undefined || from === value || tlOff() || document.hidden) { el.textContent = fmt(value); return; }
  const start = performance.now();
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
  function frame(now) {
    const k = Math.min(1, (now - start) / 450);
    el.textContent = fmt(from + (value - from) * (1 - Math.pow(1 - k, 3)));
    if (k < 1 && el._tv === value) requestAnimationFrame(frame);
    else el.textContent = fmt(el._tv);
  }
  requestAnimationFrame(frame);
}

// Awards any badges just earned and returns their names.
function tradeBadges() {
  const b = trade.badges, got = [];
  let owned = 0, held10 = false;
  TRADE_COMPANIES.forEach(function (c) {
    const h = trade.held[c.id];
    if (h.qty > 0) { owned++; if (trade.day - h.since >= 10) held10 = true; }
  });
  if (trade.trades.length && !b.first) b.first = true, got.push("First trade");
  if (owned >= 4 && !b.diversified) b.diversified = true, got.push("Diversified");
  if (held10 && !b.held10) b.held10 = true, got.push("Held 10 days");
  if (trade.ignored > 0 && !b.ignored) b.ignored = true, got.push("Ignored a tip trap");
  return got;
}

// Adds a line to the trade history and checks badges.
function tradeLog(side, id, qty, price) {
  trade.tradeCount += 1;
  trade.trades.unshift({ day: trade.day, side: side, id: id, qty: qty, price: price });
  if (trade.trades.length > 100) trade.trades.pop();
}

// Buys shares of a company (same maths as before). Returns true on success.
function tradeBuy(id, qty) {
  qty = Math.floor(Number(qty));
  if (!(qty > 0)) { tradeMsg("Type how many shares first.", true); return false; }
  const price = tradePrice(id), cost = qty * price;
  if (cost > trade.cash) {
    tradeMsg("Not enough cash: " + qty + " shares cost " + tMoney(cost) + " but you only have " + tMoney(trade.cash) + ".", true);
    return false;
  }
  trade.cash -= cost;
  if (trade.held[id].qty === 0) trade.held[id].since = trade.day;
  trade.held[id].qty += qty;
  trade.held[id].cost += cost;
  if (trade.tip && trade.tip.id === id && !trade.tip.resolved) trade.tip.resolved = "bought";
  tradeLog("Buy", id, qty, price);
  tradeMsg("", true);
  const got = tradeBadges();
  tradeToast("Bought " + qty + " × " + id + " at " + tMoney(price) + (got.length ? " · Badge: " + got.join(", ") : ""), got.length > 0);
  tradeCoins();
  tradeSave(); tradeRender();
  return true;
}

// Sells shares of a company (same maths as before). Returns true on success.
function tradeSell(id, qty) {
  qty = Math.floor(Number(qty));
  const h = trade.held[id];
  if (!(qty > 0)) { tradeMsg("Type how many shares first.", true); return false; }
  if (qty > h.qty) { tradeMsg("Not enough shares: you only own " + h.qty + " of " + id + ".", true); return false; }
  const price = tradePrice(id), avg = h.cost / h.qty;
  h.cost -= h.cost * (qty / h.qty);
  h.qty -= qty;
  if (h.qty === 0) h.cost = 0;
  trade.cash += qty * price;
  tradeLog("Sell", id, qty, price);
  tradeMsg("", true);
  const got = tradeBadges();
  tradeToast("Sold " + qty + " × " + id + " at " + tMoney(price) + (got.length ? " · Badge: " + got.join(", ") : ""), got.length > 0);
  tradeSave(); tradeRender();
  tradeFlash(price >= avg);
  return true;
}

// Moves every price ahead by n days, adding random news and (about 1 in 6 days) a tip trap.
function tradeAdvance(n) {
  trade.tip = null;
  trade.dayStart = trade.cash + tradeHoldings();
  for (let d = 0; d < n; d++) {
    trade.day += 1;
    TRADE_COMPANIES.forEach(function (c) {
      const h = trade.prices[c.id];
      h.push(tradeStep(h[h.length - 1], c.vol));
      if (h.length > TRADE_MAX_DAYS) h.shift();
    });
    if (Math.random() < 0.4) {
      const item = TRADE_NEWS[Math.floor(Math.random() * TRADE_NEWS.length)];
      const pct = item.pct * (0.7 + Math.random() * 0.6);
      TRADE_COMPANIES.forEach(function (c) {
        if (item.co === c.id || item.sector === "ALL" || item.sector === c.sector) {
          const h = trade.prices[c.id];
          h[h.length - 1] = Math.max(5, h[h.length - 1] * (1 + pct));
        }
      });
      trade.news.unshift({ day: trade.day, text: item.text, up: item.pct > 0, kind: item.co ? "co" : item.sector === "ALL" ? "all" : "sector" });
      if (trade.news.length > 30) trade.news.pop();
    }
    trade.history.push([trade.day, trade.cash + tradeHoldings()]);
    if (trade.history.length > 150) trade.history.shift();
  }
  if (Math.random() < 1 / 6) {
    const c = TRADE_COMPANIES[Math.floor(Math.random() * TRADE_COMPANIES.length)];
    const text = TRADE_TIPS[Math.floor(Math.random() * TRADE_TIPS.length)].replace("{n}", c.name);
    trade.tip = { day: trade.day, id: c.id, text: text, resolved: null };
  }
  const got = tradeBadges();
  tradeToast("Day " + trade.day + ": prices moved at random." + (got.length ? " Badge: " + got.join(", ") : ""), got.length > 0);
  tradeSave(); tradeRender();
}

// Wipes the lab back to the start after the player confirms.
function tradeReset() {
  if (!window.confirm("Reset the Trading Lab? Your cash, shares, history and badges will go back to the start.")) return;
  trade = tradeFresh();
  tlTickerDay = -1;
  tlHover = null;
  tradeSave();
  tradeToast("Reset. Back to " + tMoney(TRADE_CASH) + " cash.");
  tradeRender();
}

// Draws a small line sparkline (SVG) of one company's recent prices.
function tradeSpark(data, name) {
  const W = 120, H = 34, P = 3;
  data = data.slice(-20);
  let min = Math.min.apply(null, data), max = Math.max.apply(null, data);
  if (max === min) max = min + 1;
  let d = "";
  data.forEach(function (v, i) {
    const x = P + (i / (data.length - 1)) * (W - 2 * P);
    const y = P + (1 - (v - min) / (max - min)) * (H - 2 * P);
    d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
  });
  const up = data[data.length - 1] >= data[0];
  return '<svg class="tl-spark" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Recent price line for ' + name + '">' +
    '<path d="' + d + '" fill="none" stroke="' + (up ? "#2EF2C4" : "#FF3B6B") + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}

// Builds Open/High/Low/Close values for the shown days (wicks are made up the same way each time).
function tradeCandles(full, off, count, vol) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const k = off + i, close = full[k], open = k > 0 ? full[k - 1] : close;
    const w1 = Math.abs(Math.sin((k + 1) * 7.31 + close)) * vol * close * 0.5;
    const w2 = Math.abs(Math.cos((k + 1) * 3.17 + close)) * vol * close * 0.5;
    out.push({ o: open, c: close, h: Math.max(open, close) + w1, l: Math.min(open, close) - w2 });
  }
  return out;
}

// Names a history position as a day label (days before the start are shown as -Nd).
function tradeDayLabel(k, len) {
  const d = trade.day - (len - 1 - k);
  return d >= 0 ? "Day " + d : d + "d";
}

// Draws the big price chart (line or candles), average-buy line and crosshair.
function tradeDrawChart() {
  const cv = document.getElementById("tl-canvas");
  if (!cv || !trade) return;
  const w = cv.parentNode.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  const ui = trade.ui, c = tCompany(ui.sel), full = trade.prices[c.id];
  const want = ui.range === "1W" ? 7 : ui.range === "1M" ? 22 : full.length;
  const n = Math.min(want, full.length), off = full.length - n, data = full.slice(off);
  const candles = tradeCandles(full, off, n, c.vol), own = trade.held[c.id];
  const avg = own.qty > 0 ? own.cost / own.qty : null;
  let lo = Infinity, hi = -Infinity;
  candles.forEach(function (k) { lo = Math.min(lo, ui.mode === "candles" ? k.l : k.c); hi = Math.max(hi, ui.mode === "candles" ? k.h : k.c); });
  if (avg !== null) { lo = Math.min(lo, avg); hi = Math.max(hi, avg); }
  const padY = (hi - lo || 1) * 0.1;
  lo -= padY; hi += padY;
  const padL = 8, padR = 62, padT = 10, padB = 22, cw = w - padL - padR, ch = h - padT - padB, slot = cw / n;
  tlGeo = { padL: padL, slot: slot, n: n };
  const X = function (i) { return padL + (i + 0.5) * slot; };
  const Y = function (v) { return padT + (1 - (v - lo) / (hi - lo)) * ch; };
  const UP = "#2EF2C4", DOWN = "#FF3B6B", TEXT = "#FFE3A3";
  g.font = "11px system-ui, sans-serif";
  g.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4, y = Y(v);
    g.strokeStyle = "rgba(246,242,255,0.10)";
    g.beginPath(); g.moveTo(padL, y); g.lineTo(w - padR, y); g.stroke();
    g.fillStyle = "rgba(246,242,255,0.7)"; g.textAlign = "left";
    g.fillText(tMoney(v), w - padR + 6, y + 4);
  }
  g.textAlign = "center";
  [0, Math.floor((n - 1) / 2), n - 1].forEach(function (i, j) {
    g.textAlign = j === 0 ? "left" : j === 2 ? "right" : "center";
    g.fillText(tradeDayLabel(off + i, full.length), j === 0 ? padL : j === 2 ? w - padR : X(i), h - 6);
  });
  const rising = data[n - 1] >= data[0];
  if (ui.mode === "candles") {
    const bw = Math.max(2, Math.min(18, slot * 0.6));
    candles.forEach(function (k, i) {
      const col = k.c >= k.o ? UP : DOWN, x = X(i);
      g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(x, Y(k.h)); g.lineTo(x, Y(k.l)); g.stroke();
      g.fillRect(x - bw / 2, Math.min(Y(k.o), Y(k.c)), bw, Math.max(1.5, Math.abs(Y(k.o) - Y(k.c))));
    });
  } else {
    const col = rising ? UP : DOWN;
    const grad = g.createLinearGradient(0, padT, 0, padT + ch);
    grad.addColorStop(0, rising ? "rgba(46,242,196,0.35)" : "rgba(255,59,107,0.35)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.beginPath();
    data.forEach(function (v, i) { if (i) g.lineTo(X(i), Y(v)); else g.moveTo(X(i), Y(v)); });
    g.lineTo(X(n - 1), padT + ch); g.lineTo(X(0), padT + ch); g.closePath();
    g.fillStyle = grad; g.fill();
    g.beginPath();
    data.forEach(function (v, i) { if (i) g.lineTo(X(i), Y(v)); else g.moveTo(X(i), Y(v)); });
    g.strokeStyle = col; g.lineWidth = 2.5; g.lineJoin = "round"; g.stroke();
  }
  if (avg !== null) {
    g.setLineDash([6, 5]); g.strokeStyle = "#FFB02E"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(padL, Y(avg)); g.lineTo(w - padR, Y(avg)); g.stroke();
    g.setLineDash([]);
    g.fillStyle = "#FFB02E"; g.textAlign = "left";
    g.fillText("Your avg buy " + tMoney(avg), padL + 4, Y(avg) - 5);
  }
  if (tlHover !== null && tlHover < n) {
    const i = tlHover, x = X(i), y = Y(data[i]);
    g.strokeStyle = "rgba(255,227,163,0.6)"; g.lineWidth = 1; g.setLineDash([3, 3]);
    g.beginPath(); g.moveTo(x, padT); g.lineTo(x, padT + ch); g.moveTo(padL, y); g.lineTo(w - padR, y); g.stroke();
    g.setLineDash([]);
    g.fillStyle = TEXT; g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill();
    const label = tradeDayLabel(off + i, full.length) + " · " + tMoney(data[i]);
    const tw = g.measureText(label).width + 16, bx = Math.max(padL, Math.min(w - padR - tw, x - tw / 2)), by = padT + 2;
    g.fillStyle = "rgba(10,7,32,0.92)"; g.strokeStyle = "rgba(246,242,255,0.3)";
    g.fillRect(bx, by, tw, 24); g.strokeRect(bx, by, tw, 24);
    g.fillStyle = TEXT; g.textAlign = "left";
    g.fillText(label, bx + 8, by + 16);
  }
}

// Draws the donut chart of stock values and cash, and fills its legend.
function tradeDrawDonut(parts) {
  const cv = document.getElementById("tl-donut");
  if (!cv) return;
  const size = cv.clientWidth, dpr = window.devicePixelRatio || 1;
  if (!size) return;
  if (cv.width !== Math.round(size * dpr)) { cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr); }
  const g = cv.getContext("2d"), total = parts.reduce(function (s, p) { return s + p.v; }, 0) || 1;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, size, size);
  let a = -Math.PI / 2;
  g.lineWidth = size * 0.2;
  parts.forEach(function (p, i) {
    if (p.v <= 0) return;
    const end = a + (p.v / total) * Math.PI * 2;
    g.strokeStyle = TRADE_COLORS[i % TRADE_COLORS.length];
    g.beginPath(); g.arc(size / 2, size / 2, size * 0.38, a, end); g.stroke();
    a = end;
  });
  document.getElementById("tl-legend").innerHTML = parts.map(function (p, i) {
    return '<li><i style="background:' + TRADE_COLORS[i % TRADE_COLORS.length] + '"></i>' + p.name + ' <b>' + (p.v > 0 && (p.v / total) * 100 < 1 ? "<1" : Math.round((p.v / total) * 100)) + '%</b></li>';
  }).join("");
}

// Updates the order panel: slider limit, order total preview and a live error line.
function tradeOrderUpdate() {
  const ui = trade.ui, c = tCompany(ui.sel), price = tradePrice(c.id);
  const max = ui.side === "buy" ? Math.floor(trade.cash / price) : trade.held[c.id].qty;
  const input = document.getElementById("tl-qty"), slider = document.getElementById("tl-slider");
  const qty = Math.max(0, Math.floor(Number(input.value)) || 0);
  slider.max = Math.max(max, 1);
  slider.disabled = max < 1;
  slider.value = Math.min(qty, max);
  document.getElementById("tl-total").textContent = tMoney(qty * price);
  document.getElementById("tl-orderfor").textContent = c.name + " at " + tMoney(price);
  document.getElementById("tl-max").textContent = (ui.side === "buy" ? "You can afford up to " : "You own ") + max + " shares";
  const go = document.getElementById("tl-go");
  go.textContent = (ui.side === "buy" ? "Buy " : "Sell ") + c.id;
  go.className = "btn tl-go" + (ui.side === "sell" ? " sell" : "");
  document.querySelectorAll("#tl-side button").forEach(function (b) {
    b.classList.toggle("active", b.dataset.side === ui.side);
    b.setAttribute("aria-pressed", b.dataset.side === ui.side ? "true" : "false");
  });
  let err = "";
  if (qty > 0 && ui.side === "buy" && qty * price > trade.cash) err = "Not enough cash: this order costs " + tMoney(qty * price) + " but you have " + tMoney(trade.cash) + ".";
  if (qty > 0 && ui.side === "sell" && qty > max) err = "Not enough shares: you only own " + max + " of " + c.id + ".";
  const el = document.getElementById("tl-err");
  el.textContent = err;
  el.classList.toggle("hidden", !err);
}

// Returns " pulse-up" or " pulse-down" when a company's price changed since the last draw, else "".
function tradePulse(id) {
  const p = tlPrev[id], now = tradePrice(id);
  if (p === undefined || p === now) return "";
  return now > p ? " pulse-up" : " pulse-down";
}

// Explains in plain words why a headline might move a price (and that prices also move for no clear reason).
function tradeWhy(n) {
  let t;
  if (n.kind === "all") t = "When the whole market feels cheerful or jittery, many people buy or sell together, so most prices drift the same way.";
  else if (n.up) t = "Good news like this suggests the company may earn more in future, so buyers were willing to pay more for its shares.";
  else t = "Bad news can mean lower earnings ahead, so some owners sold and the price dipped.";
  return t + " Prices can also move for no clear reason, so a headline never guarantees a move.";
}

// Handles the two buttons on a hot tip: "Buy now!" (a small buy, then a lesson) or "Ignore" (unlocks the badge).
function tradeTipAct(kind) {
  const tip = trade.tip;
  if (!tip || tip.resolved) return;
  if (kind === "ignore") {
    tip.resolved = "ignored";
    trade.ignored += 1;
    const got = tradeBadges();
    tradeToast("Smart move: you ignored the tip." + (got.length ? " Badge: " + got.join(", ") : ""), got.length > 0);
    tradeSave(); tradeRender();
    return;
  }
  trade.ui.sel = tip.id;
  trade.ui.side = "buy";
  tradeBuy(tip.id, Math.max(1, Math.floor((trade.cash * 0.05) / tradePrice(tip.id))));
}

// Draws the small "Your journey" chart: portfolio value per day, dashed ₹10,00,000 baseline, green above and rose below.
function tradeDrawJourney() {
  const cv = document.getElementById("tl-jcanvas");
  if (!cv || !trade) return;
  const w = cv.parentNode.clientWidth - 32, h = 120, dpr = window.devicePixelRatio || 1;
  if (w <= 0) return;
  if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.height = h + "px"; }
  const g = cv.getContext("2d"), hist = trade.history;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  let lo = TRADE_CASH, hi = TRADE_CASH;
  hist.forEach(function (p) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); });
  const pad = (hi - lo || TRADE_CASH * 0.01) * 0.15;
  lo -= pad; hi += pad;
  const X = function (i) { return hist.length < 2 ? w / 2 : 6 + (i / (hist.length - 1)) * (w - 12); };
  const Y = function (v) { return 8 + (1 - (v - lo) / (hi - lo)) * (h - 16); };
  const base = Y(TRADE_CASH);
  g.setLineDash([5, 4]); g.strokeStyle = "rgba(255,227,163,0.7)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, base); g.lineTo(w, base); g.stroke();
  g.setLineDash([]);
  [["#2EF2C4", 0, base], ["#FF3B6B", base, h]].forEach(function (part) {
    g.save();
    g.beginPath(); g.rect(0, part[1], w, part[2] - part[1]); g.clip();
    g.strokeStyle = part[0]; g.lineWidth = 2.5; g.lineJoin = "round";
    g.beginPath();
    hist.forEach(function (p, i) { if (i) g.lineTo(X(i), Y(p[1])); else g.moveTo(X(i), Y(p[1])); });
    g.stroke();
    g.restore();
  });
  const last = hist[hist.length - 1];
  g.fillStyle = last[1] >= TRADE_CASH ? "#2EF2C4" : "#FF3B6B";
  g.beginPath(); g.arc(X(hist.length - 1), Y(last[1]), 4, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(246,242,255,0.7)"; g.font = "11px system-ui, sans-serif"; g.textAlign = "left";
  g.fillText("Start " + tMoney(TRADE_CASH), 4, base - 4);
}

// Redraws all the canvases (chart, journey and donut) without rebuilding the page.
function tradeDrawCharts() {
  if (!trade) return;
  tradeDrawChart();
  tradeDrawJourney();
  if (tlParts) tradeDrawDonut(tlParts);
}

// Works out the diversification score (0-100) from how evenly the share value is spread.
function tradeDivScore() {
  const vals = TRADE_COMPANIES.map(function (c) { return trade.held[c.id].qty * tradePrice(c.id); });
  const sum = vals.reduce(function (a, b) { return a + b; }, 0);
  if (sum <= 0) return 0;
  const hhi = vals.reduce(function (a, v) { return a + Math.pow(v / sum, 2); }, 0);
  return Math.max(0, Math.min(100, Math.round(((1 / hhi - 1) / 4) * 100)));
}

// Opens the Lab report: days, P&L, best/worst holding, trades, diversification, badges and 3 lessons.
function tradeReportOpen() {
  const total = trade.cash + tradeHoldings(), pl = total - TRADE_CASH;
  let best = null, worst = null;
  TRADE_COMPANIES.forEach(function (c) {
    const h = trade.held[c.id];
    if (!h.qty) return;
    const pct = ((h.qty * tradePrice(c.id) - h.cost) / h.cost) * 100, row = { id: c.id, pct: pct };
    if (!best || pct > best.pct) best = row;
    if (!worst || pct < worst.pct) worst = row;
  });
  const fmt = function (r) { return r ? r.id + " (" + (r.pct >= 0 ? "+" : "") + r.pct.toFixed(1) + "%)" : "none yet"; };
  const earned = TRADE_BADGES.filter(function (b) { return trade.badges[b.id]; }).map(function (b) { return b.icon + " " + b.name; });
  document.getElementById("tl-modal-body").innerHTML =
    '<ul class="tl-rep">' +
      '<li><span>Days played</span><b>' + trade.day + '</b></li>' +
      '<li><span>Total P&amp;L</span><b class="' + (pl >= 0 ? "up" : "down") + '">' + tSigned(pl) + ' (' + (pl >= 0 ? "+" : "") + ((pl / TRADE_CASH) * 100).toFixed(2) + '%)</b></li>' +
      '<li><span>Best holding now</span><b>' + fmt(best) + '</b></li>' +
      '<li><span>Weakest holding now</span><b>' + fmt(worst) + '</b></li>' +
      '<li><span>Trades made</span><b>' + trade.tradeCount + '</b></li>' +
      '<li><span>Diversification score</span><b>' + tradeDivScore() + ' / 100</b></li>' +
      '<li><span>Badges earned</span><b>' + (earned.length ? earned.join(", ") : "none yet") + '</b></li></ul>' +
    '<h4>3 lessons</h4><ol class="tl-lessons"><li><b>Diversify.</b> Spreading money across several companies means one bad story hurts less.</li>' +
      '<li><b>Don\'t chase tips.</b> Nobody can promise returns. A "sure thing" message is a warning sign.</li>' +
      '<li><b>Think long term.</b> Daily prices jump around at random; patience and a plan matter more than reacting to every move.</li></ol>' +
    '<p class="note">Made-up companies and virtual money. For learning only, not financial advice.</p>';
  tlOpener = document.activeElement;
  document.getElementById("tl-modal").classList.remove("hidden");
  document.getElementById("tl-modal-close").focus();
}

// Closes the Lab report and returns focus to the button that opened it.
function tradeReportClose() {
  const m = document.getElementById("tl-modal");
  if (!m || m.classList.contains("hidden")) return;
  m.classList.add("hidden");
  if (tlOpener && tlOpener.focus) tlOpener.focus();
}

// Redraws every part of the lab (keeps the typed share number).
function tradeRender() {
  const ui = trade.ui, holdings = tradeHoldings(), total = trade.cash + holdings, pl = total - TRADE_CASH, dayChg = total - trade.dayStart;
  tCount(document.getElementById("tl-v-total"), total, tMoney);
  tCount(document.getElementById("tl-v-cash"), trade.cash, tMoney);
  tCount(document.getElementById("tl-v-pl"), pl, tSigned);
  tCount(document.getElementById("tl-v-day"), dayChg, tSigned);
  document.getElementById("tl-v-pl").className = pl >= 0 ? "up" : "down";
  document.getElementById("tl-v-day").className = dayChg >= 0 ? "up" : "down";
  document.getElementById("tl-daylabel").textContent = "Day " + trade.day;

  if (tlTickerDay !== trade.day) {
    tlTickerDay = trade.day;
    const items = TRADE_COMPANIES.map(function (c) {
      const ch = tradeChange(c.id);
      return '<span class="tl-tick"><b>' + c.id + '</b> ' + tMoney(tradePrice(c.id)) + ' <em class="' + (ch >= 0 ? "up" : "down") + '">' + (ch >= 0 ? "▲" : "▼") + ' ' + Math.abs(ch).toFixed(1) + '%</em></span>';
    }).join("");
    document.getElementById("tl-tape").innerHTML = items + items;
  }

  const c = tCompany(ui.sel), ch = tradeChange(c.id);
  document.getElementById("tl-head").innerHTML = '<div><h2>' + c.name + '</h2><span class="tl-tag">' + c.sector + '</span> <span class="note">' + c.id + '</span></div>' +
    '<div class="tl-bigprice' + tradePulse(c.id) + '">' + tMoney(tradePrice(c.id)) + ' <span class="' + (ch >= 0 ? "up" : "down") + '">' + (ch >= 0 ? "+" : "") + ch.toFixed(1) + '%</span></div>';
  document.querySelectorAll("#tl-mode button, #tl-range button").forEach(function (b) {
    const on = b.dataset.mode ? b.dataset.mode === ui.mode : b.dataset.range === ui.range;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });

  document.getElementById("tl-sectors").innerHTML = TRADE_SECTORS.map(function (s) {
    return '<button type="button" class="filter-chip' + (s === ui.sector ? " active" : "") + '" data-sector="' + s + '" aria-pressed="' + (s === ui.sector) + '">' + s + '</button>';
  }).join("");
  let moodSum = 0;
  TRADE_COMPANIES.forEach(function (k) { moodSum += tradeChange(k.id); });
  const avgMove = moodSum / TRADE_COMPANIES.length;
  const mood = avgMove >= 0.7 ? ["🔥", "Excited", "Most prices rose today, so buyers feel confident."] :
    avgMove <= -0.7 ? ["🌧️", "Shaky", "Most prices fell today, so people feel nervous."] : ["🌤️", "Calm", "Prices barely moved today. Quiet days are normal."];
  document.getElementById("tl-mood").innerHTML = '<b>Market mood: ' + mood[0] + ' ' + mood[1] + '</b><span>' + mood[2] + ' (average move ' + (avgMove >= 0 ? "+" : "") + avgMove.toFixed(1) + '%)</span>';

  document.getElementById("tl-cards").innerHTML = TRADE_COMPANIES.filter(function (k) { return ui.sector === "All" || k.sector === ui.sector; }).map(function (k) {
    const chg = tradeChange(k.id), own = trade.held[k.id].qty;
    return '<button type="button" class="glass tl-card' + (k.id === ui.sel ? " sel" : "") + '" data-id="' + k.id + '" aria-pressed="' + (k.id === ui.sel) + '">' +
      '<span class="tl-card-top"><b>' + k.name + '</b><span class="tl-tag">' + k.sector + '</span></span>' +
      '<span class="tl-card-mid"><span class="tl-card-price' + tradePulse(k.id) + '">' + tMoney(tradePrice(k.id)) + '</span><span class="' + (chg >= 0 ? "up" : "down") + '">' + (chg >= 0 ? "+" : "") + chg.toFixed(1) + '%</span></span>' +
      tradeSpark(trade.prices[k.id], k.name) + (own ? '<span class="note">You own ' + own + '</span>' : "") + '</button>';
  }).join("");

  const rows = [], parts = [];
  TRADE_COMPANIES.forEach(function (k, i) {
    const h = trade.held[k.id];
    parts.push({ name: k.id, v: h.qty * tradePrice(k.id) });
    if (!h.qty) return;
    const now = tradePrice(k.id), p = h.qty * now - h.cost, pct = (p / h.cost) * 100;
    rows.push('<tr><td>' + k.id + '</td><td>' + h.qty + '</td><td>' + tMoney(h.cost / h.qty) + '</td><td>' + tMoney(now) + '</td><td class="' + (p >= 0 ? "up" : "down") + '">' + tSigned(p) + '</td><td class="' + (p >= 0 ? "up" : "down") + '">' + (pct >= 0 ? "+" : "") + pct.toFixed(1) + '%</td></tr>');
  });
  parts.push({ name: "Cash", v: trade.cash });
  document.getElementById("tl-hold-body").innerHTML = rows.length ? rows.join("") : '<tr><td colspan="6" class="note">No shares yet. Pick a company and place a buy order.</td></tr>';
  tlParts = parts;
  tradeDrawDonut(parts);

  let big = 0, bigId = "";
  TRADE_COMPANIES.forEach(function (k) { const v = trade.held[k.id].qty * tradePrice(k.id); if (v > big) { big = v; bigId = k.id; } });
  const share = holdings > 0 ? (big / holdings) * 100 : 0, div = document.getElementById("tl-div");
  document.getElementById("tl-div-fill").style.transform = "scaleX(" + (share / 100) + ")";
  div.className = "tl-div" + (share > 50 ? " warn" : "");
  document.getElementById("tl-div-text").textContent = holdings <= 0 ? "Nothing invested yet." :
    (share > 50 ? "Warning: " + Math.round(share) + "% of your shares sit in " + bigId + ". Spreading money across companies lowers the damage if one falls." : "Good spread: your biggest stock is " + Math.round(share) + "% of your shares.");

  const tip = trade.tip;
  document.getElementById("tl-news").innerHTML =
    (tip ? '<li class="tl-tip"><div class="tl-bubble"><small>💬 Unknown number · Day ' + tip.day + '</small><p>"' + tip.text + '"</p></div> <span class="tl-trap">TIP TRAP</span>' +
      (!tip.resolved ? '<div class="tl-tipbtns"><button type="button" class="btn" data-tip="buy" aria-label="Buy the tipped stock now">Buy now!</button><button type="button" class="btn btn-ghost" data-tip="ignore" aria-label="Ignore the tip">Ignore</button></div><small>' + TRADE_LESSON + '</small>' :
        tip.resolved === "ignored" ? '<p class="tl-lesson good">🛡️ Well done, you ignored it. ' + TRADE_LESSON + '</p>' : '<p class="tl-lesson">📘 ' + TRADE_CHASE + '</p>') + '</li>' : "") +
    (trade.news.length ? trade.news.slice(0, 8).map(function (n) {
      return '<li><b>Day ' + n.day + '</b> <span class="' + (n.up ? "up" : "down") + '">' + (n.up ? "▲" : "▼") + '</span> ' + n.text +
        '<details class="tl-why"><summary>Why did the price move?</summary><p class="note">' + tradeWhy(n) + '</p></details></li>';
    }).join("") : (tip ? "" : '<li class="note">No news yet. Press Next day.</li>'));

  document.getElementById("tl-log-body").innerHTML = trade.trades.length ? trade.trades.slice(0, 12).map(function (t) {
    return '<tr><td>' + t.day + '</td><td class="' + (t.side === "Buy" ? "up" : "down") + '">' + t.side + '</td><td>' + t.id + '</td><td>' + t.qty + '</td><td>' + tMoney(t.price) + '</td></tr>';
  }).join("") : '<tr><td colspan="5" class="note">No trades yet.</td></tr>';

  document.getElementById("tl-badges").innerHTML = TRADE_BADGES.map(function (b) {
    return '<li class="' + (trade.badges[b.id] ? "on" : "") + '"><span>' + b.icon + '</span>' + b.name + '</li>';
  }).join("");

  tradeOrderUpdate();
  tradeDrawChart();
  tradeDrawJourney();
  TRADE_COMPANIES.forEach(function (k) { tlPrev[k.id] = tradePrice(k.id); });
}

// Moves the crosshair to the pointer position on the chart.
function tradeHoverAt(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const i = Math.floor((e.clientX - r.left - tlGeo.padL) / tlGeo.slot);
  tlHover = Math.max(0, Math.min(tlGeo.n - 1, i));
  tradeDrawChart();
}

// Builds the whole lab once and wires up every button.
function tradeInit() {
  const sec = document.getElementById("trading-section");
  if (!sec) return;
  trade = tradeLoad();
  sec.classList.add("tl");
  sec.innerHTML =
    '<h1>📈 Trading Lab</h1>' +
    '<p class="note tl-note"><b>Made-up companies and virtual money. For learning only, not financial advice.</b></p>' +
    '<div class="tl-toprow"><div class="glass tl-mood" id="tl-mood" role="status"></div><button type="button" class="btn btn-ghost" id="tl-report" aria-label="Open the lab report">📋 Lab report</button></div>' +
    '<div class="tl-tapewrap" aria-label="Price ticker"><div class="tl-tape" id="tl-tape"></div></div>' +
    '<div class="tl-grid">' +
      '<div class="glass tl-chartbox"><div class="tl-head" id="tl-head"></div>' +
        '<div class="tl-tools"><span class="tl-seg" id="tl-mode"><button type="button" data-mode="line">Line</button><button type="button" data-mode="candles">Candles</button></span>' +
        '<span class="tl-seg" id="tl-range"><button type="button" data-range="1W">1W</button><button type="button" data-range="1M">1M</button><button type="button" data-range="All">All</button></span></div>' +
        '<div class="tl-canvaswrap"><canvas id="tl-canvas" aria-label="Price chart of the selected company"></canvas></div></div>' +
      '<aside class="tl-rail">' +
        '<div class="glass tl-order"><div id="tl-coins" class="tl-coinbox"></div>' +
          '<div class="tl-seg tl-side" id="tl-side"><button type="button" data-side="buy">Buy</button><button type="button" data-side="sell">Sell</button></div>' +
          '<p class="note" id="tl-orderfor"></p>' +
          '<div class="tl-qtyrow"><button type="button" class="tl-step" id="tl-minus" aria-label="Fewer shares">−</button>' +
            '<input type="number" id="tl-qty" min="0" step="1" inputmode="numeric" value="1" aria-label="Number of shares">' +
            '<button type="button" class="tl-step" id="tl-plus" aria-label="More shares">+</button></div>' +
          '<input type="range" id="tl-slider" min="0" max="1" step="1" value="0" aria-label="Shares slider">' +
          '<div class="tl-chips"><button type="button" data-pct="0.25">25%</button><button type="button" data-pct="0.5">50%</button><button type="button" data-pct="1">Max</button></div>' +
          '<p class="note" id="tl-max"></p>' +
          '<div class="tl-totalrow"><span>Order total</span><b id="tl-total"></b></div>' +
          '<div id="tl-err" class="bank-msg bad hidden" role="alert"></div>' +
          '<button type="button" class="btn tl-go" id="tl-go"></button></div>' +
        '<div class="tl-bento">' +
          '<div class="glass tl-t-total"><span>Total value</span><b id="tl-v-total"></b></div>' +
          '<div class="glass tl-t-cash"><span>Cash</span><b id="tl-v-cash"></b></div>' +
          '<div class="glass tl-t-pl" id="tl-pl-tile"><span>P&amp;L</span><b id="tl-v-pl"></b></div>' +
          '<div class="glass tl-t-day"><span>Day change</span><b id="tl-v-day"></b></div></div>' +
        '<div class="glass tl-journey"><h4>Your journey</h4><canvas id="tl-jcanvas" aria-label="Line chart of your portfolio value by day"></canvas></div>' +
        '<div class="glass tl-days"><span class="note" id="tl-daylabel"></span><div class="tl-daybtns"><button type="button" class="btn" id="tl-next">⏭ Next day</button><button type="button" class="btn btn-ghost" id="tl-skip">Skip 5 days</button></div></div>' +
      '</aside>' +
      '<div class="tl-cardswrap"><div class="chip-row tl-sectors" id="tl-sectors" role="group" aria-label="Filter companies by sector"></div><div class="tl-cards" id="tl-cards"></div></div>' +
    '</div>' +
    '<div class="tl-lower">' +
      '<div class="glass tl-box tl-wide"><h3>Your holdings</h3><div class="tl-scroll"><table class="tl-table"><thead><tr><th>Stock</th><th>Qty</th><th>Avg buy</th><th>Now</th><th>P&amp;L ₹</th><th>P&amp;L %</th></tr></thead><tbody id="tl-hold-body"></tbody></table></div></div>' +
      '<div class="glass tl-box tl-donutbox"><h3>Where your money is</h3><div class="tl-donutrow"><canvas id="tl-donut" aria-label="Donut chart of shares and cash"></canvas><ul class="tl-legend" id="tl-legend"></ul></div>' +
        '<div class="tl-div" id="tl-div"><h4>Diversification</h4><div class="tl-meter"><i id="tl-div-fill"></i></div><p class="note" id="tl-div-text"></p></div></div>' +
      '<div class="glass tl-box"><h3>Market news</h3><ul class="tl-news" id="tl-news"></ul></div>' +
      '<div class="glass tl-box"><h3>Trade history</h3><div class="tl-scroll"><table class="tl-table"><thead><tr><th>Day</th><th>Side</th><th>Stock</th><th>Qty</th><th>Price</th></tr></thead><tbody id="tl-log-body"></tbody></table></div></div>' +
      '<div class="glass tl-box"><h3>Badges</h3><ul class="tl-badges" id="tl-badges"></ul></div>' +
    '</div>' +
    '<div class="tl-footer"><button type="button" class="btn btn-ghost" id="tl-reset">Reset lab</button></div>' +
    '<div id="tl-modal" class="tl-modal hidden"><div class="glass tl-modal-card" role="dialog" aria-modal="true" aria-labelledby="tl-modal-title">' +
      '<button type="button" class="tl-x" id="tl-modal-close" aria-label="Close lab report">✕</button><h2 id="tl-modal-title">📋 Lab report</h2><div id="tl-modal-body"></div></div></div>' +
    '<div id="tl-toast" class="tl-toast" role="status" aria-live="polite"></div>';

  const qtyEl = document.getElementById("tl-qty");
  const qtyNow = function () { return Math.max(0, Math.floor(Number(qtyEl.value)) || 0); };
  const maxNow = function () {
    const id = trade.ui.sel;
    return trade.ui.side === "buy" ? Math.floor(trade.cash / tradePrice(id)) : trade.held[id].qty;
  };
  // Saves the screen choices (company, side, range, mode) and redraws.
  const setUi = function (k, v) { trade.ui[k] = v; tlHover = null; tradeSave(); tradeRender(); };

  document.getElementById("tl-next").onclick = function () { tradeAdvance(1); };
  document.getElementById("tl-skip").onclick = function () { tradeAdvance(5); };
  document.getElementById("tl-reset").onclick = tradeReset;
  document.getElementById("tl-mode").onclick = function (e) { if (e.target.dataset.mode) setUi("mode", e.target.dataset.mode); };
  document.getElementById("tl-range").onclick = function (e) { if (e.target.dataset.range) setUi("range", e.target.dataset.range); };
  document.getElementById("tl-side").onclick = function (e) { if (e.target.dataset.side) setUi("side", e.target.dataset.side); };
  document.getElementById("tl-cards").onclick = function (e) {
    const card = e.target.closest(".tl-card");
    if (card) setUi("sel", card.dataset.id);
  };
  document.getElementById("tl-sectors").onclick = function (e) { if (e.target.dataset.sector) setUi("sector", e.target.dataset.sector); };
  document.getElementById("tl-news").onclick = function (e) { if (e.target.dataset.tip) tradeTipAct(e.target.dataset.tip); };
  document.getElementById("tl-report").onclick = tradeReportOpen;
  document.getElementById("tl-modal-close").onclick = tradeReportClose;
  document.getElementById("tl-modal").onclick = function (e) { if (e.target.id === "tl-modal") tradeReportClose(); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") tradeReportClose(); });
  // Keyboard on the quantity box: Enter places the order, arrows change the number (Shift = 10).
  qtyEl.onkeydown = function (e) {
    if (e.key === "Enter") { e.preventDefault(); document.getElementById("tl-go").click(); }
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      qtyEl.value = Math.max(0, qtyNow() + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1));
      tradeOrderUpdate();
    }
  };
  document.getElementById("tl-tape").onclick = function (e) {
    const b = e.target.closest("b");
    if (b && tCompany(b.textContent)) setUi("sel", b.textContent);
  };
  document.getElementById("tl-minus").onclick = function () { qtyEl.value = Math.max(1, qtyNow() - 1); tradeOrderUpdate(); };
  document.getElementById("tl-plus").onclick = function () { qtyEl.value = qtyNow() + 1; tradeOrderUpdate(); };
  qtyEl.oninput = tradeOrderUpdate;
  document.getElementById("tl-slider").oninput = function (e) { qtyEl.value = e.target.value; tradeOrderUpdate(); };
  document.querySelector(".tl-chips").onclick = function (e) {
    const p = Number(e.target.dataset.pct);
    if (!p) return;
    const m = maxNow();
    qtyEl.value = m > 0 ? Math.max(1, Math.floor(m * p)) : 0;
    tradeOrderUpdate();
  };
  document.getElementById("tl-go").onclick = function () {
    const id = trade.ui.sel;
    if (trade.ui.side === "buy") tradeBuy(id, qtyNow()); else tradeSell(id, qtyNow());
  };
  const cv = document.getElementById("tl-canvas");
  cv.addEventListener("pointermove", tradeHoverAt);
  cv.addEventListener("pointerdown", tradeHoverAt);
  cv.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") { tlHover = null; tradeDrawChart(); } });
  cv.style.touchAction = "pan-y";

  // Redraws the canvases when their size changes (also when the Trading tab is first shown).
  const redraw = tradeDrawCharts;
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(cv.parentNode);
  window.addEventListener("resize", redraw);
  // Pauses the ticker and CSS animations while the tab is hidden.
  document.addEventListener("visibilitychange", function () { sec.classList.toggle("tl-paused", document.hidden); });

  tradeRender();
}

tradeInit();
