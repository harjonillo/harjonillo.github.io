import { getCollection, type CollectionEntry } from 'astro:content';

export type JournalEntry = CollectionEntry<'journal'>;

/**
 * Threads an entry may belong to. A `thread` not listed here fails the build,
 * so a typo can't quietly create a new filter chip. Add a line to start a thread.
 */
export const THREADS = ['meta', 'multiagent-island', 'bluedot', 'design'] as const;

/** Drafts show in `npm run dev` and are left out of production builds. */
const showDrafts = !import.meta.env.PROD;

function check(all: JournalEntry[]) {
  const known: readonly string[] = THREADS;
  const seen = new Map<string, string>();
  for (const e of all) {
    if (!known.includes(e.data.thread)) {
      throw new Error(
        `Journal: ${e.id} has thread "${e.data.thread}", which isn't in THREADS ` +
          `(src/lib/journal.ts). Known threads: ${THREADS.join(', ')}.`,
      );
    }
    const key = entryLabel(e);
    const other = seen.get(key);
    if (other) throw new Error(`Journal: ${other} and ${e.id} both claim ${key}.`);
    seen.set(key, e.id);
  }
}

/** Published entries (plus drafts in dev), newest first. */
export async function getJournal(): Promise<JournalEntry[]> {
  const all = await getCollection('journal');
  check(all); // drafts included, so a draft can't collide unnoticed
  return all
    .filter((e) => showDrafts || !e.data.draft)
    .sort(
      (a, b) =>
        b.data.date.getTime() - a.data.date.getTime() || b.data.entry - a.data.entry,
    );
}

/** "#002" */
export const entryNumber = (e: JournalEntry) => `#${String(e.data.entry).padStart(3, '0')}`;

/** "llm-abm #002" */
export const entryLabel = (e: JournalEntry) => `${e.data.thread} ${entryNumber(e)}`;

// Frontmatter dates parse as midnight UTC, so format and group in UTC too —
// local time would shift dates by a day west of Greenwich.
const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short' });
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** True if the entry's date was written with a time ("2026-11-06 19:30"). */
export const hasTime = (d: Date) => d.getUTCHours() !== 0 || d.getUTCMinutes() !== 0;
const withTime = (d: Date, sep: string) => (hasTime(d) ? `${sep}${timeFmt.format(d)}` : '');

/** "29 OCT", or "29 OCT · 19:30" with a time (index rows) */
export const formatDay = (d: Date) => dayFmt.format(d).toUpperCase() + withTime(d, ' · ');
/** "29 Oct 2026", or "29 Oct 2026, 19:30" (entry eyebrow, which uppercases it) */
export const formatDate = (d: Date) => dateFmt.format(d) + withTime(d, ', ');
/** "2026-10-29" or "2026-10-29T19:30" for <time datetime> */
export const isoDate = (d: Date) => d.toISOString().slice(0, hasTime(d) ? 16 : 10);
export const yearOf = (d: Date) => d.getUTCFullYear();

/** Nearest lower and higher entry in the same thread, among `all`. */
export function neighbors(e: JournalEntry, all: JournalEntry[]) {
  const same = all.filter((o) => o.data.thread === e.data.thread && o.id !== e.id);
  const prev = same
    .filter((o) => o.data.entry < e.data.entry)
    .sort((a, b) => b.data.entry - a.data.entry)[0];
  const next = same
    .filter((o) => o.data.entry > e.data.entry)
    .sort((a, b) => a.data.entry - b.data.entry)[0];
  return { prev, next };
}

/** Threads with entries, ordered by their most recent entry (`all` is newest first). */
export function threadCounts(all: JournalEntry[]) {
  const counts = new Map<string, number>();
  for (const e of all) counts.set(e.data.thread, (counts.get(e.data.thread) ?? 0) + 1);
  return [...counts].map(([thread, count]) => ({ thread, count }));
}
