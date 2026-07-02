export interface TimerTarget {
  date:   string;
  time:   string;
  label:  string;
}

export interface Countdown {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
  total:   number;  // total seconds remaining
  past:    boolean;
}

export function getCountdown(target: TimerTarget): Countdown {
  const targetMs = new Date(`${target.date}T${target.time}`).getTime();
  const nowMs    = Date.now();
  const diff     = targetMs - nowMs;
  const past     = diff < 0;
  const abs      = Math.abs(diff);
  const total    = Math.floor(abs / 1000);

  return {
    days:    Math.floor(total / 86400),
    hours:   Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
    past,
  };
}

export const meta = { ready: true };
