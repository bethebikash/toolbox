import type { ToolManifest } from '@toolbox/shared/types';
export const calorieCalculatorManifest: ToolManifest = {
  id:'calorie-calculator', slug:'/tools/utility/calorie-calculator', category:'utility',
  name:'Calorie Calculator', description:'Calculate daily calorie needs and macros using Mifflin-St Jeor.',
  icon:'flame', keywords:['calorie','tdee','bmr','diet','nutrition','macro'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Calorie Calculator Online', description:'Calculate TDEE and daily macros for your goals.' },
};
