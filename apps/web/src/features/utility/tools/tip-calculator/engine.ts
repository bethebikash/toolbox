export interface TipOptions {
  bill:      number;
  tipPct:    number;
  splitBy:   number;
}

export interface TipResult {
  tipAmount:     number;
  total:         number;
  perPerson:     number;
  tipPerPerson:  number;
}

export function calculateTip(opts: TipOptions): TipResult {
  const tipAmount    = opts.bill * (opts.tipPct / 100);
  const total        = opts.bill + tipAmount;
  const perPerson    = total    / opts.splitBy;
  const tipPerPerson = tipAmount / opts.splitBy;
  return { tipAmount, total, perPerson, tipPerPerson };
}

export const meta = { ready: true };
