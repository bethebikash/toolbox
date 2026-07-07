import { describe, it, expect } from 'vitest';
import { toUnicode, fromUnicode } from './engine';

describe('toUnicode', () => {
  it('converts ASCII', () => {
    const r = toUnicode('A');
    expect(r.codePoints).toBe('U+0041');
  });

  it('converts emoji', () => {
    const r = toUnicode('😀');
    expect(r.codePoints).toContain('U+');
  });

  it('generates HTML entities', () => {
    const r = toUnicode('<');
    expect(r.html).toBe('&#60;');
  });
});

describe('fromUnicode', () => {
  it('converts \\uXXXX back to char', () => {
    expect(fromUnicode('\\u0041')).toBe('A');
  });

  it('converts HTML entities', () => {
    expect(fromUnicode('&#65;')).toBe('A');
  });

  it('roundtrips', () => {
    const original = 'Hello';
    const r = toUnicode(original);
    expect(fromUnicode(r.escaped)).toBe(original);
  });
});
