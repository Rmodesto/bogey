export function scoreColor(score: number) {
  if (score >= 80) return "text-volt-green";
  if (score >= 70) return "text-deep-ice-blue";
  return "text-slate";
}

export function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
