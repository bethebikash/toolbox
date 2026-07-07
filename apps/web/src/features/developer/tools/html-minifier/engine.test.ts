import { describe, it, expect } from 'vitest';
import { minifyHTML, beautifyHTML } from './engine';

describe('minifyHTML', () => {
  it('removes HTML comments', () => {
    const r = minifyHTML('<!-- comment --><div>hello</div>');
    expect(r.output).not.toContain('comment');
    expect(r.output).toContain('<div>hello</div>');
  });

  it('collapses whitespace', () => {
    const r = minifyHTML('<div>  hello  world  </div>');
    expect(r.output.includes('  ')).toBe(false);
  });

  it('reports size reduction', () => {
    const r = minifyHTML('<!-- big comment -->\n<div>\n  hello\n</div>');
    expect(r.savedPercent).toBeGreaterThan(0);
  });

  it('handles empty input', () => {
    const r = minifyHTML('');
    expect(r.output).toBe('');
    expect(r.savedPercent).toBe(0);
  });
});

describe('beautifyHTML', () => {
  it('adds newlines between tags', () => {
    const r = beautifyHTML('<div><p>hello</p></div>');
    expect(r).toContain('\n');
  });
});
