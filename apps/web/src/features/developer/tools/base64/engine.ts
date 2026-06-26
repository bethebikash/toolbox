export type EncodeResult =
  | { ok: true;  output: string; inputSize: number; outputSize: number }
  | { ok: false; error: string };

export type DecodeResult =
  | { ok: true;  output: string; isText: boolean }
  | { ok: false; error: string };

export function encodeText(input: string): EncodeResult {
  try {
    const output = btoa(unescape(encodeURIComponent(input)));
    return { ok: true, output, inputSize: input.length, outputSize: output.length };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function decodeBase64(input: string): DecodeResult {
  try {
    const cleaned = input.trim().replace(/\s/g, '');
    const decoded = decodeURIComponent(escape(atob(cleaned)));
    const isText  = isReadableText(decoded);
    return { ok: true, output: decoded, isText };
  } catch (e) {
    return { ok: false, error: 'Invalid Base64 string' };
  }
}

export function encodeFile(file: File): Promise<EncodeResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is already "data:mime;base64,<data>" — extract just the base64 part
      const base64 = result.split(',')[1] ?? '';
      resolve({
        ok:         true,
        output:     base64,
        inputSize:  file.size,
        outputSize: base64.length,
      });
    };
    reader.onerror = () => resolve({ ok: false, error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

export function encodeFileWithPrefix(file: File): Promise<EncodeResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        ok:         true,
        output:     result,
        inputSize:  file.size,
        outputSize: result.length,
      });
    };
    reader.onerror = () => resolve({ ok: false, error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

function isReadableText(str: string): boolean {
  // Check if decoded string is printable ASCII / UTF-8 text
  for (let i = 0; i < Math.min(str.length, 500); i++) {
    const code = str.charCodeAt(i);
    if (code < 9 || (code > 13 && code < 32)) return false;
  }
  return true;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
