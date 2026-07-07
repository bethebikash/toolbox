import { describe, it, expect } from 'vitest';
import { toSlug, DEFAULT_OPTS } from './engine';

describe('toSlug', () => {
  it('basic slug', () => expect(toSlug('Hello World', DEFAULT_OPTS)).toBe('hello-world'));
  it('removes special chars', () => expect(toSlug('Hello! World?', DEFAULT_OPTS)).toBe('hello-world'));
  it('underscore separator', () => expect(toSlug('Hello World', { ...DEFAULT_OPTS, separator: '_' })).toBe('hello_world'));
  it('preserves case when lowercase=false', () => expect(toSlug('Hello World', { ...DEFAULT_OPTS, lowercase: false })).toBe('Hello-World'));
  it('removes diacritics', () => expect(toSlug('Café', DEFAULT_OPTS)).toBe('cafe'));
  it('handles empty', () => expect(toSlug('', DEFAULT_OPTS)).toBe(''));
});
