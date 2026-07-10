export interface TextStats {
  chars:          number;
  charsNoSpaces:  number;
  words:          number;
  sentences:      number;
  paragraphs:     number;
  lines:          number;
  avgWordLength:  number;
  avgSentenceLen: number;
  longestWord:    string;
  mostFreqWord:   string;
  readingTime:    string;
  speakingTime:   string;
  uniqueWords:    number;
  lexicalDensity: number;
}

export function analyzeText(text: string): TextStats {
  if (!text.trim()) return {
    chars: 0, charsNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0,
    lines: 0, avgWordLength: 0, avgSentenceLen: 0, longestWord: '',
    mostFreqWord: '', readingTime: '0 sec', speakingTime: '0 sec',
    uniqueWords: 0, lexicalDensity: 0,
  };

  const chars         = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const wordsArr      = text.trim().split(/\s+/).filter(Boolean);
  const words         = wordsArr.length;
  const sentences     = (text.match(/[.!?]+/g) ?? []).length || 1;
  const paragraphs    = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const lines         = text.split('\n').length;

  const cleanWords    = wordsArr.map(w => w.toLowerCase().replace(/[^a-zA-Z]/g, '')).filter(Boolean);
  const avgWordLength = cleanWords.length ? Math.round(cleanWords.reduce((a, w) => a + w.length, 0) / cleanWords.length * 10) / 10 : 0;
  const avgSentenceLen= Math.round(words / sentences * 10) / 10;
  const longestWord   = cleanWords.reduce((a, w) => w.length > a.length ? w : a, '');

  const freq: Record<string, number> = {};
  cleanWords.forEach(w => { if (w.length > 2) freq[w] = (freq[w] ?? 0) + 1; });
  const mostFreqWord  = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  const uniqueWords   = new Set(cleanWords).size;
  const lexicalDensity= cleanWords.length ? Math.round(uniqueWords / cleanWords.length * 100) : 0;

  const readingSec  = Math.round(words / 238 * 60);
  const speakingSec = Math.round(words / 130 * 60);

  const fmt = (s: number) => s < 60 ? `${s} sec` : s < 3600 ? `${Math.floor(s/60)} min ${s%60} sec` : `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`;

  return { chars, charsNoSpaces, words, sentences, paragraphs, lines, avgWordLength, avgSentenceLen, longestWord, mostFreqWord, readingTime: fmt(readingSec), speakingTime: fmt(speakingSec), uniqueWords, lexicalDensity };
}

export const meta = { ready: true };
