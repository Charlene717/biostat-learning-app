// charts.jsx - Distribution charts and viz components
const { useMemo } = React;

// === Math helpers ===
const erf = (x) => {
  // Abramowitz & Stegun approximation
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
};
const normCDF = (x, mu = 0, sigma = 1) => 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
const normPDF = (x, mu = 0, sigma = 1) =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

// Binomial PMF
const binomial = (n, k) => {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
};
const binomPMF = (k, n, p) => binomial(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);

// Poisson PMF
const poissonPMF = (k, lambda) => {
  let logp = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logp -= Math.log(i);
  return Math.exp(logp);
};

window.Stats = { erf, normCDF, normPDF, binomPMF, poissonPMF };

// === Normal Distribution Plot ===
window.NormalPlot = function NormalPlot({ mu = 0, sigma = 1, lo = -1.96, hi = 1.96, chartStyle = 'curve' }) {
  const W = 600, H = 280, PAD_L = 36, PAD_R = 12, PAD_T = 18, PAD_B = 30;
  const xMin = -5, xMax = 5;
  const N = 121;

  const data = useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const x = xMin + (xMax - xMin) * (i / (N - 1));
      return { x, y: normPDF(x, mu, sigma) };
    });
  }, [mu, sigma]);

  const yMax = Math.max(...data.map(d => d.y), 0.42);
  const xScale = (x) => PAD_L + (x - xMin) / (xMax - xMin) * (W - PAD_L - PAD_R);
  const yScale = (y) => H - PAD_B - (y / yMax) * (H - PAD_T - PAD_B);

  const linePath = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(d.x).toFixed(2)} ${yScale(d.y).toFixed(2)}`
  ).join(' ');
  const areaPath = linePath + ` L ${xScale(xMax)} ${yScale(0)} L ${xScale(xMin)} ${yScale(0)} Z`;

  // Selected region (under area)
  const selData = data.filter(d => d.x >= lo && d.x <= hi);
  const selPath = selData.length ? (
    `M ${xScale(selData[0].x)} ${yScale(0)} ` +
    selData.map(d => `L ${xScale(d.x).toFixed(2)} ${yScale(d.y).toFixed(2)}`).join(' ') +
    ` L ${xScale(selData[selData.length - 1].x)} ${yScale(0)} Z`
  ) : '';

  const ticks = [-4, -2, 0, 2, 4];
  const prob = normCDF(hi, mu, sigma) - normCDF(lo, mu, sigma);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* gridlines */}
      {[0.1, 0.2, 0.3, 0.4].map((y, i) => y <= yMax && (
        <line key={i}
          x1={PAD_L} x2={W - PAD_R}
          y1={yScale(y)} y2={yScale(y)}
          stroke="var(--line)" strokeDasharray="2 4" />
      ))}
      {/* axis */}
      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="var(--line-2)" />
      {/* x ticks */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={xScale(t)} x2={xScale(t)} y1={H - PAD_B} y2={H - PAD_B + 4} stroke="var(--line-2)" />
          <text x={xScale(t)} y={H - PAD_B + 18}
            fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}

      {/* selected area */}
      {selPath && <path d={selPath} fill="var(--accent)" fillOpacity="0.25" />}

      {/* full curve area (very light) */}
      {chartStyle !== 'step' && (
        <path d={areaPath} fill="var(--accent)" fillOpacity="0.05" />
      )}

      {/* curve / step */}
      {chartStyle === 'step' ? (
        <path
          d={data.map((d, i) => {
            const xL = xScale(i === 0 ? d.x : data[i - 1].x);
            const xR = xScale(d.x);
            const y = yScale(d.y);
            return i === 0 ? `M ${xL} ${y}` : `L ${xL} ${y} L ${xR} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      ) : (
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" />
      )}

      {/* μ marker */}
      <line x1={xScale(mu)} x2={xScale(mu)}
        y1={yScale(0)} y2={yScale(normPDF(mu, mu, sigma))}
        stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 3" />
      <text x={xScale(mu)} y={PAD_T + 4}
        fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink)" textAnchor="middle">μ</text>

      {/* lo/hi markers */}
      {[lo, hi].map((x, i) => (
        <g key={i}>
          <line x1={xScale(x)} x2={xScale(x)}
            y1={yScale(0)} y2={yScale(0) + 6}
            stroke="var(--accent-ink)" strokeWidth="1.5" />
          <text x={xScale(x)} y={yScale(0) - 6}
            fontFamily="var(--f-mono)" fontSize="9.5"
            fill="var(--accent-ink)" textAnchor="middle">
            {x.toFixed(2)}
          </text>
        </g>
      ))}

      {/* probability label */}
      <text x={xScale((lo + hi) / 2)} y={yScale(yMax * 0.4)}
        fontFamily="var(--f-mono)" fontSize="13" fontWeight="600"
        fill="var(--accent-ink)" textAnchor="middle">
        {(prob * 100).toFixed(1)}%
      </text>
    </svg>
  );
};

