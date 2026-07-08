import type { ToolManifest } from '@toolbox/shared/types';
export const colorConverterManifest: ToolManifest = {
  id:'color-converter', slug:'/tools/developer/color-converter', category:'developer',
  name:'Color Code Converter', description:'Convert colors between HEX, RGB, HSL, HSV and CMYK.',
  icon:'palette', keywords:['color','hex','rgb','hsl','cmyk','convert'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Color Code Converter Online', description:'Convert colors between HEX, RGB, HSL and more.' },
};
