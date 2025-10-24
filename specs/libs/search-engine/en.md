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
lastUpdated: '2025-01-24'
category: utils
status: production
published: true

# Product Information
shortDesc: |
  Smart keyword search engine with intent detection and contextual suggestions,
  built from scratch without external AI dependencies.

purpose: |
  Provide intelligent search capabilities for Profile app, demonstrating
  algorithm design, system architecture, and software engineering skills.
  
  Built as a zero-dependency library to showcase:
  - Search algorithm implementation
  - Clean API design
  - Type-safe TypeScript architecture
  - Test-driven development approach

highlights:
  - Custom inverted index implementation
  - Multi-field keyword matching with scoring
  - Intent detection (project/blog/tech/general)
  - Contextual suggestion generation
  - Zero external dependencies
  - Full TypeScript type safety

# Library Metrics
stats:
  components: 4
  utilities: 6
  algorithms: 3

# Use Cases & Audience
useCases:
  - Profile app AI Search feature (Phase 1)
  - Knowledge base querying
  - Content discovery and exploration
  - Future: Extensible to other search needs

targetAudience: |
  Demonstrates to employers and clients:
  - Algorithm design skills (indexing, matching, scoring)
  - Software architecture (modular, extensible)
  - API design (clean interfaces, type safety)
  - Performance awareness (efficient search)

# Governance
reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

relatedDocs:
  - 'libs/search-engine/README.md'
  - 'apps/profile/AI_SEARCH_PLAN.md'

lastSync: '2025-10-24'
---

# Search Engine - Custom Smart Search Library

## Overview

A lightweight, zero-dependency search engine built from scratch to power the Profile app's AI Search feature. Demonstrates algorithm implementation, system design, and software engineering best practices.

---

## Architecture

### Core Components

1. **Indexer** (`indexer.ts`)
   - Builds inverted index from projects, blogs, tech stack
   - Extracts and normalizes keywords
   - Creates searchable data structures

2. **Matcher** (`matcher.ts`)
   - Keyword extraction and normalization
   - Multi-field search with scoring
   - Intent detection algorithm
   - Result ranking and sorting

3. **Suggestions** (`suggestions.ts`)
   - Contextual follow-up question generation
   - Intent-based suggestions
   - Keyword-based contextual hints
   - Conversation flow optimization

4. **Templates** (`templates.ts`)
   - Response generation based on intent
   - Natural language formatting
   - Error handling messages
   - No-results fallbacks

---

## Algorithm Design

### Search Scoring

```
Score Calculation:
- Name match: +5 points
- Description match: +3 points
- Keyword match: +2 points
- Tech stack match: +2 points
- Content match: +1 point
```

### Intent Detection

Pattern matching for query classification:
- **Project**: "project", "app", "build", "built"
- **Blog**: "blog", "article", "post", "write"
- **Tech**: "technology", "tech stack", "use", "tool"
- **General**: Fallback for exploratory queries

### Suggestion Generation

Two-tier approach:
1. **Contextual**: Based on query keywords (React → "What React patterns?")
2. **Intent-based**: Based on detected intent (project → "Show architecture")

Shuffle and take top 5 for variety.

---

## Technical Achievements

### Performance
- O(n) search complexity with indexed lookup
- Minimal memory footprint
- No external dependencies = smaller bundle
- Lazy evaluation where possible

### Code Quality
- 100% TypeScript coverage
- Clean separation of concerns
- Extensive JSDoc comments
- Modular, testable design

### API Design
- Simple, intuitive interfaces
- Type-safe contracts
- Predictable behavior
- Easy to extend

---

## Integration Example

```typescript
// Build index once
const index = buildSearchIndex({ projects, blogs, techStack });

// Search
const results = searchItems(query, index.projects, 10);

// Detect intent
const intent = detectIntent(query);

// Generate response
const response = generateResponse(query, results, intent);

// Get suggestions
const suggestions = generateSuggestedQuestions(messages, intent);
```

---

## Future Enhancements

### Phase 2 - RAG Integration
- Vector embeddings
- Semantic search
- OpenAI integration
- Streaming responses

### Phase 3 - Advanced Features
- Fuzzy matching
- Synonym handling
- Search analytics
- Query optimization

---

## Lessons Learned

### What Worked
- Simple scoring system is effective
- Intent detection improves relevance
- Contextual suggestions enhance UX
- Zero dependencies = better performance

### Challenges
- Balancing simplicity with functionality
- Generating natural responses without AI
- Handling edge cases (empty results, malformed queries)

---

## Impact

**For Profile App**:
- Enables AI Search feature without API costs
- Provides good UX for knowledge discovery
- Foundation for future AI integration

**For Portfolio**:
- Demonstrates algorithm design skills
- Shows system architecture thinking
- Proves ability to build from scratch
- Evidence of engineering depth

---

**Status**: Production Ready  
**Next Steps**: Phase 2 (OpenAI integration)

