export interface TextStats {
  characters:        number;
  charactersNoSpace: number;
  words:             number;
  sentences:         number;
  paragraphs:        number;
  readingTimeMin:    number;
  speakingTimeMin:   number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();

  const characters        = text.length;
  const charactersNoSpace = text.replace(/\s/g, '').length;

  const words = trimmed === ''
    ? 0
    : trimmed.split(/\s+/).filter(w => w.length > 0).length;

  const sentences = trimmed === ''
    ? 0
    : trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const paragraphs = trimmed === ''
    ? 0
    : trimmed.split(/\n{2,}/).filter(p => p.trim().length > 0).length;

  // Average reading speed: 238 wpm, speaking: 130 wpm
  const readingTimeMin  = Math.ceil(words / 238);
  const speakingTimeMin = Math.ceil(words / 130);

  return {
    characters,
    charactersNoSpace,
    words,
    sentences,
    paragraphs,
    readingTimeMin,
    speakingTimeMin,
  };
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1)  return '< 1 min';
  if (minutes === 1) return '1 min';
  return minutes + ' mins';
}

export const meta = { ready: true };