// === Binomial bar plot ===
window.BinomialPlot = function BinomialPlot({ n = 20, p = 0.5 }) {
  const W = 600, H = 280, PAD_L = 36, PAD_R = 12, PAD_T = 18, PAD_B = 30;

  const data = useMemo(() => {
    return Array.from({ length: n + 1 }, (_, k) => ({ k, p: binomPMF(k, n, p) }));
  }, [n, p]);

  const yMax = Math.max(...data.map(d => d.p)) * 1.15;
  const barW = (W - PAD_L - PAD_R) / (n + 1) * 0.78;
  const xPos = (k) => PAD_L + (W - PAD_L - PAD_R) * ((k + 0.5) / (n + 1));
  const yScale = (y) => H - PAD_B - (y / yMax) * (H - PAD_T - PAD_B);

  const expected = n * p;
  const labelStep = n > 30 ? 10 : n > 15 ? 5 : 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map(f => {
        const y = yScale(f * yMax / 1.15);
        return <line key={f} x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />;
      })}
      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="var(--line-2)" />

      {data.map(d => (
        <rect key={d.k}
          x={xPos(d.k) - barW / 2}
          y={yScale(d.p)}
          width={barW}
          height={(H - PAD_B) - yScale(d.p)}
          fill="var(--accent)"
          fillOpacity={Math.abs(d.k - expected) < 1.5 ? 0.85 : 0.5}
          rx="1.5"
        />
      ))}
      {data.map(d => d.k % labelStep === 0 && (
        <text key={`l${d.k}`} x={xPos(d.k)} y={H - PAD_B + 16}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">
          {d.k}
        </text>
      ))}

      {/* expected line */}
      <line x1={xPos(expected)} x2={xPos(expected)}
        y1={yScale(yMax / 1.15)} y2={H - PAD_B}
        stroke="var(--ink)" strokeDasharray="3 3" strokeWidth="1" />
      <text x={xPos(expected)} y={yScale(yMax / 1.15) - 4}
        fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink)" textAnchor="middle">
        E[X] = {expected.toFixed(1)}
      </text>
    </svg>
  );
};

// === Poisson plot ===
window.PoissonPlot = function PoissonPlot({ lambda = 4 }) {
  const W = 600, H = 280, PAD_L = 36, PAD_R = 12, PAD_T = 18, PAD_B = 30;
  const kMax = Math.max(15, Math.ceil(lambda * 2.5));

  const data = useMemo(() => {
    return Array.from({ length: kMax + 1 }, (_, k) => ({ k, p: poissonPMF(k, lambda) }));
  }, [lambda, kMax]);

  const yMax = Math.max(...data.map(d => d.p)) * 1.15;
  const barW = (W - PAD_L - PAD_R) / (kMax + 1) * 0.78;
  const xPos = (k) => PAD_L + (W - PAD_L - PAD_R) * ((k + 0.5) / (kMax + 1));
  const yScale = (y) => H - PAD_B - (y / yMax) * (H - PAD_T - PAD_B);
  const labelStep = kMax > 20 ? 5 : 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="var(--line-2)" />
      {data.map(d => (
        <rect key={d.k}
          x={xPos(d.k) - barW / 2}
          y={yScale(d.p)}
          width={barW}
          height={(H - PAD_B) - yScale(d.p)}
          fill="var(--accent)"
          fillOpacity={Math.abs(d.k - lambda) < 1.5 ? 0.85 : 0.5}
          rx="1.5"
        />
      ))}
      {data.map(d => d.k % labelStep === 0 && (
        <text key={`l${d.k}`} x={xPos(d.k)} y={H - PAD_B + 16}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">
          {d.k}
        </text>
      ))}
      <line x1={xPos(lambda)} x2={xPos(lambda)}
        y1={yScale(yMax / 1.15)} y2={H - PAD_B}
        stroke="var(--ink)" strokeDasharray="3 3" />
      <text x={xPos(lambda)} y={yScale(yMax / 1.15) - 4}
        fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink)" textAnchor="middle">
        λ = {lambda.toFixed(1)}
      </text>
    </svg>
  );
};

