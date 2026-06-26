import { describe, it, expect } from 'vitest';
import { formatJSON, minifyJSON, validateJSON } from './engine';

describe('formatJSON', () => {
  it('formats valid JSON with 2-space indent', () => {
    const result = formatJSON('{"a":1,"b":2}');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.lineCount).toBe(4);
  });

  it('formats with custom indent', () => {
    const result = formatJSON('{"a":1}', 4);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe('{\n    "a": 1\n}');
  });

  it('returns error for invalid JSON', () => {
    const result = formatJSON('{invalid}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeTruthy();
  });

  it('handles nested objects', () => {
    const input  = '{"user":{"name":"Alice","age":30}}';
    const result = formatJSON(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toContain('"user"');
    expect(result.output).toContain('"name"');
  });

  it('handles arrays', () => {
    const result = formatJSON('[1,2,3]');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe('[\n  1,\n  2,\n  3\n]');
  });
});

describe('minifyJSON', () => {
  it('minifies formatted JSON', () => {
    const input  = '{\n  "a": 1,\n  "b": 2\n}';
    const result = minifyJSON(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe('{"a":1,"b":2}');
    expect(result.lineCount).toBe(1);
  });

  it('returns error for invalid JSON', () => {
    const result = minifyJSON('{bad}');
    expect(result.ok).toBe(false);
  });
});

describe('validateJSON', () => {
  it('validates correct JSON', () => {
    expect(validateJSON('{"ok":true}').valid).toBe(true);
    expect(validateJSON('[1,2,3]').valid).toBe(true);
    expect(validateJSON('"hello"').valid).toBe(true);
    expect(validateJSON('42').valid).toBe(true);
    expect(validateJSON('null').valid).toBe(true);
  });

  it('invalidates broken JSON', () => {
    const r = validateJSON('{broken}');
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('invalidates trailing comma', () => {
    expect(validateJSON('{"a":1,}').valid).toBe(false);
  });
});
