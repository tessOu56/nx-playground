---
id: animation-data
version: 1.0.0
lastUpdated: '2025-10-20'
category: vue
status: production
published: true
shortDesc: Vue 動畫 Sandbox 的數據處理函式庫
purpose: '**最後更新**: 2025-10-20'
highlights:
  - Vue
  - Animation
  - Data Layer
  - CSS
  - TypeScript
reviewer: tessou
updateFrequency: per-feature
---

# @nx-playground/animation-data

> Vue 動畫 Sandbox 的數據處理函式庫

**最後更新**: 2025-10-20

---

## 🎯 專案定位

此函式庫為 **vue-motion** (動畫實驗 Sandbox) 提供所有動畫數據處理邏輯。

### 設計理念

**完全的關注點分離**：

- **Lib (animation-data)**: 動畫配置、轉換、導出邏輯
- **App (vue-motion)**: 僅負責動畫預覽 UI 和參數調整

```
┌──────────────────────┐
│  App: vue-motion     │
│  (UI Layer Only)     │
│  - 動畫預覽 UI       │
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

---

## 📂 資料夾結構

```
libs/animation-data/
├── src/
│   ├── lib/
│   │   ├── types/               # 動畫類型定義
│   │   │   └── index.ts
│   │   ├── presets/             # 預設動畫配置
│   │   │   └── index.ts
│   │   ├── transformers/        # CSS 轉換邏輯
│   │   │   └── index.ts
│   │   ├── exporters/           # 導出功能
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── tsconfig.lib.json
├── project.json
├── README.md
└── package.json
```

---

## 💡 使用方式

### 在 Vue App 中使用

```typescript
import {
  allPresets,
  CssGenerator,
  JsonExporter,
  CssExporter,
} from '@nx-playground/animation-data';

// 使用預設動畫
const fadeIn = allPresets.find(p => p.id === 'fade-in');

// 生成 CSS animation 屬性
const css = CssGenerator.generate(fadeIn);
// 輸出: "animation-name: fade-in; animation-duration: 300ms; ..."

// 生成 @keyframes
const keyframes = CssGenerator.generateKeyframes(fadeIn.name, fadeIn.keyframes);
// 輸出: "@keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }"

// 導出為 JSON
const json = JsonExporter.export(fadeIn);

// 導出為完整 CSS
const fullCss = CssExporter.export(fadeIn);
```

---

## 📚 模組說明

### Types

定義動畫數據結構：

```typescript
export interface AnimationConfig {
  name: string;
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number | 'infinite';
}

export interface Keyframe {
  offset: number; // 0 to 1
  properties: Record<string, string>;
}

export interface AnimationPreset extends AnimationConfig {
  id: string;
  category: 'fade' | 'slide' | 'bounce' | 'rotate' | 'scale' | 'custom';
  keyframes: Keyframe[];
  description: string;
}
```

### Presets

預設動畫配置：

```typescript
export const fadeInPreset: AnimationPreset = {
  id: 'fade-in',
  name: 'Fade In',
  category: 'fade',
  duration: 300,
  easing: 'ease-in',
  description: 'Simple fade in animation',
  keyframes: [
    { offset: 0, properties: { opacity: '0' } },
    { offset: 1, properties: { opacity: '1' } },
  ],
};

export const slideInPreset: AnimationPreset = {
  id: 'slide-in',
  name: 'Slide In',
  category: 'slide',
  duration: 400,
  easing: 'ease-out',
  description: 'Slide in from left',
  keyframes: [
    { offset: 0, properties: { transform: 'translateX(-100%)' } },
    { offset: 1, properties: { transform: 'translateX(0)' } },
  ],
};
```

### Transformers

CSS 轉換邏輯：

```typescript
export class CssGenerator {
  /**
   * 生成 CSS animation 屬性
   */
  static generate(config: AnimationConfig): string {
    return `
      animation-name: ${config.name};
      animation-duration: ${config.duration}ms;
      animation-timing-function: ${config.easing};
      ${config.delay ? `animation-delay: ${config.delay}ms;` : ''}
      ${
        config.iterations
          ? `animation-iteration-count: ${config.iterations};`
          : ''
      }
    `.trim();
  }

  /**
   * 生成 CSS @keyframes
   */
  static generateKeyframes(name: string, keyframes: Keyframe[]): string {
    const frames = keyframes
      .map(kf => {
        const props = Object.entries(kf.properties)
          .map(([key, value]) => `${key}: ${value};`)
          .join(' ');
        return `${kf.offset * 100}% { ${props} }`;
      })
      .join('\n  ');

    return `@keyframes ${name} {\n  ${frames}\n}`;
  }
}
```

### Exporters

導出功能：

```typescript
export class JsonExporter {
  static export(preset: AnimationPreset): string {
    return JSON.stringify(preset, null, 2);
  }
}

export class CssExporter {
  static export(preset: AnimationPreset): string {
    const keyframes = CssGenerator.generateKeyframes(
      preset.name,
      preset.keyframes
    );
    const animation = CssGenerator.generate(preset);

    return `
      /* ${preset.description} */
      ${keyframes}

      .animated-${preset.id} {
        ${animation}
      }
    `;
  }
}
```

---

## 🎨 Sandbox 功能支援

此 lib 設計用於支援以下 Sandbox 功能：

1. **動畫預設庫** - 提供多種預設動畫
2. **參數調整** - 實時修改 duration, easing 等
3. **CSS 生成** - 自動生成可用的 CSS 代碼
4. **導出** - 導出為 JSON 或 CSS 格式
5. **解析** - 解析用戶輸入的 CSS（未來功能）

---

## 🔧 擴展

### 添加新的預設動畫

```typescript
// libs/animation-data/src/lib/presets/bounce.preset.ts
export const bouncePreset: AnimationPreset = {
  id: 'bounce',
  name: 'Bounce',
  category: 'bounce',
  duration: 500,
  easing: 'ease-in-out',
  description: 'Bouncing animation',
  keyframes: [
    { offset: 0, properties: { transform: 'translateY(0)' } },
    { offset: 0.5, properties: { transform: 'translateY(-20px)' } },
    { offset: 1, properties: { transform: 'translateY(0)' } },
  ],
};

// 在 presets/index.ts 導出
export const allPresets = [..., bouncePreset];
```

---

## 🧪 開發

```bash
# Build
nx build animation-data

# Test
nx test animation-data

# Lint
nx lint animation-data
```

---

## 🔗 相關文檔

- [Vue Motion App](../apps/VUE_MOTION.md)
- [動畫 Sandbox 定位](../apps/VUE_MOTION.md#專案定位)
- [Lib README](../../libs/animation-data/README.md)

---

**狀態**: ✅ 結構完成，基礎功能實現，待 Sandbox UI 整合
