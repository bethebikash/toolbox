import type { ToolManifest } from '@toolbox/shared/types';
export const imageToBase64Manifest: ToolManifest = {
  id:'image-to-base64', slug:'/tools/image/to-base64', category:'image',
  name:'Image to Base64', description:'Convert images to Base64 encoded strings for HTML, CSS and JavaScript.',
  icon:'code-2', keywords:['base64','encode','image','data-url','html','css'],
  accepts:['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'], maxFileSizeMB:10, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image to Base64 Converter Online', description:'Convert images to Base64 data URLs instantly.' },
};
