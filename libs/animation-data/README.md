# @nx-playground/animation-data

> 動畫數據處理函式庫

## 專案定位

此函式庫為 **vue-motion** (動畫 Sandbox 專案) 提供所有動畫數據處理邏輯。

## 設計原則

**關注點分離**：

- **此 Lib**: 動畫配置、轉換、導出邏輯
- **Vue App**: 僅負責動畫預覽 UI 和參數調整

## 資料夾結構

```
src/lib/
├── types/          # 動畫類型定義
├── presets/        # 預設動畫配置
├── transformers/   # CSS 轉換邏輯
└── exporters/      # 導出功能（JSON, CSS）
```

## 使用方式

### 在 Vue App 中使用

```typescript
import {
  allPresets,
  CssGenerator,
  JsonExporter,
} from '@nx-playground/animation-data';

// 使用預設動畫
const fadeIn = allPresets.find(p => p.id === 'fade-in');

// 生成 CSS
const css = CssGenerator.generate(fadeIn);

// 導出為 JSON
const json = JsonExporter.export(fadeIn);
```

## 功能

### Presets

預設的動畫配置（fade, slide, bounce 等）

### Transformers

- `CssGenerator.generate()` - 生成 CSS animation 屬性
- `CssGenerator.generateKeyframes()` - 生成 @keyframes
- `CssGenerator.parse()` - 解析 CSS 字串

### Exporters

- `JsonExporter.export()` - 導出為 JSON 格式
- `CssExporter.export()` - 導出為完整 CSS

## 開發

```bash
# Build
nx build animation-data

# Test
nx test animation-data

# Lint
nx lint animation-data
```
