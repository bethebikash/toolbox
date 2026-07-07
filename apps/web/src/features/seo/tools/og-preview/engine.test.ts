import { describe, it, expect } from 'vitest';
import { generateOGTags, DEFAULT_OG } from './engine';

describe('generateOGTags', () => {
  it('generates og:title', () => expect(generateOGTags(DEFAULT_OG)).toContain('og:title'));
  it('generates og:image', () => expect(generateOGTags(DEFAULT_OG)).toContain('og:image'));
  it('skips empty fields', () => {
    const html = generateOGTags({ ...DEFAULT_OG, siteName: '' });
    expect(html).not.toContain('og:site_name');
  });
});
