---
id: search-engine
name: Search Engine
version: 1.0.0
description: Custom search engine with keyword matching and intent detection
techStack:
  - TypeScript
  - Node.js
features:
  - Keyword matching
  - Intent detection
  - Search indexing
  - Response generation
  - Suggested questions
status: production
category: utils
published: true
lastUpdated: '2025-01-24'
---

# Search Engine – 搜尋引擎

(AI-Powered Knowledge Search Library)

## Overview / 概念與定位

This is a **custom-built search engine** providing intelligent keyword matching and intent detection without external AI dependencies.

Unlike simple text search, this engine offers:

- Intent detection understanding what users want to know
- Context-aware response generation
- Suggested follow-up questions
- Search index built from project/blog content
- Conversation session management

The library demonstrates **algorithm design** and **system architecture** skills, built entirely from scratch.

---

## Core Capabilities / 核心能力

### 1. Intelligent Keyword Matching

- Multi-field search across projects, blogs, and tech stack
- Fuzzy matching for typo tolerance
- Weighted scoring by field importance
- Synonym and related term expansion
- Category-aware filtering

**Key Value**: Finds relevant content even with imprecise queries.

---

### 2. Intent Detection

- Natural language query parsing
- Question type classification (what, how, why, where)
- Context extraction from queries
- Entity recognition (technologies, project names)
- Query reformulation for better results

**Key Value**: Understands user intent to provide more relevant answers.

---

### 3. Response Generation

- Template-based answer composition
- Content snippet extraction
- Related content suggestions
- Confidence scoring for answers
- Fallback responses for unknown queries

**Key Value**: Provides natural, conversational responses instead of just search results.

---

## Technical Highlights / 技術亮點

| Aspect                | Description                            |
| --------------------- | -------------------------------------- |
| **Zero Dependencies** | Built from scratch, no AI API costs    |
| **Type Safety**       | Full TypeScript with strict typing     |
| **Algorithm Design**  | Custom ranking and matching algorithms |
| **Performance**       | In-memory index for instant results    |

**Result**: Fast, cost-effective search without external API dependencies.

---

## Usage Scope / 使用範圍

**Applications**:

- Profile (AI-powered knowledge assistant)
- Future apps requiring intelligent search

**Search Domains**:

- Projects (apps and libs)
- Blog posts and articles
- Tech stack and skills
- General knowledge about work

---

## API & Integration / 整合方式

**Example Usage**:

```tsx
import { SearchEngine } from '@nx-playground/search-engine';

const engine = new SearchEngine();

// Build index from content
engine.indexProjects(projects);
engine.indexBlogs(blogs);

// Search
const results = engine.search('What React projects do you have?');
console.log(results.intent); // 'project_query'
console.log(results.response); // Generated answer
console.log(results.suggestions); // Follow-up questions
```

**Key Exports**:

- `SearchEngine` class
- Index builder utilities
- Intent classifier
- Response generator

---

## Quality Standards / 品質標準

**Accuracy**:

- Relevance testing with sample queries
- Intent classification accuracy tracking
- User feedback integration (planned)

**Performance**:

- Index building < 100ms
- Search response < 50ms
- Memory-efficient data structures

**Maintenance**:

- Regular algorithm improvements
- New intent patterns added
- Index optimization

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/search-engine/en.md` - English specification (this file)
- `specs/libs/search-engine/zh-TW.md` - Traditional Chinese specification
- `libs/search-engine/README.md` - Developer documentation

Note: Algorithm details and index structure can be found in the README.md.
