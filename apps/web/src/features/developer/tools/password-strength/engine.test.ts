import { describe, it, expect } from 'vitest';
import { analyzePassword } from './engine';

describe('analyzePassword', () => {
  it('empty password is very weak', () => {
    const r = analyzePassword('');
    expect(r.level).toBe('Very Weak');
    expect(r.score).toBeLessThan(20);
  });

  it('simple password is weak', () => {
    const r = analyzePassword('password');
    expect(r.score).toBeLessThan(60);
  });

  it('complex password is strong', () => {
    const r = analyzePassword('Tr0ub4dor&3!xQ');
    expect(r.score).toBeGreaterThan(60);
  });

  it('returns time to crack', () => {
    const r = analyzePassword('abc');
    expect(r.timeToCrack).toBeTruthy();
  });

  it('returns suggestions for weak password', () => {
    const r = analyzePassword('abc');
    expect(r.suggestions.length).toBeGreaterThan(0);
  });

  it('entropy > 0 for non-empty', () => {
    const r = analyzePassword('Hello123!');
    expect(r.entropy).toBeGreaterThan(0);
  });
});
