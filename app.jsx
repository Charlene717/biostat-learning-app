// app.jsx - main shell + tweaks integration
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "clinical",
  "font": "plex",
  "dark": false,
  "difficulty": 2,
  "chartStyle": "curve",
  "screen": "home"
}/*EDITMODE-END*/;

// Theme accent definitions (oklch tokens applied to :root)
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

// Map color swatch hex back to theme key
const THEME_BY_SWATCH = {
  '#0e8c8c': 'clinical',
  '#3b4cca': 'indigo',
  '#cf5a3e': 'rose',
  '#3a3f4a': 'graphite'
};
const SWATCH_BY_THEME = {
  clinical: '#0e8c8c',
  indigo: '#3b4cca',
  rose: '#cf5a3e',
  graphite: '#3a3f4a'
};

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const [view, setView] = useState({ screen: tweaks.screen || 'home', topicId: null, lessonIdx: 0 });

  // Apply theme + font tokens to :root
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

  // sync screen from Tweaks
  useEffect(() => {
    if (tweaks.screen && tweaks.screen !== view.screen && view.screen !== 'topic') {
      setView({ screen: tweaks.screen, topicId: null });
    }
  }, [tweaks.screen]);

  const nav = (screen) => {
    setView({ screen, topicId: null, lessonIdx: 0 });
    setTweak('screen', screen);
  };
  const openTopic = (topicId) => setView({ screen: 'topic', topicId, lessonIdx: 0 });
  const backToLib = () => setView({ screen: 'lib', topicId: null, lessonIdx: 0 });
  const openLesson = (idx) => setView(v => ({ screen: 'lesson', topicId: v.topicId, lessonIdx: idx }));
  const backToTopic = () => setView(v => ({ screen: 'topic', topicId: v.topicId, lessonIdx: 0 }));

  // render screen
  let content = null;
  switch (view.screen) {
    case 'home':
      content = <window.Dashboard onOpenTopic={openTopic} onNav={nav} />; break;
    case 'lib':
      content = <window.Library onOpenTopic={openTopic} />; break;
    case 'concept':
      content = <window.ConceptPage chartStyle={tweaks.chartStyle} />; break;
    case 'lab':
      content = <window.LabPage />; break;
    case 'quiz':
      content = <window.QuizPage difficulty={tweaks.difficulty} />; break;
    case 'cheat':
      content = <window.CheatPage />; break;
    case 'calc':
      content = <window.CalcPage />; break;
    case 'case':
      content = <window.CasePage />; break;
    case 'topic':
      content = <window.TopicDetail topicId={view.topicId} onBack={backToLib}
                  chartStyle={tweaks.chartStyle} onNav={nav} onOpenLesson={openLesson} />; break;
    case 'lesson':
      content = <window.DesktopLessonReader topicId={view.topicId} initialIdx={view.lessonIdx}
                  onBack={backToTopic} />; break;
    default:
      content = <window.Dashboard onOpenTopic={openTopic} onNav={nav} />;
  }

  const activeNav = (view.screen === 'topic' || view.screen === 'lesson') ? 'lib' : view.screen;

  // user switch → bump key to remount content with fresh per-user data
  const [userBump, setUserBump] = useState(0);

  return (
    <>
      <div className="app">
        <window.Sidebar active={activeNav} onNav={nav} key={`sb-${userBump}`} />
        <main className="main" data-screen-label={`${activeNav} screen`} key={`main-${userBump}`}>
          {content}
        </main>
      </div>

      <window.AccountModal onUserChange={() => setUserBump(b => b + 1)} />
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="主題色 Theme" />
        <window.TweakColor
          label="Accent"
          value={SWATCH_BY_THEME[tweaks.theme] || SWATCH_BY_THEME.clinical}
          onChange={(hex) => {
            const themeKey = THEME_BY_SWATCH[hex.toLowerCase()] || 'clinical';
            setTweak('theme', themeKey);
          }}
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
            { value: 'home',    label: '儀表板 Dashboard' },
            { value: 'lib',     label: '主題庫 Library' },
            { value: 'concept', label: '互動概念 Concepts' },
            { value: 'lab',     label: '實驗室 Lab' },
            { value: 'quiz',    label: '練習測驗 Quiz' },
            { value: 'cheat',   label: '速查卡片 Cheat sheet' },
            { value: 'calc',    label: '計算機 Calculators' },
            { value: 'case',    label: '臨床情境 Case study' }
          ]} />
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
