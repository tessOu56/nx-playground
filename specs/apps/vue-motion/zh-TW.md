---
id: vue-motion
name: Vue 動畫沙盒
version: 0.1.0
description: 使用 Vue 3 建構的動畫沙盒，整合 GSAP、Three.js 與 Lottie 動畫
techStack:
  - Vue 3
  - TypeScript
  - GSAP
  - Three.js
  - Lottie
  - Tailwind CSS
features:
  - 動畫遊樂場
  - GSAP 動畫
  - 3D 場景
  - Lottie 播放器
  - 匯出預設
status: production
category: vue
published: true
lastUpdated: '2025-01-24'
---

# Vue Motion Sandbox – Vue 動畫沙盒

(Animation and Motion Design Showcase)

## 一、概念與定位 / Overview

這是一個使用 Vue 3 建構的**動畫遊樂場**，展示進階動態設計與創意 UI 開發。

不同於靜態展示網站，此沙盒提供：
- 具備即時控制的互動動畫實驗
- 單一處整合多個動畫函式庫（GSAP、Three.js、Lottie）
- 可匯出的動畫預設以供重複使用
- 效能最佳化的複雜動畫
- Vue 3 Composition API 示範

整體設計作為**創意展示**，呈現 Vue 框架專業能力與 monorepo 中的跨框架多樣性。

---

## 二、核心功能 / Core Features

### 1. GSAP 動畫函式庫

- 基於時間軸的動畫控制
- 捲動觸發動畫
- 變形與轉換效果
- 緩動函數遊樂場
- 動畫序列建構器

**重點價值**：展示對生產環境廣泛使用的專業級動畫函式庫的掌握。

---

### 2. 3D 場景渲染

- Three.js 整合用於 3D 圖形
- 具備滑鼠控制的互動 3D 物件
- 粒子系統與效果
- 自訂 shaders 與材質
- 效能最佳化渲染

**重點價值**：展示在 Web 應用中處理複雜 3D 圖形的能力。

---

### 3. Lottie 動畫播放器

- 匯入與播放 Lottie JSON 動畫
- 動畫播放控制（播放、暫停、速度）
- 互動觸發點
- 動畫庫瀏覽器
- 匯出自訂 Lottie 組合

**重點價值**：實現輕量、可擴展的動畫，非常適合 UI 微互動。

---

### 4. 動畫預設系統

- 儲存與載入動畫配置
- 具備分類的預設庫
- 一鍵套用至元素
- 匯出預設為程式碼片段
- 與團隊分享預設

**重點價值**：透過重複使用經過驗證的模式，加速動畫開發。

---

## 三、製作重點 / Development Focus

| 面向                   | 說明                                     |
| ---------------------- | ---------------------------------------- |
| **Vue 3 Composition API** | 使用 setup script 的現代化響應式程式設計 |
| **動畫效能**           | 使用 RAF 與硬體加速的最佳化渲染          |
| **創意探索**           | 推動框架界限的實驗性 UI                  |
| **跨函式庫整合**       | GSAP、Three.js 與 Lottie 協同運作        |

**結果**：生產品質的動畫，兼具創意與技術卓越。

---

## 四、內容規模 / Content Scope

- **動畫類型**：20+ 種不同的動畫模式
- **3D 場景**：10+ 個互動展示
- **Lottie 函式庫**：15+ 個預建動畫
- **目前狀態**：生產就緒，持續新增實驗

---

## 五、品質與效能指標 / Quality & Performance Metrics

| 指標               | 行業標準    | 實際結果       | 狀態 |
| ------------------ | ----------- | -------------- | ---- |
| **動畫 FPS**       | 60 FPS      | 鎖定 60        | ✅   |
| **載入時間**       | 3 秒內      | 約 2 秒        | ✅   |
| **3D 效能**        | 行動順暢    | 行動 30+ FPS   | ✅   |
| **Bundle 大小**    | 最佳化      | 程式碼分割     | ✅   |

**結論**：所有裝置上的流暢、高效能動畫。

---

## 六、技術架構 / Technical Architecture

**框架**：
- Vue 3 搭配 Composition API 與 `<script setup>`
- TypeScript 實現型別安全
- Vite 提供快速開發
- Tailwind CSS 用於樣式

**動畫函式庫**：
- GSAP 用於基於時間軸的動畫
- Three.js 用於 3D 渲染
- Lottie 用於基於 JSON 的動畫

**效能**：
- RequestAnimationFrame 實現流暢更新
- 透過 CSS transforms 的 GPU 加速
- 3D 場景的延遲載入
- 依動畫類型的程式碼分割

---

## 七、部署 / Deployment

**主要平台**：Cloudflare Pages

**設定摘要**：

- Build command: `nx build vue-motion --configuration=production`
- Output: `dist/apps/vue-motion`
- Node version: 20

**功能**：
- Vue SPA 的靜態託管
- 快速全球交付

---

## 八、開發進度 / Current Progress

### 已完成 ✅
- 使用 Composition API 的 Vue 3 專案
- GSAP 時間軸動畫
- Three.js 3D 場景
- Lottie 動畫播放器
- 動畫控制面板
- 響應式設計

### 進行中 🚧
- 額外動畫預設
- 進階 3D 效果
- 動畫匯出功能

### 下一步 📋
- 擴充預設庫
- 新增 WebGL 自訂 shaders
- 建立教學模式
- 效能分析工具

---

## 九、授權 / License

MIT（開放使用與修改）

---

## 十、補充文件 / Additional Documentation

- `specs/apps/vue-motion/en.md` - 英文規格說明
- `specs/apps/vue-motion/zh-TW.md` - 繁中規格（本文件）
- `apps/vue-motion/README.md` - 開發者文件

注意：動畫範例與配置詳情請參考 README.md。
