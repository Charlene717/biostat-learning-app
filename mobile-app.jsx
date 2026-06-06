// mobile-app.jsx — mobile shell + iOS frame + tweaks
const { useState, useEffect } = React;

const M_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "clinical",
  "font": "plex",
  "dark": false,
  "difficulty": 2,
  "chartStyle": "curve",
  "screen": "home"
}/*EDITMODE-END*/;

const THEMES = {
  clinical: { accent: 'oklch(0.58 0.10 175)', soft: 'oklch(0.94 0.04 175)', ink: 'oklch(0.32 0.08 175)' },
  indigo:   { accent: 'oklch(0.50 0.12 265)', soft: 'oklch(0.94 0.04 265)', ink: 'oklch(0.34 0.10 265)' },
  rose:     { accent: 'oklch(0.62 0.16 25)',  soft: 'oklch(0.95 0.04 25)',  ink: 'oklch(0.40 0.13 25)' },
  graphite: { accent: 'oklch(0.32 0.02 250)', soft: 'oklch(0.93 0.01 250)', ink: 'oklch(0.20 0.02 250)' }
};

const FONTS = {
  plex: {
    sans: '"IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    display: '"IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif'
  },
  geist: {
    sans: '"Geist", "Noto Sans TC", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    display: '"Geist", "Noto Sans TC", system-ui, sans-serif'
  },
  serif: {
    sans: '"IBM Plex Sans", "Noto Sans TC", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    display: '"Newsreader", "Noto Serif TC", Georgia, serif'
  }
};

const SWATCH_BY_THEME = {
  clinical: '#0e8c8c', indigo: '#3b4cca', rose: '#cf5a3e', graphite: '#3a3f4a'
};
const THEME_BY_SWATCH = {
  '#0e8c8c': 'clinical', '#3b4cca': 'indigo', '#cf5a3e': 'rose', '#3a3f4a': 'graphite'
};

function MobileApp() {
  const [tweaks, setTweak] = window.useTweaks(M_TWEAK_DEFAULTS);
  const [view, setView] = useState({ screen: tweaks.screen || 'home', topicId: null, lessonIdx: 0 });

  useEffect(() => {
    const theme = THEMES[tweaks.theme] || THEMES.clinical;
    const font = FONTS[tweaks.font] || FONTS.plex;
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-soft', theme.soft);
    root.style.setProperty('--accent-ink', theme.ink);
    root.style.setProperty('--f-sans', font.sans);
    root.style.setProperty('--f-mono', font.mono);
    root.style.setProperty('--f-display', font.display);
    document.body.setAttribute('data-theme', tweaks.dark ? 'dark' : 'light');
  }, [tweaks.theme, tweaks.font, tweaks.dark]);

  useEffect(() => {
    if (tweaks.screen && tweaks.screen !== view.screen && view.screen !== 'topic') {
      setView({ screen: tweaks.screen, topicId: null });
    }
  }, [tweaks.screen]);

  const nav = (screen) => { setView({ screen, topicId: null, lessonIdx: 0 }); setTweak('screen', screen); };
  const openTopic = (topicId) => setView({ screen: 'topic', topicId, lessonIdx: 0 });
  const backToLib = () => setView({ screen: 'lib', topicId: null, lessonIdx: 0 });
  const openLesson = (idx) => setView(v => ({ screen: 'lesson', topicId: v.topicId, lessonIdx: idx }));
  const backToTopic = () => setView(v => ({ screen: 'topic', topicId: v.topicId, lessonIdx: 0 }));

  let body = null;
  switch (view.screen) {
    case 'home':    body = <window.MHome onNav={nav} onOpenTopic={openTopic} />; break;
    case 'lib':     body = <window.MLib onOpenTopic={openTopic} />; break;
    case 'concept': body = <window.MConcept chartStyle={tweaks.chartStyle} />; break;
    case 'lab':     body = <window.MLab />; break;
    case 'quiz':    body = <window.MQuiz />; break;
    case 'cheat':   body = <window.MCheat />; break;
    case 'calc':    body = <window.MCalc />; break;
    case 'topic':   body = <window.MTopicDetail topicId={view.topicId} onBack={backToLib}
                       chartStyle={tweaks.chartStyle} onNav={nav} onOpenLesson={openLesson} />; break;
    case 'lesson':  body = <window.MLessonReader topicId={view.topicId} initialIdx={view.lessonIdx}
                       onBack={backToTopic} />; break;
    default:        body = <window.MHome onNav={nav} onOpenTopic={openTopic} />;
  }

  const activeNav = (view.screen === 'topic' || view.screen === 'lesson') ? 'lib'
    : view.screen === 'concept' ? 'lab' : view.screen;

  return (
    <div className="phone-page">
      <div className="phone-wrap">
        <window.IOSDevice width={402} height={874} dark={tweaks.dark}>
          <div className="m-app" style={{height: '100%'}}>
            <div className="m-safe-top" />
            {body}
            <window.MTabBar active={activeNav} onNav={nav} />
          </div>
        </window.IOSDevice>
      </div>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="主題色 Theme" />
        <window.TweakColor
          label="Accent"
          value={SWATCH_BY_THEME[tweaks.theme] || '#0e8c8c'}
          onChange={(hex) => setTweak('theme', THEME_BY_SWATCH[hex.toLowerCase()] || 'clinical')}
          options={['#0e8c8c', '#3b4cca', '#cf5a3e', '#3a3f4a']} />

        <window.TweakSection label="字體 Typography" />
        <window.TweakRadio
          label="Family"
          value={tweaks.font}
          onChange={(v) => setTweak('font', v)}
          options={[
            { value: 'plex',  label: 'Plex' },
            { value: 'geist', label: 'Geist' },
            { value: 'serif', label: '襯線' }
          ]} />

        <window.TweakSection label="外觀" />
        <window.TweakToggle
          label="深色模式"
          value={tweaks.dark}
          onChange={(v) => setTweak('dark', v)} />

        <window.TweakSection label="學習設定" />
        <window.TweakRadio
          label="難度"
          value={tweaks.difficulty}
          onChange={(v) => setTweak('difficulty', v)}
          options={[
            { value: 1, label: '入門' },
            { value: 2, label: '標準' },
            { value: 3, label: '進階' }
          ]} />
        <window.TweakRadio
          label="圖表"
          value={tweaks.chartStyle}
          onChange={(v) => setTweak('chartStyle', v)}
          options={[
            { value: 'curve', label: '曲線' },
            { value: 'step',  label: '階梯' }
          ]} />

        <window.TweakSection label="跳轉畫面" />
        <window.TweakSelect
          label="Screen"
          value={view.screen === 'topic' ? 'lib' : view.screen}
          onChange={(v) => { setView({ screen: v, topicId: null }); setTweak('screen', v); }}
          options={[
            { value: 'home',    label: '儀表板' },
            { value: 'lib',     label: '主題庫' },
            { value: 'concept', label: '互動概念' },
            { value: 'lab',     label: '實驗室 Lab' },
            { value: 'quiz',    label: '練習測驗' },
            { value: 'cheat',   label: '速查卡片' },
            { value: 'calc',    label: '計算機' }
          ]} />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MobileApp />);
