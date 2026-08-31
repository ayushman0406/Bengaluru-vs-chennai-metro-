import { CITIES, COMBINED, PHASES } from '../data/overview.js';
import { Reveal, SectionHeader } from '../components/ui.jsx';

export default function Cost() {
  const ranked = [...PHASES].sort((a, b) => b.costPerKm - a.costPerKm);
  const maxCurrent = Math.max(...PHASES.map((p) => p.currentCr));
  const escalations = PHASES.filter((p) => p.overrunPct !== null);

  return (
    <section id="cost" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="Round: cost discipline"
        title="Who wastes less money"
        lede="Costs are sanctioned per phase, not per line, so they are shown that way rather than being split across corridors — inventing a per-line allocation would be making numbers up. The grey bar is the sanctioned figure; the coloured overhang is the escalation on top of it."
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
        <div className="hairline px-5 py-5">
          <p className="kicker">Sanctioned, all phases</p>
          <p className="font-fig mt-2 text-2xl text-white">₹{COMBINED.sanctionedCrLakh} lakh cr</p>
        </div>
        <div className="hairline px-5 py-5">
          <p className="kicker">Current approved cost</p>
          <p className="font-fig mt-2 text-2xl text-white">₹{COMBINED.currentCrLakh} lakh cr</p>
        </div>
        <div className="hairline px-5 py-5">
          <p className="kicker">Escalation so far</p>
          <p className="font-fig mt-2 text-2xl text-[var(--over)]">
            +₹{COMBINED.overrunCr.toLocaleString('en-IN')} cr
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-5xl">
        <h3 className="text-sm font-semibold text-white">Cost escalation by phase</h3>
        <p className="mt-1 text-sm text-slate-500">
          5 of 8 phases are still under construction, so their final cost is not yet known.
        </p>
        <div className="mt-6 space-y-6">
          {PHASES.map((p, i) => {
            const color = p.metro === 'BLR' ? CITIES.BLR.fill : CITIES.MAA.fill;
            const sancW = (p.sanctionedCr / maxCurrent) * 100;
            const overW = ((p.currentCr - p.sanctionedCr) / maxCurrent) * 100;
            return (
              <Reveal key={p.id} delay={i * 30}>
                <div>
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{p.metro}</span> {p.name}
                      <span className="ml-2 text-xs text-slate-500">{p.km} km</span>
                    </p>
                    <p className="font-fig text-sm text-white">
                      ₹{p.currentCr.toLocaleString('en-IN')} cr
                      {p.overrunPct != null && (
                        <span className="ml-2 text-[var(--over)]">+{p.overrunPct}%</span>
                      )}
                    </p>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-sm bg-slate-800/70">
                    <div className="h-full bg-slate-500/70" style={{ width: `${sancW}%` }} title={`Sanctioned ₹${p.sanctionedCr.toLocaleString('en-IN')} cr in ${p.sanctionedYear}`} />
                    {overW > 0 && (
                      <div
                        className="h-full"
                        style={{ width: `${overW}%`, background: color }}
                        title={`Escalation ₹${(p.currentCr - p.sanctionedCr).toLocaleString('en-IN')} cr`}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.note}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Grey = sanctioned. Colour = published escalation. Phases without a revised figure show grey only.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Cost per kilometre</h3>
          <p className="mt-1 text-sm text-slate-500">
            Current approved cost divided by sanctioned route length. Underground corridors cost far
            more per km, which is most of why Chennai’s Phase 1 sits so high.
          </p>
          <ol className="mt-5 space-y-2">
            {ranked.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="text-slate-500">{p.metro}</span> {p.name}
                </span>
                <span className="font-fig text-white">₹{p.costPerKm} cr/km</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Where the escalation actually is</h3>
          <ul className="mt-5 space-y-4">
            {escalations.map((p) => (
              <li key={p.id}>
                <p className="text-sm text-white">
                  {p.metro} {p.name}
                  <span className="ml-2 font-fig text-[var(--over)]">+{p.overrunPct}%</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  ₹{p.sanctionedCr.toLocaleString('en-IN')} cr in {p.sanctionedYear} → ₹
                  {p.currentCr.toLocaleString('en-IN')} cr by {p.currentYear}
                  {p.stillRising && <span className="text-[var(--over)]"> · still rising</span>}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            The other 5 phases have no published revised figure. Rather than estimate one, they are
            shown at their sanctioned cost and excluded from the overrun total.
          </p>
        </div>
      </div>
    </section>
  );
}
