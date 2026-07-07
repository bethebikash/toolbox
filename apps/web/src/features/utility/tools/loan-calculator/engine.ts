export interface LoanOptions {
  principal:  number;
  annualRate: number;  // percent
  termMonths: number;
}

export interface LoanResult {
  monthlyPayment:  number;
  totalPayment:    number;
  totalInterest:   number;
  schedule:        PaymentRow[];
}

export interface PaymentRow {
  month:     number;
  payment:   number;
  principal: number;
  interest:  number;
  balance:   number;
}

export function calculateLoan(opts: LoanOptions): LoanResult {
  const r = opts.annualRate / 100 / 12;
  const n = opts.termMonths;
  const p = opts.principal;

  let monthlyPayment: number;
  if (r === 0) {
    monthlyPayment = p / n;
  } else {
    monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const schedule: PaymentRow[] = [];
  let balance = p;

  for (let month = 1; month <= n; month++) {
    const interest   = balance * r;
    const principal  = monthlyPayment - interest;
    balance -= principal;
    schedule.push({
      month,
      payment:  monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPayment  = monthlyPayment * n;
  const totalInterest = totalPayment - p;

  return { monthlyPayment, totalPayment, totalInterest, schedule };
}

export function formatCurrency(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}

export const meta = { ready: true };
