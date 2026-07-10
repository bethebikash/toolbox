import { describe, it, expect } from 'vitest';
import { jsonToTypeScript } from './engine';

describe('jsonToTypeScript', () => {
  it('converts simple object', () => {
    const r = jsonToTypeScript('{"name":"John","age":30}');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toContain('interface Root');
    expect(r.output).toContain('name: string');
    expect(r.output).toContain('age: number');
  });

  it('handles nested objects', () => {
    const r = jsonToTypeScript('{"user":{"name":"John"}}');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toContain('interface User');
  });

  it('handles arrays', () => {
    const r = jsonToTypeScript('[{"id":1}]');
    expect(r.ok).toBe(true);
  });

  it('returns error for invalid JSON', () => {
    const r = jsonToTypeScript('{invalid}');
    expect(r.ok).toBe(false);
  });

  it('handles null values', () => {
    const r = jsonToTypeScript('{"data":null}');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toContain('null');
  });
});
