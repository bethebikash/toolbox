import { describe, it, expect } from 'vitest';
import { dateDiff, addDays, addMonths, getWorkdays } from './engine';

describe('dateDiff', () => {
  it('same date = zeros', () => {
    const r = dateDiff('2024-01-01', '2024-01-01');
    expect(r.totalDays).toBe(0);
  });

  it('calculates days', () => {
    const r = dateDiff('2024-01-01', '2024-01-08');
    expect(r.totalDays).toBe(7);
    expect(r.weeks).toBe(1);
  });

  it('detects past', () => {
    const r = dateDiff('2024-06-01', '2024-01-01');
    expect(r.isPast).toBe(true);
  });
});

describe('addDays', () => {
  it('adds days correctly', () => {
    expect(addDays('2024-01-01', 7)).toBe('2024-01-08');
  });
  it('handles month boundary', () => {
    expect(addDays('2024-01-31', 1)).toBe('2024-02-01');
  });
});

describe('addMonths', () => {
  it('adds months', () => {
    expect(addMonths('2024-01-15', 3)).toBe('2024-04-15');
  });
});

describe('getWorkdays', () => {
  it('returns 5 for Mon-Fri week', () => {
    expect(getWorkdays('2024-01-01', '2024-01-05')).toBe(5);
  });
});
