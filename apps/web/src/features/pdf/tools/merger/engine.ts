import { PDFDocument } from 'pdf-lib';

export interface MergeResult {
  blob:      Blob;
  url:       string;
  pageCount: number;
  sizeBytes: number;
}

export async function mergePDFs(
  files: File[],
  onProgress?: (pct: number) => void,
): Promise<MergeResult> {
  const merged = await PDFDocument.create();
  const total  = files.length;

  for (let i = 0; i < total; i++) {
    const bytes = await files[i]!.arrayBuffer();
    const doc   = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
    onProgress?.(Math.round(((i + 1) / total) * 90));
  }

  const uint8 = await merged.save();
  onProgress?.(100);

  // Copy into a plain ArrayBuffer to satisfy exactOptionalPropertyTypes
  const buffer = uint8.buffer.slice(
    uint8.byteOffset,
    uint8.byteOffset + uint8.byteLength,
  ) as ArrayBuffer;

  const blob = new Blob([buffer], { type: 'application/pdf' });

  return {
    blob,
    url:       URL.createObjectURL(blob),
    pageCount: merged.getPageCount(),
    sizeBytes: buffer.byteLength,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
