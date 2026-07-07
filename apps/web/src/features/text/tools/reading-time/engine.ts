export interface ReadingTimeOptions {
  wpm:     number;
  includeImages: boolean;
  imageSeconds: number;
}

export interface ReadingTimeResult {
  minutes:     number;
  seconds:     number;
  totalSeconds:number;
  words:       number;
  formatted:   string;
}

export const DEFAULT_OPTS: ReadingTimeOptions = { wpm: 238, includeImages: true, imageSeconds: 12 };

export function calculateReadingTime(text: string, opts: ReadingTimeOptions): ReadingTimeResult {
  const words     = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const imageCount = opts.includeImages ? (text.match(/!\[.*?\]\(.*?\)/g) ?? []).length : 0;

  const wordSeconds  = Math.round((words / opts.wpm) * 60);
  const imageExtra   = imageCount * opts.imageSeconds;
  const totalSeconds = wordSeconds + imageExtra;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted: string;
  if (totalSeconds < 60) formatted = `${totalSeconds} sec read`;
  else if (minutes === 1) formatted = '1 min read';
  else formatted = `${minutes} min read`;

  return { minutes, seconds, totalSeconds, words, formatted };
}

export const meta = { ready: true };
