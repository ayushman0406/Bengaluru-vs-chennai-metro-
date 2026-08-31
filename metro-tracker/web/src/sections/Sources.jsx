import { CITIES, CORRIDORS, GAPS, HEADLINES, RULES, SOURCES } from '../data/overview.js';
import { SectionHeader } from '../components/ui.jsx';

export default function Sources() {
  const flags = CORRIDORS.flatMap((c) =>
    (c.scrape || []).map((s) => ({
      metro: c.metro,
      name: c.name,
      phase: c.phase,
      ...s,
    })),
  );

  return (
    <section id="sources" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="Show your working"
        title="Where all of this comes from"
        lede="This site is critical of these projects, so it has to be checkable. Every source, every figure that could not be resolved, and every gap in the baseline is listed here rather than quietly smoothed over."
      />
      <div className="mx-auto mt-12 max-w-5xl">
        <h3 className="text-sm font-semibold text-white">The rules this site follows</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-slate-300">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>

        <h3 className="mt-14 text-sm font-semibold text-white">Sources scraped</h3>
        <dl className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {SOURCES.map((s) => (
            <div key={s.id} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr_auto]">
              <dt className="font-fig text-xs text-slate-500">
                {s.id}
                <span className="mt-1 block text-slate-600">{s.metro}</span>
              </dt>
              <dd className="text-sm text-slate-300">
                <a href={s.url} className="break-all text-slate-200 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                  {s.url}
                </a>
                <p className="mt-1 text-slate-500">{s.role}</p>
              </dd>
              <dd className="text-right text-xs text-slate-500">
                <span className="text-[var(--ok)]">{s.status}</span>
                <span className="mt-1 block">{s.detail}</span>
                <span className="block text-slate-600">{s.last}</span>
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-14 text-sm font-semibold text-white">Figures flagged for review</h3>
        <p className="mt-1 text-sm text-slate-500">Scraped values that were unavailable or disagreed with the baseline.</p>
        <ul className="mt-4 space-y-3">
          {flags.map((f) => (
            <li key={`${f.name}-${f.field}`} className="text-sm">
              <p className="text-white">
                {f.metro} · {f.name} <span className="text-slate-500">({f.phase})</span>
              </p>
              <p className="text-slate-400">
                <span className={f.status === 'review' ? 'text-[var(--over)]' : 'text-slate-500'}>{f.status}</span>
                {' · '}
                {f.field}: {f.value ?? 'unavailable'} — {f.note}
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-sm font-semibold text-white">Baseline gaps</h3>
        <p className="mt-1 text-sm text-slate-500">Fields no reliable source confirmed, so they are left unrecorded.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {GAPS.map((g) => (
            <li key={g.name}>
              <span className="text-white">
                {g.metro} · {g.name}
              </span>
              <span className="text-slate-500"> — missing: {g.missing.join(', ')}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 text-sm font-semibold text-white">Latest headlines matched</h3>
        <p className="mt-1 text-sm text-slate-500">Recency and delay signals only. No numbers are extracted from these.</p>
        <ul className="mt-4 space-y-3">
          {HEADLINES.map((h) => (
            <li key={h.title}>
              <a href={h.url} className="text-sm text-slate-200 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                {h.title}
              </a>
              <p className="text-xs text-slate-500">
                {CITIES[h.metro].code} · {h.outlet} · {h.date || 'undated'}
                {h.signal && <span className="text-[var(--late)]"> · {h.signal}</span>}
              </p>
            </li>
          ))}
        </ul>

        <footer className="mt-16 border-t border-[var(--line)] pt-8 text-xs leading-relaxed text-slate-500">
          <p>
            Independent, locally-run research project. Not affiliated with BMRCL or CMRL; no official
            logos or branding are used. Pages are fetched read-only, once a day, with a descriptive
            user agent. Cost figures are in nominal rupees and are not inflation-adjusted, so part of
            every escalation reflects general price rises rather than mismanagement alone.
          </p>
          <p className="mt-3">Built from public records · Bengaluru & Chennai metro progress tracker</p>
        </footer>
      </div>
    </section>
  );
}
