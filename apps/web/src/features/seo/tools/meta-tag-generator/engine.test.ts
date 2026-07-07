import { describe, it, expect } from 'vitest';
import { generateMetaTags, countChars, DEFAULT_OPTS } from './engine';

describe('generateMetaTags', () => {
  it('includes title tag', () => {
    const html = generateMetaTags(DEFAULT_OPTS);
    expect(html).toContain('<title>');
  });

  it('includes meta description', () => {
    const html = generateMetaTags(DEFAULT_OPTS);
    expect(html).toContain('name="description"');
  });

  it('includes og:title', () => {
    const html = generateMetaTags(DEFAULT_OPTS);
    expect(html).toContain('property="og:title"');
  });

  it('includes twitter:card', () => {
    const html = generateMetaTags(DEFAULT_OPTS);
    expect(html).toContain('name="twitter:card"');
  });

  it('skips empty fields', () => {
    const html = generateMetaTags({ ...DEFAULT_OPTS, author: '' });
    expect(html).not.toContain('name="author"');
  });
});

describe('countChars', () => {
  it('returns length and ok flag', () => {
    expect(countChars('hello').length).toBe(5);
    expect(countChars('hello').ok).toBe(true);
    expect(countChars('x'.repeat(161)).ok).toBe(false);
  });
});
