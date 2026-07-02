import { describe, it, expect } from 'vitest';
import { calculatePercentage, formatNum } from './engine';

describe('calculatePercentage', () => {
  it('returns 5 results', () => {
    expect(calculatePercentage(10, 200).length).toBe(5);
  });

  it('10% of 200 = 20', () => {
    const r = calculatePercentage(10, 200);
    expect(r[0]!.value).toBe(20);
  });

  it('50 is 25% of 200', () => {
    const r = calculatePercentage(50, 200);
    expect(r[1]!.value).toBe(25);
  });
});

describe('formatNum', () => {
  it('formats number', () => expect(formatNum(3.14159)).toContain('3.14'));
  it('handles NaN', () => expect(formatNum(NaN)).toBe('—'));
  it('handles Infinity', () => expect(formatNum(Infinity)).toBe('—'));
});
