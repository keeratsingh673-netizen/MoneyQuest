// The 8 calculators. All numbers are rounded, illustrative examples (never current rates).

// Formats a rupee amount with Indian digit grouping.
function inr(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Rounds a result to a friendly number: nearest ₹100 if large, ₹10 if medium, else ₹1.
function niceRound(n) {
  if (n >= 100000) return Math.round(n / 100) * 100;
  if (n >= 1000) return Math.round(n / 10) * 10;
  return Math.round(n);
}

// Shows an "about" amount, plus a lakh/crore hint for big numbers.
function aboutInr(n) {
  const r = niceRound(n);
  return "about " + inr(r) + lakhHint(r);
}

// Returns a short "(₹12.5 lakh)" hint for amounts of a lakh or more.
function lakhHint(n) {
  if (n >= 10000000) return " (₹" + (n / 10000000).toFixed(2) + " crore)";
  if (n >= 100000) return " (₹" + (n / 100000).toFixed(2) + " lakh)";
  return "";
}

// Writes a very short amount for chart axis labels, such as 5L or 1.2Cr.
function shortInr(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(".0", "") + "Cr";
  if (n >= 100000) return (n / 100000).toFixed(1).replace(".0", "") + "L";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return String(Math.round(n));
}

// Draws a simple inline-SVG line chart. series = [{name, color, dashed, data[]}], xLabel = text under the axis.
function lineChartSvg(series, startLabel, endLabel) {
  const W = 560, H = 210, L = 46, R = 12, T = 12, B = 30;
  let max = 0;
  series.forEach(function (s) { s.data.forEach(function (v) { if (v > max) max = v; }); });
  if (max <= 0) max = 1;
  const n = series[0].data.length;
  // Maps a data index and value to SVG x and y positions.
  function px(i) { return L + (n <= 1 ? 0 : i / (n - 1)) * (W - L - R); }
  function py(v) { return T + (1 - v / max) * (H - T - B); }
  let svg = '<svg class="calc-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Chart of ' +
    series.map(function (s) { return s.name; }).join(" and ") + ' over time">';
  for (let g = 0; g <= 4; g++) {
    const v = max * g / 4, y = py(v);
    svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" class="grid"/>' +
      '<text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + shortInr(v) + "</text>";
  }
  series.forEach(function (s) {
    let d = "";
    s.data.forEach(function (v, i) { d += (i ? "L" : "M") + px(i).toFixed(1) + " " + py(v).toFixed(1); });
    svg += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="3" stroke-linecap="round"' +
      (s.dashed ? ' stroke-dasharray="6 6"' : "") + "/>";
  });
  svg += '<text x="' + L + '" y="' + (H - 8) + '">' + startLabel + "</text>" +
    '<text x="' + (W - R) + '" y="' + (H - 8) + '" text-anchor="end">' + endLabel + "</text></svg>";
  const legend = series.map(function (s) {
    return '<span><i style="background:' + s.color + '"></i>' + s.name + "</span>";
  }).join("");
  return '<div class="calc-chart">' + svg + '<div class="calc-legend">' + legend + "</div></div>";
}

// Calculator definitions: fields, a compute() that returns {big, label, rows, chart}, and a one-line maths note.
const CALCS = [
  {
    id: "compound", emoji: "📈", title: "Compound interest",
    fields: [
      { id: "p", label: "Amount invested (₹)", min: 1000, max: 1000000, step: 1000, value: 50000 },
      { id: "r", label: "Interest rate (% a year, example)", min: 1, max: 15, step: 0.5, value: 7 },
      { id: "t", label: "Years", min: 1, max: 30, step: 1, value: 10 },
      { id: "n", label: "Added how often", type: "select", value: 4, options: [[1, "Yearly"], [2, "Half-yearly"], [4, "Quarterly"], [12, "Monthly"]] }
    ],
    maths: "Final = P × (1 + r/n)^(n × years); interest also earns interest.",
    // Works out the final amount and a year-by-year chart.
    compute: function (v) {
      const grow = function (y) { return v.p * Math.pow(1 + v.r / 100 / v.n, v.n * y); };
      const total = niceRound(grow(v.t));   // rounded first, so the interest row adds up to it
      const a = [], b = [];
      for (let y = 0; y <= v.t; y++) { a.push(grow(y)); b.push(v.p); }
      return {
        label: "You would have", big: aboutInr(total),
        rows: [["Money you put in", inr(v.p)], ["Interest earned", aboutInr(total - v.p)]],
        chart: lineChartSvg([{ name: "Total value", color: "#ffa733", data: a }, { name: "Money put in", color: "#6fa8ff", dashed: true, data: b }], "Year 0", "Year " + v.t)
      };
    }
  },
  {
    id: "sip", emoji: "🌱", title: "SIP",
    fields: [
      { id: "m", label: "Invest every month (₹)", min: 500, max: 100000, step: 500, value: 5000 },
      { id: "r", label: "Expected return (% a year, example)", min: 1, max: 20, step: 0.5, value: 10 },
      { id: "t", label: "Years", min: 1, max: 40, step: 1, value: 10 }
    ],
    maths: "Each month's deposit grows: monthly × ((1+i)^n − 1) ÷ i × (1+i), i = r ÷ 12.",
    // Works out the SIP value and a year-by-year chart. Returns are not guaranteed.
    compute: function (v) {
      const i = v.r / 100 / 12;
      const fv = function (months) {
        return i === 0 ? v.m * months : v.m * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      };
      const a = [], b = [];
      for (let y = 0; y <= v.t; y++) { a.push(fv(y * 12)); b.push(v.m * y * 12); }
      const total = niceRound(fv(v.t * 12)), put = v.m * v.t * 12;   // rounded first, so the gain adds up
      return {
        label: "Your SIP could grow to", big: aboutInr(total),
        rows: [["Total you invest", inr(put)], ["Gain if returns match", aboutInr(total - put)]],
        note: "A SIP never guarantees profit. Real returns go up and down.",
        chart: lineChartSvg([{ name: "SIP value", color: "#ffa733", data: a }, { name: "Money put in", color: "#6fa8ff", dashed: true, data: b }], "Year 0", "Year " + v.t)
      };
    }
  },
  {
    id: "emi", emoji: "🏍️", title: "EMI",
    fields: [
      { id: "p", label: "Loan amount (₹)", min: 10000, max: 5000000, step: 10000, value: 200000 },
      { id: "r", label: "Interest rate (% a year, example)", min: 1, max: 20, step: 0.5, value: 10 },
      { id: "t", label: "Loan length (months)", min: 6, max: 240, step: 6, value: 36 }
    ],
    maths: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), r monthly rate, n months.",
    // Works out the monthly EMI, total interest and the balance left each month.
    compute: function (v) {
      const r = v.r / 100 / 12, n = v.t;
      const emi = r === 0 ? v.p / n : v.p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      let bal = v.p, paid = 0;
      const left = [bal], interest = [0];
      for (let k = 1; k <= n; k++) {
        const int = bal * r;
        bal = Math.max(0, bal - (emi - int));
        paid += int;
        left.push(bal); interest.push(paid);
      }
      return {
        label: "You pay every month", big: aboutInr(emi),
        rows: [["Total interest", aboutInr(emi * n - v.p)], ["Total you repay", aboutInr(emi * n)]],
        chart: lineChartSvg([{ name: "Loan still owed", color: "#ffa733", data: left }, { name: "Interest paid so far", color: "#6fa8ff", data: interest }], "Month 0", "Month " + n)
      };
    }
  },
  {
    id: "goal", emoji: "🎯", title: "Goal planner",
    fields: [
      { id: "g", label: "Goal amount (₹)", min: 10000, max: 10000000, step: 10000, value: 500000 },
      { id: "s", label: "Already saved (₹)", min: 0, max: 5000000, step: 5000, value: 0 },
      { id: "r", label: "Expected return (% a year, example)", min: 0, max: 15, step: 0.5, value: 8 },
      { id: "t", label: "Years to reach it", min: 1, max: 30, step: 1, value: 5 }
    ],
    maths: "Works backwards from the SIP formula: monthly amount = gap ÷ growth factor.",
    // Works out the monthly saving needed to reach the goal.
    compute: function (v) {
      const i = v.r / 100 / 12, n = v.t * 12;
      const grownSavings = v.s * Math.pow(1 + i, n);
      const gap = Math.max(0, v.g - grownSavings);
      const factor = i === 0 ? n : ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const monthly = gap / factor;
      return {
        label: "Save every month", big: aboutInr(monthly),
        rows: [["Total you would save", aboutInr(monthly * n + v.s)], ["Goal", inr(v.g) + lakhHint(v.g)]],
        note: gap === 0 ? "Your savings alone could reach this goal." : ""
      };
    }
  },
  {
    id: "fd", emoji: "🔒", title: "FD maturity",
    fields: [
      { id: "p", label: "Amount in the FD (₹)", min: 1000, max: 2000000, step: 1000, value: 100000 },
      { id: "r", label: "FD rate (% a year, example)", min: 1, max: 12, step: 0.1, value: 7 },
      { id: "t", label: "Years", min: 1, max: 10, step: 1, value: 3 }
    ],
    maths: "Maturity = P × (1 + r/4)^(4 × years), assuming interest is added quarterly.",
    // Works out what an FD pays at the end.
    compute: function (v) {
      const total = niceRound(v.p * Math.pow(1 + v.r / 100 / 4, 4 * v.t));   // rounded first, so the interest adds up
      return {
        label: "FD pays at the end", big: aboutInr(total),
        rows: [["You deposit", inr(v.p)], ["Interest earned", aboutInr(total - v.p)]],
        note: "Breaking an FD early usually means a lower rate or a penalty."
      };
    }
  },
  {
    id: "inflation", emoji: "🍕", title: "Inflation impact",
    fields: [
      { id: "c", label: "Price or amount today (₹)", min: 100, max: 1000000, step: 100, value: 10000 },
      { id: "r", label: "Inflation (% a year, example)", min: 1, max: 12, step: 0.5, value: 5 },
      { id: "t", label: "Years from now", min: 1, max: 40, step: 1, value: 10 }
    ],
    maths: "Future price = price × (1 + inflation)^years; today's buying power = amount ÷ same factor.",
    // Works out the future price and what today's money will be worth then.
    compute: function (v) {
      const f = Math.pow(1 + v.r / 100, v.t);
      return {
        label: "The same things would cost", big: aboutInr(v.c * f),
        rows: [["Price today", inr(v.c)], ["Your " + inr(v.c) + " will only buy what this buys today", aboutInr(v.c / f)]]
      };
    }
  },
  {
    id: "simplecomp", emoji: "⚖️", title: "Simple vs compound",
    fields: [
      { id: "p", label: "Amount (₹)", min: 1000, max: 1000000, step: 1000, value: 100000 },
      { id: "r", label: "Interest rate (% a year, example)", min: 1, max: 15, step: 0.5, value: 8 },
      { id: "t", label: "Years", min: 1, max: 30, step: 1, value: 15 }
    ],
    maths: "Simple = P × (1 + r × t); compound = P × (1 + r)^t, added yearly.",
    // Compares simple and compound interest side by side.
    compute: function (v) {
      const simple = v.p * (1 + v.r / 100 * v.t);
      const comp = v.p * Math.pow(1 + v.r / 100, v.t);
      return {
        label: "Compound beats simple by", big: aboutInr(comp - simple),
        rows: [["With simple interest", aboutInr(simple)], ["With compound interest", aboutInr(comp)]]
      };
    }
  },
  {
    id: "budget", emoji: "🧾", title: "50/30/20 budget",
    fields: [
      { id: "i", label: "Monthly money you get (₹)", min: 1000, max: 500000, step: 500, value: 20000 }
    ],
    maths: "Split your monthly money: 50% needs, 30% wants, 20% savings.",
    // Splits the monthly income into needs, wants and savings with coloured bars.
    compute: function (v) {
      const parts = [["Needs", 50, "#ffa733"], ["Wants", 30, "#6fa8ff"], ["Savings", 20, "#5be38f"]];
      let bars = '<div class="budget-bars">';
      parts.forEach(function (p) {
        bars += '<div class="budget-row"><span>' + p[0] + " (" + p[1] + '%)</span><div class="budget-track"><i style="width:' + p[1] + "%;background:" + p[2] + '"></i></div><b>' + inr(v.i * p[1] / 100) + "</b></div>";
      });
      bars += "</div>";
      return { label: "Put into savings each month", big: inr(v.i * 0.2), rows: [], chart: bars };
    }
  }
];

