export interface MinifyResult {
  output:       string;
  originalSize: number;
  outputSize:   number;
  savedPercent: number;
}

export function minifyJS(input: string): MinifyResult {
  // Conservative minification — safe to apply without a full AST parser
  const output = input
    .replace(/\/\/[^\n]*/g, '')              // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')        // remove multi-line comments
    .replace(/\n\s*\n/g, '\n')              // collapse blank lines
    .replace(/^\s+|\s+$/gm, '')             // trim each line
    .replace(/\s*([{}()\[\]=+\-*/%!<>&|,;:?])\s*/g, '$1') // spaces around ops
    .replace(/\n/g, ';')                    // newlines to semicolons
    .replace(/;;+/g, ';')                   // collapse multiple semicolons
    .replace(/;}/g, '}')                    // remove semicolon before }
    .replace(/;{/g, '{')                    // remove semicolon before {
    .trim();

  const orig = input.length;
  const out  = output.length;
  return {
    output,
    originalSize:  orig,
    outputSize:    out,
    savedPercent:  orig > 0 ? Math.round((1 - out / orig) * 100) : 0,
  };
}

export const meta = { ready: true };
