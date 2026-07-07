import type { ToolManifest } from '@toolbox/shared/types';
export const exifViewerManifest: ToolManifest = {
  id:'exif-viewer', slug:'/tools/image/exif-viewer', category:'image',
  name:'EXIF Viewer', description:'View metadata and EXIF information embedded in image files.',
  icon:'info', keywords:['exif','metadata','image','camera','gps','jpeg'],
  accepts:['image/jpeg','image/png','image/webp','image/tiff'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free EXIF Viewer Online', description:'View EXIF metadata from image files instantly.' },
};
