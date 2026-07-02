import { describe, it, expect } from 'vitest';
import { generateQR, generateQRSVG, DEFAULT_OPTS } from './engine';

describe('generateQR', () => {
  it('returns a data URL', async () => {
    const url = await generateQR('https://example.com', DEFAULT_OPTS);
    expect(url).toMatch(/^data:image\/png;base64,/);
  });

  it('handles plain text', async () => {
    const url = await generateQR('hello world', DEFAULT_OPTS);
    expect(url.length).toBeGreaterThan(100);
  });

  it('handles empty string', async () => {
    await expect(generateQR('', DEFAULT_OPTS)).rejects.toThrow();
  });
});

describe('generateQRSVG', () => {
  it('returns SVG markup', async () => {
    const svg = await generateQRSVG('test', DEFAULT_OPTS);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });
});
