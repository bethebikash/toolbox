import type { ToolManifest } from '@toolbox/shared/types';
export const imageResizerManifest: ToolManifest = {
  id:'image-resizer', slug:'/tools/image/resizer', category:'image',
  name:'Image Resizer', description:'Resize images by exact size, fit within bounds, or by percentage.',
  icon:'scaling', keywords:['resize','scale','width','height','dimensions'],
  accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Resizer Online', description:'Resize images to exact dimensions or by percentage.' },
};
