import { describe, it, expect } from 'vitest';
import { generatePassword, generateBatch, getStrengthColor } from './engine';

describe('generatePassword', () => {
  it('generates correct length', () => {
    expect(generatePassword({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false, exclude: '' }).password.length).toBe(12);
    expect(generatePassword({ length: 32, uppercase: true, lowercase: true, numbers: true, symbols: true,  exclude: '' }).password.length).toBe(32);
  });

  it('respects charset options — only numbers', () => {
    const r = generatePassword({ length: 20, uppercase: false, lowercase: false, numbers: true, symbols: false, exclude: '' });
    expect(/^[0-9]+$/.test(r.password)).toBe(true);
  });

  it('respects charset options — only uppercase', () => {
    const r = generatePassword({ length: 20, uppercase: true, lowercase: false, numbers: false, symbols: false, exclude: '' });
    expect(/^[A-Z]+$/.test(r.password)).toBe(true);
  });

  it('excludes specified characters', () => {
    const r = generatePassword({ length: 100, uppercase: true, lowercase: true, numbers: true, symbols: false, exclude: '0Oo1Il' });
    expect(r.password).not.toMatch(/[0Oo1Il]/);
  });

  it('calculates strength correctly', () => {
    const weak   = generatePassword({ length: 4,  uppercase: false, lowercase: true, numbers: false, symbols: false, exclude: '' });
    const strong = generatePassword({ length: 20, uppercase: true,  lowercase: true, numbers: true,  symbols: true,  exclude: '' });
    expect(weak.strength).toBe('weak');
    expect(strong.strength).toBe('very-strong');
  });

  it('returns empty for no charset', () => {
    const r = generatePassword({ length: 12, uppercase: false, lowercase: false, numbers: false, symbols: false, exclude: '' });
    expect(r.password).toBe('');
    expect(r.strength).toBe('weak');
  });

  it('generates unique passwords', () => {
    const passwords = new Set(
      Array.from({ length: 50 }, () =>
        generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: false, exclude: '' }).password
      )
    );
    expect(passwords.size).toBeGreaterThan(45);
  });
});

describe('generateBatch', () => {
  it('generates correct count', () => {
    const results = generateBatch({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false, exclude: '' }, 5);
    expect(results.length).toBe(5);
  });
});

describe('getStrengthColor', () => {
  it('returns color for each strength', () => {
    expect(getStrengthColor('weak')).toBeTruthy();
    expect(getStrengthColor('very-strong')).toBeTruthy();
  });
});
