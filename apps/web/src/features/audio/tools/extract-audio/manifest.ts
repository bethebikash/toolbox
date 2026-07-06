import type { ToolManifest } from '@toolbox/shared/types';
export const extractAudioManifest: ToolManifest = {
  id:'extract-audio', slug:'/tools/audio/extract-audio', category:'audio',
  name:'Extract Audio from Video', description:'Extract audio from any video file as MP3, AAC, WAV, FLAC or OGG.',
  icon:'music', keywords:['extract','audio','mp3','aac','wav','video','convert'],
  accepts:['video/mp4','video/quicktime','video/x-msvideo','video/webm'], maxFileSizeMB:500, maxFiles:1, requiresServer:false,
  engine:()=>import('./engine'),
  meta:{ title:'Extract Audio from Video Online', description:'Extract audio from MP4, MOV, AVI and WebM videos.' },
};
