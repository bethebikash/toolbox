export interface DateDiffResult {
  years:   number;
  months:  number;
  weeks:   number;
  days:    number;
  hours:   number;
  minutes: number;
  totalDays: number;
  isPast:    boolean;
}

export function dateDiff(dateA: string, dateB: string): DateDiffResult {
  const a    = new Date(dateA);
  const b    = new Date(dateB);
  const diff = b.getTime() - a.getTime();
  const abs  = Math.abs(diff);
  const isPast = diff < 0;

  const totalDays = Math.floor(abs / 86400000);
  const totalHours = Math.floor(abs / 3600000);
  const totalMinutes = Math.floor(abs / 60000);

  let years  = Math.abs(b.getFullYear() - a.getFullYear());
  let months = Math.abs(b.getMonth() - a.getMonth());
  let days   = Math.abs(b.getDate() - a.getDate());

  if (days < 0)   { months--; days += 30; }
  if (months < 0) { years--;  months += 12; }

  return { years, months, weeks: Math.floor(totalDays / 7), days: totalDays % 7, hours: totalHours % 24, minutes: totalMinutes % 60, totalDays, isPast };
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]!;
}

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0]!;
}

export function getWorkdays(dateA: string, dateB: string): number {
  const a   = new Date(dateA);
  const b   = new Date(dateB);
  let count = 0;
  const cur = new Date(a);
  while (cur <= b) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export const meta = { ready: true };
