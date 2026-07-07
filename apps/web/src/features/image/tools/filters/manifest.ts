import type { ToolManifest } from '@toolbox/shared/types';
export const imageFiltersManifest: ToolManifest = {
  id:'image-filters', slug:'/tools/image/filters', category:'image',
  name:'Image Filters', description:'Apply grayscale, sepia, blur, sharpen and other filters.',
  icon:'sliders', keywords:['filter','grayscale','sepia','blur','invert','sharpen','image'],
  accepts:['image/jpeg','image/png','image/webp'], maxFileSizeMB:50, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Image Filter Tool Online', description:'Apply filters to images instantly in your browser.' },
};
