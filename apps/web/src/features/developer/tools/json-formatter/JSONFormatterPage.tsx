import { useState, useCallback } from 'react';
import { formatJSON, minifyJSON, validateJSON } from './engine';

type Mode = 'format' | 'minify' | 'validate';

const SAMPLE = `{
  "name": "toolbox",
  "version": "1.0.0",
  "tools": ["image", "pdf", "video"],
  "meta": {
    "private": true,
    "count": 100
  }
}`;

export default function JSONFormatterPage() {
  const [input,  setInput]  = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [mode,   setMode]   = useState<Mode>('format');
  const [indent, setIndent] = useState(2);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [error,  setError]  = useState('');
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    if (!input.trim()) return;

    if (mode === 'validate') {
      const result = validateJSON(input);
      setStatus(result.valid ? 'ok' : 'error');
      setError(result.error ?? '');
      setOutput(result.valid ? 'Valid JSON ✓' : '');
      return;
    }

    const result = mode === 'format'
      ? formatJSON(input, indent)
      : minifyJSON(input);

    if (result.ok) {
      setOutput(result.output);
      setStatus('ok');
      setError('');
    } else {
      setOutput('');
      setStatus('error');
      setError(result.error);
    }
  }, [input, mode, indent]);

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const statusColor =
    status === 'ok'    ? 'var(--color-success)' :
    status === 'error' ? 'var(--color-danger)'  :
    'transparent';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--color-brand-900)',
          margin: '0 0 var(--space-2)',
          letterSpacing: '-0.02em',
        }}>
          JSON Formatter
        </h1>
        <p style={{ color: 'var(--color-neutral-500)', margin: 0, fontSize: '15px' }}>
          Format, minify and validate JSON. Runs entirely in your browser.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
        flexWrap: 'wrap',
      }}>
        {/* Mode tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--color-neutral-100)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          gap: '2px',
        }}>
          {(['format', 'minify', 'validate'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: mode === m ? 'var(--color-neutral-0)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: mode === m ? '600' : '400',
                color: mode === m ? 'var(--color-brand-900)' : 'var(--color-neutral-500)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Indent size — only relevant for format mode */}
        {mode === 'format' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-neutral-500)' }}>Indent</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: indent === n ? 'var(--color-brand-500)' : 'var(--color-neutral-100)',
                  color: indent === n ? '#fff' : 'var(--color-neutral-600)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={run}
          style={{
            padding: 'var(--space-2) var(--space-6)',
            background: 'var(--color-brand-500)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            marginLeft: 'auto',
          }}
        >
          Run
        </button>
      </div>

      {/* Editor panes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-4)',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-neutral-0)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-neutral-200)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-neutral-100)',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--color-neutral-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            Input
            <button
              onClick={() => setInput('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: 'var(--color-neutral-400)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              minHeight: '400px',
              padding: 'var(--space-4)',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--color-neutral-800)',
              background: 'transparent',
            }}
          />
        </div>

        {/* Output */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-neutral-0)',
          borderRadius: 'var(--radius-xl)',
          border: status === 'error'
            ? '1px solid var(--color-danger)'
            : '1px solid var(--color-neutral-200)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-neutral-100)',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--color-neutral-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              Output
              {status !== 'idle' && (
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: statusColor,
                  display: 'inline-block',
                }} />
              )}
            </span>
            {output && (
              <button
                onClick={copy}
                style={{
                  background: copied ? 'var(--color-success)' : 'none',
                  color: copied ? '#fff' : 'var(--color-neutral-400)',
                  border: copied ? 'none' : 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: copied ? '2px 8px' : '0',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '500',
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {status === 'error' ? (
            <div style={{
              padding: 'var(--space-4)',
              color: 'var(--color-danger)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
            }}>
              {error}
            </div>
          ) : (
            <pre style={{
              flex: 1,
              minHeight: '400px',
              margin: 0,
              padding: 'var(--space-4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--color-neutral-800)',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              {output || (
                <span style={{ color: 'var(--color-neutral-300)' }}>
                  Output will appear here...
                </span>
              )}
            </pre>
          )}
        </div>
      </div>

    </div>
  );
}
