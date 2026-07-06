import { describe, it, expect } from 'vitest';
import { FORMAT_LABELS, FORMAT_EXAMPLES, DEFAULT_OPTS } from './engine';

describe('FORMAT_LABELS', () => {
  it('has labels for all formats', () => {
    expect(FORMAT_LABELS.CODE128).toBe('Code 128 (general)');
    expect(FORMAT_LABELS.EAN13).toBe('EAN-13');
  });
});

describe('FORMAT_EXAMPLES', () => {
  it('has examples for all formats', () => {
    expect(FORMAT_EXAMPLES.CODE128).toBeTruthy();
    expect(FORMAT_EXAMPLES.EAN13.length).toBe(13);
  });
});

describe('DEFAULT_OPTS', () => {
  it('has valid defaults', () => {
    expect(DEFAULT_OPTS.height).toBeGreaterThan(0);
    expect(DEFAULT_OPTS.width).toBeGreaterThan(0);
    expect(DEFAULT_OPTS.lineColor).toMatch(/^#/);
  });
});
