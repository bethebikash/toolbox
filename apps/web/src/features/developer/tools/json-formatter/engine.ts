export type FormatResult =
  | { ok: true;  output: string; lineCount: number }
  | { ok: false; error: string; line?: number };

export function formatJSON(input: string, indent: number = 2): FormatResult {
  try {
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed, null, indent);
    return { ok: true, output, lineCount: output.split('\n').length };
  } catch (e) {
    const msg = (e as Error).message;
    const lineMatch = msg.match(/line (\d+)/);
    return {
      ok: false,
      error: msg,
      line: lineMatch ? parseInt(lineMatch[1]!) : undefined,
    };
  }
}

export function minifyJSON(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed);
    return { ok: true, output, lineCount: 1 };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function validateJSON(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export const meta = { ready: true };
