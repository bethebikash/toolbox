import { describe, it, expect } from 'vitest';
import { calculateLoan, formatCurrency } from './engine';

describe('calculateLoan', () => {
  it('zero interest = principal divided by months', () => {
    const r = calculateLoan({ principal: 12000, annualRate: 0, termMonths: 12 });
    expect(r.monthlyPayment).toBeCloseTo(1000, 2);
  });

  it('calculates monthly payment', () => {
    const r = calculateLoan({ principal: 100000, annualRate: 5, termMonths: 360 });
    expect(r.monthlyPayment).toBeCloseTo(536.82, 1);
  });

  it('total payment > principal with interest', () => {
    const r = calculateLoan({ principal: 100000, annualRate: 5, termMonths: 360 });
    expect(r.totalPayment).toBeGreaterThan(100000);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it('schedule has correct month count', () => {
    const r = calculateLoan({ principal: 10000, annualRate: 5, termMonths: 24 });
    expect(r.schedule.length).toBe(24);
  });
});

describe('formatCurrency', () => {
  it('formats USD', () => expect(formatCurrency(1234.56)).toContain('1,234.56'));
});
