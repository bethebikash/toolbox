import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxSizeMB:        number;
  maxWidthOrHeight?: number;
  quality:          number;
  preserveExif:     boolean;
}

export interface CompressResult {
  file:           File;
  originalSize:   number;
  compressedSize: number;
  savedPercent:   number;
  url:            string;
}

export async function compressImage(
  file: File,
  opts: CompressOptions,
  onProgress?: (pct: number) => void,
): Promise<CompressResult> {
  const options: Parameters<typeof imageCompression>[1] = {
    maxSizeMB:      opts.maxSizeMB,
    initialQuality: opts.quality,
    preserveExif:   opts.preserveExif,
    useWebWorker:   true,
  };

  // Only set optional fields when defined — required by exactOptionalPropertyTypes
  if (opts.maxWidthOrHeight !== undefined) {
    options.maxWidthOrHeight = opts.maxWidthOrHeight;
  }
  if (onProgress !== undefined) {
    options.onProgress = onProgress;
  }

  const compressed = await imageCompression(file, options);
  const url        = URL.createObjectURL(compressed);

  return {
    file:           compressed,
    originalSize:   file.size,
    compressedSize: compressed.size,
    savedPercent:   Math.round((1 - compressed.size / file.size) * 100),
    url,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
