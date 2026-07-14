import { describe, it, expect } from 'vitest';
import { checkPalindrome } from './engine';

describe('checkPalindrome', () => {
  it('racecar is a palindrome', () => {
    const r = checkPalindrome('racecar');
    expect(r.isPalindrome).toBe(true);
  });

  it('hello is not', () => {
    const r = checkPalindrome('hello');
    expect(r.isPalindrome).toBe(false);
  });

  it('phrase palindrome ignores spaces and case', () => {
    const r = checkPalindrome('A man a plan a canal Panama');
    expect(r.isPalindrome).toBe(true);
  });

  it('finds reversed string', () => {
    const r = checkPalindrome('hello');
    expect(r.reversed).toBe('olleh');
  });

  it('finds longest palindromic substring', () => {
    const r = checkPalindrome('babad');
    expect(r.longestPalindrome.length).toBeGreaterThanOrEqual(3);
  });
});
