import { useState } from 'react';
import { analyzePassword } from './engine';

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);

  const result = analyzePassword(password);

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a><span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer</a><span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Password Strength</span>
      </div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Password Strength Checker</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>Analyze password strength, entropy and estimated time to crack. Nothing is sent to a server.</p>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', gap: 'var(--space-3)' }}>
          <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter a password to analyze..."
            autoComplete="new-password"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '18px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'transparent', letterSpacing: show ? 'normal' : '0.1em' }}
          />
          <button onClick={() => setShow(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--color-text-tertiary)' }}>{show ? '🙈' : '👁️'}</button>
        </div>

        {/* Strength bar */}
        {password && (
          <div style={{ height: '4px', background: 'var(--color-border)' }}>
            <div style={{ height: '100%', width: result.score + '%', background: result.color, transition: 'all 0.3s ease' }} />
          </div>
        )}
      </div>

      {password && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Score */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {[
              { label: 'Strength',       value: result.level,               color: result.color },
              { label: 'Entropy',        value: result.entropy + ' bits',   color: 'var(--color-brand-500)' },
              { label: 'Time to crack',  value: result.timeToCrack,         color: 'var(--color-text-primary)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-1)' }}>{s.label}</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Checks */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Requirements</div>
            {result.checks.map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: i < result.checks.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{check.passed ? '✅' : '❌'}</span>
                <span style={{ fontSize: '14px', color: check.passed ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>{check.label}</span>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div style={{ background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>💡 Suggestions</div>
              {result.suggestions.map((s, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: i < result.suggestions.length - 1 ? 'var(--space-2)' : 0 }}>• {s}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
