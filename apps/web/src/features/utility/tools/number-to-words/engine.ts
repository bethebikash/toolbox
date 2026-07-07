const ONES  = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS  = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const SCALE = ['','thousand','million','billion','trillion'];

function chunkToWords(n: number): string {
  if (n === 0) return '';
  if (n < 20)  return ONES[n]!;
  if (n < 100) return TENS[Math.floor(n / 10)]! + (n % 10 !== 0 ? '-' + ONES[n % 10]! : '');
  return ONES[Math.floor(n / 100)]! + ' hundred' + (n % 100 !== 0 ? ' ' + chunkToWords(n % 100) : '');
}

export function numberToWords(n: number): string {
  if (isNaN(n) || !isFinite(n)) return 'invalid number';
  if (n === 0) return 'zero';

  const negative = n < 0;
  const abs = Math.abs(Math.floor(n));

  const chunks: number[] = [];
  let temp = abs;
  while (temp > 0) { chunks.push(temp % 1000); temp = Math.floor(temp / 1000); }

  const parts = chunks
    .map((chunk, i) => {
      if (chunk === 0) return '';
      const words = chunkToWords(chunk);
      return words + (SCALE[i] ? ' ' + SCALE[i] : '');
    })
    .filter(Boolean)
    .reverse();

  let result = parts.join(', ');
  if (negative) result = 'negative ' + result;

  // Handle decimals
  const str = String(n);
  const dotIdx = str.indexOf('.');
  if (dotIdx !== -1) {
    const decimals = str.slice(dotIdx + 1);
    const decimalWords = decimals.split('').map(d => ONES[parseInt(d)]!).join(' ');
    result += ' point ' + decimalWords;
  }

  return result;
}

export const meta = { ready: true };
