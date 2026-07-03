export type RotateAngle = 0 | 90 | 180 | 270;
export type FlipDirection = 'horizontal' | 'vertical' | 'both' | 'none';

export interface TransformOptions {
  rotate: RotateAngle;
  flip:   FlipDirection;
  quality: number;
  format:  'image/jpeg' | 'image/png' | 'image/webp';
}

export interface TransformResult {
  url:          string;
  blob:         Blob;
  width:        number;
  height:       number;
  originalSize: number;
  outputSize:   number;
}

export async function transformImage(
  file: File,
  opts: TransformOptions,
): Promise<TransformResult> {
  const bitmap = await createImageBitmap(file);
  const radians = (opts.rotate * Math.PI) / 180;
  const swap    = opts.rotate === 90 || opts.rotate === 270;

  const cw = swap ? bitmap.height : bitmap.width;
  const ch = swap ? bitmap.width  : bitmap.height;

  const canvas = document.createElement('canvas');
  canvas.width  = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  ctx.translate(cw / 2, ch / 2);
  ctx.rotate(radians);

  if (opts.flip === 'horizontal' || opts.flip === 'both') ctx.scale(-1, 1);
  if (opts.flip === 'vertical'   || opts.flip === 'both') ctx.scale(1, -1);

  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

  const blob = await new Promise<Blob>(res =>
    canvas.toBlob(b => res(b!), opts.format, opts.quality)
  );

  return {
    url:          URL.createObjectURL(blob),
    blob,
    width:        cw,
    height:       ch,
    originalSize: file.size,
    outputSize:   blob.size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
