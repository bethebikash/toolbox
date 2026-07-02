import { describe, it, expect } from 'vitest';
import { sortLines } from './engine';

const opts = { order: 'asc' as const, caseSensitive: false, removeDups: false, trimLines: false };

describe('sortLines', () => {
  it('sorts asc',  () => expect(sortLines('c\na\nb', opts)).toBe('a\nb\nc'));
  it('sorts desc', () => expect(sortLines('a\nc\nb', { ...opts, order: 'desc' })).toBe('c\nb\na'));
  it('length asc', () => expect(sortLines('bb\na\nccc', { ...opts, order: 'length-asc' })).toBe('a\nbb\nccc'));
  it('removes dups', () => {
    const r = sortLines('b\na\nb', { ...opts, removeDups: true });
    expect(r.split('\n').length).toBe(2);
  });
  it('handles empty', () => expect(sortLines('', opts)).toBe(''));
});
