import imageCompression from 'browser-image-compression';

export type ResizeMode = 'exact' | 'fit' | 'percentage';

export interface ResizeOptions {
  mode:       ResizeMode;
  width?:     number;
  height?:    number;
  percentage?: number;
  quality:    number;
}

export interface ResizeResult {
  file:          File;
  url:           string;
  originalSize:  number;
  outputSize:    number;
  originalW:     number;
  originalH:     number;
  outputW:       number;
  outputH:       number;
}

export async function getImageDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function resizeImage(
  file: File,
  opts: ResizeOptions,
  onProgress?: (pct: number) => void,
): Promise<ResizeResult> {
  const { w: origW, h: origH } = await getImageDimensions(file);

  let targetW: number | undefined;
  let targetH: number | undefined;

  if (opts.mode === 'percentage' && opts.percentage) {
    targetW = Math.round(origW * opts.percentage / 100);
    targetH = Math.round(origH * opts.percentage / 100);
  } else if (opts.mode === 'exact') {
    targetW = opts.width;
    targetH = opts.height;
  } else {
    // fit — maintain aspect ratio within bounds
    if (opts.width && opts.height) {
      const ratio = Math.min(opts.width / origW, opts.height / origH);
      targetW = Math.round(origW * ratio);
      targetH = Math.round(origH * ratio);
    } else if (opts.width) {
      targetW = opts.width;
    } else if (opts.height) {
      targetH = opts.height;
    }
  }

  const options: Parameters<typeof imageCompression>[1] = {
    initialQuality: opts.quality,
    useWebWorker:   true,
  };

  if (targetW !== undefined) options.maxWidthOrHeight = Math.max(targetW, targetH ?? targetW);
  if (onProgress !== undefined) options.onProgress = onProgress;

  const compressed = await imageCompression(file, options);
  const { w: outW, h: outH } = await getImageDimensions(compressed);

  return {
    file:         compressed,
    url:          URL.createObjectURL(compressed),
    originalSize: file.size,
    outputSize:   compressed.size,
    originalW:    origW,
    originalH:    origH,
    outputW:      outW,
    outputH:      outH,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
