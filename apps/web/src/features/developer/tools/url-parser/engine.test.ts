import { describe, it, expect } from 'vitest';
import { parseURL, buildURL } from './engine';

describe('parseURL', () => {
  it('parses full URL', () => {
    const r = parseURL('https://example.com/path?foo=bar#hash');
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.hostname).toBe('example.com');
    expect(r.pathname).toBe('/path');
    expect(r.params.foo).toBe('bar');
    expect(r.hash).toBe('#hash');
  });

  it('parses without protocol', () => {
    const r = parseURL('example.com/path');
    expect('error' in r).toBe(false);
  });

  it('extracts path segments', () => {
    const r = parseURL('https://example.com/a/b/c');
    if ('error' in r) return;
    expect(r.segments).toEqual(['a', 'b', 'c']);
  });

  it('handles multiple params', () => {
    const r = parseURL('https://example.com?a=1&b=2');
    if ('error' in r) return;
    expect(r.params.a).toBe('1');
    expect(r.params.b).toBe('2');
  });
});

describe('buildURL', () => {
  it('adds params to URL', () => {
    const url = buildURL('https://example.com', { foo: 'bar' });
    expect(url).toContain('foo=bar');
  });
});