// Builds the HTML for one input (number box plus slider, or a drop-down).
function fieldHtml(calcId, f) {
  const id = calcId + "-" + f.id;
  if (f.type === "select") {
    return '<div class="calc-field"><label for="' + id + '">' + f.label + '</label><select id="' + id + '" data-f="' + f.id + '">' +
      f.options.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === f.value ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></div>";
  }
  return '<div class="calc-field"><label for="' + id + '">' + f.label + '</label><div class="calc-inputs">' +
    '<input type="number" id="' + id + '" data-f="' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + f.value + '" inputmode="decimal">' +
    '<input type="range" data-r="' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + f.value + '" aria-label="' + f.label + ' slider"></div></div>';
}

// Reads the current input values, keeping each inside its allowed range.
function readCalcValues(calc, panel) {
  const v = {};
  calc.fields.forEach(function (f) {
    const el = panel.querySelector('[data-f="' + f.id + '"]');
    let x = parseFloat(el.value);
    if (isNaN(x)) x = f.type === "select" ? f.value : (f.min || 0);
    if (f.type !== "select") x = Math.min(f.max, Math.max(f.min, x));
    v[f.id] = x;
  });
  return v;
}

// Recalculates and redraws the result area of the open calculator.
function updateCalc(calc, panel) {
  const res = calc.compute(readCalcValues(calc, panel));
  let html = '<div class="calc-label">' + res.label + '</div><div class="result-big">' + res.big + "</div>";
  if (res.rows.length) {
    html += '<div class="calc-rows">' + res.rows.map(function (r) {
      return "<div><span>" + r[0] + "</span><b>" + r[1] + "</b></div>";
    }).join("") + "</div>";
  }
  if (res.note) html += '<p class="note">' + res.note + "</p>";
  if (res.chart) html += res.chart;
  html += '<p class="calc-maths">🧠 ' + calc.maths + "</p>";
  panel.querySelector(".calc-result").innerHTML = html;
}

