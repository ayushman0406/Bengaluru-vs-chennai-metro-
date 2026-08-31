import * as snapshot from '../data/overview.js';

/** Prefer a live /api/overview when the original server is running; otherwise use the curated snapshot. */
export async function loadOverview() {
  try {
    const res = await fetch('/api/overview?months=36');
    if (!res.ok) throw new Error('no api');
    const live = await res.json();
    if (live && live.duel) return { source: 'api', live };
  } catch {
    /* snapshot is the published record */
  }
  return { source: 'snapshot', data: snapshot };
}
