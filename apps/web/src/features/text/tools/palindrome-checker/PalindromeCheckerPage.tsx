import { useState } from 'react';
import { checkPalindrome, EXAMPLES } from './engine';

export default function PalindromeCheckerPage() {
  const [input,  setInput]  = useState('racecar');
  const result = checkPalindrome(input);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Palindrome Checker</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Palindrome Checker</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Check if a word or phrase is a palindrome. Also finds the longest palindromic substring.</p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Enter a word or phrase..."
          style={{ width: '100%', padding: 'var(--space-5)', border: 'none', outline: 'none', fontSize: '22px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'transparent', boxSizing: 'border-box', fontWeight: '600' }}
        />
      </div>

      {input.trim() && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Result badge */}
          <div style={{ background: result.isPalindrome ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: '2px solid ' + (result.isPalindrome ? 'var(--color-success)' : 'var(--color-danger)'), borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>{result.isPalindrome ? '✅' : '❌'}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: result.isPalindrome ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {result.isPalindrome ? 'Yes, it\'s a palindrome!' : 'Not a palindrome'}
            </div>
            {result.isPalindrome && (
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                Reads the same forwards and backwards (ignoring spaces and punctuation)
              </div>
            )}
          </div>

          {/* Analysis */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {[
              { label: 'Original',             value: result.original },
              { label: 'Reversed',             value: result.reversed },
              { label: 'Cleaned (for check)',  value: result.cleaned },
              { label: 'Longest palindrome',   value: result.longestPalindrome || '—' },
            ].map((row, i) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none', gap: 'var(--space-4)' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', minWidth: '160px', flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Try these examples:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => setInput(ex)}
              style={{ padding: 'var(--space-2) var(--space-3)', background: input === ex ? 'var(--color-brand-500)' : 'var(--color-surface)', color: input === ex ? '#fff' : 'var(--color-text-secondary)', border: '1px solid ' + (input === ex ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-full)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
