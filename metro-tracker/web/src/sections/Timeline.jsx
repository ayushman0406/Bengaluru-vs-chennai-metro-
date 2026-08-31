import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CITIES, OPENINGS } from '../data/overview.js';
import { ChartTooltip, Reveal, SectionHeader } from '../components/ui.jsx';

const WINDOWS = [
  { id: 24, label: '24 months' },
  { id: 60, label: '5 years' },
  { id: 120, label: '10 years' },
];

const ANCHOR = new Date('2026-08-25');

function monthsBack(n) {
  const out = [];
  const d = new Date(ANCHOR.getFullYear(), ANCHOR.getMonth(), 1);
  for (let i = 0; i < n; i += 1) {
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    out.unshift(stamp);
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

function inWindow(dateIso, months) {
  const d = new Date(dateIso);
  const start = new Date(ANCHOR);
  start.setMonth(start.getMonth() - months);
  return d >= start && d <= ANCHOR;
}

export default function Timeline() {
  const [months, setMonths] = useState(24);

  const events = useMemo(
    () => OPENINGS.filter((o) => inWindow(o.date, months)),
    [months],
  );

  const series = useMemo(() => {
    const keys = monthsBack(months);
    const map = Object.fromEntries(
      keys.map((k) => [k, { month: k, BLR: 0, MAA: 0, BLR_cum: 0, MAA_cum: 0 }]),
    );
    for (const e of events) {
      const k = e.date.slice(0, 7);
      if (map[k]) map[k][e.metro] += e.km;
    }
    let b = 0;
    let m = 0;
    return keys.map((k) => {
      b += map[k].BLR;
      m += map[k].MAA;
      return { ...map[k], label: k.slice(2), BLR_cum: Number(b.toFixed(2)), MAA_cum: Number(m.toFixed(2)) };
    });
  }, [events, months]);

  const totals = {
    BLR: { km: events.filter((e) => e.metro === 'BLR').reduce((s, e) => s + e.km, 0), stations: events.filter((e) => e.metro === 'BLR').reduce((s, e) => s + e.stations, 0) },
    MAA: { km: events.filter((e) => e.metro === 'MAA').reduce((s, e) => s + e.km, 0), stations: events.filter((e) => e.metro === 'MAA').reduce((s, e) => s + e.stations, 0) },
  };

  const since = series[0]?.month ?? '—';

  return (
    <section id="timeline" className="px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="Round: getting things open"
        title="Who is actually laying track"
        lede="Built from recorded section-opening events with an explicit kilometre figure. A flat line means nothing opened that month — it is not missing data. Older openings without a published section length are omitted rather than estimated."
      />
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--panel)] p-1" role="tablist" aria-label="Time window">
          {WINDOWS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setMonths(w.id)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                months === w.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              aria-selected={months === w.id}
            >
              {w.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {['BLR', 'MAA'].map((code) => (
            <div key={code} className="hairline px-5 py-5">
              <p className="text-xs text-slate-500">
                {CITIES[code].system} · since {since}
              </p>
              <p className="font-fig mt-2 text-3xl text-white">
                {totals[code].km.toFixed(2)}
                <span className="ml-1 text-base text-slate-500">km</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">{totals[code].stations} stations</p>
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">Nothing opened at all in this window.</p>
        )}

        <h3 className="mt-12 text-sm font-semibold text-white">Kilometres opened per month</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v} km`} />} />
              <Bar dataKey="BLR" name="Namma Metro" fill={CITIES.BLR.fill} radius={[3, 3, 0, 0]} />
              <Bar dataKey="MAA" name="Chennai Metro" fill={CITIES.MAA.fill} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mt-12 text-sm font-semibold text-white">Cumulative kilometres added</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v} km`} />} />
              <Area type="monotone" dataKey="BLR_cum" name="Namma Metro" stroke={CITIES.BLR.fill} fill={CITIES.BLR.fill} fillOpacity={0.18} strokeWidth={2} />
              <Area type="monotone" dataKey="MAA_cum" name="Chennai Metro" stroke={CITIES.MAA.fill} fill={CITIES.MAA.fill} fillOpacity={0.18} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mt-12 text-sm font-semibold text-white">Everything that opened in this window</h3>
        <ul className="mt-4 space-y-3">
          {events.map((e) => (
            <Reveal key={e.name}>
              <li className="hairline px-5 py-4">
                <p className="font-medium text-white">{e.name}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {CITIES[e.metro].system} · {e.line} · {e.date} · {e.stations} stations · {e.km} km
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
