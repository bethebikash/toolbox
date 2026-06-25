// Pure browser — uses Web Crypto API, no WASM needed

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateBatch(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export const meta = { ready: true };
