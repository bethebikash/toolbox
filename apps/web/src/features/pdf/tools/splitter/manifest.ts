import type { ToolManifest } from '@toolbox/shared/types';
export const pdfSplitterManifest: ToolManifest = {
  id:'pdf-splitter', slug:'/tools/pdf/splitter', category:'pdf',
  name:'PDF Splitter', description:'Split a PDF into individual pages, ranges, or chunks.',
  icon:'scissors', keywords:['split','extract','pages','pdf','range'],
  accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free PDF Splitter Online', description:'Split PDFs by page range or extract individual pages.' },
};
