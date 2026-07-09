function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export interface AspectRatioResult {
  ratio:        string;
  decimal:      number;
  width:        number;
  height:       number;
  commonName:   string;
}

const COMMON_RATIOS: Record<string, string> = {
  '1:1': 'Square', '4:3': 'Classic TV', '16:9': 'Widescreen HD',
  '16:10': 'Widescreen Monitor', '21:9': 'Ultra-wide',
  '3:2': 'DSLR / 35mm Film', '2:3': 'Portrait', '9:16': 'Mobile Portrait',
  '4:5': 'Instagram Portrait', '1:2': 'Tall', '2:1': 'Wide Banner',
  '3:4': 'Classic Portrait', '5:4': 'Large Format',
};

export function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  const d     = gcd(Math.round(width), Math.round(height));
  const rw    = Math.round(width) / d;
  const rh    = Math.round(height) / d;
  const ratio = `${rw}:${rh}`;
  return {
    ratio,
    decimal:    Math.round((width / height) * 1000) / 1000,
    width:      Math.round(width),
    height:     Math.round(height),
    commonName: COMMON_RATIOS[ratio] ?? '',
  };
}

export function scaleToWidth(ratio: AspectRatioResult, newWidth: number): { width: number; height: number } {
  const [rw, rh] = ratio.ratio.split(':').map(Number);
  return { width: newWidth, height: Math.round(newWidth * rh! / rw!) };
}

export function scaleToHeight(ratio: AspectRatioResult, newHeight: number): { width: number; height: number } {
  const [rw, rh] = ratio.ratio.split(':').map(Number);
  return { width: Math.round(newHeight * rw! / rh!), height: newHeight };
}

export const COMMON_SIZES: { label: string; w: number; h: number }[] = [
  { label: '1920×1080 (FHD)',    w: 1920, h: 1080 },
  { label: '2560×1440 (QHD)',    w: 2560, h: 1440 },
  { label: '3840×2160 (4K)',     w: 3840, h: 2160 },
  { label: '1280×720 (HD)',      w: 1280, h: 720  },
  { label: '1080×1920 (Mobile)', w: 1080, h: 1920 },
  { label: '1200×630 (OG)',      w: 1200, h: 630  },
  { label: '800×600 (XGA)',      w: 800,  h: 600  },
  { label: '1024×768 (XGA+)',    w: 1024, h: 768  },
];

export const meta = { ready: true };
