import { describe, it, expect } from 'vitest';
import { FAVICON_SIZES, DEFAULT_OPTS } from './engine';

describe('FAVICON_SIZES', () => {
  it('contains standard sizes', () => {
    expect(FAVICON_SIZES).toContain(16);
    expect(FAVICON_SIZES).toContain(32);
    expect(FAVICON_SIZES).toContain(256);
  });
});

describe('DEFAULT_OPTS', () => {
  it('has required fields', () => {
    expect(DEFAULT_OPTS.text).toBeTruthy();
    expect(DEFAULT_OPTS.bgColor).toMatch(/^#/);
    expect(DEFAULT_OPTS.textColor).toMatch(/^#/);
    expect(DEFAULT_OPTS.fontSize).toBeGreaterThan(0);
  });
});
