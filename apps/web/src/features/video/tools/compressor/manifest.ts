import type { ToolManifest } from '@toolbox/shared/types';

export const videoCompressorManifest: ToolManifest = {
  id:             'video-compressor',
  slug:           '/tools/video/compressor',
  category:       'video',
  name:           'Video Compressor',
  description:    'Compress MP4, MOV, AVI and WebM videos using H.264.',
  icon:           'video',
  keywords:       ['compress', 'video', 'mp4', 'reduce', 'h264', 'ffmpeg'],
  accepts:        ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  maxFileSizeMB:  500,
  maxFiles:       1,
  requiresServer: false,
  engine:         () => import('./engine'),
  meta: {
    title:       'Free Video Compressor — Compress MP4 Online',
    description: 'Compress videos up to 90% smaller using H.264. Powered by FFmpeg, runs in your browser.',
  },
};
