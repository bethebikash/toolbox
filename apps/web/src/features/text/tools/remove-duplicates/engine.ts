export interface DuplicateOptions {
  caseSensitive: boolean;
  trimLines:     boolean;
  keepEmpty:     boolean;
}

export interface DuplicateResult {
  output:      string;
  inputLines:  number;
  outputLines: number;
  removed:     number;
}

export function removeDuplicates(input: string, opts: DuplicateOptions): DuplicateResult {
  const lines = input.split('\n');
  const seen  = new Set<string>();
  const out:  string[] = [];

  for (const raw of lines) {
    const line = opts.trimLines ? raw.trim() : raw;
    if (!opts.keepEmpty && line === '') continue;
    const key  = opts.caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) { seen.add(key); out.push(line); }
  }

  return {
    output:      out.join('\n'),
    inputLines:  lines.length,
    outputLines: out.length,
    removed:     lines.length - out.length,
  };
}

export const meta = { ready: true };
