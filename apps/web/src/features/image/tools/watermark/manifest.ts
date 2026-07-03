import type { ToolManifest } from '@toolbox/shared/types';
export const watermarkManifest: ToolManifest = {
  id:'add-watermark', slug:'/tools/image/watermark', category:'image',
  name:'Add Watermark', description:'Add a text watermark to images with custom position and style.',
  icon:'droplets', keywords:['watermark','text','copyright','overlay'],
  accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Watermark Tool Online', description:'Add text watermarks to images with custom position and opacity.' },
};
