// calculators.jsx — comprehensive biostat calculator catalog
const { useState: _useS, useMemo: _useM } = React;
const CM = window.CalcMath;
const ST = window.Stats;

// ─────────────────────────────────────────
// Shared primitives — work on both desktop & mobile
function F({ label, hint, value, onChange, step = 1, min, max }) {
  return (
    <div className="m-field">
      <label>{label}{hint && <span style={{color:'var(--ink-3)'}}>{hint}</span>}</label>
      <input type="number" value={value} step={step} min={min} max={max}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </div>
  );
}

function Pick({ label, value, options, onChange }) {
  return (
    <div className="m-field" style={{paddingBottom: 8}}>
      <label style={{marginBottom: 8}}>{label}</label>
      <div className="iv-pills">
        {options.map(o => (
          <button key={o.value} className={`iv-pill ${value === o.value ? 'on' : ''}`}
            onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function Result({ title, value, note }) {
  return (
    <div className="m-calc-result">
      <div className="k">{title}</div>
      <div className="v">{value}</div>
      {note && <div className="note">{note}</div>}
    </div>
  );
}

function ReadGrid({ rows }) {
  return (
    <div className="m-readout" style={{marginTop: 10}}>
      {rows.map((r, i) => (
        <div key={i} className="b">
          <div className="k">{r.k}</div>
          <div className="v" style={r.color ? {color: r.color} : null}>{r.v}</div>
        </div>
      ))}
    </div>
  );
}

const fmt = (x, d = 3) => {
  if (!isFinite(x)) return '—';
  if (Math.abs(x) >= 100000) return x.toExponential(2);
  return x.toFixed(d);
};
const pct = (x, d = 1) => isFinite(x) ? `${(x*100).toFixed(d)}%` : '—';
const pVal = (p) => p < 0.001 ? '<0.001' : p.toFixed(3);
const pColor = (p) => p < 0.05 ? 'var(--good)' : 'var(--ink)';

// ═══════════════════════════════════════════════════════════
// SAMPLE SIZE
// ═══════════════════════════════════════════════════════════

function SSMeansCalc() {
  const [delta, set1] = _useS(5);
  const [sigma, set2] = _useS(10);
  const [alpha, set3] = _useS(0.05);
  const [power, set4] = _useS(0.8);
  const [ratio, set5] = _useS(1);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const n1 = Math.ceil((1 + 1/ratio) * Math.pow(zA + zB, 2) * sigma * sigma / (delta * delta));
  return (
    <>
      <F label="偵測差異 Δ" value={delta} step={0.5} onChange={set1} />
      <F label="標準差 σ" value={sigma} step={0.5} onChange={set2} />
      <F label="α 水準" hint="雙尾" value={alpha} step={0.005} min={0.001} max={0.5} onChange={set3} />
      <F label="檢定力 (1−β)" value={power} step={0.05} min={0.5} max={0.999} onChange={set4} />
      <F label="樣本比 n₂/n₁" value={ratio} step={0.5} min={0.1} max={10} onChange={set5} />
      <Result title="每組所需樣本 n₁" value={n1}
        note={`n₂ = ${Math.ceil(n1*ratio)} · 總樣本 ≈ ${n1 + Math.ceil(n1*ratio)}`} />
    </>
  );
}

function SSPropCalc() {
  const [p1, set1] = _useS(0.20);
  const [p2, set2] = _useS(0.30);
  const [alpha, set3] = _useS(0.05);
  const [power, set4] = _useS(0.8);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const pBar = (p1 + p2) / 2;
  const n = Math.ceil(
    Math.pow(zA * Math.sqrt(2 * pBar * (1 - pBar)) + zB * Math.sqrt(p1*(1-p1) + p2*(1-p2)), 2)
    / Math.pow(p1 - p2, 2)
  );
  return (
    <>
      <F label="組 1 比例 p₁" value={p1} step={0.01} min={0.001} max={0.999} onChange={set1} />
      <F label="組 2 比例 p₂" value={p2} step={0.01} min={0.001} max={0.999} onChange={set2} />
      <F label="α 水準" value={alpha} step={0.005} onChange={set3} />
      <F label="檢定力" value={power} step={0.05} onChange={set4} />
      <Result title="每組所需樣本" value={n}
        note={`絕對風險差 = ${pct(Math.abs(p1-p2))} · 總樣本 ${n*2}`} />
    </>
  );
}

function SSOneMeanCalc() {
  const [delta, set1] = _useS(2);
  const [sigma, set2] = _useS(5);
  const [alpha, set3] = _useS(0.05);
  const [power, set4] = _useS(0.8);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const n = Math.ceil(Math.pow(zA + zB, 2) * sigma * sigma / (delta * delta));
  return (
    <>
      <F label="偵測差異 |μ − μ₀|" value={delta} step={0.5} onChange={set1} />
      <F label="標準差 σ" value={sigma} step={0.5} onChange={set2} />
      <F label="α 水準" value={alpha} step={0.005} onChange={set3} />
      <F label="檢定力" value={power} step={0.05} onChange={set4} />
      <Result title="所需樣本 n" value={n} note="單樣本平均檢定" />
    </>
  );
}

function SSOnePropCalc() {
  const [p, set1] = _useS(0.30);
  const [p0, set2] = _useS(0.20);
  const [alpha, set3] = _useS(0.05);
  const [power, set4] = _useS(0.8);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const n = Math.ceil(
    Math.pow(zA * Math.sqrt(p0*(1-p0)) + zB * Math.sqrt(p*(1-p)), 2) / Math.pow(p - p0, 2)
  );
  return (
    <>
      <F label="預期比例 p" value={p} step={0.01} min={0.001} max={0.999} onChange={set1} />
      <F label="對照值 p₀" value={p0} step={0.01} min={0.001} max={0.999} onChange={set2} />
      <F label="α 水準" value={alpha} step={0.005} onChange={set3} />
      <F label="檢定力" value={power} step={0.05} onChange={set4} />
      <Result title="所需樣本 n" value={n} note="單樣本比例檢定" />
    </>
  );
}

function SSCorrCalc() {
  const [r, set1] = _useS(0.3);
  const [alpha, set2] = _useS(0.05);
  const [power, set3] = _useS(0.8);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const Z = 0.5 * Math.log((1 + r) / (1 - r)); // Fisher z
  const n = Math.ceil(Math.pow((zA + zB) / Z, 2) + 3);
  return (
    <>
      <F label="預期相關係數 r" value={r} step={0.05} min={-0.95} max={0.95} onChange={set1} />
      <F label="α 水準" value={alpha} step={0.005} onChange={set2} />
      <F label="檢定力" value={power} step={0.05} onChange={set3} />
      <Result title="所需樣本 n" value={n} note="檢定 H₀: r = 0（Fisher z 轉換）" />
    </>
  );
}

function SSSurvivalCalc() {
  const [hr, set1] = _useS(0.7);
  const [alpha, set2] = _useS(0.05);
  const [power, set3] = _useS(0.8);
  const [allocation, set4] = _useS(0.5);
  const zA = CM.invNormal(1 - alpha/2);
  const zB = CM.invNormal(power);
  const events = Math.ceil(
    Math.pow(zA + zB, 2) / (allocation * (1 - allocation) * Math.pow(Math.log(hr), 2))
  );
  return (
    <>
      <F label="預期 HR" value={hr} step={0.05} min={0.1} max={3} onChange={set1} />
      <F label="α 水準" value={alpha} step={0.005} onChange={set2} />
      <F label="檢定力" value={power} step={0.05} onChange={set3} />
      <F label="分配比例 P (組 1)" value={allocation} step={0.05} min={0.1} max={0.9} onChange={set4} />
      <Result title="所需事件數" value={events}
        note="存活分析所需「事件數」非「樣本數」。樣本數依事件率與追蹤時間估算。" />
    </>
  );
}

function SSNonInferiorityCalc() {
  const [delta, set1] = _useS(5);
  const [margin, set2] = _useS(3);
  const [sigma, set3] = _useS(10);
  const [alpha, set4] = _useS(0.025);
  const [power, set5] = _useS(0.8);
  const zA = CM.invNormal(1 - alpha);
  const zB = CM.invNormal(power);
  const n = Math.ceil(2 * Math.pow(zA + zB, 2) * sigma * sigma / Math.pow(delta + margin, 2));
  return (
    <>
      <F label="實際差異 d" hint="新 − 舊" value={delta} step={0.5} onChange={set1} />
      <F label="非劣性邊界 Δ" value={margin} step={0.5} onChange={set2} />
      <F label="標準差 σ" value={sigma} step={0.5} onChange={set3} />
      <F label="α 單尾" value={alpha} step={0.005} onChange={set4} />
      <F label="檢定力" value={power} step={0.05} onChange={set5} />
      <Result title="每組所需樣本" value={n} note="非劣性試驗通常用單尾 α = 0.025" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// HYPOTHESIS TESTS
// ═══════════════════════════════════════════════════════════

function TestOneTCalc() {
  const [m, set1] = _useS(7.4);
  const [m0, set2] = _useS(7.0);
  const [sd, set3] = _useS(0.8);
  const [n, set4] = _useS(40);
  const se = sd / Math.sqrt(n);
  const t = (m - m0) / se;
  const df = n - 1;
  const p = CM.pFromT(t, df);
  const ciLo = m - CM.invNormal(0.975) * se;
  const ciHi = m + CM.invNormal(0.975) * se;
  return (
    <>
      <F label="樣本平均 x̄" value={m} step={0.1} onChange={set1} />
      <F label="比較值 μ₀" value={m0} step={0.1} onChange={set2} />
      <F label="樣本 SD" value={sd} step={0.1} onChange={set3} />
      <F label="樣本數 n" value={n} step={1} min={2} onChange={set4} />
      <ReadGrid rows={[
        { k: 't 統計量', v: fmt(t, 3) },
        { k: '自由度', v: df },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: '95% CI', v: `[${fmt(ciLo, 2)}, ${fmt(ciHi, 2)}]` }
      ]}/>
    </>
  );
}

function TestPairedTCalc() {
  const [d, set1] = _useS(2.5);
  const [sd, set2] = _useS(4.0);
  const [n, set3] = _useS(30);
  const se = sd / Math.sqrt(n);
  const t = d / se;
  const df = n - 1;
  const p = CM.pFromT(t, df);
  const ciLo = d - CM.invNormal(0.975) * se;
  const ciHi = d + CM.invNormal(0.975) * se;
  return (
    <>
      <F label="差值平均 d̄" hint="後 − 前" value={d} step={0.1} onChange={set1} />
      <F label="差值 SD" value={sd} step={0.1} onChange={set2} />
      <F label="配對數 n" value={n} step={1} min={2} onChange={set3} />
      <ReadGrid rows={[
        { k: 't 統計量', v: fmt(t, 3) },
        { k: '自由度', v: df },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: '95% CI', v: `[${fmt(ciLo, 2)}, ${fmt(ciHi, 2)}]` }
      ]}/>
    </>
  );
}

function TestTwoTCalc() {
  const [m1, set1] = _useS(132);
  const [m2, set2] = _useS(128);
  const [s1, set3] = _useS(12);
  const [s2, set4] = _useS(11);
  const [n1, set5] = _useS(40);
  const [n2, set6] = _useS(40);
  const v1 = s1*s1/n1, v2 = s2*s2/n2;
  const se = Math.sqrt(v1 + v2);
  const t = (m1 - m2) / se;
  const df = Math.pow(v1 + v2, 2) / (v1*v1/(n1-1) + v2*v2/(n2-1));
  const p = CM.pFromT(t, df);
  const z = CM.invNormal(0.975);
  const ciLo = (m1 - m2) - z * se;
  const ciHi = (m1 - m2) + z * se;
  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <div>
          <div style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom: 6}}>Group A</div>
          <F label="x̄₁" value={m1} step={0.1} onChange={set1} />
          <F label="s₁" value={s1} step={0.1} onChange={set3} />
          <F label="n₁" value={n1} step={1} onChange={set5} />
        </div>
        <div>
          <div style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom: 6}}>Group B</div>
          <F label="x̄₂" value={m2} step={0.1} onChange={set2} />
          <F label="s₂" value={s2} step={0.1} onChange={set4} />
          <F label="n₂" value={n2} step={1} onChange={set6} />
        </div>
      </div>
      <ReadGrid rows={[
        { k: 't (Welch)', v: fmt(t, 3) },
        { k: 'df', v: fmt(df, 1) },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: '95% CI of diff', v: `[${fmt(ciLo, 2)}, ${fmt(ciHi, 2)}]` }
      ]}/>
    </>
  );
}

