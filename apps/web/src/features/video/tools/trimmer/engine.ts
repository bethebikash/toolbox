import { getFFmpeg } from '../compressor/engine';
import { fetchFile } from '@ffmpeg/util';

export interface TrimOptions {
  startTime: number;  // seconds
  endTime:   number;  // seconds
  format:    'mp4' | 'webm' | 'mov';
}

export interface TrimResult {
  url:          string;
  blob:         Blob;
  originalSize: number;
  outputSize:   number;
  duration:     number;
}

export async function trimVideo(
  file: File,
  opts: TrimOptions,
  onProgress?: (pct: number) => void,
): Promise<TrimResult> {
  const ff  = await getFFmpeg(onProgress);
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
  const inputName  = `input.${ext}`;
  const outputName = `output.${opts.format}`;

  await ff.writeFile(inputName, await fetchFile(file));

  const duration = opts.endTime - opts.startTime;

  await ff.exec([
    '-i',  inputName,
    '-ss', String(opts.startTime),
    '-t',  String(duration),
    '-c',  'copy',          // stream copy — fast, no re-encode
    '-avoid_negative_ts', 'make_zero',
    outputName,
  ]);

  const data   = await ff.readFile(outputName);
  const bytes  = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const mime   = opts.format === 'webm' ? 'video/webm' : opts.format === 'mov' ? 'video/quicktime' : 'video/mp4';
  const blob   = new Blob([buffer], { type: mime });

  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);

  return {
    url:          URL.createObjectURL(blob),
    blob,
    originalSize: file.size,
    outputSize:   blob.size,
    duration,
  };
}

export function formatTime(seconds: number): string {
  const h  = Math.floor(seconds / 3600);
  const m  = Math.floor((seconds % 3600) / 60);
  const s  = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

export function parseTimeInput(val: string): number {
  const parts = val.split(':').map(Number);
  if (parts.length === 3) return (parts[0]! * 3600) + (parts[1]! * 60) + (parts[2]!);
  if (parts.length === 2) return (parts[0]! * 60) + (parts[1]!);
  return parts[0]!;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
