---
id: tech-stack-data
name: Tech Stack Data
version: 0.0.1
description: Automatically collect and manage technology stack data from nx workspace
techStack:
  - TypeScript
  - Nx
  - Node.js
features:
  - Auto-collect from package.json
  - Manual data supplement
  - Project dependency analysis
  - Category classification
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# Tech Stack Data – 技術棧資料

(Technology Stack Management Library)

## Overview / 概念與定位

This is an **automated tech stack collector** that gathers and manages technology information from the Nx workspace.

Unlike manual tech lists, this library offers:

- Automatic extraction from package.json files
- Dependency analysis across projects
- Technology categorization (frontend, backend, tooling)
- Version tracking and compatibility checks
- Centralized tech stack data for display

The library demonstrates **workspace introspection** and **metadata extraction** capabilities.

---

## Core Capabilities / 核心能力

### 1. Auto-Collection

- Scans all package.json files in workspace
- Extracts dependencies and devDependencies
- Identifies framework and library versions
- Detects build tools and configurations
- Updates automatically when dependencies change

**Key Value**: Eliminates manual tech stack documentation, always accurate and up-to-date.

---

### 2. Categorization & Analysis

- Classifies technologies by type (UI, state, styling, etc.)
- Identifies shared vs. project-specific dependencies
- Detects version mismatches across projects
- Highlights unused dependencies
- Generates dependency graphs

**Key Value**: Provides insights into monorepo technology landscape and maintenance needs.

---

### 3. Display Data Generation

- Formats data for UI components (TechProfile, cards)
- Generates skill level indicators
- Creates timeline data for experience visualization
- Exports for portfolio display
- Customizable data transformations

**Key Value**: Powers the Tech Stack section in Profile app with real, current data.

---

## Technical Highlights / 技術亮點

| Aspect             | Description                                   |
| ------------------ | --------------------------------------------- |
| **Nx Integration** | Leverages Nx workspace structure and metadata |
| **Automation**     | Zero manual maintenance, self-updating        |
| **Type Safety**    | Generated TypeScript types for all tech data  |
| **Flexibility**    | Manual overrides for display customization    |

**Result**: Accurate, automated tech stack management reducing documentation overhead.

---

## Usage Scope / 使用範圍

**Applications**:

- Profile (TechProfile section, project tech badges)
- Future portfolio sites
- Tech stack visualization tools

**Data Sources**:

- All package.json files in workspace
- Manual supplements in config files
- Nx project metadata

---

## API & Integration / 整合方式

**Example Usage**:

```tsx
import { getTechStack, categorizeByType } from '@nx-playground/tech-stack-data';

function TechStackDisplay() {
  const allTech = getTechStack();
  const byCategory = categorizeByType(allTech);

  return (
    <div>
      {Object.entries(byCategory).map(([category, techs]) => (
        <TechCategory key={category} name={category} items={techs} />
      ))}
    </div>
  );
}
```

**Key Exports**:

- Tech stack collection functions
- Categorization utilities
- Type definitions for tech data
- Display formatters

---

## Quality Standards / 品質標準

**Data Accuracy**:

- Automated collection prevents stale data
- Version information always current
- Validation of extracted data

**Testing**:

- Unit tests for collection logic
- Integration tests with real workspace
- Data transformation tests

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/tech-stack-data/en.md` - English specification (this file)
- `specs/libs/tech-stack-data/zh-TW.md` - Traditional Chinese specification
- `libs/tech-stack-data/README.md` - Developer documentation

Note: Collection scripts and data format details can be found in the README.md.