function TestChiSquareCalc() {
  const [a, set1] = _useS(40);
  const [b, set2] = _useS(60);
  const [c, set3] = _useS(20);
  const [d, set4] = _useS(80);
  const r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d, N = a + b + c + d;
  const eA = r1 * c1 / N, eB = r1 * c2 / N, eC = r2 * c1 / N, eD = r2 * c2 / N;
  const chi2 = Math.pow(a - eA, 2)/eA + Math.pow(b - eB, 2)/eB
             + Math.pow(c - eC, 2)/eC + Math.pow(d - eD, 2)/eD;
  const p = CM.pFromChi2(chi2, 1);
  const minE = Math.min(eA, eB, eC, eD);
  const or = (a * d) / (b * c);
  return (
    <>
      <div className="m-22" style={{marginBottom: 12}}>
        <div className="hd"></div><div className="hd">+</div><div className="hd">−</div>
        <div className="hd">組 1</div>
        <div><input type="number" value={a} onChange={e=>set1(+e.target.value||0)} /></div>
        <div><input type="number" value={b} onChange={e=>set2(+e.target.value||0)} /></div>
        <div className="hd">組 2</div>
        <div><input type="number" value={c} onChange={e=>set3(+e.target.value||0)} /></div>
        <div><input type="number" value={d} onChange={e=>set4(+e.target.value||0)} /></div>
      </div>
      <ReadGrid rows={[
        { k: 'χ²', v: fmt(chi2, 3) },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: 'OR', v: fmt(or, 2) },
        { k: '最小期望', v: fmt(minE, 1), color: minE < 5 ? 'var(--bad)' : 'var(--ink)' }
      ]}/>
      {minE < 5 && (
        <div style={{marginTop: 10, padding: '8px 12px', background: 'oklch(0.95 0.05 65 / 0.5)',
          borderRadius: 8, fontSize: 12, color: 'oklch(0.40 0.10 60)'}}>
          ⚠ 最小期望次數 &lt; 5，建議改用 Fisher 精確檢定。
        </div>
      )}
    </>
  );
}

