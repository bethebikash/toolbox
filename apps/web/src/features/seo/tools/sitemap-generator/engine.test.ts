import { describe, it, expect } from 'vitest';
import { generateSitemap, parseBulkURLs, DEFAULT_OPTS } from './engine';

describe('generateSitemap', () => {
  it('generates valid XML', () => {
    const xml = generateSitemap(DEFAULT_OPTS);
    expect(xml).toContain('<?xml');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
  });

  it('includes URL entries', () => {
    const xml = generateSitemap(DEFAULT_OPTS);
    expect(xml).toContain('<loc>https://example.com/</loc>');
  });

  it('skips empty locs', () => {
    const opts = { urls: [{ id: '1', loc: '', lastmod: '2024-01-01', changefreq: 'daily' as const, priority: '1.0' as const }] };
    const xml  = generateSitemap(opts);
    expect(xml).not.toContain('<loc></loc>');
  });
});

describe('parseBulkURLs', () => {
  it('parses line-separated URLs', () => {
    const result = parseBulkURLs('https://a.com\nhttps://b.com', { lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.5' });
    expect(result.length).toBe(2);
    expect(result[0]!.loc).toBe('https://a.com');
  });

  it('skips blank lines', () => {
    const result = parseBulkURLs('https://a.com\n\nhttps://b.com', { lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.5' });
    expect(result.length).toBe(2);
  });
});
