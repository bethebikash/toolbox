import { describe, it, expect } from 'vitest';
import { diffText } from './engine';

describe('diffText', () => {
  it('identical texts have no changes', () => {
    const r = diffText('hello\nworld', 'hello\nworld');
    expect(r.added).toBe(0);
    expect(r.removed).toBe(0);
  });

  it('detects added lines', () => {
    const r = diffText('a\nb', 'a\nb\nc');
    expect(r.added).toBe(1);
  });

  it('detects removed lines', () => {
    const r = diffText('a\nb\nc', 'a\nb');
    expect(r.removed).toBe(1);
  });

  it('detects changed lines', () => {
    const r = diffText('hello\nworld', 'hello\nearth');
    expect(r.added).toBeGreaterThan(0);
    expect(r.removed).toBeGreaterThan(0);
  });

  it('handles empty strings', () => {
    const r = diffText('', '');
    expect(r.lines.length).toBe(1); // single empty line
  });
});
