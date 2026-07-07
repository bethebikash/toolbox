import { useState } from 'react';
import { testRegex, COMMON_PATTERNS } from './engine';
import type { RegexFlags } from './engine';

const DEFAULT_FLAGS: RegexFlags = { global: true, ignoreCase: false, multiline: false, dotAll: false };

const SAMPLE_TEXT = `Contact us at support@example.com or sales@company.org
Visit https://www.example.com or http://blog.example.com
Phone: (555) 123-4567 or 555-987-6543
Colors: #ff0000, #00f, #abc123
Date: 2024-01-15`;

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags,   setFlags]   = useState<RegexFlags>(DEFAULT_FLAGS);
  const [input,   setInput]   = useState(SAMPLE_TEXT);

  const result = testRegex(pattern, flags, input);

  function toggleFlag(key: keyof RegexFlags) {
    setFlags(f => ({ ...f, [key]: !f[key] }));
  }

  const flagStr = [
    flags.global     ? 'g' : '',
    flags.ignoreCase ? 'i' : '',
    flags.multiline  ? 'm' : '',
    flags.dotAll     ? 's' : '',
  ].join('');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Regex Tester</span>
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Regex Tester</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Test regular expressions with live highlighting. View all matches and groups.</p>
      </div>

      {/* Pattern input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: result.ok ? '1px solid var(--color-border)' : '1px solid var(--color-danger)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '18px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>/</span>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            style={{ flex: 1, padding: 'var(--space-2)', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--color-text-primary)', background: 'transparent' }}
          />
          <span style={{ fontSize: '18px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>/{flagStr}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          {([
            ['global',     'g', 'Global'],
            ['ignoreCase', 'i', 'Case insensitive'],
            ['multiline',  'm', 'Multiline'],
            ['dotAll',     's', 'Dot all'],
          ] as [keyof RegexFlags, string, string][]).map(([key, flag, label]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: '13px', cursor: 'pointer', padding: 'var(--space-1) var(--space-3)', background: flags[key] ? 'var(--color-brand-50)' : 'var(--color-surface-2)', border: '1px solid ' + (flags[key] ? 'var(--color-brand-500)' : 'var(--color-border)'), borderRadius: 'var(--radius-full)', color: flags[key] ? 'var(--color-brand-500)' : 'var(--color-text-secondary)', fontWeight: '500', transition: 'all var(--duration-fast)' }}>
              <input type="checkbox" checked={flags[key]} onChange={() => toggleFlag(key)} style={{ display: 'none' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{flag}</span>
              <span>{label}</span>
            </label>
          ))}
          {result.ok && (
            <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '700', color: result.matchCount > 0 ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
              {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
            </span>
          )}
          {!result.ok && <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--color-danger)' }}>⚠ {result.error}</span>}
        </div>
      </div>

      {/* Common patterns */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-tertiary)', alignSelf: 'center' }}>Quick:</span>
        {COMMON_PATTERNS.map(p => (
          <button key={p.name} onClick={() => setPattern(p.pattern)} style={{ padding: 'var(--space-1) var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: '12px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'border-color var(--duration-fast)' }}>{p.name}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {/* Test string */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Test string</div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            style={{ width: '100%', minHeight: '240px', padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'var(--color-surface)', boxSizing: 'border-box' }}
          />
        </div>

        {/* Highlighted matches */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Matches highlighted</div>
          <div style={{ minHeight: '240px', padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, background: 'var(--color-surface)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowY: 'auto' }}>
            {result.ok
              ? result.highlighted.map((seg, i) => (
                  <span key={i} style={seg.isMatch ? { background: '#FEF08A', color: '#78350F', borderRadius: '2px', padding: '0 1px' } : {}}>
                    {seg.text}
                  </span>
                ))
              : <span style={{ color: 'var(--color-danger)' }}>{result.error}</span>
            }
          </div>
        </div>
      </div>

      {/* Match details */}
      {result.ok && result.matches.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Match details
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)' }}>
                  {['#', 'Match', 'Index', 'Length', 'Groups'].map(h => (
                    <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.matches.slice(0, 20).map((m, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-2)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-tertiary)' }}>{i + 1}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', background: '#FEF08A22', color: '#78350F', borderRadius: '2px' }}>{m.fullMatch}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{m.index}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{m.fullMatch.length}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{m.groups.join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.matches.length > 20 && (
            <div style={{ padding: 'var(--space-3) var(--space-5)', fontSize: '13px', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)' }}>
              Showing 20 of {result.matches.length} matches
            </div>
          )}
        </div>
      )}
    </div>
  );
}
