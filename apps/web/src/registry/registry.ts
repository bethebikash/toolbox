import type { ToolManifest } from '@toolbox/shared/types';

// Video / Audio
import { extractAudioManifest } from '../features/audio/tools/extract-audio/manifest';
import { videoCompressorManifest } from '../features/video/tools/compressor/manifest';
import { videoTrimmerManifest } from '../features/video/tools/trimmer/manifest';

// Image
import { bulkImageCompressorManifest } from '../features/image/tools/bulk-compressor/manifest';
import { imageConverterManifest } from '../features/image/tools/converter/manifest';
import { imageCropManifest } from '../features/image/tools/crop/manifest';
import { exifViewerManifest } from '../features/image/tools/exif-viewer/manifest';
import { imageFiltersManifest } from '../features/image/tools/filters/manifest';
import { flipRotateManifest } from '../features/image/tools/flip-rotate/manifest';
import { imageResizerManifest } from '../features/image/tools/resizer/manifest';
import { imageToBase64Manifest } from '../features/image/tools/to-base64/manifest';
import { watermarkManifest } from '../features/image/tools/watermark/manifest';

// PDF
import { pdfCompressorManifest } from '../features/pdf/tools/compressor/manifest';
import { pdfSplitterManifest } from '../features/pdf/tools/splitter/manifest';
import { pdfToImagesManifest } from '../features/pdf/tools/to-images/manifest';

// Developer
import { colorConverterManifest } from '../features/developer/tools/color-converter/manifest';
import { cssMinifierManifest } from '../features/developer/tools/css-minifier/manifest';
import { diffToolManifest } from '../features/developer/tools/diff-tool/manifest';
import { hashGeneratorManifest } from '../features/developer/tools/hash-generator/manifest';
import { htmlMinifierManifest } from '../features/developer/tools/html-minifier/manifest';
import { jsMinifierManifest } from '../features/developer/tools/js-minifier/manifest';
import { cronParserManifest }            from '../features/developer/tools/cron-parser/manifest';
import { jsonToTypeScriptManifest } from '../features/developer/tools/json-to-typescript/manifest';
import { jwtDecoderManifest } from '../features/developer/tools/jwt-decoder/manifest';
import { numberFormatterManifest } from '../features/developer/tools/number-formatter/manifest';
import { passwordGeneratorManifest } from '../features/developer/tools/password-generator/manifest';
import { passwordStrengthManifest } from '../features/developer/tools/password-strength/manifest';
import { regexTesterManifest } from '../features/developer/tools/regex-tester/manifest';
import { urlEncoderManifest } from '../features/developer/tools/url-encoder/manifest';
import { xmlFormatterManifest } from '../features/developer/tools/xml-formatter/manifest';

// Text
import { caseConverterManifest } from '../features/text/tools/case-converter/manifest';
import { findReplaceManifest } from '../features/text/tools/find-replace/manifest';
import { loremIpsumManifest } from '../features/text/tools/lorem-ipsum/manifest';
import { markdownConverterManifest } from '../features/text/tools/markdown-converter/manifest';
import { readingTimeManifest } from '../features/text/tools/reading-time/manifest';
import { removeDuplicatesManifest } from '../features/text/tools/remove-duplicates/manifest';
import { removeSpacesManifest } from '../features/text/tools/remove-spaces/manifest';
import { textReverserManifest } from '../features/text/tools/text-reverser/manifest';
import { textSorterManifest } from '../features/text/tools/text-sorter/manifest';
import { textStatisticsManifest } from '../features/text/tools/text-statistics/manifest';
import { textToSlugManifest } from '../features/text/tools/text-to-slug/manifest';
import { unicodeConverterManifest } from '../features/text/tools/unicode-converter/manifest';

// Color & Design
import { barcodeGeneratorManifest } from '../features/color/tools/barcode-generator/manifest';
import { colorPaletteManifest }          from '../features/color/tools/color-palette/manifest';
import { colorPickerManifest } from '../features/color/tools/color-picker/manifest';
import { contrastCheckerManifest } from '../features/color/tools/contrast-checker/manifest';
import { faviconGeneratorManifest } from '../features/color/tools/favicon-generator/manifest';
import { gradientGeneratorManifest } from '../features/color/tools/gradient-generator/manifest';
import { qrGeneratorManifest } from '../features/color/tools/qr-generator/manifest';

