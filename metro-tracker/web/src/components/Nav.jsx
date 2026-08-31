import { SCORE, UPDATED_LABEL } from '../data/overview.js';
import { useScrollProgress } from '../lib/hooks.js';

const LINKS = [
  { id: 'duel', label: 'Scorecard' },
  { id: 'cost', label: 'Cost' },
  { id: 'delays', label: 'Delays' },
  { id: 'timeline', label: 'Opened' },
  { id: 'corridors', label: 'Corridors' },
  { id: 'sources', label: 'Sources' },
];

export default function Nav() {
  const { progress, active } = useScrollProgress();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--ink)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
            <path d="M1 16 L7 2 L13 16" fill="none" stroke="url(#nav-rail)" strokeWidth="1.8" strokeLinejoin="round" />
            <defs>
              <linearGradient id="nav-rail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFC" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-sm font-semibold tracking-tight text-white">Bengaluru vs Chennai</span>
        </a>
        <div className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto sm:justify-center">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition ${
                active === l.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span
            className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1 text-xs font-semibold"
            title={`Bengaluru ${SCORE.blr} – ${SCORE.maa} Chennai`}
          >
            <span style={{ color: 'var(--blr)' }}>BLR {SCORE.blr}</span>
            <span className="text-slate-600">–</span>
            <span style={{ color: 'var(--maa)' }}>{SCORE.maa} MAA</span>
          </span>
          <p className="text-xs text-slate-500">
            Updated <span className="text-slate-300">{UPDATED_LABEL}</span>
          </p>
        </div>
      </div>
      <div className="h-0.5 w-full bg-slate-900" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[var(--blr)] to-[var(--maa)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}
