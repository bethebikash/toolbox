import { describe, it, expect } from 'vitest';
import { calculateTip } from './engine';

describe('calculateTip', () => {
  it('calculates 20% tip', () => {
    const r = calculateTip({ bill: 100, tipPct: 20, splitBy: 1 });
    expect(r.tipAmount).toBe(20);
    expect(r.total).toBe(120);
  });

  it('splits correctly', () => {
    const r = calculateTip({ bill: 100, tipPct: 20, splitBy: 4 });
    expect(r.perPerson).toBe(30);
  });
});
