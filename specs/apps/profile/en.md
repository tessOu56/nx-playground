---
id: 01-profile
name: Profile
version: 1.0.0
description: Professional portfolio website showcasing technical skills, projects, and knowledge through AI-powered search
techStack:
  - React 19
  - TypeScript
  - Vite 6
  - Tailwind CSS
  - Zustand
  - i18next
features:
  - Multi-page application (7 pages)
  - AI-powered knowledge search
  - Project and library showcase
  - Technical blog system
  - Multi-language support (en, zh-TW)
  - PWA with offline support
  - Mobile-first responsive design
status: production
category: react
published: true
lastUpdated: '2025-01-24'
---

# Profile – Professional Portfolio Website

## Overview / 概念與定位

This is an interactive **professional portfolio website** that serves as a digital resume.

Unlike static PDF resumes, it allows visitors to:

- Browse completed projects and work samples directly
- Ask questions in natural language (e.g., "What frontend projects do you have?")
- Read technical insights and career-related articles
- Access seamlessly on mobile, desktop, or even offline

The design functions like an **interactive digital business card**, presenting "what I can do, how I think, and what I've accomplished" in a short time.

---

## Core Features

### 1. Project Showcase

- Display all applications and components in card format
- Each project includes purpose, design rationale, and development progress
- Tags for filtering by domain (frontend, AI, product design, etc.)

**Key Value**: Clearly demonstrates technical scope and execution quality to recruiters or collaborators.

---

### 2. AI-Powered Search Assistant

- Visitors can input questions like: "Why use TypeScript?"
- System automatically answers based on website content and provides further reading
- Cross-page search (projects, blog, tech categories, etc.)

**Key Value**: Transforms portfolio into a "conversational resume" with AI-enhanced navigation.

---

### 3. Technical Blog

**Content Structure**:

- Automatically archived by year (continuously updated since inception)
- Includes practical cases, design thinking, tool comparisons, and learning logs
- Emphasizes decision-making context and implementation outcomes for each article

**Key Value**: Demonstrates long-term learning and analytical ability, not just results.

---

### 4. User Experience Design

- **Adaptive interface**: Switches theme based on dark/light background
- **Mobile-first design**: Full browsing on mobile devices
- **Speed optimization**: ~1.5 second load time
- **Offline capable**: Can be installed like an app
- **Bilingual interface**: Supports English and Traditional Chinese

**Key Value**: Ensures smooth usage across different devices, languages, and network conditions.

---

## Development Focus

| Aspect                       | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| **Architecture**             | Modular design allowing shared components across pages, easy maintenance |
| **Quality Control**          | Automated testing and checks with every update to ensure consistency     |
| **Performance Optimization** | Loads only necessary content, reducing wait time                         |
| **Internationalization**     | All copy supports bilingual switching (EN/zh-TW) in real-time            |

**Result**: Overall website maintains 90+ score on Google Lighthouse (speed, usability, SEO all excellent).

---

## Content Scope

- **Main Pages**: Home, Projects, Blog, Search, etc.
- **Feature Modules**: 20+ modules (search, language switching, filtering, etc.)
- **Multilingual Content**: Complete EN/zh-TW support
- **Offline Available**: Can browse without network after initial load

---

## Quality & Performance Metrics

| Metric                    | Industry Standard | Actual Result   | Status |
| ------------------------- | ----------------- | --------------- | ------ |
| **Load Time**             | Within 3 seconds  | ~1.5 seconds    | ✅     |
| **Overall Performance**   | Average site ~70  | 90+             | ✅     |
| **Mobile Responsiveness** | Required          | Fully supported | ✅     |
| **Accessibility**         | Basic compliance  | Passed          | ✅     |

**Conclusion**: Overall performance meets product-grade demonstration standards, stably presenting content with multi-device support.

---

## Maintenance & Updates

**Operation Flow**:

1. Install development environment
2. Start preview mode for adjustments
3. Automated testing and quality checks
4. One-click generation of production version

**Automation**:

- Only rebuilds updated portions
- Code remains clean, warning-free
- Automatic deployment to cloud platform

---

## Internationalization / Language Management

**Supported Languages**:

- English (default)
- Traditional Chinese (zh-TW)

**Structure Example**:

```
locales/
├── en/
│   └── home.json
└── zh-TW/
    └── home.json
```

---

## Deployment

**Primary Platform**: Cloudflare Pages

**Configuration Summary**:

- Build command: `nx build profile`
- Output: `dist/apps/profile`
- Node version: 20

**SPA Routing Support**:

```
/* /index.html 200
```

---

## License

MIT (Open for use and modification)

---

## Additional Documentation

- `specs/apps/profile/en.md` - English specification (this file)
- `specs/apps/profile/zh-TW.md` - Traditional Chinese specification
- `apps/profile/README.md` - Developer documentation

Note: Technical implementation details can be found in the README.md within the project directory.