function TestPropsCalc() {
  const [x1, set1] = _useS(30);
  const [n1, set2] = _useS(100);
  const [x2, set3] = _useS(20);
  const [n2, set4] = _useS(100);
  const p1 = x1/n1, p2 = x2/n2;
  const pPool = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1/n1 + 1/n2));
  const z = (p1 - p2) / se;
  const p = CM.pFromZ(z);
  const zCi = CM.invNormal(0.975);
  const seCi = Math.sqrt(p1*(1-p1)/n1 + p2*(1-p2)/n2);
  const ciLo = (p1 - p2) - zCi * seCi;
  const ciHi = (p1 - p2) + zCi * seCi;
  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <div>
          <F label="x₁ 成功" value={x1} step={1} onChange={set1} />
          <F label="n₁ 總數" value={n1} step={1} onChange={set2} />
        </div>
        <div>
          <F label="x₂ 成功" value={x2} step={1} onChange={set3} />
          <F label="n₂ 總數" value={n2} step={1} onChange={set4} />
        </div>
      </div>
      <ReadGrid rows={[
        { k: 'p₁ − p₂', v: pct(p1 - p2, 2) },
        { k: 'z 統計量', v: fmt(z, 3) },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: '95% CI', v: `[${fmt(ciLo, 3)}, ${fmt(ciHi, 3)}]` }
      ]}/>
    </>
  );
}

function TestANOVACalc() {
  const [k, set1] = _useS(3);
  const [n, set2] = _useS(20);
  const [msB, set3] = _useS(45);
  const [msW, set4] = _useS(12);
  const F = msB / msW;
  const df1 = k - 1, df2 = k * (n - 1);
  const p = CM.pFromF(F, df1, df2);
  return (
    <>
      <F label="組數 k" value={k} step={1} min={2} onChange={set1} />
      <F label="每組樣本 n" value={n} step={1} min={2} onChange={set2} />
      <F label="MS_between" value={msB} step={0.5} onChange={set3} />
      <F label="MS_within" value={msW} step={0.5} onChange={set4} />
      <ReadGrid rows={[
        { k: 'F', v: fmt(F, 3) },
        { k: 'df₁, df₂', v: `${df1}, ${df2}` },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: 'η²', v: fmt(msB/(msB+msW), 3) }
      ]}/>
    </>
  );
}

