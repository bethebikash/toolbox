export interface DiffLine {
  type:    'equal' | 'added' | 'removed';
  content: string;
  lineA?:  number;
  lineB?:  number;
}

export interface DiffResult {
  lines:    DiffLine[];
  added:    number;
  removed:  number;
  changed:  number;
}

// LCS-based line diff
export function diffText(textA: string, textB: string): DiffResult {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const m = linesA.length, n = linesB.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i]![j] = linesA[i] === linesB[j] ? 1 + dp[i+1]![j+1]! : Math.max(dp[i+1]![j]!, dp[i]![j+1]!);

  // Backtrack
  const result: DiffLine[] = [];
  let i = 0, j = 0, idxA = 1, idxB = 1;

  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: 'equal', content: linesA[i]!, lineA: idxA++, lineB: idxB++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i]![j+1]! >= dp[i+1]![j]!)) {
      result.push({ type: 'added', content: linesB[j]!, lineB: idxB++ });
      j++;
    } else {
      result.push({ type: 'removed', content: linesA[i]!, lineA: idxA++ });
      i++;
    }
  }

  const added   = result.filter(l => l.type === 'added').length;
  const removed = result.filter(l => l.type === 'removed').length;

  return { lines: result, added, removed, changed: Math.min(added, removed) };
}

export const meta = { ready: true };
