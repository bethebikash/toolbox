import { PDFDocument } from 'pdf-lib';

export interface SplitResult {
  filename:  string;
  blob:      Blob;
  url:       string;
  pages:     number;
  sizeBytes: number;
}

export type SplitMode = 'all' | 'range' | 'every';

export interface SplitOptions {
  mode:       SplitMode;
  range?:     string;   // e.g. "1-3,5,7-9"
  everyN?:    number;   // split every N pages
}

export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc   = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export function parseRanges(rangeStr: string, totalPages: number): number[][] {
  const groups: number[][] = [];
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr ?? '1'));
      const end   = Math.min(totalPages, parseInt(endStr ?? String(totalPages)));
      if (start <= end) {
        groups.push(Array.from({ length: end - start + 1 }, (_, i) => start + i));
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= 1 && n <= totalPages) {
        groups.push([n]);
      }
    }
  }
  return groups;
}

async function extractPages(
  sourceBytes: ArrayBuffer,
  pages: number[],  // 1-indexed
  filename: string,
): Promise<SplitResult> {
  const src    = await PDFDocument.load(sourceBytes);
  const doc    = await PDFDocument.create();
  const copied = await doc.copyPages(src, pages.map(p => p - 1));
  copied.forEach(p => doc.addPage(p));

  const bytes  = await doc.save();
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob   = new Blob([buffer], { type: 'application/pdf' });

  return {
    filename,
    blob,
    url:       URL.createObjectURL(blob),
    pages:     pages.length,
    sizeBytes: buffer.byteLength,
  };
}

export async function splitPDF(
  file: File,
  opts: SplitOptions,
  onProgress?: (pct: number) => void,
): Promise<SplitResult[]> {
  const bytes      = await file.arrayBuffer();
  const doc        = await PDFDocument.load(bytes);
  const total      = doc.getPageCount();
  const baseName   = file.name.replace(/\.pdf$/i, '');
  const results:   SplitResult[] = [];

  let groups: number[][] = [];

  if (opts.mode === 'all') {
    groups = Array.from({ length: total }, (_, i) => [i + 1]);
  } else if (opts.mode === 'every' && opts.everyN) {
    for (let i = 0; i < total; i += opts.everyN) {
      groups.push(Array.from({ length: Math.min(opts.everyN, total - i) }, (_, j) => i + j + 1));
    }
  } else if (opts.mode === 'range' && opts.range) {
    groups = parseRanges(opts.range, total);
  }

  for (let i = 0; i < groups.length; i++) {
    const pages    = groups[i]!;
    const label    = groups.length === 1
      ? baseName
      : pages.length === 1
        ? `${baseName}_page${pages[0]}`
        : `${baseName}_pages${pages[0]}-${pages[pages.length - 1]}`;

    const result = await extractPages(bytes, pages, `${label}.pdf`);
    results.push(result);
    onProgress?.(Math.round(((i + 1) / groups.length) * 100));
  }

  return results;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
