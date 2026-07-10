import { describe, it, expect } from 'vitest';
import { analyzeText } from './engine';

describe('analyzeText', () => {
  it('empty returns zeros', () => {
    const r = analyzeText('');
    expect(r.words).toBe(0);
    expect(r.chars).toBe(0);
  });

  it('counts words', () => {
    const r = analyzeText('Hello world foo');
    expect(r.words).toBe(3);
  });

  it('counts sentences', () => {
    const r = analyzeText('Hello. World! Foo?');
    expect(r.sentences).toBe(3);
  });

  it('finds longest word', () => {
    const r = analyzeText('I love programming languages');
    expect(r.longestWord).toBe('programming');
  });

  it('calculates unique words', () => {
    const r = analyzeText('the cat sat on the mat');
    expect(r.uniqueWords).toBeLessThan(r.words);
  });
});
