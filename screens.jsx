// screens.jsx - All screen components for Biostat app
const { useState, useMemo, useEffect } = React;

// ============ Sidebar Nav ============
window.Sidebar = function Sidebar({ active, onNav }) {
  const items = [
    { id: 'home',   no: '00', label: '儀表板' },
    { id: 'lib',    no: '01', label: '主題庫' },
    { id: 'concept',no: '02', label: '互動概念' },
    { id: 'lab',    no: '03', label: '實驗室' },
    { id: 'quiz',   no: '04', label: '練習測驗' },
    { id: 'cheat',  no: '05', label: '速查卡片' },
    { id: 'calc',   no: '06', label: '計算機' },
    { id: 'case',   no: '07', label: '臨床情境' }
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-mark">μ</div>
        <div>
          <div className="name">生物統計</div>
          <div className="sub">Biostat · Lab</div>
        </div>
      </div>
      <div className="sb-section">Learn</div>
      <nav className="sb-nav">
        {items.map(it => (
          <button key={it.id}
            className={`sb-item ${active === it.id ? 'active' : ''}`}
            onClick={() => onNav(it.id)}>
            <span className="sb-item-no">{it.no}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sb-streak" onClick={() => window.openAccountModal && window.openAccountModal()}>
        <div className="row">
          <div className="n">12</div>
          <div className="label">連續天數</div>
        </div>
        <div className="dots">
          {[1,1,1,1,1,1,0].map((on,i) => (
            <div key={i} className={`dot ${on?'on':''}`} />
          ))}
        </div>
        {window.UserManager && (() => {
          const u = window.UserManager.getActiveUser();
          return (
            <div className="acc-row">
              <div className="acc-mini" style={{background: u.color}}>{u.avatar}</div>
              <div className="acc-name">{u.name}</div>
              <div className="acc-switch">切換 ›</div>
            </div>
          );
        })()}
      </div>
    </aside>
  );
};

// ============ Dashboard ============
window.Dashboard = function Dashboard({ onOpenTopic, onNav }) {
  const D = window.AppData;
  // overall progress
  const overall = D.topics.reduce((s, t) => s + t.progress, 0) / D.topics.length;
  const C = 2 * Math.PI * 48;
  const dash = C * overall;

  // recommended = next incomplete with highest progress
  const recommend = [...D.topics].sort((a, b) =>
    b.progress > 0 && b.progress < 1
      ? (b.progress - a.progress)
      : 0
  ).filter(t => t.progress > 0 && t.progress < 1)[0] || D.topics[0];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">2026 · 春季學習計畫</div>
          <h1>早安，準備好繼續了嗎？</h1>
          <div className="sub">今天還有 1 個未完成的任務 · 預計 20 分鐘</div>
        </div>
        <div className="row">
          <button className="btn ghost sm">月度報告</button>
          <button className="btn sm">開始今日</button>
        </div>
      </div>

      <div className="dash-grid">
        <div className="col">
          {/* Hero */}
          <div className="hero">
            <div>
              <div className="eyebrow">繼續上次的進度</div>
              <h2>{recommend.zh} · {Math.round(recommend.progress*100)}% 完成</h2>
              <p>上次學到「{recommend.blurb}」。再花 12 分鐘可完成本章節，並解鎖下一個練習集。</p>
              <div className="row" style={{gap: 8}}>
                <button className="btn accent" onClick={() => onOpenTopic && onOpenTopic(recommend.id)}>
                  繼續學習 →
                </button>
                <button className="btn ghost" onClick={() => onNav && onNav('concept')}>互動模擬</button>
              </div>
            </div>
            <svg className="ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--line)" strokeWidth="6" />
              <circle cx="60" cy="60" r="48" fill="none"
                stroke="var(--accent)" strokeWidth="6"
                strokeDasharray={`${dash} ${C}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)" />
              <text className="big" x="60" y="62" textAnchor="middle">{Math.round(overall*100)}%</text>
              <text className="lbl" x="60" y="76" textAnchor="middle">OVERALL</text>
            </svg>
          </div>

          {/* Stats */}
          <div className="stat-row">
            <div className="stat">
              <div className="k">本週時數</div>
              <div className="v">4.2<span style={{fontSize:14, color:'var(--ink-3)'}}>h</span></div>
              <div className="d">+38% vs 上週</div>
            </div>
            <div className="stat">
              <div className="k">完成卡片</div>
              <div className="v">87</div>
              <div className="d">總共 142 張</div>
            </div>
            <div className="stat">
              <div className="k">測驗正確率</div>
              <div className="v">78<span style={{fontSize:14, color:'var(--ink-3)'}}>%</span></div>
              <div className="d">過去 30 題</div>
            </div>
            <div className="stat">
              <div className="k">熟練主題</div>
              <div className="v">3<span style={{fontSize:14, color:'var(--ink-3)'}}>/9</span></div>
              <div className="d">≥ 80% 完成</div>
            </div>
          </div>

          {/* Continue learning */}
          <div className="card">
            <div className="card-head">
              <h3>繼續學習</h3>
              <span className="meta">最近 · 3</span>
            </div>
            <div className="col" style={{gap: 8}}>
              {D.topics.filter(t => t.progress > 0 && t.progress < 1).slice(0, 3).map(t => (
                <div key={t.id} className="topic-card" onClick={() => onOpenTopic && onOpenTopic(t.id)}>
                  <span className="no">{t.no}</span>
                  <div className="titles">
                    <div className="zh">{t.zh}</div>
                    <div className="en">{t.en} · {t.lessons} lessons</div>
                  </div>
                  <div className="right">
                    <div className="pct">{Math.round(t.progress*100)}%</div>
                    <div style={{marginTop:4, width: 80}}>
                      <div className="progress"><i style={{width: `${t.progress*100}%`}} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <div className="card-head">
              <h3>本週活動</h3>
              <span className="meta">分鐘 / 天</span>
            </div>
            <div className="activity" style={{marginBottom: 22}}>
              {D.activity.map((a, i) => {
                const h = Math.max(4, (a.mins / 60) * 80);
                const today = i === 5;
                return (
                  <div key={a.day} className={`bar ${today ? 'today' : ''}`} style={{height: h}}>
                    <span className="lbl">{a.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col">
          {/* Agenda */}
          <div className="card">
            <div className="card-head">
              <h3>學習行事曆</h3>
              <span className="meta">本週</span>
            </div>
            {D.agenda.map((it, i) => (
              <div key={i} className={`agenda-item ${it.done ? 'done' : ''}`}>
                <div className="check">
                  {it.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M2 5l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="title">{it.title}</div>
                  <div className="meta">{it.time}</div>
                </div>
                <div className="dur">{it.dur}</div>
              </div>
            ))}
          </div>

          {/* Daily card */}
          <div className="card" style={{background: 'var(--accent-soft)', borderColor: 'transparent'}}>
            <div className="card-head">
              <h3 style={{color:'var(--accent-ink)'}}>每日一題</h3>
              <span className="meta" style={{color:'var(--accent-ink)', opacity:.7}}>Day 12</span>
            </div>
            <p style={{margin: '0 0 14px', fontSize: 13, color:'var(--accent-ink)', lineHeight: 1.55}}>
              一個檢定的 p-value = 0.03，下列何者是<strong>錯誤</strong>的詮釋？
            </p>
            <button className="btn accent" onClick={() => onNav && onNav('quiz')}>挑戰今日題 →</button>
          </div>

          {/* mini cheat */}
          <div className="card">
            <div className="card-head">
              <h3>速查重點</h3>
              <span className="meta">隨機</span>
            </div>
            <div className="fx" style={{marginBottom: 10}}>
              SE = s / √n
            </div>
            <div style={{fontSize: 12, color:'var(--ink-3)', lineHeight: 1.55}}>
              標準誤 = 標準差除以樣本數平方根。它描述「樣本平均」這個估計量的不確定性，不是個別觀測值的離散度。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Library ============
window.Library = function Library({ onOpenTopic }) {
  const D = window.AppData;
  const [filter, setFilter] = useState('all');
  const tags = [
    { id: 'all', label: '全部', count: D.topics.length },
    { id: '基礎', label: '基礎' },
    { id: '推論', label: '推論' },
    { id: '建模', label: '建模' },
    { id: '進階', label: '進階' },
    { id: '臨床', label: '臨床' }
  ];
  const list = filter === 'all' ? D.topics : D.topics.filter(t => t.tag === filter);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">Library · {D.topics.length} topics</div>
          <h1>主題庫</h1>
          <div className="sub">從描述統計到 Cox 比例風險。每個主題包含概念、互動、練習、計算工具。</div>
        </div>
        <div className="row">
          <button className="btn ghost sm">排序</button>
          <button className="btn sm">+ 新增筆記</button>
        </div>
      </div>

      <div className="row" style={{flexWrap: 'wrap', gap: 8, marginBottom: 18}}>
        {tags.map(t => (
          <button key={t.id}
            className={`chip ${filter === t.id ? '' : 'ghost'}`}
            style={{cursor:'pointer', border: 'none', padding:'6px 12px', fontSize: 12}}
            onClick={() => setFilter(t.id)}>
            {t.label} {t.count && <span style={{opacity:.5, marginLeft: 4}}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="lib-grid">
        {list.map(t => (
          <div key={t.id} className="lib-card" onClick={() => onOpenTopic && onOpenTopic(t.id)}>
            <div className="top">
              <div>
                <div className="num">CH {t.no}</div>
              </div>
              <span className={`chip ${t.tagColor}`}>{t.tag}</span>
            </div>
            <h3>{t.zh}</h3>
            <div className="en">{t.en}</div>
            <div className="blurb">{t.blurb}</div>
            <div className="kw">
              {t.keywords.map((k, i) => <span key={i}>{k}</span>)}
            </div>
            <div className="foot">
              <span>{t.lessons} lessons · {t.time} min</span>
              <span className="diff">
                {[1,2,3].map(i => <i key={i} className={i <= t.difficulty ? 'on' : ''} />)}
              </span>
            </div>
            <div className="foot" style={{marginTop: 8}}>
              <div className="progress"><i style={{width: `${t.progress*100}%`}} /></div>
              <span className="pct">{Math.round(t.progress*100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Concept Page ============
window.ConceptPage = function ConceptPage({ chartStyle = 'curve' }) {
  const [dist, setDist] = useState('normal');
  // Normal params
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [lo, setLo] = useState(-1.96);
  const [hi, setHi] = useState(1.96);
  // Binomial
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.4);
  // Poisson
  const [lambda, setLambda] = useState(4);

  const prob = (window.Stats.normCDF(hi, mu, sigma) - window.Stats.normCDF(lo, mu, sigma)) * 100;

  const distInfo = {
    normal: {
      title: '常態分布',
      en: 'Normal · Gaussian',
      formula: 'X ~ N(μ, σ²)    f(x) = (1/σ√2π) · exp(−(x−μ)²/2σ²)',
      note: '中央極限定理保證樣本平均隨樣本數增加而趨近常態。生物醫學中最常見的連續分布。'
    },
    binomial: {
      title: '二項分布',
      en: 'Binomial',
      formula: 'X ~ Bin(n, p)    P(X=k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ',
      note: 'n 個獨立伯努利試驗中「成功」次數。例：n 位受試者中療效有效者人數。'
    },
    poisson: {
      title: '卜瓦松分布',
      en: 'Poisson',
      formula: 'X ~ Pois(λ)    P(X=k) = e⁻λ · λᵏ / k!',
      note: '單位時間／空間內罕見事件次數。例：單日急診來院數、每千人年發生率。'
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">02 · Interactive Concepts</div>
          <h1>機率分布實驗室</h1>
          <div className="sub">拖動滑桿改變參數，即時觀察分布形狀與機率質量。</div>
        </div>
      </div>

      <div className="tabs">
        {[
          { id: 'normal', label: '常態 Normal' },
          { id: 'binomial', label: '二項 Binomial' },
          { id: 'poisson', label: '卜瓦松 Poisson' }
        ].map(t => (
          <button key={t.id}
            className={`tab ${dist === t.id ? 'active' : ''}`}
            onClick={() => setDist(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="concept-grid">
        <div className="plot-wrap">
          <h2>{distInfo[dist].title}</h2>
          <div className="meta">{distInfo[dist].en}</div>
          <div className="fx" style={{marginBottom: 18}}>{distInfo[dist].formula}</div>

          {dist === 'normal' && (
            <window.NormalPlot mu={mu} sigma={sigma} lo={lo} hi={hi} chartStyle={chartStyle} />
          )}
          {dist === 'binomial' && <window.BinomialPlot n={n} p={p} />}
          {dist === 'poisson' && <window.PoissonPlot lambda={lambda} />}
        </div>

        <div className="col">
          <div className="card">
            <div className="card-head">
              <h3>參數控制</h3>
              <span className="meta">live</span>
            </div>
            <div className="controls">
              {dist === 'normal' && (
                <>
                  <div className="ctrl">
                    <label>μ (平均) <span className="val">{mu.toFixed(2)}</span></label>
                    <input type="range" min="-3" max="3" step="0.1" value={mu}
                      onChange={e => setMu(+e.target.value)} />
                  </div>
                  <div className="ctrl">
                    <label>σ (標準差) <span className="val">{sigma.toFixed(2)}</span></label>
                    <input type="range" min="0.3" max="3" step="0.1" value={sigma}
                      onChange={e => setSigma(+e.target.value)} />
                  </div>
                  <div className="ctrl">
                    <label>下界 a <span className="val">{lo.toFixed(2)}</span></label>
                    <input type="range" min="-5" max="5" step="0.05" value={lo}
                      onChange={e => setLo(Math.min(+e.target.value, hi - 0.1))} />
                  </div>
                  <div className="ctrl">
                    <label>上界 b <span className="val">{hi.toFixed(2)}</span></label>
                    <input type="range" min="-5" max="5" step="0.05" value={hi}
                      onChange={e => setHi(Math.max(+e.target.value, lo + 0.1))} />
                  </div>
                </>
              )}
              {dist === 'binomial' && (
                <>
                  <div className="ctrl">
                    <label>n (試驗數) <span className="val">{n}</span></label>
                    <input type="range" min="2" max="60" step="1" value={n}
                      onChange={e => setN(+e.target.value)} />
                  </div>
                  <div className="ctrl">
                    <label>p (成功率) <span className="val">{p.toFixed(2)}</span></label>
                    <input type="range" min="0.05" max="0.95" step="0.01" value={p}
                      onChange={e => setP(+e.target.value)} />
                  </div>
                </>
              )}
              {dist === 'poisson' && (
                <div className="ctrl">
                  <label>λ (速率) <span className="val">{lambda.toFixed(1)}</span></label>
                  <input type="range" min="0.5" max="20" step="0.1" value={lambda}
                    onChange={e => setLambda(+e.target.value)} />
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>即時讀數</h3>
              <span className="meta">summary</span>
            </div>
            {dist === 'normal' && (
              <div className="readout">
                <div className="b">
                  <div className="k">P(a ≤ X ≤ b)</div>
                  <div className="v">{prob.toFixed(2)}%</div>
                </div>
                <div className="b">
                  <div className="k">μ</div>
                  <div className="v">{mu.toFixed(2)}</div>
                </div>
                <div className="b">
                  <div className="k">σ²</div>
                  <div className="v">{(sigma*sigma).toFixed(2)}</div>
                </div>
                <div className="b">
                  <div className="k">2.5%–97.5%</div>
                  <div className="v" style={{fontSize: 13}}>
                    [{(mu - 1.96*sigma).toFixed(2)}, {(mu + 1.96*sigma).toFixed(2)}]
                  </div>
                </div>
              </div>
            )}
            {dist === 'binomial' && (
              <div className="readout">
                <div className="b"><div className="k">E[X]</div><div className="v">{(n*p).toFixed(2)}</div></div>
                <div className="b"><div className="k">Var</div><div className="v">{(n*p*(1-p)).toFixed(2)}</div></div>
                <div className="b"><div className="k">SD</div><div className="v">{Math.sqrt(n*p*(1-p)).toFixed(2)}</div></div>
                <div className="b"><div className="k">P(X = E[X])</div><div className="v">
                  {(window.Stats.binomPMF(Math.round(n*p), n, p)*100).toFixed(1)}%
                </div></div>
              </div>
            )}
            {dist === 'poisson' && (
              <div className="readout">
                <div className="b"><div className="k">E[X] = Var</div><div className="v">{lambda.toFixed(1)}</div></div>
                <div className="b"><div className="k">P(X = 0)</div>
                  <div className="v">{(Math.exp(-lambda)*100).toFixed(2)}%</div>
                </div>
                <div className="b"><div className="k">P(X ≥ 1)</div>
                  <div className="v">{((1-Math.exp(-lambda))*100).toFixed(1)}%</div>
                </div>
                <div className="b"><div className="k">Mode</div>
                  <div className="v">{Math.floor(lambda)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="side-note">
            <h4>學習提示</h4>
            <p>{distInfo[dist].note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Quiz ============
window.QuizPage = function QuizPage({ difficulty = 2 }) {
  const D = window.AppData;
  const bank = window.QuizBank || [];
  const [mode, setMode] = useState('start');
  const [topicF, setTopicF] = useState('all');
  const [diffF, setDiffF] = useState('all');
  const [count, setCount] = useState(10);
  const [session, setSession] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
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
    setIdx(0); setMode('session'); setRecorded(false);
  };

  const startWrongOnly = () => {
    const wrong = window.QuizStats.getWrongQuestions();
    if (wrong.length === 0) return;
    const s = wrong.slice(0, count).map(w => w.q);
    setSession(s);
    setAnswers(s.map(() => ({ value: null, revealed: false })));
    setIdx(0); setMode('session'); setRecorded(false);
  };

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
  const updateAnswer = (val) => setAnswers(a => a.map((x, i) => i === idx ? { ...x, value: val } : x));
  const submit = () => {
    if (!window.isQuizAnswered(q, cur.value)) return;
    setAnswers(a => a.map((x, i) => i === idx ? { ...x, revealed: true } : x));
  };
  const next = () => { if (idx + 1 < total) setIdx(idx + 1); else setMode('done'); };
  const restart = () => { setMode('start'); setSession([]); setAnswers([]); setIdx(0); setRecorded(false); };

  const correct = answers.filter((a, i) => session[i] && window.isQuizCorrect(session[i], a.value)).length;
  const answered = answers.filter(a => a.revealed).length;

  // === Start screen ===
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
      <div>
        <div className="page-head">
          <div>
            <div className="crumb">04 · Practice · {bank.length} 題庫存</div>
            <h1>練習測驗</h1>
            <div className="sub">混合題型：單選、複選、是非、數值計算。所有題目附解析與進度追蹤。</div>
          </div>
          {summary.answered > 0 && (
            <button className="btn ghost sm"
              onClick={() => {
                if (confirm('清除所有進度紀錄？')) {
                  window.QuizStats.resetAll();
                  setRecorded(false);
                  setMode('start');
                }
              }}>清除進度</button>
          )}
        </div>

        {/* Stats row (only after first session) */}
        {summary.answered > 0 && (
          <div className="stat-row" style={{marginBottom: 16}}>
            <div className="stat">
              <div className="k">累積正確率</div>
              <div className="v" style={{color: summary.accuracy >= 0.75 ? 'var(--good)' : summary.accuracy >= 0.6 ? 'var(--accent)' : 'var(--warn)'}}>
                {(summary.accuracy*100).toFixed(0)}<span style={{fontSize:14, color:'var(--ink-3)'}}>%</span>
              </div>
              <div className="d">{summary.correct} / {summary.answered} 題</div>
            </div>
            <div className="stat">
              <div className="k">完成 Session</div>
              <div className="v">{summary.sessions}</div>
              <div className="d">次練習</div>
            </div>
            <div className="stat">
              <div className="k">待複習錯題</div>
              <div className="v" style={{color: wrongList.length > 0 ? 'var(--bad)' : 'var(--ink-3)'}}>
                {wrongList.length}
              </div>
              <div className="d">過去答錯</div>
            </div>
            <div className="stat">
              <div className="k">熟練主題</div>
              <div className="v">{suggestions.filter(s => s.rate >= 0.8).length}<span style={{fontSize:14, color:'var(--ink-3)'}}>/{suggestions.length}</span></div>
              <div className="d">≥ 80% 正確率</div>
            </div>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 920, marginBottom: 16}}>
          <div className="card">
            <div className="card-head"><h3>選擇主題</h3>
              <span className="meta">{topicF === 'all' ? '全部' : topicF}</span></div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {topics.map(t => {
                const lbl = t === 'all' ? '全部' : (D.topics.find(x => x.id === t)?.zh || t);
                return (
                  <button key={t}
                    className={`chip ${topicF === t ? '' : 'ghost'}`}
                    style={{cursor: 'pointer', border: 'none', padding: '5px 10px', fontSize: 12}}
                    onClick={() => setTopicF(t)}>{lbl}</button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>難度與題數</h3></div>
            <div style={{fontSize: 12, color: 'var(--ink-3)', marginBottom: 6}}>難度</div>
            <div className="iv-pills" style={{marginBottom: 14}}>
              {[['all','全部'],[1,'入門'],[2,'標準'],[3,'進階']].map(([v, l]) => (
                <button key={v} className={`iv-pill ${diffF === v ? 'on' : ''}`}
                  onClick={() => setDiffF(v)}>{l}</button>
              ))}
            </div>

            <div style={{fontSize: 12, color: 'var(--ink-3)', marginBottom: 6}}>題數</div>
            <div className="iv-pills">
              {[5, 10, 20, filteredCount].map((c, i) => (
                <button key={i} className={`iv-pill ${count === c ? 'on' : ''}`}
                  onClick={() => setCount(c)}>
                  {i === 3 ? `全部 ${filteredCount}` : c}
                </button>
              ))}
            </div>

            <button className="btn accent" style={{width: '100%', marginTop: 14, justifyContent: 'center'}}
              onClick={start} disabled={filteredCount === 0}>
              開始 {Math.min(count, filteredCount)} 題練習 →
            </button>
          </div>
        </div>

        {/* Wrong-only + suggestions side by side */}
        {(wrongList.length > 0 || suggestions.length > 0) && (
          <div style={{display: 'grid', gridTemplateColumns: wrongList.length > 0 ? '1fr 1.4fr' : '1fr', gap: 16, maxWidth: 920, marginBottom: 16}}>
            {wrongList.length > 0 && (
              <div className="card" style={{
                background: 'oklch(0.96 0.04 25 / 0.6)',
                borderColor: 'oklch(0.85 0.08 25 / 0.5)',
                color: 'oklch(0.36 0.10 25)'
              }}>
                <div className="card-head">
                  <h3 style={{color: 'inherit'}}>待複習錯題</h3>
                  <span className="meta" style={{color: 'inherit', opacity: 0.7}}>{wrongList.length} 題</span>
                </div>
                <p style={{fontSize: 12.5, lineHeight: 1.6, margin: '0 0 12px'}}>
                  錯題會累積在這裡。挑戰錯題模式只抽你過去答錯的題目，幫助鞏固弱項。
                </p>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14}}>
                  {wrongList.slice(0, 3).map((w, i) => {
                    const t = D.topics.find(x => x.id === w.topic);
                    return (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: 8, padding: '8px 10px',
                        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8,
                        alignItems: 'center', fontSize: 12
                      }}>
                        <span className={`chip ${t?.tagColor || 'mint'}`} style={{fontSize: 10, padding: '2px 6px'}}>
                          {t?.zh || w.topic}
                        </span>
                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {w.q.stem.replace(/\*\*(.+?)\*\*/g, '$1')}
                        </span>
                        <span style={{fontFamily: 'var(--f-mono)', fontSize: 10, opacity: 0.7}}>
                          ×{w.count}
                        </span>
                      </div>
                    );
                  })}
                  {wrongList.length > 3 && (
                    <div style={{fontSize: 11, opacity: 0.7, fontStyle: 'italic'}}>
                      ⋯ 還有 {wrongList.length - 3} 題
                    </div>
                  )}
                </div>
                <button className="btn" onClick={startWrongOnly}
                  style={{background: 'oklch(0.36 0.10 25)', color: 'white'}}>
                  挑戰錯題 →
                </button>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <h3>建議複習主題</h3>
                  <span className="meta">依正確率排序</span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {suggestions.slice(0, 5).map(s => {
                    const t = D.topics.find(x => x.id === s.topic);
                    return (
                      <button key={s.topic}
                        onClick={() => setTopicF(s.topic)}
                        style={{
                          background: topicF === s.topic ? 'color-mix(in oklch, var(--ink) 4%, var(--bg))' : 'var(--bg)',
                          border: '1px solid var(--line)',
                          borderRadius: 10, padding: '10px 12px',
                          display: 'grid', gridTemplateColumns: '1fr 100px 50px', gap: 12,
                          alignItems: 'center', textAlign: 'left',
                          fontFamily: 'inherit', cursor: 'pointer',
                          color: 'inherit'
                        }}>
                        <div>
                          <div style={{fontWeight: 600, fontSize: 13}}>{t?.zh || s.topic}</div>
                          <div style={{fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2}}>
                            {s.correct} / {s.answered} 題
                          </div>
                        </div>
                        <div className="progress"><i style={{
                          width: `${s.rate*100}%`,
                          background: s.rate >= 0.75 ? 'var(--good)' : s.rate >= 0.6 ? 'var(--accent)' : 'var(--warn)'
                        }} /></div>
                        <span style={{
                          fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600, textAlign: 'right',
                          color: s.rate >= 0.75 ? 'var(--good)' : s.rate >= 0.6 ? 'var(--ink)' : 'var(--bad)'
                        }}>{Math.round(s.rate*100)}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent activity */}
        {history.length > 0 && (
          <div className="card" style={{maxWidth: 920}}>
            <div className="card-head">
              <h3>近期表現</h3>
              <span className="meta">最近 {history.length} 次</span>
            </div>
            <div className="activity" style={{height: 80, marginBottom: 22}}>
              {history.map((h, i) => {
                const pct = h.total > 0 ? h.correct / h.total : 0;
                return (
                  <div key={i} className="bar" style={{
                    height: Math.max(8, pct * 80),
                    background: pct >= 0.75 ? 'var(--good)' : pct >= 0.6 ? 'var(--accent)' : 'var(--warn)'
                  }}>
                    <span className="lbl">{Math.round(pct*100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // === Done screen ===
  if (mode === 'done') {
    recordIfDone();
    const pct = total > 0 ? Math.round(correct / total * 100) : 0;
    const rank = pct >= 90 ? '優秀' : pct >= 75 ? '良好' : pct >= 60 ? '中等' : '需加強';
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="crumb">Session 結束 · {rank}</div>
            <h1>練習完成</h1>
          </div>
          <div className="row">
            <button className="btn ghost sm" onClick={restart}>新測驗</button>
            <button className="btn sm" onClick={() => {
              const s = window.buildQuizSession({ topic: topicF, difficulty: diffF, count });
              setSession(s);
              setAnswers(s.map(() => ({ value: null, revealed: false })));
              setIdx(0); setMode('session');
            }}>再來一次</button>
          </div>
        </div>

        <div style={{
          background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 22, padding: 32, textAlign: 'center',
          maxWidth: 880, marginBottom: 16
        }}>
          <div style={{fontFamily:'var(--f-mono)', fontSize: 11, opacity: 0.6,
            letterSpacing: '0.15em', textTransform: 'uppercase'}}>正確率</div>
          <div style={{fontFamily:'var(--f-mono)', fontSize: 72, fontWeight: 600,
            letterSpacing: '-0.03em', margin: '4px 0 4px',
            color: pct >= 90 ? 'var(--good)' : pct >= 60 ? 'var(--accent)' : 'var(--warn)'}}>
            {pct}%
          </div>
          <div style={{fontSize: 15, opacity: 0.8}}>{correct} / {total} 題正確</div>
        </div>

        <div className="card" style={{maxWidth: 880}}>
          <div className="card-head"><h3>題目回顧</h3><span className="meta">{session.length} 題</span></div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {session.map((q, i) => {
              const isCorr = window.isQuizCorrect(q, answers[i].value);
              const t = D.topics.find(x => x.id === q.topic);
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '22px 80px 1fr auto',
                  gap: 12, alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px dashed var(--line)'
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: isCorr ? 'var(--good)' : 'var(--bad)',
                    color: 'white', display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600
                  }}>{isCorr ? '✓' : '✗'}</span>
                  <span className={`chip ${t?.tagColor || 'mint'}`} style={{justifySelf: 'start'}}>
                    {t?.zh || q.topic}
                  </span>
                  <span style={{fontSize: 13, lineHeight: 1.4}}>
                    {q.stem.replace(/\*\*(.+?)\*\*/g, '$1').slice(0, 80)}
                    {q.stem.length > 80 ? '…' : ''}
                  </span>
                  <span style={{fontFamily:'var(--f-mono)', fontSize: 10,
                    color: 'var(--ink-3)'}}>{window.quizTypeLabel(q.type)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // === Session screen ===
  const topic = D.topics.find(t => t.id === q.topic);
  const diffLabels = ['', '入門', '標準', '進階'];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">{idx + 1} / {total} · {correct}/{answered} 正確</div>
          <h1>練習測驗</h1>
        </div>
        <button className="btn ghost sm" onClick={restart}>結束</button>
      </div>

      <div className="quiz-card">
        <div className="quiz-prog">
          <span>題 {idx + 1} / {total}</span>
          <div className="bar"><i style={{width: `${((idx+1)/total)*100}%`}} /></div>
          <span className={`chip ${topic?.tagColor || 'mint'}`}>{topic?.zh}</span>
          <span style={{fontFamily:'var(--f-mono)', fontSize: 10, color:'var(--ink-3)'}}>
            {window.quizTypeLabel(q.type)} · {diffLabels[q.difficulty]}
          </span>
        </div>

        <p className="quiz-stem" dangerouslySetInnerHTML={{
          __html: q.stem.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        }} />

        <window.QuizQuestion q={q}
          answer={cur.value} revealed={cur.revealed}
          onSelect={updateAnswer} />

        {cur.revealed && (
          <div className="explain">
            <div className="head">
              <span>解釋</span>
              <span>·</span>
              <span style={{color: window.isQuizCorrect(q, cur.value) ? 'var(--good)' : 'var(--bad)'}}>
                {window.isQuizCorrect(q, cur.value) ? '正確！' : '再想想'}
              </span>
            </div>
            <p>{q.explain}</p>
          </div>
        )}

        <div className="row" style={{marginTop: 22, justifyContent: 'space-between'}}>
          <button className="btn ghost sm" onClick={() => updateAnswer(null)}>清除</button>
          {cur.revealed ? (
            <button className="btn" onClick={next}>
              {idx + 1 < total ? '下一題 →' : '查看結果 →'}
            </button>
          ) : (
            <button className="btn accent" onClick={submit}
              disabled={!window.isQuizAnswered(q, cur.value)}
              style={{opacity: window.isQuizAnswered(q, cur.value) ? 1 : 0.4}}>
              送出答案
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ Cheat Sheet ============
window.CheatPage = function CheatPage() {
  const D = window.AppData;
  const [q, setQ] = useState('');
  const list = D.cards.filter(c =>
    !q || c.title.includes(q) || c.formula.toLowerCase().includes(q.toLowerCase()) || c.note.includes(q)
  );
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">04 · Cheat Sheet</div>
          <h1>速查卡片</h1>
          <div className="sub">{D.cards.length} 張高密度公式卡片，可關鍵字搜尋。</div>
        </div>
        <input
          placeholder="搜尋公式或概念..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid var(--line)',
            background: 'var(--panel)', color: 'var(--ink)',
            fontSize: 13, width: 240, fontFamily: 'inherit'
          }} />
      </div>

      <div className="cs-grid">
        {list.map((c, i) => (
          <div key={i} className="cs-card">
            <div className="title">{c.title}</div>
            <div className="formula">{c.formula}</div>
            <div className="note">{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Calculator ============
window.CalcPage = function CalcPage() {
  const groups = window.CalcCatalog;
  const [activeGroup, setActiveGroup] = useState(groups[0].group);
  const [activeId, setActiveId] = useState(groups[0].items[0].id);
  const group = groups.find(g => g.group === activeGroup);
  const item = group.items.find(i => i.id === activeId) || group.items[0];
  const Comp = item.Comp;
  const total = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">05 · Calculators · {total} tools</div>
          <h1>計算機</h1>
          <div className="sub">樣本數、假設檢定、信賴區間、效應量、診斷、迴歸 — 完整生物統計工具箱</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start'}}>
        <div className="col" style={{position: 'sticky', top: 0, gap: 4}}>
          {groups.map(g => (
            <div key={g.group}>
              <div style={{
                fontFamily: 'var(--f-mono)', fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--ink-3)', padding: '12px 10px 6px'
              }}>{g.group}</div>
              {g.items.map(it => (
                <button key={it.id}
                  onClick={() => { setActiveGroup(g.group); setActiveId(it.id); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', borderRadius: 8,
                    border: 0, cursor: 'pointer',
                    background: activeId === it.id ? 'var(--ink)' : 'transparent',
                    color: activeId === it.id ? 'var(--bg)' : 'var(--ink-2)',
                    fontFamily: 'inherit',
                    fontSize: 13, marginBottom: 1
                  }}
                  onMouseEnter={(e) => activeId !== it.id && (e.currentTarget.style.background = 'color-mix(in oklch, var(--ink) 4%, transparent)')}
                  onMouseLeave={(e) => activeId !== it.id && (e.currentTarget.style.background = 'transparent')}>
                  {it.title}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="calc-card" style={{maxWidth: 640}}>
          <div style={{marginBottom: 14}}>
            <div style={{fontFamily:'var(--f-mono)', fontSize: 10, color: 'var(--ink-3)',
              letterSpacing: '.1em', textTransform: 'uppercase'}}>{item.sub}</div>
            <h3 style={{fontSize: 20, margin: '4px 0 0', fontWeight: 600, letterSpacing: '-0.015em'}}>
              {item.title}
            </h3>
          </div>
          <Comp />
        </div>
      </div>
    </div>
  );
};
// ============ Case scenario ============
window.CasePage = function CasePage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">06 · Case Study</div>
          <h1>臨床情境模擬</h1>
          <div className="sub">真實情境讓統計觀念有歸宿</div>
        </div>
      </div>

      <div className="case-grid">
        <div className="case-panel">
          <div className="label">CASE · 02 / 12</div>
          <h2>新型抗凝血劑 vs Warfarin：心房顫動病人的中風預防</h2>
          <div className="scenario">
            一項 <strong>非劣性 RCT</strong> 招募 6,300 名 AF 病人，1:1 隨機分配至新藥 N 或對照組 W。
            追蹤中位數 24 個月，主要終點為「中風或全身性栓塞」。
            意向治療分析得 N 組 1.34%/年，W 組 1.65%/年，<strong>HR = 0.81</strong>，
            <strong>95% CI: (0.65, 1.00)</strong>，非劣性邊界 1.46。
            出血事件 N 組 2.71%/年，W 組 3.43%/年，HR = 0.79，p &lt; 0.001。
          </div>

          <div style={{marginTop: 18}}>
            <div className="meta" style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom: 10}}>關鍵證據</div>
            <div className="evidence">
              <div className="ev-row"><div className="k">主要療效 HR</div><div className="v good">0.81 (0.65–1.00)</div></div>
              <div className="ev-row"><div className="k">非劣性邊界 (預設)</div><div className="v">1.46</div></div>
              <div className="ev-row"><div className="k">大出血 HR</div><div className="v good">0.79, p &lt; 0.001</div></div>
              <div className="ev-row"><div className="k">所需治療人數 NNT</div><div className="v">≈ 323 / 年</div></div>
              <div className="ev-row"><div className="k">分析方式</div><div className="v">ITT + per-protocol 一致</div></div>
            </div>
          </div>
        </div>

        <div className="col">
          <window.KMPlot hazardA={0.013} hazardB={0.017} />

          <div className="card">
            <div className="card-head">
              <h3>判讀挑戰</h3>
              <span className="meta">step 3 / 5</span>
            </div>
            <p style={{margin: '0 0 14px', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6}}>
              下列哪一項<strong style={{color:'var(--ink)'}}>能</strong>支持「新藥在療效上不劣於 Warfarin」的結論？
            </p>
            <div className="col" style={{gap: 6}}>
              {[
                'HR 點估計 < 1',
                '95% CI 上界 < 預設非劣性邊界',
                'p 值 < 0.05',
                '出血率較低'
              ].map((opt, i) => (
                <button key={i} className="choice" style={{padding: '10px 12px', fontSize: 12.5}}>
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                  <span></span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>關聯主題</h3>
              <span className="meta">link</span>
            </div>
            <div className="row" style={{flexWrap: 'wrap', gap: 6}}>
              {['存活分析', 'Cox 比例風險', '非劣性試驗', 'HR vs OR', 'ITT 分析'].map(t => (
                <span key={t} className="chip ghost" style={{cursor: 'pointer'}}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Topic Detail (drill-in) ============
window.TopicDetail = function TopicDetail({ topicId, onBack, chartStyle, onNav, onOpenLesson }) {
  const D = window.AppData;
  const t = D.topics.find(x => x.id === topicId) || D.topics[0];
  const [tab, setTab] = useState('overview');

  // Pick a representative chart per topic
  const ChartFor = () => {
    if (t.id === 'prob' || t.id === 'desc' || t.id === 'ci' || t.id === 'ht')
      return <window.NormalPlot mu={0} sigma={1} lo={-1.96} hi={1.96} chartStyle={chartStyle} />;
    if (t.id === 'reg') return <window.RegressionPlot slope={0.6} intercept={0.1} noise={0.6} />;
    if (t.id === 'surv') return <window.KMPlot hazardA={0.04} hazardB={0.07} />;
    if (t.id === 'diag') return <window.ROCPlot auc={0.86} />;
    return <window.BinomialPlot n={20} p={0.4} />;
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb" style={{cursor:'pointer'}} onClick={onBack}>← 主題庫 · Chapter {t.no}</div>
          <h1>{t.zh}</h1>
          <div className="sub">{t.en} · {t.lessons} lessons · {t.time} min · {t.blurb}</div>
        </div>
        <div className="row">
          <span className={`chip ${t.tagColor}`}>{t.tag}</span>
          <span className="diff">
            {[1,2,3].map(i => <i key={i} className={i <= t.difficulty ? 'on' : ''} />)}
          </span>
        </div>
      </div>

      <div className="tabs">
        {[
          { id: 'overview', label: '概覽' },
          { id: 'lessons', label: '課程 · ' + t.lessons },
          { id: 'practice', label: '練習' }
        ].map(x => (
          <button key={x.id}
            className={`tab ${tab === x.id ? 'active' : ''}`}
            onClick={() => setTab(x.id)}>{x.label}</button>
        ))}
      </div>

      <div className="concept-grid">
        <div className="plot-wrap">
          <div className="meta">代表性視覺</div>
          <ChartFor />
        </div>

        <div className="col">
          <div className="card">
            <div className="card-head">
              <h3>進度</h3>
              <span className="meta">{Math.round(t.progress*100)}%</span>
            </div>
            <div className="progress" style={{marginBottom: 12}}>
              <i style={{width: `${t.progress*100}%`}} />
            </div>
            <button className="btn accent" style={{width: '100%'}}
              onClick={() => onOpenLesson ? onOpenLesson(0) : onNav('concept')}>
              開始第 1 課 →
            </button>
          </div>

          {onOpenLesson && <window.LessonListDesktop topicId={topicId} onOpen={onOpenLesson} />}

          <div className="card">
            <div className="card-head">
              <h3>核心關鍵字</h3>
              <span className="meta">{t.keywords.length}</span>
            </div>
            <div className="row" style={{flexWrap: 'wrap', gap: 6}}>
              {t.keywords.map((k, i) => (
                <span key={i} className="chip ghost" style={{fontFamily:'var(--f-mono)'}}>{k}</span>
              ))}
            </div>
          </div>

          <div className="side-note">
            <h4>學習目標</h4>
            <p>讀完本章可以：(1) 在合適情境正確選擇方法；(2) 解讀輸出與信賴區間；(3) 識別常見誤用與假設違反。</p>
          </div>
        </div>
      </div>
    </div>
  );
};
