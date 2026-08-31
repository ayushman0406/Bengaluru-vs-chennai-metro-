---
name: metro-editorial-ui
description: >
  Editorial design system for the Bengaluru vs Chennai Metro tracker.
  Use when changing UI, layout, Tailwind, typography, charts, cards, nav, restyling,
  or when asked to make the site look more professional. Slash command: /metro-editorial-ui.
---

# Metro editorial UI

Quiet dark data journalism. Type and numbers do the work. Decoration appears in the hero once.

## Tokens

Owned here. Do not invent a second palette.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#070A12` | Page |
| `--panel` | `#0E1420` | Cards / wells |
| `--line` | `rgba(148,163,184,0.16)` | Hairline borders |
| `--blr` / `--blr-fill` | `#7C5CFC` / `#6D28D9` | Bengaluru |
| `--maa` / `--maa-fill` | `#3B82F6` / `#2563EB` | Chennai |
| `--late` | `#FB7185` | Delay / worse |
| `--over` | `#FBBF24` | Cost overrun only |
| `--ok` | `#34D399` | Leading — rare |
| `--muted` | `#94A3B8` | Secondary text (must stay 4.5:1 on `--ink`) |

Type: **Newsreader** for `h1`/`h2`, **Inter** for UI, **IBM Plex Mono** for figures (`font-fig`). Radius 12px cards, 999px pills. Section padding ~96px desktop / 64px mobile. Narrative `max-w-5xl`, tables `max-w-7xl`.

## Components

- `SectionHeader`: kicker + display `h2` + one-line lede.
- `Stat` / city strips: hairline + fill. No backdrop-blur except the sticky nav.
- `DuelBar`: bars grow from a centre line. Winner opacity 1, loser ~0.4.
- Charts: city colour = who. Hatch or end-cap = still overrunning. Custom tooltip (`ChartTooltip`), `--line` grid, no default Recharts chrome.
- Source disagreements: a small marker that opens a note. Do not print "scrape: … needs review" as a second line in every cell.

## Motion

`prefers-reduced-motion` is the master switch. Allowed: one-shot reveal and one-shot bar grow. Scores must be the real number in the DOM on first paint — never count up from 0 without a static fallback.

TrackRunner / looping dashes: at most one instance (nav rail). Never on every card.

## Do not

- Official BMRCL/CMRL logos
- Extra typefaces beyond the three above
- Invent missing figures as `0`
- Put live scores or labelled charts into generated images (`imagine` is atmosphere-only)
- Invoke game-asset / game-UI skills
- A third fill colour "for highlight" on charts

## Verify

Desktop and ~390px mobile. Keyboard through the nav (`:focus-visible`). First paint of 5–3. Reduced motion. `--muted` contrast.
