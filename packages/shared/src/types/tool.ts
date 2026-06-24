export type ToolCategory =
  | 'image'
  | 'pdf'
  | 'document'
  | 'video'
  | 'audio'
  | 'file'
  | 'developer'
  | 'text'
  | 'seo'
  | 'color'
  | 'ai'
  | 'utility';

export type MimeType = string; // e.g. 'image/jpeg', 'application/pdf'

export interface ToolMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface ToolManifest {
  id: string;
  slug: string;
  category: ToolCategory;
  name: string;
  description: string;
  icon: string;            // Lucide icon name
  keywords: string[];
  accepts: MimeType[];
  maxFileSizeMB: number;
  maxFiles: number;
  requiresServer: boolean;
  meta: ToolMeta;
  // Engine is lazy-imported — never bundled into the shell
  engine: () => Promise<unknown>;
}
