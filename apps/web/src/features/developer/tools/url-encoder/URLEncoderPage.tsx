import { useState } from 'react';
import { encodeURL, decodeURL, parseQueryString, buildQueryString } from './engine';
import type { URLMode } from './engine';

type Tab = 'encode' | 'decode' | 'params';

export default function URLEncoderPage() {
  const [tab,    setTab]    = useState<Tab>('encode');
  const [input,  setInput]  = useState('');
  const [mode,   setMode]   = useState<URLMode>('component');
  const [output, setOutput] = useState('');
  const [error,  setError]  = useState('');
  const [copied, setCopied] = useState(false);

  // Params builder state
  const [params, setParams] = useState([{ key: '', value: '' }]);

  function run() {
    const result = tab === 'encode'
      ? encodeURL(input, mode)
      : decodeURL(input, mode);

    if (result.ok) { setOutput(result.output); setError(''); }
    else           { setOutput(''); setError(result.error); }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function addParam()  { setParams(p => [...p, { key: '', value: '' }]); }
  function removeParam(i: number) { setParams(p => p.filter((_, idx) => idx !== i)); }
  function updateParam(i: number, field: 'key' | 'value', val: string) {
    setParams(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  const builtQS = buildQueryString(params.filter(p => p.key));
  const parsedFromInput = tab === 'params' ? parseQueryString(input) : [];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>URL Encoder</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>
          URL Encoder / Decoder
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Encode and decode URLs and query strings. Build or parse query parameters.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '4px', gap: '2px', marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        {(['encode', 'decode', 'params'] as Tab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setOutput(''); setError(''); setInput(''); }}
            style={{
              padding: 'var(--space-2) var(--space-5)',
              background: tab === t ? 'var(--color-surface)' : 'transparent',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: '14px', fontWeight: tab === t ? '600' : '400',
              color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
              textTransform: 'capitalize', transition: 'all var(--duration-fast)',
            }}
          >
            {t === 'params' ? 'Query Builder' : t}
          </button>
        ))}
      </div>

      {tab === 'params' ? (
        /* ── Query builder ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Parameters
            </div>
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {params.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <input value={p.key} onChange={e => updateParam(i, 'key', e.target.value)}
                    placeholder="Key" style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }} />
                  <input value={p.value} onChange={e => updateParam(i, 'value', e.target.value)}
                    placeholder="Value" style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none' }} />
                  <button onClick={() => removeParam(i)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </div>
              ))}
              <button onClick={addParam} style={{ alignSelf: 'flex-start', padding: 'var(--space-2) var(--space-4)', background: 'none', border: '1px dashed var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--color-brand-500)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                + Add parameter
              </button>
            </div>
          </div>

          {builtQS && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                Query string
                <button onClick={() => { navigator.clipboard.writeText(builtQS); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                ?{builtQS}
              </pre>
            </div>
          )}

          {/* Parse mode */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Parse a query string
            </div>
            <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder="?key=value&foo=bar"
                style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', background: 'var(--color-surface)', outline: 'none', boxSizing: 'border-box' }}
              />
              {parsedFromInput.length > 0 && (
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {parsedFromInput.map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                      <code style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-brand-500)' }}>{p.key}</code>
                      <code style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{p.value}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Encode / Decode mode ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Mode selector */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {(['component', 'full', 'query'] as URLMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: 'var(--space-2) var(--space-4)',
                background: mode === m ? 'var(--color-brand-500)' : 'var(--color-surface)',
                color: mode === m ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid ' + (mode === m ? 'var(--color-brand-500)' : 'var(--color-border)'),
                borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all var(--duration-fast)',
              }}>
                {m === 'component' ? 'encodeURIComponent' : m === 'full' ? 'encodeURI' : 'Query param'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {/* Input */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                Input
                <button onClick={() => { setInput(''); setOutput(''); setError(''); }} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Clear</button>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
                placeholder={tab === 'encode' ? 'Enter text to encode...' : 'Enter encoded URL to decode...'}
                style={{ flex: 1, minHeight: '280px', padding: 'var(--space-4)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', background: 'transparent' }}
              />
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={run} disabled={!input.trim()} style={{
                  padding: 'var(--space-2) var(--space-6)',
                  background: input.trim() ? 'var(--color-brand-500)' : 'var(--color-border)',
                  color: input.trim() ? '#fff' : 'var(--color-text-tertiary)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: '14px', fontWeight: '600', cursor: input.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
                }}>
                  {tab} →
                </button>
              </div>
            </div>

            {/* Output */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
                Output
                {output && <button onClick={copy} style={{ background: copied ? 'var(--color-success)' : 'none', color: copied ? '#fff' : 'var(--color-text-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)', padding: copied ? '2px 8px' : '0', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{copied ? 'Copied!' : 'Copy'}</button>}
              </div>
              {error ? (
                <div style={{ padding: 'var(--space-4)', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{error}</div>
              ) : (
                <pre style={{ flex: 1, minHeight: '280px', margin: 0, padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {output || <span style={{ color: 'var(--color-text-tertiary)' }}>Output will appear here...</span>}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
