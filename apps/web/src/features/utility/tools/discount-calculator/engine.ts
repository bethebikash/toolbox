export interface DiscountResult {
  originalPrice:    number;
  discountAmount:   number;
  finalPrice:       number;
  discountPct:      number;
  savings:          string;
  youPay:           string;
}

export function calculateDiscount(original: number, discount: number, isPercent: boolean): DiscountResult {
  const discountAmount = isPercent ? original * (discount / 100) : discount;
  const finalPrice     = Math.max(0, original - discountAmount);
  const discountPct    = original > 0 ? Math.round((discountAmount / original) * 100 * 10) / 10 : 0;

  const fmt = (n: number) => '$' + n.toFixed(2);
  return { originalPrice: original, discountAmount, finalPrice, discountPct, savings: fmt(discountAmount), youPay: fmt(finalPrice) };
}

export function reverseDiscount(finalPrice: number, discountPct: number): number {
  return finalPrice / (1 - discountPct / 100);
}

export const meta = { ready: true };
