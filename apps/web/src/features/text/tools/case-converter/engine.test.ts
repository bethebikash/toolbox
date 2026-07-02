import { describe, it, expect } from 'vitest';
import { convertCase } from './engine';

describe('convertCase', () => {
  it('upper', () => expect(convertCase('hello world', 'upper')).toBe('HELLO WORLD'));
  it('lower', () => expect(convertCase('HELLO WORLD', 'lower')).toBe('hello world'));
  it('title', () => expect(convertCase('hello world', 'title')).toBe('Hello World'));
  it('sentence', () => expect(convertCase('hello world', 'sentence')).toBe('Hello world'));
  it('camel',  () => expect(convertCase('hello world', 'camel')).toBe('helloWorld'));
  it('pascal', () => expect(convertCase('hello world', 'pascal')).toBe('HelloWorld'));
  it('snake',  () => expect(convertCase('hello world', 'snake')).toBe('hello_world'));
  it('kebab',  () => expect(convertCase('hello world', 'kebab')).toBe('hello-world'));
  it('constant',()=> expect(convertCase('hello world', 'constant')).toBe('HELLO_WORLD'));
  it('handles camelCase input', () => expect(convertCase('helloWorld', 'snake')).toBe('hello_world'));
  it('handles empty string', () => expect(convertCase('', 'upper')).toBe(''));
});
