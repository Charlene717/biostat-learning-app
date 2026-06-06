# 生物統計 · Biostat Lab

> 深入淺出的互動式生物統計學習 App — 涵蓋從描述統計到 Cox 比例風險的 18 個主題，內建互動實驗室、33 個臨床計算機、混合題型題庫與學習進度追蹤。

繁體中文介面，搭配英文術語。專為醫學院 / 公衛 / 臨床研究學習者設計。

**🔗 線上版：[charlene717.github.io/biostat-learning-app](https://charlene717.github.io/biostat-learning-app/)**

| 版本 | 連結 |
|------|------|
| 桌機 / 響應式 | [index.html](https://charlene717.github.io/biostat-learning-app/index.html) |
| 手機版 | [mobile.html](https://charlene717.github.io/biostat-learning-app/mobile.html) |

---

## ✨ 功能總覽

| 模組 | 說明 |
|------|------|
| **儀表板 Dashboard** | 整體進度環、本週時數、繼續學習、學習行事曆、每日一題、活動長條圖 |
| **主題庫 Library** | 18 個主題卡片，可依標籤（基礎 / 推論 / 建模 / 進階 / 臨床）篩選 |
| **互動概念 Concepts** | 常態 / 二項 / 卜瓦松分布，拖滑桿即時改變參數與機率 |
| **實驗室 Lab** | 6 個深度互動工具：中央極限定理、信賴區間覆蓋、α/β/檢定力、盛行率→PPV、貝氏更新、極端值衝擊 |
| **課程閱讀 Lessons** | 每個主題的多課內容，深入淺出，內嵌互動元件與圖表 |
| **練習測驗 Quiz** | 60+ 題、4 種題型（單選 / 複選 / 是非 / 計算）、進度追蹤、錯題紀錄、建議複習主題 |
| **速查卡片 Cheat Sheet** | 23 張高密度公式卡片，可關鍵字搜尋 |
| **計算機 Calculators** | 9 類 33 個工具：樣本數、假設檢定、信賴區間、效應量、診斷、迴歸與存活、機率分布、一致性、多重比較 |
| **臨床情境 Case Study** | 真實 RCT 案例 + Kaplan-Meier 曲線 + 判讀挑戰 |

### Tweaks（工具列開啟）
主題色（Clinical / Indigo / Coral / Graphite）· 字體（Plex / Geist / 襯線）· 深色模式 · 難度 · 圖表類型 · 跳轉畫面

---

## 🖥 兩種版本

| 檔案 | 版本 | 說明 |
|------|------|------|
| `index.html` | **桌機 / 響應式** | 側邊導覽 + 寬版佈局 |
| `mobile.html` | **手機** | iOS 邊框 + 底部 Tab Bar，手機原生重新設計 |

兩者共用同一份資料與邏輯，無需 build 步驟，純靜態檔案。

---

## 🚀 本地開啟

因為使用 ES module 與 `fetch` 載入分檔，建議用本地伺服器開啟（不要直接雙擊 `file://`）：

```bash
# Python 3
python3 -m http.server 8000

# 或 Node
npx serve
```

然後瀏覽 `http://localhost:8000/index.html` 或 `mobile.html`。

---

## 🌐 部署到 GitHub Pages

1. 推上 GitHub 後，到 repo **Settings → Pages**
2. Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`
3. 儲存後等待數分鐘，網址為：
   ```
   https://charlene717.github.io/biostat-learning-app/index.html
   ```

---

## 📁 專案結構

```
index.html            桌機版進入點
mobile.html           手機版進入點

# 資料層（純 JS）
data.js               主題、卡片、行事曆、活動資料
lessons.js            課程內容（含內嵌互動）
quiz-bank.js          測驗題庫（60+ 題，4 種題型）
quiz-stats.js         進度 / 錯題 / 建議複習（localStorage）
calc-math.js          統計分布函數（逆常態、t/χ²/F CDF、Wilson CI…）

# 視覺與圖表
styles.css            桌機樣式 + 設計系統 tokens
mobile-styles.css     手機樣式
lesson-reader.css     課程閱讀樣式
interactives.css      互動元件樣式
charts.jsx            分布圖、KM、ROC、迴歸散布圖
interactives.jsx      6 個互動實驗工具

# 畫面（React，inline JSX via Babel）
screens.jsx           桌機畫面
mobile-screens.jsx    手機畫面
lab-screens.jsx       實驗室畫面
calculators.jsx       33 個計算機
quiz-engine.jsx       測驗題型渲染與評分
lesson-reader.jsx     課程閱讀器
app.jsx               桌機主程式 + Tweaks
mobile-app.jsx        手機主程式 + iOS 邊框 + Tweaks

# 元件
ios-frame.jsx         iPhone 裝置邊框
tweaks-panel.jsx      Tweaks 面板
```

---

## 🛠 技術

- **React 18**（透過 CDN + Babel standalone，inline JSX，無需打包）
- **純 CSS**（CSS variables / grid / oklch 色彩）
- **localStorage** 持久化學習進度
- 所有統計計算使用精確分布函數，非單一查表值

---

## ⚠️ 免責聲明

本 App 為**教學用途**。計算結果採用標準近似公式，正式研究或臨床決策請使用經驗證的統計軟體（R、SAS、Stata 等）並諮詢統計專家。

---

## 📄 授權

MIT License — 歡迎自由使用、修改與分享。
