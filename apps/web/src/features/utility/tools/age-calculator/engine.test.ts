import { describe, it, expect } from 'vitest';
import { calculateAge } from './engine';

describe('calculateAge', () => {
  it('calculates exact age', () => {
    const r = calculateAge('2000-01-01', '2025-01-01');
    expect(r.years).toBe(25);
    expect(r.months).toBe(0);
    expect(r.days).toBe(0);
  });

  it('calculates partial year', () => {
    const r = calculateAge('2000-06-15', '2025-03-01');
    expect(r.years).toBe(24);
    expect(r.months).toBe(8);
  });

  it('calculates total days', () => {
    const r = calculateAge('2000-01-01', '2001-01-01');
    expect(r.totalDays).toBe(366); // 2000 is leap year
  });

  it('returns day of week', () => {
    const r = calculateAge('2000-01-01', '2025-01-01');
    expect(r.dayOfWeek).toBe('Saturday');
  });

  it('returns zodiac', () => {
    const r = calculateAge('1990-03-15', '2025-01-01');
    expect(r.zodiac).toBe('Pisces');
  });

  it('returns next birthday', () => {
    const r = calculateAge('1990-12-25', '2025-12-24');
    expect(r.nextBirthday.daysUntil).toBe(1);
  });
});
