import type { ToolManifest } from '@toolbox/shared/types';
import { videoCompressorManifest }  from '../features/video/tools/compressor/manifest';
import { hashGeneratorManifest }    from '../features/developer/tools/hash-generator/manifest';
import { passwordGeneratorManifest } from '../features/developer/tools/password-generator/manifest';
import { urlEncoderManifest }       from '../features/developer/tools/url-encoder/manifest';

const manifests: ToolManifest[] = [
  // ── Image ─────────────────────────────────────────────────────────────────
  { id:'image-compressor', slug:'/tools/image/compressor', category:'image', name:'Image Compressor', description:'Reduce image file size without visible quality loss.', icon:'image-down', keywords:['compress','optimize','reduce','jpg','png','webp'], accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:20, requiresServer:false, engine:()=>import('../features/image/tools/compressor/engine'), meta:{ title:'Free Image Compressor — Compress JPG, PNG, WebP Online', description:'Compress images up to 90% with no visible quality loss.' } },
  { id:'image-resizer',    slug:'/tools/image/resizer',    category:'image', name:'Image Resizer',    description:'Resize images to any dimension while maintaining aspect ratio.', icon:'scaling', keywords:['resize','scale','width','height'], accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:20, requiresServer:false, engine:()=>import('../features/image/tools/resizer/engine'), meta:{ title:'Free Image Resizer Online', description:'Resize images to exact dimensions.' } },
  { id:'image-converter',  slug:'/tools/image/converter',  category:'image', name:'Image Converter',  description:'Convert images between JPG, PNG, WebP, and AVIF formats.', icon:'file-image', keywords:['convert','jpg','png','webp','avif','format'], accepts:['image/jpeg','image/png','image/webp','image/avif','image/gif'], maxFileSizeMB:50, maxFiles:20, requiresServer:false, engine:()=>import('../features/image/tools/converter/engine'), meta:{ title:'Free Image Converter Online', description:'Convert images between any format.' } },

  // ── PDF ────────────────────────────────────────────────────────────────────
  { id:'pdf-merger',     slug:'/tools/pdf/merger',     category:'pdf', name:'PDF Merger',     description:'Combine multiple PDF files into one document.', icon:'file-plus',  keywords:['merge','combine','join','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:50, requiresServer:false, engine:()=>import('../features/pdf/tools/merger/engine'),     meta:{ title:'Free PDF Merger Online', description:'Merge multiple PDFs into one file.' } },
  { id:'pdf-splitter',   slug:'/tools/pdf/splitter',   category:'pdf', name:'PDF Splitter',   description:'Split a PDF into individual pages or page ranges.', icon:'scissors',   keywords:['split','extract','pages','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:1,  requiresServer:false, engine:()=>import('../features/pdf/tools/splitter/engine'),   meta:{ title:'Free PDF Splitter Online', description:'Split PDFs by page range.' } },
  { id:'pdf-compressor', slug:'/tools/pdf/compressor', category:'pdf', name:'PDF Compressor', description:'Reduce PDF file size while preserving quality.', icon:'file-minus', keywords:['compress','reduce','optimize','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:10, requiresServer:false, engine:()=>import('../features/pdf/tools/compressor/engine'), meta:{ title:'Free PDF Compressor Online', description:'Reduce PDF size without losing quality.' } },

  // ── Developer ─────────────────────────────────────────────────────────────
  { id:'json-formatter',    slug:'/tools/developer/json-formatter',    category:'developer', name:'JSON Formatter',          description:'Format, validate and minify JSON.', icon:'braces',    keywords:['json','format','validate','minify'],                  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/developer/tools/json-formatter/engine'), meta:{ title:'Free JSON Formatter & Validator', description:'Format and validate JSON instantly.' } },
  { id:'base64-encoder',    slug:'/tools/developer/base64',            category:'developer', name:'Base64 Encoder / Decoder', description:'Encode and decode Base64 strings.',  icon:'binary',    keywords:['base64','encode','decode'],                           accepts:[], maxFileSizeMB:10, maxFiles:1, requiresServer:false, engine:()=>import('../features/developer/tools/base64/engine'), meta:{ title:'Free Base64 Encoder & Decoder', description:'Encode or decode Base64 strings.' } },
  hashGeneratorManifest,
  passwordGeneratorManifest,
  urlEncoderManifest,

  // ── Text ──────────────────────────────────────────────────────────────────
  { id:'word-counter', slug:'/tools/text/word-counter', category:'text', name:'Word Counter', description:'Count words, characters, sentences and reading time.', icon:'case-sensitive', keywords:['word','count','character','reading'], accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/text/tools/word-counter/engine'), meta:{ title:'Free Word Counter Online', description:'Count words and estimate reading time.' } },

  // ── Utility ───────────────────────────────────────────────────────────────
  { id:'uuid-generator', slug:'/tools/utility/uuid-generator', category:'utility', name:'UUID Generator', description:'Generate random UUIDs (v4) instantly.', icon:'fingerprint', keywords:['uuid','guid','random'], accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/utility/tools/uuid-generator/engine'), meta:{ title:'Free UUID Generator Online', description:'Generate UUID v4 strings instantly.' } },

  // ── Video ─────────────────────────────────────────────────────────────────
  videoCompressorManifest,
];

export const registry = new Map<string, ToolManifest>(manifests.map(m => [m.id, m]));

export const toolsByCategory = manifests.reduce<Record<string, ToolManifest[]>>((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category]!.push(tool);
  return acc;
}, {});

export const allTools = manifests;
export const allSlugs = manifests.map(t => t.slug);

export function getToolById(id: string): ToolManifest | undefined { return registry.get(id); }
export function getToolsByCategory(category: string): ToolManifest[] { return toolsByCategory[category] ?? []; }
export function searchTools(query: string): ToolManifest[] {
  if (!query.trim()) return manifests;
  const q = query.toLowerCase();
  return manifests.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some(k => k.includes(q)));
}
