import { describe, it, expect } from 'vitest';
import { generateImgTag, generateCSSBackground, formatBytes } from './engine';

const MOCK_RESULT = { dataUrl: 'data:image/png;base64,abc', base64: 'abc', mimeType: 'image/png', sizeBytes: 1024, base64Length: 3 };

describe('generateImgTag', () => {
  it('generates img tag', () => {
    const tag = generateImgTag(MOCK_RESULT);
    expect(tag).toContain('<img');
    expect(tag).toContain('data:image/png;base64,abc');
  });
});

describe('generateCSSBackground', () => {
  it('generates CSS', () => {
    const css = generateCSSBackground(MOCK_RESULT);
    expect(css).toContain('background-image');
    expect(css).toContain('url(');
  });
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
  it('formats KB',    () => expect(formatBytes(2048)).toBe('2.0 KB'));
});
