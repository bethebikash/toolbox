import QRCode from 'qrcode';

export type QRErrorLevel = 'L' | 'M' | 'Q' | 'H';

export interface QROptions {
  size:       number;
  margin:     number;
  errorLevel: QRErrorLevel;
  darkColor:  string;
  lightColor: string;
}

export const DEFAULT_OPTS: QROptions = {
  size:       300,
  margin:     2,
  errorLevel: 'M',
  darkColor:  '#000000',
  lightColor: '#ffffff',
};

export async function generateQR(text: string, opts: QROptions): Promise<string> {
  return QRCode.toDataURL(text, {
    width:            opts.size,
    margin:           opts.margin,
    errorCorrectionLevel: opts.errorLevel,
    color: {
      dark:  opts.darkColor,
      light: opts.lightColor,
    },
  });
}

export async function generateQRSVG(text: string, opts: QROptions): Promise<string> {
  return QRCode.toString(text, {
    type:   'svg',
    margin: opts.margin,
    errorCorrectionLevel: opts.errorLevel,
    color: {
      dark:  opts.darkColor,
      light: opts.lightColor,
    },
  });
}

export const meta = { ready: true };
