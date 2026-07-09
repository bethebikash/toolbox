import type { ToolManifest } from '@toolbox/shared/types';
export const contrastCheckerManifest: ToolManifest = {
  id:'contrast-checker', slug:'/tools/color/contrast-checker', category:'color',
  name:'WCAG Contrast Checker', description:'Check color contrast ratios for WCAG AA and AAA accessibility.',
  icon:'eye', keywords:['contrast','wcag','accessibility','color','a11y'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'WCAG Contrast Checker Online', description:'Check color contrast for WCAG AA and AAA compliance.' },
};
