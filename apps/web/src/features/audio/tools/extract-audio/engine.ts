import { getFFmpeg } from '../../../video/tools/compressor/engine';
import { fetchFile } from '@ffmpeg/util';

export type AudioFormat = 'mp3' | 'aac' | 'wav' | 'flac' | 'ogg';

export interface ExtractOptions {
  format:   AudioFormat;
  bitrate:  number;   // kbps — for mp3/aac
  quality:  number;   // 0–9 for ogg/flac (lower = better)
}

export interface ExtractResult {
  url:          string;
  blob:         Blob;
  originalSize: number;
  outputSize:   number;
  format:       AudioFormat;
}

export const FORMAT_MIME: Record<AudioFormat, string> = {
  mp3:  'audio/mpeg',
  aac:  'audio/aac',
  wav:  'audio/wav',
  flac: 'audio/flac',
  ogg:  'audio/ogg',
};

export const FORMAT_LABELS: Record<AudioFormat, string> = {
  mp3:  'MP3',
  aac:  'AAC',
  wav:  'WAV',
  flac: 'FLAC',
  ogg:  'OGG',
};

export async function extractAudio(
  file: File,
  opts: ExtractOptions,
  onProgress?: (pct: number) => void,
): Promise<ExtractResult> {
  const ff  = await getFFmpeg(onProgress);
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
  const inputName  = `input.${ext}`;
  const outputName = `output.${opts.format}`;

  await ff.writeFile(inputName, await fetchFile(file));

  const args = ['-i', inputName, '-vn']; // -vn = no video

  if (opts.format === 'mp3') {
    args.push('-acodec', 'libmp3lame', '-b:a', `${opts.bitrate}k`);
  } else if (opts.format === 'aac') {
    args.push('-acodec', 'aac', '-b:a', `${opts.bitrate}k`);
  } else if (opts.format === 'wav') {
    args.push('-acodec', 'pcm_s16le');
  } else if (opts.format === 'flac') {
    args.push('-acodec', 'flac', '-compression_level', String(opts.quality));
  } else if (opts.format === 'ogg') {
    args.push('-acodec', 'libvorbis', '-q:a', String(Math.floor((9 - opts.quality) * 0.9)));
  }

  args.push(outputName);
  await ff.exec(args);

  const data   = await ff.readFile(outputName);
  const bytes  = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob   = new Blob([buffer], { type: FORMAT_MIME[opts.format] });

  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);

  return {
    url:          URL.createObjectURL(blob),
    blob,
    originalSize: file.size,
    outputSize:   blob.size,
    format:       opts.format,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export const meta = { ready: true };
