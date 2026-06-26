import { useState, useRef } from 'react';
import { encodeText, decodeBase64, encodeFileWithPrefix, formatBytes } from './engine';
import type { EncodeResult, DecodeResult } from './engine';

type Mode = 'encode' | 'decode' | 'file';

export default function Base64Page() {
  const [mode,    setMode]   = useState<Mode>('encode');
  const [input,   setInput]  = useState('');
  const [result,  setResult] = useState<EncodeResult | DecodeResult | null>(null);
  const [copied,  setCopied] = useState(false);
  const [file,    setFile]   = useState<File | null>(null);
  const [include, setInclude]= useState(true); // include data: prefix for file
  const inputRef = useRef<HTMLInputElement>(null);

  function run() {
    if (mode === 'encode') {
      setResult(encodeText(input));
    } else if (mode === 'decode') {
      setResult(decodeBase64(input));
    }
  }

  async function runFile() {
    if (!file) return;
    const res = include
      ? await encodeFileWithPrefix(file)
      : await import('./engine').then(m => m.encodeFile(file));
    setResult(res);
  }

  function copy() {
    if (!result?.ok) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleFileChange(f: File) {
    setFile(f);
    setResult(null);
  }

  const output = result?.ok ? result.output : '';
  const hasError = result !== null && !result.ok;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px', color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/developer" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Developer Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Base64</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)', letterSpacing: '-0.02em',
        }}>
          Base64 Encoder / Decoder
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Encode text or files to Base64, or decode Base64 strings back to text.
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--color-surface-2)',
        borderRadius: 'var(--radius-lg)',
        padding: '4px',
        gap: '2px',
        marginBottom: 'var(--space-6)',
        width: 'fit-content',
      }}>
        {(['encode', 'decode', 'file'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); setInput(''); setFile(null); }}
            style={{
              padding:    'var(--space-2) var(--space-5)',
              background: mode === m ? 'var(--color-surface)' : 'transparent',
              border:     'none',
              borderRadius: 'var(--radius-md)',
              fontSize:   '14px',
              fontWeight: mode === m ? '600' : '400',
              color:      mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor:     'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow:  mode === m ? 'var(--shadow-sm)' : 'none',
              textTransform: 'capitalize',
              transition: 'all var(--duration-fast)',
            }}
          >
            {m === 'file' ? 'File → Base64' : m}
          </button>
        ))}
      </div>

      {mode === 'file' ? (
        /* ── File mode ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border:       '2px dashed var(--color-border-2)',
              borderRadius: 'var(--radius-xl)',
              padding:      'var(--space-10) var(--space-8)',
              textAlign:    'center',
              cursor:       'pointer',
              background:   'var(--color-surface)',
            }}
          >
            {file ? (
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                  {formatBytes(file.size)} · click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                  Drop a file or <span style={{ color: 'var(--color-brand-500)' }}>browse</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                  Any file type · encoded to Base64 string
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
          </div>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)',
            cursor: 'pointer', userSelect: 'none',
          }}>
            <input
              type="checkbox"
              checked={include}
              onChange={e => setInclude(e.target.checked)}
              style={{ accentColor: 'var(--color-brand-500)', width: '16px', height: '16px' }}
            />
            Include data URI prefix (data:mime;base64,...)
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={runFile}
              disabled={!file}
              style={{
                padding:    'var(--space-3) var(--space-8)',
                background: file ? 'var(--color-brand-500)' : 'var(--color-border)',
                color:      file ? '#fff' : 'var(--color-text-tertiary)',
                border:     'none',
                borderRadius: 'var(--radius-lg)',
                fontSize:   '15px',
                fontWeight: '600',
                cursor:     file ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Encode file →
            </button>
          </div>
        </div>
      ) : (
        /* ── Text / decode mode ── */
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 'var(--space-4)',
        }}>
          {/* Input pane */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)', overflow: 'hidden',
          }}>
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
            }}>
              {mode === 'encode' ? 'Plain text' : 'Base64 string'}
              <button onClick={() => { setInput(''); setResult(null); }} style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null); }}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
              spellCheck={false}
              style={{
                flex: 1, minHeight: '320px', padding: 'var(--space-4)',
                border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6,
                color: 'var(--color-text-primary)', background: 'transparent',
              }}
            />
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <button
                onClick={run}
                disabled={!input.trim()}
                style={{
                  padding: 'var(--space-2) var(--space-6)',
                  background: input.trim() ? 'var(--color-brand-500)' : 'var(--color-border)',
                  color: input.trim() ? '#fff' : 'var(--color-text-tertiary)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: '14px', fontWeight: '600',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'capitalize',
                }}
              >
                {mode} →
              </button>
            </div>
          </div>

          {/* Output pane */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            border: hasError ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface-2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
            }}>
              {mode === 'encode' ? 'Base64 output' : 'Decoded output'}
              {output && (
                <button onClick={copy} style={{
                  background: copied ? 'var(--color-success)' : 'none',
                  color: copied ? '#fff' : 'var(--color-text-tertiary)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  padding: copied ? '2px 8px' : '0',
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500',
                }}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {hasError ? (
              <div style={{ padding: 'var(--space-4)', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {!result?.ok && result && 'error' in result ? result.error : ''}
              </div>
            ) : (
              <pre style={{
                flex: 1, minHeight: '320px', margin: 0, padding: 'var(--space-4)',
                fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6,
                color: 'var(--color-text-primary)', overflowX: 'auto',
                whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {output || (
                  <span style={{ color: 'var(--color-text-tertiary)' }}>
                    Output will appear here...
                  </span>
                )}
              </pre>
            )}
            {/* Stats */}
            {result?.ok && 'inputSize' in result && (
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
                display: 'flex', gap: 'var(--space-4)',
                fontSize: '12px', color: 'var(--color-text-tertiary)',
              }}>
                <span>Input: <strong style={{ color: 'var(--color-text-secondary)' }}>{result.inputSize.toLocaleString()} chars</strong></span>
                <span>Output: <strong style={{ color: 'var(--color-text-secondary)' }}>{result.outputSize.toLocaleString()} chars</strong></span>
                <span>Ratio: <strong style={{ color: 'var(--color-brand-500)' }}>
                  {result.inputSize > 0 ? ((result.outputSize / result.inputSize) * 100).toFixed(0) : 0}%
                </strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File result */}
      {mode === 'file' && result?.ok && (
        <div style={{
          marginTop: 'var(--space-4)',
          background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)', overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
          }}>
            Base64 output
            <button onClick={copy} style={{
              background: copied ? 'var(--color-success)' : 'none',
              color: copied ? '#fff' : 'var(--color-text-tertiary)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              padding: copied ? '2px 8px' : '0',
              fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: '500',
            }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            margin: 0, padding: 'var(--space-4)', maxHeight: '240px', overflow: 'auto',
            fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6,
            color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {result.output}
          </pre>
          {'inputSize' in result && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border)',
              background: 'var(--color-surface-2)', display: 'flex', gap: 'var(--space-4)',
              fontSize: '12px', color: 'var(--color-text-tertiary)',
            }}>
              <span>Original: <strong style={{ color: 'var(--color-text-secondary)' }}>{formatBytes(result.inputSize)}</strong></span>
              <span>Encoded: <strong style={{ color: 'var(--color-text-secondary)' }}>{result.outputSize.toLocaleString()} chars</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
