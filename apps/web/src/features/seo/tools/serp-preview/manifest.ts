import type { ToolManifest } from '@toolbox/shared/types';
export const serpPreviewManifest: ToolManifest = {
  id:'serp-preview', slug:'/tools/seo/serp-preview', category:'seo',
  name:'SERP Preview', description:'Preview how your page appears in Google search results.',
  icon:'search', keywords:['serp','google','seo','title','description','preview'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Google SERP Preview Tool', description:'See how your page looks in Google search results.' },
};
