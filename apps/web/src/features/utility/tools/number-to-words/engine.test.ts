import { describe, it, expect } from 'vitest';
import { numberToWords } from './engine';

describe('numberToWords', () => {
  it('zero', () => expect(numberToWords(0)).toBe('zero'));
  it('single digit', () => expect(numberToWords(5)).toBe('five'));
  it('teens', () => expect(numberToWords(13)).toBe('thirteen'));
  it('tens', () => expect(numberToWords(42)).toBe('forty-two'));
  it('hundreds', () => expect(numberToWords(100)).toBe('one hundred'));
  it('thousands', () => expect(numberToWords(1000)).toBe('one thousand'));
  it('millions', () => expect(numberToWords(1000000)).toContain('million'));
  it('negative', () => expect(numberToWords(-5)).toBe('negative five'));
  it('NaN', () => expect(numberToWords(NaN)).toBe('invalid number'));
});
