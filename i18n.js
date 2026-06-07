// i18n.js — runtime ZH↔EN translation layer (DOM-walking, no component rewrites)
(function () {
  const LANG_KEY = 'biostat-lang-v1';

  // Exact full-text-node translations (trimmed match). ZH → EN.
  const DICT = {
    // brand / nav
    '生物統計': 'Biostatistics',
    '儀表板': 'Dashboard',
    '主題庫': 'Topics',
    '互動概念': 'Concepts',
    '實驗室': 'Lab',
    '練習測驗': 'Quiz',
    '速查卡片': 'Cheat Sheet',
    '計算機': 'Calculators',
    '臨床情境': 'Case Study',
    '連續天數': 'Day streak',
    '切換 ›': 'Switch ›',
    'LEARN': 'LEARN',

    // bottom tab (mobile)
    '首頁': 'Home',
    '主題': 'Topics',
    '實驗': 'Lab',
    '練習': 'Quiz',
    '工具': 'Tools',

    // dashboard
    '2026 · 春季學習計畫': '2026 · Spring Study Plan',
    '今天還有 1 個未完成的任務 · 預計 20 分鐘': '1 task left today · ~20 min',
    '歡迎加入！從任一主題或每日一題開始你的學習旅程。': 'Welcome! Start your journey from any topic or the daily question.',
    '切換帳號': 'Switch account',
    '開始學習': 'Start learning',
    '開始第一步': 'Get started',
    '繼續上次的進度': 'Pick up where you left off',
    '選一個主題開始吧': 'Pick a topic to begin',
    '18 個主題、互動實驗室、33 個計算工具與題庫等你探索。完成題目即可累積專屬於你的學習進度。':
      '18 topics, an interactive lab, 33 calculators and a question bank await. Answer questions to build your own progress.',
    '瀏覽主題庫 →': 'Browse topics →',
    '繼續學習 →': 'Continue →',
    '繼續學習': 'Continue learning',
    '互動模擬': 'Interactive sim',
    '完成 Session': 'Sessions done',
    '測驗練習次數': 'Quiz sessions',
    '作答題數': 'Questions answered',
    '累積回答': 'Total answered',
    '測驗正確率': 'Quiz accuracy',
    '熟練主題': 'Mastered topics',
    '≥ 80% 正確率': '≥ 80% accuracy',
    '尚未開始': 'Not started',
    '還沒有進行中的主題。': 'No topics in progress yet.',
    '瀏覽主題庫': 'Browse topics',
    '每日一題': 'Daily question',
    '挑戰': 'Challenge',
    '挑戰今日題 →': "Take today's question →",
    '速查重點': 'Quick formula',
    '隨機': 'Random',
    '標準誤 = 標準差除以樣本數平方根。它描述「樣本平均」這個估計量的不確定性，不是個別觀測值的離散度。':
      'Standard error = SD ÷ √n. It describes the uncertainty of the sample mean, not the spread of individual observations.',
    '目前帳號': 'Current account',
    '管理': 'Manage',
    '尚無紀錄': 'No records yet',
    '近期測驗表現': 'Recent quiz scores',

    // library
    '從描述統計到 Cox 比例風險。每個主題包含概念、互動、練習、計算工具。':
      'From descriptive statistics to Cox proportional hazards. Each topic includes concepts, interactives, practice and calculators.',
    '排序': 'Sort',
    '+ 新增筆記': '+ New note',
    '全部': 'All',
    '基礎': 'Basics',
    '推論': 'Inference',
    '建模': 'Modeling',
    '進階': 'Advanced',
    '臨床': 'Clinical',

    // concept / lab
    '機率分布實驗室': 'Probability Distribution Lab',
    '拖動滑桿改變參數，即時觀察分布形狀與機率質量。':
      'Drag the sliders to change parameters and watch the distribution and probability update live.',
    '常態 Normal': 'Normal',
    '二項 Binomial': 'Binomial',
    '卜瓦松 Poisson': 'Poisson',
    '參數控制': 'Parameters',
    '即時讀數': 'Live readout',
    '學習提示': 'Learning tip',
    '互動實驗室': 'Interactive Lab',
    '用滑桿與參數親自實驗統計觀念，看公式背後的動態行為':
      'Experiment with statistical concepts hands-on and see the dynamics behind the formulas',
    '代表性視覺': 'Representative visual',

    // quiz
    '混合題型：單選、複選、是非、數值計算。所有題目附解析與進度追蹤。':
      'Mixed formats: single, multi, true/false, numeric. Every question has an explanation and progress tracking.',
    '清除進度': 'Clear progress',
    '累積正確率': 'Overall accuracy',
    '次練習': 'sessions',
    '待複習錯題': 'Wrong to review',
    '過去答錯': 'Previously wrong',
    '選擇主題': 'Choose topic',
    '難度': 'Difficulty',
    '難度與題數': 'Difficulty & count',
    '入門': 'Beginner',
    '標準': 'Standard',
    '題數': 'Questions',
    '依正確率排序': 'By accuracy',
    '建議複習主題': 'Suggested review',
    '錯題會累積在這裡。挑戰錯題模式只抽你過去答錯的題目，幫助鞏固弱項。':
      'Wrong answers collect here. Review mode draws only questions you previously missed to shore up weak spots.',
    '挑戰錯題 →': 'Review wrong →',
    '近期表現': 'Recent performance',
    '練習完成': 'Practice complete',
    '新測驗': 'New quiz',
    '再來一次': 'Try again',
    '題目回顧': 'Question review',
    '正確率': 'Accuracy',
    '清除': 'Clear',
    '送出答案': 'Submit',
    '下一題 →': 'Next →',
    '查看結果 →': 'See results →',
    '結束': 'End',
    '解釋': 'Explanation',
    '正確！': 'Correct!',
    '再想想': 'Not quite',
    '正確': 'Correct',
    '錯誤': 'Incorrect',
    '單選': 'Single',
    '複選': 'Multi',
    '是非': 'T/F',
    '計算': 'Numeric',
    '優秀': 'Excellent',
    '良好': 'Good',
    '中等': 'Fair',
    '需加強': 'Needs work',
    '正確 True': 'True',
    '錯誤 False': 'False',
    '此分類無題目': 'No questions in this filter',

    // cheat sheet
    '搜尋公式或概念...': 'Search formulas or concepts...',

    // calculators (categories)
    '樣本數': 'Sample Size',
    '假設檢定': 'Hypothesis Tests',
    '信賴區間': 'Confidence Intervals',
    '效應量': 'Effect Size',
    '診斷與篩檢': 'Diagnostics',
    '迴歸與存活': 'Regression & Survival',
    '機率分布': 'Distributions',
    '一致性': 'Agreement',
    '多重比較': 'Multiple Comparisons',
    '樣本數、假設檢定、信賴區間、效應量、診斷、迴歸 — 完整生物統計工具箱':
      'Sample size, hypothesis tests, CIs, effect size, diagnostics, regression — a complete biostatistics toolbox',

    // account modal
    '使用者帳號': 'User Accounts',
    '切換帳號 · ': 'Switch account · ',
    '使用中': 'Active',
    '新增帳號': 'New account',
    '輸入帳號名稱…': 'Enter account name…',
    '+ 新增': '+ Add',
    '重新命名': 'Rename',
    '儲存': 'Save',
    '取消': 'Cancel',
    '已更新帳號名稱': 'Account name updated',
    '備份與還原': 'Backup & Restore',
    '匯出當前進度': 'Export progress',
    '匯入舊紀錄': 'Import records',
    '匯入方式：': 'Import mode:',
    '建立新帳號': 'New account',
    '合併到當前': 'Merge into current',
    '進度儲存於此瀏覽器。換裝置前請先「匯出」，並在新裝置「匯入」以延續紀錄。':
      'Progress is stored in this browser. Export before switching devices, then import on the new device to continue.',
    '已匯出當前帳號進度 JSON': 'Exported current account progress JSON',
    '已新增並切換至新帳號': 'Added and switched to the new account',
    '至少需保留一個帳號': 'At least one account is required',
    '已合併匯入紀錄至當前帳號': 'Merged imported records into current account',
    '匯入失敗：': 'Import failed: ',

    // case study
    '臨床情境模擬': 'Clinical Case Simulation',
    '真實情境讓統計觀念有歸宿': 'Real scenarios give statistics a home',
    '關鍵證據': 'Key evidence',
    '判讀挑戰': 'Interpretation challenge',
    '關聯主題': 'Related topics',

    // topic detail
    '概覽': 'Overview',
    '練習': 'Practice',
    '進度': 'Progress',
    '核心關鍵字': 'Key terms',
    '關鍵字': 'Keywords',
    '學習目標': 'Learning goals',
    '課程內容': 'Lessons',
    '開始學習 →': 'Start learning →',
    '返回主題庫': 'Back to topics',
    '返回實驗室': 'Back to lab',

    // tweaks
    '主題色 Theme': 'Theme color',
    '字體 Typography': 'Typography',
    '外觀': 'Appearance',
    '深色模式': 'Dark mode',
    '學習設定': 'Study settings',
    '圖表': 'Charts',
    '跳轉畫面': 'Go to screen',
    '襯線': 'Serif',
    '曲線': 'Curve',
    '階梯': 'Step',
    '語言': 'Language',

    // interpolation fragments (React splits {greet}，{name}！ into separate text nodes)
    '早安': 'Good morning',
    '午安': 'Good afternoon',
    '晚安': 'Good evening',
    '，': ', ',
    '！': '!',
    '題 ': 'Q ',
    '全部 ': 'All ',
    '最近 · ': 'Recent · ',
    '% 完成': '% complete',
    '開始 ': 'Start ',
    ' 題練習 →': ' questions →',
    '查看全部 ›': 'View all ›',
    '繼續 →': 'Continue →',
    '上次學到「': 'Last covered: ',
    '」。': '. ',
    ' 題': ' Qs',
    ' 張高密度公式卡片，可關鍵字搜尋。': ' high-density formula cards — search by keyword.',
    ' 主題': ' topics',
    ' 個計算工具': ' calculators',

    // topic names (content)
    '描述統計': 'Descriptive Statistics',
    '機率分布': 'Probability Distributions',
    '信賴區間與 p-value': 'CIs & p-values',
    '假設檢定': 'Hypothesis Testing',
    '迴歸分析': 'Regression',
    '存活分析': 'Survival Analysis',
    '診斷檢定': 'Diagnostic Tests',
    '臨床試驗設計': 'Clinical Trial Design',
    '樣本數計算': 'Sample Size',
    '無母數檢定': 'Nonparametric Tests',
    '相關與一致性': 'Correlation & Agreement',
    '流行病學測量': 'Epidemiologic Measures',
    '統合分析': 'Meta-analysis',
    '縱貫與混合模型': 'Longitudinal & Mixed Models',
    '因果推論': 'Causal Inference',
    '貝氏統計入門': 'Bayesian Inference',
    '缺失值處理': 'Missing Data',

    // calculator tool names
    '兩組平均比較': 'Two-group means',
    '兩組比例比較': 'Two-group proportions',
    '單樣本平均': 'One-sample mean',
    '單樣本比例': 'One-sample proportion',
    '相關性 r': 'Correlation r',
    '存活分析事件數': 'Survival events',
    '非劣性試驗': 'Non-inferiority',
    '單樣本 t 檢定': 'One-sample t-test',
    '配對 t 檢定': 'Paired t-test',
    '雙樣本 t (Welch)': 'Two-sample t (Welch)',
    '卡方檢定 2×2': 'Chi-square 2×2',
    '兩比例 z 檢定': 'Two-proportion z-test',
    '單因子 ANOVA': 'One-way ANOVA',
    'Pearson r 檢定': 'Pearson r test',
    '平均的 CI': 'CI for a mean',
    '比例的 CI': 'CI for a proportion',
    'OR ↔ d 轉換': 'OR ↔ d conversion',
    '2×2 完整指標': 'Full 2×2 metrics',
    '預測值計算': 'Predictive values',
    '概似比後機率': 'LR post-test prob.',
    '常態分布': 'Normal distribution',
    '反向常態': 'Inverse normal',
    '二項分布': 'Binomial distribution',
    '卜瓦松分布': 'Poisson distribution',

    // calculator field labels (common)
    '偵測差異 Δ': 'Detectable difference Δ',
    '標準差 σ': 'Std. dev. σ',
    'α 水準': 'α level',
    '檢定力 (1−β)': 'Power (1−β)',
    '樣本比 n₂/n₁': 'Ratio n₂/n₁',
    '每組所需樣本 n₁': 'Required n per group (n₁)',
    '雙尾': 'two-sided',

    // default / system account names
    '我的帳號': 'My Account',
    '匯入的帳號': 'Imported account',

    // calculator descriptions (eyebrow subs)
    '常用於 RCT 連續結果': 'Common in RCT continuous outcomes',
    '療效有效率比較': 'Compare response rates',
    '與已知母體值比較': 'vs a known population value',
    '與已知母體比例比較': 'vs a known population proportion',
    '檢定 H₀: r = 0': 'Test H₀: r = 0',
    'Cox 模型所需事件': 'Events needed for Cox',
    '單尾 α 與邊界 Δ': 'One-sided α & margin Δ',
    '比較平均與已知值': 'Mean vs a known value',
    '前後測 / 配對': 'Pre/post · paired',
    '不等變異也適用': 'Handles unequal variance',
    '類別資料關聯': 'Categorical association',
    '大樣本近似': 'Large-sample approximation',
    '三組以上平均比較': 'Compare 3+ group means',
    '相關係數顯著性': 'Correlation significance',
    '可選信賴水準': 'Adjustable confidence level',
    '勝算比附信賴區間': 'Odds ratio with CI',
    '相對風險 + NNT': 'Relative risk + NNT',
    '兩組平均效應量': 'Two-group mean effect',
    '兩組比例效應量': 'Two-group proportion effect',
    'log-odds 跨研究合併': 'Pool log-odds across studies',
    'Sens/Spec/PPV/NPV/LR': 'Sens/Spec/PPV/NPV/LR',
    '依盛行率與檢驗特性': 'By prevalence & test traits',
    '從 LR 更新機率': 'Update probability from LR',
    '邏輯迴歸': 'Logistic regression',
    'Cox 比例風險': 'Cox proportional hazards',
    'log-odds 轉機率': 'log-odds → probability',
    'P(X ≤ x) 與分位數': 'P(X ≤ x) & quantiles',
    '從機率得 z': 'Probability → z',
    '兩評者類別一致': 'Two-rater categorical',
    '連續測量一致性': 'Continuous agreement',
    '保守的 FWER 控制': 'Conservative FWER control',

    // cheat-sheet card titles
    '樣本平均': 'Sample mean',
    '樣本標準差': 'Sample SD',
    '標準誤': 'Standard error',
    '95% 信賴區間': '95% CI',
    '常態分布 PDF': 'Normal PDF',
    't 統計量': 't statistic',
    '雙樣本 t（合併變異）': 'Two-sample t (pooled)',
    '卡方檢定': 'Chi-square test',
    'OR（勝算比）': 'OR (odds ratio)',
    'RR（相對風險）': 'RR (relative risk)',
    '敏感度 / 特異度': 'Sensitivity / Specificity',
    '樣本數（兩組平均）': 'Sample size (two means)',
    'Bonferroni 調整': 'Bonferroni correction',
    'I² 異質性': 'I² heterogeneity',
    'Pearson 相關': 'Pearson correlation',
    '貝氏定理': 'Bayes theorem',

    // concept lab parameter labels
    'μ (平均)': 'μ (mean)',
    'σ (標準差)': 'σ (SD)',
    '下界 a': 'Lower bound a',
    '上界 b': 'Upper bound b',
    'n (試驗數)': 'n (trials)',
    'p (成功率)': 'p (success)',
    'λ (速率)': 'λ (rate)',
    'μ 平均': 'μ mean',
    'σ 標準差': 'σ SD',
    '下界 a ': 'Lower a ',
    '上界 b ': 'Upper b ',

    // case study evidence labels
    '主要療效 HR': 'Primary efficacy HR',
    '非劣性邊界 (預設)': 'Non-inferiority margin (preset)',
    '大出血 HR': 'Major bleeding HR',
    '所需治療人數 NNT': 'NNT',
    '分析方式': 'Analysis',
    'step 3 / 5': 'step 3 / 5',
    'link': 'link',

    // misc subs / labels
    '常用於 RCT 連續結果 連續結果': 'Common in RCT continuous outcomes'
  };

  // Regex rules for interpolated strings (applied to whole trimmed text-node value).
  // Each: { re, en(m) }
  const RULES = [
    { re: /^早安，(.+)！$/, en: m => `Good morning, ${m[1]}!` },
    { re: /^午安，(.+)！$/, en: m => `Good afternoon, ${m[1]}!` },
    { re: /^晚安，(.+)！$/, en: m => `Good evening, ${m[1]}!` },
    { re: /^早安，(.+)$/, en: m => `Good morning, ${m[1]}` },
    { re: /^午安，(.+)$/, en: m => `Good afternoon, ${m[1]}` },
    { re: /^晚安，(.+)$/, en: m => `Good evening, ${m[1]}` },
    { re: /^(\d+) 月 (\d+) 日$/, en: m => `${monthName(+m[1])} ${m[2]}` },
    { re: /^Library · (\d+) topics$/, en: m => `Library · ${m[1]} topics` },
    { re: /^題 (\d+) \/ (\d+)$/, en: m => `Q ${m[1]} / ${m[2]}` },
    { re: /^(\d+) \/ (\d+) · (\d+)\/(\d+) 正確$/, en: m => `${m[1]} / ${m[2]} · ${m[3]}/${m[4]} correct` },
    { re: /^(\d+) \/ (\d+)$/, en: m => `${m[1]} / ${m[2]}` },
    { re: /^全部 (\d+)$/, en: m => `All ${m[1]}` },
    { re: /^最近 · (\d+)$/, en: m => `Recent · ${m[1]}` },
    { re: /^最近 (\d+) 次$/, en: m => `Last ${m[1]}` },
    { re: /^(\d+) 次$/, en: m => `${m[1]}×` },
    { re: /^第 (\d+) 課$/, en: m => `Lesson ${m[1]}` },
    { re: /^(\d+) 課剩餘$/, en: m => `${m[1]} lessons left` },
    { re: /^(\d+) 課$/, en: m => `${m[1]} lessons` },
    { re: /^(\d+) 個區塊$/, en: m => `${m[1]} blocks` },
    { re: /^(\d+) 個$/, en: m => `${m[1]}` },
    { re: /^(\d+) 題庫存$/, en: m => `${m[1]} in bank` },
    { re: /^(\d+) 題$/, en: m => `${m[1]} Qs` },
    { re: /^(\d+) 個帳號$/, en: m => `${m[1]} accounts` },
    { re: /^(\d+) 次練習 · (\d+) 題 · 正確率 (\d+)%$/, en: m => `${m[1]} sessions · ${m[2]} Qs · ${m[3]}% accuracy` },
    { re: /^(\d+) 次練習 · 正確率 (\d+)%$/, en: m => `${m[1]} sessions · ${m[2]}% accuracy` },
    { re: /^(\d+) 次練習$/, en: m => `${m[1]} sessions` },
    { re: /^切換帳號 · (\d+) 個$/, en: m => `Switch account · ${m[1]}` },
    { re: /^(\d+) lessons · (\d+) min$/, en: m => `${m[1]} lessons · ${m[2]} min` },
    { re: /^全部 (\d+)$/, en: m => `All ${m[1]}` },
    { re: /^已匯入為新帳號「(.+)」$/, en: m => `Imported as new account "${m[1]}"` },
    { re: /^共 (\d+) 個檢定。前 (\d+) 小的 p 值通過 BH 門檻。$/, en: m => `${m[1]} tests total. The ${m[2]} smallest p-values pass the BH threshold.` },
    // hero composite: "描述統計 · 82% 完成"  → translate topic via DICT
    { re: /^(.+?) · (\d+)% 完成$/, en: m => `${DICT[m[1]] || m[1]} · ${m[2]}% complete` },
    // cheat sheet subtitle: "23 張高密度公式卡片，可關鍵字搜尋。"
    { re: /^(\d+) 張高密度公式卡片，可關鍵字搜尋。$/, en: m => `${m[1]} high-density formula cards — search by keyword.` },
    // topic detail subtitle: "Descriptive Statistics · 6 lessons · 25 min · 集中趨勢..."
    { re: /^(\d+) 課剩餘$/, en: m => `${m[1]} lessons left` }
  ];

  function monthName(n) {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][(n-1)%12];
  }

  function translateString(raw) {
    if (DICT[raw] !== undefined) return DICT[raw];   // exact incl. whitespace
    const t = raw.trim();
    if (!t) return null;
    if (DICT[t] !== undefined) return raw.replace(t, DICT[t]);
    for (const r of RULES) {
      const m = t.match(r.re);
      if (m) return raw.replace(t, r.en(m));
    }
    return null;
  }

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'svg'].map(s => s.toUpperCase()));

  function walk(node, fn) {
    if (node.nodeType === 3) { fn(node); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName ? node.tagName.toUpperCase() : '';
    if (SKIP_TAGS.has(tag)) return;
    // attributes (placeholder, title)
    if (node.nodeType === 1) fnAttr(node);
    for (let c = node.firstChild; c; c = c.nextSibling) walk(c, fn);
  }

  function fnAttr(el) {
    ['placeholder', 'title'].forEach(attr => {
      if (!el.hasAttribute || !el.hasAttribute(attr)) return;
      const cur = el.getAttribute(attr);
      if (el['__zh_' + attr] === undefined) el['__zh_' + attr] = cur;
      if (lang === 'en') {
        const tr = translateString(el['__zh_' + attr]);
        if (tr !== null) el.setAttribute(attr, tr);
      } else {
        if (el['__zh_' + attr] !== undefined) el.setAttribute(attr, el['__zh_' + attr]);
      }
    });
  }

  function handleTextNode(node) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    if (node.__zh === undefined) node.__zh = raw;
    if (lang === 'en') {
      const tr = translateString(node.__zh);
      if (tr !== null && node.nodeValue !== tr) node.nodeValue = tr;
    } else {
      if (node.__zh !== undefined && node.nodeValue !== node.__zh) node.nodeValue = node.__zh;
    }
  }

  let lang = 'zh';
  let observer = null;
  let pending = false;

  function apply() {
    if (!document.body) return;
    walk(document.body, handleTextNode);
  }
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; apply(); }, 0);
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(() => schedule());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function stopObserver() {
    if (observer) { observer.disconnect(); observer = null; }
  }

  const subs = [];

  function setLang(l) {
    lang = (l === 'en') ? 'en' : 'zh';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
    apply();                       // translate (en) or restore (zh)
    if (lang === 'en') startObserver();
    else stopObserver();           // no overhead in default Chinese mode
    subs.forEach(fn => { try { fn(lang); } catch (e) {} });
  }
  function getLang() { return lang; }
  function toggle() { setLang(lang === 'en' ? 'zh' : 'en'); }
  function subscribe(fn) { subs.push(fn); return () => { const i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); }; }

  function init() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en') lang = 'en';
    } catch (e) {}
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
    const boot = () => { if (lang === 'en') { startObserver(); apply(); } };
    if (document.body) boot();
    else document.addEventListener('DOMContentLoaded', boot);
  }

  window.I18N = {
    DICT, RULES, setLang, getLang, toggle, subscribe, apply,
    // helper for components that want explicit bilingual values
    t: (zh, en) => (lang === 'en' && en !== undefined) ? en : zh,
    init
  };

  init();
})();
