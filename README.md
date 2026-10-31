# 墨讀 FocusDesk (沉浸式讀書番茄鐘)

> 專為學生、考生與深度自習者打造的現代化美學番茄鐘工具。整合 Web Audio 擬真白噪音調音台、自訂時分秒番茄鐘、3D 機械翻頁鐘、科目任務看板、學習熱力圖統計與學科專屬名言釋義。

---

## 📖 專案簡介 (Introduction)

**墨讀 FocusDesk** 是一款結合心流理論（Flow State）與番茄工作法（Pomodoro Technique）的網頁應用。針對升學考研、語言檢定、論文撰寫與程式開發等高強度學習情境設計，協助學習者建立穩固的專注節奏、降低分心焦慮，並透過視覺化數據見證累積的力量。

所有資料皆以瀏覽器 LocalStorage 安全保存於本機，無需註冊登入即可離線使用，確保個人專注隱私。

---

## ✨ 核心特色功能 (Key Features)

### 1. ⏱️ 彈性自訂時間（支援「時、分、秒」）
- **三維度時間自訂**：突破傳統番茄鐘只有分鐘的限制，專注時間、短休息、長休息皆可精準設定**小時、分鐘、秒鐘**（如模考 1 小時 15 分鐘、快速聽力衝刺 5 分 30 秒）。
- **常用預設方案**：內建經典番茄（25m）、考研深度（1h）、模考實戰（1h 15m）、高頻衝刺（15m）、極速短測（5m 30s）。
- **自訂預設庫**：可將自己最習慣的時間組合命名儲存，隨時一鍵切換。

### 2. 🕰️ 三種時鐘顯示與 3D 復古機械翻頁動畫
- **復古翻頁日曆鐘 (Split-Flap Flip Clock)**：具備上下雙半葉 3D 物理摺疊動畫、微立體陰影與翻牌音效視覺感。自動依時間長度在 `[HH]:[MM]:[SS]` 與 `[MM]:[SS]` 之間切換。
- **經典圓環進度鐘 (Minimal Ring Clock)**：動態 SVG 弧形進度條，清晰顯示當前階段百分比。
- **巨幅極簡數字鐘 (Minimal Jumbo Clock)**：超大字體搭配平滑呼吸光條，適合遠距離桌面擺設。

### 3. 🎨 六款氛圍主題風格 (Atmosphere Themes)
- **深邃夜讀 (Dark)**：極致黑調，夜間學習不刺眼。
- **晨光素白 (Light)**：清晰明亮，宛如晨間圖書館。
- **京都竹林 (Kyoto)**：自然墨綠，帶來舒緩平靜的治學心境。
- **北歐松林 (Forest)**：沉穩深森綠，強化耐力與沈浸感。
- **暮色落日 (Sunset)**：溫潤暖橘褐調，營造溫暖咖啡館氛圍。
- **復古蒸汽 (Retro)**：深褐木紋與復古機械風格。

### 4. 📜 學科專屬名言與繁體白話翻譯 (Subject Quotes & Translation)
- **依科目智慧匹配**：當選擇數學任務時顯示高斯與康托爾、英文顯示莎士比亞、物理顯示費曼與愛因斯坦、程式顯示圖靈與高德納、論文寫作顯示胡適與愛迪生。
- **完整翻譯與釋義**：外文名言附繁體中文翻譯，文言古籍附現代白話哲學解析。
- **一鍵換句**：點擊卡片右上角 🔄 按鈕即可即時輪播該學科其他勉勵名言。

### 5. 🎧 Web Audio 擬真環境白噪音調音台
- **純程式合成，無依賴外部音檔**：以瀏覽器 Web Audio API 即時運算音效，零網路流量加載。
- **6 種沉浸音景獨立混音**：
  - 🌧️ 窗外細雨（Rain）
  - ☕ 溫暖咖啡館（Cafe White Noise）
  - 🌲 夏夜森林（Forest Wind & Insects）
  - 🌊 拍岸海浪（Ocean Waves）
  - 🔥 壁爐柴火（Fireplace Crackle）
  - 📻 柔和白噪音（Pure Pink/White Noise）
- **多種禪定提示音**：西藏頌缽 (Tibetan Bell)、日式禪鐘 (Zen Gong)、木琴清音 (Marimba)、柔和蜂鳴 (Soft Beep)，音量與機械秒針滴答音可自訂。

### 6. 📋 科目任務看板 (Task Kanban)
- **豐富學科分類**：內建 16 種學科標籤（數學、英文、國文、物理、化學、生物、歷史、地理、程式、論文、證照等），並支援使用者**自行新增科目與顏色**。
- **番茄顆數目標**：設定預估與已完成番茄數，任務可直接指派為當前計時器追蹤目標。

### 7. 📊 學習統計與 30 天熱力圖 (Study Analytics)
- 視覺化今日專注時數、本週累計時間、完成番茄數與歷史總計。
- 各科目學習時間分佈圓餅圖，掌握時間分配比例。
- GitHub 風格的 **30 天學習貢獻熱力圖**，記錄每一天的學習足跡。

