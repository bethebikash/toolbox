import { describe, it, expect } from 'vitest';
import { calculateBMI } from './engine';

describe('calculateBMI', () => {
  it('normal weight metric', () => {
    const r = calculateBMI(70, 175, 'metric');
    expect(r.bmi).toBeCloseTo(22.9, 0);
    expect(r.category).toBe('Normal weight');
  });

  it('underweight', () => {
    const r = calculateBMI(45, 175, 'metric');
    expect(r.category).toBe('Underweight');
  });

  it('overweight', () => {
    const r = calculateBMI(85, 175, 'metric');
    expect(r.category).toBe('Overweight');
  });

  it('imperial', () => {
    const r = calculateBMI(154, 68, 'imperial'); // ~70kg, ~173cm
    expect(r.bmi).toBeGreaterThan(18);
    expect(r.bmi).toBeLessThan(30);
  });

  it('returns ideal range', () => {
    const r = calculateBMI(70, 175, 'metric');
    expect(r.idealMin).toBeGreaterThan(50);
    expect(r.idealMax).toBeGreaterThan(r.idealMin);
  });
});
