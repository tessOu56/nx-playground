---
id: 02-design-system
name: Design System
version: 0.1.0
description: Design tokens and theming system with Style Dictionary integration
techStack:
  - Style Dictionary
  - CSS Variables
  - Tailwind CSS
  - TypeScript
features:
  - Design tokens
  - Multiple themes
  - CSS variables
  - Tailwind integration
  - Token visualization
status: production
category: ui
published: true
lastUpdated: '2025-01-24'
---

# Design System – 設計系統

(Design Tokens and Theming Foundation)

## Overview / 概念與定位

This is a **centralized design token system** that ensures visual consistency across all applications in the monorepo.

Unlike hardcoded design values, this system offers:
- Single source of truth for all design decisions (colors, spacing, typography)
- Platform-agnostic tokens transformable to any format
- Multiple theme support (light, dark, custom)
- Automatic synchronization across apps
- Visual token browser for designers and developers

The system serves as the **design foundation** for the entire platform, demonstrating systematic design thinking and scalability.

---

## Core Capabilities / 核心能力

### 1. Design Token Management

- Centralized token definitions (colors, spacing, typography, shadows)
- Semantic naming system (primary, secondary, surface, etc.)
- Token aliasing and references
- Automatic validation and type checking
- Version control for design changes

**Key Value**: One change updates all applications instantly, ensuring design consistency.

---

### 2. Multi-Theme Support

- Light and dark themes out of the box
- Custom theme creation with token overrides
- Theme switching without page reload
- Per-component theme customization
- Theme preview tool

**Key Value**: Flexible theming system supporting diverse brand requirements.

---

### 3. Cross-Platform Token Transform

- Style Dictionary for token transformation
- CSS variables for web applications
- Tailwind configuration generation
- TypeScript type definitions
- JSON exports for design tools

**Key Value**: Design tokens usable across any platform or framework.

---

## Technical Highlights / 技術亮點

| Aspect                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **Style Dictionary**    | Industry-standard token transformation pipeline           |
| **CSS Variables**       | Runtime theme switching without rebuild                   |
| **Tailwind Integration** | Auto-generated config from design tokens                 |
| **Type Safety**         | TypeScript definitions for all tokens                     |

**Result**: Scalable design system supporting multiple apps and themes.

---

## Usage Scope / 使用範圍

**Applications Using This Library**:
- All React apps (Profile, Event-CMS, Event-Portal, Auth)
- Tailwind config shared across projects
- CSS variables available globally

**Key Use Cases**:
- Consistent color palette across apps
- Standardized spacing and sizing
- Typography system
- Shadow and border radius standards

---

## API & Integration / 整合方式

**Token Usage in CSS**:
```css
.card {
  background: var(--color-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

**Token Usage in Tailwind**:
```tsx
<div className="bg-surface p-4 rounded-md shadow-sm">
  Content
</div>
```

**Key Exports**:
- CSS variables in `tokens.css`
- Tailwind config in `tailwind.config.js`
- TypeScript types in `tokens.ts`

---

## Quality Standards / 品質標準

**Validation**:
- Automatic token validation in build
- Type checking for token references
- No orphaned or undefined tokens

**Documentation**:
- Visual token browser
- Usage guidelines
- Migration guides for updates

**Maintenance**:
- Semantic versioning for breaking changes
- Changelog for all token updates
- Automated tests for token generation

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/design-system/en.md` - English specification (this file)
- `specs/libs/design-system/zh-TW.md` - Traditional Chinese specification
- `libs/design-system/README.md` - Developer documentation

Note: Token definitions and transformation setup can be found in the README.md.
