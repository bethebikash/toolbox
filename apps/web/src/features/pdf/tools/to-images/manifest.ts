import type { ToolManifest } from '@toolbox/shared/types';
export const pdfToImagesManifest: ToolManifest = {
  id:'pdf-to-images', slug:'/tools/pdf/to-images', category:'pdf',
  name:'PDF to Images', description:'Convert each PDF page to a JPG or PNG image.',
  icon:'image', keywords:['pdf','image','jpg','png','convert','pages'],
  accepts:['application/pdf'], maxFileSizeMB:100, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free PDF to Images Converter Online', description:'Convert PDF pages to JPG or PNG images.' },
};