// Utility
import { ageCalculatorManifest } from '../features/utility/tools/age-calculator/manifest';
import { aspectRatioManifest } from '../features/utility/tools/aspect-ratio/manifest';
import { baseConverterManifest } from '../features/utility/tools/base-converter/manifest';
import { bmiCalculatorManifest } from '../features/utility/tools/bmi-calculator/manifest';
import { charFrequencyManifest } from '../features/utility/tools/char-frequency/manifest';
import { countdownTimerManifest } from '../features/utility/tools/countdown-timer/manifest';
import { currencyConverterManifest } from '../features/utility/tools/currency-converter/manifest';
import { mortgageCalculatorManifest }    from '../features/utility/tools/mortgage-calculator/manifest';
import { calorieCalculatorManifest }     from '../features/utility/tools/calorie-calculator/manifest';
import { dateCalculatorManifest } from '../features/utility/tools/date-calculator/manifest';
import { loanCalculatorManifest } from '../features/utility/tools/loan-calculator/manifest';
import { numberToWordsManifest } from '../features/utility/tools/number-to-words/manifest';
import { percentageCalculatorManifest } from '../features/utility/tools/percentage-calculator/manifest';
import { randomGeneratorManifest } from '../features/utility/tools/random-generator/manifest';
import { speedCalculatorManifest } from '../features/utility/tools/speed-calculator/manifest';
import { timestampConverterManifest } from '../features/utility/tools/timestamp-converter/manifest';
import { tipCalculatorManifest } from '../features/utility/tools/tip-calculator/manifest';
import { unitConverterManifest } from '../features/utility/tools/unit-converter/manifest';

// SEO
import { metaTagGeneratorManifest } from '../features/seo/tools/meta-tag-generator/manifest';
import { ogPreviewManifest } from '../features/seo/tools/og-preview/manifest';
import { robotsGeneratorManifest } from '../features/seo/tools/robots-generator/manifest';
import { serpPreviewManifest } from '../features/seo/tools/serp-preview/manifest';
import { sitemapGeneratorManifest } from '../features/seo/tools/sitemap-generator/manifest';

