import type { ToolManifest } from '@toolbox/shared/types';
export const loremIpsumManifest: ToolManifest = {
  id:'lorem-ipsum', slug:'/tools/text/lorem-ipsum', category:'text',
  name:'Lorem Ipsum Generator', description:'Generate placeholder text for designs and mockups.',
  icon:'align-left', keywords:['lorem','ipsum','placeholder','dummy','text'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Lorem Ipsum Generator Online', description:'Generate lorem ipsum placeholder text instantly.' },
};
