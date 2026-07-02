export interface MinifyResult {
  output:       string;
  originalSize: number;
  outputSize:   number;
  savedPercent: number;
}

export function minifyCSS(input: string): MinifyResult {
  const output = input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*;\s*/g, ';')
    .trim();

  const orig = input.length;
  const out  = output.length;
  return { output, originalSize: orig, outputSize: out, savedPercent: orig > 0 ? Math.round((1 - out / orig) * 100) : 0 };
}

export function beautifyCSS(input: string): string {
  const minified = minifyCSS(input).output;
  return minified
    .replace(/\{/g, ' {\n  ')
    .replace(/;(?!\s)/g, ';\n  ')
    .replace(/\}/g, '\n}\n')
    .replace(/,(?=[^\s])/g, ',\n')
    .replace(/:\s*/g, ': ')          // add space after colon
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim().length > 0)
    .join('\n');
}

export const meta = { ready: true };
