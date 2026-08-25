# Bengaluru vs Chennai Metro — Head-to-Head Progress Tracker

A local-only, single-page site that pits **Namma Metro (BMRCL, Bengaluru)** against **Chennai Metro
(CMRL)** and scores them against the deadlines and budgets they were originally given.

**Current score: Bengaluru 5 – 3 Chennai** across eight rounds. The split is the interesting part:
Bengaluru wins every round about *scale and delivery*, Chennai wins every round about *discipline*
(delays, cost overruns). Neither city is actually winning — between them they are **~34 years late**
and **₹31,200 crore over budget** on just the phases where a revised cost has been published.

Every figure carries a source URL and a scrape timestamp. Nothing is estimated or invented: a value
that could not be confidently sourced is stored as `unavailable` and shown as **"Not yet announced"**,
never as `0` or a blank cell.

## The scoring

Eight rounds, one point each, half each for a genuine tie. Each metric declares in the data whether
higher or lower wins, so the comparison direction is never something the UI guesses.

| Round | Direction | Bengaluru | Chennai | Winner |
|---|---|---|---|---|
| Network in service | more | 96.1 km | 54.1 km | BLR |
| Stations in service | more | 83 | 41 | BLR |
| Opened in last 24 months | more | 22.3 km | 0.0 km | BLR |
| Sanctioned network delivered | more | 37.6% | 31.3% | BLR |
| Average delay per late corridor | less | 48 mo | 28 mo | MAA |
| Worst single delay | less | 72 mo | 38 mo | MAA |
| Cost per kilometre | less | ₹392 cr | ₹525 cr | BLR |
| Cost overrun | less | 28.2% | 11.2% | MAA |

The delivery round uses a 24-month window. Twelve months was zero for both cities, which reads as
missing data rather than as the indictment it is; a single 24-month round also avoids double-counting
the same opening across two rounds. Average delay is scored rather than total delay, because the
total would simply penalise whichever city happens to have more corridors. Cost per km is explicitly flagged on the site as *not*
like-for-like — underground corridors cost far more, and Chennai has proportionally more of them.

---

## Quick start

Requires **Node.js 22.5+** (the backend uses the built-in `node:sqlite` module, so there is no native
build step).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env
npm run migrate     # create the SQLite schema
npm run seed        # load the curated baseline
npm run scrape      # first scrape pass (~10s)
npm start           # API on http://localhost:4000

# 2. Frontend (in a second terminal)
cd web
npm install
npm run dev         # UI on http://localhost:5173
```

Vite proxies `/api` to port 4000, so open **http://localhost:5173** and everything works.

---

## How the data is put together

The riskiest part of this project is that official metro sites are messy and change often, so the
data model separates two different things:

1. **Curated baseline** (`server/src/seed/seed.json` and `server/src/seed/costs.json`) — hand-verified
   original deadlines, planned lengths, station counts and sanctioned costs. Every entry has a
   `source_url` and a `source_note` explaining exactly what the figure is based on.
   **Scrapers never overwrite this.**
2. **Scraped snapshots** — scrapers run on a schedule and *append* a timestamped snapshot. Nothing is
   overwritten, so the history and the rolling 12-month windows are real recorded data.

Scraped values are then **cross-checked against the baseline**. A disagreement greater than 5% is
downgraded to `low` confidence and annotated `needs review`, and shows up in the Sources section
rather than being silently trusted.

**Delay** = current expected date (or the actual opening) measured against the *first* announced
target — never a later, quietly revised one. If either end is unknown, no delay is shown.

**Cost** is sanctioned per *phase*, not per line, so it is modelled at phase level. Splitting a phase
cost across its corridors would mean inventing an allocation. Overrun is only claimed where a revised
figure has actually been published; the other phases sit at their sanctioned cost and are excluded
from the overrun total, which means the real overrun is almost certainly larger than what is shown.
Costs are nominal rupees and are not inflation-adjusted.

### Cost data

| Phase | Sanctioned | Current | Overrun |
|---|---|---|---|
| BLR Phase 1 | ₹6,395 cr (2006) | ₹14,405 cr (final) | **+125%** |
| BLR Phase 2 | ₹26,405 cr (2014) | ₹40,425 cr (2025) | **+53%** |
| BLR Phase 2A & 2B | ₹14,788 cr (2021) | — | not published |
| BLR Phase 3 | ₹15,611 cr (2024) | — | not published |
| BLR Phase 3A | ₹15,000 cr (2022, estimate) | — | not published |
| MAA Phase 1 | ₹14,600 cr (2009) | ₹23,770 cr | **+63%** |
| MAA Phase 1 Extension | ₹3,770 cr | — | published as final |
| MAA Phase 2 | ₹63,246 cr (2024) | — | not published |

> Note: English Wikipedia states Chennai Phase 2 cost "₹63.25 billion", which is a units error. The
> sanctioned figure is **₹63,246 crore** per the PIB release of 3 October 2024.

### Source notes (verified while building)

| Source | Status | Used for |
|---|---|---|
| `www.bmrc.co.in` | ✅ live | BMRCL notices. **`bmrcl.co.in` does not resolve** — the live domain is `www.bmrc.co.in`. Its news list is JS-rendered, so few items parse; this is reported honestly rather than shown as "no news". |
| `chennaimetrorail.org/press-release/` | ✅ live | CMRL press releases, parsed from a clean dated table (~1100 items). |
| Wikipedia `action=parse` API | ✅ live | Structured line tables and network totals. Treated as a **secondary** source and cross-checked. |
| Google News RSS | ✅ live | Headlines only. **No figures are extracted from news prose.** |

Wikipedia's line tables use colspan-heavy headers and inconsistent column order, so the scraper
identifies a row by its *line name*, finds the distance cell, and reads the station count from the
adjacent cell. A row must yield **both** a distance and a station count to be trusted — that single
rule is what excludes the "proposed future extensions" tables, whose rows pair a distance with an
estimated cost.

---

## API

Base URL `http://localhost:4000/api`.

