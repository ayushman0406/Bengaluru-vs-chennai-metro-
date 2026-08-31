import { CITIES, NEXT_ROUND, ROUNDS, SCORE } from '../data/overview.js';
import { Reveal, SectionHeader } from '../components/ui.jsx';
import { useInView } from '../lib/hooks.js';

function DuelBar({ round }) {
  const [ref, inView] = useInView();
  const max = Math.max(round.blr.value, round.maa.value, 0.0001);
  const blrW = (round.blr.value / max) * 100;
  const maaW = (round.maa.value / max) * 100;
  const blrWin = round.winner === 'BLR';
  const maaWin = round.winner === 'MAA';

  return (
    <div ref={ref} className="px-4 py-4 sm:px-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-white">{round.name}</p>
        <p className="text-[11px] uppercase tracking-wider text-slate-500">
          {round.direction === 'more' ? 'more is better' : 'less is better'}
          <span
            className="ml-2 font-semibold"
            style={{ color: blrWin ? 'var(--blr)' : 'var(--maa)' }}
          >
            · {blrWin ? 'Bengaluru' : 'Chennai'} takes it
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`w-24 shrink-0 text-right text-sm font-fig ${blrWin ? 'text-white' : 'text-slate-400'}`}
        >
          {round.blr.label}
        </span>
        <div className="flex h-6 flex-1 items-center">
          <div className="flex h-full flex-1 justify-end overflow-hidden rounded-l-md bg-slate-800/50">
            <div
              className={`duel-bar h-full rounded-l-md ${inView ? 'in' : ''}`}
              style={{
                width: `${blrW}%`,
                background: CITIES.BLR.fill,
                transformOrigin: 'right center',
                opacity: blrWin ? 1 : 0.4,
              }}
            />
          </div>
          <div className="h-full w-px bg-slate-600" />
          <div className="flex h-full flex-1 overflow-hidden rounded-r-md bg-slate-800/50">
            <div
              className={`duel-bar h-full rounded-r-md ${inView ? 'in' : ''}`}
              style={{
                width: `${maaW}%`,
                background: CITIES.MAA.fill,
                transformOrigin: 'left center',
                opacity: maaWin ? 1 : 0.4,
              }}
            />
          </div>
        </div>
        <span
          className={`w-24 shrink-0 text-sm font-fig ${maaWin ? 'text-white' : 'text-slate-400'}`}
        >
          {round.maa.label}
        </span>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-slate-500">{round.note}</p>
    </div>
  );
}

export default function Duel() {
  return (
    <section id="duel" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="Round by round"
        title="The scorecard"
        lede="Eight rounds, each decided by a published figure. One point per round, half each if it is a genuine tie. Win a round by building more, building faster, or losing less money — there is no other way to move these numbers."
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
        <div className="hairline px-5 py-6 text-center">
          <p className="kicker">Bengaluru</p>
          <p className="font-fig mt-1 text-5xl" style={{ color: 'var(--blr)' }}>
            {SCORE.blr}
          </p>
          <p className="mt-1 text-xs text-[var(--ok)]">leading</p>
        </div>
        <div className="hairline flex flex-col items-center justify-center px-5 py-6 text-center">
          <p className="kicker">Rounds drawn</p>
          <p className="font-fig mt-1 text-3xl text-slate-300">{SCORE.draws}</p>
          <p className="mt-1 text-xs text-slate-500">of {SCORE.rounds} scored</p>
        </div>
        <div className="hairline px-5 py-6 text-center">
          <p className="kicker">Chennai</p>
          <p className="font-fig mt-1 text-5xl" style={{ color: 'var(--maa)' }}>
            {SCORE.maa}
          </p>
          <p className="mt-1 text-xs text-slate-500">trailing</p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl divide-y divide-[var(--line)] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)]">
        {ROUNDS.map((r, i) => (
          <Reveal key={r.id} delay={i * 40}>
            <DuelBar round={r} />
          </Reveal>
        ))}
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-2">
        {['BLR', 'MAA'].map((code) => (
          <div key={code}>
            <h3 className="text-sm font-semibold text-white">
              How {code === 'BLR' ? 'Bengaluru' : 'Chennai'} wins the next round
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
              {NEXT_ROUND[code].map((t) => (
                <li key={t} className="pl-4" style={{ borderLeft: `2px solid ${code === 'BLR' ? 'var(--blr)' : 'var(--maa)'}` }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
