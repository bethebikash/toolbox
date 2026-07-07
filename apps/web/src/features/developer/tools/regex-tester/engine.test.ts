import { describe, it, expect } from 'vitest';
import { testRegex } from './engine';

const flags = { global: true, ignoreCase: false, multiline: false, dotAll: false };

describe('testRegex', () => {
  it('finds matches', () => {
    const r = testRegex('\\d+', flags, 'abc 123 def 456');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.matchCount).toBe(2);
    expect(r.matches[0]!.fullMatch).toBe('123');
  });

  it('returns error for invalid regex', () => {
    const r = testRegex('[invalid', flags, 'test');
    expect(r.ok).toBe(false);
  });

  it('empty pattern returns no matches', () => {
    const r = testRegex('', flags, 'test');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.matchCount).toBe(0);
  });

  it('builds highlighted segments', () => {
    const r = testRegex('\\d+', flags, 'abc 123');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const matchSegment = r.highlighted.find(s => s.isMatch);
    expect(matchSegment?.text).toBe('123');
  });

  it('case insensitive flag works', () => {
    const r = testRegex('hello', { ...flags, ignoreCase: true }, 'HELLO world');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.matchCount).toBe(1);
  });
});
