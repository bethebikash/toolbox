import { describe, it, expect } from 'vitest';
import { encodeText, decodeBase64, formatBytes } from './engine';

describe('encodeText', () => {
  it('encodes plain ASCII', () => {
    const r = encodeText('hello');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('aGVsbG8=');
  });

  it('encodes empty string', () => {
    const r = encodeText('');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('');
  });

  it('reports correct sizes', () => {
    const r = encodeText('hello');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.inputSize).toBe(5);
    expect(r.outputSize).toBe(8);
  });

  it('encodes unicode text', () => {
    const r = encodeText('café');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output.length).toBeGreaterThan(0);
  });

  it('roundtrips correctly', () => {
    const original = 'Hello, World! 123 @#$';
    const encoded  = encodeText(original);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeBase64(encoded.output);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.output).toBe(original);
  });
});

describe('decodeBase64', () => {
  it('decodes valid base64', () => {
    const r = decodeBase64('aGVsbG8=');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('hello');
    expect(r.isText).toBe(true);
  });

  it('handles whitespace in input', () => {
    const r = decodeBase64('aGVs  bG8=');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.output).toBe('hello');
  });

  it('returns error for invalid base64', () => {
    const r = decodeBase64('not valid base64!!!');
    expect(r.ok).toBe(false);
  });

  it('decodes without padding', () => {
    const r = decodeBase64('aGVsbG8');
    expect(r.ok).toBe(true);
  });
});

describe('formatBytes', () => {
  it('formats bytes', ()  => expect(formatBytes(500)).toBe('500 B'));
  it('formats KB',    ()  => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats MB',    ()  => expect(formatBytes(1024 * 1024)).toBe('1.00 MB'));
});
