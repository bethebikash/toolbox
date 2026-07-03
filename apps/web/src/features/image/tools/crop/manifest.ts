import type { ToolManifest } from '@toolbox/shared/types';
export const imageCropManifest: ToolManifest = {
  id:'image-crop', slug:'/tools/image/crop', category:'image',
  name:'Image Crop', description:'Crop images with drag-to-select and preset aspect ratios.',
  icon:'crop', keywords:['crop','trim','cut','aspect','ratio'],
  accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Crop Tool Online', description:'Crop images with drag-to-select area or preset ratios.' },
};
