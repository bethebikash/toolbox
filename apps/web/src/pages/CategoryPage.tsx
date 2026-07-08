import { useParams, useNavigate } from 'react-router';
import { getToolsByCategory, allTools } from '../registry/registry';

const CATEGORY_META: Record<string, { label: string; emoji: string; desc: string }> = {
  image:     { label: 'Image Tools',          emoji: '🖼️',  desc: 'Compress, resize, crop, convert and edit images — all in your browser.' },
  pdf:       { label: 'PDF Tools',            emoji: '📄',  desc: 'Merge, split, compress and convert PDF files without any upload.' },
  developer: { label: 'Developer Tools',      emoji: '🛠️',  desc: 'Format, minify, encode, decode and test code. Built for developers.' },
  text:      { label: 'Text Tools',           emoji: '✏️',  desc: 'Transform, analyze, convert and generate text content.' },
  color:     { label: 'Design Tools',         emoji: '🎨',  desc: 'Color pickers, gradients, QR codes, favicons and barcodes.' },
  utility:   { label: 'Utility Calculators',  emoji: '🔧',  desc: 'Calculators for loans, BMI, units, age, currency and more.' },
  video:     { label: 'Video Tools',          emoji: '🎬',  desc: 'Compress and trim video files directly in your browser using FFmpeg.' },
  audio:     { label: 'Audio Tools',          emoji: '🎵',  desc: 'Extract and convert audio from video files.' },
  seo:       { label: 'SEO Tools',            emoji: '🔍',  desc: 'Generate meta tags, sitemaps, robots.txt and preview search results.' },
};

export default function CategoryPage() {
  const { category = '' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const tools    = getToolsByCategory(category);
  const meta     = CATEGORY_META[category];

  if (!meta || tools.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
        <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🔍</div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text-primary)' }}>Category not found</h1>
        <p style={{ color: 'var(--color-text-tertiary)' }}>Try browsing from the <a href="/" style={{ color: 'var(--color-brand-500)' }}>home page</a>.</p>
      </div>
    );
  }

  // Related categories
  const related = Object.entries(CATEGORY_META)
    .filter(([id]) => id !== category)
    .slice(0, 4);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>{meta.label}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-xl)', background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
          {meta.emoji}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{meta.label}</h1>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-brand-500)', background: 'var(--color-brand-50)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)' }}>
              {tools.length} tools
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>{meta.desc}</p>
        </div>
      </div>

      {/* Tools grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        {tools.map(tool => (
          <div key={tool.id} onClick={() => navigate(tool.slug)}
            style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', cursor: 'pointer', transition: 'all var(--duration-normal)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-brand-500)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(46,124,246,0.1)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--color-border)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{tool.name}</div>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{meta.emoji}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', lineHeight: 1.5, flex: 1 }}>{tool.description}</div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {tool.keywords.slice(0, 3).map(kw => (
                <span key={kw} style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>{kw}</span>
              ))}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-brand-500)' }}>Open tool →</div>
          </div>
        ))}
      </div>

      {/* Other categories */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: '0 0 var(--space-4)' }}>Other categories</h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {related.map(([id, m]) => (
            <button key={id} onClick={() => navigate(`/tools/${id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary)', transition: 'all var(--duration-fast)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--color-brand-500)'; el.style.color = 'var(--color-brand-500)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--color-border)'; el.style.color = 'var(--color-text-secondary)'; }}>
              <span>{m.emoji}</span>
              <span>{m.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>({(getToolsByCategory(id)).length})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
