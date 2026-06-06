// interactives.jsx — interactive learning widgets embedded in lessons or shown in Lab
const { useState, useMemo, useRef, useEffect } = React;

// Seeded PRNG so simulations are reproducible
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Box-Muller normal sample
function rNormal(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ──────────────────────────────────────────────
// 1. CLT Simulator — pick a parent distribution and watch sample means converge to normal
window.CLTSim = function CLTSim() {
  const [parent, setParent] = useState('uniform');
  const [n, setN] = useState(10);
  const [trials, setTrials] = useState(200);
  const [seed, setSeed] = useState(1);

  // Generate one sample from chosen parent
  const drawFromParent = (rng) => {
    switch (parent) {
      case 'uniform':  return rng() * 10; // U(0, 10) → mean=5
      case 'exp':      return -Math.log(1 - rng()) * 3; // Exp(rate=1/3) → mean=3
      case 'bimodal':  return rng() < 0.5 ? rNormal(rng) * 0.6 + 2 : rNormal(rng) * 0.6 + 7;
      case 'skewed':   return Math.pow(rng(), 3) * 12;
      default:         return rng() * 10;
    }
  };

  const { sampleMeans, parentSamples, trueMean } = useMemo(() => {
    const rng = mulberry32(seed);
    const means = [];
    for (let t = 0; t < trials; t++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += drawFromParent(rng);
      means.push(s / n);
    }
    // Also get a snapshot of the parent for the small plot
    const rng2 = mulberry32(seed + 999);
    const ps = [];
    for (let i = 0; i < 500; i++) ps.push(drawFromParent(rng2));

    // True means
    const trueMeans = { uniform: 5, exp: 3, bimodal: 4.5, skewed: 3 };
    return { sampleMeans: means, parentSamples: ps, trueMean: trueMeans[parent] };
  }, [parent, n, trials, seed]);

  // Histogram bins
  const histogram = (data, bins, range) => {
    const [lo, hi] = range || [Math.min(...data), Math.max(...data)];
    const counts = new Array(bins).fill(0);
    data.forEach(x => {
      const b = Math.min(bins - 1, Math.max(0, Math.floor(((x - lo) / (hi - lo)) * bins)));
      counts[b]++;
    });
    return { counts, lo, hi };
  };

  const W = 360, H = 160, PAD = 24;
  const parentHist = histogram(parentSamples, 24, [0, 12]);
  const meanHist = histogram(sampleMeans, 24, [0, 12]);

  const sd = (arr) => {
    const m = arr.reduce((s, x) => s + x, 0) / arr.length;
    return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
  };
  const obsMean = sampleMeans.reduce((s, x) => s + x, 0) / sampleMeans.length;
  const obsSD = sd(sampleMeans);

  const renderHist = (h, color, label) => {
    const max = Math.max(...h.counts);
    const bw = (W - 2 * PAD) / h.counts.length;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        <text x={PAD} y={14} fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)"
          letterSpacing="0.08em">{label}</text>
        {h.counts.map((c, i) => (
          <rect key={i}
            x={PAD + i * bw + 0.5}
            y={H - PAD - (c / max) * (H - PAD - 22)}
            width={bw - 1}
            height={(c / max) * (H - PAD - 22)}
            fill={color} fillOpacity="0.75" rx="1" />
        ))}
        <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="var(--line-2)" />
        {[0, 3, 6, 9, 12].map(t => (
          <g key={t}>
            <text x={PAD + (t / 12) * (W - 2 * PAD)} y={H - PAD + 12}
              fontFamily="var(--f-mono)" fontSize="9.5" fill="var(--ink-3)" textAnchor="middle">{t}</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">中央極限定理模擬器</div>
        <button className="iv-shuffle" onClick={() => setSeed(s => s + 1)}>↻ 重抽</button>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">母體分布</label>
        <div className="iv-pills">
          {[['uniform','均勻'],['exp','指數'],['bimodal','雙峰'],['skewed','右偏']].map(([k, l]) => (
            <button key={k} className={`iv-pill ${parent === k ? 'on' : ''}`}
              onClick={() => setParent(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">每次取樣 n = <b>{n}</b></label>
        <input type="range" min="1" max="60" step="1" value={n} onChange={e => setN(+e.target.value)} />
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">重複次數 = <b>{trials}</b></label>
        <input type="range" min="50" max="2000" step="50" value={trials} onChange={e => setTrials(+e.target.value)} />
      </div>

      <div className="iv-plots">
        {renderHist(parentHist, 'var(--ink-3)', '母體分布（單次抽樣）')}
        {renderHist(meanHist, 'var(--accent)', `${trials} 次抽樣的「樣本平均」分布`)}
      </div>

      <div className="iv-readout">
        <div className="iv-stat">
          <div className="k">真實 μ</div>
          <div className="v">{trueMean.toFixed(2)}</div>
        </div>
        <div className="iv-stat">
          <div className="k">觀察平均</div>
          <div className="v">{obsMean.toFixed(2)}</div>
        </div>
        <div className="iv-stat">
          <div className="k">SE 觀察</div>
          <div className="v">{obsSD.toFixed(2)}</div>
        </div>
      </div>

      <div className="iv-note">
        無論母體是哪種形狀，當 n 增大，樣本平均的分布就會越來越像鐘形 — 這就是中央極限定理。
        試試把 n 拉到 30+，看雙峰或右偏母體的平均分布如何「變正常」。
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 2. CI Coverage Simulator — repeatedly sample, draw CIs, see how many cover true μ
window.CISim = function CISim() {
  const [n, setN] = useState(30);
  const [confLevel, setConfLevel] = useState(0.95);
  const [seed, setSeed] = useState(1);
  const trials = 30;
  const trueMu = 100;
  const trueSigma = 15;

  const intervals = useMemo(() => {
    const rng = mulberry32(seed);
    const z = confLevel === 0.99 ? 2.576 : confLevel === 0.90 ? 1.645 : 1.96;
    return Array.from({ length: trials }, () => {
      let s = 0, s2 = 0;
      const sample = [];
      for (let i = 0; i < n; i++) {
        const x = rNormal(rng) * trueSigma + trueMu;
        sample.push(x); s += x; s2 += x * x;
      }
      const mean = s / n;
      const sd = Math.sqrt((s2 - n * mean * mean) / (n - 1));
      const se = sd / Math.sqrt(n);
      const lo = mean - z * se;
      const hi = mean + z * se;
      return { mean, lo, hi, covers: lo <= trueMu && hi >= trueMu };
    });
  }, [n, confLevel, seed]);

  const covered = intervals.filter(i => i.covers).length;
  const W = 360, H = 280, PAD_L = 12, PAD_R = 12, PAD_T = 30, PAD_B = 16;
  const xMin = 80, xMax = 120;
  const xS = (x) => PAD_L + (x - xMin) / (xMax - xMin) * (W - PAD_L - PAD_R);
  const rowH = (H - PAD_T - PAD_B) / trials;

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">信賴區間覆蓋模擬</div>
        <button className="iv-shuffle" onClick={() => setSeed(s => s + 1)}>↻ 重抽 30 次</button>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">每次樣本 n = <b>{n}</b></label>
        <input type="range" min="5" max="100" step="1" value={n} onChange={e => setN(+e.target.value)} />
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">信賴水準</label>
        <div className="iv-pills">
          {[[0.90,'90%'],[0.95,'95%'],[0.99,'99%']].map(([k, l]) => (
            <button key={k} className={`iv-pill ${confLevel === k ? 'on' : ''}`}
              onClick={() => setConfLevel(k)}>{l}</button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        {/* true μ line */}
        <line x1={xS(trueMu)} x2={xS(trueMu)} y1={PAD_T - 6} y2={H - PAD_B}
          stroke="var(--ink)" strokeDasharray="3 3" />
        <text x={xS(trueMu)} y={PAD_T - 10}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink)" textAnchor="middle">μ = 100</text>

        {intervals.map((it, i) => {
          const y = PAD_T + i * rowH + rowH / 2;
          const color = it.covers ? 'var(--accent)' : 'var(--bad)';
          return (
            <g key={i}>
              <line x1={xS(it.lo)} x2={xS(it.hi)} y1={y} y2={y}
                stroke={color} strokeWidth="1.4" />
              <circle cx={xS(it.mean)} cy={y} r="2" fill={color} />
            </g>
          );
        })}

        {/* x ticks */}
        {[85, 90, 95, 100, 105, 110, 115].map(t => (
          <text key={t} x={xS(t)} y={H - PAD_B + 12}
            fontFamily="var(--f-mono)" fontSize="9" fill="var(--ink-3)" textAnchor="middle">{t}</text>
        ))}
      </svg>

      <div className="iv-readout">
        <div className="iv-stat">
          <div className="k">覆蓋真值</div>
          <div className="v">{covered} / {trials}</div>
        </div>
        <div className="iv-stat">
          <div className="k">實際覆蓋率</div>
          <div className="v">{(covered / trials * 100).toFixed(0)}%</div>
        </div>
        <div className="iv-stat">
          <div className="k">理論</div>
          <div className="v">{(confLevel * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="iv-note">
        正確的 CI 解讀：「**重複此實驗** 100 次，約 95 次的區間會包含真值」— 不是「真值有 95% 機率在這個區間」。
        紅色區間是「沒覆蓋到真值」的不幸抽樣，但這是可預期的。
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 3. α / β / Power visualizer
window.PowerViz = function PowerViz() {
  const [effect, setEffect] = useState(1.5);
  const [n, setN] = useState(20);
  const [alpha, setAlpha] = useState(0.05);
  const sigma = 3;
  const se = sigma / Math.sqrt(n);
  const zAlpha = alpha === 0.01 ? 2.576 : alpha === 0.10 ? 1.645 : 1.96;
  const critical = zAlpha * se;
  // Under H1, power = P(|X̄| > critical) ≈ P(X̄ > critical | μ = effect)
  const power = 1 - window.Stats.normCDF((critical - effect) / se);
  const beta = 1 - power;

  const W = 360, H = 220, PAD = 18;
  const xMin = -5, xMax = 7;
  const N = 121;
  const xS = (x) => PAD + (x - xMin) / (xMax - xMin) * (W - 2 * PAD);
  const data = Array.from({ length: N }, (_, i) => {
    const x = xMin + (xMax - xMin) * (i / (N - 1));
    return {
      x,
      y0: window.Stats.normPDF(x, 0, se),
      y1: window.Stats.normPDF(x, effect, se)
    };
  });
  const yMax = Math.max(...data.map(d => Math.max(d.y0, d.y1))) * 1.05;
  const yS = (y) => H - 28 - (y / yMax) * (H - PAD - 30);

  const path = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xS(d.x).toFixed(1)} ${yS(d[key]).toFixed(1)}`).join(' ');
  const areaAlpha = data.filter(d => d.x >= critical).map(d => `L ${xS(d.x)} ${yS(d.y0)}`).join(' ');
  const areaBeta = data.filter(d => d.x < critical).map(d => `L ${xS(d.x)} ${yS(d.y1)}`).join(' ');

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">α、β 與檢定力</div>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">效應量 Δ = <b>{effect.toFixed(2)}</b></label>
        <input type="range" min="0" max="5" step="0.1" value={effect} onChange={e=>setEffect(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">樣本 n = <b>{n}</b></label>
        <input type="range" min="5" max="200" step="1" value={n} onChange={e=>setN(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">α 水準</label>
        <div className="iv-pills">
          {[[0.10,'10%'],[0.05,'5%'],[0.01,'1%']].map(([k, l]) => (
            <button key={k} className={`iv-pill ${alpha === k ? 'on' : ''}`}
              onClick={() => setAlpha(k)}>{l}</button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        {/* β area under H1, left of critical */}
        <path d={`M ${xS(xMin)} ${yS(0)} ${areaBeta} L ${xS(critical)} ${yS(0)} Z`}
          fill="var(--warn)" fillOpacity="0.3" />
        {/* α area under H0, right of critical */}
        <path d={`M ${xS(critical)} ${yS(0)} ${areaAlpha} L ${xS(xMax)} ${yS(0)} Z`}
          fill="var(--bad)" fillOpacity="0.35" />

        {/* H0 curve */}
        <path d={path('y0')} fill="none" stroke="var(--ink-3)" strokeWidth="1.8" />
        {/* H1 curve */}
        <path d={path('y1')} fill="none" stroke="var(--accent)" strokeWidth="1.8" />

        {/* critical line */}
        <line x1={xS(critical)} x2={xS(critical)} y1={yS(0)} y2={PAD + 2}
          stroke="var(--ink)" strokeDasharray="3 3" />
        <text x={xS(critical)} y={PAD - 4}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink)" textAnchor="middle">
          c = {critical.toFixed(2)}
        </text>

        {/* axis */}
        <line x1={PAD} x2={W - PAD} y1={H - 28} y2={H - 28} stroke="var(--line-2)" />
        {[0, effect].map((m, i) => (
          <text key={i} x={xS(m)} y={H - 14}
            fontFamily="var(--f-mono)" fontSize="9.5"
            fill={i === 0 ? 'var(--ink-3)' : 'var(--accent)'} textAnchor="middle">
            {i === 0 ? 'H₀' : 'H₁'} μ={m.toFixed(1)}
          </text>
        ))}
      </svg>

      <div className="iv-readout">
        <div className="iv-stat" style={{borderTopColor:'var(--bad)'}}>
          <div className="k">α 偽陽</div>
          <div className="v">{(alpha*100).toFixed(0)}%</div>
        </div>
        <div className="iv-stat" style={{borderTopColor:'var(--warn)'}}>
          <div className="k">β 偽陰</div>
          <div className="v">{(beta*100).toFixed(1)}%</div>
        </div>
        <div className="iv-stat" style={{borderTopColor:'var(--accent)'}}>
          <div className="k">檢定力 1−β</div>
          <div className="v">{(power*100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="iv-note">
        紅色 = α（H₀ 為真時誤判有效）；橙色 = β（H₁ 為真時漏判）。
        試試「加大樣本」或「拉開效應」— 兩個分布的重疊變小，檢定力上升。
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 4. Prevalence → PPV bar simulator
window.PrevalencePPV = function PrevalencePPV() {
  const [prev, setPrev] = useState(0.05);
  const [sens, setSens] = useState(0.95);
  const [spec, setSpec] = useState(0.98);
  const total = 10000;
  const sick = total * prev;
  const well = total - sick;
  const tp = sick * sens;
  const fn = sick - tp;
  const fp = well * (1 - spec);
  const tn = well - fp;
  const ppv = tp / (tp + fp) || 0;
  const npv = tn / (tn + fn) || 0;

  const W = 360, H = 80;
  // Bar for positive results
  const totalPos = tp + fp || 1;
  const tpW = (tp / totalPos) * (W - 4);
  const fpW = (fp / totalPos) * (W - 4);

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">盛行率 → PPV</div>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">盛行率 = <b>{(prev*100).toFixed(1)}%</b></label>
        <input type="range" min="0.001" max="0.5" step="0.001" value={prev}
          onChange={e=>setPrev(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">敏感度 = <b>{(sens*100).toFixed(0)}%</b></label>
        <input type="range" min="0.5" max="1" step="0.01" value={sens}
          onChange={e=>setSens(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">特異度 = <b>{(spec*100).toFixed(0)}%</b></label>
        <input type="range" min="0.5" max="1" step="0.01" value={spec}
          onChange={e=>setSpec(+e.target.value)} />
      </div>

      <div style={{margin: '8px 0', fontFamily:'var(--f-mono)', fontSize:11, color:'var(--ink-3)'}}>
        10,000 人中：陽性結果分布 ↓
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        <rect x="2" y="20" width={tpW} height="40" fill="var(--accent)" />
        <rect x={2 + tpW} y="20" width={fpW} height="40" fill="var(--bad)" fillOpacity="0.7" />
        <text x={2 + tpW / 2} y="44" fontFamily="var(--f-mono)" fontSize="11"
          fill="white" textAnchor="middle" fontWeight="600">
          {tp >= totalPos * 0.08 ? `TP ${Math.round(tp)}` : ''}
        </text>
        <text x={2 + tpW + fpW / 2} y="44" fontFamily="var(--f-mono)" fontSize="11"
          fill="white" textAnchor="middle" fontWeight="600">
          {fp >= totalPos * 0.08 ? `FP ${Math.round(fp)}` : ''}
        </text>
        <text x={W - 4} y="14" fontFamily="var(--f-mono)" fontSize="10"
          fill="var(--ink-3)" textAnchor="end">總陽性 {Math.round(totalPos)}</text>
        <text x="2" y="72" fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)">
          PPV = {(ppv*100).toFixed(1)}%
        </text>
      </svg>

      <div className="iv-readout">
        <div className="iv-stat"><div className="k">PPV</div><div className="v">{(ppv*100).toFixed(1)}%</div></div>
        <div className="iv-stat"><div className="k">NPV</div><div className="v">{(npv*100).toFixed(2)}%</div></div>
        <div className="iv-stat"><div className="k">病人數</div><div className="v">{Math.round(sick)}</div></div>
      </div>

      <div className="iv-note">
        檢驗本身（Sens / Spec）不變的情況下，**盛行率下降 → PPV 暴跌**。把盛行率拉到 1%，看看「陽性者中真正生病」的比例會多低。
        這就是為何篩檢必須選對族群。
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 5. Bayes posterior updater
window.BayesUpdate = function BayesUpdate() {
  const [priorMu, setPriorMu] = useState(0);
  const [priorSD, setPriorSD] = useState(2);
  const [dataMean, setDataMean] = useState(2);
  const [n, setN] = useState(10);
  const sigma = 1;

  // Conjugate normal-normal update
  const priorVar = priorSD * priorSD;
  const dataVar = sigma * sigma / n;
  const postVar = 1 / (1 / priorVar + 1 / dataVar);
  const postMu = postVar * (priorMu / priorVar + dataMean / dataVar);
  const postSD = Math.sqrt(postVar);

  const W = 360, H = 200, PAD = 16;
  const xMin = -4, xMax = 6;
  const Nx = 121;
  const xS = (x) => PAD + (x - xMin) / (xMax - xMin) * (W - 2 * PAD);

  const curves = useMemo(() => {
    const out = [];
    for (let i = 0; i < Nx; i++) {
      const x = xMin + (xMax - xMin) * (i / (Nx - 1));
      out.push({
        x,
        prior: window.Stats.normPDF(x, priorMu, priorSD),
        like: window.Stats.normPDF(x, dataMean, sigma / Math.sqrt(n)),
        post: window.Stats.normPDF(x, postMu, postSD)
      });
    }
    return out;
  }, [priorMu, priorSD, dataMean, n]);

  const yMax = Math.max(...curves.map(c => Math.max(c.prior, c.like, c.post))) * 1.05;
  const yS = (y) => H - 24 - (y / yMax) * (H - PAD - 28);
  const mkPath = (k) => curves.map((c, i) => `${i === 0 ? 'M' : 'L'} ${xS(c.x).toFixed(1)} ${yS(c[k]).toFixed(1)}`).join(' ');

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">貝氏更新</div>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">先驗中心 μ₀ = <b>{priorMu.toFixed(1)}</b></label>
        <input type="range" min="-3" max="5" step="0.1" value={priorMu} onChange={e=>setPriorMu(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">先驗強度（SD） = <b>{priorSD.toFixed(1)}</b></label>
        <input type="range" min="0.3" max="5" step="0.1" value={priorSD} onChange={e=>setPriorSD(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">資料平均 x̄ = <b>{dataMean.toFixed(1)}</b></label>
        <input type="range" min="-2" max="5" step="0.1" value={dataMean} onChange={e=>setDataMean(+e.target.value)} />
      </div>
      <div className="iv-ctrl-row">
        <label className="iv-label">樣本數 n = <b>{n}</b></label>
        <input type="range" min="1" max="100" step="1" value={n} onChange={e=>setN(+e.target.value)} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        <line x1={PAD} x2={W - PAD} y1={H - 24} y2={H - 24} stroke="var(--line-2)" />
        <path d={mkPath('prior')} fill="none" stroke="var(--ink-3)" strokeWidth="1.6" strokeDasharray="4 3" />
        <path d={mkPath('like')} fill="none" stroke="var(--warn)" strokeWidth="1.6" />
        <path d={mkPath('post')} fill="none" stroke="var(--accent)" strokeWidth="2.2" />

        {[-3, 0, 3, 5].map(t => (
          <text key={t} x={xS(t)} y={H - 8}
            fontFamily="var(--f-mono)" fontSize="9.5" fill="var(--ink-3)" textAnchor="middle">{t}</text>
        ))}

        <g transform={`translate(${W - 110}, 8)`}>
          <line x1="0" x2="14" y1="8" y2="8" stroke="var(--ink-3)" strokeWidth="1.6" strokeDasharray="3 2"/>
          <text x="18" y="11" fontSize="10" fill="var(--ink)">先驗 prior</text>
          <line x1="0" x2="14" y1="22" y2="22" stroke="var(--warn)" strokeWidth="1.6"/>
          <text x="18" y="25" fontSize="10" fill="var(--ink)">資料 likelihood</text>
          <line x1="0" x2="14" y1="36" y2="36" stroke="var(--accent)" strokeWidth="2.2"/>
          <text x="18" y="39" fontSize="10" fill="var(--ink)">後驗 posterior</text>
        </g>
      </svg>

      <div className="iv-readout">
        <div className="iv-stat"><div className="k">後驗 μ</div><div className="v">{postMu.toFixed(2)}</div></div>
        <div className="iv-stat"><div className="k">後驗 SD</div><div className="v">{postSD.toFixed(2)}</div></div>
        <div className="iv-stat"><div className="k">95% CrI</div>
          <div className="v" style={{fontSize: 12}}>
            [{(postMu - 1.96*postSD).toFixed(1)}, {(postMu + 1.96*postSD).toFixed(1)}]
          </div>
        </div>
      </div>

      <div className="iv-note">
        後驗 = 先驗 × 資料的加權妥協。把「資料 n」拉大 → 資料主導；先驗 SD 變小 → 先驗主導。
        這就是「貝氏學習」的本質。
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 6. Outlier sensitivity demo — drag a value, see mean vs median
window.OutlierDemo = function OutlierDemo() {
  const baseData = [3, 4, 5, 5, 6, 6, 7, 8, 9];
  const [outlier, setOutlier] = useState(45);
  const [included, setIncluded] = useState(true);

  const data = included ? [...baseData, outlier] : baseData;
  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((s, x) => s + x, 0) / data.length;
  const median = sorted.length % 2
    ? sorted[(sorted.length - 1) / 2]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

  const W = 360, H = 110, PAD = 22;
  const xMin = 0, xMax = 50;
  const xS = (x) => PAD + (x - xMin) / (xMax - xMin) * (W - 2 * PAD);

  return (
    <div className="iv">
      <div className="iv-head">
        <div className="iv-title">極端值的衝擊</div>
        <button className="iv-shuffle" onClick={() => setIncluded(v => !v)}>
          {included ? '移除極端值' : '加回極端值'}
        </button>
      </div>

      <div className="iv-ctrl-row">
        <label className="iv-label">極端值位置 = <b>{outlier.toFixed(0)}</b></label>
        <input type="range" min="10" max="50" step="1" value={outlier} onChange={e=>setOutlier(+e.target.value)} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',display:'block'}}>
        <line x1={PAD} x2={W - PAD} y1={H - 30} y2={H - 30} stroke="var(--line-2)" />
        {[0, 10, 20, 30, 40, 50].map(t => (
          <g key={t}>
            <line x1={xS(t)} x2={xS(t)} y1={H - 30} y2={H - 26} stroke="var(--line-2)" />
            <text x={xS(t)} y={H - 14} fontFamily="var(--f-mono)" fontSize="9.5"
              fill="var(--ink-3)" textAnchor="middle">{t}</text>
          </g>
        ))}

        {/* Base data points */}
        {baseData.map((d, i) => (
          <circle key={i} cx={xS(d)} cy={H - 30} r="5" fill="var(--ink-3)" fillOpacity="0.7" />
        ))}
        {/* Outlier */}
        {included && (
          <circle cx={xS(outlier)} cy={H - 30} r="6" fill="var(--bad)" />
        )}

        {/* Mean line */}
        <line x1={xS(mean)} x2={xS(mean)} y1={H - 30 - 30} y2={H - 30 - 4}
          stroke="var(--accent)" strokeWidth="2" />
        <text x={xS(mean)} y={H - 30 - 36} fontFamily="var(--f-mono)" fontSize="10"
          fill="var(--accent)" textAnchor="middle">x̄ {mean.toFixed(1)}</text>

        {/* Median line */}
        <line x1={xS(median)} x2={xS(median)} y1={H - 30 - 50} y2={H - 30 - 4}
          stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 2" />
        <text x={xS(median)} y={H - 30 - 56} fontFamily="var(--f-mono)" fontSize="10"
          fill="var(--ink)" textAnchor="middle">Md {median.toFixed(1)}</text>
      </svg>

      <div className="iv-readout">
        <div className="iv-stat"><div className="k">平均</div><div className="v">{mean.toFixed(2)}</div></div>
        <div className="iv-stat"><div className="k">中位</div><div className="v">{median.toFixed(2)}</div></div>
        <div className="iv-stat"><div className="k">差距</div><div className="v">{(mean - median).toFixed(2)}</div></div>
      </div>

      <div className="iv-note">
        9 個小數值與 1 個大數值。拖動極端值或點「移除」— 看看平均（綠線）跟著飛走，而中位（黑虛線）幾乎不動。
        這就是「偏態資料用中位」的理由。
      </div>
    </div>
  );
};

window.InteractiveCatalog = [
  { id: 'clt',    title: '中央極限定理',    sub: '看樣本平均如何變正常',     name: 'CLTSim',        topic: 'prob' },
  { id: 'ci',     title: '信賴區間覆蓋率',  sub: '正確解讀 95% CI 的意義',  name: 'CISim',         topic: 'ci' },
  { id: 'power',  title: 'α、β 與檢定力',    sub: '看兩種錯誤如何取捨',     name: 'PowerViz',      topic: 'ht' },
  { id: 'ppv',    title: '盛行率 → PPV',     sub: '低盛行率的篩檢陷阱',     name: 'PrevalencePPV', topic: 'diag' },
  { id: 'bayes',  title: '貝氏更新',         sub: '先驗 + 資料 = 後驗',       name: 'BayesUpdate',   topic: 'bayes' },
  { id: 'outlier',title: '極端值衝擊',       sub: '平均 vs 中位的對比',      name: 'OutlierDemo',   topic: 'desc' }
];
