import { useNavigate } from 'react-router';
import { allTools, toolsByCategory } from '../registry/registry';
import { useState } from 'react';
import { searchTools } from '../registry/registry';
import type { ToolManifest } from '@toolbox/shared/types';

const CATEGORIES = [
  { id: 'image',     label: 'Image Tools',       emoji: '🖼️',  desc: 'Compress, resize, convert and edit images' },
  { id: 'pdf',       label: 'PDF Tools',          emoji: '📄',  desc: 'Merge, split, compress and convert PDFs' },
  { id: 'developer', label: 'Developer Tools',    emoji: '🛠️',  desc: 'Format, minify, encode and decode' },
  { id: 'text',      label: 'Text Tools',         emoji: '✏️',  desc: 'Transform, analyze and generate text' },
  { id: 'color',     label: 'Design Tools',       emoji: '🎨',  desc: 'Colors, gradients, QR codes and icons' },
  { id: 'utility',   label: 'Utility Calculators',emoji: '🔧',  desc: 'Currency, loans, BMI and more' },
  { id: 'video',     label: 'Video Tools',        emoji: '🎬',  desc: 'Compress and trim videos in browser' },
  { id: 'audio',     label: 'Audio Tools',        emoji: '🎵',  desc: 'Extract audio from video files' },
  { id: 'seo',       label: 'SEO Tools',          emoji: '🔍',  desc: 'Meta tags, sitemaps and previews' },
];

const FEATURED: string[] = [
  'image-compressor', 'pdf-merger', 'json-formatter',
  'qr-generator', 'color-picker', 'uuid-generator',
  'markdown-converter', 'regex-tester', 'gradient-generator',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<ToolManifest[]>([]);

  function handleSearch(q: string) {
    setQuery(q);
    setResults(q.trim() ? searchTools(q).slice(0, 12) : []);
  }

  const featuredTools = FEATURED
    .map(id => allTools.find(t => t.id === id))
    .filter((t): t is ToolManifest => Boolean(t));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'var(--space-12) 0 var(--space-10)' }}>
        <div style={{ fontSize: '56px', marginBottom: 'var(--space-4)' }}>🧰</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Free browser tools.<br />
          <span style={{ color: 'var(--color-brand-500)' }}>No uploads. No limits.</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', margin: '0 auto var(--space-8)', maxWidth: '560px', lineHeight: 1.6 }}>
          {allTools.length} tools across {CATEGORIES.length} categories. Everything runs in your browser — your files never leave your device.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-surface)', border: '2px solid var(--color-border-2)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', transition: 'border-color var(--duration-fast)' }}>
            <span style={{ fontSize: '18px' }}>🔎</span>
            <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
              placeholder="Search 70 tools... (try 'compress', 'json', 'qr')"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)', background: 'transparent' }}
            />
            {query && (
              <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}>✕</button>
            )}
          </div>

          {/* Search results dropdown */}
          {results.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 100 }}>
              {results.map((tool, i) => (
                <div key={tool.id} onClick={() => { navigate(tool.slug); setQuery(''); setResults([]); }}
                  style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background var(--duration-fast)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-brand-50)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{tool.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{tool.description.slice(0, 70)}</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap', marginLeft: 'var(--space-3)' }}>
                    {tool.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)', flexWrap: 'wrap' }}>
        {[
          { value: String(allTools.length), label: 'free tools' },
          { value: String(CATEGORIES.length), label: 'categories' },
          { value: '0', label: 'server uploads' },
          { value: '∞', label: 'file size limit' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-brand-500)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-5)', letterSpacing: '-0.02em' }}>Browse by category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {CATEGORIES.map(cat => {
            const count = (toolsByCategory[cat.id] ?? []).length;
            return (
              <div key={cat.id} onClick={() => navigate(`/tools/${cat.id}`)}
                style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', cursor: 'pointer', transition: 'all var(--duration-normal)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-brand-500)'; el.style.boxShadow = '0 4px 16px rgba(46,124,246,0.12)'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-border)'; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {cat.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{cat.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-brand-500)', background: 'var(--color-brand-50)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{count}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured tools */}
      <section style={{ marginBottom: 'var(--space-12)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-primary)', margin: '0 0 var(--space-5)', letterSpacing: '-0.02em' }}>Popular tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          {featuredTools.map(tool => (
            <div key={tool.id} onClick={() => navigate(tool.slug)}
              style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', cursor: 'pointer', transition: 'all var(--duration-fast)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-brand-500)'; el.style.background = 'var(--color-brand-50)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-border)'; el.style.background = 'var(--color-surface)'; }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{tool.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>{tool.description.slice(0, 60)}</div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-brand-500)', textTransform: 'capitalize' }}>{tool.category} →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy badge */}
      <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6) var(--space-8)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <div style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>🔒</div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>100% Private — Files Never Leave Your Browser</div>
        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
          All processing happens locally using WebAssembly. No server uploads, no tracking, no sign-ups required.
        </div>
      </div>
    </div>
  );
}
