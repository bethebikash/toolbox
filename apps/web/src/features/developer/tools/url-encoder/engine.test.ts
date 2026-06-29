import { describe, it, expect } from 'vitest';
import { encodeURL, decodeURL, parseQueryString, buildQueryString } from './engine';

describe('encodeURL', () => {
  it('encodes component correctly', () => {
    const r = encodeURL('hello world', 'component');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('hello%20world');
  });

  it('encodes special chars in component mode', () => {
    const r = encodeURL('a=1&b=2', 'component');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('a%3D1%26b%3D2');
  });

  it('encodes full URL preserving structure', () => {
    const r = encodeURL('https://example.com/path?q=hello world', 'full');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toContain('hello%20world');
    expect(r.output).toContain('https://');
  });
});

describe('decodeURL', () => {
  it('decodes component correctly', () => {
    const r = decodeURL('hello%20world', 'component');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('hello world');
  });

  it('returns error for invalid encoding', () => {
    const r = decodeURL('%ZZ', 'component');
    expect(r.ok).toBe(false);
  });

  it('roundtrips correctly', () => {
    const original = 'hello world & special=chars!';
    const encoded  = encodeURL(original, 'component');
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeURL(encoded.output, 'component');
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.output).toBe(original);
  });
});

describe('parseQueryString', () => {
  it('parses simple query string', () => {
    const params = parseQueryString('a=1&b=2');
    expect(params.length).toBe(2);
    expect(params[0]).toEqual({ key: 'a', value: '1' });
    expect(params[1]).toEqual({ key: 'b', value: '2' });
  });

  it('handles leading ?', () => {
    const params = parseQueryString('?foo=bar');
    expect(params[0]).toEqual({ key: 'foo', value: 'bar' });
  });

  it('decodes encoded values', () => {
    const params = parseQueryString('q=hello%20world');
    expect(params[0]?.value).toBe('hello world');
  });

  it('returns empty array for empty string', () => {
    expect(parseQueryString('')).toEqual([]);
  });
});

describe('buildQueryString', () => {
  it('builds from params', () => {
    const qs = buildQueryString([{ key: 'a', value: '1' }, { key: 'b', value: '2' }]);
    expect(qs).toBe('a=1&b=2');
  });

  it('encodes special characters', () => {
    const qs = buildQueryString([{ key: 'q', value: 'hello world' }]);
    expect(qs).toBe('q=hello%20world');
  });
});
