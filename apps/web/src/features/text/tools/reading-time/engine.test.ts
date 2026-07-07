import { describe, it, expect } from 'vitest';
import { calculateReadingTime, DEFAULT_OPTS } from './engine';

describe('calculateReadingTime', () => {
  it('empty text returns zero', () => {
    const r = calculateReadingTime('', DEFAULT_OPTS);
    expect(r.words).toBe(0);
    expect(r.totalSeconds).toBe(0);
  });

  it('calculates 238 words as ~1 min', () => {
    const text = 'word '.repeat(238).trim();
    const r    = calculateReadingTime(text, DEFAULT_OPTS);
    expect(r.minutes).toBe(1);
    expect(r.formatted).toBe('1 min read');
  });

  it('short text shows seconds', () => {
    const text = 'word '.repeat(20).trim();
    const r    = calculateReadingTime(text, DEFAULT_OPTS);
    expect(r.formatted).toMatch(/sec/);
  });
});
