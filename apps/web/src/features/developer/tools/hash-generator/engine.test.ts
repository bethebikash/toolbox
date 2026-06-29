import { describe, it, expect } from 'vitest';
import { hashText, hashAll } from './engine';

describe('hashText', () => {
  it('generates correct MD5', async () => {
    const r = await hashText('hello', 'MD5');
    expect(r.hash).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('generates correct SHA-256', async () => {
    const r = await hashText('hello', 'SHA-256');
    expect(r.hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('generates correct SHA-1', async () => {
    const r = await hashText('hello', 'SHA-1');
    expect(r.hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('empty string has consistent hash', async () => {
    const r = await hashText('', 'SHA-256');
    expect(r.hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('reports input size', async () => {
    const r = await hashText('hello', 'SHA-256');
    expect(r.inputSize).toBe(5);
  });
});

describe('hashAll', () => {
  it('returns all 5 algorithms', async () => {
    const results = await hashAll('test');
    expect(results.length).toBe(5);
    const algos = results.map(r => r.algorithm);
    expect(algos).toContain('MD5');
    expect(algos).toContain('SHA-256');
    expect(algos).toContain('SHA-512');
  });

  it('all hashes are non-empty strings', async () => {
    const results = await hashAll('test');
    results.forEach(r => {
      expect(r.hash.length).toBeGreaterThan(0);
      expect(/^[0-9a-f]+$/.test(r.hash)).toBe(true);
    });
  });
});