| Endpoint | Description |
|---|---|
| `GET /overview?months=36` | **Everything the single-page site needs in one request** — metros, lines, phases, the head-to-head duel scoring, delays, timeline, sources and combined totals. Used so the page renders one coherent snapshot instead of stitching six endpoints that could disagree. |
| `GET /health` | Liveness, last-updated timestamp, last scrape run. |
| `GET /metros` | Both metros with summary rollups (operational km/stations, total and worst delay, cost summary, 12-month window). |
| `GET /metros/:code/lines` | All corridors for one metro (`BLR` or `MAA`) with baseline, delay and scraped metrics. |
| `GET /phases` | Phase-level cost data with derived cost/km and overrun. |
| `GET /compare` | Both metros with their full line lists. |
| `GET /delays` | Original target vs actual/expected per corridor, sorted worst first. |
| `GET /timeline?months=12` | Monthly and cumulative km/stations opened, plus rolling-window totals. |
| `GET /news?metro=BLR&limit=20` | Matched headlines with their delay keywords. |
| `GET /sources` | Every source with last-scrape status, plus figures flagged for review and baseline gaps. |
| `POST /refresh` | Trigger a scrape. Requires header `x-admin-token: <ADMIN_TOKEN>`. |

```bash
curl -X POST -H "x-admin-token: change-me" localhost:4000/api/refresh
```

---

## Configuration (`server/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | API port. |
| `DB_PATH` | `./data/metro.db` | SQLite file location. |
| `SCRAPE_CRON` | `15 3 * * *` | Cron expression for the scheduled scrape. |
| `SCRAPE_ON_BOOT` | `false` | Run a scrape immediately on server start. |
| `ADMIN_TOKEN` | `change-me` | Token required by `POST /api/refresh`. |
| `HTTP_TIMEOUT_MS` | `25000` | Outbound request timeout. |
| `HTTP_USER_AGENT` | descriptive UA | Sent with every scrape request. |

---

## The page

One continuous scrolling narrative with a sticky scroll-spy nav that keeps the live score visible,
plus a scroll-progress bar:

1. **Hero** — leads with the damage, charged against each city separately rather than as a combined
   total: Bengaluru is ₹22,030 cr over and 20.0 years late, Chennai ₹9,170 cr over and 13.8 years
   late, with a "worse" tag on whichever city loses each charge. The combined figure is demoted to a
   single line underneath. The two city cards sit side by side from `md` up, which deliberately frees
   the lower half of the screen for a large line-art metro drawn in perspective — so the cards can be
   dark enough to read comfortably while the train stays fully visible in clear space beneath them.
