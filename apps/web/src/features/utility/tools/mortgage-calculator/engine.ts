export interface MortgageOptions {
  homePrice:     number;
  downPayment:   number;
  annualRate:    number;
  termYears:     number;
  propertyTax:   number;   // annual %
  insurance:     number;   // annual $
}

export interface MortgageResult {
  loanAmount:       number;
  monthlyPrincipal: number;
  monthlyTax:       number;
  monthlyInsurance: number;
  monthlyTotal:     number;
  totalPaid:        number;
  totalInterest:    number;
  downPct:          number;
}

export function calculateMortgage(opts: MortgageOptions): MortgageResult {
  const loan    = opts.homePrice - opts.downPayment;
  const r       = opts.annualRate / 100 / 12;
  const n       = opts.termYears * 12;
  const monthly = r === 0 ? loan / n : loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const tax     = (opts.homePrice * opts.propertyTax / 100) / 12;
  const ins     = opts.insurance / 12;

  return {
    loanAmount:       loan,
    monthlyPrincipal: monthly,
    monthlyTax:       tax,
    monthlyInsurance: ins,
    monthlyTotal:     monthly + tax + ins,
    totalPaid:        monthly * n,
    totalInterest:    monthly * n - loan,
    downPct:          Math.round(opts.downPayment / opts.homePrice * 100),
  };
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export const meta = { ready: true };
