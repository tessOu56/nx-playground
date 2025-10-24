---
id: charts
name: Chart Components
version: 0.1.0
description: Chart component library with Chart.js and Recharts support
techStack:
  - Chart.js
  - Recharts
  - React 19
  - TypeScript
features:
  - Multiple chart types
  - Dual library support
  - Responsive design
  - Theme integration
status: production
category: ui
published: true
lastUpdated: '2025-01-24'
---

# Chart Components – 圖表元件庫

(Data Visualization Library)

## Overview / 概念與定位

This is a **chart component library** providing data visualization components with dual library support (Chart.js and Recharts).

Unlike direct library usage, this wrapper offers:

- Unified API across Chart.js and Recharts
- Consistent styling with Design System integration
- Responsive charts adapting to container size
- TypeScript support with strict typing
- Pre-configured common chart types

The library serves as the **visualization foundation**, demonstrating data presentation and component abstraction patterns.

---

## Core Capabilities / 核心能力

### 1. Multiple Chart Types

- Line, bar, pie, area, scatter charts
- Composed charts with multiple datasets
- Customizable axes and legends
- Interactive tooltips and labels
- Animation and transitions

**Key Value**: Covers all common data visualization needs with consistent API.

---

### 2. Dual Library Support

- Chart.js for canvas-based rendering
- Recharts for SVG-based charts
- Automatic library selection based on use case
- Fallback options for compatibility
- Performance optimization per library

**Key Value**: Best-of-both-worlds approach using the right tool for each scenario.

---

### 3. Theme Integration

- Automatic color scheme from Design System
- Dark mode support
- Custom color palettes
- Responsive font sizing
- Accessible color contrast

**Key Value**: Charts automatically match application theme without manual configuration.

---

## Technical Highlights / 技術亮點

| Aspect             | Description                                  |
| ------------------ | -------------------------------------------- |
| **Dual Libraries** | Chart.js (canvas) and Recharts (SVG) support |
| **Responsiveness** | Auto-resize with container observation       |
| **Type Safety**    | Full TypeScript for data and configuration   |
| **Theme Aware**    | Integrates with Design System tokens         |

**Result**: Flexible charting library for diverse visualization needs.

---

## Usage Scope / 使用範圍

**Applications**:

- Event-CMS (analytics dashboard)
- Enterprise-Admin (monitoring charts)
- Future apps requiring data visualization

**Chart Types**:

- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data

---

## API & Integration / 整合方式

**Example Usage**:

```tsx
import { LineChart, BarChart } from '@nx-playground/charts';

function Analytics() {
  const data = [
    { month: 'Jan', users: 100 },
    { month: 'Feb', users: 150 },
  ];

  return (
    <>
      <LineChart data={data} xKey='month' yKey='users' />
      <BarChart data={data} xKey='month' yKey='users' />
    </>
  );
}
```

---

## Quality Standards / 品質標準

**Performance**:

- Lazy loading for chart libraries
- Memoization to prevent unnecessary re-renders
- Efficient data transformation

**Documentation**:

- Examples for each chart type
- Configuration options documented
- Migration guide between libraries

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/charts/en.md` - English specification (this file)
- `specs/libs/charts/zh-TW.md` - Traditional Chinese specification
- `libs/charts/README.md` - Developer documentation
