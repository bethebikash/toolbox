import type { ToolManifest } from '@toolbox/shared/types';
export const metaTagGeneratorManifest: ToolManifest = {
  id:'meta-tag-generator', slug:'/tools/seo/meta-tag-generator', category:'seo',
  name:'Meta Tag Generator', description:'Generate complete HTML meta tags including Open Graph and Twitter Card.',
  icon:'tag', keywords:['meta','seo','tags','og','twitter','html'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Meta Tag Generator Online', description:'Generate SEO meta tags, Open Graph and Twitter Card tags.' },
};
