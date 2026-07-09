import { describe, it, expect } from 'vitest';
import { convertBase, formatWithSpaces } from './engine';

describe('convertBase', () => {
  it('converts decimal 255', () => {
    const r = convertBase('255', 10);
    expect(r?.binary).toBe('11111111');
    expect(r?.octal).toBe('377');
    expect(r?.hexadecimal).toBe('FF');
  });

  it('converts binary to others', () => {
    const r = convertBase('1010', 2);
    expect(r?.decimal).toBe('10');
    expect(r?.hexadecimal).toBe('A');
  });

  it('converts hex to others', () => {
    const r = convertBase('FF', 16);
    expect(r?.decimal).toBe('255');
    expect(r?.binary).toBe('11111111');
  });

  it('returns null for invalid', () => {
    expect(convertBase('xyz', 10)).toBeNull();
    expect(convertBase('', 10)).toBeNull();
  });
});

describe('formatWithSpaces', () => {
  it('groups binary', () => {
    expect(formatWithSpaces('11111111', 4)).toBe('1111 1111');
  });
});
