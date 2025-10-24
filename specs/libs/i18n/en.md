---
id: 03-i18n
name: Internationalization
version: 0.0.1
description: i18next-based internationalization solution with feature-level translations
techStack:
  - i18next
  - React
  - TypeScript
  - next-intl
features:
  - Feature-based namespaces
  - Language detection
  - SSR support
  - Type-safe keys
  - Dynamic loading
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Internationalization – 國際化函式庫

(i18next-based Multi-language Solution)

## Overview / 概念與定位

This is a **centralized internationalization library** enabling multi-language support across all applications with feature-level translation management.

Unlike basic translation files, this library offers:
- Feature-based namespace organization for scalability
- Automatic language detection and fallback
- Type-safe translation keys with IntelliSense
- Server-side rendering (SSR) support for Next.js
- Dynamic translation loading for performance

The library serves as the **i18n foundation** for the entire monorepo, demonstrating scalable translation architecture.

---

## Core Capabilities / 核心能力

### 1. Feature-Based Translation Organization

- Translations organized by feature/module, not globally
- Namespace isolation preventing key conflicts
- Lazy loading of feature translations
- Easy to maintain and scale
- Clear ownership of translation files

**Key Value**: Scalable i18n architecture that grows with the application without becoming unwieldy.

---

### 2. Automatic Language Management

- Browser language detection
- User preference persistence
- Fallback to default language if translation missing
- Dynamic language switching without reload
- Locale-specific date, number, currency formatting

**Key Value**: Seamless multi-language experience with intelligent fallbacks.

---

### 3. Developer Experience

- Type-safe translation keys with TypeScript
- IntelliSense autocomplete for all keys
- Missing translation warnings in development
- Hot reload for translation updates
- CLI tools for translation management

**Key Value**: Prevents translation errors and improves development speed.

---

## Technical Highlights / 技術亮點

| Aspect                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **i18next**             | Industry-standard i18n framework with rich ecosystem      |
| **Type Safety**         | Generated TypeScript types for all translation keys       |
| **SSR Support**         | next-intl for Next.js server-side rendering               |
| **Performance**         | Dynamic loading reduces initial bundle size               |

**Result**: Robust i18n system handling complex translation scenarios.

---

## Usage Scope / 使用範圍

**Applications Using This Library**:
- Profile (en, zh-TW)
- Event-Portal (en, zh-TW) with next-intl
- Event-CMS (en, zh-TW)
- Auth (en, zh-TW)

**Supported Languages**:
- English (en) - Default
- Traditional Chinese (zh-TW)
- Expandable to more languages

---

## API & Integration / 整合方式

**React Usage**:
```tsx
import { useTranslation } from '@nx-playground/i18n';

function MyComponent() {
  const { t } = useTranslation('featureName');
  
  return <h1>{t('welcome.title')}</h1>;
}
```

**Next.js Usage**:
```tsx
import { useTranslations } from 'next-intl';

function Page() {
  const t = useTranslations('featureName');
  
  return <h1>{t('welcome.title')}</h1>;
}
```

**Key Exports**:
- `createFeatureI18n()` - Feature translation factory
- Translation hooks with type safety
- Language switching utilities

---

## Quality Standards / 品質標準

**Translation Quality**:
- Native speaker reviews for zh-TW
- Consistent terminology across features
- Context-aware translations

**Testing**:
- Missing translation detection
- Placeholder validation
- Language switching tests

**Maintenance**:
- Regular translation audits
- Deprecated key cleanup
- Documentation for translators

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/i18n/en.md` - English specification (this file)
- `specs/libs/i18n/zh-TW.md` - Traditional Chinese specification
- `libs/i18n/README.md` - Developer documentation

Note: Translation file structure and usage guidelines can be found in the README.md.
