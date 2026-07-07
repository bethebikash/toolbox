export interface RandomOptions {
  min:     number;
  max:     number;
  count:   number;
  unique:  boolean;
  decimal: boolean;
  decimals:number;
}

export function generateNumbers(opts: RandomOptions): number[] {
  const results: number[] = [];
  const used = new Set<number>();
  const range = opts.max - opts.min;

  if (opts.unique && opts.count > range + 1) {
    throw new Error(`Cannot generate ${opts.count} unique numbers in range [${opts.min}, ${opts.max}]`);
  }

  let attempts = 0;
  while (results.length < opts.count && attempts < 10000) {
    const raw = opts.min + Math.random() * range;
    const n   = opts.decimal
      ? parseFloat(raw.toFixed(opts.decimals))
      : Math.floor(opts.min + Math.random() * (range + 1));

    if (opts.unique) {
      if (!used.has(n)) { used.add(n); results.push(n); }
    } else {
      results.push(n);
    }
    attempts++;
  }

  return results;
}

export const meta = { ready: true };
