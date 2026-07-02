import type { ToolManifest } from '@toolbox/shared/types';
export const markdownConverterManifest: ToolManifest = {
  id:'markdown-converter', slug:'/tools/text/markdown-converter', category:'text',
  name:'Markdown Converter', description:'Convert Markdown to HTML with live preview.',
  icon:'file-code', keywords:['markdown','html','convert','preview','md'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Markdown to HTML Converter Online', description:'Convert Markdown to HTML instantly with live preview.' },
};
