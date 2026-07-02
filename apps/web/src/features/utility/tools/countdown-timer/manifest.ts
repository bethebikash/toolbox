import type { ToolManifest } from '@toolbox/shared/types';
export const countdownTimerManifest: ToolManifest = {
  id:'countdown-timer', slug:'/tools/utility/countdown-timer', category:'utility',
  name:'Countdown Timer', description:'Count down to any date and time with live updates.',
  icon:'timer', keywords:['countdown','timer','date','event','days','hours'],
  accepts:[], maxFileSizeMB:0, maxFiles:0, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Countdown Timer Online', description:'Count down to any date or event in real time.' },
};
