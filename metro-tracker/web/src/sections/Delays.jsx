import { CITIES, CORRIDORS } from '../data/overview.js';
import { LineDot, Reveal, SectionHeader } from '../components/ui.jsx';
import { monthLabel } from '../lib/format.js';

const TODAY = new Date('2026-08-25');

function parseYM(ym) {
  if (!ym) return null;
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1);
}

function Gantt() {
  const rows = CORRIDORS.filter((c) => c.original && (c.opened || c.expected)).map((c) => {
    const start = parseYM(c.original);
    const end = parseYM(c.opened || c.expected);
    return { ...c, start, end, running: !c.opened };
  });
  const min = new Date(Math.min(...rows.map((r) => r.start)));
  const max = new Date(Math.max(TODAY, ...rows.map((r) => r.end)));
  const span = max - min || 1;
  const x = (d) => ((d - min) / span) * 100;
  const todayX = x(TODAY);

  const years = [];
  for (let y = min.getFullYear(); y <= max.getFullYear(); y += 1) {
    years.push({ y, left: x(new Date(y, 0, 1)) });
  }

  return (
    <div className="mt-10 overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="relative mb-2 h-6 text-[11px] text-slate-500">
          {years.map(({ y, left }) => (
            <span key={y} className="absolute" style={{ left: `${left}%` }}>
              {y}
            </span>
          ))}
        </div>
        <div className="relative space-y-2">
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-white/40"
            style={{ left: `${todayX}%` }}
            title="Today"
          />
          {rows.map((r) => {
            const left = x(r.start);
            const width = Math.max(1.2, x(r.end) - left);
            const fill = r.metro === 'BLR' ? CITIES.BLR.fill : CITIES.MAA.fill;
            return (
              <div key={r.id} className="flex items-center gap-3">
                <p className="w-36 shrink-0 truncate text-right text-xs text-slate-400">{r.name}</p>
                <div className="relative h-5 flex-1">
                  <div
                    className={`absolute top-0.5 h-4 rounded-sm ${r.running ? 'hatch' : ''}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: fill,
                      opacity: r.running ? 1 : 0.85,
                    }}
                    title={`${r.name}: ${monthLabel(r.original)} → ${monthLabel(r.opened || r.expected)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="hatch inline-block h-3 w-5 rounded-sm" style={{ backgroundColor: CITIES.BLR.fill }} />
          Still overrunning
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded-sm" style={{ backgroundColor: CITIES.BLR.fill }} />
          Opened late
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-px bg-white/50" /> Today
        </span>
        <span>Bar colour is the city. Hatch means the corridor is still being built.</span>
      </p>
    </div>
  );
}

export default function Delays() {
  const listed = [...CORRIDORS]
    .filter((c) => c.delayMonths != null)
    .sort((a, b) => b.delayMonths - a.delayMonths);

  return (
    <section id="delays" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="Round: keeping promises"
        title="Whose deadlines mean anything"
        lede="Each bar begins at the deadline the corridor was originally given and ends at the date it actually opened — or, for the ones still being built, the date it is now expected. The length of the bar is the delay."
      />
      <div className="mx-auto max-w-7xl">
        <Gantt />
        <div className="mt-10 space-y-3">
          {listed.map((c, i) => (
            <Reveal key={c.id} delay={i * 25}>
              <article className="hairline px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <LineDot name={c.name} />
                      <p className="font-semibold text-white">{c.name}</p>
                      <span className="text-xs text-slate-500">
                        {c.metro === 'BLR' ? 'Namma Metro' : 'Chennai Metro'} · {c.phase}
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-inset ring-white/10">
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      Promised {monthLabel(c.original)} · {c.opened ? 'opened' : 'now expected'}{' '}
                      {monthLabel(c.opened || c.expected)}
                    </p>
                    <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-500">{c.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-fig text-lg text-[var(--late)]">{c.delayLabel} late</p>
                    <a
                      href={c.source}
                      className="text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      source
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
