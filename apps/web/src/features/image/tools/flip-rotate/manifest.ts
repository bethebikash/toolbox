import type { ToolManifest } from '@toolbox/shared/types';
export const flipRotateManifest: ToolManifest = {
  id:'flip-rotate', slug:'/tools/image/flip-rotate', category:'image',
  name:'Flip & Rotate', description:'Rotate images 90°/180°/270° and flip horizontally or vertically.',
  icon:'rotate-cw', keywords:['rotate','flip','mirror','90','180','270'],
  accepts:['image/jpeg','image/png','image/webp','image/avif'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Flip & Rotate Online', description:'Rotate and flip images instantly in your browser.' },
};
