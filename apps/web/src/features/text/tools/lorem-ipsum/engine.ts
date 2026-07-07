const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export type LoremType = 'words' | 'sentences' | 'paragraphs';

export interface LoremOptions {
  type:  LoremType;
  count: number;
  startWithLorem: boolean;
}

function randomWord(i: number): string {
  return WORDS[i % WORDS.length]!;
}

function generateSentence(wordCount = 8): string {
  const words = Array.from({ length: wordCount }, (_, i) => randomWord(Math.floor(Math.random() * WORDS.length)));
  words[0] = words[0]![0]!.toUpperCase() + words[0]!.slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentenceCount = 5): string {
  return Array.from({ length: sentenceCount }, () =>
    generateSentence(6 + Math.floor(Math.random() * 6))
  ).join(' ');
}

export function generateLorem(opts: LoremOptions): string {
  let result: string;

  if (opts.type === 'words') {
    const words = Array.from({ length: opts.count }, (_, i) => randomWord(i));
    result = words.join(' ');
  } else if (opts.type === 'sentences') {
    result = Array.from({ length: opts.count }, () => generateSentence()).join(' ');
  } else {
    result = Array.from({ length: opts.count }, () => generateParagraph()).join('\n\n');
  }

  if (opts.startWithLorem && opts.type !== 'words') {
    result = 'Lorem ipsum dolor sit amet. ' + result;
  }

  return result;
}

export const meta = { ready: true };
