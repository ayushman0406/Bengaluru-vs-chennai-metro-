import { useState } from 'react';
import { CITIES, CORRIDORS } from '../data/overview.js';
import { LineDot, SectionHeader } from '../components/ui.jsx';
import { fig, monthLabel } from '../lib/format.js';

function SourceDot({ items, note }) {
  const [open, setOpen] = useState(false);
  const flags = items || [];
  if (!flags.length && !note) return null;
  const n = flags.filter((f) => f.status === 'review').length;
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-[var(--over)] ring-1 ring-inset ring-[var(--over)]/40"
        aria-expanded={open}
        aria-label={n ? `${n} scrape disagreements` : 'Source note'}
        onClick={() => setOpen((v) => !v)}
      >
        {n || 'i'}
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-20 w-72 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-3 text-xs leading-relaxed text-slate-300 shadow-xl">
          {flags.map((f) => (
            <p key={f.field} className="mb-1">
              scrape {f.field}: {f.value ?? 'unavailable'} — {f.note}
            </p>
          ))}
          {note && <p className="text-slate-500">{note}</p>}
        </div>
      )}
    </span>
  );
}

function Cell({ children, scrape, note }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">
      <span className="inline-flex items-center">
        {children}
        {scrape && <SourceDot items={scrape} note={note} />}
      </span>
    </td>
  );
}

function Table({ metro, rows }) {
  const city = CITIES[metro];
  const late = rows.filter((r) => r.delayMonths != null).length;
  return (
    <div className="mt-10">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-semibold text-white">{city.system}</h3>
        <p className="text-xs text-slate-500">
          {rows.length} corridors · {late} late
        </p>
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--line)] md:block">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 bg-[var(--panel)] text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {['Line / corridor', 'Phase', 'Status', 'Planned km', 'Stations', 'Original', 'Expected', 'Opened', 'Delay'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] bg-[var(--ink)]">
            {rows.map((c) => (
              <tr key={c.id} className="align-top">
                <th className="sticky left-0 bg-[var(--ink)] px-4 py-3 text-sm font-medium text-white">
                  <span className="flex items-center gap-2">
                    <LineDot name={c.name} />
                    <span>
                      {c.name}
                      <span className="block text-xs font-normal text-slate-500">{c.terminals}</span>
                    </span>
                  </span>
                </th>
                <td className="px-4 py-3 text-sm text-slate-400">{c.phase}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{c.status}</td>
                <Cell scrape={c.scrape?.filter((s) => s.field === 'km')} note={c.note}>
                  {c.plannedKm != null ? `${c.plannedKm} km` : fig(null)}
                </Cell>
                <Cell scrape={c.scrape?.filter((s) => s.field === 'stations')}>
                  {fig(c.plannedStations)}
                </Cell>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{monthLabel(c.original)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{monthLabel(c.expected)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">{monthLabel(c.opened)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {c.delayLabel ? (
                    <span className="font-semibold text-[var(--late)]">{c.delayLabel}</span>
                  ) : (
                    <span className="italic text-slate-500">{fig(null)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((c) => (
          <article key={c.id} className="hairline px-4 py-4">
            <div className="flex items-center gap-2">
              <LineDot name={c.name} />
              <p className="font-medium text-white">{c.name}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">{c.terminals}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Status</dt>
                <dd>{c.status}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Planned</dt>
                <dd className="font-fig">{c.plannedKm != null ? `${c.plannedKm} km` : fig(null)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Opened</dt>
                <dd>{monthLabel(c.opened)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Delay</dt>
                <dd className={c.delayLabel ? 'text-[var(--late)]' : 'italic text-slate-500'}>
                  {c.delayLabel || fig(null)}
                </dd>
              </div>
            </dl>
            {c.scrape?.length ? <SourceDot items={c.scrape} note={c.note} /> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Corridors() {
  const blr = CORRIDORS.filter((c) => c.metro === 'BLR');
  const maa = CORRIDORS.filter((c) => c.metro === 'MAA');
  return (
    <section id="corridors" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="The full record"
        title="Every corridor on both sides"
        lede="Planned figures come from the curated baseline. Where the live scrape disagrees with it, a small marker opens the discrepancy — the baseline is never quietly overridden."
      />
      <div className="mx-auto max-w-7xl">
        <Table metro="BLR" rows={blr} />
        <Table metro="MAA" rows={maa} />
      </div>
    </section>
  );
}
