import { describe, it, expect } from 'vitest';
import { convert, CURRENCIES } from './engine';

describe('convert', () => {
  it('same currency returns same amount', () => expect(convert(100, 'USD', 'USD')).toBe(100));
  it('USD to EUR', () => {
    const result = convert(100, 'USD', 'EUR');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });
  it('roundtrip is approximately equal', () => {
    const eur    = convert(100, 'USD', 'EUR');
    const back   = convert(eur, 'EUR', 'USD');
    expect(back).toBeCloseTo(100, 1);
  });
});

describe('CURRENCIES', () => {
  it('includes major currencies', () => {
    expect(CURRENCIES).toContain('USD');
    expect(CURRENCIES).toContain('EUR');
    expect(CURRENCIES).toContain('JPY');
  });
});
