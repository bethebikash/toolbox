import { describe, it, expect } from 'vitest';
import { generateRobotsTxt, DEFAULT_OPTS } from './engine';

describe('generateRobotsTxt', () => {
  it('includes User-agent line', () => {
    const txt = generateRobotsTxt(DEFAULT_OPTS);
    expect(txt).toContain('User-agent: *');
  });

  it('includes Disallow lines', () => {
    const txt = generateRobotsTxt(DEFAULT_OPTS);
    expect(txt).toContain('Disallow: /admin/');
  });

  it('includes Sitemap', () => {
    const txt = generateRobotsTxt(DEFAULT_OPTS);
    expect(txt).toContain('Sitemap:');
  });

  it('skips empty paths', () => {
    const opts = { ...DEFAULT_OPTS, rules: [{ ...DEFAULT_OPTS.rules[0]!, disallow: ['', '/admin/'] }] };
    const txt  = generateRobotsTxt(opts);
    const lines = txt.split('\n').filter(l => l.startsWith('Disallow'));
    expect(lines.length).toBe(1);
  });
});
