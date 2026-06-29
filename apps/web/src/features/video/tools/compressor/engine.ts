import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Singleton — FFmpeg is expensive to load, share one instance
let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;

export async function getFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpeg?.loaded) return ffmpeg;

  if (!loadPromise) {
    ffmpeg = new FFmpeg();

    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.round(progress * 100));
      });
    }

    loadPromise = (async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg!.load({
        coreURL:   await toBlobURL(`${baseURL}/ffmpeg-core.js`,   'text/javascript'),
        wasmURL:   await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    })();
  }

  await loadPromise;
  return ffmpeg!;
}

export interface VideoCompressOptions {
  crf:        number;   // 18–51, lower = better quality. 28 is default
  preset:     'ultrafast' | 'fast' | 'medium' | 'slow';
  maxWidth?:  number;
  audioRate?: number;   // kbps e.g. 128
}

export interface VideoResult {
  blob:          Blob;
  url:           string;
  originalSize:  number;
  outputSize:    number;
  savedPercent:  number;
  mimeType:      string;
}

export async function compressVideo(
  file: File,
  opts: VideoCompressOptions,
  onProgress?: (pct: number) => void,
): Promise<VideoResult> {
  const ff  = await getFFmpeg(onProgress);
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
  const inputName  = `input.${ext}`;
  const outputName = `output.mp4`;

  await ff.writeFile(inputName, await fetchFile(file));

  const args = [
    '-i', inputName,
    '-c:v', 'libx264',
    '-crf', String(opts.crf),
    '-preset', opts.preset,
    '-c:a', 'aac',
    '-b:a', `${opts.audioRate ?? 128}k`,
  ];

  if (opts.maxWidth) {
    args.push('-vf', `scale='min(${opts.maxWidth},iw)':-2`);
  }

  args.push('-movflags', '+faststart', outputName);

  await ff.exec(args);

  const data    = await ff.readFile(outputName);
  const bytes   = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
  const buffer  = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob    = new Blob([buffer], { type: 'video/mp4' });

  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);

  return {
    blob,
    url:           URL.createObjectURL(blob),
    originalSize:  file.size,
    outputSize:    blob.size,
    savedPercent:  Math.round((1 - blob.size / file.size) * 100),
    mimeType:      'video/mp4',
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const meta = { ready: true };
