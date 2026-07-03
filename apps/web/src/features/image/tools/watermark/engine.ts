export type WatermarkPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface WatermarkOptions {
  text:      string;
  position:  WatermarkPosition;
  fontSize:  number;
  color:     string;
  opacity:   number;   // 0–1
  padding:   number;
  bold:      boolean;
  quality:   number;
  format:    'image/jpeg' | 'image/png' | 'image/webp';
}

export const DEFAULT_OPTS: WatermarkOptions = {
  text:     '© Toolbox',
  position: 'bottom-right',
  fontSize: 32,
  color:    '#ffffff',
  opacity:  0.7,
  padding:  20,
  bold:     true,
  quality:  0.92,
  format:   'image/jpeg',
};

export interface WatermarkResult {
  url:          string;
  blob:         Blob;
  originalSize: number;
  outputSize:   number;
}

function getCoords(
  pos: WatermarkPosition,
  cw: number, ch: number,
  tw: number, th: number,
  padding: number,
): { x: number; y: number } {
  const positions: Record<WatermarkPosition, { x: number; y: number }> = {
    'top-left':      { x: padding,              y: padding + th },
    'top-center':    { x: cw / 2 - tw / 2,     y: padding + th },
    'top-right':     { x: cw - tw - padding,    y: padding + th },
    'center':        { x: cw / 2 - tw / 2,     y: ch / 2 + th / 2 },
    'bottom-left':   { x: padding,              y: ch - padding },
    'bottom-center': { x: cw / 2 - tw / 2,     y: ch - padding },
    'bottom-right':  { x: cw - tw - padding,    y: ch - padding },
  };
  return positions[pos];
}

export async function addWatermark(
  file: File,
  opts: WatermarkOptions,
): Promise<WatermarkResult> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width  = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(bitmap, 0, 0);

  const font = `${opts.bold ? 'bold ' : ''}${opts.fontSize}px Inter, sans-serif`;
  ctx.font         = font;
  ctx.globalAlpha  = opts.opacity;
  ctx.fillStyle    = opts.color;
  ctx.textBaseline = 'alphabetic';

  const metrics = ctx.measureText(opts.text);
  const tw      = metrics.width;
  const th      = opts.fontSize;

  const { x, y } = getCoords(opts.position, canvas.width, canvas.height, tw, th, opts.padding);

  // Shadow for readability on any background
  ctx.shadowColor   = opts.color === '#ffffff' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
  ctx.shadowBlur    = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillText(opts.text, x, y);

  const blob = await new Promise<Blob>(res =>
    canvas.toBlob(b => res(b!), opts.format, opts.quality)
  );

  return {
    url:          URL.createObjectURL(blob),
    blob,
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
