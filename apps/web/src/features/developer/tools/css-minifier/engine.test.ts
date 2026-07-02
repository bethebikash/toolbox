import { describe, expect, it } from 'vitest';
import { beautifyCSS, minifyCSS } from './engine';

describe('minifyCSS', () => {
  it('removes comments', () => {
    const r = minifyCSS('/* comment */ body { color: red; }');
    expect(r.output).not.toContain('comment');
  });

  it('collapses whitespace', () => {
    const r = minifyCSS('body   {   color :   red  ;  }');
    expect(r.output).toBe('body{color:red}');
  });

  it('removes last semicolon', () => {
    const r = minifyCSS('body { color: red; }');
    expect(r.output).toBe('body{color:red}');
  });

  it('reports size reduction', () => {
    const r = minifyCSS('body   {   color :   red  ;  }');
    expect(r.savedPercent).toBeGreaterThan(0);
    expect(r.originalSize).toBeGreaterThan(r.outputSize);
  });

  it('handles empty input', () => {
    const r = minifyCSS('');
    expect(r.output).toBe('');
    expect(r.savedPercent).toBe(0);
  });
});

describe('beautifyCSS', () => {
  it('expands minified CSS', () => {
    const r = beautifyCSS('body{color:red;font-size:16px}');
    expect(r).toContain('\n');
    expect(r).toContain('color: red');
  });
});
