import type { ToolManifest } from '@toolbox/shared/types';
export const colorPickerManifest: ToolManifest = {
  id:'color-picker', slug:'/tools/color/color-picker', category:'color',
  name:'Color Picker', description:'Pick a color and get HEX, RGB, HSL, HSV and CMYK values.',
  icon:'pipette', keywords:['color','picker','hex','rgb','hsl','cmyk','palette'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Color Picker Online', description:'Pick any color and get HEX, RGB, HSL, HSV and CMYK codes instantly.' },
};
