import { describe, it, expect } from 'vitest';
import { calculateMortgage } from './engine';

describe('calculateMortgage', () => {
  it('standard 30yr mortgage', () => {
    const r = calculateMortgage({ homePrice: 400000, downPayment: 80000, annualRate: 7, termYears: 30, propertyTax: 1.2, insurance: 1200 });
    expect(r.loanAmount).toBe(320000);
    expect(r.monthlyPrincipal).toBeGreaterThan(2000);
    expect(r.monthlyTotal).toBeGreaterThan(r.monthlyPrincipal);
  });
  it('20% down', () => {
    const r = calculateMortgage({ homePrice: 400000, downPayment: 80000, annualRate: 7, termYears: 30, propertyTax: 0, insurance: 0 });
    expect(r.downPct).toBe(20);
  });
});
