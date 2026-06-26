import { describe, it, expect } from 'vitest';
import { analyzeText, formatReadingTime } from './engine';

describe('analyzeText', () => {
  it('returns zeros for empty string', () => {
    const r = analyzeText('');
    expect(r.words).toBe(0);
    expect(r.characters).toBe(0);
    expect(r.sentences).toBe(0);
    expect(r.paragraphs).toBe(0);
  });

  it('counts words correctly', () => {
    expect(analyzeText('hello world').words).toBe(2);
    expect(analyzeText('one two three four five').words).toBe(5);
    expect(analyzeText('  extra   spaces  ').words).toBe(2);
  });

  it('counts characters including spaces', () => {
    expect(analyzeText('hello').characters).toBe(5);
    expect(analyzeText('hi there').characters).toBe(8);
  });

  it('counts characters excluding spaces', () => {
    expect(analyzeText('hi there').charactersNoSpace).toBe(7);
  });

  it('counts sentences', () => {
    expect(analyzeText('Hello. World.').sentences).toBe(2);
    expect(analyzeText('Really? Yes! Great.').sentences).toBe(3);
  });

  it('counts paragraphs', () => {
    expect(analyzeText('Para one.\n\nPara two.').paragraphs).toBe(2);
    expect(analyzeText('No breaks here.').paragraphs).toBe(1);
  });

  it('calculates reading time', () => {
    const longText = 'word '.repeat(238).trim();
    expect(analyzeText(longText).readingTimeMin).toBe(1);
    const doubleText = 'word '.repeat(476).trim();
    expect(analyzeText(doubleText).readingTimeMin).toBe(2);
  });
});

describe('formatReadingTime', () => {
  it('formats less than 1 min', () => {
    expect(formatReadingTime(0)).toBe('< 1 min');
  });
  it('formats 1 min', () => {
    expect(formatReadingTime(1)).toBe('1 min');
  });
  it('formats multiple mins', () => {
    expect(formatReadingTime(5)).toBe('5 mins');
  });
});
