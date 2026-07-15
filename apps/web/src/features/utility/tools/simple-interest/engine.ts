export interface InterestOptions {
  principal:  number;
  rate:       number;   // annual %
  time:       number;
  timeUnit:   'years' | 'months' | 'days';
}

export interface InterestResult {
  simpleInterest:   number;
  totalAmount:      number;
  compoundMonthly:  number;
  compoundYearly:   number;
  dailyRate:        number;
  effectiveRate:    number;
}

export function calculateInterest(opts: InterestOptions): InterestResult {
  let years = opts.time;
  if (opts.timeUnit === 'months') years = opts.time / 12;
  if (opts.timeUnit === 'days')   years = opts.time / 365;

  const r  = opts.rate / 100;
  const si = opts.principal * r * years;

  const compoundMonthly = opts.principal * Math.pow(1 + r/12, 12 * years) - opts.principal;
  const compoundYearly  = opts.principal * Math.pow(1 + r, years) - opts.principal;
  const dailyRate       = r / 365;
  const effectiveRate   = (Math.pow(1 + r/12, 12) - 1) * 100;

  return {
    simpleInterest:  Math.round(si * 100) / 100,
    totalAmount:     Math.round((opts.principal + si) * 100) / 100,
    compoundMonthly: Math.round(compoundMonthly * 100) / 100,
    compoundYearly:  Math.round(compoundYearly * 100) / 100,
    dailyRate:       Math.round(dailyRate * 10000) / 10000,
    effectiveRate:   Math.round(effectiveRate * 100) / 100,
  };
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

export const meta = { ready: true };
