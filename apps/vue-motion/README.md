---
id: vue-motion
name: Vue Motion Sandbox
version: 0.1.0
description: >-
  Animation sandbox built with Vue 3, featuring GSAP, Three.js, and Lottie
  animations
techStack:
  - Vue 3
  - TypeScript
  - GSAP
  - Three.js
  - Lottie
  - Tailwind CSS
features:
  - Animation Playground
  - GSAP Animations
  - 3D Scenes
  - Lottie Player
  - Export Presets
lastUpdated: '2025-10-21'
---
# @nx-playground/vue-motion

> Vue 3 動畫效果實驗庫 - 展示各種動畫技術、3D 圖形和互動效果

## 🎯 專案定位

**此為動畫實驗 Sandbox**，用於快速 demo 和測試 CSS 動畫特效。

### 目標

- 🎨 **網站內動畫實驗環境** - 快速測試動畫效果
- ⚡ **實時 CSS 調整** - 即時預覽參數變化
- 💾 **動畫配置導出** - 將調整好的動畫導出為數據
- 🚀 **快速 Demo** - 展示動畫效果給客戶/團隊

### 關注點分離

- **此 App (vue-motion)**: 僅負責動畫預覽 UI 和參數調整介面
- **動畫數據 (libs/animation-data)**: 所有動畫配置、轉換、導出邏輯

```
┌──────────────────────┐
│  App: vue-motion     │
│  (UI Layer Only)     │
│  - 動畫預覽          │
│  - 參數調整面板      │
│  - 實時效果展示      │
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

## 📋 專案簡介

NX Playground 中的 Vue 函式庫，用於實驗和展示各種動畫技術和互動效果。

> **Note:** 此專案整合至 nx-playground monorepo，可作為獨立函式庫或參考範例使用。

## ✨ 功能展示

- **Vue 3 基礎實驗室** - Composition API、Composables、Pinia（React 開發者對照）
- **Particle Effects** - 互動式粒子系統
- **GSAP Animations** - 專業級動畫
- **Three.js 3D** - 3D 圖形和互動物件
- **Lottie Animations** - After Effects 動畫
- **VueUse Motion** - 聲明式動畫系統
- **Interactive Effects** - 滑鼠追蹤、漣漪效果、拖放

## 🚀 快速開始

### 在 Monorepo 中啟動

```bash
# 使用 Makefile
make dev-vue

# 或使用 pnpm
pnpm dev:vue-motion

# 或使用 Nx
nx serve vue-motion
```

服務運行在: **http://localhost:8080**

學習入口: **http://localhost:8080/vue-basics**（詳見 `docs/LEARNING-PATH.md`）

### 獨立開發

```bash
cd libs/vue-motion
pnpm install
pnpm serve
```

## 🛠️ 技術棧

- **Vue 3** - Composition API
- **Vue Router 4** - 路由管理
- **Tailwind CSS** - 樣式系統
- **GSAP** - 專業動畫庫
- **Three.js** - 3D 圖形庫
- **Lottie Web** - After Effects 動畫
- **VueUse Motion** - 聲明式動畫
- **Tween.js** - 補間動畫引擎

## 📂 專案結構

```
src/
├── views/
│   ├── Home.vue              # 首頁
│   └── effects/              # 各種效果展示
│       ├── Particles.vue     # 粒子效果
│       ├── GSAPAnimations.vue # GSAP 動畫
│       ├── ThreeJS.vue       # 3D 圖形
│       ├── Lottie.vue        # Lottie 動畫
│       ├── Motion.vue        # VueUse Motion
│       └── Interactive.vue   # 互動效果
├── components/
│   ├── Layout.vue            # 佈局組件
│   └── HelloWorld.vue
├── router/
│   └── index.js              # 路由配置
├── assets/
│   └── tailwind.css          # 全局樣式
└── App.vue                   # 根組件
```

## 🎨 效果展示

### 1. 粒子效果

- 互動式粒子系統
- 滑鼠互動
- 可調參數（粒子數量、速度、連接距離）

### 2. GSAP 動畫

- 基礎動畫（淡入、縮放、旋轉）
- Timeline 複雜動畫
- 文字動畫
- Motion Path 動畫

### 3. Three.js 3D

- 互動 3D 物件（立方體、球體、圓環）
- 即時旋轉和縮放控制
- 平滑動畫和過渡

### 4. Lottie 動畫

- 載入動畫
- 成功/錯誤狀態
- 自定義 After Effects 動畫
- 播放控制

### 5. VueUse Motion

- 聲明式動畫組件
- 滑動、旋轉、彈性動畫
- 序列和路徑動畫

### 6. 互動效果

- 滑鼠追蹤效果
- 點擊漣漪效果
- 懸停動畫
- 拖放互動
- 觸控手勢支援

## 💡 使用範例

### 在其他 Vue 專案中使用

```vue
<script setup>
import { ParticleEffect } from '@nx-playground/vue-motion';
</script>

<template>
  <ParticleEffect :count="100" :speed="2" />
</template>
```

### 參考實現

```vue
<script setup>
import gsap from 'gsap';
import { onMounted, ref } from 'vue';

const box = ref(null);

onMounted(() => {
  gsap.to(box.value, {
    x: 100,
    rotation: 360,
    duration: 1,
  });
});
</script>

<template>
  <div ref="box" class="w-20 h-20 bg-blue-500"></div>
</template>
```

## 📦 構建

```bash
# 在 Monorepo 根目錄
nx build vue-motion
```

## 🎓 學習資源

此專案作為動畫技術的學習範例，展示：

- 如何整合各種動畫庫
- 效能優化技巧
- 互動設計模式
- Canvas 和 WebGL 使用

## 📱 響應式設計

所有效果都針對不同螢幕大小優化：

- **桌面** - 完整互動體驗
- **平板** - 觸控優化
- **手機** - 簡化控制和手勢

## 🔧 自定義配置

### Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 自定義配置
    },
  },
};
```

## 🔗 相關連結

- [Vue.js Documentation](https://vuejs.org/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Lottie Files](https://lottiefiles.com/)
- [VueUse](https://vueuse.org/)

## 📞 原始專案

原始專案來源: [vue-motion-sandbox](https://github.com/tessOu56/vue-motion-sandbox)
