import type { ToolManifest } from '@toolbox/shared/types';
export const pdfCompressorManifest: ToolManifest = {
  id:'pdf-compressor', slug:'/tools/pdf/compressor', category:'pdf',
  name:'PDF Compressor', description:'Reduce PDF file size using object stream compression.',
  icon:'file-minus', keywords:['compress','reduce','optimize','pdf','size'],
  accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:10, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free PDF Compressor Online', description:'Reduce PDF size without losing quality.' },
};
