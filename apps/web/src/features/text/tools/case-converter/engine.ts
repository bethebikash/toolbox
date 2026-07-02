export type CaseType =
  | 'upper' | 'lower' | 'title' | 'sentence'
  | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

export const CASE_LABELS: Record<CaseType, string> = {
  upper:    'UPPER CASE',
  lower:    'lower case',
  title:    'Title Case',
  sentence: 'Sentence case',
  camel:    'camelCase',
  pascal:   'PascalCase',
  snake:    'snake_case',
  kebab:    'kebab-case',
  constant: 'CONSTANT_CASE',
};

export function convertCase(input: string, type: CaseType): string {
  if (!input) return '';
  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  switch (type) {
    case 'upper':    return input.toUpperCase();
    case 'lower':    return input.toLowerCase();
    case 'title':    return words.map(w => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    case 'sentence': {
      const s = input.toLowerCase();
      return s[0]!.toUpperCase() + s.slice(1);
    }
    case 'camel':    return words[0]!.toLowerCase() + words.slice(1).map(w => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'pascal':   return words.map(w => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake':    return words.map(w => w.toLowerCase()).join('_');
    case 'kebab':    return words.map(w => w.toLowerCase()).join('-');
    case 'constant': return words.map(w => w.toUpperCase()).join('_');
  }
}

export const meta = { ready: true };
