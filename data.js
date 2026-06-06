// 生物統計 App - 內容資料
window.AppData = {
  topics: [
    {
      id: 'desc',
      no: '01',
      zh: '描述統計',
      en: 'Descriptive Statistics',
      tag: '基礎',
      tagColor: 'mint',
      progress: 0.82,
      time: 25,
      lessons: 6,
      difficulty: 1,
      blurb: '集中趨勢、離散程度、分布形狀',
      keywords: ['mean', 'median', 'SD', 'IQR', 'skewness']
    },
    {
      id: 'prob',
      no: '02',
      zh: '機率分布',
      en: 'Probability Distributions',
      tag: '基礎',
      tagColor: 'mint',
      progress: 0.65,
      time: 40,
      lessons: 8,
      difficulty: 2,
      blurb: '常態、二項、卜瓦松、t、χ²、F 分布',
      keywords: ['Normal', 'Binomial', 'Poisson', 't', 'F']
    },
    {
      id: 'ci',
      no: '03',
      zh: '信賴區間與 p-value',
      en: 'CI & p-values',
      tag: '推論',
      tagColor: 'sky',
      progress: 0.45,
      time: 35,
      lessons: 7,
      difficulty: 2,
      blurb: '從抽樣到顯著性的完整推論鏈',
      keywords: ['95% CI', 'p-value', 'SE', 'Type I/II']
    },
    {
      id: 'ht',
      no: '04',
      zh: '假設檢定',
      en: 'Hypothesis Testing',
      tag: '推論',
      tagColor: 'sky',
      progress: 0.30,
      time: 50,
      lessons: 10,
      difficulty: 2,
      blurb: 't-test、χ²、ANOVA、無母數方法',
      keywords: ['t-test', 'χ²', 'ANOVA', 'Wilcoxon']
    },
    {
      id: 'reg',
      no: '05',
      zh: '迴歸分析',
      en: 'Regression',
      tag: '建模',
      tagColor: 'amber',
      progress: 0.18,
      time: 60,
      lessons: 12,
      difficulty: 3,
      blurb: '線性、邏輯、多變量、混合模型',
      keywords: ['Linear', 'Logistic', 'OR', 'AIC']
    },
    {
      id: 'surv',
      no: '06',
      zh: '存活分析',
      en: 'Survival Analysis',
      tag: '進階',
      tagColor: 'rose',
      progress: 0.05,
      time: 55,
      lessons: 9,
      difficulty: 3,
      blurb: 'Kaplan-Meier、log-rank、Cox 比例風險',
      keywords: ['KM', 'HR', 'log-rank', 'Cox PH']
    },
    {
      id: 'diag',
      no: '07',
      zh: '診斷檢定',
      en: 'Diagnostic Tests',
      tag: '臨床',
      tagColor: 'violet',
      progress: 0.55,
      time: 30,
      lessons: 6,
      difficulty: 2,
      blurb: '敏感度、特異度、PPV、NPV、ROC',
      keywords: ['Sens', 'Spec', 'PPV', 'AUC']
    },
    {
      id: 'trial',
      no: '08',
      zh: '臨床試驗設計',
      en: 'Clinical Trial Design',
      tag: '臨床',
      tagColor: 'violet',
      progress: 0.12,
      time: 45,
      lessons: 8,
      difficulty: 3,
      blurb: 'RCT、隨機化、盲性、interim 分析',
      keywords: ['RCT', 'Blinding', 'ITT', 'Phase I-IV']
    },
    {
      id: 'ss',
      no: '09',
      zh: '樣本數計算',
      en: 'Sample Size',
      tag: '臨床',
      tagColor: 'violet',
      progress: 0.0,
      time: 25,
      lessons: 5,
      difficulty: 2,
      blurb: '依檢定力、效應量推算所需樣本',
      keywords: ['Power', 'Effect size', 'α', 'β']
    },
    {
      id: 'np',
      no: '10',
      zh: '無母數檢定',
      en: 'Nonparametric Tests',
      tag: '推論',
      tagColor: 'sky',
      progress: 0.22,
      time: 40,
      lessons: 7,
      difficulty: 2,
      blurb: '當分布假設違反時的替代方法',
      keywords: ['Wilcoxon', 'Mann-Whitney', 'Kruskal-Wallis', 'Sign']
    },
    {
      id: 'corr',
      no: '11',
      zh: '相關與一致性',
      en: 'Correlation & Agreement',
      tag: '建模',
      tagColor: 'amber',
      progress: 0.40,
      time: 30,
      lessons: 6,
      difficulty: 2,
      blurb: 'Pearson、Spearman、Kappa、ICC、Bland-Altman',
      keywords: ['r', 'ρ', 'κ', 'ICC', 'B-A']
    },
    {
      id: 'epi',
      no: '12',
      zh: '流行病學測量',
      en: 'Epidemiologic Measures',
      tag: '臨床',
      tagColor: 'violet',
      progress: 0.0,
      time: 35,
      lessons: 7,
      difficulty: 2,
      blurb: '發生率、盛行率、相對危險、可歸因危險、NNT',
      keywords: ['Incidence', 'Prevalence', 'RR', 'AR', 'NNT']
    },
    {
      id: 'meta',
      no: '13',
      zh: '統合分析',
      en: 'Meta-analysis',
      tag: '進階',
      tagColor: 'rose',
      progress: 0.0,
      time: 50,
      lessons: 8,
      difficulty: 3,
      blurb: '森林圖、異質性、固定 vs 隨機效應、發表偏誤',
      keywords: ['Forest', 'I²', 'τ²', 'Funnel', 'Egger']
    },
    {
      id: 'mc',
      no: '14',
      zh: '多重比較',
      en: 'Multiple Comparisons',
      tag: '推論',
      tagColor: 'sky',
      progress: 0.12,
      time: 25,
      lessons: 5,
      difficulty: 2,
      blurb: '當你做了很多檢定時：Bonferroni、Holm、FDR',
      keywords: ['Bonferroni', 'Holm', 'FDR', 'Tukey', 'FWER']
    },
    {
      id: 'mixed',
      no: '15',
      zh: '縱貫與混合模型',
      en: 'Longitudinal & Mixed Models',
      tag: '建模',
      tagColor: 'amber',
      progress: 0.0,
      time: 60,
      lessons: 10,
      difficulty: 3,
      blurb: '重複測量、隨機效應、GEE、時間相關性',
      keywords: ['LMM', 'GEE', 'AR(1)', 'Random intercept']
    },
    {
      id: 'causal',
      no: '16',
      zh: '因果推論',
      en: 'Causal Inference',
      tag: '進階',
      tagColor: 'rose',
      progress: 0.0,
      time: 55,
      lessons: 9,
      difficulty: 3,
      blurb: '觀察性研究中估計因果：PSM、IPTW、DAG',
      keywords: ['DAG', 'PSM', 'IPTW', 'Confounder', 'Collider']
    },
    {
      id: 'bayes',
      no: '17',
      zh: '貝氏統計入門',
      en: 'Bayesian Inference',
      tag: '進階',
      tagColor: 'rose',
      progress: 0.0,
      time: 45,
      lessons: 8,
      difficulty: 3,
      blurb: '先驗 + 似然 = 後驗。貝氏因子與可信區間',
      keywords: ['Prior', 'Posterior', 'BF', 'Credible interval']
    },
    {
      id: 'miss',
      no: '18',
      zh: '缺失值處理',
      en: 'Missing Data',
      tag: '建模',
      tagColor: 'amber',
      progress: 0.0,
      time: 30,
      lessons: 6,
      difficulty: 2,
      blurb: 'MCAR / MAR / MNAR 機制與多重插補',
      keywords: ['MCAR', 'MAR', 'MNAR', 'MI', 'LOCF']
    }
  ],

  // 速查卡片
  cards: [
    { title: '樣本平均', formula: 'x̄ = (1/n) Σxᵢ', note: '對極端值敏感，偏態時改用中位數' },
    { title: '樣本標準差', formula: 's = √[ Σ(xᵢ − x̄)² / (n−1) ]', note: 'n−1 為自由度修正（Bessel）' },
    { title: '標準誤', formula: 'SE = s / √n', note: '描述「樣本平均」的不確定性' },
    { title: '95% 信賴區間', formula: 'x̄ ± 1.96 · SE', note: '大樣本近似；小樣本用 t 分布臨界值' },
    { title: '常態分布 PDF', formula: 'f(x) = 1/(σ√2π) · exp(−(x−μ)²/2σ²)', note: 'μ 為位置，σ 為尺度' },
    { title: 't 統計量', formula: 't = (x̄ − μ₀) / (s/√n)', note: '自由度 df = n − 1' },
    { title: '雙樣本 t（合併變異）', formula: 't = (x̄₁ − x̄₂) / sp√(1/n₁+1/n₂)', note: '前提：等變異與常態' },
    { title: '卡方檢定', formula: 'χ² = Σ (O − E)² / E', note: '期望次數 < 5 改用 Fisher 精確檢定' },
    { title: 'OR（勝算比）', formula: 'OR = (a·d) / (b·c)', note: '2×2 表；罕見事件時近似 RR' },
    { title: 'RR（相對風險）', formula: 'RR = (a/(a+b)) / (c/(c+d))', note: '世代研究最常用' },
    { title: '敏感度 / 特異度', formula: 'Sens = TP/(TP+FN)   Spec = TN/(TN+FP)', note: '與盛行率無關' },
    { title: 'PPV / NPV', formula: 'PPV = TP/(TP+FP)   NPV = TN/(TN+FN)', note: '受盛行率影響' },
    { title: 'Cox 比例風險', formula: 'h(t|x) = h₀(t) · exp(βᵀx)', note: 'HR = exp(β)，假設風險比恆定' },
    { title: '樣本數（兩組平均）', formula: 'n/組 = 2(z₁₋α/₂ + z₁₋β)² σ² / Δ²', note: 'Δ 為要偵測的最小差異' },
    { title: 'Cohen\'s d', formula: 'd = (x̄₁ − x̄₂) / sp', note: '效應量；0.2 小、0.5 中、0.8 大' },
    { title: 'Bonferroni 調整', formula: 'α* = α / m', note: 'm 為比較數；保守，FWER ≤ α' },
    { title: 'Benjamini-Hochberg (FDR)', formula: 'p(i) ≤ (i/m) · q', note: '排序後逐項比較；高通量資料常用' },
    { title: 'I² 異質性', formula: 'I² = (Q − df) / Q × 100%', note: '< 25% 低、50% 中、> 75% 高異質性' },
    { title: 'NNT', formula: 'NNT = 1 / ARR', note: 'ARR = 對照事件率 − 治療事件率' },
    { title: 'Pearson 相關', formula: 'r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)²·Σ(y−ȳ)²]', note: '量化線性關聯；-1 ≤ r ≤ 1' },
    { title: 'Cohen\'s κ', formula: 'κ = (Po − Pe) / (1 − Pe)', note: '< 0.4 差、0.4-0.75 中、> 0.75 佳' },
    { title: '貝氏定理', formula: 'P(H|D) = P(D|H) · P(H) / P(D)', note: '後驗 ∝ 似然 × 先驗' }
  ],

  // 測驗題庫（多選一）
  quiz: [
    {
      stem: '一個新型快篩用於 COVID-19。已知盛行率 2%，敏感度 95%，特異度 98%。請問**陽性預測值（PPV）**最接近何者？',
      choices: ['98%', '95%', '49%', '2%'],
      correct: 2,
      topic: 'diag',
      explain: '用 1,000 人代入：真陽性 ≈ 1000·0.02·0.95 = 19；偽陽性 ≈ 1000·0.98·0.02 = 19.6。PPV = 19 / (19 + 19.6) ≈ 49%。盛行率低時 PPV 會明顯下降。'
    },
    {
      stem: '某 RCT 比較兩種降壓藥的收縮壓變化，p = 0.04，平均差 1.2 mmHg，95% CI: (0.1, 2.3)。**最合理的詮釋**為？',
      choices: [
        '差異具統計顯著且具臨床意義',
        '差異具統計顯著但臨床意義有限',
        '結果不顯著，兩藥效果相同',
        '樣本太小，無法下結論'
      ],
      correct: 1,
      topic: 'ht',
      explain: '統計顯著（p<0.05）≠ 臨床顯著。1.2 mmHg 落在臨床有意義差異（通常 ≥ 5 mmHg）之下，大樣本容易讓微小差異變得顯著。'
    },
    {
      stem: '在 Kaplan-Meier 曲線中出現的「+」記號代表？',
      choices: ['事件發生', '組別交叉', '設限資料（censored）', '中位存活時間'],
      correct: 2,
      topic: 'surv',
      explain: '「+」標記 censored（設限）受試者：失訪或追蹤結束時尚未發生事件。該時間點不會讓存活率階梯下降，但會從風險集合中移除。'
    },
    {
      stem: '一個檢定的 p-value = 0.03，下列**錯誤**的詮釋是？',
      choices: [
        '若 H₀ 為真，觀察到此或更極端結果的機率為 3%',
        'H₀ 為真的機率是 3%',
        '在 α = 0.05 下會拒絕 H₀',
        '單一研究結果不應作為決策唯一依據'
      ],
      correct: 1,
      topic: 'ci',
      explain: 'p-value 是「假設 H₀ 為真時」資料極端度的機率，不是 H₀ 本身為真的機率（那需要貝氏框架）。'
    },
    {
      stem: '邏輯迴歸中，某變數 β = 0.693。對應的勝算比（OR）約為？',
      choices: ['0.5', '1.0', '2.0', '6.9'],
      correct: 2,
      topic: 'reg',
      explain: 'OR = exp(β) = exp(0.693) ≈ 2.0。即該變數每增加 1 單位，事件勝算約變成原本的 2 倍。'
    },
    {
      stem: '欲偵測兩組平均差 Δ = 5、σ = 10、α = 0.05、power = 0.8，每組約需多少樣本？',
      choices: ['約 16', '約 32', '約 64', '約 128'],
      correct: 2,
      topic: 'ss',
      explain: 'n/組 ≈ 2(1.96 + 0.84)² · 10² / 5² ≈ 2 · 7.84 · 100 / 25 ≈ 63 → 取 64。'
    },
    {
      stem: '一項統合分析的 **I² = 78%**，下列詮釋何者最合理？',
      choices: [
        '異質性低，固定效應模型適合',
        '異質性高，應考慮隨機效應或次群組分析',
        'I² 與發表偏誤直接相關',
        '結果不可信，須放棄'
      ],
      correct: 1,
      topic: 'meta',
      explain: 'I² > 75% 屬高異質性。應使用隨機效應模型，並進一步探索異質性來源（次群組、meta-regression）。'
    },
    {
      stem: '研究者做了 20 個獨立檢定，α = 0.05。預期至少出現一個偽陽性的機率約為？',
      choices: ['5%', '20%', '36%', '64%'],
      correct: 3,
      topic: 'mc',
      explain: '1 − (1 − 0.05)²⁰ ≈ 1 − 0.358 ≈ 64%。這就是為何多重檢定需要校正（Bonferroni、FDR）。'
    },
    {
      stem: '欲比較兩組偏態嚴重的住院天數，n₁ = 25, n₂ = 30。**最合適的檢定**為？',
      choices: ['雙樣本 t 檢定', 'Mann-Whitney U 檢定', '配對 t 檢定', 'ANOVA'],
      correct: 1,
      topic: 'np',
      explain: '小樣本且分布偏態 → 用無母數的 Mann-Whitney U（比較兩獨立組的中位數位置）。'
    }
  ],

  // 學習計畫
  agenda: [
    { time: '今天', title: '常態分布互動', topic: 'prob', dur: '15 分', done: true },
    { time: '今天', title: 'p-value 觀念釐清', topic: 'ci', dur: '10 分', done: true },
    { time: '今天', title: '雙樣本 t 練習 ×5', topic: 'ht', dur: '20 分', done: false },
    { time: '明天', title: 'ROC 曲線與 AUC', topic: 'diag', dur: '25 分', done: false },
    { time: '明天', title: 'Kaplan-Meier 入門', topic: 'surv', dur: '30 分', done: false }
  ],

  // 活動紀錄
  activity: [
    { day: '一', mins: 22 }, { day: '二', mins: 35 }, { day: '三', mins: 18 },
    { day: '四', mins: 40 }, { day: '五', mins: 28 }, { day: '六', mins: 55 }, { day: '日', mins: 12 }
  ]
};
