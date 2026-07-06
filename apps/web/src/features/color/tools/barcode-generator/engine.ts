export type BarcodeFormat =
  | 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39'
  | 'ITF14' | 'MSI' | 'pharmacode';

export const FORMAT_LABELS: Record<BarcodeFormat, string> = {
  CODE128:    'Code 128 (general)',
  EAN13:      'EAN-13',
  EAN8:       'EAN-8',
  UPC:        'UPC-A',
  CODE39:     'Code 39',
  ITF14:      'ITF-14',
  MSI:        'MSI',
  pharmacode: 'Pharmacode',
};

export const FORMAT_EXAMPLES: Record<BarcodeFormat, string> = {
  CODE128:    'Hello World',
  EAN13:      '5901234123457',
  EAN8:       '96385074',
  UPC:        '012345678905',
  CODE39:     'CODE39',
  ITF14:      '12345678901231',
  MSI:        '1234567',
  pharmacode: '1234',
};

export interface BarcodeOptions {
  format:      BarcodeFormat;
  lineColor:   string;
  background:  string;
  width:       number;
  height:      number;
  displayValue: boolean;
  fontSize:    number;
}

export const DEFAULT_OPTS: BarcodeOptions = {
  format:       'CODE128',
  lineColor:    '#000000',
  background:   '#ffffff',
  width:        2,
  height:       100,
  displayValue: true,
  fontSize:     20,
};

export const meta = { ready: true };
