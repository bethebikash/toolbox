import { describe, it, expect } from 'vitest';
import { encodeText, decodeText, TYPE_LABELS } from './engine';

describe('encodeText', () => {
  it('HTML escapes special chars', () => {
    expect(encodeText('<div>"hello"</div>', 'html')).toBe('&lt;div&gt;&quot;hello&quot;&lt;/div&gt;');
  });
  it('URL encodes', () => {
    expect(encodeText('hello world!', 'url')).toBe('hello%20world!');
  });
  it('JS escapes quotes and newlines', () => {
    expect(encodeText('say "hi"\nnew line', 'js')).toBe('say \\"hi\\"\\nnew line');
  });
  it('Base64 encodes', () => {
    expect(encodeText('hello', 'base64')).toBe('aGVsbG8=');
  });
  it('JSON escapes', () => {
    expect(encodeText('line1\nline2', 'json')).toContain('\\n');
  });
});

describe('decodeText', () => {
  it('HTML unescapes', () => {
    expect(decodeText('&lt;b&gt;bold&lt;/b&gt;', 'html')).toBe('<b>bold</b>');
  });
  it('URL decodes', () => {
    expect(decodeText('hello%20world', 'url')).toBe('hello world');
  });
  it('Base64 decodes', () => {
    expect(decodeText('aGVsbG8=', 'base64')).toBe('hello');
  });
  it('roundtrip HTML', () => {
    const original = 'Hello <World> & "everyone"!';
    expect(decodeText(encodeText(original, 'html'), 'html')).toBe(original);
  });
});

describe('TYPE_LABELS', () => {
  it('has all types', () => {
    expect(TYPE_LABELS.html).toBeTruthy();
    expect(TYPE_LABELS.base64).toBeTruthy();
  });
});
