import { useState, useMemo } from 'react';
import { analyzeText, formatReadingTime } from './engine';

const SAMPLE = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.

Word counters are useful tools for writers, students, and professionals who need to track document length, estimate reading time, or meet specific word count requirements.

Try pasting your own text here to see the statistics update in real time.`;

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div style={{
      background:    'var(--color-surface)',
      border:        '1px solid var(--color-border)',
      borderRadius:  'var(--radius-xl)',
      padding:       'var(--space-5)',
      display:       'flex',
      flexDirection: 'column',
      gap:           'var(--space-1)',
    }}>
      <div style={{
        fontSize:   '11px',
        fontWeight: '700',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color:      'var(--color-text-tertiary)',
      }}>
        {label}
      </div>
      <div style={{
        fontSize:          '32px',
        fontWeight:        '800',
        color:             'var(--color-brand-500)',
        lineHeight:        1,
        fontVariantNumeric:'tabular-nums',
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function WordCounterPage() {
  const [text, setText] = useState(SAMPLE);
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px', color: 'var(--color-text-tertiary)',
        marginBottom: 'var(--space-5)',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <a href="/" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/tools/text" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Text Tools</a>
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>Word Counter</span>
      </div>

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-2)', letterSpacing: '-0.02em',
        }}>
          Word Counter
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px', lineHeight: 1.6 }}>
          Count words, characters, sentences and estimate reading time. Updates as you type.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-6)',
      }}>
        <StatCard label="Words"       value={stats.words} />
        <StatCard label="Characters"  value={stats.characters}        sub="including spaces" />
        <StatCard label="No spaces"   value={stats.charactersNoSpace} sub="excluding spaces" />
        <StatCard label="Sentences"   value={stats.sentences} />
        <StatCard label="Paragraphs"  value={stats.paragraphs} />
        <StatCard
          label="Read time"
          value={formatReadingTime(stats.readingTimeMin)}
          sub="@ 238 wpm"
        />
        <StatCard
          label="Speak time"
          value={formatReadingTime(stats.speakingTimeMin)}
          sub="@ 130 wpm"
        />
      </div>

      {/* Editor */}
      <div style={{
        background:   'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border:       '1px solid var(--color-border)',
        overflow:     'hidden',
      }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          padding:        'var(--space-3) var(--space-5)',
          borderBottom:   '1px solid var(--color-border)',
          background:     'var(--color-surface-2)',
        }}>
          <span style={{
            fontSize: '12px', fontWeight: '700',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}>
            Your text
          </span>
          <button
            onClick={() => setText('')}
            style={{
              background: 'none', border: 'none',
              fontSize: '13px', color: 'var(--color-text-tertiary)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            Clear
          </button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          spellCheck={false}
          style={{
            width:       '100%',
            minHeight:   '360px',
            padding:     'var(--space-5)',
            border:      'none',
            outline:     'none',
            resize:      'vertical',
            fontFamily:  'var(--font-sans)',
            fontSize:    '15px',
            lineHeight:  1.7,
            color:       'var(--color-text-primary)',
            background:  'transparent',
            boxSizing:   'border-box',
          }}
        />
      </div>

      {/* Keyword density */}
      {stats.words > 0 && (
        <div style={{
          marginTop:    'var(--space-4)',
          background:   'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border:       '1px solid var(--color-border)',
          overflow:     'hidden',
        }}>
          <div style={{
            padding:      'var(--space-3) var(--space-5)',
            borderBottom: '1px solid var(--color-border)',
            background:   'var(--color-surface-2)',
            fontSize:     '12px', fontWeight: '700',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color:        'var(--color-text-tertiary)',
          }}>
            Top keywords
          </div>
          <div style={{
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)',
          }}>
            {getTopKeywords(text, 12).map(({ word, count }) => (
              <div key={word} style={{
                display:      'flex',
                alignItems:   'center',
                gap:          'var(--space-1)',
                padding:      '3px 10px',
                background:   'var(--color-surface-2)',
                borderRadius: 'var(--radius-full)',
                border:       '1px solid var(--color-border)',
                fontSize:     '13px',
              }}>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{word}</span>
                <span style={{
                  color:       'var(--color-brand-500)',
                  fontWeight:  '700',
                  fontSize:    '11px',
                  background:  'var(--color-brand-50)',
                  padding:     '0px 5px',
                  borderRadius:'var(--radius-full)',
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for',
  'of','with','by','from','is','was','are','were','be','been',
  'have','has','had','do','does','did','will','would','could',
  'should','may','might','this','that','these','those','it','its',
  'i','you','he','she','we','they','my','your','his','her','our',
  'their','not','no','so','if','as','up','out','about','into',
]);

function getTopKeywords(text: string, limit: number) {
  const freq: Record<string, number> = {};
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .forEach(w => { freq[w] = (freq[w] ?? 0) + 1; });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}
