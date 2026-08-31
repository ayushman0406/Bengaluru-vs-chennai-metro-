import { CITIES, COMBINED, SCORE, UPDATED_LABEL } from '../data/overview.js';
import MetroPerspective from '../components/MetroPerspective.jsx';

function CityStrip({ city }) {
  return (
    <article className="hairline bg-[var(--panel)] px-5 py-4 sm:py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="h-8 w-1 rounded-full"
            style={{ background: city.color }}
            aria-hidden="true"
          />
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">{city.name}</h2>
            <p className="text-xs text-slate-500">
              {city.system} · {city.agency}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--late)] ring-1 ring-inset ring-[var(--late)]/25">
          {city.lateCorridors}/{city.totalCorridors}{' '}
          <span className="hidden sm:inline">corridors </span>late
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="font-fig text-3xl leading-none text-[var(--over)] sm:text-4xl">
            <span className="text-xl text-[var(--over)]/80">₹</span>
            {city.overrunCr.toLocaleString('en-IN')}
          </p>
          <p className="mt-1.5 text-sm font-medium text-white">crore over budget</p>
          <p className="mt-1 text-xs text-slate-500">
            {city.overrunPct}% above sanction
            {city.worse.overrun && (
              <span className="ml-1.5 rounded bg-[var(--late)]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--late)]">
                worse
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="font-fig text-3xl leading-none text-[var(--late)] sm:text-4xl">
            {city.yearsLate.toFixed(1)}
          </p>
          <p className="mt-1.5 text-sm font-medium text-white">years behind schedule</p>
          <p className="mt-1 text-xs text-slate-500">
            {city.delayMonths} months across its corridors
            {city.worse.delay && (
              <span className="ml-1.5 rounded bg-[var(--late)]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--late)]">
                worse
              </span>
            )}
          </p>
        </div>
      </div>
      <p className="mt-5 text-xs text-slate-500">
        {city.openKm} km of {city.sanctionedKm} km sanctioned is actually open · ₹{city.costPerKm} cr
        per km
      </p>
    </article>
  );
}

export default function Hero() {
  return (
    <header id="top" className="relative min-h-[100svh] overflow-hidden pt-24 pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] min-h-[220px] md:h-[46vh]"
      >
        <MetroPerspective />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3.5 py-1.5 text-xs text-rose-200/90">
          Public money, public deadlines, public record
        </p>
        <h1 className="font-display max-w-4xl text-4xl leading-[1.15] text-white sm:text-5xl md:text-[3.25rem] md:leading-[1.12]">
          Neither city is winning.{' '}
          <span className="text-slate-300">
            {COMBINED.yearsLate} years late. ₹{COMBINED.overrunCr.toLocaleString('en-IN')} crore over
            budget.
          </span>
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CityStrip city={CITIES.BLR} />
          <CityStrip city={CITIES.MAA} />
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <span>
            Score{' '}
            <strong className="font-fig text-white">
              <span style={{ color: 'var(--blr)' }}>{SCORE.blr}</span>
              {' – '}
              <span style={{ color: 'var(--maa)' }}>{SCORE.maa}</span>
            </strong>
            <span className="ml-2 text-slate-500">Bengaluru leading</span>
          </span>
          <span className="text-slate-600">·</span>
          <span>Data last updated {UPDATED_LABEL}</span>
        </p>
        <div className="h-[30vh] min-h-[160px] md:h-[40vh]" aria-hidden="true" />
      </div>
    </header>
  );
}
