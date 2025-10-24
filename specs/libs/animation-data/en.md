---
id: animation-data
name: Animation Data
version: 0.0.1
description: Animation data management for Vue motion applications
techStack:
  - Vue 3
  - TypeScript
features:
  - Animation presets
  - Data transformers
  - Export utilities
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# Animation Data – 動畫資料

(Animation Data Management for Vue)

## Overview / 概念與定位

This is an **animation data management library** supporting Vue Motion Sandbox with structured preset storage and transformation utilities.

Unlike inline animation configurations, this library offers:

- Reusable animation presets library
- Data transformers for different animation libraries
- Import/export functionality for sharing
- TypeScript support for animation configurations
- Validation for animation data structures

The library serves Vue applications needing **structured animation data management**.

---

## Core Capabilities / 核心能力

### 1. Animation Preset Library

- Pre-built animation configurations
- Categorized by type (enter, exit, attention, etc.)
- Customizable parameters
- Version tracking for presets
- Search and filter presets

**Key Value**: Reusable animation patterns accelerating motion design development.

---

### 2. Data Transformation

- Convert between GSAP, Three.js, Lottie formats
- Normalize animation timing and easing
- Scale and adjust animations programmatically
- Batch transformations for collections
- Validation and error handling

**Key Value**: Enables animation reuse across different libraries and contexts.

---

### 3. Import/Export System

- Save animation configurations as JSON
- Load presets from files
- Share presets with team
- Export code snippets for direct use
- Versioned preset format

**Key Value**: Facilitates collaboration and animation asset management.

---

## Technical Highlights / 技術亮點

| Aspect          | Description                                   |
| --------------- | --------------------------------------------- |
| **Vue 3**       | Composable data layer for Vue applications    |
| **Type Safety** | TypeScript definitions for all animation data |
| **Validation**  | Runtime validation preventing invalid configs |
| **Modularity**  | Framework-agnostic core with Vue wrappers     |

**Result**: Organized animation data layer supporting creative development.

---

## Usage Scope / 使用範圍

**Applications**:

- Vue Motion Sandbox (primary consumer)
- Future Vue animation projects

**Use Cases**:

- Store reusable animation patterns
- Transform animations between libraries
- Share animation configurations
- Validate animation data

---

## API & Integration / 整合方式

**Example Usage**:

```tsx
import { getPreset, transformToGSAP } from '@nx-playground/animation-data';

const fadeInPreset = getPreset('fadeIn');
const gsapConfig = transformToGSAP(fadeInPreset);

// Use in GSAP
gsap.from('.element', gsapConfig);
```

---

## Quality Standards / 品質標準

**Validation**:

- Schema validation for all presets
- Type checking at compile and runtime
- Error messages for invalid configurations

**Documentation**:

- Preset catalog with examples
- Transformation guides
- API reference

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/animation-data/en.md` - English specification (this file)
- `libs/animation-data/README.md` - Developer documentation