// Opens one calculator in the panel and wires its inputs to the live result.
function showCalc(id) {
  const calc = CALCS.filter(function (c) { return c.id === id; })[0];
  const panel = document.getElementById("calc-panel");
  panel.innerHTML = '<div class="calc-grid"><div class="glass calc-form"><h2>' + calc.emoji + " " + calc.title + "</h2>" +
    calc.fields.map(function (f) { return fieldHtml(calc.id, f); }).join("") +
    '</div><div class="glass calc-result" aria-live="polite"></div></div>';
  panel.addEventListener("input", function handler(e) {
    if (!panel.contains(e.target)) return;
    const num = e.target.getAttribute("data-f"), rng = e.target.getAttribute("data-r");
    if (rng) panel.querySelector('[data-f="' + rng + '"]').value = e.target.value;
    if (num && e.target.type === "number") {
      const slider = panel.querySelector('[data-r="' + num + '"]');
      if (slider) slider.value = e.target.value;
    }
    updateCalc(calc, panel);
  });
  document.querySelectorAll("#calc-tabs .filter-chip").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-id") === id);
  });
  updateCalc(calc, panel);
}

// Draws the calculator tabs and opens the first calculator.
function setupCalculators() {
  const tabs = document.getElementById("calc-tabs");
  if (!tabs) return;
  tabs.innerHTML = CALCS.map(function (c) {
    return '<button type="button" class="filter-chip" data-id="' + c.id + '">' + c.emoji + " " + c.title + "</button>";
  }).join("");
  tabs.addEventListener("click", function (e) {
    const b = e.target.closest(".filter-chip");
    if (!b) return;
    // Replace the panel so old input listeners are dropped.
    const old = document.getElementById("calc-panel");
    const fresh = old.cloneNode(false);
    old.parentNode.replaceChild(fresh, old);
    showCalc(b.getAttribute("data-id"));
  });
  showCalc(CALCS[0].id);
}

document.addEventListener("DOMContentLoaded", setupCalculators);
