export interface RegexMatch {
  fullMatch: string;
  index:     number;
  groups:    string[];
  end:       number;
}

export interface RegexResult {
  ok:         true;
  matches:    RegexMatch[];
  matchCount: number;
  highlighted: HighlightSegment[];
}

export interface RegexError {
  ok:    false;
  error: string;
}

export interface HighlightSegment {
  text:    string;
  isMatch: boolean;
}

export interface RegexFlags {
  global:     boolean;
  ignoreCase: boolean;
  multiline:  boolean;
  dotAll:     boolean;
}

export function testRegex(pattern: string, flags: RegexFlags, input: string): RegexResult | RegexError {
  if (!pattern) return { ok: true, matches: [], matchCount: 0, highlighted: [{ text: input, isMatch: false }] };

  try {
    const flagStr = [
      flags.global     ? 'g' : '',
      flags.ignoreCase ? 'i' : '',
      flags.multiline  ? 'm' : '',
      flags.dotAll     ? 's' : '',
    ].join('');

    const regex   = new RegExp(pattern, flagStr || 'g');
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;

    const workRegex = flags.global ? regex : new RegExp(pattern, 'g' + flagStr.replace('g',''));
    while ((m = workRegex.exec(input)) !== null) {
      matches.push({
        fullMatch: m[0],
        index:     m.index,
        groups:    m.slice(1),
        end:       m.index + m[0].length,
      });
      if (!flags.global) break;
    }

    // Build highlighted segments
    const highlighted: HighlightSegment[] = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.index > cursor) highlighted.push({ text: input.slice(cursor, match.index), isMatch: false });
      highlighted.push({ text: match.fullMatch, isMatch: true });
      cursor = match.end;
    }
    if (cursor < input.length) highlighted.push({ text: input.slice(cursor), isMatch: false });
    if (highlighted.length === 0) highlighted.push({ text: input, isMatch: false });

    return { ok: true, matches, matchCount: matches.length, highlighted };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const COMMON_PATTERNS = [
  { name: 'Email',       pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL',         pattern: 'https?:\\/\\/[^\\s]+' },
  { name: 'IPv4',        pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Phone (US)',  pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'Date',        pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'Hex color',   pattern: '#[0-9a-fA-F]{3,6}\\b' },
  { name: 'Credit card', pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b' },
  { name: 'Postal code', pattern: '\\b\\d{5}(?:-\\d{4})?\\b' },
];

export const meta = { ready: true };