function TestCorrCalc() {
  const [r, set1] = _useS(0.4);
  const [n, set2] = _useS(40);
  const t = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r);
  const p = CM.pFromT(t, n - 2);
  const Z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const z = CM.invNormal(0.975);
  const ciLo = Math.tanh(Z - z * se), ciHi = Math.tanh(Z + z * se);
  return (
    <>
      <F label="觀察 r" value={r} step={0.05} min={-0.999} max={0.999} onChange={set1} />
      <F label="樣本數 n" value={n} step={1} min={4} onChange={set2} />
      <ReadGrid rows={[
        { k: 't 統計量', v: fmt(t, 3) },
        { k: 'p-value', v: pVal(p), color: pColor(p) },
        { k: 'r² 解釋變異', v: pct(r*r, 1) },
        { k: '95% CI of r', v: `[${fmt(ciLo, 2)}, ${fmt(ciHi, 2)}]` }
      ]}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// CONFIDENCE INTERVALS
// ═══════════════════════════════════════════════════════════

function CIMeanCalc() {
  const [m, set1] = _useS(125);
  const [sd, set2] = _useS(15);
  const [n, set3] = _useS(50);
  const [conf, set4] = _useS(0.95);
  const t = CM.invNormal((1 + conf) / 2);
  const se = sd / Math.sqrt(n);
  const ciLo = m - t * se, ciHi = m + t * se;
  return (
    <>
      <F label="樣本平均 x̄" value={m} step={0.1} onChange={set1} />
      <F label="樣本 SD" value={sd} step={0.1} onChange={set2} />
      <F label="樣本數 n" value={n} step={1} min={2} onChange={set3} />
      <F label="信賴水準" value={conf} step={0.01} min={0.5} max={0.999} onChange={set4} />
      <Result title={`${(conf*100).toFixed(0)}% 信賴區間`}
        value={`${fmt(ciLo, 2)} – ${fmt(ciHi, 2)}`}
        note={`SE = ${fmt(se, 3)} · 半寬 = ${fmt(t*se, 3)}`} />
    </>
  );
}

function CIPropCalc() {
  const [x, set1] = _useS(45);
  const [n, set2] = _useS(100);
  const [method, set3] = _useS('wilson');
  const p = x / n;
  const z = CM.invNormal(0.975);
  let ciLo, ciHi;
  if (method === 'wilson') {
    [ciLo, ciHi] = CM.wilsonCI(x, n, 0.95);
  } else {
    const half = z * Math.sqrt(p * (1 - p) / n);
    ciLo = Math.max(0, p - half); ciHi = Math.min(1, p + half);
  }
  return (
    <>
      <F label="成功數 x" value={x} step={1} min={0} onChange={set1} />
      <F label="總數 n" value={n} step={1} min={1} onChange={set2} />
      <Pick label="方法" value={method} onChange={set3}
        options={[{value:'wilson', label:'Wilson'}, {value:'wald', label:'Wald'}]} />
      <Result title="95% 信賴區間"
        value={`${pct(ciLo, 1)} – ${pct(ciHi, 1)}`}
        note={`p̂ = ${pct(p, 1)} · ${method === 'wilson' ? 'Wilson 對極端比例更穩定' : 'Wald 在中等 n 與 p 時準確'}`} />
    </>
  );
}

function CIOddsRatioCalc() {
  const [a, set1] = _useS(30);
  const [b, set2] = _useS(70);
  const [c, set3] = _useS(15);
  const [d, set4] = _useS(85);
  const or = (a * d) / (b * c);
  const se = Math.sqrt(1/a + 1/b + 1/c + 1/d);
  const lnOR = Math.log(or);
  const z = CM.invNormal(0.975);
  const ciLo = Math.exp(lnOR - z * se), ciHi = Math.exp(lnOR + z * se);
  return (
    <>
      <div className="m-22" style={{marginBottom: 12}}>
        <div className="hd"></div><div className="hd">病例 +</div><div className="hd">病例 −</div>
        <div className="hd">暴露</div>
        <div><input type="number" value={a} onChange={e=>set1(+e.target.value||0)} /></div>
        <div><input type="number" value={b} onChange={e=>set2(+e.target.value||0)} /></div>
        <div className="hd">未暴露</div>
        <div><input type="number" value={c} onChange={e=>set3(+e.target.value||0)} /></div>
        <div><input type="number" value={d} onChange={e=>set4(+e.target.value||0)} /></div>
      </div>
      <Result title="OR (95% CI)"
        value={`${fmt(or, 2)} (${fmt(ciLo, 2)} – ${fmt(ciHi, 2)})`}
        note={ciLo > 1 ? '✓ 顯著正向關聯' : ciHi < 1 ? '✓ 顯著保護效應' : 'CI 跨 1 — 不顯著'} />
    </>
  );
}

function CIRelativeRiskCalc() {
  const [a, set1] = _useS(30);
  const [b, set2] = _useS(70);
  const [c, set3] = _useS(15);
  const [d, set4] = _useS(85);
  const r1 = a / (a + b), r2 = c / (c + d);
  const rr = r1 / r2;
  const se = Math.sqrt(1/a - 1/(a+b) + 1/c - 1/(c+d));
  const lnRR = Math.log(rr);
  const z = CM.invNormal(0.975);
  const ciLo = Math.exp(lnRR - z * se), ciHi = Math.exp(lnRR + z * se);
  return (
    <>
      <div className="m-22" style={{marginBottom: 12}}>
        <div className="hd"></div><div className="hd">疾病 +</div><div className="hd">疾病 −</div>
        <div className="hd">暴露</div>
        <div><input type="number" value={a} onChange={e=>set1(+e.target.value||0)} /></div>
        <div><input type="number" value={b} onChange={e=>set2(+e.target.value||0)} /></div>
        <div className="hd">未暴露</div>
        <div><input type="number" value={c} onChange={e=>set3(+e.target.value||0)} /></div>
        <div><input type="number" value={d} onChange={e=>set4(+e.target.value||0)} /></div>
      </div>
      <Result title="RR (95% CI)"
        value={`${fmt(rr, 2)} (${fmt(ciLo, 2)} – ${fmt(ciHi, 2)})`}
        note={`暴露風險 ${pct(r1)} vs 未暴露 ${pct(r2)} · ARR = ${pct(Math.abs(r1-r2), 2)} · NNT = ${(1/Math.abs(r1-r2)).toFixed(0)}`} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// EFFECT SIZE
// ═══════════════════════════════════════════════════════════

function ESCohenDCalc() {
  const [m1, set1] = _useS(100);
  const [m2, set2] = _useS(95);
  const [sp, set3] = _useS(15);
  const d = (m1 - m2) / sp;
  const interp = Math.abs(d) < 0.2 ? '微小'
              : Math.abs(d) < 0.5 ? '小'
              : Math.abs(d) < 0.8 ? '中'
              : '大';
  return (
    <>
      <F label="平均 1" value={m1} step={0.1} onChange={set1} />
      <F label="平均 2" value={m2} step={0.1} onChange={set2} />
      <F label="合併 SD" value={sp} step={0.1} onChange={set3} />
      <Result title="Cohen's d" value={fmt(d, 3)}
        note={`效應量：${interp}（< 0.2 微小、0.2–0.5 小、0.5–0.8 中、> 0.8 大）`} />
    </>
  );
}

function ESCohenHCalc() {
  const [p1, set1] = _useS(0.30);
  const [p2, set2] = _useS(0.20);
  const phi1 = 2 * Math.asin(Math.sqrt(p1));
  const phi2 = 2 * Math.asin(Math.sqrt(p2));
  const h = phi1 - phi2;
  return (
    <>
      <F label="比例 1" value={p1} step={0.01} min={0.001} max={0.999} onChange={set1} />
      <F label="比例 2" value={p2} step={0.01} min={0.001} max={0.999} onChange={set2} />
      <Result title="Cohen's h" value={fmt(h, 3)}
        note="比例差異效應量（< 0.2 小、> 0.5 中、> 0.8 大）" />
    </>
  );
}

function ESORtoDCalc() {
  const [or, set1] = _useS(2.0);
  const d = Math.log(or) * Math.sqrt(3) / Math.PI;
  return (
    <>
      <F label="勝算比 OR" value={or} step={0.05} min={0.01} max={100} onChange={set1} />
      <Result title="對應 Cohen's d" value={fmt(d, 3)}
        note="OR → d 轉換：d = ln(OR) · √3 / π。Chinn (2000) 近似" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// RISK / DIAGNOSTIC
// ═══════════════════════════════════════════════════════════

function DiagFullCalc() {
  const [tp, set1] = _useS(95);
  const [fn, set2] = _useS(5);
  const [fp, set3] = _useS(20);
  const [tn, set4] = _useS(880);
  const sens = tp / (tp + fn), spec = tn / (tn + fp);
  const ppv = tp / (tp + fp), npv = tn / (tn + fn);
  const acc = (tp + tn) / (tp + fn + fp + tn);
  const lrPos = sens / (1 - spec), lrNeg = (1 - sens) / spec;
  return (
    <>
      <div className="m-22" style={{marginBottom: 12}}>
        <div className="hd"></div><div className="hd">疾病 +</div><div className="hd">疾病 −</div>
        <div className="hd">檢驗 +</div>
        <div><input type="number" value={tp} onChange={e=>set1(+e.target.value||0)} /></div>
        <div><input type="number" value={fp} onChange={e=>set3(+e.target.value||0)} /></div>
        <div className="hd">檢驗 −</div>
        <div><input type="number" value={fn} onChange={e=>set2(+e.target.value||0)} /></div>
        <div><input type="number" value={tn} onChange={e=>set4(+e.target.value||0)} /></div>
      </div>
      <ReadGrid rows={[
        { k: 'Sens', v: pct(sens) }, { k: 'Spec', v: pct(spec) },
        { k: 'PPV', v: pct(ppv) }, { k: 'NPV', v: pct(npv) },
        { k: 'LR+', v: fmt(lrPos, 2) }, { k: 'LR−', v: fmt(lrNeg, 2) },
        { k: 'Accuracy', v: pct(acc) },
        { k: 'Youden J', v: fmt(sens + spec - 1, 3) }
      ]}/>
    </>
  );
}

function DiagPredValueCalc() {
  const [sens, set1] = _useS(0.95);
  const [spec, set2] = _useS(0.98);
  const [prev, set3] = _useS(0.01);
  const ppv = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev));
  const npv = (spec * (1 - prev)) / (spec * (1 - prev) + (1 - sens) * prev);
  return (
    <>
      <F label="敏感度 Sens" value={sens} step={0.01} min={0} max={1} onChange={set1} />
      <F label="特異度 Spec" value={spec} step={0.01} min={0} max={1} onChange={set2} />
      <F label="盛行率" value={prev} step={0.005} min={0.0001} max={0.999} onChange={set3} />
      <ReadGrid rows={[
        { k: 'PPV', v: pct(ppv, 2) },
        { k: 'NPV', v: pct(npv, 2) },
        { k: '陰性可信度', v: pct(1 - npv, 4), color: 'var(--ink-3)' },
        { k: '陽性誤判率', v: pct(1 - ppv, 1), color: 'var(--ink-3)' }
      ]}/>
    </>
  );
}

function DiagLRCalc() {
  const [pre, set1] = _useS(0.20);
  const [lr, set2] = _useS(5);
  const preOdds = pre / (1 - pre);
  const postOdds = preOdds * lr;
  const post = postOdds / (1 + postOdds);
  return (
    <>
      <F label="檢驗前機率（盛行率）" value={pre} step={0.01} min={0.001} max={0.999} onChange={set1} />
      <F label="概似比 LR" hint="LR+ > 1 / LR− < 1" value={lr} step={0.1} min={0.01} max={100} onChange={set2} />
      <ReadGrid rows={[
        { k: '檢驗後機率', v: pct(post, 1) },
        { k: '機率變化', v: `+${pct(post - pre, 1)}` }
      ]}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// REGRESSION / SURVIVAL
// ═══════════════════════════════════════════════════════════

function RegOddsRatioCalc() {
  const [beta, set1] = _useS(0.693);
  const [se, set2] = _useS(0.2);
  const or = Math.exp(beta);
  const z = CM.invNormal(0.975);
  const ciLo = Math.exp(beta - z * se);
  const ciHi = Math.exp(beta + z * se);
  const zStat = beta / se;
  const p = CM.pFromZ(zStat);
  return (
    <>
      <F label="迴歸係數 β" value={beta} step={0.05} onChange={set1} />
      <F label="標準誤 SE" value={se} step={0.01} min={0.001} onChange={set2} />
      <Result title="OR (95% CI)"
        value={`${fmt(or, 2)} (${fmt(ciLo, 2)} – ${fmt(ciHi, 2)})`}
        note={`z = ${fmt(zStat, 2)}, p = ${pVal(p)}`} />
    </>
  );
}

function RegHazardRatioCalc() {
  const [beta, set1] = _useS(-0.357);
  const [se, set2] = _useS(0.15);
  const hr = Math.exp(beta);
  const z = CM.invNormal(0.975);
  const ciLo = Math.exp(beta - z * se);
  const ciHi = Math.exp(beta + z * se);
  const zStat = beta / se;
  const p = CM.pFromZ(zStat);
  return (
    <>
      <F label="Cox β" value={beta} step={0.05} onChange={set1} />
      <F label="標準誤 SE" value={se} step={0.01} min={0.001} onChange={set2} />
      <Result title="HR (95% CI)"
        value={`${fmt(hr, 2)} (${fmt(ciLo, 2)} – ${fmt(ciHi, 2)})`}
        note={`z = ${fmt(zStat, 2)}, p = ${pVal(p)} · ${hr < 1 ? '降低風險' : '增加風險'} ${pct(Math.abs(hr-1))}`} />
    </>
  );
}

function RegLogitProbCalc() {
  const [logit, set1] = _useS(0.5);
  const p = 1 / (1 + Math.exp(-logit));
  return (
    <>
      <F label="Logit (log-odds)" value={logit} step={0.1} onChange={set1} />
      <Result title="對應機率 P" value={pct(p, 2)}
        note={`勝算 = ${fmt(Math.exp(logit), 3)} : 1`} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// DISTRIBUTIONS
// ═══════════════════════════════════════════════════════════

function DistNormalCalc() {
  const [x, set1] = _useS(1.96);
  const [mu, set2] = _useS(0);
  const [sigma, set3] = _useS(1);
  const z = (x - mu) / sigma;
  const lower = ST.normCDF(z);
  return (
    <>
      <F label="觀察值 x" value={x} step={0.1} onChange={set1} />
      <F label="μ" value={mu} step={0.1} onChange={set2} />
      <F label="σ" value={sigma} step={0.1} min={0.01} onChange={set3} />
      <ReadGrid rows={[
        { k: 'z 分數', v: fmt(z, 3) },
        { k: 'P(X ≤ x)', v: pct(lower, 2) },
        { k: 'P(X > x)', v: pct(1 - lower, 2) },
        { k: 'P(|Z| ≥ |z|)', v: pct(2*(1 - ST.normCDF(Math.abs(z))), 3) }
      ]}/>
    </>
  );
}

function DistInverseNormalCalc() {
  const [p, set1] = _useS(0.975);
  const z = CM.invNormal(p);
  return (
    <>
      <F label="累積機率 P" value={p} step={0.005} min={0.001} max={0.999} onChange={set1} />
      <Result title="z 分位數" value={fmt(z, 4)}
        note={`常用：0.95 → 1.6449 · 0.975 → 1.9600 · 0.995 → 2.5758`} />
    </>
  );
}

function DistBinomCalc() {
  const [n, set1] = _useS(20);
  const [p, set2] = _useS(0.3);
  const [k, set3] = _useS(6);
  const pmf = ST.binomPMF(k, n, p);
  const cdf = CM.binomCDF(k, n, p);
  return (
    <>
      <F label="試驗數 n" value={n} step={1} min={1} onChange={set1} />
      <F label="成功率 p" value={p} step={0.01} min={0.001} max={0.999} onChange={set2} />
      <F label="目標 k" value={k} step={1} min={0} max={n} onChange={set3} />
      <ReadGrid rows={[
        { k: 'P(X = k)', v: pct(pmf, 3) },
        { k: 'P(X ≤ k)', v: pct(cdf, 3) },
        { k: 'P(X ≥ k)', v: pct(1 - cdf + pmf, 3) },
        { k: 'E[X]', v: fmt(n*p, 2) }
      ]}/>
    </>
  );
}

function DistPoissonCalc() {
  const [lambda, set1] = _useS(4);
  const [k, set2] = _useS(2);
  const pmf = ST.poissonPMF(k, lambda);
  const cdf = CM.poissonCDF(k, lambda);
  return (
    <>
      <F label="速率 λ" value={lambda} step={0.1} min={0.01} onChange={set1} />
      <F label="目標 k" value={k} step={1} min={0} onChange={set2} />
      <ReadGrid rows={[
        { k: 'P(X = k)', v: pct(pmf, 3) },
        { k: 'P(X ≤ k)', v: pct(cdf, 3) },
        { k: 'P(X ≥ k)', v: pct(1 - cdf + pmf, 3) },
        { k: 'E = Var', v: fmt(lambda, 2) }
      ]}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// AGREEMENT / KAPPA / ICC
// ═══════════════════════════════════════════════════════════

function AgreeKappaCalc() {
  const [a, set1] = _useS(60);
  const [b, set2] = _useS(10);
  const [c, set3] = _useS(15);
  const [d, set4] = _useS(115);
  const N = a + b + c + d;
  const Po = (a + d) / N;
  const Pe = (((a + b) * (a + c) + (c + d) * (b + d))) / (N * N);
  const kappa = (Po - Pe) / (1 - Pe);
  const interp = kappa < 0 ? '比隨機更差'
              : kappa < 0.20 ? '很差'
              : kappa < 0.40 ? '輕度'
              : kappa < 0.60 ? '中度'
              : kappa < 0.80 ? '良好'
              : '極佳';
  return (
    <>
      <div className="m-22" style={{marginBottom: 12}}>
        <div className="hd"></div><div className="hd">評者 B +</div><div className="hd">評者 B −</div>
        <div className="hd">評者 A +</div>
        <div><input type="number" value={a} onChange={e=>set1(+e.target.value||0)} /></div>
        <div><input type="number" value={b} onChange={e=>set2(+e.target.value||0)} /></div>
        <div className="hd">評者 A −</div>
        <div><input type="number" value={c} onChange={e=>set3(+e.target.value||0)} /></div>
        <div><input type="number" value={d} onChange={e=>set4(+e.target.value||0)} /></div>
      </div>
      <ReadGrid rows={[
        { k: '觀察一致 Po', v: pct(Po, 2) },
        { k: '隨機一致 Pe', v: pct(Pe, 2) },
        { k: 'Cohen κ', v: fmt(kappa, 3) },
        { k: '解讀', v: interp }
      ]}/>
    </>
  );
}

function AgreeICCCalc() {
  const [msB, set1] = _useS(25);
  const [msW, set2] = _useS(4);
  const [k, set3] = _useS(2);
  const icc = (msB - msW) / (msB + (k - 1) * msW);
  const interp = icc < 0.5 ? '差'
              : icc < 0.75 ? '中等'
              : icc < 0.9 ? '良好'
              : '優秀';
  return (
    <>
      <F label="MS_between" value={msB} step={0.5} onChange={set1} />
      <F label="MS_within"  value={msW} step={0.5} onChange={set2} />
      <F label="評者數 k" value={k} step={1} min={2} onChange={set3} />
      <Result title="ICC (2,1) 估計值" value={fmt(icc, 3)}
        note={`一致性等級：${interp}（< 0.5 差、0.5–0.75 中、0.75–0.9 良、> 0.9 優）`} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// MULTIPLE COMPARISON
// ═══════════════════════════════════════════════════════════

function MCBonferroniCalc() {
  const [alpha, set1] = _useS(0.05);
  const [m, set2] = _useS(20);
  const adj = alpha / m;
  const fwer = 1 - Math.pow(1 - alpha, m);
  return (
    <>
      <F label="原始 α" value={alpha} step={0.005} onChange={set1} />
      <F label="檢定次數 m" value={m} step={1} min={1} onChange={set2} />
      <ReadGrid rows={[
        { k: '調整後 α*', v: fmt(adj, 5) },
        { k: '不調整 FWER', v: pct(fwer, 1), color: 'var(--bad)' },
        { k: '需 p ≤', v: fmt(adj, 5) }
      ]}/>
    </>
  );
}

function MCFDRCalc() {
  const [pvalsStr, set1] = _useS('0.001, 0.008, 0.012, 0.028, 0.041, 0.052, 0.073, 0.130, 0.220, 0.450');
  const [q, set2] = _useS(0.05);
  const pvals = pvalsStr.split(/[,\s]+/).map(s => parseFloat(s)).filter(x => !isNaN(x)).sort((a,b)=>a-b);
  const m = pvals.length;
  const results = pvals.map((p, i) => {
    const threshold = ((i + 1) / m) * q;
    return { p, threshold, sig: p <= threshold };
  });
  // Find largest i where sig: all <= i are declared significant (BH)
  let largest = -1;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].sig) { largest = i; break; }
  }
  const numSig = largest + 1;

  return (
    <>
      <div className="m-field">
        <label>p 值（逗號分隔）</label>
        <textarea value={pvalsStr} onChange={e => set1(e.target.value)}
          rows={3} style={{
            width: '100%', background: 'transparent', border: 0,
            fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--ink)',
            resize: 'vertical', outline: 'none'
          }} />
      </div>
      <F label="目標 FDR q" value={q} step={0.01} min={0.01} max={0.5} onChange={set2} />
      <Result title="BH 校正後顯著數" value={numSig}
        note={`共 ${m} 個檢定。前 ${numSig} 小的 p 值通過 BH 門檻。`} />
      <div style={{marginTop: 10, fontFamily: 'var(--f-mono)', fontSize: 11,
        maxHeight: 200, overflow: 'auto', background: 'var(--bg)',
        border: '1px solid var(--line)', borderRadius: 8, padding: 8}}>
        {results.map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            color: i <= largest ? 'var(--good)' : 'var(--ink-3)',
            padding: '2px 0'
          }}>
            <span>{i + 1}. p = {r.p.toFixed(4)}</span>
            <span>≤ {r.threshold.toFixed(4)} {i <= largest ? '✓' : ''}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════════════════════

window.CalcCatalog = [
  {
    group: '樣本數', items: [
      { id: 'ss-means', title: '兩組平均比較', sub: '常用於 RCT 連續結果', Comp: SSMeansCalc },
      { id: 'ss-prop',  title: '兩組比例比較', sub: '療效有效率比較',     Comp: SSPropCalc },
      { id: 'ss-1m',    title: '單樣本平均',   sub: '與已知母體值比較',    Comp: SSOneMeanCalc },
      { id: 'ss-1p',    title: '單樣本比例',   sub: '與已知母體比例比較',  Comp: SSOnePropCalc },
      { id: 'ss-corr',  title: '相關性 r',      sub: '檢定 H₀: r = 0',     Comp: SSCorrCalc },
      { id: 'ss-surv',  title: '存活分析事件數', sub: 'Cox 模型所需事件',   Comp: SSSurvivalCalc },
      { id: 'ss-ni',    title: '非劣性試驗',   sub: '單尾 α 與邊界 Δ',     Comp: SSNonInferiorityCalc }
    ]
  },
  {
    group: '假設檢定', items: [
      { id: 'ht-1t',  title: '單樣本 t 檢定',  sub: '比較平均與已知值', Comp: TestOneTCalc },
      { id: 'ht-pt',  title: '配對 t 檢定',    sub: '前後測 / 配對',    Comp: TestPairedTCalc },
      { id: 'ht-2t',  title: '雙樣本 t (Welch)', sub: '不等變異也適用', Comp: TestTwoTCalc },
      { id: 'ht-chi', title: '卡方檢定 2×2',   sub: '類別資料關聯',    Comp: TestChiSquareCalc },
      { id: 'ht-p',   title: '兩比例 z 檢定',  sub: '大樣本近似',      Comp: TestPropsCalc },
      { id: 'ht-an',  title: '單因子 ANOVA',   sub: '三組以上平均比較', Comp: TestANOVACalc },
      { id: 'ht-r',   title: 'Pearson r 檢定', sub: '相關係數顯著性',  Comp: TestCorrCalc }
    ]
  },
  {
    group: '信賴區間', items: [
      { id: 'ci-mean', title: '平均的 CI',     sub: '可選信賴水準',     Comp: CIMeanCalc },
      { id: 'ci-prop', title: '比例的 CI',     sub: 'Wilson vs Wald',  Comp: CIPropCalc },
      { id: 'ci-or',   title: 'OR 95% CI',     sub: '勝算比附信賴區間', Comp: CIOddsRatioCalc },
      { id: 'ci-rr',   title: 'RR 95% CI',     sub: '相對風險 + NNT',  Comp: CIRelativeRiskCalc }
    ]
  },
  {
    group: '效應量', items: [
      { id: 'es-d',    title: 'Cohen\'s d',     sub: '兩組平均效應量',  Comp: ESCohenDCalc },
      { id: 'es-h',    title: 'Cohen\'s h',     sub: '兩組比例效應量',  Comp: ESCohenHCalc },
      { id: 'es-or-d', title: 'OR ↔ d 轉換',    sub: 'log-odds 跨研究合併', Comp: ESORtoDCalc }
    ]
  },
  {
    group: '診斷與篩檢', items: [
      { id: 'dx-full', title: '2×2 完整指標',  sub: 'Sens/Spec/PPV/NPV/LR', Comp: DiagFullCalc },
      { id: 'dx-pred', title: '預測值計算',    sub: '依盛行率與檢驗特性', Comp: DiagPredValueCalc },
      { id: 'dx-lr',   title: '概似比後機率',  sub: '從 LR 更新機率',  Comp: DiagLRCalc }
    ]
  },
  {
    group: '迴歸與存活', items: [
      { id: 'rg-or',  title: 'β → OR + CI',    sub: '邏輯迴歸',        Comp: RegOddsRatioCalc },
      { id: 'rg-hr',  title: 'β → HR + CI',    sub: 'Cox 比例風險',    Comp: RegHazardRatioCalc },
      { id: 'rg-pr',  title: 'Logit → P',     sub: 'log-odds 轉機率',  Comp: RegLogitProbCalc }
    ]
  },
  {
    group: '機率分布', items: [
      { id: 'dn-norm', title: '常態分布',     sub: 'P(X ≤ x) 與分位數',  Comp: DistNormalCalc },
      { id: 'dn-inv',  title: '反向常態',     sub: '從機率得 z',         Comp: DistInverseNormalCalc },
      { id: 'dn-bin',  title: '二項分布',     sub: 'PMF / CDF',         Comp: DistBinomCalc },
      { id: 'dn-poi',  title: '卜瓦松分布',   sub: 'PMF / CDF',         Comp: DistPoissonCalc }
    ]
  },
  {
    group: '一致性', items: [
      { id: 'ag-kap', title: 'Cohen\'s κ',     sub: '兩評者類別一致',   Comp: AgreeKappaCalc },
      { id: 'ag-icc', title: 'ICC',             sub: '連續測量一致性',   Comp: AgreeICCCalc }
    ]
  },
  {
    group: '多重比較', items: [
      { id: 'mc-bon', title: 'Bonferroni',    sub: '保守的 FWER 控制', Comp: MCBonferroniCalc },
      { id: 'mc-bh',  title: 'BH FDR',         sub: 'False Discovery Rate', Comp: MCFDRCalc }
    ]
  }
];
