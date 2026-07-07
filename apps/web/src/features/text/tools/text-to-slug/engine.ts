export interface SlugOptions {
  separator:  '-' | '_' | '.';
  lowercase:  boolean;
  removeStop: boolean;
}

const STOP_WORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','is','was','are','were']);

export function toSlug(input: string, opts: SlugOptions): string {
  let str = input.trim();
  if (opts.lowercase) str = str.toLowerCase();

  str = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove diacritics
    .replace(/[^a-zA-Z0-9\s]/g, '')  // remove special chars
    .replace(/\s+/g, ' ')
    .trim();

  let words = str.split(' ');

  if (opts.removeStop) {
    words = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
  }

  return words.filter(Boolean).join(opts.separator);
}

export const DEFAULT_OPTS: SlugOptions = { separator: '-', lowercase: true, removeStop: false };
export const meta = { ready: true };
