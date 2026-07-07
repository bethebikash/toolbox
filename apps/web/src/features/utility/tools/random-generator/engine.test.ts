import { describe, it, expect } from 'vitest';
import { generateNumbers } from './engine';

const opts = { min: 1, max: 100, count: 5, unique: false, decimal: false, decimals: 2 };

describe('generateNumbers', () => {
  it('generates correct count', () => expect(generateNumbers(opts).length).toBe(5));
  it('stays within range', () => {
    generateNumbers({ ...opts, count: 50 }).forEach(n => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(100);
    });
  });
  it('generates unique when requested', () => {
    const nums = generateNumbers({ ...opts, count: 10, unique: true });
    expect(new Set(nums).size).toBe(10);
  });
  it('throws when unique impossible', () => {
    expect(() => generateNumbers({ ...opts, min: 1, max: 3, count: 10, unique: true })).toThrow();
  });
});
