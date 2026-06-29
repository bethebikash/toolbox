import SparkMD5 from 'spark-md5';

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5';

export interface HashResult {
  algorithm: HashAlgorithm;
  hash:      string;
  inputSize: number;
}

async function subtlHash(algo: string, data: ArrayBuffer): Promise<string> {
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<HashResult> {
  let hash: string;

  if (algorithm === 'MD5') {
    hash = SparkMD5.hash(input);
  } else {
    const data = new TextEncoder().encode(input);
    hash = await subtlHash(algorithm, data.buffer as ArrayBuffer);
  }

  return { algorithm, hash, inputSize: input.length };
}

export async function hashAll(input: string): Promise<HashResult[]> {
  const algos: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  return Promise.all(algos.map(a => hashText(input, a)));
}

export const meta = { ready: true };