const manifests: ToolManifest[] = [
  // ── Image (10) ────────────────────────────────────────────────────────────
  {
    id: 'image-compressor',
    slug: '/tools/image/compressor',
    category: 'image',
    name: 'Image Compressor',
    description: 'Reduce image file size without visible quality loss.',
    icon: 'image-down',
    keywords: ['compress', 'optimize', 'jpg', 'png', 'webp'],
    accepts: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxFileSizeMB: 50,
    maxFiles: 20,
    requiresServer: false,
    engine: () => import('../features/image/tools/compressor/engine'),
    meta: { title: 'Free Image Compressor', description: 'Compress images up to 90%.' },
  },
  imageResizerManifest,
  imageConverterManifest,
  bulkImageCompressorManifest,
  flipRotateManifest,
  watermarkManifest,
  imageCropManifest,
  imageToBase64Manifest,
  exifViewerManifest,
  imageFiltersManifest,

  // ── PDF (4) ────────────────────────────────────────────────────────────────
  {
    id: 'pdf-merger',
    slug: '/tools/pdf/merger',
    category: 'pdf',
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into one document.',
    icon: 'file-plus',
    keywords: ['merge', 'combine', 'pdf'],
    accepts: ['application/pdf'],
    maxFileSizeMB: 100,
    maxFiles: 50,
    requiresServer: false,
    engine: () => import('../features/pdf/tools/merger/engine'),
    meta: { title: 'Free PDF Merger', description: 'Merge PDFs online.' },
  },
  pdfSplitterManifest,
  pdfCompressorManifest,
  pdfToImagesManifest,

  // ── Developer (11) ────────────────────────────────────────────────────────
  {
    id: 'json-formatter',
    slug: '/tools/developer/json-formatter',
    category: 'developer',
    name: 'JSON Formatter',
    description: 'Format, validate and minify JSON.',
    icon: 'braces',
    keywords: ['json', 'format', 'validate'],
    accepts: [],
    maxFileSizeMB: 0,
    maxFiles: 0,
    requiresServer: false,
    engine: () => import('../features/developer/tools/json-formatter/engine'),
    meta: { title: 'JSON Formatter', description: 'Format JSON.' },
  },
  {
    id: 'base64-encoder',
    slug: '/tools/developer/base64',
    category: 'developer',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode and decode Base64 strings.',
    icon: 'binary',
    keywords: ['base64', 'encode', 'decode'],
    accepts: [],
    maxFileSizeMB: 10,
    maxFiles: 1,
    requiresServer: false,
    engine: () => import('../features/developer/tools/base64/engine'),
    meta: { title: 'Base64 Encoder', description: 'Encode or decode Base64.' },
  },
  hashGeneratorManifest,
  passwordGeneratorManifest,
  urlEncoderManifest,
  cssMinifierManifest,
  jsMinifierManifest,
  jwtDecoderManifest,
  cronParserManifest,
  jsonToTypeScriptManifest,
  numberFormatterManifest,
  passwordStrengthManifest,
  diffToolManifest,
  colorConverterManifest,
  htmlMinifierManifest,
  xmlFormatterManifest,
  regexTesterManifest,

  // ── Text (11) ─────────────────────────────────────────────────────────────
  {
    id: 'word-counter',
    slug: '/tools/text/word-counter',
    category: 'text',
    name: 'Word Counter',
    description: 'Count words, characters, sentences and reading time.',
    icon: 'case-sensitive',
    keywords: ['word', 'count', 'character'],
    accepts: [],
    maxFileSizeMB: 0,
    maxFiles: 0,
    requiresServer: false,
    engine: () => import('../features/text/tools/word-counter/engine'),
    meta: { title: 'Word Counter', description: 'Count words online.' },
  },
  textStatisticsManifest,
  findReplaceManifest,
  markdownConverterManifest,
  caseConverterManifest,
  textReverserManifest,
  removeDuplicatesManifest,
  removeSpacesManifest,
  textSorterManifest,
  findReplaceManifest,
  textToSlugManifest,
  loremIpsumManifest,
  readingTimeManifest,
  unicodeConverterManifest,

  // ── Color & Design (5) ────────────────────────────────────────────────────
  contrastCheckerManifest,
  qrGeneratorManifest,
  colorPaletteManifest,
  colorPickerManifest,
  faviconGeneratorManifest,
  gradientGeneratorManifest,
  barcodeGeneratorManifest,

  // ── Utility (11) ──────────────────────────────────────────────────────────
  {
    id: 'uuid-generator',
    slug: '/tools/utility/uuid-generator',
    category: 'utility',
    name: 'UUID Generator',
    description: 'Generate random UUIDs (v4) instantly.',
    icon: 'fingerprint',
    keywords: ['uuid', 'guid', 'random'],
    accepts: [],
    maxFileSizeMB: 0,
    maxFiles: 0,
    requiresServer: false,
    engine: () => import('../features/utility/tools/uuid-generator/engine'),
    meta: { title: 'UUID Generator', description: 'Generate UUIDs online.' },
  },
  ageCalculatorManifest,
  percentageCalculatorManifest,
  unitConverterManifest,
  bmiCalculatorManifest,
  countdownTimerManifest,
  mortgageCalculatorManifest,
  calorieCalculatorManifest,
  dateCalculatorManifest,
  speedCalculatorManifest,
  baseConverterManifest,
  aspectRatioManifest,
  timestampConverterManifest,
  tipCalculatorManifest,
  loanCalculatorManifest,
  randomGeneratorManifest,
  numberToWordsManifest,
  charFrequencyManifest,
  currencyConverterManifest,

  // ── Video (2) ─────────────────────────────────────────────────────────────
  videoCompressorManifest,
  videoTrimmerManifest,

  // ── Audio (1) ─────────────────────────────────────────────────────────────
  extractAudioManifest,

  // ── SEO (5) ───────────────────────────────────────────────────────────────
  metaTagGeneratorManifest,
  robotsGeneratorManifest,
  ogPreviewManifest,
  serpPreviewManifest,
  sitemapGeneratorManifest,
];

export const registry = new Map<string, ToolManifest>(manifests.map(m => [m.id, m]));
export const toolsByCategory = manifests.reduce<Record<string, ToolManifest[]>>((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category]!.push(tool);
  return acc;
}, {});
export const allTools = manifests;
export const allSlugs = manifests.map(t => t.slug);
export function getToolById(id: string): ToolManifest | undefined {
  return registry.get(id);
}
export function getToolsByCategory(category: string): ToolManifest[] {
  return toolsByCategory[category] ?? [];
}
export function searchTools(query: string): ToolManifest[] {
  if (!query.trim()) return manifests;
  const q = query.toLowerCase();
  return manifests.filter(
    t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some(k => k.includes(q))
  );
}
