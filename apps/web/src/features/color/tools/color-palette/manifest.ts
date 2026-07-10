import type { ToolManifest } from '@toolbox/shared/types';
export const colorPaletteManifest: ToolManifest = {
  id:'color-palette', slug:'/tools/color/color-palette', category:'color',
  name:'Color Palette Generator', description:'Generate harmonious color palettes from any base color.',
  icon:'palette', keywords:['color','palette','complementary','triadic','analogous','generate'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Color Palette Generator Online', description:'Generate color palettes with complementary, triadic and analogous colors.' },
};
