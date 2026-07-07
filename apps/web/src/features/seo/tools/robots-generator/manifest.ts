import type { ToolManifest } from '@toolbox/shared/types';
export const robotsGeneratorManifest: ToolManifest = {
  id:'robots-generator', slug:'/tools/seo/robots-generator', category:'seo',
  name:'Robots.txt Generator', description:'Generate a robots.txt file to control search engine crawling.',
  icon:'bot', keywords:['robots','txt','seo','crawl','disallow'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Robots.txt Generator Online', description:'Create a robots.txt file for your website.' },
};
