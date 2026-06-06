// lessons.js — deep, accessible biostat lesson content
// Block types: p, h, intuition, formula, example, warn, key, compare, chart, list, quote
window.Lessons = {

// ════════════════════════════════════════════════════════
desc: [
  {
    title: '為什麼平均數會騙人？',
    minutes: 4,
    blocks: [
      { type: 'p', content: '想像你和九位朋友吃飯。每人月薪約 5 萬，但同桌坐著一位月薪 500 萬的科技公司 CEO。十人「平均」月薪 54.5 萬 — 這個數字描述的是真實狀況嗎？' },
      { type: 'intuition', title: '直覺',
        content: '平均數是「重心」。把所有資料想成天平上的砝碼，平均數就是讓天平平衡的支點位置。但極端值像超重砝碼，會把支點拉到一邊。' },
      { type: 'h', content: '三個集中趨勢' },
      { type: 'compare', columns: [
        { head: '平均 (mean)',   body: '對稱分布最有效，對極端值敏感。' },
        { head: '中位 (median)', body: '排序後正中間值，抗極端值。' },
        { head: '眾數 (mode)',   body: '出現次數最多者，類別資料常用。' }
      ]},
      { type: 'formula', label: '樣本平均', tex: 'x̄ = (1/n) · Σ xᵢ' },
      { type: 'example', title: '臨床例：住院天數',
        content: '某 ICU 病人住院天數：3, 4, 5, 5, 6, 7, 8, 10, 12, 45。\n平均 = 10.5 天 · 中位 = 6.5 天 · 眾數 = 5 天。\n那位 45 天的長住病人把「平均」拉到了多數人之上。報告長期住院應使用中位。' },
      { type: 'warn', title: '常見誤用',
        content: '看見「平均」前先問：分布是對稱的嗎？有異常值嗎？單看平均而不看中位 + IQR，可能完全錯讀資料。' },
      { type: 'key', content: '對稱資料用平均；偏態資料用中位 + IQR。' },
      { type: 'interactive', name: 'OutlierDemo' }
    ]
  },
  {
    title: '離散程度：標準差到底是什麼？',
    minutes: 5,
    blocks: [
      { type: 'p', content: '兩家醫院某手術的存活時間都「平均 5 年」。但 A 院多數人 4.5–5.5 年；B 院有人 1 年也有人 10 年。同樣的中心，完全不同的不確定性 — 這就是離散程度要回答的問題。' },
      { type: 'h', content: '從平均偏離有多遠' },
      { type: 'p', content: '我們想量「每個資料點偏離平均的距離」。直接加總會互相抵消（正負相抵），所以平方後再加 — 這就是變異數的本質。' },
      { type: 'formula', label: '樣本變異數', tex: 's² = Σ(xᵢ − x̄)² / (n − 1)' },
      { type: 'formula', label: '樣本標準差', tex: 's = √s²' },
      { type: 'intuition', title: '為什麼是 n − 1？',
        content: '因為我們用樣本平均 x̄ 估計母體平均 μ，已經「用掉」一個自由度。除以 n 會系統性低估真實變異 — Bessel 修正讓估計不偏。' },
      { type: 'h', content: '常用的變異描述' },
      { type: 'list', items: [
        '**標準差 s**：與原資料同單位（mg/dL、年）。',
        '**變異係數 CV = s/x̄**：無單位，可跨組比較。',
        '**四分位距 IQR = Q₃ − Q₁**：抗極端值，搭配中位數使用。',
        '**全距 Range**：最大減最小，極端敏感。'
      ]},
      { type: 'example', title: '臨床例：血壓波動',
        content: '兩位患者收縮壓 7 天平均都 130，但 A 是 128–132（s = 1.5），B 是 110–150（s = 14）。同樣「達標」，B 的變異揭示了控制不穩 — 需要不同處置。' },
      { type: 'key', content: '只說平均不說變異，等於只描述中心不描述形狀。' }
    ]
  },
  {
    title: '分布形狀：偏態與峰度',
    minutes: 3,
    blocks: [
      { type: 'p', content: '當你畫出資料的直方圖，會看出三種典型形狀：對稱鐘形、右偏（尾巴往右）、左偏（尾巴往左）。' },
      { type: 'compare', columns: [
        { head: '右偏（正偏）', body: '少數極大值。例：所得、住院天數、生物標記。\nmean > median。' },
        { head: '左偏（負偏）', body: '少數極小值。例：考試 ceiling 效應、新生兒體重的早產極端。\nmean < median。' },
        { head: '對稱',           body: '例：身高、體溫、收縮壓。\nmean ≈ median。' }
      ]},
      { type: 'warn', title: '生物醫學變數常見偏態',
        content: '時間、計數、濃度、抗體效價 — 多為右偏。直接用 t 檢定可能違反假設，常見處理：log 轉換、無母數方法，或自助法（bootstrap）。' },
      { type: 'key', content: '看資料先畫圖：直方圖 + 箱型圖比任何 summary 都多揭露兩倍。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
prob: [
  {
    title: '常態分布為什麼如此重要？',
    minutes: 6,
    blocks: [
      { type: 'p', content: '常態分布（Normal / Gaussian）是統計學裡最常見、也最有用的分布。它不是因為「所有資料都是常態」而重要 — 而是因為「樣本平均」幾乎總會變成常態。' },
      { type: 'intuition', title: '中央極限定理',
        content: '無論原始資料的分布長什麼樣（偏態、雙峰、奇怪），只要樣本夠大，許多獨立樣本的「平均」分布會趨近常態。這就是 t-test、CI、迴歸推論能用的核心理由。' },
      { type: 'formula', label: '常態 PDF', tex: 'f(x) = 1/(σ√2π) · exp(−(x−μ)²/2σ²)' },
      { type: 'h', content: '68 – 95 – 99.7 法則' },
      { type: 'list', items: [
        '約 **68%** 落在 μ ± 1σ',
        '約 **95%** 落在 μ ± 2σ（精確值 1.96σ）',
        '約 **99.7%** 落在 μ ± 3σ'
      ]},
      { type: 'example', title: '臨床例：成人 IQ',
        content: 'IQ 設計為 N(100, 15²)。問：IQ > 130 的比例約多少？\n130 = 100 + 2σ → 上尾 ≈ 2.5%。\n這就是「資優」門檻的設計來源。' },
      { type: 'chart', name: 'NormalPlot', params: { mu: 0, sigma: 1, lo: -1.96, hi: 1.96 } },
      { type: 'key', content: '常態之所以好用，是因為它描述「樣本平均」的行為，不是「個別觀察值」。' },
      { type: 'interactive', name: 'CLTSim' }
    ]
  },
  {
    title: '二項分布：N 次嘗試成功幾次？',
    minutes: 5,
    blocks: [
      { type: 'p', content: '臨床上很多「是 / 否」問題：n 名病人中，有多少人有效？這就是二項分布要回答的。' },
      { type: 'formula', label: '二項機率', tex: 'P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ' },
      { type: 'list', items: [
        '**n**：獨立試驗次數',
        '**p**：每次成功的機率（固定）',
        '**k**：實際成功次數'
      ]},
      { type: 'h', content: '使用前提（容易違反）' },
      { type: 'list', items: [
        '每次試驗**獨立**（一位病人有效不影響下一位）',
        '成功率 p **固定**（不能隨時間改變）',
        '結果只有兩類'
      ]},
      { type: 'example', title: '臨床例：療效',
        content: '某藥已知對 60% 患者有效。隨機選 10 人，問恰有 7 人有效的機率？\nP(X=7) = C(10,7) · 0.6⁷ · 0.4³ ≈ 21.5%' },
      { type: 'warn', title: '注意',
        content: '當 n 大且 p 不極端（np > 5 且 n(1−p) > 5），二項可由常態近似：N(np, np(1−p))。這就是為何兩組比例比較常用 z 檢定。' },
      { type: 'chart', name: 'BinomialPlot', params: { n: 20, p: 0.4 } }
    ]
  },
  {
    title: '卜瓦松分布：罕見事件的計數',
    minutes: 4,
    blocks: [
      { type: 'p', content: '一個下午急診來幾位心肌梗塞？一千人年發生多少例新癌症？這些「單位時間／空間內，罕見獨立事件的次數」由卜瓦松分布描述。' },
      { type: 'formula', label: '卜瓦松機率', tex: 'P(X = k) = e^(−λ) · λᵏ / k!' },
      { type: 'p', content: '只需要一個參數 λ（lambda）= 期望事件數。最神奇的性質：平均 = 變異數 = λ。' },
      { type: 'example', title: '流病例：發生率',
        content: '某地年新發肺癌 = 60 例 / 10 萬人年。問該地 10 萬人中明年 ≤ 45 例的機率？\n用 λ = 60，計算 P(X ≤ 45) ≈ 2.5%。明顯低於預期。' },
      { type: 'intuition', title: '與二項的關係',
        content: '當 n 很大、p 很小、np = λ 中等時，二項 → 卜瓦松。也就是說：罕見事件 + 大樣本，用卜瓦松更簡潔。' },
      { type: 'chart', name: 'PoissonPlot', params: { lambda: 4 } },
      { type: 'key', content: '計數資料 + 罕見事件 = 卜瓦松。但若資料「過離散」(variance > mean)，改用負二項。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
ci: [
  {
    title: '一個數字的不確定性',
    minutes: 5,
    blocks: [
      { type: 'p', content: '研究報告血壓「平均下降 8.4 mmHg」。但這個 8.4 是從 200 個病人估計的 — 換一群 200 人，可能變 7.9 或 9.0。我們需要描述這個「估計值的不確定性」，而不只是給出單一數字。' },
      { type: 'intuition', title: '標準誤 vs 標準差',
        content: '**SD** 描述「個別觀察」的離散；**SE** 描述「樣本平均」這個估計量的不確定性。SE = SD/√n — 樣本越大，平均越穩定。' },
      { type: 'formula', label: '95% 信賴區間（大樣本）', tex: 'x̄ ± 1.96 · (s/√n)' },
      { type: 'h', content: '如何正確讀 95% CI' },
      { type: 'list', items: [
        '✓ 「若重複此研究多次，**95% 的區間會包含真值**」',
        '✗ 「真值有 95% 的機率落在這個區間內」(頻率學派下，真值是固定的，不是隨機的)',
        '✓ 區間越窄表示估計越精確'
      ]},
      { type: 'example', title: '解讀',
        content: '降壓藥：x̄ = 8.4 mmHg, 95% CI: (6.8, 10.0)。\n→ 「我們有把握下降在 6.8 至 10 之間，這個區間不包含 0，因此具統計顯著」' },
      { type: 'key', content: '一個 CI 同時告訴你「點估計」、「顯著性」與「精確度」— 比 p-value 訊息更豐富。' },
      { type: 'interactive', name: 'CISim' }
    ]
  },
  {
    title: 'p-value 的真實含義',
    minutes: 6,
    blocks: [
      { type: 'p', content: 'p-value 是統計學最常被誤解的概念。它不是「結果是偶然的機率」、也不是「H₀ 為真的機率」、更不是「效應大小」。' },
      { type: 'key', content: 'p-value =「假設 H₀ 為真，觀察到目前資料或更極端的機率」。' },
      { type: 'h', content: '什麼是「更極端」？' },
      { type: 'p', content: '如果我們看到 x̄ = 8.4 mmHg 的下降，H₀ 是「真實下降 = 0」。「更極端」是 8.4 以上、或對稱地 −8.4 以下（雙尾）。如果這種情況在 H₀ 之下只有 3% 的機率，p = 0.03。' },
      { type: 'compare', columns: [
        { head: 'p 小',   body: '資料與 H₀ 不相容 → 拒絕 H₀，但這不代表 H₀ 為真的機率小。' },
        { head: 'p 大',   body: '資料與 H₀ 相容 → **不能拒絕** H₀，但這不代表 H₀ 為真。' }
      ]},
      { type: 'warn', title: '常見錯誤',
        content: '「p = 0.06，所以沒有效應」 — 錯。p 跨越 0.05 不是「無 vs 有」的開關，臨界值是約定俗成的便利門檻，不是自然定律。' },
      { type: 'example', title: '小效應 + 大樣本',
        content: '10,000 名病人，平均收縮壓差 0.5 mmHg，p = 0.02。統計顯著，但 0.5 mmHg 沒有臨床意義。**統計顯著 ≠ 臨床顯著**。' },
      { type: 'h', content: '2016 ASA 聲明的六點原則' },
      { type: 'list', items: [
        'p 不衡量假設為真的機率',
        'p 不衡量效應大小',
        '商業／政策決策不應只靠 p < 0.05',
        '正確推論需要完整透明的報告',
        'p < 0.05 不等於重要 / 有用',
        'p 本身不足以提供證據'
      ]},
      { type: 'key', content: '永遠搭配 95% CI 與效應量報告 p-value — 三者一起看才完整。' }
    ]
  },
  {
    title: '第一型 vs 第二型錯誤',
    minutes: 4,
    blocks: [
      { type: 'p', content: '任何檢定都會犯錯。問題不是「會不會錯」，而是「會犯哪種錯，機率多大」。' },
      { type: 'compare', columns: [
        { head: '第一型錯誤 (α)',
          body: '**偽陽性**：H₀ 為真卻被拒絕。\n例：藥其實沒用，研究卻說有用。\n通常設 α = 0.05。' },
        { head: '第二型錯誤 (β)',
          body: '**偽陰性**：H₀ 為偽卻沒拒絕。\n例：藥其實有用，研究沒檢出。\n檢定力 = 1 − β，目標 ≥ 0.8。' }
      ]},
      { type: 'intuition', title: '為何 α 比 β 嚴格？',
        content: '臨床上把「無效藥當有效」的代價（病人吃了沒用且有副作用）通常比「有效藥當無效」（錯失機會）更難回頭，所以 α 守得緊。' },
      { type: 'key', content: '增加樣本數同時降低兩種錯誤；其他方法只能在兩者間取捨。' },
      { type: 'interactive', name: 'PowerViz' }
    ]
  }
],

// ════════════════════════════════════════════════════════
ht: [
  {
    title: '假設檢定的五個步驟',
    minutes: 5,
    blocks: [
      { type: 'p', content: '所有假設檢定都遵循相同骨架。一旦掌握骨架，t 檢定、卡方、ANOVA、Wilcoxon 都是它的變體。' },
      { type: 'list', items: [
        '**1. 設定假設**：H₀（無差異）vs H₁（有差異）',
        '**2. 選擇檢定**：依據變數型態、分布假設、組數',
        '**3. 計算統計量**：把資料壓成一個數字（t、χ²、F、Z…）',
        '**4. 對照分布**：在 H₀ 之下，這個統計量遵循什麼分布？',
        '**5. 決策**：p-value 或臨界值 → 拒絕 / 不拒絕 H₀'
      ]},
      { type: 'intuition', title: '統計量的本質',
        content: '統計量是「訊號 / 雜訊」比。t = 平均差 / 標準誤；F = 組間變異 / 組內變異。比值越大，越像「不只是運氣」。' },
      { type: 'key', content: 'p-value 來自統計量與其分布的位置 — 不是直接算出來的神秘數字。' }
    ]
  },
  {
    title: 't 檢定：何時用哪一種？',
    minutes: 6,
    blocks: [
      { type: 'h', content: '三種 t 檢定' },
      { type: 'compare', columns: [
        { head: '單樣本 t',  body: '比較**一組**平均與已知值。\n例：本院糖化血色素是否高於全國 7.0%？' },
        { head: '獨立 t',    body: '比較**兩獨立組**平均。\n例：新藥組 vs 對照組的血壓變化。' },
        { head: '配對 t',    body: '**同一群人**前後測。\n例：服藥前後 vs，組內配對' }
      ]},
      { type: 'formula', label: '雙樣本 t（合併變異）', tex: 't = (x̄₁ − x̄₂) / sp · √(1/n₁ + 1/n₂)' },
      { type: 'h', content: '使用前提' },
      { type: 'list', items: [
        '**常態性**：兩組各自常態（n > 30 時可放寬，CLT 救你）',
        '**等變異**：兩組變異相近（不確定就用 Welch t-test）',
        '**獨立性**：觀察值彼此獨立'
      ]},
      { type: 'warn', title: '配對 t 的陷阱',
        content: '若資料是配對（同人前後、雙胞胎、配對病例），用獨立 t 會浪費資訊且不正確。配對 t 用「差值」單樣本檢定，效力更高。' },
      { type: 'example', title: '臨床例：',
        content: '40 名病人服降壓藥 12 週，前後收縮壓：\nx̄_diff = −9.5 mmHg, s_diff = 12, n = 40\nt = −9.5 / (12/√40) = −5.0, p < 0.001\n→ 配對 t 顯示降壓效果顯著。' }
    ]
  },
  {
    title: '卡方檢定與 ANOVA',
    minutes: 5,
    blocks: [
      { type: 'h', content: '卡方檢定（χ²）— 類別資料的關聯' },
      { type: 'p', content: '兩個類別變數有沒有關聯？例：性別 vs 是否吸菸；治療組 vs 治癒。' },
      { type: 'formula', label: '卡方統計量', tex: 'χ² = Σ (O − E)² / E' },
      { type: 'p', content: 'O 為觀察次數，E 為「假設無關聯」下的期望次數 = (列總和 × 行總和) / 總數。' },
      { type: 'warn', title: '使用前提',
        content: '所有期望次數 ≥ 5。若 2×2 表格有任何期望 < 5 → 改用 Fisher 精確檢定。' },
      { type: 'h', content: 'ANOVA — 三組以上平均比較' },
      { type: 'p', content: '比較三組以上的平均，不能做多次 t-test（會膨脹 α）。ANOVA 一次性處理。' },
      { type: 'formula', label: 'F 統計量', tex: 'F = MS_between / MS_within' },
      { type: 'intuition', title: 'F 的直覺',
        content: 'F = 組間變異 / 組內變異。如果各組差異「比組內隨機波動還大」，F 會大 → 至少有兩組不同。' },
      { type: 'key', content: 'ANOVA 只告訴你「有差異」，要知道「哪組與哪組不同」需要 post-hoc（Tukey、Bonferroni）。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
reg: [
  {
    title: '線性迴歸的兩種讀法',
    minutes: 6,
    blocks: [
      { type: 'p', content: '線性迴歸是用一條直線描述 y 如何隨 x 變化。臨床上有兩種完全不同的使用目的：**預測**（不在乎係數，在乎準確）與**解釋**（在乎係數，量化因果）。' },
      { type: 'formula', label: '單變量線性迴歸', tex: 'y = β₀ + β₁ · x + ε' },
      { type: 'list', items: [
        '**β₀** 截距：x = 0 時的 y 值（未必有實際意義）',
        '**β₁** 斜率：x 增加 1 單位，y 平均變化的量',
        '**ε** 殘差：模型無法解釋的部分'
      ]},
      { type: 'example', title: '臨床例：',
        content: '體重每增 1 kg，收縮壓平均升 0.6 mmHg。β₁ = 0.6，95% CI: (0.4, 0.8)。\n→ 體重對血壓有「平均、線性、正向」的關係。但這不代表體重「導致」血壓上升。' },
      { type: 'h', content: '四大假設' },
      { type: 'list', items: [
        '**線性**：y 與 x 真的是線性關係',
        '**獨立**：每個觀察值彼此獨立',
        '**常態**：殘差 ε 大致常態（n 大可放寬）',
        '**等變異**：殘差變異不隨 x 改變（同質變異）'
      ]},
      { type: 'warn', title: '常見錯誤',
        content: '把 R² 高當作「模型好」。R² = 0.95 也可能完全錯（模型 misspecified）。一定要看殘差圖：殘差 vs 預測值應隨機散布，無規律。' },
      { type: 'chart', name: 'RegressionPlot', params: { slope: 0.6, intercept: 0.1, noise: 0.5 } }
    ]
  },
  {
    title: '多變量迴歸：控制混淆',
    minutes: 5,
    blocks: [
      { type: 'p', content: '我們關心年齡對血壓的影響，但抽菸也會影響血壓，且年齡與抽菸習慣相關。如果只看年齡 vs 血壓，年齡的效應會被「抽菸」的影響污染。多變量迴歸允許「控制」其他變數。' },
      { type: 'formula', label: '多變量線性迴歸', tex: 'y = β₀ + β₁x₁ + β₂x₂ + … + βₖxₖ + ε' },
      { type: 'intuition', title: 'β 的新解讀',
        content: '**「在其他變數固定時」**，xⱼ 每增加 1 單位，y 平均變化 βⱼ。這就是統計學家說的「條件效應」。' },
      { type: 'h', content: '常見陷阱' },
      { type: 'list', items: [
        '**過度配適 (overfit)**：變數太多 vs 樣本少',
        '**多重共線性**：兩個 x 高度相關 → β 不穩定',
        '**對撞變數 (collider)**：別把它放進模型，會引入偏誤',
        '**Simpson 悖論**：忽略分層變數會反轉結果'
      ]},
      { type: 'key', content: '迴歸不是統計萬靈丹。模型 specification（要放哪些變數）決定結果。' }
    ]
  },
  {
    title: '邏輯迴歸：二元結果',
    minutes: 6,
    blocks: [
      { type: 'p', content: '當結果是「有/沒有」（疾病、死亡、有效）時，y 不能用線性迴歸（會預測機率 > 1 或 < 0）。邏輯迴歸把機率經「logit 轉換」後再做線性。' },
      { type: 'formula', label: 'Logit 模型', tex: 'log[ p/(1−p) ] = β₀ + β₁x₁ + … + βₖxₖ' },
      { type: 'h', content: '勝算比（Odds Ratio）的魔法' },
      { type: 'p', content: '邏輯迴歸的 β 經指數轉換後就是勝算比：OR = exp(β)。這是它在臨床流行病學那麼受歡迎的關鍵。' },
      { type: 'list', items: [
        'OR = 1：無關聯',
        'OR > 1：暴露增加事件發生勝算',
        'OR < 1：暴露具保護效應',
        'OR 的 95% CI 不包含 1 → 顯著'
      ]},
      { type: 'example', title: '臨床例：',
        content: '吸菸對肺癌的 β = 1.0986，OR = exp(1.0986) ≈ 3.0。\n→ 控制其他變數後，吸菸者罹癌勝算約為不吸菸者的 3 倍。' },
      { type: 'warn', title: 'OR vs RR',
        content: '在罕見事件（事件率 < 10%）OR ≈ RR。但事件常見時，OR 會誇大效應 — 報告時要明確說明是 OR 不是 RR。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
surv: [
  {
    title: '存活分析為何特別？',
    minutes: 5,
    blocks: [
      { type: 'p', content: '癌症研究問：「化療能多延長壽命？」但研究結束時還有人活著、有人失聯、有人因車禍死亡。這些「沒看到事件」的資料叫**設限 (censored)** — 普通迴歸完全處理不了。' },
      { type: 'h', content: '兩個核心變數' },
      { type: 'list', items: [
        '**時間 T**：從進入研究到事件（或結束）的時間',
        '**事件 δ**：1 = 有事件，0 = 設限'
      ]},
      { type: 'intuition', title: '為什麼不能直接平均？',
        content: '若有 100 病人，60 死了（平均存活 18 個月），40 還活著（追蹤 36 個月還在）— 你不能說「平均 24 個月」。那 40 人的真正存活時間 ≥ 36 月，是不完整資訊。' },
      { type: 'key', content: '存活分析的本質：估計「在時間 t 之後仍存活的機率」S(t)，同時利用設限資料的部分訊息。' }
    ]
  },
  {
    title: 'Kaplan-Meier 曲線',
    minutes: 6,
    blocks: [
      { type: 'p', content: 'KM 曲線是估計存活函數 S(t) 的標準方法。它的核心想法很簡單：「能活到 t 月」= 連續每個月都活過。' },
      { type: 'formula', label: 'KM 存活估計', tex: 'Ŝ(t) = Π (1 − dᵢ/nᵢ)' },
      { type: 'p', content: 'dᵢ = 在 tᵢ 時刻死亡人數；nᵢ = 在 tᵢ 之前還在風險集合的人數。' },
      { type: 'h', content: '怎麼讀 KM 圖' },
      { type: 'list', items: [
        '**階梯下降**：每次事件發生（人死亡）就下降',
        '**「+」標記**：設限時刻（不下降，但離開風險集合）',
        '**中位存活**：曲線首次 ≤ 0.5 的時間點',
        '**曲線分離越早越大**：療效越強'
      ]},
      { type: 'chart', name: 'KMPlot', params: { hazardA: 0.04, hazardB: 0.07 } },
      { type: 'h', content: 'log-rank 檢定' },
      { type: 'p', content: '比較兩條 KM 曲線是否有統計差異。H₀：兩組存活分布相同。輸出 χ² 統計量與 p-value。' },
      { type: 'warn', title: '注意',
        content: 'log-rank 假設**比例風險**：兩組風險比恆定。若曲線交叉或先後追上，log-rank 會偏弱 — 改用 Wilcoxon 或限制平均存活時間。' }
    ]
  },
  {
    title: 'Cox 比例風險模型',
    minutes: 6,
    blocks: [
      { type: 'p', content: 'KM 比較組別存活，但無法調整其他變數（年齡、期別、併發症）。Cox 模型解決這個問題 — 它是「存活分析的迴歸」。' },
      { type: 'formula', label: 'Cox 比例風險模型', tex: 'h(t | x) = h₀(t) · exp(β₁x₁ + β₂x₂ + …)' },
      { type: 'list', items: [
        '**h₀(t)**：基準風險函數（不需假設形狀，這是 Cox 的優雅之處）',
        '**exp(β)**：風險比 (Hazard Ratio, HR)',
        '**HR = 2**：每瞬間事件風險為對照組的 2 倍'
      ]},
      { type: 'example', title: '臨床例：',
        content: '某抗癌藥研究：HR = 0.65, 95% CI: (0.50, 0.85), p = 0.001。\n→ 控制年齡與期別後，新藥組瞬時死亡風險為對照組的 65%（降低 35%）。' },
      { type: 'h', content: '比例風險假設' },
      { type: 'p', content: 'Cox 假設「HR 隨時間恆定」。如果違反（例如新藥前期保護強、後期效應消失），HR 就不再有單一意義。檢查方法：Schoenfeld 殘差、log-log 圖。' },
      { type: 'warn', title: '違反時怎麼辦',
        content: '使用時間相依係數、stratified Cox，或改用 AFT 模型（accelerated failure time）。' },
      { type: 'key', content: 'KM 看圖、log-rank 比較組別、Cox 調整混淆 — 三者組合是存活分析的標準工作流。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
diag: [
  {
    title: '敏感度與特異度：兩個獨立指標',
    minutes: 5,
    blocks: [
      { type: 'p', content: '一個診斷工具有兩種錯：把病人說沒病（漏診），把健康人說有病（誤診）。敏感度與特異度分別量化這兩種錯。' },
      { type: 'compare', columns: [
        { head: '敏感度 (Sens)', body: 'TP / (TP + FN)\n「真正有病者中，被檢出的比例」\n高敏感度 → 漏診少，適合篩檢' },
        { head: '特異度 (Spec)', body: 'TN / (TN + FP)\n「真正沒病者中，被排除的比例」\n高特異度 → 誤診少，適合確診' }
      ]},
      { type: 'h', content: '為何不能「一個指標走天下」？' },
      { type: 'p', content: '一個檢驗對「人人都說陽性」會有 100% 敏感度，但 0% 特異度，毫無用處。兩者必須一起看。' },
      { type: 'intuition', title: '關鍵性質',
        content: 'Sens 和 Spec **與盛行率無關**！同樣的檢驗，無論用在罕見病或常見病，敏感度都不變。這讓它們成為描述檢驗本質的指標。' },
      { type: 'key', content: 'Sens 高 → 篩檢；Spec 高 → 確診。SnNout (sens 高 + N 結果 → rule Out) / SpPin (spec 高 + P 結果 → rule In)。' }
    ]
  },
  {
    title: 'PPV、NPV 與盛行率陷阱',
    minutes: 6,
    blocks: [
      { type: 'p', content: '病人不會問你「敏感度多少」— 他會問：「我檢驗陽性，那我真的有病嗎？」這就是 PPV（陽性預測值）要回答的。' },
      { type: 'compare', columns: [
        { head: 'PPV', body: 'TP / (TP + FP)\n「檢驗陽性者中，真正有病的比例」\n受**盛行率**影響' },
        { head: 'NPV', body: 'TN / (TN + FN)\n「檢驗陰性者中，真正沒病的比例」\n同樣受盛行率影響' }
      ]},
      { type: 'example', title: '經典案例：低盛行率',
        content: '快篩 Sens = 95%, Spec = 98%, 盛行率 1%（100,000 人中 1,000 病例）。\n• TP = 950, FN = 50\n• FP = 99,000 × 0.02 = 1,980, TN = 97,020\n• **PPV = 950 / (950 + 1,980) ≈ 32%**\n→ 「陽性者中只有三分之一真的有病」 — 因為健康人太多，少量誤判就淹過真陽性。' },
      { type: 'warn', title: '盛行率提升 PPV',
        content: '同樣的檢驗，盛行率從 1% → 20%，PPV 從 32% → 92%。這就是為什麼篩檢策略要選「**正確的目標族群**」 — 對低風險族群亂篩會造成大量焦慮與後續檢查負擔。' },
      { type: 'key', content: '敏感度／特異度是檢驗的性質；PPV/NPV 是「在這個族群」的表現。報告必須同時提供盛行率。' },
      { type: 'interactive', name: 'PrevalencePPV' }
    ]
  },
  {
    title: 'ROC 曲線與 AUC',
    minutes: 5,
    blocks: [
      { type: 'p', content: '檢驗常輸出連續分數（例如腫瘤標記濃度），不是直接的陽性／陰性。我們需要選一個切點。ROC 曲線幫你看「所有可能切點的表現」。' },
      { type: 'h', content: '如何畫 ROC' },
      { type: 'list', items: [
        '**y 軸**：敏感度 (TPR)',
        '**x 軸**：1 − 特異度 (FPR)',
        '每個切點對應一個 (FPR, TPR) 點',
        '把所有切點連起來 → ROC 曲線'
      ]},
      { type: 'compare', columns: [
        { head: 'AUC = 0.5', body: '完全隨機，沒有區分能力' },
        { head: 'AUC = 0.7-0.8', body: '可接受' },
        { head: 'AUC = 0.8-0.9', body: '很好' },
        { head: 'AUC > 0.9', body: '優秀' },
        { head: 'AUC = 1.0', body: '完美區分（罕見，警惕資料外洩）' }
      ]},
      { type: 'chart', name: 'ROCPlot', params: { auc: 0.85 } },
      { type: 'h', content: '如何選切點' },
      { type: 'list', items: [
        '**Youden index**：max(Sens + Spec − 1) — 最大化「總正確」',
        '**距離左上角最近**：(0, 1) 是完美點',
        '**臨床導向**：篩檢偏 Sens、確診偏 Spec',
        '**成本敏感**：依漏診與誤診的代價權衡'
      ]},
      { type: 'key', content: 'AUC 描述整體區分力；切點選擇取決於臨床用途，不是統計上的「最佳」。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
trial: [
  {
    title: 'RCT 為何是金標準',
    minutes: 6,
    blocks: [
      { type: 'p', content: '想知道一個藥的真正療效，最大的敵人不是測量誤差，而是「**混淆變數**」— 那些同時影響「誰拿到藥」與「結果好不好」的東西。隨機分配讓兩組在所有已知和未知變數上「平均地相似」，是消除混淆最有力的工具。' },
      { type: 'h', content: 'RCT 的四大支柱' },
      { type: 'list', items: [
        '**隨機分配 (Randomization)**：消除選擇偏誤',
        '**盲性 (Blinding)**：消除測量與報告偏誤',
        '**對照組 (Control)**：明確比較基準',
        '**意向治療分析 (ITT)**：保留隨機性'
      ]},
      { type: 'h', content: '盲性層級' },
      { type: 'compare', columns: [
        { head: '單盲',  body: '受試者不知道自己拿什麼' },
        { head: '雙盲',  body: '受試者與研究者都不知道' },
        { head: '三盲',  body: '受試者、研究者、分析者都不知道' }
      ]},
      { type: 'warn', title: '為何 ITT？',
        content: '如果一個病人沒吃藥、沒回診，按「實際吃了什麼」分析會破壞隨機性 — 自我選擇的偏誤會回來。ITT 就是「按你**原本分配到哪組**」分析，無論後續發生什麼。' },
      { type: 'key', content: 'RCT 是因果推論的黃金標準，但它有外推限制：在嚴格條件下做的研究，套到真實世界要小心。' }
    ]
  },
  {
    title: '非劣性與等效性試驗',
    minutes: 5,
    blocks: [
      { type: 'p', content: '不是所有試驗都想證明「新藥更好」。有時新藥的賣點是「不比舊藥差，但更安全／便宜／方便」— 這要用非劣性試驗，需要不同的統計設計。' },
      { type: 'compare', columns: [
        { head: '優效性',
          body: 'H₀: 新 = 舊\nH₁: 新 ≠ 舊\n95% CI 不包含 0 → 顯著' },
        { head: '非劣性',
          body: 'H₀: 新 − 舊 ≤ −Δ（劣 Δ 以上）\nH₁: 新 − 舊 > −Δ\n95% CI 上限 < Δ → 非劣' },
        { head: '等效性',
          body: 'H₀: |新 − 舊| > Δ\nH₁: |新 − 舊| ≤ Δ\n雙邊邊界都在 ±Δ 內' }
      ]},
      { type: 'warn', title: '非劣性邊界 Δ 的選擇',
        content: 'Δ 是「臨床上可接受多差」。設得太大會把劣藥放行；設得太小需要超大樣本。應由臨床專家事先決定，不是看資料調整。' },
      { type: 'example', title: '臨床例：',
        content: '新型抗凝血劑：HR = 0.81, 95% CI: (0.65, 1.00)，預設非劣性邊界 1.46。\n→ 上界 1.00 < 1.46 → **非劣性達成**。且 HR < 1 暗示可能更好 → 進一步可宣稱優效。' },
      { type: 'key', content: '非劣性需要更大樣本和更嚴格的執行品質，因為「失敗」與「成功」之間的界線很窄。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
ss: [
  {
    title: '為什麼要計算樣本數',
    minutes: 5,
    blocks: [
      { type: 'p', content: '樣本數計算不是研究的瑣事 — 它是研究能否回答問題的關鍵。樣本太少：真效應檢不出（power 不足）；樣本太多：浪費資源，甚至讓無意義的微小差異變顯著。' },
      { type: 'h', content: '計算需要的四個輸入' },
      { type: 'list', items: [
        '**α**：第一型錯誤率（通常 0.05）',
        '**β**：第二型錯誤率（通常 0.2 → power = 0.8）',
        '**效應量 Δ**：你想偵測的最小臨床有意義差異',
        '**變異 σ²**：結果變數的離散程度（pilot 研究或文獻估計）'
      ]},
      { type: 'formula', label: '兩組平均比較', tex: 'n/組 = 2(z₁₋α/₂ + z₁₋β)² · σ² / Δ²' },
      { type: 'intuition', title: '為何 Δ 在分母平方？',
        content: '想偵測「一半大的效應」，需要「四倍」樣本。這也是為何「找小差異」如此燒錢 — 樣本需求對效應量極度敏感。' },
      { type: 'example', title: '臨床例：',
        content: '欲偵測收縮壓組間差 5 mmHg（σ = 10），α = 0.05, power = 0.8：\nn/組 = 2 · (1.96 + 0.84)² · 100 / 25 ≈ 63\n→ 每組需 63 人，加上預估 15% 流失 → 每組 74 人。' },
      { type: 'key', content: '預先做樣本數計算 = 對研究目的的自我審視。如果你不能說「我想偵測多少差異」，就還沒準備好做研究。' }
    ]
  },
  {
    title: '常見研究類型的樣本數',
    minutes: 4,
    blocks: [
      { type: 'h', content: '不同設計的公式略不同' },
      { type: 'compare', columns: [
        { head: '兩組比例', body: 'n/組 ≈ (z_α + z_β)² · [p₁(1−p₁) + p₂(1−p₂)] / (p₁ − p₂)²' },
        { head: '單樣本平均', body: 'n ≈ (z_α + z_β)² · σ² / Δ²' },
        { head: 'OR / RR', body: '依事件率與預期 OR，可用 Schlesselman 公式' },
        { head: '存活分析', body: '計算事件數而非樣本數，仰賴隨訪時間' }
      ]},
      { type: 'warn', title: '實用建議',
        content: '用統計軟體（PASS、G*Power、R 的 pwr 套件）代替手算。但你必須清楚輸入是什麼意思 — 否則得到的數字也是錯的。' },
      { type: 'key', content: '樣本數計算是「給定假設」的計算。改變假設（不同效應量、變異）會大幅改變需求 — 一定要報告所有輸入。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
epi: [
  {
    title: '發生率 vs 盛行率',
    minutes: 4,
    blocks: [
      { type: 'p', content: '「我們社區的糖尿病多嚴重？」這個問題可以從兩個角度回答 — 看「現在多少人有」（盛行率），或「每年多少新增」（發生率）。它們描述不同的疾病動力學。' },
      { type: 'compare', columns: [
        { head: '盛行率 (Prevalence)',
          body: '某時點有疾病人數 / 總人口\n(時點盛行率) 或 期間盛行率\n反映「**負擔**」' },
        { head: '發生率 (Incidence)',
          body: '新發病例數 / 觀察人年\n反映「**風險**」' }
      ]},
      { type: 'intuition', title: '兩者關係',
        content: '近似公式：盛行率 ≈ 發生率 × 平均病程。\n→ 慢性病（病程長）盛行率高、發生率低；急性病（病程短）反之。' },
      { type: 'example', title: '臨床例：',
        content: '城市 A：糖尿病盛行率 12%、發生率 5/1000 人年。\n城市 B：盛行率 8%、發生率 5/1000 人年。\n→ A 不是「新發病更多」，而是「病人活得更久」（治療品質好或人口老化）。' },
      { type: 'key', content: '計畫醫療資源用盛行率；找致病因子用發生率。' }
    ]
  },
  {
    title: 'RR、OR、AR、NNT',
    minutes: 6,
    blocks: [
      { type: 'p', content: '比較「有暴露」與「沒暴露」的疾病風險，可以用多種測量。它們各有適用場景與解讀方式。' },
      { type: 'compare', columns: [
        { head: 'RR (Risk Ratio)',
          body: '發生風險的比值\n= P(病|暴) / P(病|未暴)\n世代研究、RCT' },
        { head: 'OR (Odds Ratio)',
          body: '勝算的比值\n= (a·d) / (b·c)\n病例對照研究、邏輯迴歸\n罕見事件時 ≈ RR' },
        { head: 'AR (Attributable Risk)',
          body: '可歸因風險\n= P(病|暴) − P(病|未暴)\n絕對差異，公衛意義大' },
        { head: 'NNT (Number Needed to Treat)',
          body: '為避免一個事件需治療人數\n= 1 / ARR\n臨床決策直觀' }
      ]},
      { type: 'example', title: '解讀練習：',
        content: '降血脂藥：5 年事件率 = 7%（藥組）vs 10%（對照）。\n• RR = 0.70（風險為對照的 70%）\n• AR (ARR) = 3%（絕對降低 3 個百分點）\n• NNT = 1/0.03 ≈ 33（治療 33 人可避免 1 件事件）\n→ RR 看比例、AR 看絕對、NNT 看實務。' },
      { type: 'warn', title: 'RR 與 OR 的差異',
        content: '事件常見（> 10%）時，OR 會「誇大」效應方向。報告罕見病的病例對照研究用 OR 沒問題；但常見病用 OR 報告應特別注釋。' },
      { type: 'key', content: '「相對」測量（RR、OR）看比例變化；「絕對」測量（AR、NNT）才反映實際影響規模。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
np: [
  {
    title: '何時放棄 t 檢定？',
    minutes: 4,
    blocks: [
      { type: 'p', content: 't 檢定假設資料近常態。當這個假設明顯違反，且樣本不大（< 30 每組）時，t 檢定的 p-value 可能不可靠。這時就需要無母數方法。' },
      { type: 'h', content: '什麼是「無母數」' },
      { type: 'p', content: '不對母體分布做特定形狀假設（不假設常態），改用「排名 (rank)」資訊。資料變成排名後，原本分布的形狀不再重要。' },
      { type: 'compare', columns: [
        { head: 'Mann-Whitney U',
          body: '兩獨立組\n對應 t 檢定\n比較中位數位置' },
        { head: 'Wilcoxon signed-rank',
          body: '配對 / 單組對中位\n對應 paired t' },
        { head: 'Kruskal-Wallis',
          body: '三組以上獨立\n對應 ANOVA' },
        { head: 'Friedman',
          body: '配對 / 重複測量多組\n對應 repeated ANOVA' }
      ]},
      { type: 'warn', title: '取捨',
        content: '無母數方法在資料常態時，效率比 t 約 95%（損失一點 power）。但在偏態或有極端值時，可大幅勝過 t。' },
      { type: 'key', content: '小樣本 + 偏態 → 無母數。大樣本（n > 30 每組）→ CLT 救你，t 通常仍可用。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
corr: [
  {
    title: '相關不是因果',
    minutes: 5,
    blocks: [
      { type: 'p', content: '相關係數量化「兩個變數一起變動的程度」。但兩個變數一起變，可能是 A→B、B→A、共同被 C 影響，或純屬巧合 — 統計學最古老的告誡。' },
      { type: 'compare', columns: [
        { head: 'Pearson r',
          body: '線性關聯\n要求常態 + 連續\n−1 ≤ r ≤ 1\nr² 是解釋變異比' },
        { head: 'Spearman ρ',
          body: '排名相關\n單調關聯（不限線性）\n抗極端值\n排序型變數可用' },
        { head: 'Kendall τ',
          body: '一致對 vs 不一致對\n小樣本穩健\n計算昂貴' }
      ]},
      { type: 'h', content: 'r 大小參考' },
      { type: 'list', items: [
        '|r| < 0.3：弱',
        '0.3 ≤ |r| < 0.5：中',
        '0.5 ≤ |r| < 0.7：強',
        '|r| ≥ 0.7：很強'
      ]},
      { type: 'warn', title: '陷阱',
        content: '高 r 不代表 y 跟 x 走（可能反向、或第三變數），低 r 不代表沒關係（可能是非線性的 U 型）。一定**先看散布圖**。' }
    ]
  },
  {
    title: '一致性：Kappa、ICC、Bland-Altman',
    minutes: 5,
    blocks: [
      { type: 'p', content: '兩位醫師都讀同一份影像，他們的判斷一致嗎？兩台血壓計給同一個人量，結果可互換嗎？這是「一致性 (agreement)」的問題，不是相關性。' },
      { type: 'compare', columns: [
        { head: 'Cohen\'s Kappa',
          body: '類別資料兩評者一致度\n校正了「碰巧一致」\nκ < 0.4 差、> 0.75 佳' },
        { head: 'ICC',
          body: '連續變數一致性\n0–1，含多種模型（隨機 vs 固定）\n> 0.9 用於臨床、> 0.75 用於研究' },
        { head: 'Bland-Altman',
          body: '視覺化兩方法差異\nx = 平均, y = 差\n看 95% limits of agreement' }
      ]},
      { type: 'warn', title: '相關 ≠ 一致',
        content: '兩個方法可以高度相關（r = 0.99）但完全不一致（一個系統性比另一個高 10）。判斷可否互換要用 Bland-Altman，不是 r。' },
      { type: 'key', content: '相關 = 同步變化；一致 = 數值上可互換。完全不同的概念。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
meta: [
  {
    title: '統合分析的力量與陷阱',
    minutes: 6,
    blocks: [
      { type: 'p', content: '單一研究的效應估計常有大不確定性。統合分析把多個研究的結果「加權平均」起來，得到更精確的綜合估計 — 但也可能放大原始研究的偏誤。' },
      { type: 'h', content: '森林圖三件事' },
      { type: 'list', items: [
        '每個研究的點估計與 95% CI（一個方塊 + 線段）',
        '方塊大小反映該研究權重（樣本大 → 權重大）',
        '底部菱形為綜合估計，水平寬度為 CI'
      ]},
      { type: 'h', content: '固定效應 vs 隨機效應' },
      { type: 'compare', columns: [
        { head: '固定效應',
          body: '假設所有研究估計同一真值\n差異純屬抽樣誤差\n適用：研究高度相似' },
        { head: '隨機效應',
          body: '允許各研究有不同真值\n納入「研究間變異 τ²」\n適用：異質性高 (I² > 50%)' }
      ]},
      { type: 'h', content: '異質性' },
      { type: 'formula', label: 'I² 統計量', tex: 'I² = (Q − df) / Q × 100%' },
      { type: 'list', items: [
        'I² < 25%：低',
        '25% ≤ I² < 50%：中',
        'I² ≥ 75%：高 → 不應該強行合併，應分組探究'
      ]},
      { type: 'warn', title: '發表偏誤',
        content: '陰性結果不容易被發表，導致統合分析高估效應。漏斗圖 + Egger test 可協助偵測；不對稱可能暗示偏誤（但也可能是真實異質性）。' },
      { type: 'key', content: '統合分析的價值取決於 (1) 系統性納入研究 (2) 評估異質性 (3) 偏誤敏感度分析 — 不是把所有研究加起來除以個數。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
mc: [
  {
    title: '多重比較問題',
    minutes: 5,
    blocks: [
      { type: 'p', content: '做一次檢定 α = 0.05 是穩定的；做 20 次獨立檢定，至少出現一個偽陽性的機率變成 64%。多測量 = 多假陽性。' },
      { type: 'formula', label: '族系錯誤率 (FWER)', tex: 'P(至少一個偽陽) = 1 − (1 − α)^m' },
      { type: 'h', content: '常見校正方法' },
      { type: 'compare', columns: [
        { head: 'Bonferroni',
          body: 'α* = α / m\n簡單、保守\n當檢定相關時過嚴' },
        { head: 'Holm step-down',
          body: '排序 p 後逐步比較\n仍控制 FWER\n比 Bonferroni 強' },
        { head: 'BH (FDR)',
          body: '控制「偽發現比例」\n適用基因組、高通量\n較寬鬆但保證 FDR' },
        { head: 'Tukey HSD',
          body: 'ANOVA 後兩兩比較\n專為平均數比較' }
      ]},
      { type: 'intuition', title: 'FWER vs FDR',
        content: 'FWER = 「至少出現一個偽陽的機率」（嚴格，臨床決策）。\nFDR = 「在被宣告顯著的結果中，偽陽的預期比例」（寬鬆，探索分析）。' },
      { type: 'warn', title: '事後挑題',
        content: '計畫只有 1 個主要終點，卻在資料分析時試了 30 個，再報導「最顯著的」 — 這叫 p-hacking。無論用什麼校正都救不了，應事前註冊主要假設。' },
      { type: 'key', content: '多重比較的本質問題不是「校正方法」，而是「有沒有事先計畫」。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
mixed: [
  {
    title: '當資料不再獨立',
    minutes: 5,
    blocks: [
      { type: 'p', content: '傳統迴歸假設「每個觀察彼此獨立」。但臨床很多資料天生相依：同一病人多次量血壓、同診所多位病人共享環境、同家族成員共享基因。直接用普通迴歸會低估標準誤、誇大顯著性。' },
      { type: 'h', content: '混合模型 (LMM)' },
      { type: 'formula', label: '隨機截距模型', tex: 'yᵢⱼ = β₀ + uᵢ + β₁xᵢⱼ + εᵢⱼ' },
      { type: 'list', items: [
        '**β** 固定效應：群體層級的平均效應',
        '**u** 隨機效應：群體 / 個體的偏離',
        '同時建模「群內相似性」與「群間差異」'
      ]},
      { type: 'compare', columns: [
        { head: 'LMM',
          body: '完整概率模型\n可預測個體軌跡\n計算稍複雜' },
        { head: 'GEE',
          body: '只估群體平均效應\n對誤指的相關結構穩健\n計算簡單' }
      ]},
      { type: 'example', title: '臨床例：',
        content: '50 位糖尿病人每月測糖化血色素 12 次。\n→ 不能當作 600 個獨立觀察。\n→ 用 LMM：fixed = 時間、用藥；random = 病人。' },
      { type: 'key', content: '看到「重複測量」、「群集」、「縱貫」— 第一個想到混合模型。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
causal: [
  {
    title: '觀察性研究的因果推論',
    minutes: 6,
    blocks: [
      { type: 'p', content: 'RCT 是因果推論金標準，但很多問題不能或不該做 RCT（會吸菸的人隨機分配嗎？）。我們需要在觀察性資料中，模擬出「準隨機」的條件 — 這就是現代因果推論的核心。' },
      { type: 'h', content: '因果有向圖 (DAG)' },
      { type: 'list', items: [
        '畫出變數間的因果關係箭頭',
        '識別**混淆變數**（影響暴露與結果）→ 必須調整',
        '識別**中介變數**（暴露 → 它 → 結果）→ 不要調整（除非做中介分析）',
        '識別**對撞變數**（暴露與結果都指向它）→ **絕對不要調整**'
      ]},
      { type: 'h', content: '主要工具' },
      { type: 'compare', columns: [
        { head: 'PSM 傾向分數配對',
          body: '估計「拿到暴露」的機率\n配對相似機率的暴露 / 未暴露對\n模擬隨機分配' },
        { head: 'IPTW',
          body: '逆機率加權\n讓暴露組與未暴露組在共變數上平衡' },
        { head: 'IV 工具變數',
          body: '找一個只透過暴露影響結果的變數\n可緩解未測量混淆' },
        { head: 'DiD 雙重差分',
          body: '比較「政策前後」與「對照組前後」的差差\n適用準實驗' }
      ]},
      { type: 'warn', title: '不可調整未測量混淆',
        content: '所有上述方法只能調整「測量到」的混淆。如果有未測量混淆，再聰明的方法也救不了 — 敏感度分析（E-value）至少能評估「需要多大未測混淆才能推翻結論」。' },
      { type: 'key', content: '因果推論不是統計問題，是科學問題。統計工具只能在你**正確指認因果結構**之後才能幫忙。' }
    ]
  }
],

// ════════════════════════════════════════════════════════
bayes: [
  {
    title: '貝氏的核心想法',
    minutes: 6,
    blocks: [
      { type: 'p', content: '頻率學派問：「假設我們重複實驗，結果會出現多頻繁？」貝氏學派問：「給定我看到的資料，我該相信什麼？」兩者世界觀不同，但都可以做嚴謹科學。' },
      { type: 'formula', label: '貝氏定理', tex: 'P(H | D) = P(D | H) · P(H) / P(D)' },
      { type: 'list', items: [
        '**P(H)** 先驗：在看資料前，對假設的信念',
        '**P(D | H)** 似然：假設成立下，資料的機率',
        '**P(H | D)** 後驗：看資料後，更新的信念'
      ]},
      { type: 'intuition', title: '直覺',
        content: '後驗 ∝ 似然 × 先驗。資料越強、似然越窄，先驗影響越小。反之先驗主導。「無資訊先驗」≈ 頻率學派的結果。' },
      { type: 'compare', columns: [
        { head: '95% 信賴區間 (CI)',
          body: '若重複實驗，95% 區間含真值\n真值是固定的' },
        { head: '95% 可信區間 (CrI)',
          body: '看完資料後，真值有 95% 機率在此區間\n更接近直覺' }
      ]},
      { type: 'key', content: '貝氏的優勢：可整合先驗知識、自然處理層次結構、回答「真值的機率」。劣勢：先驗選擇需辯護、計算重。' },
      { type: 'interactive', name: 'BayesUpdate' }
    ]
  }
],

// ════════════════════════════════════════════════════════
miss: [
  {
    title: '缺失值的三種機制',
    minutes: 5,
    blocks: [
      { type: 'p', content: '處理缺失值前要問一個關鍵問題：「為什麼缺？」缺的機制決定可以用什麼方法 — 用錯方法會引入偏誤。' },
      { type: 'compare', columns: [
        { head: 'MCAR',
          body: 'Missing Completely At Random\n缺失與「觀察值」、「未觀察值」都無關\n例：問卷掉了一頁\n→ 完整資料分析仍無偏，但效率損失' },
        { head: 'MAR',
          body: 'Missing At Random\n缺失只與「已觀察」的變數有關\n例：年輕人較少報血壓，年齡已知\n→ 可用多重插補 (MI)' },
        { head: 'MNAR',
          body: 'Missing Not At Random\n缺失與「該變數本身」有關\n例：重度憂鬱者拒答情緒問卷\n→ 困難，需敏感度分析' }
      ]},
      { type: 'warn', title: '常見錯誤',
        content: '單一插補（用平均填補）會低估標準誤、誇大顯著性。Last-observation-carried-forward (LOCF) 在縱貫資料常引入偏誤。' },
      { type: 'h', content: '推薦做法' },
      { type: 'list', items: [
        '**Multiple Imputation (MI)**：產生多份完整資料，分別分析後合併（Rubin 規則）',
        '**Maximum Likelihood**：直接用 likelihood 估計，不需填補',
        '**敏感度分析**：探討 MNAR 假設對結論的影響'
      ]},
      { type: 'key', content: '缺失值不是統計細節 — 它常常是研究最大的偏誤來源。報告缺失比例、機制假設、處理方法。' }
    ]
  }
]

};

// Build a lookup of lessons per topic id, with a fallback stub for topics without content
window.LessonsByTopic = function(topicId) {
  return window.Lessons[topicId] || [{
    title: '本主題深度內容準備中',
    minutes: 1,
    blocks: [
      { type: 'p', content: '這個主題的詳細教學還在準備中。你仍可使用上方圖表互動、速查卡片、計算機，或先到其他已上線的主題深入學習。' },
      { type: 'key', content: '建議從「描述統計」、「機率分布」、「信賴區間與 p-value」入門。' }
    ]
  }];
};
