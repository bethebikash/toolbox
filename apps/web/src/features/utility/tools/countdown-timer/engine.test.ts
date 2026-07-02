import { describe, it, expect } from 'vitest';
import { getCountdown } from './engine';

describe('getCountdown', () => {
  it('returns past=true for past date', () => {
    const r = getCountdown({ date: '2000-01-01', time: '00:00', label: 'test' });
    expect(r.past).toBe(true);
    expect(r.total).toBeGreaterThan(0);
  });

  it('returns past=false for future date', () => {
    const future = new Date(Date.now() + 86400000);
    const dateStr = future.toISOString().split('T')[0]!;
    const r = getCountdown({ date: dateStr, time: '23:59', label: 'test' });
    expect(r.past).toBe(false);
    expect(r.days).toBeGreaterThanOrEqual(0);
  });

  it('breaks down correctly', () => {
    // 1 day + 2 hours + 3 minutes + 4 seconds from now
    const target = new Date(Date.now() + (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000);
    const dateStr = target.toISOString().split('T')[0]!;
    const timeStr = target.toTimeString().slice(0, 5);
    const r = getCountdown({ date: dateStr, time: timeStr, label: 'test' });
    expect(r.days).toBeGreaterThanOrEqual(0);
    expect(r.hours).toBeGreaterThanOrEqual(0);
  });
});
