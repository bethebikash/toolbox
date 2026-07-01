import type { ToolManifest } from '@toolbox/shared/types';
import { videoCompressorManifest }      from '../features/video/tools/compressor/manifest';
import { hashGeneratorManifest }        from '../features/developer/tools/hash-generator/manifest';
import { passwordGeneratorManifest }    from '../features/developer/tools/password-generator/manifest';
import { urlEncoderManifest }           from '../features/developer/tools/url-encoder/manifest';
import { imageResizerManifest }         from '../features/image/tools/resizer/manifest';
import { imageConverterManifest }       from '../features/image/tools/converter/manifest';
import { bulkImageCompressorManifest }  from '../features/image/tools/bulk-compressor/manifest';

const manifests: ToolManifest[] = [
  // ── Image ─────────────────────────────────────────────────────────────────
  { id:'image-compressor', slug:'/tools/image/compressor', category:'image', name:'Image Compressor', description:'Reduce image file size without visible quality loss.', icon:'image-down', keywords:['compress','optimize','reduce','jpg','png','webp'], accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:20, requiresServer:false, engine:()=>import('../features/image/tools/compressor/engine'), meta:{ title:'Free Image Compressor', description:'Compress images up to 90%.' } },
  imageResizerManifest,
  imageConverterManifest,
  bulkImageCompressorManifest,

  // ── PDF ────────────────────────────────────────────────────────────────────
  { id:'pdf-merger',     slug:'/tools/pdf/merger',     category:'pdf', name:'PDF Merger',     description:'Combine multiple PDF files into one document.', icon:'file-plus',  keywords:['merge','combine','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:50, requiresServer:false, engine:()=>import('../features/pdf/tools/merger/engine'),     meta:{ title:'Free PDF Merger', description:'Merge PDFs online.' } },
  { id:'pdf-splitter',   slug:'/tools/pdf/splitter',   category:'pdf', name:'PDF Splitter',   description:'Split a PDF into individual pages or page ranges.', icon:'scissors',   keywords:['split','pages','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:1,  requiresServer:false, engine:()=>import('../features/pdf/tools/splitter/engine'),   meta:{ title:'Free PDF Splitter', description:'Split PDFs online.' } },
  { id:'pdf-compressor', slug:'/tools/pdf/compressor', category:'pdf', name:'PDF Compressor', description:'Reduce PDF file size while preserving quality.', icon:'file-minus', keywords:['compress','pdf'], accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:10, requiresServer:false, engine:()=>import('../features/pdf/tools/compressor/engine'), meta:{ title:'Free PDF Compressor', description:'Compress PDFs online.' } },

  // ── Developer ─────────────────────────────────────────────────────────────
  { id:'json-formatter', slug:'/tools/developer/json-formatter', category:'developer', name:'JSON Formatter', description:'Format, validate and minify JSON.', icon:'braces', keywords:['json','format','validate'], accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/developer/tools/json-formatter/engine'), meta:{ title:'JSON Formatter', description:'Format JSON.' } },
  { id:'base64-encoder', slug:'/tools/developer/base64',         category:'developer', name:'Base64 Encoder / Decoder', description:'Encode and decode Base64 strings.', icon:'binary', keywords:['base64','encode','decode'], accepts:[], maxFileSizeMB:10, maxFiles:1, requiresServer:false, engine:()=>import('../features/developer/tools/base64/engine'), meta:{ title:'Base64 Encoder', description:'Encode or decode Base64.' } },
  hashGeneratorManifest,
  passwordGeneratorManifest,
  urlEncoderManifest,

  // ── Text ──────────────────────────────────────────────────────────────────
  { id:'word-counter', slug:'/tools/text/word-counter', category:'text', name:'Word Counter', description:'Count words, characters, sentences and reading time.', icon:'case-sensitive', keywords:['word','count','character'], accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/text/tools/word-counter/engine'), meta:{ title:'Word Counter', description:'Count words online.' } },

  // ── Utility ───────────────────────────────────────────────────────────────
  { id:'uuid-generator', slug:'/tools/utility/uuid-generator', category:'utility', name:'UUID Generator', description:'Generate random UUIDs (v4) instantly.', icon:'fingerprint', keywords:['uuid','guid','random'], accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false, engine:()=>import('../features/utility/tools/uuid-generator/engine'), meta:{ title:'UUID Generator', description:'Generate UUIDs online.' } },

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
