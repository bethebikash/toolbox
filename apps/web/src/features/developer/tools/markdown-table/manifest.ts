import type { ToolManifest } from '@toolbox/shared/types';
export const markdownTableManifest: ToolManifest = {
  id:'markdown-table', slug:'/tools/developer/markdown-table', category:'developer',
  name:'Markdown Table Generator', description:'Convert CSV to Markdown tables or Markdown to HTML.',
  icon:'table', keywords:['markdown','table','csv','html','convert','generator'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Markdown Table Generator Online', description:'Convert CSV to Markdown tables instantly.' },
};
