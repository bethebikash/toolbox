export interface CharFreqResult {
  char:       string;
  count:      number;
  percent:    number;
  codePoint:  number;
}

export interface FreqOptions {
  caseSensitive: boolean;
  ignoreSpaces:  boolean;
  onlyLetters:   boolean;
}

export function analyzeFrequency(input: string, opts: FreqOptions): CharFreqResult[] {
  let text = opts.caseSensitive ? input : input.toLowerCase();
  if (opts.ignoreSpaces) text = text.replace(/\s/g, '');
  if (opts.onlyLetters)  text = text.replace(/[^a-zA-Z]/g, '');

  const freq: Record<string, number> = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] ?? 0) + 1;
  }

  const total = text.length;

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => ({
      char,
      count,
      percent:   total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      codePoint: char.codePointAt(0)!,
    }));
}

export const meta = { ready: true };
