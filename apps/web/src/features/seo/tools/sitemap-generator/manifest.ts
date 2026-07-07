import type { ToolManifest } from '@toolbox/shared/types';
export const sitemapGeneratorManifest: ToolManifest = {
  id:'sitemap-generator', slug:'/tools/seo/sitemap-generator', category:'seo',
  name:'Sitemap Generator', description:'Generate an XML sitemap for search engine indexing.',
  icon:'map', keywords:['sitemap','xml','seo','google','urls'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free XML Sitemap Generator Online', description:'Generate a sitemap.xml for your website.' },
};
