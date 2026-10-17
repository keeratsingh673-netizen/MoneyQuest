# MoneyQuest

**Learn money the Indian way.** MoneyQuest is a free website that teaches young Indians (16-25) how money works: play life from age 18 to 25, read short lessons, practise net banking safely, and learn to spot scams before they cost real money.

> For learning only, not financial advice. All companies, people and amounts are fictional.

Built for **HackSprint 2026**, Fintech theme.

## Why we made this

Young Indians start using UPI, debit cards and loans before anyone teaches them what a scam looks like, and digital payment fraud keeps rising. MoneyQuest lets them make those mistakes first, safely and for free.

## What's inside

| Page | What you can do |
|---|---|
| **Home** (`index.html`) | Start here: links to every part of the site |
| **Learn** (`learn.html`) | 27 lessons across 9 modules, each with a worked rupee example, an Indian example, common mistakes and a 4-question quiz; progress is saved |
| **Game** (`game.html`) | A life simulation from age 18 to 25. Choose Quick or Full life, make money decisions across 5 difficulty levels (Easy to Extreme), face random events and a "Scam or Real?" round, and get a Report Card with your grade, net worth and credit score |
| **Tools** (`tools.html`) | 8 calculators (compound interest, SIP, EMI, goal planner, FD, inflation, simple vs compound, 50/30/20 budget) and a **Trading Lab** with 8 made-up companies, charts, news, fake "hot tips" and badges |
| **Practice Bank** (`bank.html`) | A pretend net-banking app: mock KYC, UPI/NEFT/IMPS transfers with payee checks and PINs, cards, FD/RD/SIP, loans, bills and fake-message training |
| **Glossary** (`glossary.html`) | 130+ money terms, each with a simple meaning and an Indian example; key words across the site open a pop-up definition |

### The 9 modules

1. Money Basics: needs vs wants, the 50/30/20 rule, emergency fund
2. Prices and Currency: inflation, buying power, exchange rates
3. Banking: how banks work, deposit insurance, KYC, safe account use
4. Scams and Safe Banking: UPI and OTP scams, phishing, what to do if scammed (1930, cybercrime.gov.in)
5. Compounding: simple vs compound interest, Rule of 72, starting early
6. Safe Savings: FD, RD, PPF, risk vs return
7. Borrowing and Credit: EMI, credit cards, CIBIL score
8. Stocks: shares, NSE/BSE, Sensex and Nifty, why not to chase tips
9. SIPs and First Investment: mutual funds, NAV, SIP, index funds

Facts in the lessons were checked against official sources such as RBI, SEBI, NPCI and DICGC.

## How to run

No install, build step, server or internet is needed.

- **Easiest:** download or clone this repo and double-click `index.html`.
- **Or with a local server:** run `python -m http.server 5000` in this folder, then open http://localhost:5000.

Progress (lessons, bank, Trading Lab) is saved in your own browser. Each page has a Reset option where needed.

## How it's built

- Plain **HTML, CSS and JavaScript**: no frameworks, libraries, backend or API keys, so it runs anywhere, even offline.
- All charts are drawn by hand with SVG and canvas.
- **Design:** for the hackathon's design challenge ("deliberately avoid conventional symmetrical layout"), desktop pages use asymmetric balance: an off-centre hero, uneven card grids, staggered buttons and overlapping glass panels. On phones the layout stacks into a single column for readability.

### Files

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `game.html`, `game.js` | The game engine: state, choices, months passing, Report Card |
| `turns.js` | The game's situations, grouped by age and difficulty |
| `events.js` | Random life events and the "Scam or Real?" round |
| `learn.html`, `learn.js`, `lessons.js` | Lesson pages, quizzes and the 27 lessons |
| `glossary.html`, `glossary.js` | Glossary page and the pop-up definitions used across the site |
| `tools.html`, `calculators.js`, `trading.js` | Calculators and the Trading Lab |
| `bank.html`, `bank-core.js`, `bank-screens.js`, `bank.css` | The Practice Bank |
| `fx.js` | Navigation, background animation and visual effects |
| `style.css` | Shared styles |

## Built with AI

We designed MoneyQuest (the idea, game design, lessons plan and research) and used Claude (AI) to help write the code.

## Future scope

- More modules (tax basics, insurance, first-job salary)
- Hindi and other Indian language support
- A deeper Trading Lab (more order types and risk lessons)
- A school or teacher mode with class progress, to pilot in schools
