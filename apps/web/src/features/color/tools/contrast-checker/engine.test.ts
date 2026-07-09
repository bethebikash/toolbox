import { describe, it, expect } from 'vitest';
import { checkContrast } from './engine';

describe('checkContrast', () => {
  it('black on white is AAA', () => {
    const r = checkContrast('#000000', '#ffffff');
    expect(r.ratio).toBeCloseTo(21, 0);
    expect(r.level).toBe('AAA');
    expect(r.aaa_normal).toBe(true);
  });

  it('white on white fails', () => {
    const r = checkContrast('#ffffff', '#ffffff');
    expect(r.ratio).toBe(1);
    expect(r.level).toBe('Fail');
  });

  it('detects AA level', () => {
    const r = checkContrast('#767676', '#ffffff');
    expect(r.aa_normal).toBe(true);
  });

  it('formats ratio correctly', () => {
    const r = checkContrast('#000000', '#ffffff');
    expect(r.ratioFormatted).toContain(':1');
  });
});
