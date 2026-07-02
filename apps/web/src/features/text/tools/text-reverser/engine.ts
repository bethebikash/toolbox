export type ReverseMode = 'chars' | 'words' | 'lines';

export const MODE_LABELS: Record<ReverseMode, string> = {
  chars: 'Reverse characters',
  words: 'Reverse words',
  lines: 'Reverse lines',
};

export function reverseText(input: string, mode: ReverseMode): string {
  switch (mode) {
    case 'chars': return input.split('').reverse().join('');
    case 'words': return input.split(' ').reverse().join(' ');
    case 'lines': return input.split('\n').reverse().join('\n');
  }
}

export const meta = { ready: true };