### 8. 📝 防分心靈感便籤 (Distraction Notepad)
- 專注當下浮現雜念（如「記得繳水電費」、「回覆教授信件」）時，快速敲下便籤即可清空大腦工作記憶，專注完成當前番茄鐘後再行批次處理。

### 9. 🔲 Zen 禪定全螢幕模式
- 按下全螢幕或快捷鍵，隱藏所有雜訊按鈕，只保留大字時鐘、當前目標任務與專屬名言。
- 支援空白鍵 `[Space]` 快速暫停/繼續，`[ESC]` 隨時退出。

---

## 🛠️ 技術架構 (Tech Stack)

| 領域 | 技術選型 | 說明 |
| :--- | :--- | :--- |
| **前端框架** | React 19 + TypeScript | 組件化架構、自訂 Hooks、嚴格類型安全 |
| **建置工具** | Vite 6 / Vite 8 | 極速冷啟動與 HMR 模組熱替換 |
| **樣式設計** | Tailwind CSS v4 | CSS 自訂變數、原生主題抽換與流暢 3D 動畫 |
| **圖標庫** | Lucide React | 精美現代簡約線性圖標 |
| **音訊引擎** | Web Audio API | 振盪器（Oscillator）與粉紅噪音演算法純代碼合成音效 |
| **資料持久化** | LocalStorage API | 零後端依賴、開箱即用、資料本地隱私保存 |

---

## 🚀 安裝與執行方式 (Installation & Usage)

### 1. 環境需求
請確保您的電腦已安裝：
- [Node.js](https://nodejs.org/) (建議 **v18.0.0** 或 **v20.0.0** 以上版本)
- [npm](https://www.npmjs.com/) (通常隨附於 Node.js) 或 `pnpm` / `yarn`

### 2. 下載專案原始碼
```bash
# 複製儲存庫（若已在專案目錄中可略過）
git clone <repository-url>
cd <project-folder>
```

### 3. 安裝依賴套件
在專案根目錄下執行以下指令安裝所需模組：
```bash
npm install
```

### 4. 啟動本地開發伺服器
```bash
npm run dev
```
啟動成功後，終端機將顯示本地服務網址（預設為 `http://localhost:3000`）。打開瀏覽器即可開始使用！

### 5. 建置生產環境版本 (Production Build)
如欲將專案部署至靜態主機（如 Vercel、Netlify、GitHub Pages 或 Cloud Run）：
```bash
# 編譯並打包靜態檔案至 dist/ 目錄
npm run build

# 本地預覽編譯後的成果
npm run preview
```

### 6. 程式碼品質與型別檢查
```bash
npm run lint
```

---

## 📂 專案目錄結構 (Project Structure)

```text
├── index.html                  # 網頁入口 HTML（已配置 SEO 與中英文字體載入）
├── metadata.json               # 應用程式元數據與權限配置
├── package.json                # 專案依賴與執行腳本
├── tsconfig.json               # TypeScript 編譯設定
├── vite.config.ts              # Vite 建置與 Tailwind 配置
├── src/
│   ├── main.tsx                # React 渲染入口
│   ├── App.tsx                 # 頂層主應用程式（狀態管理與版面整合）
│   ├── index.css               # 全域樣式、主題變數與 3D 翻頁動畫 Keyframes
│   ├── types/
│   │   └── pomodoro.ts         # 核心型別定義（任務、番茄設定、名言、科目等）
│   ├── utils/
│   │   ├── soundEngine.ts      # Web Audio 純代碼音景與提示音合成引擎
│   │   └── storage.ts          # LocalStorage 存取、預設值與科目專屬名言庫
│   └── components/
│       ├── Navbar.tsx          # 頂部導航與功能捷徑
│       ├── TimerDisplay.tsx    # 主計時器視圖、模式切換、預設按鈕與名言卡片
│       ├── FlipClock.tsx       # 3D 機械翻頁日曆鐘組件
│       ├── CustomTimeModal.tsx # 自訂時/分/秒彈窗與自訂預設管理
│       ├── ThemeStyleModal.tsx # 畫面氛圍主題與時鐘樣式選擇器
│       ├── AmbientSoundMixer.tsx# 白噪音多軌音量調音台
│       ├── TaskKanban.tsx      # 科目任務看板與自訂科目管理
│       ├── StudyStats.tsx      # 專注時數統計、圓餅圖與 30 天學習熱力圖
│       ├── DistractionNotepad.tsx # 防分心靈感速記本
│       ├── ZenModeOverlay.tsx  # 全螢幕沉浸專注覆蓋層
│       └── SettingsModal.tsx   # 自動跳轉、循環週期與音效設定彈窗
```

---

## ⌨️ 常用快捷鍵 (Keyboard Shortcuts)

- **`Space`（空白鍵）**：快速開始／暫停當前番茄鐘（在主畫面與 Zen 模式均有效）。
- **`ESC`（Esc 鍵）**：退出 Zen 禪定全螢幕模式，或關閉當前開啟的彈出視窗。

---

## 📄 授權條款 (License)

本專案採用 [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0) 授權。
