import { useState, useRef } from 'react';
import { mergePDFs, formatBytes } from './engine';
import type { MergeResult } from './engine';

interface PDFFile {
  id:       string;
  file:     File;
  status:   'pending' | 'processing' | 'done' | 'error';
}

type AppState = 'idle' | 'processing' | 'done' | 'error';

export default function PDFMergerPage() {
  const [files,    setFiles]    = useState<PDFFile[]>([]);
  const [state,    setState]    = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState<MergeResult | null>(null);
  const [error,    setError]    = useState('');
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming).filter(f => f.type === 'application/pdf');
    if (!arr.length) return;
    const newFiles: PDFFile[] = arr.map(file => ({
      id:     crypto.randomUUID(),
      file,
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setResult(null);
    setState('idle');
  }

  function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id));
    setResult(null);
    setState('idle');
  }

  function moveFile(id: string, direction: 'up' | 'down') {
    setFiles(prev => {
      const idx = prev.findIndex(f => f.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx]!, next[idx]!];
      return next;
    });
  }

  // Drag-to-reorder within the list
  const dragSrcId = useRef<string | null>(null);

  function onDragStart(id: string) {
    dragSrcId.current = id;
  }

  function onDropReorder(targetId: string) {
    const srcId = dragSrcId.current;
    if (!srcId || srcId === targetId) return;
    setFiles(prev => {
      const arr    = [...prev];
      const srcIdx = arr.findIndex(f => f.id === srcId);
      const dstIdx = arr.findIndex(f => f.id === targetId);
      const [item] = arr.splice(srcIdx, 1);
      arr.splice(dstIdx, 0, item!);
      return arr;
    });
    setDragOver(null);
    dragSrcId.current = null;
  }

  async function merge() {
    if (files.length < 2) return;
    setState('processing');
    setProgress(0);
    setError('');
    try {
      const res = await mergePDFs(files.map(f => f.file), setProgress);
      setResult(res);
      setState('done');
    } catch (e) {
      setError((e as Error).message);
      setState('error');
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement('a');
    a.href     = result.url;
    a.download = 'merged.pdf';
    a.click();
  }

  function reset() {
    setFiles([]);
    setResult(null);
    setState('idle');
    setProgress(0);
    setError('');
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/pdf" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>PDF Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Merger</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)',
          letterSpacing: '-0.02em',
        }}>
          PDF Merger
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Combine multiple PDF files into one. Drag to reorder before merging.
          Files never leave your device.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e  => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        style={{
          border: '2px dashed ' + (dragging ? 'var(--color-brand-500)' : 'var(--color-border-2)'),
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-12) var(--space-8)',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'var(--color-brand-50)' : 'var(--color-surface)',
          transition: 'border-color var(--duration-normal), background var(--duration-normal)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-brand-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
          fontSize: '24px',
        }}>
          📄
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Drop PDF files here or{' '}
          <span style={{ color: 'var(--color-brand-500)' }}>browse files</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
          PDF only · multiple files · drag to reorder after selecting
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          marginBottom: 'var(--space-4)',
        }}>
          {/* List header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface-2)',
          }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
              {files.length} file{files.length !== 1 ? 's' : ''} · drag rows to reorder
            </span>
            <button
              onClick={reset}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Clear all
            </button>
          </div>

          {/* Rows */}
          {files.map((f, i) => (
            <div
              key={f.id}
              draggable
              onDragStart={() => onDragStart(f.id)}
              onDragOver={e  => { e.preventDefault(); setDragOver(f.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e  => { e.preventDefault(); onDropReorder(f.id); }}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 36px 1fr auto',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: i < files.length - 1 ? '1px solid var(--color-border)' : 'none',
                background: dragOver === f.id
                  ? 'var(--color-brand-50)'
                  : 'transparent',
                transition: 'background var(--duration-fast)',
                cursor: 'grab',
              }}
            >
              {/* Drag handle */}
              <div style={{
                color: 'var(--color-text-tertiary)',
                fontSize: '16px',
                textAlign: 'center',
                cursor: 'grab',
                userSelect: 'none',
              }}>
                ⠿
              </div>

              {/* Page number badge */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-brand-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-brand-500)',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>

              {/* File info */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '2px',
                }}>
                  {f.file.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                  {formatBytes(f.file.size)}
                </div>
              </div>

              {/* Up / down / remove */}
              <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
                <button
                  onClick={() => moveFile(f.id, 'up')}
                  disabled={i === 0}
                  title="Move up"
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: i === 0 ? 'not-allowed' : 'pointer',
                    opacity: i === 0 ? 0.3 : 1,
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveFile(f.id, 'down')}
                  disabled={i === files.length - 1}
                  title="Move down"
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: i === files.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: i === files.length - 1 ? 0.3 : 1,
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(f.id)}
                  title="Remove"
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--color-text-tertiary)',
                    marginLeft: 'var(--space-1)',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result card */}
      {state === 'done' && result && (
        <div style={{
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-success)',
              marginBottom: 'var(--space-1)',
            }}>
              ✓ Merged successfully
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {result.pageCount} pages · {formatBytes(result.sizeBytes)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={download}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'var(--color-success)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ↓ Download PDF
            </button>
            <button
              onClick={reset}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'none',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-2)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-4)',
          fontSize: '14px',
          color: 'var(--color-danger)',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Bottom action bar */}
      {files.length > 0 && state !== 'done' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-4) 0',
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            {files.length < 2
              ? 'Add at least 2 PDF files to merge'
              : `Ready to merge ${files.length} files`}
          </div>

          {state === 'processing' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}>
              <div style={{
                width: '160px',
                height: '4px',
                background: 'var(--color-border)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: progress + '%',
                  background: 'var(--color-brand-500)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.15s linear',
                }} />
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', minWidth: '36px' }}>
                {progress}%
              </span>
            </div>
          ) : (
            <button
              onClick={merge}
              disabled={files.length < 2}
              style={{
                padding: 'var(--space-3) var(--space-8)',
                background: files.length < 2 ? 'var(--color-border)' : 'var(--color-brand-500)',
                color: files.length < 2 ? 'var(--color-text-tertiary)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: files.length < 2 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: files.length >= 2 ? '0 4px 12px rgb(46 124 246 / 0.35)' : 'none',
                transition: 'all var(--duration-normal)',
              }}
            >
              Merge {files.length} PDFs →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
