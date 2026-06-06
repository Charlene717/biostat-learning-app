// quiz-bank.js — comprehensive question bank
// types: mc (single), multi (check all), num (numeric ± tolerance), tf (true/false)
window.QuizBank = [

  // ─────────────────────── 描述統計 desc ───────────────────────
  { topic: 'desc', difficulty: 1, type: 'mc',
    stem: '以下哪個情境**最不適合**用「平均值」描述集中趨勢？',
    choices: ['某班學生身高', '醫院病人住院天數', '成人體溫', '考試成績'],
    correct: 1,
    explain: '住院天數常為右偏（少數長住病人），平均會被拉高。應使用中位數搭配 IQR。'
  },
  { topic: 'desc', difficulty: 1, type: 'tf',
    stem: '標準差越大，代表資料越偏離常態分布。',
    correct: false,
    explain: '標準差量化「離散程度」，與分布形狀（常態與否）無關。一個偏態分布也可以有大或小的 SD。'
  },
  { topic: 'desc', difficulty: 2, type: 'num',
    stem: '一組資料：2, 4, 6, 8, 10。計算樣本標準差（保留兩位小數）。',
    answer: 3.16, tolerance: 0.05,
    explain: '平均 = 6；偏差平方和 = 16+4+0+4+16 = 40；s² = 40/4 = 10；s = √10 ≈ 3.16。'
  },
  { topic: 'desc', difficulty: 2, type: 'mc',
    stem: '某資料的中位數 = 50、平均 = 75。**最可能**的分布形狀是？',
    choices: ['對稱', '左偏', '右偏', '雙峰'],
    correct: 2,
    explain: '平均 > 中位 → 右偏（少數極大值把平均拉高）。'
  },
  { topic: 'desc', difficulty: 2, type: 'multi',
    stem: '下列哪些「抗極端值」（robust）？（可複選）',
    choices: ['平均', '中位數', '標準差', 'IQR', '全距'],
    correct: [1, 3],
    explain: '中位數與 IQR 都基於排序，極端值僅佔 1 個位置。平均、SD、全距都對極端值極敏感。'
  },

  // ─────────────────────── 機率分布 prob ───────────────────────
  { topic: 'prob', difficulty: 1, type: 'mc',
    stem: '常態分布中，落在 μ ± 2σ 範圍內的機率約為？',
    choices: ['68%', '95%', '99.7%', '50%'],
    correct: 1,
    explain: '68-95-99.7 法則：1σ ≈ 68%，2σ ≈ 95%，3σ ≈ 99.7%。'
  },
  { topic: 'prob', difficulty: 2, type: 'mc',
    stem: '某抗體效價測量資料明顯右偏。下列哪項處理**最合適**進行 t 檢定？',
    choices: ['直接做 t 檢定，CLT 會處理', '取 log 轉換後再 t 檢定', '改用卡方', '剔除上尾極端值'],
    correct: 1,
    explain: '生物標記常為右偏，log 轉換可使其近常態，恢復 t 的假設前提。'
  },
  { topic: 'prob', difficulty: 2, type: 'num',
    stem: '某藥對 60% 患者有效。隨機選 10 人，恰有 6 人有效的機率（%）為多少？（兩位小數）',
    answer: 25.08, tolerance: 0.3,
    explain: 'C(10,6) · 0.6⁶ · 0.4⁴ = 210 · 0.0467 · 0.0256 ≈ 0.2508 = 25.08%。'
  },
  { topic: 'prob', difficulty: 3, type: 'mc',
    stem: '某地年新發肺癌 60/10萬人年。若用卜瓦松分布建模，**過離散** (variance > mean) 的可能原因是？',
    choices: [
      '完全沒問題，卜瓦松變異 = 平均',
      '地區內次群體風險異質（例：吸菸者集中）',
      '樣本數不足',
      'λ 太大'
    ],
    correct: 1,
    explain: '當族群有未測量的風險異質性時，整體事件分布的變異會超過卜瓦松預期。改用負二項分布建模。'
  },
  { topic: 'prob', difficulty: 1, type: 'tf',
    stem: '中央極限定理保證「樣本資料」會呈常態分布。',
    correct: false,
    explain: 'CLT 描述的是「樣本平均」的分布，不是原始資料本身。原始資料可以是任何形狀。'
  },

  // ─────────────────────── 信賴區間與 p-value ci ───────────────────────
  { topic: 'ci', difficulty: 2, type: 'mc',
    stem: '研究報告：降壓藥平均下降 8.4 mmHg，95% CI: (6.8, 10.0)。**最合理**的詮釋為？',
    choices: [
      '真值有 95% 機率落在 (6.8, 10.0) 之間',
      '若重複此研究 100 次，約 95 個區間會包含真值',
      '95% 的病人血壓下降在此區間',
      '效果非常顯著，p < 0.001'
    ],
    correct: 1,
    explain: '頻率學派 CI 的正確詮釋。「真值有 95% 機率」屬於貝氏可信區間 (CrI)。'
  },
  { topic: 'ci', difficulty: 2, type: 'mc',
    stem: '一個檢定 p = 0.03。下列**錯誤**的詮釋是？',
    choices: [
      '若 H₀ 為真，看到此或更極端結果的機率為 3%',
      'H₀ 為真的機率是 3%',
      'α = 0.05 下會拒絕 H₀',
      '應該搭配效應量與 CI 一起報告'
    ],
    correct: 1,
    explain: 'p 是「假設 H₀ 為真」下的條件機率，不是 H₀ 本身為真的機率。'
  },
  { topic: 'ci', difficulty: 3, type: 'mc',
    stem: '某研究 n = 10,000，平均收縮壓組間差 0.5 mmHg，p = 0.02。**最佳結論**為？',
    choices: [
      '差異具統計顯著且具臨床意義',
      '差異具統計顯著但臨床意義有限',
      '結果不顯著',
      '需要更大樣本'
    ],
    correct: 1,
    explain: '0.5 mmHg 遠低於臨床有意義差異（通常 ≥ 5）。大樣本讓微小差異變顯著，但不代表重要。'
  },
  { topic: 'ci', difficulty: 1, type: 'tf',
    stem: '增加樣本數 4 倍，標準誤會降為原本的一半。',
    correct: true,
    explain: 'SE = SD / √n。n 變 4 倍 → √n 變 2 倍 → SE 變一半。'
  },
  { topic: 'ci', difficulty: 2, type: 'multi',
    stem: '比較兩種降壓藥，下列**何者支持「有差異」的結論**？（可複選）',
    choices: [
      'p < 0.05',
      '95% CI 不包含 0',
      'CI 寬度小於平均差',
      '兩組平均不同'
    ],
    correct: [0, 1],
    explain: '統計顯著的等價條件：p < α 與 95% CI 不含對應假設值。「兩組平均不同」總是成立（會有隨機差異），不足以證明統計顯著。'
  },
  { topic: 'ci', difficulty: 3, type: 'mc',
    stem: '欲讓 95% CI 寬度減半，樣本數應增加為原本的幾倍？',
    choices: ['1.5 倍', '2 倍', '4 倍', '8 倍'],
    correct: 2,
    explain: 'CI 寬度 ∝ 1/√n。寬度減半 → √n 加倍 → n 變 4 倍。'
  },

  // ─────────────────────── 假設檢定 ht ───────────────────────
  { topic: 'ht', difficulty: 1, type: 'mc',
    stem: '比較同一群病人服藥**前後**血壓變化，最合適的檢定？',
    choices: ['獨立 t 檢定', '配對 t 檢定', '卡方', 'ANOVA'],
    correct: 1,
    explain: '配對資料（同一人前後）應用配對 t — 利用「差值」做單樣本 t 檢定，效力較高。'
  },
  { topic: 'ht', difficulty: 2, type: 'mc',
    stem: '某 2×2 列聯表的最小期望次數 = 3。**最合適**的檢定？',
    choices: ['卡方檢定', 'Fisher 精確檢定', 'McNemar', '雙樣本 t'],
    correct: 1,
    explain: '期望次數 < 5 時，卡方近似不可靠 → 改用 Fisher 精確檢定（精確計算超幾何分布）。'
  },
  { topic: 'ht', difficulty: 2, type: 'mc',
    stem: '比較 4 組降血壓藥的效果。為何**不能**做 6 次兩兩 t 檢定？',
    choices: [
      '統計軟體會報錯',
      '會膨脹整體 α（族系錯誤率）',
      '違反獨立性',
      '無法計算效應量'
    ],
    correct: 1,
    explain: '6 次獨立檢定的 FWER ≈ 1 − 0.95⁶ ≈ 26.5% 而非 5%。應先做 ANOVA，若顯著再用 Tukey HSD。'
  },
  { topic: 'ht', difficulty: 3, type: 'mc',
    stem: '某研究做 t 檢定 p = 0.06。下列哪項**最合理**？',
    choices: [
      '結論：兩組沒有差異',
      '結論：兩組有差異，但 p 略高',
      '報告 p、95% CI、效應量，讓讀者判斷',
      '重做研究直到 p < 0.05'
    ],
    correct: 2,
    explain: 'p = 0.05 不是自然臨界值。0.06 vs 0.04 證據強度幾乎相同。應完整報告，避免二元思考。重做直到顯著 = p-hacking。'
  },
  { topic: 'ht', difficulty: 2, type: 'tf',
    stem: 'ANOVA 顯示 F 檢定顯著，代表所有組別兩兩之間都有差異。',
    correct: false,
    explain: 'ANOVA 只告訴你「至少有一對組別不同」。要知道「哪兩組不同」需做 post-hoc（Tukey HSD、Bonferroni）。'
  },
  { topic: 'ht', difficulty: 2, type: 'multi',
    stem: '雙樣本 t 檢定的假設前提（可複選）',
    choices: ['兩組獨立', '兩組常態（或大樣本）', '兩組等變異', '兩組樣本數相等', '結果變數為連續'],
    correct: [0, 1, 2, 4],
    explain: '獨立、常態、等變異、連續變數為傳統 t 的前提。樣本數**不需相等**（Welch t-test 連等變異都不需）。'
  },

  // ─────────────────────── 迴歸 reg ───────────────────────
  { topic: 'reg', difficulty: 1, type: 'mc',
    stem: '線性迴歸的「β₁ = 2」是什麼意思？',
    choices: [
      'y 是 x 的 2 倍',
      'x 與 y 的相關 r = 2',
      'x 增加 1 單位，y 平均增加 2 單位',
      '模型解釋了 2% 變異'
    ],
    correct: 2,
    explain: 'β₁ 為斜率，描述「x 每增加 1 單位，y 的平均變化量」。'
  },
  { topic: 'reg', difficulty: 2, type: 'num',
    stem: '邏輯迴歸中某變數 β = 1.0986。對應的 OR 是多少？（一位小數）',
    answer: 3.0, tolerance: 0.05,
    explain: 'OR = exp(β) = exp(1.0986) ≈ 3.0。'
  },
  { topic: 'reg', difficulty: 2, type: 'mc',
    stem: 'R² = 0.95 但殘差圖明顯有 U 型規律。**最佳行動**？',
    choices: [
      '接受模型，R² 已很高',
      '考慮加入二次項或變數轉換',
      '增加樣本數',
      '改用 logistic'
    ],
    correct: 1,
    explain: '殘差規律 → 模型 misspecified（漏掉非線性）。即使 R² 高，模型仍錯。看殘差圖永遠優於只看 R²。'
  },
  { topic: 'reg', difficulty: 3, type: 'mc',
    stem: '在邏輯迴歸中加入「住院科別」變數後，「年齡」的 OR 從 1.5 變為 1.2。**最合理**的解釋？',
    choices: [
      '「科別」是中介變數',
      '「科別」是混淆變數（與年齡和結果都有關）',
      '「科別」是對撞變數',
      '年齡的真實效應為 0'
    ],
    correct: 1,
    explain: '加入後 OR 縮小 → 原本「年齡」的部分效應其實來自「科別」分布差異。這是典型的混淆調整。'
  },
  { topic: 'reg', difficulty: 2, type: 'tf',
    stem: '事件發生率超過 10% 時，OR 仍然是 RR 的良好近似。',
    correct: false,
    explain: '只有罕見事件（< 10%）時 OR ≈ RR。常見事件下 OR 會「誇大」效應方向。'
  },
  { topic: 'reg', difficulty: 3, type: 'multi',
    stem: '建模時，下列哪些變數**不應**直接放進迴歸調整？（可複選）',
    choices: [
      '混淆變數（影響暴露與結果）',
      '中介變數（暴露 → 它 → 結果）',
      '對撞變數（暴露與結果都指向它）',
      '與暴露無關但與結果有關的變數'
    ],
    correct: [1, 2],
    explain: '中介變數會「吃掉」暴露的間接效應；對撞變數會引入新偏誤。只有混淆變數應該調整，與結果相關（非混淆）的變數調整可降低殘差變異。'
  },

  // ─────────────────────── 存活 surv ───────────────────────
  { topic: 'surv', difficulty: 1, type: 'mc',
    stem: 'Kaplan-Meier 曲線中的「+」符號代表？',
    choices: ['事件發生', '組別交叉', '設限 (censored)', '中位存活時間'],
    correct: 2,
    explain: '「+」標示 censored 受試者（追蹤結束前未發生事件）。該時刻 KM 曲線不下降。'
  },
  { topic: 'surv', difficulty: 2, type: 'mc',
    stem: 'Cox 模型 HR = 0.65，95% CI: (0.50, 0.85)。**最合理**的詮釋為？',
    choices: [
      '新藥使壽命延長 35%',
      '在每個瞬間，新藥組的事件風險為對照組的 65%',
      '新藥組有 65% 病人存活',
      '結果不顯著'
    ],
    correct: 1,
    explain: 'HR 是「瞬時風險的比值」，不是存活率或壽命延長百分比。'
  },
  { topic: 'surv', difficulty: 3, type: 'mc',
    stem: '兩條 KM 曲線在 6 個月處交叉。下列哪項**最不適合**做為主要分析？',
    choices: [
      '限制平均存活時間 RMST',
      '在交叉前後分段分析',
      '直接報告 log-rank p',
      '報告 Wilcoxon 檢定'
    ],
    correct: 2,
    explain: '交叉曲線違反「比例風險」假設 — log-rank 在此情況檢力很差，可能完全錯失差異。應使用 RMST 或加權方法。'
  },
  { topic: 'surv', difficulty: 2, type: 'tf',
    stem: 'Cox 模型假設「比例風險」 — 即組間 HR 隨時間恆定。',
    correct: true,
    explain: '這是 Cox 的核心假設。違反時 HR 不再有單一意義，需用時間相依係數或分層 Cox。'
  },
  { topic: 'surv', difficulty: 2, type: 'mc',
    stem: '檢查 Cox 模型比例風險假設的方法是？',
    choices: ['看 R² 是否 > 0.5', 'Schoenfeld 殘差 + log-log 圖', '計算 Wilcoxon p', '增加變數'],
    correct: 1,
    explain: 'Schoenfeld 殘差檢驗 PH 假設是否違反；log-log 圖（log[-log S] vs log t）若兩線平行則 PH 成立。'
  },

  // ─────────────────────── 診斷 diag ───────────────────────
  { topic: 'diag', difficulty: 2, type: 'mc',
    stem: 'COVID-19 快篩 Sens = 95%, Spec = 98%, 盛行率 = 2%。PPV 最接近？',
    choices: ['98%', '95%', '49%', '2%'],
    correct: 2,
    explain: '1000 人代入：TP=19, FP=19.6, PPV=19/(19+19.6) ≈ 49%。低盛行率讓 PPV 暴跌。'
  },
  { topic: 'diag', difficulty: 1, type: 'mc',
    stem: '檢驗工具的「特異度」為 99% 的意思是？',
    choices: [
      '99% 的陽性結果是真陽性',
      '99% 沒病的人會得到陰性結果',
      '99% 有病的人會被檢出',
      '檢驗準確率為 99%'
    ],
    correct: 1,
    explain: 'Spec = TN / (TN + FP) = 沒病者中被正確排除的比例。'
  },
  { topic: 'diag', difficulty: 2, type: 'mc',
    stem: 'AUC = 0.5 代表？',
    choices: ['完美區分', '極差的檢驗', '與隨機猜測無異', '需更多資料'],
    correct: 2,
    explain: 'AUC = 0.5 對角線 = 完全隨機。AUC < 0.5 可反轉決策（更糟也代表有資訊）。'
  },
  { topic: 'diag', difficulty: 3, type: 'mc',
    stem: '為什麼**篩檢**程式不應該對低風險族群普遍施作？',
    choices: [
      '篩檢費用過高',
      '低盛行率 → PPV 極低 → 大量偽陽性與後續焦慮',
      '檢驗本身會失效',
      '法規不允許'
    ],
    correct: 1,
    explain: '同一檢驗在低盛行率族群會產生大量偽陽性，造成不必要焦慮、後續檢查與成本。應選對目標族群。'
  },
  { topic: 'diag', difficulty: 2, type: 'num',
    stem: '某檢驗 LR+ = 10，檢驗前機率 = 20%。檢驗後機率（%）為多少？（整數）',
    answer: 71, tolerance: 2,
    explain: '檢驗前 odds = 0.2/0.8 = 0.25。後 odds = 0.25 × 10 = 2.5。後機率 = 2.5/3.5 ≈ 71%。'
  },
  { topic: 'diag', difficulty: 2, type: 'multi',
    stem: '下列哪些**不受**疾病盛行率影響？（可複選）',
    choices: ['敏感度', '特異度', 'PPV', 'NPV', 'AUC', 'Youden J'],
    correct: [0, 1, 4, 5],
    explain: 'Sens、Spec、AUC、Youden 都是檢驗本身的性質，與盛行率無關。PPV/NPV 則受盛行率強烈影響。'
  },

  // ─────────────────────── 臨床試驗 trial ───────────────────────
  { topic: 'trial', difficulty: 1, type: 'mc',
    stem: 'RCT 中「意向治療分析」(ITT) 的原則為？',
    choices: [
      '只分析有完成療程的病人',
      '依「實際接受治療」分析',
      '依「最初隨機分配的組別」分析，無論後續發生什麼',
      '只分析符合納入條件的病人'
    ],
    correct: 2,
    explain: 'ITT 保留隨機性。如果按「實際吃了什麼」分析，自我選擇的偏誤會回來。'
  },
  { topic: 'trial', difficulty: 2, type: 'mc',
    stem: '非劣性試驗：HR = 0.81, 95% CI: (0.65, 1.00)，預設非劣性邊界 1.46。結論？',
    choices: [
      '非劣性未達成',
      '非劣性達成（且可能更好）',
      '劣性',
      '需更大樣本'
    ],
    correct: 1,
    explain: 'CI 上界 1.00 < 1.46 → 非劣性成立。且 HR < 1 暗示可能更好（可進一步檢驗優效性）。'
  },
  { topic: 'trial', difficulty: 2, type: 'tf',
    stem: '雙盲是指「研究者」與「分析者」都不知道分配。',
    correct: false,
    explain: '雙盲 = 受試者 + 研究者都不知道。三盲才加上分析者。'
  },
  { topic: 'trial', difficulty: 3, type: 'mc',
    stem: '某 RCT 招募 1,000 人，但 200 人因副作用退出。最佳的主要分析？',
    choices: [
      'ITT — 包含所有 1,000 人',
      'PP (per-protocol) — 只分析 800 人',
      '剔除退出者',
      '用退出者最後一次的觀察值 LOCF'
    ],
    correct: 0,
    explain: 'ITT 為金標準。退出本身可能與療效或副作用有關，剔除會引入偏誤。可附 PP 做敏感度分析。'
  },

  // ─────────────────────── 樣本數 ss ───────────────────────
  { topic: 'ss', difficulty: 2, type: 'mc',
    stem: '欲偵測 Δ = 5、σ = 10、α = 0.05、power = 0.8，每組約需多少樣本？',
    choices: ['約 16', '約 32', '約 64', '約 128'],
    correct: 2,
    explain: 'n/組 ≈ 2(1.96 + 0.84)² · 10²/5² ≈ 63 → 取 64。'
  },
  { topic: 'ss', difficulty: 2, type: 'mc',
    stem: '若想偵測「一半大」的效應，樣本數需要變成原本的幾倍？',
    choices: ['2 倍', '3 倍', '4 倍', '√2 倍'],
    correct: 2,
    explain: 'n ∝ 1/Δ²。Δ 減半 → n 變 4 倍。這就是為何「找小差異」極度燒錢。'
  },
  { topic: 'ss', difficulty: 1, type: 'tf',
    stem: '檢定力 0.8 代表如果真有效應，有 80% 機率檢出。',
    correct: true,
    explain: 'Power = 1 − β = P(拒絕 H₀ | H₁ 為真)。'
  },
  { topic: 'ss', difficulty: 3, type: 'mc',
    stem: '存活分析的樣本數計算重點在於：',
    choices: ['總樣本數', '事件數', '追蹤時間', '盛行率'],
    correct: 1,
    explain: 'Cox 模型的精度由「事件數」決定，不是總樣本數。同樣 100 個事件，無論來自 500 還是 5000 人，統計效力相同。'
  },

  // ─────────────────────── 流行病學 epi ───────────────────────
  { topic: 'epi', difficulty: 2, type: 'mc',
    stem: '城市 A 糖尿病盛行率 12%、發生率 5/1000 人年。城市 B 盛行率 8%、發生率 5/1000 人年。最可能的解釋？',
    choices: [
      'A 城市新發病例較多',
      'A 城市糖尿病人活得較久（治療品質好或人口老化）',
      'A 城市檢驗較準確',
      '兩者無差異'
    ],
    correct: 1,
    explain: '發生率相同但盛行率高 → 病程較長。可能來自治療品質提升或人口結構老化。'
  },
  { topic: 'epi', difficulty: 2, type: 'num',
    stem: '降血脂藥 5 年事件率：藥組 7%，對照組 10%。NNT = ?（整數）',
    answer: 33, tolerance: 1,
    explain: 'ARR = 10% − 7% = 3%。NNT = 1 / 0.03 ≈ 33。每治療 33 人可避免 1 件事件。'
  },
  { topic: 'epi', difficulty: 1, type: 'mc',
    stem: '世代研究中常用的關聯指標是？',
    choices: ['OR', 'RR', 'PPV', 'AUC'],
    correct: 1,
    explain: '世代研究有「分母」（暴露 / 未暴露族群），可直接算風險，所以用 RR。病例對照研究無分母，只能用 OR。'
  },
  { topic: 'epi', difficulty: 2, type: 'mc',
    stem: '若藥效 RR = 0.7、ARR = 0.5%、NNT = 200。下列**最合理**的決策考量？',
    choices: [
      '優先用 RR — 「降低 30%」聽起來顯著',
      'ARR 顯示絕對效益微小，需評估副作用與成本',
      'NNT 越大代表藥越有效',
      'RR < 1 即可決定使用'
    ],
    correct: 1,
    explain: 'RR 看起來吸引人，但 ARR 才反映實際影響規模。0.5% 絕對降低 + NNT = 200 是相對小的效益。'
  },

  // ─────────────────────── 無母數 np ───────────────────────
  { topic: 'np', difficulty: 2, type: 'mc',
    stem: '小樣本（每組 n = 15）且資料明顯右偏，比較兩獨立組差異。最合適的檢定？',
    choices: ['t 檢定', 'Mann-Whitney U', '配對 t', 'McNemar'],
    correct: 1,
    explain: '小樣本 + 明顯偏態 → 無母數的 Mann-Whitney U（基於排名，不假設常態）。'
  },
  { topic: 'np', difficulty: 2, type: 'mc',
    stem: '無母數方法相對於 t 檢定的主要「代價」是？',
    choices: ['計算複雜', '在資料常態時，效力約損失 5%', '結果無法解釋', '不能算 CI'],
    correct: 1,
    explain: '常態資料時無母數方法效力約 95%（相對於 t 的 100%）。但在偏態或有極端值時，無母數常勝。'
  },
  { topic: 'np', difficulty: 1, type: 'mc',
    stem: '對應「ANOVA」的無母數檢定是？',
    choices: ['Mann-Whitney U', 'Wilcoxon signed-rank', 'Kruskal-Wallis', 'McNemar'],
    correct: 2,
    explain: 'Kruskal-Wallis 是「多組獨立資料的無母數比較」，對應 ANOVA。'
  },

  // ─────────────────────── 相關 corr ───────────────────────
  { topic: 'corr', difficulty: 2, type: 'mc',
    stem: '兩個變數 r = 0.0。**最合理**的詮釋為？',
    choices: [
      '兩變數無任何關係',
      '兩變數無線性關係',
      '一個變數獨立',
      '需更多資料'
    ],
    correct: 1,
    explain: 'r 只測線性關聯。可能存在強的非線性關係（U 型、二次型），但 r ≈ 0。永遠先看散布圖。'
  },
  { topic: 'corr', difficulty: 2, type: 'mc',
    stem: '兩台血壓計量同一人：r = 0.99，但其中一台系統性比另一台高 10 mmHg。它們可互換嗎？',
    choices: [
      '可以，r 很高',
      '不可以，相關 ≠ 一致；要看 Bland-Altman',
      '可以，誤差小',
      '需要更多病人'
    ],
    correct: 1,
    explain: '高相關意味著「同步變化」，但兩者「絕對值」可有恆定偏移。判斷可否互換需 Bland-Altman 分析（看誤差分布與 95% LoA）。'
  },
  { topic: 'corr', difficulty: 2, type: 'mc',
    stem: 'Cohen\'s κ = 0.35。一致性程度為？',
    choices: ['極佳', '良好', '中度', '輕度'],
    correct: 3,
    explain: 'κ < 0.4 通常被視為「輕度」一致性。Landis-Koch：0.4-0.6 中度、0.6-0.8 良好、>0.8 極佳。'
  },

  // ─────────────────────── 統合分析 meta ───────────────────────
  { topic: 'meta', difficulty: 2, type: 'mc',
    stem: 'I² = 78%。**最合理**的處理為？',
    choices: [
      '固定效應模型',
      '隨機效應模型，並探究異質性',
      '結果不可信，放棄分析',
      '增加研究'
    ],
    correct: 1,
    explain: 'I² > 75% 屬高異質性。應用隨機效應模型納入研究間變異，並用次群組分析或 meta-regression 探究原因。'
  },
  { topic: 'meta', difficulty: 2, type: 'mc',
    stem: '森林圖中，方塊的大小代表？',
    choices: ['p-value 大小', '該研究的權重（樣本大小）', '研究品質', '時間順序'],
    correct: 1,
    explain: '方塊大小反映權重，與樣本大小或變異成反比。大方塊 = 該研究貢獻較多訊息。'
  },
  { topic: 'meta', difficulty: 3, type: 'mc',
    stem: '漏斗圖出現明顯不對稱。**可能的原因**？',
    choices: [
      '隨機誤差',
      '發表偏誤（小型陰性結果未發表）',
      '研究設計過於相似',
      '樣本太大'
    ],
    correct: 1,
    explain: '漏斗圖不對稱常代表發表偏誤 — 小研究的陰性結果較少進入文獻。也可能是真實異質性，需配合 Egger test。'
  },

  // ─────────────────────── 多重比較 mc ───────────────────────
  { topic: 'mc', difficulty: 2, type: 'num',
    stem: '做 20 個獨立檢定（每個 α = 0.05），至少出現一個偽陽的機率約為（%）？（整數）',
    answer: 64, tolerance: 2,
    explain: '1 − 0.95²⁰ ≈ 1 − 0.358 ≈ 64%。這就是為何要校正。'
  },
  { topic: 'mc', difficulty: 3, type: 'mc',
    stem: 'Bonferroni 與 BH FDR 校正的主要差別？',
    choices: [
      'Bonferroni 較寬鬆',
      'Bonferroni 控制 FWER；BH 控制 FDR',
      'BH 適用任何情境',
      '兩者相同'
    ],
    correct: 1,
    explain: 'FWER = 至少一個偽陽的機率（嚴格）；FDR = 顯著結果中偽陽的預期比例（較寬鬆，適合探索性分析）。'
  },
  { topic: 'mc', difficulty: 2, type: 'tf',
    stem: '事先註冊主要假設後，主要終點不需要做多重比較校正。',
    correct: true,
    explain: '主要終點通常只有一個（事先註冊），不涉及多重比較。次要終點與探索性分析才需校正。'
  },

  // ─────────────────────── 混合模型 mixed ───────────────────────
  { topic: 'mixed', difficulty: 2, type: 'mc',
    stem: '50 位糖尿病人每月測糖化血色素，追蹤 12 個月。最合適的分析？',
    choices: [
      '把 600 筆觀察當獨立資料做迴歸',
      '線性混合模型 (LMM)，病人為隨機效應',
      '配對 t 檢定',
      '時間序列模型'
    ],
    correct: 1,
    explain: '同人重複測量不獨立。LMM 可處理「病人內相關」+「時間趨勢」。直接迴歸會低估 SE、誇大顯著性。'
  },
  { topic: 'mixed', difficulty: 3, type: 'mc',
    stem: 'GEE 與 LMM 的主要差別？',
    choices: [
      'GEE 只能用連續變數',
      'GEE 估群體平均效應；LMM 估個體軌跡',
      '兩者相同',
      'GEE 需要常態假設'
    ],
    correct: 1,
    explain: 'GEE 是 marginal model（人口平均效應），對相關結構錯誤指定較穩健；LMM 是 conditional model（個體層次），可預測個體軌跡。'
  },

  // ─────────────────────── 因果 causal ───────────────────────
  { topic: 'causal', difficulty: 3, type: 'mc',
    stem: 'DAG 分析中，將「對撞變數」放入迴歸調整會：',
    choices: [
      '降低偏誤',
      '引入新偏誤（collider bias）',
      '提高效力',
      '無影響'
    ],
    correct: 1,
    explain: '對撞變數（暴露與結果都指向它）若調整，會「打開」非因果路徑，引入虛假關聯。'
  },
  { topic: 'causal', difficulty: 2, type: 'mc',
    stem: '傾向分數配對 (PSM) 的目的是？',
    choices: [
      '預測誰會拿到暴露',
      '在觀察性資料中模擬隨機分配，平衡共變數',
      '提高樣本數',
      '減少缺失值'
    ],
    correct: 1,
    explain: 'PSM 配對「拿到暴露的機率」相似的暴露 vs 未暴露者，使共變數在配對後分布相似，近似隨機分配。'
  },
  { topic: 'causal', difficulty: 3, type: 'tf',
    stem: '若使用 PSM 或 IPTW，就能完全消除混淆偏誤。',
    correct: false,
    explain: '這些方法只能調整「測量到」的混淆。未測量混淆仍會偏誤。可做敏感度分析（E-value）評估其影響。'
  },

  // ─────────────────────── 貝氏 bayes ───────────────────────
  { topic: 'bayes', difficulty: 2, type: 'mc',
    stem: '95% 可信區間 (CrI) 與 95% 信賴區間 (CI) 的主要差別？',
    choices: [
      '計算方法不同，結果一樣',
      'CrI 可說「真值有 95% 機率在此區間」；CI 不能',
      'CrI 較窄',
      'CI 較準確'
    ],
    correct: 1,
    explain: '頻率學派視真值為固定，CI 描述「重複實驗的覆蓋率」；貝氏視真值為隨機（有後驗分布），CrI 可直接說「在此區間的機率」。'
  },
  { topic: 'bayes', difficulty: 3, type: 'mc',
    stem: '當「資料 n」很大時，貝氏的後驗分布主要由什麼主導？',
    choices: ['先驗', '似然（資料）', '兩者各半', '先驗為主'],
    correct: 1,
    explain: '資料增加 → 似然變窄、主導後驗 → 先驗影響減弱。「無資訊先驗」+ 大樣本 ≈ 頻率學派結果。'
  },

  // ─────────────────────── 缺失值 miss ───────────────────────
  { topic: 'miss', difficulty: 2, type: 'mc',
    stem: '某問卷收集中，年輕病人較少報告血壓（年齡已記錄）。這屬於哪種缺失機制？',
    choices: ['MCAR', 'MAR', 'MNAR', '無法判斷'],
    correct: 1,
    explain: '缺失與「已觀察」的變數（年齡）有關但與「未觀察」的血壓本身無關 → MAR。可用多重插補 (MI) 處理。'
  },
  { topic: 'miss', difficulty: 2, type: 'mc',
    stem: '處理 MAR 缺失資料的**最佳**方法為？',
    choices: [
      '完整資料分析（CCA）',
      '用平均填補',
      '多重插補 (MI)',
      'LOCF'
    ],
    correct: 2,
    explain: 'MI 是 MAR 的主流方法。CCA 會損失效力（可能偏誤）；平均填補低估變異；LOCF 在縱貫資料引入偏誤。'
  },
  { topic: 'miss', difficulty: 1, type: 'tf',
    stem: '單一插補（用平均填補）會低估真實變異。',
    correct: true,
    explain: '把缺失值「等於」平均後，那些觀察沒有實際變異。應使用多重插補，每次抽不同的可信值。'
  }

];

// Backwards compatibility — overwrite the legacy quiz with new bank
if (window.AppData) {
  // Keep legacy MC question shape for current quiz UI fallback
  window.AppData.quizBank = window.QuizBank;
}
