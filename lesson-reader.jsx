// lesson-reader.jsx — render lesson blocks as a readable lesson screen
const { useState } = React;

// ─────────────────────────────────────────
// Block renderer — used by both mobile and desktop
window.LessonBlock = function LessonBlock({ block }) {
  const b = block;
  switch (b.type) {
    case 'p':
      return <p className="lr-p">{b.content}</p>;

    case 'h':
      return <h3 className="lr-h">{b.content}</h3>;

    case 'list':
      return (
        <ul className="lr-list">
          {b.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{
              __html: it.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            }} />
          ))}
        </ul>
      );

    case 'intuition':
      return (
        <div className="lr-callout intuition">
          <div className="lr-callout-head">
            <span className="lr-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 1.7-.9 3.2-2.3 4-.4.2-.7.6-.7 1V12H6.5v-1c0-.4-.3-.8-.7-1A4.5 4.5 0 018 1.5zM6.5 13.5h3M7 15h2"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{b.title || '直覺'}</span>
          </div>
          <div className="lr-callout-body">{b.content}</div>
        </div>
      );

    case 'warn':
      return (
        <div className="lr-callout warn">
          <div className="lr-callout-head">
            <span className="lr-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L1.5 13.5h13L8 1.5zM8 6v4M8 12h.01"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{b.title || '常見錯誤'}</span>
          </div>
          <div className="lr-callout-body">{b.content}</div>
        </div>
      );

    case 'example':
      return (
        <div className="lr-callout example">
          <div className="lr-callout-head">
            <span className="lr-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 6h6M5 9h6M5 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </span>
            <span>{b.title || '例'}</span>
          </div>
          <div className="lr-callout-body">
            {b.content.split('\n').map((line, i) => <div key={i}>{line || '\u00a0'}</div>)}
          </div>
        </div>
      );

    case 'key':
      return (
        <div className="lr-key">
          <div className="lr-key-mark">關鍵</div>
          <div className="lr-key-body">{b.content}</div>
        </div>
      );

    case 'formula':
      return (
        <div className="lr-formula">
          {b.label && <div className="lr-formula-label">{b.label}</div>}
          <div className="lr-formula-tex">{b.tex}</div>
        </div>
      );

    case 'compare':
      return (
        <div className="lr-compare" style={{
          gridTemplateColumns: `repeat(${Math.min(b.columns.length, 3)}, 1fr)`
        }}>
          {b.columns.map((c, i) => (
            <div key={i} className="lr-compare-col">
              <div className="lr-compare-head">{c.head}</div>
              <div className="lr-compare-body">
                {c.body.split('\n').map((line, j) => <div key={j}>{line || '\u00a0'}</div>)}
              </div>
            </div>
          ))}
        </div>
      );

    case 'chart':
      const Chart = window[b.name];
      if (!Chart) return null;
      return (
        <div className="lr-chart">
          <Chart {...(b.params || {})} />
        </div>
      );

    case 'interactive':
      const Widget = window[b.name];
      if (!Widget) return null;
      return <Widget {...(b.params || {})} />;

    case 'quote':
      return <blockquote className="lr-quote">{b.content}</blockquote>;

    default:
      return null;
  }
};

