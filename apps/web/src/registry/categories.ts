import type { ToolCategory } from '@toolbox/shared/types';

export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  color: string;
  textColor: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'image',
    label: 'Image Tools',
    description: 'Compress, resize, convert, and edit images in any format.',
    color: '#EFF6FF',
    textColor: '#1E3A5F',
  },
  {
    id: 'pdf',
    label: 'PDF Tools',
    description: 'Merge, split, compress, convert and secure PDF files.',
    color: '#F0FDF4',
    textColor: '#064E3B',
  },
  {
    id: 'video',
    label: 'Video Tools',
    description: 'Convert, compress, trim and edit video files.',
    color: '#FFF7ED',
    textColor: '#431407',
  },
  {
    id: 'audio',
    label: 'Audio Tools',
    description: 'Convert, cut, join and adjust audio files.',
    color: '#FDF4FF',
    textColor: '#3B0764',
  },
  {
    id: 'developer',
    label: 'Developer Tools',
    description: 'JSON, Base64, JWT, hashes and more for developers.',
    color: '#F0F9FF',
    textColor: '#0C4A6E',
  },
  {
    id: 'text',
    label: 'Text Tools',
    description: 'Word count, case conversion, markdown, and text utilities.',
    color: '#FEFCE8',
    textColor: '#422006',
  },
  {
    id: 'seo',
    label: 'SEO Tools',
    description: 'Meta tags, sitemaps, robots.txt and page analysis.',
    color: '#FFF1F2',
    textColor: '#881337',
  },
  {
    id: 'color',
    label: 'Color & Design',
    description: 'Color picker, palette generator, QR codes and favicons.',
    color: '#F5F3FF',
    textColor: '#2E1065',
  },
  {
    id: 'ai',
    label: 'AI Tools',
    description: 'AI-powered image enhancement, writing, and translation.',
    color: '#ECFDF5',
    textColor: '#022C22',
  },
  {
    id: 'utility',
    label: 'Utility Tools',
    description: 'Unit converter, calculators, UUID generator and more.',
    color: '#FFF8F1',
    textColor: '#431407',
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.id, c]));
