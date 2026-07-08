import { describe, it, expect } from 'vitest';
import { fromTimestamp } from './engine';

describe('fromTimestamp', () => {
  it('converts unix timestamp', () => {
    const r = fromTimestamp(0);
    expect(r.unix).toBe(0);
    expect(r.iso).toContain('1970');
  });

  it('auto-detects milliseconds', () => {
    const r = fromTimestamp(1000000000000); // ms
    expect(r.unix).toBe(1000000000);
  });

  it('returns relative time', () => {
    const r = fromTimestamp(Date.now() / 1000 - 120);
    expect(r.relative).toContain('ago');
  });
});