// ─────────────────────────────────────────
// Lesson reader screen — mobile
window.MLessonReader = function MLessonReader({ topicId, onBack, initialIdx = 0 }) {
  const D = window.AppData;
  const t = D.topics.find(x => x.id === topicId);
  const lessons = window.LessonsByTopic(topicId);
  const [idx, setIdx] = useState(initialIdx);
  const lesson = lessons[idx];

  const next = () => setIdx(Math.min(idx + 1, lessons.length - 1));
  const prev = () => setIdx(Math.max(idx - 1, 0));

  return (
    <>
      <button className="m-back" onClick={onBack} style={{marginTop: 4}}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M10 3L4 8l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        返回 · {t?.zh}
      </button>

      <div className="m-scroll" style={{paddingTop: 4}}>
        <div className="lr-progress">
          <span className="lr-progress-text">
            {idx + 1} / {lessons.length} · {lesson.minutes} 分鐘
          </span>
          <div className="lr-progress-bar">
            <i style={{width: `${((idx+1)/lessons.length)*100}%`}} />
          </div>
        </div>

        <div className="lr-header">
          <div className="lr-eyebrow">
            <span className={`tag ${t?.tagColor || 'mint'}`}>{t?.tag}</span>
            <span style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.1em', textTransform:'uppercase'}}>
              第 {idx + 1} 課
            </span>
          </div>
          <h1 className="lr-title">{lesson.title}</h1>
        </div>

        <div className="lr-body">
          {lesson.blocks.map((b, i) => <window.LessonBlock key={i} block={b} />)}
        </div>

        <div className="lr-nav">
          <button className="lr-nav-btn" onClick={prev} disabled={idx === 0}>
            ← 上一課
          </button>
          {idx < lessons.length - 1 ? (
            <button className="lr-nav-btn primary" onClick={next}>下一課 →</button>
          ) : (
            <button className="lr-nav-btn primary" onClick={onBack}>完成 ✓</button>
          )}
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────
// Mobile lesson list — cards in topic detail
window.LessonListMobile = function LessonListMobile({ topicId, onOpen }) {
  const lessons = window.LessonsByTopic(topicId);
  return (
    <div className="m-section" style={{padding: '0 20px'}}>
      <div className="m-section-head">
        <h2>課程內容</h2>
        <span className="link">{lessons.length} 課</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {lessons.map((l, i) => (
          <button key={i} onClick={() => onOpen(i)}
            style={{
              display: 'grid', gridTemplateColumns: '28px 1fr auto',
              alignItems: 'center', gap: 12, textAlign: 'left',
              padding: '12px 14px',
              background: 'var(--panel)', border: '1px solid var(--line)',
              borderRadius: 14, cursor: 'pointer',
              fontFamily: 'inherit', color: 'inherit'
            }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--accent-soft)', color: 'var(--accent-ink)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600
            }}>{i + 1}</span>
            <div>
              <div style={{fontSize: 13.5, fontWeight: 600, lineHeight: 1.3}}>{l.title}</div>
              <div style={{fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2}}>
                {l.minutes} min · {l.blocks.length} 個區塊
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{color: 'var(--ink-3)'}}>
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Desktop lesson list — cards laid out in topic detail
window.LessonListDesktop = function LessonListDesktop({ topicId, onOpen }) {
  const lessons = window.LessonsByTopic(topicId);
  return (
    <div className="card">
      <div className="card-head">
        <h3>課程內容</h3>
        <span className="meta">{lessons.length} 課</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {lessons.map((l, i) => (
          <button key={i} onClick={() => onOpen(i)}
            style={{
              display: 'grid', gridTemplateColumns: '28px 1fr auto',
              alignItems: 'center', gap: 12, textAlign: 'left',
              padding: '12px 14px',
              background: 'var(--bg)', border: '1px solid var(--line)',
              borderRadius: 10, cursor: 'pointer',
              fontFamily: 'inherit', color: 'inherit'
            }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--accent-soft)', color: 'var(--accent-ink)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600
            }}>{i + 1}</span>
            <div>
              <div style={{fontSize: 13, fontWeight: 600}}>{l.title}</div>
              <div style={{fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 2}}>
                {l.minutes} min · {l.blocks.length} blocks
              </div>
            </div>
            <span style={{color: 'var(--ink-3)', fontFamily: 'var(--f-mono)', fontSize: 11}}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Desktop lesson reader — full-width page
window.DesktopLessonReader = function DesktopLessonReader({ topicId, initialIdx = 0, onBack }) {
  const D = window.AppData;
  const t = D.topics.find(x => x.id === topicId);
  const lessons = window.LessonsByTopic(topicId);
  const [idx, setIdx] = useState(initialIdx);
  const lesson = lessons[idx];
  const next = () => setIdx(Math.min(idx + 1, lessons.length - 1));
  const prev = () => setIdx(Math.max(idx - 1, 0));

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb" style={{cursor:'pointer'}} onClick={onBack}>
            ← 返回 · {t?.zh}
          </div>
        </div>
      </div>

      <div className="lr-progress">
        <span className="lr-progress-text">
          第 {idx + 1} / {lessons.length} 課 · {lesson.minutes} 分鐘
        </span>
        <div className="lr-progress-bar">
          <i style={{width: `${((idx+1)/lessons.length)*100}%`}} />
        </div>
      </div>

      <div className="lr-header">
        <div className="lr-eyebrow">
          <span className={`chip ${t?.tagColor || 'mint'}`}>{t?.tag}</span>
          <span style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.1em', textTransform:'uppercase'}}>
            Lesson {idx + 1}
          </span>
        </div>
        <h1 className="lr-title">{lesson.title}</h1>
      </div>

      <div className="lr-body">
        {lesson.blocks.map((b, i) => <window.LessonBlock key={i} block={b} />)}
      </div>

      <div className="lr-nav">
        <button className="lr-nav-btn" onClick={prev} disabled={idx === 0}>← 上一課</button>
        {idx < lessons.length - 1 ? (
          <button className="lr-nav-btn primary" onClick={next}>下一課 →</button>
        ) : (
          <button className="lr-nav-btn primary" onClick={onBack}>完成 ✓</button>
        )}
      </div>
    </div>
  );
};
