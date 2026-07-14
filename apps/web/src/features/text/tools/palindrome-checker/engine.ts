export interface PalindromeResult {
  isPalindrome:     boolean;
  isPhrasePalindrome: boolean;
  cleaned:          string;
  original:         string;
  reversed:         string;
  longestPalindrome:string;
}

export function checkPalindrome(input: string): PalindromeResult {
  const original = input;
  const reversed = input.split('').reverse().join('');
  const cleaned  = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanedRev = cleaned.split('').reverse().join('');

  const isPalindrome      = cleaned.length > 0 && cleaned === cleanedRev;
  const isPhrasePalindrome= isPalindrome;

  // Longest palindromic substring (Manacher-lite)
  let longest = '';
  for (let i = 0; i < input.length; i++) {
    for (const [l, r] of [[i, i], [i, i+1]] as [number, number][]) {
      let lo = l, hi = r;
      while (lo >= 0 && hi < input.length && input[lo] === input[hi]) { lo--; hi++; }
      const sub = input.slice(lo + 1, hi);
      if (sub.length > longest.length) longest = sub;
    }
  }

  return { isPalindrome, isPhrasePalindrome, cleaned, original, reversed, longestPalindrome: longest };
}

export const EXAMPLES = ['racecar', 'level', 'A man a plan a canal Panama', 'hello', 'Was it a car or a cat I saw', 'Never odd or even'];

export const meta = { ready: true };
