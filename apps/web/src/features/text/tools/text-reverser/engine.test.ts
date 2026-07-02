import { describe, it, expect } from 'vitest';
import { reverseText } from './engine';

describe('reverseText', () => {
  it('reverses chars', () => expect(reverseText('hello', 'chars')).toBe('olleh'));
  it('reverses words', () => expect(reverseText('hello world', 'words')).toBe('world hello'));
  it('reverses lines', () => expect(reverseText('a\nb\nc', 'lines')).toBe('c\nb\na'));
  it('handles empty', () => expect(reverseText('', 'chars')).toBe(''));
});
