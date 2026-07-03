export interface CropArea {
  x:      number;
  y:      number;
  width:  number;
  height: number;
}

export interface CropOptions {
  area:    CropArea;
  quality: number;
  format:  'image/jpeg' | 'image/png' | 'image/webp';
}

export interface CropResult {
  url:          string;
  blob:         Blob;
  width:        number;
  height:       number;
  originalSize: number;
  outputSize:   number;
}

export async function cropImage(file: File, opts: CropOptions): Promise<CropResult> {
  const bitmap = await createImageBitmap(file);
  const { x, y, width, height } = opts.area;

  const canvas = document.createElement('canvas');
  canvas.width  = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, x, y, width, height, 0, 0, width, height);

  const blob = await new Promise<Blob>(res =>
    canvas.toBlob(b => res(b!), opts.format, opts.quality)
  );

  return {
    url:          URL.createObjectURL(blob),
    blob,
    width,
    height,
    originalSize: file.size,
    outputSize:   blob.size,
  };
}

export async function getImageSize(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  return { width: bitmap.width, height: bitmap.height };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
