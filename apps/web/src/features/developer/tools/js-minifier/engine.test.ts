import { describe, it, expect } from 'vitest';
import { minifyJS } from './engine';

describe('minifyJS', () => {
  it('removes single-line comments', () => {
    const r = minifyJS('// comment\nconst x = 1;');
    expect(r.output).not.toContain('comment');
    expect(r.output).toContain('x');
  });

  it('removes multi-line comments', () => {
    const r = minifyJS('/* comment */\nconst x = 1;');
    expect(r.output).not.toContain('comment');
  });

  it('collapses blank lines', () => {
    const r = minifyJS('const a = 1;\n\n\nconst b = 2;');
    expect(r.output.split('\n').filter(Boolean).length).toBeLessThan(3);
  });

  it('reports size reduction', () => {
    const input = '// This is a comment\nconst   x   =   1;';
    const r = minifyJS(input);
    expect(r.outputSize).toBeLessThan(r.originalSize);
  });

  it('handles empty input', () => {
    const r = minifyJS('');
    expect(r.output).toBe('');
    expect(r.savedPercent).toBe(0);
  });
});
