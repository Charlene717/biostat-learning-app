// mobile-screens.jsx — phone-native screens for biostat app
const { useState, useMemo } = React;

// === Icons (24px, stroke-based) ===
const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  lib: <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h6v16H4zM10 4h4v16h-4zM14 6l4-1 3 14-4 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  concept: <svg viewBox="0 0 24 24" fill="none"><path d="M3 18c3-8 6-8 9 0s6 4 9-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/><circle cx="21" cy="14" r="1.5" fill="currentColor"/></svg>,
  quiz: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  cheat: <svg viewBox="0 0 24 24" fill="none"><path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 10h8M8 14h6M8 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  calc: <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="8" y="6" width="8" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/><circle cx="12" cy="13" r="0.8" fill="currentColor"/><circle cx="15" cy="13" r="0.8" fill="currentColor"/><circle cx="9" cy="17" r="0.8" fill="currentColor"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/><circle cx="15" cy="17" r="0.8" fill="currentColor"/></svg>,
  back: <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M10 3L4 8l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
};

// === Mobile dashboard ===
window.MHome = function MHome({ onNav, onOpenTopic }) {
  const D = window.AppData;
  const UM = window.UserManager;
  const fresh = UM ? UM.isFresh() : false;
  const userName = UM ? UM.getActiveUser().name : '同學';
  const prog = (t) => UM ? UM.topicProgress(t.id) : t.progress;
  const overall = UM ? UM.overallProgress() : D.topics.reduce((s, t) => s + t.progress, 0) / D.topics.length;
  const C = 2 * Math.PI * 20;
  const dash = C * overall;
  const inProgress = D.topics.filter(t => prog(t) > 0 && prog(t) < 1);
  const recommend = inProgress[0] || D.topics[0];

  const qs = window.QuizStats ? window.QuizStats.getSummary() : { answered: 0, correct: 0, sessions: 0, accuracy: 0 };
  const masteredCount = (window.QuizStats ? window.QuizStats.getReviewSuggestions() : []).filter(s => s.rate >= 0.8).length;

  const hour = new Date().getHours();
  const greet = hour < 11 ? '早安' : hour < 18 ? '午安' : '晚安';
  const today = new Date();
  const dateStr = `${today.getMonth()+1} 月 ${today.getDate()} 日`;

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">{dateStr}</div>
          <h1>{greet}，{userName}</h1>
        </div>
        <div className="avatar" onClick={() => window.openAccountModal && window.openAccountModal()}
          style={{cursor: 'pointer', background: UM ? UM.getActiveUser().color : 'var(--ink)'}}>
          {UM ? UM.getActiveUser().avatar : 'Y'}
        </div>
      </div>

      <div className="m-scroll">
        {/* Hero */}
        <div className="m-hero">
          <div className="eyebrow">{fresh ? '開始第一步' : '繼續上次的進度'}</div>
          <h3>{fresh ? '選一個主題開始吧' : recommend.zh}</h3>
          <div className="blurb">{fresh
            ? '完成題目即可累積專屬於你的學習進度。'
            : `上次學到「${recommend.blurb}」。`}</div>
          <div className="row">
            <button onClick={() => fresh ? onNav('lib') : onOpenTopic(recommend.id)}>
              {fresh ? '瀏覽主題 →' : '繼續 →'}
            </button>
            <span style={{fontSize: 12, color: 'rgba(255,255,255,.6)', fontFamily:'var(--f-mono)'}}>
              {Math.round(prog(recommend)*100)}%
            </span>
          </div>
          <svg className="ring" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4"/>
            <circle cx="28" cy="28" r="20" fill="none" stroke="white" strokeWidth="4"
              strokeDasharray={`${dash} ${C}`} strokeLinecap="round"
              transform="rotate(-90 28 28)" />
            <text x="28" y="32" textAnchor="middle"
              fontFamily="var(--f-mono)" fontSize="13" fill="white" fontWeight="600">
              {Math.round(overall*100)}%
            </text>
          </svg>
        </div>

        {/* Stats — real per-user */}
        <div className="m-section">
          <div className="m-stats">
            <div className="m-stat">
              <div className="k">完成 Session</div>
              <div className="v">{qs.sessions}<span style={{fontSize:12, color:'var(--ink-3)'}}>次</span></div>
              <div className="d">測驗練習</div>
            </div>
            <div className="m-stat">
              <div className="k">正確率</div>
              <div className="v">{qs.answered > 0 ? Math.round(qs.accuracy*100) : '—'}<span style={{fontSize:12, color:'var(--ink-3)'}}>{qs.answered > 0 ? '%' : ''}</span></div>
              <div className="d">{qs.correct}/{qs.answered} 題</div>
            </div>
            <div className="m-stat">
              <div className="k">作答題數</div>
              <div className="v">{qs.answered}<span style={{fontSize:12, color:'var(--ink-3)'}}>題</span></div>
              <div className="d">累積回答</div>
            </div>
            <div className="m-stat">
              <div className="k">熟練主題</div>
              <div className="v">{masteredCount}<span style={{fontSize:12, color:'var(--ink-3)'}}>/{D.topics.length}</span></div>
              <div className="d">≥ 80% 正確率</div>
            </div>
          </div>
        </div>

        {/* Continue */}
        <div className="m-section">
          <div className="m-section-head">
            <h2>繼續學習</h2>
            <span className="link" onClick={() => onNav('lib')}>查看全部 ›</span>
          </div>
          {inProgress.length > 0 ? inProgress.slice(0, 3).map(t => (
            <div key={t.id} className="m-topic" onClick={() => onOpenTopic(t.id)}>
              <div className="no">{t.no}</div>
              <div className="titles">
                <div className="zh">{t.zh}</div>
                <div className="en">{t.en}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="pct">{Math.round(prog(t)*100)}%</div>
                <div style={{width: 48, marginTop: 4}}>
                  <div className="progress"><i style={{width: `${prog(t)*100}%`}} /></div>
                </div>
              </div>
            </div>
          )) : (
            <div style={{
              padding: '20px 16px', textAlign: 'center',
              background: 'var(--panel)', border: '1px solid var(--line)',
              borderRadius: 14, color: 'var(--ink-3)', fontSize: 13
            }}>
              還沒有進行中的主題<br/>
              <button onClick={() => onNav('lib')} style={{
                marginTop: 10, background: 'var(--ink)', color: 'var(--bg)',
                border: 0, borderRadius: 999, padding: '8px 16px',
                fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer'
              }}>瀏覽主題庫 →</button>
            </div>
          )}
        </div>

        {/* Daily challenge */}
        <div className="m-section">
          <div className="m-section-head">
            <h2>每日一題</h2>
            <span className="link">Day 12</span>
          </div>
          <div className="m-daily">
            <div className="eyebrow">CHALLENGE</div>
            <h3>p-value = 0.03 的詮釋</h3>
            <p>下列何者是<strong>錯誤</strong>的詮釋方式？</p>
            <button onClick={() => onNav('quiz')}>挑戰 →</button>
          </div>
        </div>

        {/* Activity */}
        {(() => {
          const hist = window.QuizStats ? window.QuizStats.getRecentHistory(7) : [];
          if (hist.length === 0) return null;
          return (
            <div className="m-section">
              <div className="m-section-head">
                <h2>近期測驗表現</h2>
                <span className="link">最近 {hist.length} 次</span>
              </div>
              <div className="m-activity">
                {hist.map((hh, i) => {
                  const p = hh.total > 0 ? hh.correct / hh.total : 0;
                  return (
                    <div key={i} className="bar" style={{
                      height: Math.max(8, p * 70),
                      background: p >= 0.75 ? 'var(--good)' : p >= 0.6 ? 'var(--accent)' : 'var(--warn)'
                    }}>
                      <span className="lbl">{Math.round(p*100)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
};

// === Library ===
window.MLib = function MLib({ onOpenTopic }) {
  const D = window.AppData;
  const [f, setF] = useState('all');
  const tags = ['all', '基礎', '推論', '建模', '進階', '臨床'];
  const tagLabel = { all: '全部', '基礎':'基礎','推論':'推論','建模':'建模','進階':'進階','臨床':'臨床' };
  const list = f === 'all' ? D.topics : D.topics.filter(t => t.tag === f);

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">Library · {D.topics.length} 主題</div>
          <h1>主題庫</h1>
        </div>
      </div>

      <div className="m-chips">
        {tags.map(t => (
          <button key={t}
            className={`m-chip ${f === t ? 'active' : ''}`}
            onClick={() => setF(t)}>
            {tagLabel[t]}
          </button>
        ))}
      </div>

      <div className="m-scroll" style={{paddingTop: 16}}>
        <div className="m-section" style={{padding: '0 20px'}}>
          {list.map(t => (
            <div key={t.id} className="m-lib-card" onClick={() => onOpenTopic(t.id)}>
              <div className="top">
                <span className="num">CH {t.no}</span>
                <span className={`tag ${t.tagColor}`}>{t.tag}</span>
              </div>
              <h3>{t.zh}</h3>
              <div className="en">{t.en}</div>
              <div className="blurb">{t.blurb}</div>
              <div className="meta">
                <div className="progress"><i style={{width: `${(window.UserManager ? window.UserManager.topicProgress(t.id) : t.progress)*100}%`}} /></div>
                <span style={{color: 'var(--ink)', fontWeight: 600}}>{Math.round((window.UserManager ? window.UserManager.topicProgress(t.id) : t.progress)*100)}%</span>
                <span>· {t.lessons} 課</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// === Concept ===
window.MConcept = function MConcept({ chartStyle }) {
  const [dist, setDist] = useState('normal');
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [lo, setLo] = useState(-1.96);
  const [hi, setHi] = useState(1.96);
  const [n, setN] = useState(15);
  const [p, setP] = useState(0.4);
  const [lambda, setLambda] = useState(3);

  const prob = (window.Stats.normCDF(hi, mu, sigma) - window.Stats.normCDF(lo, mu, sigma)) * 100;

  const info = {
    normal:   { t: '常態 Normal',   fx: 'X ~ N(μ, σ²)' },
    binomial: { t: '二項 Binomial',  fx: 'X ~ Bin(n, p)' },
    poisson:  { t: '卜瓦松 Poisson', fx: 'X ~ Pois(λ)' }
  };

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">02 · Interactive</div>
          <h1>機率分布</h1>
        </div>
      </div>

      <div className="m-concept-tabs">
        {Object.entries(info).map(([k, v]) => (
          <button key={k}
            className={`m-concept-tab ${dist === k ? 'active' : ''}`}
            onClick={() => setDist(k)}>
            {v.t.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="m-scroll" style={{paddingTop: 4}}>
        <div className="m-plot">
          <h3>{info[dist].t}</h3>
          <div className="fx">{info[dist].fx}</div>
          {dist === 'normal' && <window.NormalPlot mu={mu} sigma={sigma} lo={lo} hi={hi} chartStyle={chartStyle} />}
          {dist === 'binomial' && <window.BinomialPlot n={n} p={p} />}
          {dist === 'poisson' && <window.PoissonPlot lambda={lambda} />}
        </div>

        {dist === 'normal' && (
          <>
            <div className="m-control">
              <label>μ 平均 <span className="val">{mu.toFixed(2)}</span></label>
              <input type="range" min="-3" max="3" step="0.1" value={mu} onChange={e=>setMu(+e.target.value)} />
            </div>
            <div className="m-control">
              <label>σ 標準差 <span className="val">{sigma.toFixed(2)}</span></label>
              <input type="range" min="0.3" max="3" step="0.1" value={sigma} onChange={e=>setSigma(+e.target.value)} />
            </div>
            <div className="m-control">
              <label>下界 a <span className="val">{lo.toFixed(2)}</span></label>
              <input type="range" min="-5" max="5" step="0.05" value={lo}
                onChange={e=>setLo(Math.min(+e.target.value, hi - 0.1))} />
            </div>
            <div className="m-control">
              <label>上界 b <span className="val">{hi.toFixed(2)}</span></label>
              <input type="range" min="-5" max="5" step="0.05" value={hi}
                onChange={e=>setHi(Math.max(+e.target.value, lo + 0.1))} />
            </div>
            <div className="m-readout" style={{marginTop: 12}}>
              <div className="b"><div className="k">P(a ≤ X ≤ b)</div><div className="v">{prob.toFixed(1)}%</div></div>
              <div className="b"><div className="k">σ²</div><div className="v">{(sigma*sigma).toFixed(2)}</div></div>
            </div>
          </>
        )}
        {dist === 'binomial' && (
          <>
            <div className="m-control">
              <label>n 試驗數 <span className="val">{n}</span></label>
              <input type="range" min="2" max="40" step="1" value={n} onChange={e=>setN(+e.target.value)} />
            </div>
            <div className="m-control">
              <label>p 成功率 <span className="val">{p.toFixed(2)}</span></label>
              <input type="range" min="0.05" max="0.95" step="0.01" value={p} onChange={e=>setP(+e.target.value)} />
            </div>
            <div className="m-readout" style={{marginTop: 12}}>
              <div className="b"><div className="k">E[X]</div><div className="v">{(n*p).toFixed(2)}</div></div>
              <div className="b"><div className="k">SD</div><div className="v">{Math.sqrt(n*p*(1-p)).toFixed(2)}</div></div>
            </div>
          </>
        )}
        {dist === 'poisson' && (
          <>
            <div className="m-control">
              <label>λ 速率 <span className="val">{lambda.toFixed(1)}</span></label>
              <input type="range" min="0.5" max="15" step="0.1" value={lambda} onChange={e=>setLambda(+e.target.value)} />
            </div>
            <div className="m-readout" style={{marginTop: 12}}>
              <div className="b"><div className="k">P(X = 0)</div><div className="v">{(Math.exp(-lambda)*100).toFixed(1)}%</div></div>
              <div className="b"><div className="k">P(X ≥ 1)</div><div className="v">{((1-Math.exp(-lambda))*100).toFixed(1)}%</div></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// === Quiz ===
window.MQuiz = function MQuiz() {
  const D = window.AppData;
  const bank = window.QuizBank || [];
  const [mode, setMode] = useState('start'); // start | session | done
  const [topicF, setTopicF] = useState('all');
  const [diffF, setDiffF] = useState('all');
  const [count, setCount] = useState(10);
  const [session, setSession] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // per-question {value, revealed}
  const [recorded, setRecorded] = useState(false);

  const q = session[idx];
  const cur = answers[idx] || { value: null, revealed: false };
  const total = session.length;

  const topics = ['all', ...new Set(bank.map(q => q.topic))];

  const start = () => {
    const s = window.buildQuizSession({ topic: topicF, difficulty: diffF, count });
    if (s.length === 0) return;
    setSession(s);
    setAnswers(s.map(() => ({ value: null, revealed: false })));
    setIdx(0);
    setMode('session');
  };

  // Start a "wrong-only" session from previously incorrect questions
  const startWrongOnly = () => {
    const wrong = window.QuizStats.getWrongQuestions();
    if (wrong.length === 0) return;
    const s = wrong.slice(0, count).map(w => w.q);
    setSession(s);
    setAnswers(s.map(() => ({ value: null, revealed: false })));
    setIdx(0);
    setMode('session');
  };

  // Record stats when session done is rendered
  const recordIfDone = () => {
    if (mode === 'done' && session.length > 0 && !recorded) {
      const items = session.map((q, i) => ({
        q, value: answers[i].value,
        correct: window.isQuizCorrect(q, answers[i].value)
      }));
      window.QuizStats.recordSession(items);
      setRecorded(true);
    }
  };

  const updateAnswer = (val) => {
    setAnswers(a => a.map((x, i) => i === idx ? { ...x, value: val } : x));
  };
  const submit = () => {
    if (!window.isQuizAnswered(q, cur.value)) return;
    setAnswers(a => a.map((x, i) => i === idx ? { ...x, revealed: true } : x));
  };
  const next = () => {
    if (idx + 1 < total) setIdx(idx + 1);
    else { setMode('done'); }
  };
  const restart = () => { setMode('start'); setSession([]); setAnswers([]); setIdx(0); setRecorded(false); };

  const correct = answers.filter((a, i) => session[i] && window.isQuizCorrect(session[i], a.value)).length;
  const answered = answers.filter(a => a.revealed).length;

  // ====== Start screen ======
  if (mode === 'start') {
    const filteredCount = bank.filter(q =>
      (topicF === 'all' || q.topic === topicF) &&
      (diffF === 'all' || q.difficulty === diffF)
    ).length;
    const summary = window.QuizStats.getSummary();
    const suggestions = window.QuizStats.getReviewSuggestions();
    const wrongList = window.QuizStats.getWrongQuestions();
    const history = window.QuizStats.getRecentHistory(7);

    return (
      <>
        <div className="m-header">
          <div>
            <div className="greet">Practice · {bank.length} 題庫存</div>
            <h1>練習測驗</h1>
          </div>
        </div>
        <div className="m-scroll" style={{paddingTop: 8}}>

          {/* Progress card */}
          {summary.answered > 0 && (
            <div className="m-section" style={{padding: '0 20px'}}>
              <div className="m-stats">
                <div className="m-stat">
                  <div className="k">累積正確率</div>
                  <div className="v" style={{color: summary.accuracy >= 0.75 ? 'var(--good)' : summary.accuracy >= 0.6 ? 'var(--accent)' : 'var(--warn)'}}>
                    {(summary.accuracy*100).toFixed(0)}<span style={{fontSize:12, color:'var(--ink-3)'}}>%</span>
                  </div>
                  <div className="d">{summary.correct} / {summary.answered} 題</div>
                </div>
                <div className="m-stat">
                  <div className="k">完成 Session</div>
                  <div className="v">{summary.sessions}</div>
                  <div className="d">次練習</div>
                </div>
                <div className="m-stat">
                  <div className="k">待複習</div>
                  <div className="v" style={{color: wrongList.length > 0 ? 'var(--bad)' : 'var(--ink-3)'}}>
                    {wrongList.length}
                  </div>
                  <div className="d">錯題</div>
                </div>
                <div className="m-stat">
                  <div className="k">熟練主題</div>
                  <div className="v">
                    {Object.values(window.QuizStats.getSummary()).answered === 0 ? 0 :
                     suggestions.filter(s => s.rate >= 0.8).length}
                  </div>
                  <div className="d">≥ 80%</div>
                </div>
              </div>
            </div>
          )}

          {/* Activity sparkline */}
          {history.length > 0 && (
            <div className="m-section" style={{padding: '0 20px'}}>
              <div className="m-section-head">
                <h2>近期表現</h2>
                <span className="link">{history.length} 次</span>
              </div>
              <div className="m-activity" style={{padding: 0}}>
                {history.map((h, i) => {
                  const pct = h.total > 0 ? h.correct / h.total : 0;
                  return (
                    <div key={i} style={{
                      flex: 1, position: 'relative',
                      background: pct >= 0.75 ? 'var(--good)' : pct >= 0.6 ? 'var(--accent)' : 'var(--warn)',
                      borderRadius: '4px 4px 0 0',
                      opacity: 0.85,
                      height: Math.max(8, pct * 70),
                      minHeight: 4
                    }}>
                      <span style={{
                        position: 'absolute', left: '50%', bottom: -18,
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--f-mono)', fontSize: 9,
                        color: 'var(--ink-3)'
                      }}>
                        {Math.round(pct*100)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wrong-only quick start */}
          {wrongList.length > 0 && (
            <div className="m-section" style={{padding: '0 20px'}}>
              <div style={{
                background: 'oklch(0.96 0.04 25 / 0.6)',
                border: '1px solid oklch(0.85 0.08 25 / 0.4)',
                borderRadius: 16, padding: 16,
                color: 'oklch(0.36 0.10 25)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6}}>
                  <div style={{fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600}}>
                    待複習錯題
                  </div>
                  <span style={{fontFamily: 'var(--f-mono)', fontSize: 18, fontWeight: 600}}>{wrongList.length}</span>
                </div>
                <div style={{fontSize: 12.5, lineHeight: 1.55, marginBottom: 12}}>
                  上次答錯的題目集中於：
                  {[...new Set(wrongList.slice(0, 5).map(w => D.topics.find(t => t.id === w.topic)?.zh || w.topic))].slice(0, 3).join('、')}
                  。趁熱複習，提升熟練度。
                </div>
                <button onClick={startWrongOnly}
                  style={{
                    background: 'oklch(0.36 0.10 25)', color: 'white',
                    border: 0, borderRadius: 10, padding: '9px 14px',
                    fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}>
                  挑戰錯題 →
                </button>
              </div>
            </div>
          )}

          {/* Topic mastery suggestions */}
          {suggestions.length > 0 && (
            <div className="m-section" style={{padding: '0 20px'}}>
              <div className="m-section-head">
                <h2>建議複習主題</h2>
                <span className="link">{suggestions.length} 個</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                {suggestions.slice(0, 4).map(s => {
                  const t = D.topics.find(x => x.id === s.topic);
                  return (
                    <button key={s.topic}
                      onClick={() => { setTopicF(s.topic); }}
                      style={{
                        background: 'var(--panel)', border: '1px solid var(--line)',
                        borderRadius: 14, padding: '12px 14px',
                        display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12,
                        alignItems: 'center', textAlign: 'left',
                        fontFamily: 'inherit', cursor: 'pointer',
                        borderColor: topicF === s.topic ? 'var(--ink)' : 'var(--line)'
                      }}>
                      <div>
                        <div style={{fontWeight: 600, fontSize: 13.5}}>{t?.zh || s.topic}</div>
                        <div style={{fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2}}>
                          {s.correct} / {s.answered} 題正確
                        </div>
                      </div>
                      <div style={{width: 80}}>
                        <div className="progress"><i style={{
                          width: `${s.rate*100}%`,
                          background: s.rate >= 0.75 ? 'var(--good)' : s.rate >= 0.6 ? 'var(--accent)' : 'var(--warn)'
                        }} /></div>
                      </div>
                      <span style={{
                        fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 600,
                        color: s.rate >= 0.75 ? 'var(--good)' : s.rate >= 0.6 ? 'var(--ink)' : 'var(--bad)'
                      }}>{Math.round(s.rate*100)}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="m-section" style={{padding: '0 20px'}}>
            <div className="m-section-head">
              <h2>選擇主題</h2>
              <span className="link">{topicF === 'all' ? '全部' : topicF}</span>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {topics.map(t => {
                const lbl = t === 'all' ? '全部'
                  : (D.topics.find(x => x.id === t)?.zh || t);
                return (
                  <button key={t}
                    className={`m-chip ${topicF === t ? 'active' : ''}`}
                    onClick={() => setTopicF(t)}>
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="m-section" style={{padding: '0 20px'}}>
            <div className="m-section-head">
              <h2>難度</h2>
            </div>
            <div className="iv-pills">
              {[['all','全部'],[1,'入門'],[2,'標準'],[3,'進階']].map(([v, l]) => (
                <button key={v} className={`iv-pill ${diffF === v ? 'on' : ''}`}
                  onClick={() => setDiffF(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="m-section" style={{padding: '0 20px'}}>
            <div className="m-section-head">
              <h2>題數</h2>
            </div>
            <div className="iv-pills">
              {[5, 10, 20, filteredCount].map((c, i) => (
                <button key={i} className={`iv-pill ${count === c ? 'on' : ''}`}
                  onClick={() => setCount(c)}>
                  {i === 3 ? `全部 ${filteredCount}` : c}
                </button>
              ))}
            </div>
          </div>

          <div className="m-actions" style={{padding: '20px 20px 8px'}}>
            <button className="accent" onClick={start}
              disabled={filteredCount === 0}
              style={{opacity: filteredCount === 0 ? 0.4 : 1}}>
              {filteredCount === 0 ? '此分類無題目' : `開始 ${Math.min(count, filteredCount)} 題練習 →`}
            </button>
          </div>

          {summary.answered > 0 && (
            <div className="m-section" style={{padding: '0 20px'}}>
              <button onClick={() => {
                if (confirm('清除所有進度紀錄？此操作無法復原。')) {
                  window.QuizStats.resetAll();
                  setRecorded(false);
                  setMode('start');
                }
              }} style={{
                background: 'transparent', border: 0,
                color: 'var(--ink-3)', fontSize: 11, fontFamily: 'var(--f-mono)',
                padding: 8, cursor: 'pointer'
              }}>
                清除所有進度
              </button>
            </div>
          )}

        </div>
      </>
    );
  }

  // ====== Done screen ======
  if (mode === 'done') {
    recordIfDone();
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;
    const rank = pct >= 90 ? '優秀' : pct >= 75 ? '良好' : pct >= 60 ? '中等' : '需加強';
    const rankColor = pct >= 90 ? 'var(--good)' : pct >= 60 ? 'var(--accent)' : 'var(--warn)';
    return (
      <>
        <div className="m-header">
          <div>
            <div className="greet">Session 結束</div>
            <h1>{rank}</h1>
          </div>
        </div>
        <div className="m-scroll" style={{paddingTop: 8}}>
          <div className="m-section" style={{padding: '0 20px'}}>
            <div style={{
              background: 'var(--ink)', color: 'var(--bg)',
              borderRadius: 22, padding: 28, textAlign: 'center'
            }}>
              <div style={{fontFamily: 'var(--f-mono)', fontSize: 11,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                opacity: 0.6}}>正確率</div>
              <div style={{fontFamily: 'var(--f-mono)', fontSize: 56,
                fontWeight: 600, letterSpacing: '-0.03em', margin: '8px 0',
                color: rankColor}}>
                {pct}%
              </div>
              <div style={{fontSize: 14, opacity: 0.8}}>
                {correct} / {total} 題正確
              </div>
            </div>
          </div>

          <div className="m-section" style={{padding: '0 20px'}}>
            <div className="m-section-head">
              <h2>題目回顧</h2>
              <span className="link">點擊看解析</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {session.map((q, i) => {
                const isCorr = window.isQuizCorrect(q, answers[i].value);
                return (
                  <div key={i} style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'grid', gridTemplateColumns: '22px 1fr auto',
                    gap: 10, alignItems: 'center'
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: isCorr ? 'var(--good)' : 'var(--bad)',
                      color: 'white', display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600
                    }}>{isCorr ? '✓' : '✗'}</span>
                    <span style={{fontSize: 12.5, lineHeight: 1.45}}>
                      {q.stem.replace(/\*\*(.+?)\*\*/g, '$1').slice(0, 50)}
                      {q.stem.length > 50 ? '…' : ''}
                    </span>
                    <span style={{
                      fontFamily: 'var(--f-mono)', fontSize: 10,
                      color: 'var(--ink-3)'
                    }}>{window.quizTypeLabel(q.type)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="m-actions" style={{padding: '20px 20px 8px'}}>
            <button className="ghost" onClick={restart}>新測驗</button>
            <button className="primary" onClick={() => {
              const s = window.buildQuizSession({ topic: topicF, difficulty: diffF, count });
              if (s.length) {
                setSession(s);
                setAnswers(s.map(() => ({ value: null, revealed: false })));
                setIdx(0);
                setMode('session');
              }
            }}>再來一次</button>
          </div>
        </div>
      </>
    );
  }

  // ====== Session screen ======
  const topic = D.topics.find(t => t.id === q.topic);
  const diffLabels = ['', '入門', '標準', '進階'];

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">{idx + 1} / {total} · {correct}/{answered} 正確</div>
          <h1>練習測驗</h1>
        </div>
        <button className="m-chip" onClick={restart}
          style={{borderRadius: 8, padding: '4px 10px', fontSize: 11}}>結束</button>
      </div>

      <div className="m-quiz-prog">
        <span>{idx + 1} / {total}</span>
        <div className="bar"><i style={{width: `${((idx+1)/total)*100}%`}} /></div>
        <span className={`tag ${topic?.tagColor || 'mint'}`}>{topic?.zh}</span>
        <span style={{fontFamily:'var(--f-mono)', fontSize: 10, color:'var(--ink-3)'}}>
          {window.quizTypeLabel(q.type)} · {diffLabels[q.difficulty]}
        </span>
      </div>

      <div className="m-scroll" style={{paddingTop: 4}}>
        <p className="m-quiz-stem" dangerouslySetInnerHTML={{
          __html: q.stem.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        }} />

        <window.QuizQuestion q={q}
          answer={cur.value} revealed={cur.revealed}
          onSelect={updateAnswer} />

        {cur.revealed && (
          <div className="m-explain">
            <div className="head" style={{
              color: window.isQuizCorrect(q, cur.value) ? 'var(--good)' : 'var(--bad)'
            }}>
              {window.isQuizCorrect(q, cur.value) ? '正確！' : '再想想'} · 解釋
            </div>
            <p>{q.explain}</p>
          </div>
        )}

        <div className="m-actions">
          {cur.revealed ? (
            <button className="primary" onClick={next}>
              {idx + 1 < total ? '下一題 →' : '查看結果 →'}
            </button>
          ) : (
            <>
              <button className="ghost" onClick={() => updateAnswer(null)}>清除</button>
              <button className="accent" onClick={submit}
                style={{opacity: window.isQuizAnswered(q, cur.value) ? 1 : 0.4}}>
                送出答案
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// === Cheat ===
window.MCheat = function MCheat() {
  const D = window.AppData;
  const [q, setQ] = useState('');
  const list = D.cards.filter(c =>
    !q || c.title.includes(q) || c.formula.toLowerCase().includes(q.toLowerCase()) || c.note.includes(q)
  );
  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">04 · Quick Reference</div>
          <h1>速查卡片</h1>
        </div>
      </div>

      <div style={{padding: '0 20px 12px'}}>
        <input
          placeholder="搜尋公式或概念..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{
            width: '100%', padding: '11px 14px',
            borderRadius: 12, border: '1px solid var(--line)',
            background: 'var(--panel)', color: 'var(--ink)',
            fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box'
          }} />
      </div>

      <div className="m-scroll" style={{paddingTop: 4}}>
        <div className="m-cheat">
          {list.map((c, i) => (
            <div key={i} className="m-cheat-card">
              <div className="title">{c.title}</div>
              <div className="formula">{c.formula}</div>
              <div className="note">{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// === Calc ===
window.MCalc = function MCalc() {
  const groups = window.CalcCatalog;
  const [activeGroup, setActiveGroup] = useState(groups[0].group);
  const [activeId, setActiveId] = useState(groups[0].items[0].id);
  const group = groups.find(g => g.group === activeGroup);
  const item = group.items.find(i => i.id === activeId) || group.items[0];
  const Comp = item.Comp;

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">05 · {groups.reduce((s, g) => s + g.items.length, 0)} 個計算工具</div>
          <h1>計算機</h1>
        </div>
      </div>

      <div className="m-chips">
        {groups.map(g => (
          <button key={g.group}
            className={`m-chip ${activeGroup === g.group ? 'active' : ''}`}
            onClick={() => {
              setActiveGroup(g.group);
              setActiveId(g.items[0].id);
            }}>
            {g.group}
          </button>
        ))}
      </div>

      <div className="m-scroll" style={{paddingTop: 14}}>
        <div style={{padding: '0 20px 10px'}}>
          <div className="m-calc-tabs" style={{padding: 0, marginBottom: 12}}>
            {group.items.map(it => (
              <button key={it.id}
                className={`m-calc-tab ${activeId === it.id ? 'active' : ''}`}
                onClick={() => setActiveId(it.id)}>
                {it.title}
              </button>
            ))}
          </div>

          <div style={{marginBottom: 14}}>
            <div style={{fontFamily:'var(--f-mono)', fontSize:10.5, color:'var(--ink-3)',
              letterSpacing:'.1em', textTransform:'uppercase'}}>{item.sub}</div>
            <h2 style={{fontSize: 17, margin: '4px 0 0', fontWeight: 600, letterSpacing: '-0.01em'}}>
              {item.title}
            </h2>
          </div>

          <div className="m-calc">
            <Comp />
          </div>
        </div>
      </div>
    </>
  );
};

// === Topic Detail ===
window.MTopicDetail = function MTopicDetail({ topicId, onBack, chartStyle, onNav, onOpenLesson }) {
  const D = window.AppData;
  const t = D.topics.find(x => x.id === topicId) || D.topics[0];

  const ChartFor = () => {
    if (['prob','desc','ci','ht'].includes(t.id))
      return <window.NormalPlot mu={0} sigma={1} lo={-1.96} hi={1.96} chartStyle={chartStyle} />;
    if (t.id === 'reg') return <window.RegressionPlot slope={0.6} intercept={0.1} noise={0.6} />;
    if (t.id === 'surv') return <window.KMPlot hazardA={0.04} hazardB={0.07} />;
    if (t.id === 'diag') return <window.ROCPlot auc={0.86} />;
    return <window.BinomialPlot n={20} p={0.4} />;
  };

  return (
    <>
      <button className="m-back" onClick={onBack} style={{marginTop: 4}}>
        {Icon.back} 返回主題庫
      </button>

      <div className="m-scroll m-topic-detail" style={{paddingTop: 8}}>
        <div className="hero">
          <div className="num">Chapter {t.no} · {t.tag}</div>
          <h2>{t.zh}</h2>
          <div className="blurb">{t.blurb}</div>
          <div className="meta">
            <span>{t.en}</span>
            <span>·</span>
            <span>{t.lessons} 課</span>
            <span>·</span>
            <span>{t.time} min</span>
          </div>
        </div>

        <div className="m-plot">
          <h3>代表性視覺</h3>
          <div className="fx">live preview</div>
          <ChartFor />
        </div>

        {/* Lesson list */}
        {onOpenLesson && <window.LessonListMobile topicId={topicId} onOpen={onOpenLesson} />}

        <div className="m-section">
          <div className="m-stats">
            <div className="m-stat">
              <div className="k">進度</div>
              <div className="v">{Math.round((window.UserManager ? window.UserManager.topicProgress(t.id) : t.progress)*100)}<span style={{fontSize:12, color:'var(--ink-3)'}}>%</span></div>
              <div className="d">{t.lessons - Math.floor(t.lessons*(window.UserManager ? window.UserManager.topicProgress(t.id) : t.progress))} 課剩餘</div>
            </div>
            <div className="m-stat">
              <div className="k">難度</div>
              <div className="v" style={{display:'flex',alignItems:'center',gap:4,fontSize:20}}>
                {[1,2,3].map(i => (
                  <span key={i} style={{width:8,height:8,borderRadius:'50%',background: i<=t.difficulty?'var(--ink)':'var(--line-2)'}}></span>
                ))}
              </div>
              <div className="d">{['入門','標準','進階'][t.difficulty-1]}</div>
            </div>
          </div>
        </div>

        <div className="m-section">
          <div className="m-section-head">
            <h2>關鍵字</h2>
            <span className="link">{t.keywords.length}</span>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:'0 0 6px'}}>
            {t.keywords.map((k, i) => (
              <span key={i} style={{
                fontFamily:'var(--f-mono)', fontSize:11,
                padding:'4px 10px', border:'1px solid var(--line)',
                borderRadius:8, color:'var(--ink-2)'
              }}>{k}</span>
            ))}
          </div>
        </div>

        <div className="m-actions" style={{padding: '16px 20px 4px'}}>
          <button className="ghost" onClick={() => onNav('cheat')}>速查卡片</button>
          <button className="accent" onClick={() => onOpenLesson && onOpenLesson(0)}>開始第 1 課 →</button>
        </div>
      </div>
    </>
  );
};

// === Bottom Tab Bar ===
window.MTabBar = function MTabBar({ active, onNav }) {
  const tabs = [
    { id: 'home', label: '首頁', icon: Icon.home },
    { id: 'lib', label: '主題', icon: Icon.lib },
    { id: 'lab', label: '實驗', icon: Icon.concept },
    { id: 'quiz', label: '練習', icon: Icon.quiz },
    { id: 'calc', label: '工具', icon: Icon.calc }
  ];
  return (
    <div className="m-tabbar">
      {tabs.map(t => (
        <button key={t.id}
          className={`m-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onNav(t.id)}>
          {t.icon}
          <span className="label">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
