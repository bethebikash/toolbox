export interface CronField {
  name:    string;
  value:   string;
  valid:   boolean;
  desc:    string;
}

export interface CronResult {
  expression: string;
  description: string;
  fields:     CronField[];
  nextRuns:   string[];
  valid:      boolean;
  error?:     string;
}

const PRESETS = [
  { label: 'Every minute',       expr: '* * * * *' },
  { label: 'Every 5 minutes',    expr: '*/5 * * * *' },
  { label: 'Every hour',         expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every day at noon',  expr: '0 12 * * *' },
  { label: 'Every Monday 9am',   expr: '0 9 * * 1' },
  { label: 'Every weekday 8am',  expr: '0 8 * * 1-5' },
  { label: 'Every month 1st',    expr: '0 0 1 * *' },
  { label: 'Every year Jan 1',   expr: '0 0 1 1 *' },
];

export { PRESETS };

function describeField(name: string, value: string, min: number, max: number, names?: string[]): string {
  if (value === '*') return `every ${name}`;
  if (value.startsWith('*/')) {
    const step = parseInt(value.slice(2));
    return `every ${step} ${name}${step > 1 ? 's' : ''}`;
  }
  if (value.includes('-')) {
    const [s, e] = value.split('-');
    const sn = names ? names[parseInt(s!)] : s;
    const en = names ? names[parseInt(e!)] : e;
    return `from ${sn} to ${en}`;
  }
  if (value.includes(',')) {
    const parts = value.split(',').map(v => names ? names[parseInt(v)] ?? v : v);
    return parts.join(', ');
  }
  const n = parseInt(value);
  return names?.[n] ?? `at ${name} ${value}`;
}

function getNextRun(now: Date, min: number, hour: number, dom: number, month: number, dow: number): Date | null {
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  for (let i = 0; i < 525600; i++) {
    const m  = d.getMinutes();
    const h  = d.getHours();
    const da = d.getDate();
    const mo = d.getMonth() + 1;
    const dw = d.getDay();

    const minOk  = min   === -1 || m  === min   || (min   < 0);
    const hourOk = hour  === -1 || h  === hour  || (hour  < 0);
    const domOk  = dom   === -1 || da === dom   || (dom   < 0);
    const monOk  = month === -1 || mo === month || (month < 0);
    const dowOk  = dow   === -1 || dw === dow   || (dow   < 0);

    if (minOk && hourOk && domOk && monOk && dowOk) return new Date(d);
    d.setMinutes(d.getMinutes() + 1);
  }
  return null;
}

export function parseCron(expression: string): CronResult {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { expression, description: '', fields: [], nextRuns: [], valid: false, error: 'Cron expression must have exactly 5 fields' };
  }

  const MONTHS  = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const NAMES   = ['minute', 'hour', 'day', 'month', 'weekday'];
  const DESCS   = [
    describeField('minute',  parts[0]!, 0, 59),
    describeField('hour',    parts[1]!, 0, 23),
    describeField('day',     parts[2]!, 1, 31),
    describeField('month',   parts[3]!, 1, 12, MONTHS),
    describeField('weekday', parts[4]!, 0, 6,  DAYS),
  ];

  const fields: CronField[] = parts.map((v, i) => ({
    name:  NAMES[i]!,
    value: v,
    valid: true,
    desc:  DESCS[i]!,
  }));

  const description = `At ${DESCS[1]}, ${DESCS[0]}, ${DESCS[2]} of ${DESCS[3]}, on ${DESCS[4]}`;

  // Compute next 5 runs (simplified — just shows schedule description)
  const now     = new Date();
  const nextRuns: string[] = [];
  let cursor    = new Date(now);
  cursor.setSeconds(0, 0);

  const parseVal = (v: string, fallback: number) => v === '*' ? fallback : v.startsWith('*/') ? fallback : parseInt(v.split(',')[0]!.split('-')[0]!);

  const minV  = parts[0] === '*' ? -1 : parseVal(parts[0]!, -1);
  const hourV = parts[1] === '*' ? -1 : parseVal(parts[1]!, -1);
  const domV  = parts[2] === '*' ? -1 : parseVal(parts[2]!, -1);
  const monV  = parts[3] === '*' ? -1 : parseVal(parts[3]!, -1);
  const dowV  = parts[4] === '*' ? -1 : parseVal(parts[4]!, -1);

  for (let i = 0; i < 5; i++) {
    const next = getNextRun(cursor, minV, hourV, domV, monV, dowV);
    if (!next) break;
    nextRuns.push(next.toLocaleString());
    cursor = new Date(next);
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return { expression, description, fields, nextRuns, valid: true };
}

export const meta = { ready: true };
