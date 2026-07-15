import { describe, it, expect } from 'vitest';
import { calculateInterest } from './engine';

describe('calculateInterest', () => {
  it('SI = P*R*T', () => {
    const r = calculateInterest({ principal: 1000, rate: 10, time: 1, timeUnit: 'years' });
    expect(r.simpleInterest).toBe(100);
    expect(r.totalAmount).toBe(1100);
  });

  it('months unit', () => {
    const r = calculateInterest({ principal: 1200, rate: 12, time: 12, timeUnit: 'months' });
    expect(r.simpleInterest).toBeCloseTo(144, 0);
  });

  it('compound > simple for same rate', () => {
    const r = calculateInterest({ principal: 1000, rate: 10, time: 5, timeUnit: 'years' });
    expect(r.compoundYearly).toBeGreaterThan(r.simpleInterest);
  });
});
