export type SortOrder = 'asc' | 'desc' | 'random' | 'length-asc' | 'length-desc';

export const ORDER_LABELS: Record<SortOrder, string> = {
  'asc':         'A → Z',
  'desc':        'Z → A',
  'random':      'Shuffle',
  'length-asc':  'Shortest first',
  'length-desc': 'Longest first',
};

export interface SortOptions {
  order:         SortOrder;
  caseSensitive: boolean;
  removeDups:    boolean;
  trimLines:     boolean;
}

export function sortLines(input: string, opts: SortOptions): string {
  let lines = input.split('\n');
  if (opts.trimLines)  lines = lines.map(l => l.trim());
  if (opts.removeDups) {
    const seen = new Set<string>();
    lines = lines.filter(l => {
      const k = opts.caseSensitive ? l : l.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
  }

  switch (opts.order) {
    case 'asc':
      lines.sort((a, b) => opts.caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase()));
      break;
    case 'desc':
      lines.sort((a, b) => opts.caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase()));
      break;
    case 'random':
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j]!, lines[i]!];
      }
      break;
    case 'length-asc':  lines.sort((a, b) => a.length - b.length); break;
    case 'length-desc': lines.sort((a, b) => b.length - a.length); break;
  }

  return lines.join('\n');
}

export const meta = { ready: true };
