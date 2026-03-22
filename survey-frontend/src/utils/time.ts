export function formatMs(ms: number | undefined | null) {
  if (!ms && ms !== 0) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
