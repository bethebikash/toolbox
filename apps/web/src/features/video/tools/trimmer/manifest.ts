import type { ToolManifest } from '@toolbox/shared/types';
export const videoTrimmerManifest: ToolManifest = {
  id:'video-trimmer', slug:'/tools/video/trimmer', category:'video',
  name:'Video Trimmer', description:'Trim video to a specific start and end time.',
  icon:'scissors', keywords:['trim','cut','video','clip','start','end'],
  accepts:['video/mp4','video/quicktime','video/x-msvideo','video/webm'], maxFileSizeMB:500, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Free Video Trimmer Online', description:'Trim videos to exact start and end times. Powered by FFmpeg.' },
};
