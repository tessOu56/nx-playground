---
title: 'Vue Motion - 動畫實驗 Sandbox'
slug: 'vue-motion'
category: 'apps'
tags: ['Vue 3', 'GSAP', 'Three.js', 'Lottie', 'Animation', 'Sandbox']
date: '2025-10-20'
excerpt: 'Vue 3 動畫效果展示與實驗平台'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Vue Motion - 動畫實驗 Sandbox

> Vue 3 動畫效果展示與實驗平台

**最後更新**: 2025-10-20

---

## 🎯 專案定位

**此為動畫實驗 Sandbox**，用於快速 demo 和測試 CSS 動畫特效，**不是生產專案**。

### 核心目標

- 🎨 **動畫實驗環境** - 在網站內快速測試動畫效果
- ⚡ **實時調整** - 調整 CSS 參數立即預覽
- 💾 **配置導出** - 將調整好的動畫導出為數據
- 🚀 **快速 Demo** - 展示動畫效果給客戶/團隊

### 關注點分離架構

```
┌──────────────────────┐
│  App: vue-motion     │
│  (UI Layer Only)     │
│  - 動畫預覽 UI       │
│  - 參數調整面板      │
│  - 實時效果展示      │
│  - CSS 編輯器        │
└──────────┬───────────┘
           │ imports
           ▼
┌──────────────────────┐
│ Lib: animation-data  │
│ (Data Layer)         │
│  - Presets           │
│  - Transformers      │
│  - Exporters         │
│  - Types             │
└──────────────────────┘
```

**原則**：

- ❌ App 不應包含動畫數據邏輯
- ❌ App 不應包含 CSS 轉換邏輯
- ✅ App 只負責 UI 和預覽
- ✅ 所有數據處理在 libs/animation-data

---

## 🛠️ 技術棧

### 核心技術

- **Vue 3** - Composition API
- **Vue Router 4** - 路由管理
- **Tailwind CSS** - 樣式系統
- **TypeScript** - 類型安全

### 動畫技術

- **GSAP** - 專業動畫庫
- **Three.js** - 3D 圖形
- **Lottie Web** - After Effects 動畫
- **VueUse Motion** - 聲明式動畫
- **Tween.js** - 補間動畫引擎

---

## 📂 專案結構

```
src/
├── views/                   # 頁面
│   ├── Home.vue            # 首頁
│   └── effects/            # 動畫展示
│       ├── Particles.vue   # 粒子效果
│       ├── GSAPAnimations.vue
│       ├── ThreeJS.vue     # 3D 圖形
│       ├── Lottie.vue      # Lottie 動畫
│       ├── Motion.vue      # VueUse Motion
│       └── Interactive.vue # 互動效果
├── components/
│   ├── Layout.vue
│   └── HelloWorld.vue
├── router/
│   └── index.js
├── assets/
│   └── tailwind.css
└── App.vue
```

**未來 Sandbox 結構** (待實現):

```
views/
├── Sandbox.vue              # 主要 Sandbox 介面
│   ├── CssEditor           # Monaco 編輯器
│   ├── ParameterPanel      # 參數調整
│   ├── LivePreview         # 實時預覽
│   └── ExportDialog        # 導出功能
└── Gallery.vue              # 預設動畫畫廊
```

---

## ✨ 功能展示

### 當前功能

1. **粒子效果**

   - 互動式粒子系統
   - 滑鼠互動
   - 參數可調（數量、速度、連接距離）

2. **GSAP 動畫**

   - 基礎動畫（淡入、縮放、旋轉）
   - Timeline 複雜動畫
   - 文字動畫
   - Motion Path

3. **Three.js 3D**

   - 互動 3D 物件
   - 即時控制
   - 平滑動畫

4. **Lottie 動畫**

   - After Effects 動畫
   - 播放控制

5. **VueUse Motion**

   - 聲明式動畫
   - 序列和路徑動畫

6. **互動效果**
   - 滑鼠追蹤
   - 點擊漣漪
   - 拖放互動

### 計劃中的 Sandbox 功能

1. **CSS 編輯器** (Monaco Editor)

   - 即時編輯 CSS
   - 語法高亮
   - 自動完成

2. **參數控制面板**

   - Duration slider
   - Easing selector
   - Delay, iterations

3. **實時預覽**

   - 即時看到效果
   - 播放/暫停/重置

4. **導出功能**

   - 導出為 JSON
   - 導出為 CSS
   - 導出為 JavaScript 代碼

5. **預設庫管理**
   - 瀏覽預設動畫
   - 載入預設
   - 保存自定義

---

## 🚀 開發

```bash
# 啟動開發服務器
pnpm dev:vue-motion
# 或
nx serve vue-motion

# 訪問
http://localhost:8080
```

---

## 📦 構建

```bash
# Production build
nx build vue-motion
```

---

## 📝 待辦事項

- [ ] 實現 Sandbox UI（CSS 編輯器、參數面板）
- [ ] 整合 libs/animation-data
- [ ] 添加更多預設動畫
- [ ] Keyframe 視覺化編輯器
- [ ] 動畫時間軸

---

## 🔗 相關文檔

- [Animation Data Lib](../libs/ANIMATION_DATA.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Three.js Documentation](https://threejs.org/docs/)

---

**狀態**: ✅ 動畫展示完成，libs/animation-data 已創建，待 Sandbox UI 實現
