import { describe, it, expect } from 'vitest';
import { calculateCalories } from './engine';

const opts = { weight: 75, height: 175, age: 30, sex: 'male' as const, activity: 'moderate' as const, goal: 'maintain' as const, unit: 'metric' as const };

describe('calculateCalories', () => {
  it('calculates BMR for male', () => {
    const r = calculateCalories(opts);
    expect(r.bmr).toBeGreaterThan(1500);
    expect(r.bmr).toBeLessThan(2500);
  });

  it('TDEE > BMR', () => {
    const r = calculateCalories(opts);
    expect(r.tdee).toBeGreaterThan(r.bmr);
  });

  it('lose goal = tdee - 500', () => {
    const r = calculateCalories({ ...opts, goal: 'lose' });
    const m = calculateCalories(opts);
    expect(r.target).toBe(m.tdee - 500);
  });

  it('returns macros', () => {
    const r = calculateCalories(opts);
    expect(r.protein).toBeGreaterThan(0);
    expect(r.carbs).toBeGreaterThan(0);
    expect(r.fat).toBeGreaterThan(0);
  });

  it('imperial input works', () => {
    const r = calculateCalories({ ...opts, unit: 'imperial', weight: 165, height: 69 });
    expect(r.bmr).toBeGreaterThan(1500);
  });
});
