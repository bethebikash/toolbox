import { describe, it, expect } from 'vitest';
import { removeDuplicates } from './engine';

const opts = { caseSensitive: true, trimLines: false, keepEmpty: false };

describe('removeDuplicates', () => {
  it('removes duplicate lines', () => {
    const r = removeDuplicates('a\nb\na\nc', opts);
    expect(r.output).toBe('a\nb\nc');
    expect(r.removed).toBe(1);
  });

  it('case insensitive mode', () => {
    const r = removeDuplicates('Hello\nhello', { ...opts, caseSensitive: false });
    expect(r.outputLines).toBe(1);
  });

  it('trim lines mode', () => {
    const r = removeDuplicates(' a \na', { ...opts, trimLines: true });
    expect(r.outputLines).toBe(1);
  });

  it('removes empty lines when keepEmpty false', () => {
    const r = removeDuplicates('a\n\nb', opts);
    expect(r.output).toBe('a\nb');
  });
});
