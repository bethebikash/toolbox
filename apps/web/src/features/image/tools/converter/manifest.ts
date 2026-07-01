import type { ToolManifest } from '@toolbox/shared/types';
export const imageConverterManifest: ToolManifest = {
  id:'image-converter', slug:'/tools/image/converter', category:'image',
  name:'Image Converter', description:'Convert images between JPG, PNG and WebP formats.',
  icon:'file-image', keywords:['convert','jpg','png','webp','format','avif'],
  accepts:['image/jpeg','image/png','image/webp','image/avif','image/gif'], maxFileSizeMB:50, maxFiles:20, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Converter Online', description:'Convert images between any format instantly.' },
};
