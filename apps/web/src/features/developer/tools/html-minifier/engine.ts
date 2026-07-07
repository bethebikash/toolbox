export interface MinifyResult {
  output:       string;
  originalSize: number;
  outputSize:   number;
  savedPercent: number;
}

export function minifyHTML(input: string): MinifyResult {
  const output = input
    .replace(/<!--[\s\S]*?-->/g, '')         // remove HTML comments
    .replace(/\s*\n\s*/g, ' ')               // collapse newlines + surrounding spaces
    .replace(/\s{2,}/g, ' ')                 // collapse multiple spaces
    .replace(/>\s+</g, '><')                 // remove space between tags
    .replace(/\s+>/g, '>')                   // remove space before >
    .replace(/<\s+/g, '<')                   // remove space after 
    .trim();

  const orig = input.length;
  const out  = output.length;
  return { output, originalSize: orig, outputSize: out, savedPercent: orig > 0 ? Math.round((1 - out / orig) * 100) : 0 };
}

export function beautifyHTML(input: string): string {
  let result = input
    .replace(/>\s*</g, '>\n<')
    .replace(/(<[^/][^>]*[^/]>)\s*([^<\n])/g, '$1\n  $2');

  const lines = result.split('\n');
  let indent = 0;
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (/^<\//.test(trimmed)) indent = Math.max(0, indent - 1);
    const indented = '  '.repeat(indent) + trimmed;
    if (/^<[^/!]/.test(trimmed) && !/\/>$/.test(trimmed) && !/<\//.test(trimmed)) indent++;
    return indented;
  }).filter(Boolean).join('\n');
}

export const meta = { ready: true };
