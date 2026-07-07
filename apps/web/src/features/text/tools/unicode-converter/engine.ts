export interface UnicodeResult {
  original:   string;
  codePoints: string;
  escaped:    string;
  html:       string;
  bytes:      string;
}

export function toUnicode(input: string): UnicodeResult {
  const codePoints = Array.from(input)
    .map(c => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');

  const escaped = Array.from(input)
    .map(c => {
      const code = c.codePointAt(0)!;
      if (code <= 0x7E && code >= 0x20) return c;
      return code > 0xFFFF
        ? `\\u{${code.toString(16).toUpperCase()}}`
        : `\\u${code.toString(16).toUpperCase().padStart(4, '0')}`;
    })
    .join('');

  const html = Array.from(input)
    .map(c => {
      const code = c.codePointAt(0)!;
      if (code <= 0x7E && code >= 0x20 && c !== '<' && c !== '>' && c !== '&') return c;
      return `&#${code};`;
    })
    .join('');

  const encoder = new TextEncoder();
  const bytes   = Array.from(encoder.encode(input))
    .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  return { original: input, codePoints, escaped, html, bytes };
}

export function fromUnicode(input: string): string {
  return input
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

export const meta = { ready: true };
