import type { ToolManifest } from '@toolbox/shared/types';
export const bulkImageCompressorManifest: ToolManifest = {
  id:'bulk-image-compressor', slug:'/tools/image/bulk-compressor', category:'image',
  name:'Bulk Image Compressor', description:'Compress dozens of images at once with a single click.',
  icon:'images', keywords:['bulk','batch','compress','multiple','images'],
  accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:100, requiresServer:false,
  engine:()=>import('../compressor/engine'),
  meta:{ title:'Free Bulk Image Compressor Online', description:'Compress multiple images at once. No upload required.' },
};
