export interface FindReplaceOptions {
  find:        string;
  replace:     string;
  caseSensitive: boolean;
  wholeWord:   boolean;
  useRegex:    boolean;
}

export interface FindReplaceResult {
  output:     string;
  count:      number;
  error?:     string;
}

export function findReplace(input: string, opts: FindReplaceOptions): FindReplaceResult {
  if (!opts.find) return { output: input, count: 0 };

  try {
    let pattern = opts.useRegex ? opts.find : opts.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (opts.wholeWord && !opts.useRegex) pattern = `\\b${pattern}\\b`;
    const flags  = 'g' + (opts.caseSensitive ? '' : 'i');
    const regex  = new RegExp(pattern, flags);
    const matches = input.match(regex);
    const output  = input.replace(regex, opts.replace);
    return { output, count: matches?.length ?? 0 };
  } catch (e) {
    return { output: input, count: 0, error: (e as Error).message };
  }
}

export const meta = { ready: true };