2. **Scorecard** — the nine rounds, each as a tug-of-war bar growing outward from a shared centre
   line, with the winning side at full opacity. Ends with a data-driven "how each city wins the next
   round" panel derived from whichever corridor is closest to flipping a result.
3. **Cost discipline** — sanctioned vs escalated cost per phase (grey bar = sanctioned, coloured
   overhang = escalation), cost per km ranked, and where the escalation actually sits.
4. **Keeping promises** — Gantt where each bar *starts* at the original deadline and *ends* at the
   actual or expected date, so the bar length is the delay. Amber = opened late, red = still
   overrunning. Below it, every corridor with its delay and the reason.
5. **Getting things open** — km and stations opened per month plus cumulative totals, switchable
   across 12 months / 3 years / 10 years.
6. **Corridors** — every corridor across all tracked fields, with per-cell source attribution and
   scraped cross-checks shown only when they disagree.
7. **Sources** — the rules the site follows, every source with last-scrape status, all figures
   flagged for review, and all baseline gaps.

The backdrop is a single large perspective metro (`MetroPerspective`), drawn as line art converging
on a vanishing point with converging rails and sleepers. Smaller trains were moved off the backdrop —
where they were barely visible — and onto the metrics themselves: `TrackRunner` traces a rail around
each city card and score card, and across each round of the scorecard, with a short animated dash
running the route.

Animations are hand-rolled (`IntersectionObserver` reveals, `requestAnimationFrame` counters, CSS
keyframes) rather than pulling in an animation library, and everything is disabled under
`prefers-reduced-motion`.

---

## Project layout

```
server/
  src/
    db/         schema.sql, migrate.js, index.js (node:sqlite wrapper)
    seed/       seed.json (corridors), costs.json (phase costs), seed.js
    scrapers/   wikipedia.js, official.js, news.js, runner.js
    lib/        http.js, parse.js (confidence-scored parsers), query.js (incl. duel scoring)
    routes/     index.js
    app.js  cron.js  index.js
web/
  src/
    sections/   Hero (VS face-off), Duel (scorecard), Cost, Delays, Timeline, Corridors, Sources
    components/ ui.jsx (Reveal, Counter, GrowBar, Card...), Nav.jsx,
                MetroPerspective.jsx (hero backdrop), TrackRunner.jsx (rails on the metrics)
    lib/        api.js, format.js, hooks.js (useInView, useCountUp, useScrollSpy)
```

### Schema

`metros` · `phases` (cost) · `lines` · `line_baseline` (curated, immutable) · `scrape_runs` ·
`snapshots` (append-only) · `line_metrics` (long format with a `confidence` column) ·
`station_events` (powers rolling windows) · `news_items`.

Metrics are stored in long format specifically so that an unparsed figure can be recorded *as*
unavailable, with the raw text kept for review, instead of being coerced to a number.

---

## Notes and limitations

- Scope is **phase/corridor level**. Station-by-station granularity is a stretch goal.
- Some per-line figures genuinely are not published — for example Chennai's Phase 1 station split
  between the Blue and Green lines. Those are left unrecorded and listed under "Baseline gaps".
- Where a headline network total disagrees with the sum of its lines (Bengaluru: 83 vs 85), the app
  shows the network total and explains the difference rather than hiding it — interchange stations
  are counted once in the network figure.
- **Cost figures are nominal and not inflation-adjusted**, so part of every escalation reflects
  general price rises rather than mismanagement alone. Cost per km is also not like-for-like:
  underground corridors are far more expensive, which is most of why Chennai's Phase 1 (25 km of
  45.1 km underground) sits so much higher than Bengaluru's largely elevated Phase 1.
- Original deadlines for several corridors come from news reporting rather than DPR documents. They
  are cited, but they are secondary sources — `seed.json` is the one file to edit to improve this.
- Scrapers are polite: a descriptive user agent, timeouts, sequential requests, one retry, daily by
  default.
- This is an independent research project, not affiliated with BMRCL or CMRL, and uses no official
  logos or branding.
- Local-only by design — there is no remote git repository.
