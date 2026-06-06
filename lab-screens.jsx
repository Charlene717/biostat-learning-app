// lab-screens.jsx - Interactive lab pages (mobile + desktop)
const { useState: _useState } = React;

// Mobile Lab
window.MLab = function MLab() {
  const cat = window.InteractiveCatalog;
  const [active, setActive] = _useState(cat[0].id);
  const item = cat.find(c => c.id === active);
  const Widget = window[item.name];

  return (
    <>
      <div className="m-header">
        <div>
          <div className="greet">07 · Interactive Lab</div>
          <h1>實驗室</h1>
        </div>
      </div>

      <div className="m-chips">
        {cat.map(c => (
          <button key={c.id}
            className={`m-chip ${active === c.id ? 'active' : ''}`}
            onClick={() => setActive(c.id)}>
            {c.title}
          </button>
        ))}
      </div>

      <div className="m-scroll" style={{paddingTop: 16}}>
        <div className="m-section" style={{padding: '0 20px'}}>
          <div style={{marginBottom: 12}}>
            <div style={{fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
              {item.sub}
            </div>
            <h2 style={{fontSize: 18, fontWeight: 600, margin: '4px 0 0', letterSpacing: '-0.015em'}}>
              {item.title}
            </h2>
          </div>
          {Widget ? <Widget /> : <div>Widget {item.name} not found</div>}
        </div>
      </div>
    </>
  );
};

// Desktop Lab
window.LabPage = function LabPage() {
  const cat = window.InteractiveCatalog;
  const [active, setActive] = _useState(cat[0].id);
  const item = cat.find(c => c.id === active);
  const Widget = window[item.name];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="crumb">07 · Interactive Lab</div>
          <h1>互動實驗室</h1>
          <div className="sub">用滑桿與參數親自實驗統計觀念，看公式背後的動態行為</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20}}>
        <div className="col">
          {cat.map(c => (
            <button key={c.id}
              className={`topic-card ${active === c.id ? 'active' : ''}`}
              onClick={() => setActive(c.id)}
              style={{
                cursor: 'pointer', textAlign: 'left',
                borderColor: active === c.id ? 'var(--ink)' : 'var(--line)',
                background: active === c.id ? 'color-mix(in oklch, var(--ink) 3%, var(--panel))' : 'var(--panel)',
                fontFamily: 'inherit', color: 'inherit',
                width: '100%', display: 'grid',
                gridTemplateColumns: '28px 1fr',
                gap: 12, alignItems: 'center'
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--accent-soft)', color: 'var(--accent-ink)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--f-mono)', fontSize: 11, fontWeight: 600
              }}>{cat.indexOf(item) >= 0 ? (cat.findIndex(x => x.id === c.id) + 1).toString().padStart(2, '0') : ''}</span>
              <div>
                <div style={{fontWeight: 600, fontSize: 13.5}}>{c.title}</div>
                <div style={{fontSize: 11, color: 'var(--ink-3)', marginTop: 2}}>{c.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <div>
          <div style={{marginBottom: 18}}>
            <div className="meta" style={{fontFamily:'var(--f-mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom: 6}}>
              {item.sub}
            </div>
            <h2 style={{fontSize: 24, fontWeight: 600, margin: 0, letterSpacing: '-0.015em'}}>
              {item.title}
            </h2>
          </div>
          {Widget ? <Widget /> : null}
        </div>
      </div>
    </div>
  );
};
