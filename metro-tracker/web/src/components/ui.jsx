import { LINE_COLORS } from '../data/overview.js';
import { useInView } from '../lib/hooks.js';

export function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ kicker, title, lede }) {
  return (
    <header className="mx-auto max-w-5xl">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 className="font-display mt-3 text-3xl text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">
        {title}
      </h2>
      {lede && <p className="lede mt-4">{lede}</p>}
    </header>
  );
}

export function Stat({ value, unit, label, tone = 'white', worse = false }) {
  const color =
    tone === 'over' ? 'text-[var(--over)]' : tone === 'late' ? 'text-[var(--late)]' : 'text-white';
  return (
    <div>
      <p className={`font-fig text-3xl leading-none tracking-tight sm:text-4xl ${color}`}>
        {value}
        {unit && <span className="ml-1 text-lg text-slate-400">{unit}</span>}
      </p>
      <p className="mt-1.5 text-sm font-medium text-white">{label}</p>
      {worse && (
        <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--late)] ring-1 ring-inset ring-[var(--late)]/30">
          worse
        </span>
      )}
    </div>
  );
}

export function LineDot({ name }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: LINE_COLORS[name] || '#94a3b8' }}
      aria-hidden="true"
    />
  );
}

export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--ink)] px-3 py-2 text-xs shadow-xl">
      {label && <p className="mb-1 text-slate-400">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} className="font-fig text-white">
          <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: {formatter ? formatter(p.value, p) : p.value}
        </p>
      ))}
    </div>
  );
}