// === Kaplan-Meier survival curve (illustrative) ===
window.KMPlot = function KMPlot({ hazardA = 0.05, hazardB = 0.09 }) {
  const W = 600, H = 280, PAD_L = 40, PAD_R = 16, PAD_T = 18, PAD_B = 36;
  const tMax = 36;
  const N = 73;

  // Generate step-survival via exponential approx with censoring jitter
  const surv = (hazard) => {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / (N - 1)) * tMax;
      pts.push({ t, s: Math.exp(-hazard * t) });
    }
    // Make it stepwise
    const stepPts = [];
    pts.forEach((p, i) => {
      if (i > 0) stepPts.push({ t: p.t, s: pts[i - 1].s });
      stepPts.push(p);
    });
    return stepPts;
  };

  const a = surv(hazardA);
  const b = surv(hazardB);

  const xScale = (t) => PAD_L + (t / tMax) * (W - PAD_L - PAD_R);
  const yScale = (s) => H - PAD_B - s * (H - PAD_T - PAD_B);

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.t).toFixed(1)} ${yScale(p.s).toFixed(1)}`).join(' ');

  // censor marks (random-ish but deterministic)
  const censorMarks = (pts, color) => {
    const marks = [4, 11, 19, 26].map(t => {
      const p = pts.find(p => Math.abs(p.t - t) < 0.5) || { s: Math.exp(-0.07 * t) };
      return { t, s: p.s };
    });
    return marks.map((m, i) => (
      <line key={i}
        x1={xScale(m.t)} x2={xScale(m.t)}
        y1={yScale(m.s) - 4} y2={yScale(m.s) + 4}
        stroke={color} strokeWidth="1.5" />
    ));
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map(y => (
        <g key={y}>
          <line x1={PAD_L} x2={W - PAD_R} y1={yScale(y)} y2={yScale(y)} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={PAD_L - 8} y={yScale(y) + 3} fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="end">
            {y.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="var(--line-2)" />
      {[0, 6, 12, 18, 24, 30, 36].map(t => (
        <text key={t} x={xScale(t)} y={H - PAD_B + 16}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">{t}</text>
      ))}
      <text x={W / 2} y={H - 6} fontFamily="var(--f-mono)" fontSize="10"
        fill="var(--ink-3)" textAnchor="middle">months</text>

      <path d={toPath(a)} fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d={toPath(b)} fill="none" stroke="var(--ink)" strokeWidth="2" />

      {censorMarks(a, 'var(--accent)')}
      {censorMarks(b, 'var(--ink)')}

      {/* legend */}
      <g transform={`translate(${W - 150}, ${PAD_T + 4})`}>
        <rect x="0" y="0" width="138" height="42" fill="var(--panel)" stroke="var(--line)" rx="6" />
        <line x1="10" x2="30" y1="14" y2="14" stroke="var(--accent)" strokeWidth="2" />
        <text x="36" y="18" fontFamily="var(--f-sans)" fontSize="11" fill="var(--ink)">Treatment</text>
        <line x1="10" x2="30" y1="30" y2="30" stroke="var(--ink)" strokeWidth="2" />
        <text x="36" y="34" fontFamily="var(--f-sans)" fontSize="11" fill="var(--ink)">Control</text>
      </g>
    </svg>
  );
};

// === ROC curve ===
window.ROCPlot = function ROCPlot({ auc = 0.85 }) {
  const W = 320, H = 320, PAD = 36;
  // Generate ROC from a "discriminability" controlled by AUC
  const d = Math.sqrt(2) * (function inv(p) {
    // Inverse normal CDF approx for inverse erf
    // For mid-range only; sufficient here
    let lo = -5, hi = 5;
    for (let i = 0; i < 50; i++) {
      const m = (lo + hi) / 2;
      if (normCDF(m) < p) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  })(auc);
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const c = -5 + 10 * (i / 100);
    const fpr = 1 - normCDF(c, 0, 1);
    const tpr = 1 - normCDF(c, d, 1);
    pts.push({ x: fpr, y: tpr });
  }
  const xS = (x) => PAD + x * (W - 2 * PAD);
  const yS = (y) => H - PAD - y * (H - 2 * PAD);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p.x).toFixed(1)} ${yS(p.y).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map(t => (
        <g key={t}>
          <line x1={xS(t)} x2={xS(t)} y1={PAD} y2={H - PAD} stroke="var(--line)" strokeDasharray="2 4" />
          <line x1={PAD} x2={W - PAD} y1={yS(t)} y2={yS(t)} stroke="var(--line)" strokeDasharray="2 4" />
        </g>
      ))}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={PAD} stroke="var(--line-2)" strokeDasharray="4 4" />
      <path d={`${path} L ${xS(1)} ${yS(0)} L ${xS(0)} ${yS(0)} Z`} fill="var(--accent)" fillOpacity="0.15" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />

      <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="var(--line-2)" />
      <line x1={PAD} x2={PAD} y1={PAD} y2={H - PAD} stroke="var(--line-2)" />
      <text x={W / 2} y={H - 6} fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">
        1 − Specificity (FPR)
      </text>
      <text x={10} y={H / 2} fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)"
        textAnchor="middle" transform={`rotate(-90 10 ${H / 2})`}>Sensitivity (TPR)</text>
      <text x={W - PAD - 8} y={PAD + 14} fontFamily="var(--f-mono)" fontSize="14" fontWeight="600"
        fill="var(--accent-ink)" textAnchor="end">AUC = {auc.toFixed(2)}</text>
    </svg>
  );
};

// === Linear regression scatter ===
window.RegressionPlot = function RegressionPlot({ slope = 0.6, intercept = 0, noise = 0.5 }) {
  const W = 600, H = 280, PAD_L = 40, PAD_R = 12, PAD_T = 18, PAD_B = 30;
  // deterministic scatter
  const pts = useMemo(() => {
    const out = [];
    let seed = 42;
    const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 40; i++) {
      const x = -3 + 6 * rng();
      const y = slope * x + intercept + (rng() - 0.5) * 2 * noise * 2;
      out.push({ x, y });
    }
    return out;
  }, [slope, intercept, noise]);

  const xMin = -3.5, xMax = 3.5, yMin = -4, yMax = 4;
  const xS = (x) => PAD_L + (x - xMin) / (xMax - xMin) * (W - PAD_L - PAD_R);
  const yS = (y) => H - PAD_B - (y - yMin) / (yMax - yMin) * (H - PAD_T - PAD_B);

  // R² calc
  const yMean = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const ssTot = pts.reduce((s, p) => s + (p.y - yMean) ** 2, 0);
  const ssRes = pts.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[-3, -1.5, 0, 1.5, 3].map(t => (
        <text key={t} x={xS(t)} y={H - PAD_B + 16}
          fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="middle">{t}</text>
      ))}
      {[-3, 0, 3].map(t => (
        <g key={t}>
          <line x1={PAD_L} x2={W - PAD_R} y1={yS(t)} y2={yS(t)} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={PAD_L - 8} y={yS(t) + 3} fontFamily="var(--f-mono)" fontSize="10" fill="var(--ink-3)" textAnchor="end">{t}</text>
        </g>
      ))}
      <line x1={PAD_L} x2={W - PAD_R} y1={yS(0)} y2={yS(0)} stroke="var(--line-2)" />
      <line x1={PAD_L} x2={PAD_L} y1={PAD_T} y2={H - PAD_B} stroke="var(--line-2)" />

      {pts.map((p, i) => (
        <circle key={i} cx={xS(p.x)} cy={yS(p.y)} r="3"
          fill="var(--accent)" fillOpacity="0.6" />
      ))}

      <line
        x1={xS(xMin)} y1={yS(slope * xMin + intercept)}
        x2={xS(xMax)} y2={yS(slope * xMax + intercept)}
        stroke="var(--ink)" strokeWidth="2" />

      <text x={W - PAD_R - 8} y={PAD_T + 14}
        fontFamily="var(--f-mono)" fontSize="13" fontWeight="600"
        fill="var(--ink)" textAnchor="end">
        ŷ = {slope.toFixed(2)}x {intercept >= 0 ? '+' : '−'} {Math.abs(intercept).toFixed(2)}
      </text>
      <text x={W - PAD_R - 8} y={PAD_T + 30}
        fontFamily="var(--f-mono)" fontSize="11"
        fill="var(--ink-3)" textAnchor="end">
        R² = {r2.toFixed(3)}
      </text>
    </svg>
  );
};
