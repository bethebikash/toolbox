import { describe, it, expect } from 'vitest';
import { generatePalette } from './engine';

describe('generatePalette', () => {
  it('returns 4 palette types', () => {
    const p = generatePalette('#2E7CF6');
    expect(p.length).toBe(4);
  });

  it('each palette has 5 colors', () => {
    const p = generatePalette('#2E7CF6');
    p.forEach(palette => expect(palette.colors.length).toBe(5));
  });

  it('all colors are valid hex', () => {
    const p = generatePalette('#2E7CF6');
    p.forEach(palette => palette.colors.forEach(c => {
      expect(c.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }));
  });
});
