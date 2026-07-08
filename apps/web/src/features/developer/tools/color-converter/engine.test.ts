import { describe, it, expect } from 'vitest';
import { parseColor } from './engine';

describe('parseColor', () => {
  it('parses hex', () => {
    const r = parseColor('#ff0000');
    expect(r?.rgb).toBe('rgb(255, 0, 0)');
    expect(r?.hex).toBe('#FF0000');
  });

  it('parses short hex', () => {
    const r = parseColor('#f00');
    expect(r?.rgb).toBe('rgb(255, 0, 0)');
  });

  it('parses rgb()', () => {
    const r = parseColor('rgb(0, 128, 255)');
    expect(r?.hex).toBe('#0080FF');
  });

  it('returns null for invalid', () => {
    expect(parseColor('notacolor')).toBeNull();
  });

  it('returns hsl', () => {
    const r = parseColor('#ffffff');
    expect(r?.hsl).toContain('hsl(');
  });
});
