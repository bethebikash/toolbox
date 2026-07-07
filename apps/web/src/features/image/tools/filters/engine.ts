export type FilterType = 'grayscale' | 'sepia' | 'invert' | 'blur' | 'sharpen' | 'brightness' | 'contrast' | 'saturate';

export interface FilterOptions {
  filter:     FilterType;
  intensity:  number;  // 0–100 (or 0–200 for brightness/contrast)
}

export interface FilterResult {
  url:          string;
  blob:         Blob;
  originalSize: number;
  outputSize:   number;
}

export const FILTER_LABELS: Record<FilterType, string> = {
  grayscale:  'Grayscale',
  sepia:      'Sepia',
  invert:     'Invert',
  blur:       'Blur',
  sharpen:    'Sharpen',
  brightness: 'Brightness',
  contrast:   'Contrast',
  saturate:   'Saturate',
};

export async function applyFilter(file: File, opts: FilterOptions): Promise<FilterResult> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width  = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;

  // Build CSS filter string
  let filterStr = '';
  const v = opts.intensity;

  switch (opts.filter) {
    case 'grayscale':  filterStr = `grayscale(${v}%)`; break;
    case 'sepia':      filterStr = `sepia(${v}%)`; break;
    case 'invert':     filterStr = `invert(${v}%)`; break;
    case 'blur':       filterStr = `blur(${(v / 100 * 10).toFixed(1)}px)`; break;
    case 'brightness': filterStr = `brightness(${v / 50})`; break;
    case 'contrast':   filterStr = `contrast(${v / 50})`; break;
    case 'saturate':   filterStr = `saturate(${v / 50})`; break;
    case 'sharpen': {
      // Sharpen via convolution kernel
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
      applyKernel(imageData, kernel, v / 100);
      ctx.putImageData(imageData, 0, 0);
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92));
      return { url: URL.createObjectURL(blob), blob, originalSize: file.size, outputSize: blob.size };
    }
  }

  ctx.filter = filterStr;
  ctx.drawImage(bitmap, 0, 0);

  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92));
  return { url: URL.createObjectURL(blob), blob, originalSize: file.size, outputSize: blob.size };
}

function applyKernel(imageData: ImageData, kernel: number[], strength: number) {
  const { data, width, height } = imageData;
  const copy = new Uint8ClampedArray(data);
  const size = Math.sqrt(kernel.length);
  const half = Math.floor(size / 2);

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = 0; ky < size; ky++) {
        for (let kx = 0; kx < size; kx++) {
          const px = ((y + ky - half) * width + (x + kx - half)) * 4;
          const w  = kernel[ky * size + kx]!;
          r += copy[px]!     * w;
          g += copy[px + 1]! * w;
          b += copy[px + 2]! * w;
        }
      }
      const i  = (y * width + x) * 4;
      const s  = strength;
      data[i]!     = copy[i]!     * (1 - s) + Math.min(255, Math.max(0, r)) * s;
      data[i + 1]! = copy[i + 1]! * (1 - s) + Math.min(255, Math.max(0, g)) * s;
      data[i + 2]! = copy[i + 2]! * (1 - s) + Math.min(255, Math.max(0, b)) * s;
    }
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
