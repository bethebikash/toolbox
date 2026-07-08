export interface TimestampResult {
  unix:      number;
  iso:       string;
  utc:       string;
  local:     string;
  relative:  string;
  date:      string;
  time:      string;
}

export function fromTimestamp(ts: number): TimestampResult {
  // Auto-detect: if > 1e11 treat as milliseconds, else seconds
  const ms  = ts > 1e11 ? ts : ts * 1000;
  const sec = Math.floor(ms / 1000);
  const d   = new Date(ms);
  const now = Date.now();
  const diff = Math.round((ms - now) / 1000);
  const abs  = Math.abs(diff);

  let relative: string;
  if (abs < 60)         relative = `${abs} second${abs !== 1 ? 's' : ''} ${diff < 0 ? 'ago' : 'from now'}`;
  else if (abs < 3600)  relative = `${Math.round(abs/60)} minute${Math.round(abs/60) !== 1 ? 's' : ''} ${diff < 0 ? 'ago' : 'from now'}`;
  else if (abs < 86400) relative = `${Math.round(abs/3600)} hour${Math.round(abs/3600) !== 1 ? 's' : ''} ${diff < 0 ? 'ago' : 'from now'}`;
  else                  relative = `${Math.round(abs/86400)} day${Math.round(abs/86400) !== 1 ? 's' : ''} ${diff < 0 ? 'ago' : 'from now'}`;

  return {
    unix:     sec,
    iso:      d.toISOString(),
    utc:      d.toUTCString(),
    local:    d.toLocaleString(),
    relative,
    date:     d.toISOString().split('T')[0]!,
    time:     d.toTimeString().slice(0, 8),
  };
}

export function fromDatetime(dateStr: string, timeStr: string): TimestampResult {
  const d = new Date(`${dateStr}T${timeStr}`);
  return fromTimestamp(Math.floor(d.getTime() / 1000));
}

export const meta = { ready: true };
