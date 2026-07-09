import type { ToolManifest } from '@toolbox/shared/types';
export const passwordStrengthManifest: ToolManifest = {
  id:'password-strength', slug:'/tools/developer/password-strength', category:'developer',
  name:'Password Strength Checker', description:'Analyze password strength, entropy and estimated crack time.',
  icon:'shield-check', keywords:['password','strength','security','entropy','crack'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Password Strength Checker Online', description:'Check password strength and security.' },
};
