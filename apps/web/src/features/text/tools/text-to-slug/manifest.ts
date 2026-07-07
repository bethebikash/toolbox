import type { ToolManifest } from '@toolbox/shared/types';
export const textToSlugManifest: ToolManifest = {
  id:'text-to-slug', slug:'/tools/text/text-to-slug', category:'text',
  name:'Text to Slug', description:'Convert text to URL-friendly slugs.',
  icon:'link', keywords:['slug','url','convert','seo','permalink'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Text to Slug Converter Online', description:'Convert any text to URL-friendly slugs instantly.' },
};
