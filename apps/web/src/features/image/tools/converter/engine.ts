export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ConvertOptions {
  format:  OutputFormat;
  quality: number;
}

export interface ConvertResult {
  file:         File;
  url:          string;
  originalSize: number;
  outputSize:   number;
  format:       OutputFormat;
  extension:    string;
}

const EXT: Record<OutputFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
};

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  'image/jpeg': 'JPG',
  'image/png':  'PNG',
  'image/webp': 'WebP',
};

export async function convertImage(
  file: File,
  opts: ConvertOptions,
  onProgress?: (pct: number) => void,
): Promise<ConvertResult> {
  onProgress?.(10);

  const bitmap = await createImageBitmap(file);
  onProgress?.(40);

  const canvas  = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx     = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  onProgress?.(70);

  const blob = await canvas.convertToBlob({
    type:    opts.format,
    quality: opts.quality,
  });
  onProgress?.(90);

  const ext      = EXT[opts.format];
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const outFile  = new File([blob], `${baseName}.${ext}`, { type: opts.format });
  onProgress?.(100);

  return {
    file:         outFile,
    url:          URL.createObjectURL(outFile),
    originalSize: file.size,
    outputSize:   blob.size,
    format:       opts.format,
    extension:    ext,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
