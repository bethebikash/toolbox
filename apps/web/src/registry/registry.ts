import type { ToolManifest } from '@toolbox/shared/types';
import { videoCompressorManifest } from '../features/video/tools/compressor/manifest';

const manifests: ToolManifest[] = [
  // ── Image tools ──────────────────────────────────────────────
  {
    id:             'image-compressor',
    slug:           '/tools/image/compressor',
    category:       'image',
    name:           'Image Compressor',
    description:    'Reduce image file size without visible quality loss.',
    icon:           'image-down',
    keywords:       ['compress', 'optimize', 'reduce', 'shrink', 'jpg', 'png', 'webp'],
    accepts:        ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxFileSizeMB:  50,
    maxFiles:       20,
    requiresServer: false,
    engine:         () => import('../features/image/tools/compressor/engine'),
    meta: {
      title:       'Free Image Compressor — Compress JPG, PNG, WebP Online',
      description: 'Compress images up to 90% with no visible quality loss. Runs entirely in your browser.',
    },
  },
  {
    id:             'image-resizer',
    slug:           '/tools/image/resizer',
    category:       'image',
    name:           'Image Resizer',
    description:    'Resize images to any dimension while maintaining aspect ratio.',
    icon:           'scaling',
    keywords:       ['resize', 'scale', 'dimensions', 'width', 'height'],
    accepts:        ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxFileSizeMB:  50,
    maxFiles:       20,
    requiresServer: false,
    engine:         () => import('../features/image/tools/resizer/engine'),
    meta: {
      title:       'Free Image Resizer — Resize Images Online',
      description: 'Resize images to exact dimensions or by percentage. Fast, free, and private.',
    },
  },
  {
    id:             'image-converter',
    slug:           '/tools/image/converter',
    category:       'image',
    name:           'Image Converter',
    description:    'Convert images between JPG, PNG, WebP, and AVIF formats.',
    icon:           'file-image',
    keywords:       ['convert', 'jpg', 'png', 'webp', 'avif', 'format'],
    accepts:        ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    maxFileSizeMB:  50,
    maxFiles:       20,
    requiresServer: false,
    engine:         () => import('../features/image/tools/converter/engine'),
    meta: {
      title:       'Free Image Converter — Convert JPG, PNG, WebP Online',
      description: 'Convert images between any format instantly. No upload required.',
    },
  },

  // ── PDF tools ────────────────────────────────────────────────
  {
    id:             'pdf-merger',
    slug:           '/tools/pdf/merger',
    category:       'pdf',
    name:           'PDF Merger',
    description:    'Combine multiple PDF files into one document.',
    icon:           'file-plus',
    keywords:       ['merge', 'combine', 'join', 'pdf'],
    accepts:        ['application/pdf'],
    maxFileSizeMB:  100,
    maxFiles:       50,
    requiresServer: false,
    engine:         () => import('../features/pdf/tools/merger/engine'),
    meta: {
      title:       'Free PDF Merger — Combine PDF Files Online',
      description: 'Merge multiple PDFs into one file. Drag to reorder pages. 100% private.',
    },
  },
  {
    id:             'pdf-splitter',
    slug:           '/tools/pdf/splitter',
    category:       'pdf',
    name:           'PDF Splitter',
    description:    'Split a PDF into individual pages or page ranges.',
    icon:           'scissors',
    keywords:       ['split', 'extract', 'pages', 'pdf'],
    accepts:        ['application/pdf'],
    maxFileSizeMB:  100,
    maxFiles:       1,
    requiresServer: false,
    engine:         () => import('../features/pdf/tools/splitter/engine'),
    meta: {
      title:       'Free PDF Splitter — Split PDF Files Online',
      description: 'Split PDFs by page range or extract individual pages. Runs in your browser.',
    },
  },
  {
    id:             'pdf-compressor',
    slug:           '/tools/pdf/compressor',
    category:       'pdf',
    name:           'PDF Compressor',
    description:    'Reduce PDF file size while preserving quality.',
    icon:           'file-minus',
    keywords:       ['compress', 'reduce', 'optimize', 'pdf'],
    accepts:        ['application/pdf'],
    maxFileSizeMB:  100,
    maxFiles:       10,
    requiresServer: false,
    engine:         () => import('../features/pdf/tools/compressor/engine'),
    meta: {
      title:       'Free PDF Compressor — Compress PDF Files Online',
      description: 'Reduce PDF size without losing quality. Fast and private.',
    },
  },

  // ── Developer tools ──────────────────────────────────────────
  {
    id:             'json-formatter',
    slug:           '/tools/developer/json-formatter',
    category:       'developer',
    name:           'JSON Formatter',
    description:    'Format, validate and minify JSON with syntax highlighting.',
    icon:           'braces',
    keywords:       ['json', 'format', 'beautify', 'validate', 'minify', 'pretty'],
    accepts:        [],
    maxFileSizeMB:  0,
    maxFiles:       0,
    requiresServer: false,
    engine:         () => import('../features/developer/tools/json-formatter/engine'),
    meta: {
      title:       'Free JSON Formatter & Validator Online',
      description: 'Format, validate, and minify JSON instantly. Syntax highlighting included.',
    },
  },
  {
    id:             'base64-encoder',
    slug:           '/tools/developer/base64',
    category:       'developer',
    name:           'Base64 Encoder / Decoder',
    description:    'Encode and decode Base64 strings and files.',
    icon:           'binary',
    keywords:       ['base64', 'encode', 'decode', 'binary'],
    accepts:        [],
    maxFileSizeMB:  10,
    maxFiles:       1,
    requiresServer: false,
    engine:         () => import('../features/developer/tools/base64/engine'),
    meta: {
      title:       'Free Base64 Encoder & Decoder Online',
      description: 'Encode or decode Base64 strings and files instantly in your browser.',
    },
  },

  // ── Text tools ───────────────────────────────────────────────
  {
    id:             'word-counter',
    slug:           '/tools/text/word-counter',
    category:       'text',
    name:           'Word Counter',
    description:    'Count words, characters, sentences and reading time.',
    icon:           'case-sensitive',
    keywords:       ['word', 'count', 'character', 'reading', 'time'],
    accepts:        [],
    maxFileSizeMB:  0,
    maxFiles:       0,
    requiresServer: false,
    engine:         () => import('../features/text/tools/word-counter/engine'),
    meta: {
      title:       'Free Word Counter Online',
      description: 'Count words, characters, sentences, and estimate reading time instantly.',
    },
  },

  // ── Utility tools ────────────────────────────────────────────
  {
    id:             'uuid-generator',
    slug:           '/tools/utility/uuid-generator',
    category:       'utility',
    name:           'UUID Generator',
    description:    'Generate random UUIDs (v4) instantly.',
    icon:           'fingerprint',
    keywords:       ['uuid', 'guid', 'random', 'generate', 'unique'],
    accepts:        [],
    maxFileSizeMB:  0,
    maxFiles:       0,
    requiresServer: false,
    engine:         () => import('../features/utility/tools/uuid-generator/engine'),
    meta: {
      title:       'Free UUID Generator Online',
      description: 'Generate random UUID v4 strings instantly. No server required.',
    },
  },

  // ── Video tools ──────────────────────────────────────────────
  videoCompressorManifest,
];

export const registry = new Map<string, ToolManifest>(
  manifests.map(m => [m.id, m])
);

export const toolsByCategory = manifests.reduce<Record<string, ToolManifest[]>>(
  (acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category]!.push(tool);
    return acc;
  },
  {}
);

export const allTools  = manifests;
export const allSlugs  = manifests.map(t => t.slug);

export function getToolById(id: string): ToolManifest | undefined {
  return registry.get(id);
}

export function getToolsByCategory(category: string): ToolManifest[] {
  return toolsByCategory[category] ?? [];
}

export function searchTools(query: string): ToolManifest[] {
  if (!query.trim()) return manifests;
  const q = query.toLowerCase();
  return manifests.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.includes(q))
  );
}
