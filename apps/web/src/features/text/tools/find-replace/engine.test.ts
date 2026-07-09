import { describe, it, expect } from 'vitest';
import { findReplace } from './engine';

const opts = { find: 'hello', replace: 'hi', caseSensitive: false, wholeWord: false, useRegex: false };

describe('findReplace', () => {
  it('replaces all occurrences', () => {
    const r = findReplace('hello world hello', opts);
    expect(r.output).toBe('hi world hi');
    expect(r.count).toBe(2);
  });

  it('case insensitive', () => {
    const r = findReplace('Hello HELLO', opts);
    expect(r.count).toBe(2);
  });

  it('case sensitive', () => {
    const r = findReplace('Hello HELLO hello', { ...opts, caseSensitive: true });
    expect(r.count).toBe(1);
  });

  it('whole word only', () => {
    const r = findReplace('hellofoo hello', { ...opts, wholeWord: true });
    expect(r.count).toBe(1);
  });

  it('regex mode', () => {
    const r = findReplace('abc 123 def', { ...opts, find: '\\d+', useRegex: true });
    expect(r.output).toBe('abc hi def');
  });

  it('returns error for invalid regex', () => {
    const r = findReplace('test', { ...opts, find: '[invalid', useRegex: true });
    expect(r.error).toBeTruthy();
  });
});
