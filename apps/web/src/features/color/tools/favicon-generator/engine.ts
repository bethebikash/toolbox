export type FaviconSize = 16 | 32 | 48 | 64 | 128 | 256;
export const FAVICON_SIZES: FaviconSize[] = [16, 32, 48, 64, 128, 256];

export interface FaviconOptions {
  text:       string;
  bgColor:    string;
  textColor:  string;
  fontSize:   number;  // as fraction of size (0.4–0.8)
  bold:       boolean;
  shape:      'square' | 'circle' | 'rounded';
  radius:     number;  // for rounded — fraction of size
}

export const DEFAULT_OPTS: FaviconOptions = {
  text:      'T',
  bgColor:   '#2E7CF6',
  textColor: '#ffffff',
  fontSize:  0.6,
  bold:      true,
  shape:     'rounded',
  radius:    0.2,
};

export interface FaviconResult {
  size:      FaviconSize;
  url:       string;
  blob:      Blob;
}

export function renderFaviconToCanvas(
  canvas: HTMLCanvasElement,
  opts: FaviconOptions,
  size: number,
): void {
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Background shape
  ctx.fillStyle = opts.bgColor;
  ctx.beginPath();

  if (opts.shape === 'circle') {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else if (opts.shape === 'rounded') {
    const r = size * opts.radius;
    ctx.roundRect(0, 0, size, size, r);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.fill();

  // Text
  if (opts.text) {
    const fontSize = Math.round(size * opts.fontSize);
    ctx.font        = `${opts.bold ? 'bold ' : ''}${fontSize}px Inter, Arial, sans-serif`;
    ctx.fillStyle   = opts.textColor;
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.text.slice(0, 2), size / 2, size / 2);
  }
}

export async function generateFavicons(
  opts: FaviconOptions,
  sizes: FaviconSize[] = FAVICON_SIZES,
): Promise<FaviconResult[]> {
  return Promise.all(sizes.map(size => new Promise<FaviconResult>(resolve => {
    const canvas = document.createElement('canvas');
    renderFaviconToCanvas(canvas, opts, size);
    canvas.toBlob(blob => {
      resolve({ size, url: URL.createObjectURL(blob!), blob: blob! });
    }, 'image/png');
  })));
}

export const meta = { ready: true };
