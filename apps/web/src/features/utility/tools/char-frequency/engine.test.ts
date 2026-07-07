import { describe, it, expect } from 'vitest';
import { analyzeFrequency } from './engine';

const opts = { caseSensitive: false, ignoreSpaces: true, onlyLetters: false };

describe('analyzeFrequency', () => {
  it('counts correctly', () => {
    const r = analyzeFrequency('aab', opts);
    const a = r.find(x => x.char === 'a');
    expect(a?.count).toBe(2);
  });

  it('case insensitive merges', () => {
    const r = analyzeFrequency('AaBb', opts);
    const a = r.find(x => x.char === 'a');
    expect(a?.count).toBe(2);
  });

  it('sorts by frequency desc', () => {
    const r = analyzeFrequency('aaab', opts);
    expect(r[0]!.char).toBe('a');
  });

  it('handles empty', () => {
    expect(analyzeFrequency('', opts)).toEqual([]);
  });
});
