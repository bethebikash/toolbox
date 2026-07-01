import { PDFDocument } from 'pdf-lib';

export interface CompressResult {
  blob:          Blob;
  url:           string;
  originalSize:  number;
  outputSize:    number;
  savedPercent:  number;
  pageCount:     number;
}

export type CompressionLevel = 'low' | 'medium' | 'high';

export interface CompressOptions {
  level: CompressionLevel;
}

// pdf-lib doesn't natively compress images inside PDFs,
// but we can re-save with object streams which reduces size significantly
// for text-heavy and structure-heavy PDFs.
export async function compressPDF(
  file: File,
  _opts: CompressOptions,
  onProgress?: (pct: number) => void,
): Promise<CompressResult> {
  onProgress?.(10);
  const bytes = await file.arrayBuffer();

  onProgress?.(30);
  const doc = await PDFDocument.load(bytes, {
    updateMetadata: false,
  });

  onProgress?.(60);

  // Re-save with object compression enabled
  const saved  = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  onProgress?.(90);

  const buffer = saved.buffer.slice(
    saved.byteOffset,
    saved.byteOffset + saved.byteLength,
  ) as ArrayBuffer;

  const blob = new Blob([buffer], { type: 'application/pdf' });
  onProgress?.(100);

  return {
    blob,
    url:          URL.createObjectURL(blob),
    originalSize: file.size,
    outputSize:   buffer.byteLength,
    savedPercent: Math.max(0, Math.round((1 - buffer.byteLength / file.size) * 100)),
    pageCount:    doc.getPageCount(),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
