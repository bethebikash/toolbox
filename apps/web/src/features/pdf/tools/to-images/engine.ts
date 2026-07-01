import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

export interface PageImage {
  pageNumber: number;
  url:        string;
  width:      number;
  height:     number;
  blob:       Blob;
}

export interface ToImagesOptions {
  scale:   number;
  format:  'image/jpeg' | 'image/png';
  quality: number;
}

export async function pdfToImages(
  file: File,
  opts: ToImagesOptions,
  onProgress?: (pct: number) => void,
): Promise<PageImage[]> {
  const bytes   = await file.arrayBuffer();
  const pdf     = await pdfjsLib.getDocument({ data: bytes }).promise;
  const total   = pdf.numPages;
  const results: PageImage[] = [];

  for (let i = 1; i <= total; i++) {
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: opts.scale });

    const canvas  = document.createElement('canvas');
    canvas.width  = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d')!;

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;

    const blob = await new Promise<Blob>(resolve => {
      canvas.toBlob(b => resolve(b!), opts.format, opts.quality);
    });

    results.push({
      pageNumber: i,
      url:        URL.createObjectURL(blob),
      width:      canvas.width,
      height:     canvas.height,
      blob,
    });

    page.cleanup();
    onProgress?.(Math.round((i / total) * 100));
  }

  return results;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
