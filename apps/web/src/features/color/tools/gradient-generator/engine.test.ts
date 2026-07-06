import { describe, it, expect } from 'vitest';
import { generateCSS, DEFAULT_GRADIENT } from './engine';

describe('generateCSS', () => {
  it('generates linear gradient', () => {
    const css = generateCSS(DEFAULT_GRADIENT);
    expect(css).toMatch(/^linear-gradient/);
    expect(css).toContain('#2E7CF6');
    expect(css).toContain('#10B981');
  });

  it('generates radial gradient', () => {
    const css = generateCSS({ ...DEFAULT_GRADIENT, type: 'radial' });
    expect(css).toMatch(/^radial-gradient/);
  });

  it('sorts stops by position', () => {
    const opts = {
      ...DEFAULT_GRADIENT,
      stops: [
        { id: '2', color: '#fff', position: 100 },
        { id: '1', color: '#000', position: 0 },
      ],
    };
    const css = generateCSS(opts);
    expect(css.indexOf('#000')).toBeLessThan(css.indexOf('#fff'));
  });

  it('includes direction', () => {
    const css = generateCSS({ ...DEFAULT_GRADIENT, direction: 'to bottom' });
    expect(css).toContain('to bottom');
  });
});
