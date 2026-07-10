import { describe, it, expect } from 'vitest';
import { parseCron } from './engine';

describe('parseCron', () => {
  it('parses * * * * *', () => {
    const r = parseCron('* * * * *');
    expect(r.valid).toBe(true);
    expect(r.fields.length).toBe(5);
  });

  it('rejects wrong field count', () => {
    const r = parseCron('* * *');
    expect(r.valid).toBe(false);
  });

  it('parses 0 9 * * 1', () => {
    const r = parseCron('0 9 * * 1');
    expect(r.valid).toBe(true);
  });

  it('produces next runs', () => {
    const r = parseCron('* * * * *');
    expect(r.nextRuns.length).toBeGreaterThan(0);
  });
});
