import { describe, it, expect } from 'vitest';
import { calculateDiscount, reverseDiscount } from './engine';

describe('calculateDiscount', () => {
  it('20% off $100 = $80', () => {
    const r = calculateDiscount(100, 20, true);
    expect(r.finalPrice).toBe(80);
    expect(r.discountAmount).toBe(20);
  });

  it('flat $15 off $100', () => {
    const r = calculateDiscount(100, 15, false);
    expect(r.finalPrice).toBe(85);
    expect(r.discountPct).toBe(15);
  });

  it('clamps to 0', () => {
    const r = calculateDiscount(50, 60, false);
    expect(r.finalPrice).toBe(0);
  });
});

describe('reverseDiscount', () => {
  it('finds original from discounted price', () => {
    const original = reverseDiscount(80, 20);
    expect(original).toBeCloseTo(100, 1);
  });
});
