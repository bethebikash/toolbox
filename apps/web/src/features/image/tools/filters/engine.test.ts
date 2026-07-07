import { describe, it, expect } from 'vitest';
import { FILTER_LABELS, formatBytes } from './engine';

describe('FILTER_LABELS', () => {
  it('has all filters', () => {
    expect(FILTER_LABELS.grayscale).toBe('Grayscale');
    expect(FILTER_LABELS.sepia).toBe('Sepia');
    expect(FILTER_LABELS.blur).toBe('Blur');
  });
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
});
