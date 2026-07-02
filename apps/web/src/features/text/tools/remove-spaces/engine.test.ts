import { describe, it, expect } from 'vitest';
import { removeSpaces } from './engine';

describe('removeSpaces', () => {
  it('removes extra spaces', () => expect(removeSpaces('a  b   c', 'extra')).toBe('a b c'));
  it('removes all spaces',   () => expect(removeSpaces('a b c', 'all')).toBe('abc'));
  it('removes leading',      () => expect(removeSpaces('  hello', 'leading')).toBe('hello'));
  it('removes trailing',     () => expect(removeSpaces('hello  ', 'trailing')).toBe('hello'));
  it('trims both',           () => expect(removeSpaces('  hello  ', 'both')).toBe('hello'));
  it('removes blank lines',  () => expect(removeSpaces('a\n\nb', 'blank-lines')).toBe('a\nb'));
});
