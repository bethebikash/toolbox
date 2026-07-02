import type { ToolManifest } from '@toolbox/shared/types';
export const bmiCalculatorManifest: ToolManifest = {
  id:'bmi-calculator', slug:'/tools/utility/bmi-calculator', category:'utility',
  name:'BMI Calculator', description:'Calculate your Body Mass Index with metric or imperial units.',
  icon:'activity', keywords:['bmi','body','mass','index','weight','height','health'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free BMI Calculator Online', description:'Calculate your BMI and find your ideal weight range.' },
};
