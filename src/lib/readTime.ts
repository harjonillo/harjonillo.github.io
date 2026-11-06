/** Minutes to read a Markdown body at 200 words a minute, at least 1. */
export function readMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "8 min read" */
export function readTime(body: string | undefined): string {
  return `${readMinutes(body)} min read`;
}
