import { describe, it, expect } from 'vitest';
import { parseRanges, formatBytes } from './engine';

describe('parseRanges', () => {
  it('parses single page', () => {
    expect(parseRanges('1', 10)).toEqual([[1]]);
    expect(parseRanges('5', 10)).toEqual([[5]]);
  });

  it('parses range', () => {
    expect(parseRanges('1-3', 10)).toEqual([[1, 2, 3]]);
    expect(parseRanges('2-5', 10)).toEqual([[2, 3, 4, 5]]);
  });

  it('parses multiple ranges', () => {
    expect(parseRanges('1-3,5,7-9', 10)).toEqual([[1,2,3],[5],[7,8,9]]);
  });

  it('clamps to totalPages', () => {
    const result = parseRanges('8-15', 10);
    expect(result[0]).toEqual([8,9,10]);
  });

  it('ignores invalid pages', () => {
    expect(parseRanges('0,11', 10)).toEqual([]);
  });

  it('handles empty string', () => {
    expect(parseRanges('', 10)).toEqual([]);
  });
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(500)).toBe('500 B'));
  it('formats KB',    () => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats MB',    () => expect(formatBytes(1024 * 1024)).toBe('1.00 MB'));
});
