import { describe, it, expect } from 'vitest';
import { generateLorem } from './engine';

describe('generateLorem', () => {
  it('generates correct word count', () => {
    const result = generateLorem({ type: 'words', count: 10, startWithLorem: false });
    expect(result.split(' ').length).toBe(10);
  });

  it('generates correct sentence count', () => {
    const result = generateLorem({ type: 'sentences', count: 3, startWithLorem: false });
    expect(result.split('. ').length).toBeGreaterThanOrEqual(3);
  });

  it('generates correct paragraph count', () => {
    const result = generateLorem({ type: 'paragraphs', count: 2, startWithLorem: false });
    expect(result.split('\n\n').length).toBe(2);
  });

  it('starts with Lorem ipsum when enabled', () => {
    const result = generateLorem({ type: 'sentences', count: 2, startWithLorem: true });
    expect(result).toMatch(/^Lorem ipsum/);
  });
});
