import { describe, it, expect } from 'vitest';
import { generateUUID, generateBatch } from './engine';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('generateUUID', () => {
  it('generates a valid v4 UUID', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(UUID_REGEX);
  });

  it('generates unique UUIDs', () => {
    const uuids = new Set(Array.from({ length: 100 }, generateUUID));
    expect(uuids.size).toBe(100);
  });
});

describe('generateBatch', () => {
  it('generates correct count', () => {
    expect(generateBatch(1).length).toBe(1);
    expect(generateBatch(10).length).toBe(10);
    expect(generateBatch(100).length).toBe(100);
  });

  it('all are valid v4 UUIDs', () => {
    generateBatch(20).forEach(uuid => {
      expect(uuid).toMatch(UUID_REGEX);
    });
  });

  it('generates unique values', () => {
    const batch = generateBatch(50);
    expect(new Set(batch).size).toBe(50);
  });
});
