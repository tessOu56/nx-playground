# Profile Home Page Specification

## Overview

The home page serves as the primary landing page for the developer portfolio, designed to quickly showcase technical capabilities, featured projects, and professional experience. The page is optimized for attracting clients and employers with a clean, professional layout.

## Page Structure

The home page consists of 6 main sections arranged vertically:

1. **Hero Section** (TechProfile)
2. **Core Strengths**
3. **Featured Projects**
4. **Experience Timeline**
5. **Tech Stack** (SkillCloud)
6. **Contact Section**

---

## Section 1: Hero Section (TechProfile)

### Purpose
Quick introduction with site branding, tagline, short bio, and clear call-to-action buttons.

### Layout
- Full-width section with gradient background decorations
- Centered content with max-width container
- Responsive padding: `py-20 md:py-32`

### Elements

#### 1.1 Logo/Site Name
- **Component**: `<h1>` with gradient text
- **Styling**: 
  - Font size: `text-5xl md:text-6xl lg:text-7xl`
  - Gradient: `blue-600 → purple-600 → blue-600` (light mode)
  - Gradient: `blue-400 → purple-400 → blue-400` (dark mode)
- **Data Source**: `siteConfig.siteName`
- **Example**: "NX Playground"

#### 1.2 Decorative Divider
- Horizontal gradient line below logo
- Width: `w-24`, Height: `h-[2px]`
- Centered with `mx-auto`

#### 1.3 Tagline
- **Component**: `<h2>`
- **Styling**: 
  - Font size: `text-3xl md:text-4xl lg:text-5xl`
  - Color: `text-gray-900 dark:text-white`
- **Data Source**: `homeConfig.tagline[locale]`
- **Content**:
  - zh-TW: "專精 React 的前端架構規劃與技術探索"
  - en: "React Specialist with Frontend Architecture & Tech Exploration"

#### 1.4 Short Bio
- **Component**: Paragraph text
- **Styling**: 
  - Font size: `text-lg md:text-xl`
  - Color: `text-muted-foreground`
  - Max width: `max-w-2xl mx-auto`
- **Data Source**: `homeConfig.shortBio[locale]`
- **Content**: 2-3 sentence professional summary

#### 1.5 CTA Buttons
Two action buttons in a flex row (stack on mobile):

**Button 1: View Projects**
- Primary button style with blue background
- Links to: `/apps` (localized)
- Icon: Grid/Apps icon
- Shadow and hover effects

**Button 2: Contact Me**
- Secondary button style with border
- Scrolls to: `#contact` section
- Icon: Email icon
- Hover background transition

### i18n Keys
- `hero.viewProjects`
- `hero.contactMe`

---

## Section 2: Core Strengths

### Purpose
Highlight 4 key professional advantages at a glance.

### Layout
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Gap: `gap-6`
- Container: `max-w-6xl mx-auto`
- Padding: `py-16 md:py-20`

### Section Header
- Title: "Core Strengths" / "核心優勢"
- Centered, `text-3xl md:text-4xl font-bold`

### Strength Cards (4 cards)

Each card contains:
- **Icon Container**: 64x64px with colored background and rounded corners
- **Title**: `text-xl font-semibold`
- **Description**: `text-muted-foreground`
- **Hover Effect**: Lift animation (`hover:-translate-y-1`), shadow increase

#### Card 1: React Specialist
- **Icon**: Palette/Design icon
- **Color**: Blue (`bg-blue-100 dark:bg-blue-900/30`, `text-blue-600`)
- **Title (zh-TW)**: "React 專精"
- **Title (en)**: "React Specialist"
- **Description (zh-TW)**: "React 專精，多框架實踐經驗"
- **Description (en)**: "React specialist with multi-framework experience"

#### Card 2: Frontend Architecture
- **Icon**: Blueprint/Grid icon
- **Color**: Purple (`bg-purple-100 dark:bg-purple-900/30`, `text-purple-600`)
- **Title (zh-TW)**: "前端架構"
- **Title (en)**: "Frontend Architecture"
- **Description (zh-TW)**: "前端架構規劃與技術趨勢研究"
- **Description (en)**: "Frontend architecture design and tech trend research"

#### Card 3: Modern Tooling
- **Icon**: Settings/Gear icon
- **Color**: Green (`bg-green-100 dark:bg-green-900/30`, `text-green-600`)
- **Title (zh-TW)**: "現代工具鏈"
- **Title (en)**: "Modern Tooling"
- **Description (zh-TW)**: "Monorepo、設計系統等現代工具鏈實踐"
- **Description (en)**: "Hands-on with Monorepo, Design Systems, and modern toolchains"

#### Card 4: API Integration & Testing
- **Icon**: Link/Connection icon
- **Color**: Orange (`bg-orange-100 dark:bg-orange-900/30`, `text-orange-600`)
- **Title (zh-TW)**: "API 整合與測試"
- **Title (en)**: "API Integration & Testing"
- **Description (zh-TW)**: "API 整合設計與 Mock 測試實踐"
- **Description (en)**: "API integration design with Mock testing practices"

### i18n Keys
- `strengths.title`
- `strengths.reactSpecialist`
- `strengths.reactSpecialistDesc`
- `strengths.frontendArchitecture`
- `strengths.frontendArchitectureDesc`
- `strengths.modernTooling`
- `strengths.modernToolingDesc`
- `strengths.apiIntegration`
- `strengths.apiIntegrationDesc`

---

## Section 3: Featured Projects

### Purpose
Showcase top 3 production-ready applications with quick access to details.

### Layout
- Background: `bg-gray-50 dark:bg-gray-900/50`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap: `gap-8`
- Padding: `py-16 md:py-20`

### Section Header
- Title: "Featured Projects" / "精選專案"
- Centered, `text-3xl md:text-4xl font-bold`

### Data Source
- **Store**: `useProjectsStore`
- **Filter**: Apps with `status === 'production'`
- **Limit**: Top 3 projects
- **Sort**: As returned from store

### Project Card

Each card is a clickable link to the project detail page.

#### Card Structure
1. **Image Placeholder**
   - Height: `h-48`
   - Background: Gradient with grid pattern
   - Icon: Large grid/app icon (decorative)

2. **Content Area** (`p-6`)
   - **Title**: Project name, `text-xl font-semibold`
   - **Description**: Short description or excerpt, `line-clamp-2`
   - **Tech Stack**: Up to 4 tech tags (compact size), with "+N" indicator if more
   - **View Detail Link**: Text with arrow icon, hover animation

#### Interactions
- **Hover**: Card shadow increases, title color changes to primary
- **Click**: Navigate to `/apps/{appId}` (localized)
- **Tech Tags Click**: Navigate to `/blogs?tag={techName}` for search

### "View All" Link
Below the grid, centered link to `/apps` page.

### i18n Keys
- `featured.title`
- `featured.viewDetail`
- `featured.viewAll`

---

## Section 4: Experience Timeline

### Purpose
Display professional background and key milestones in chronological order.

### Layout
- Vertical timeline with center line
- Alternating left/right on desktop, single-sided on mobile
- Container: `max-w-4xl mx-auto`
- Padding: `py-16 md:py-20`

### Section Header
- Title: "Experience & Milestones" / "經驗與里程碑"
- Centered, `text-3xl md:text-4xl font-bold`

### Timeline Structure

#### Center Line
- Vertical gradient line: `blue → purple`
- Position: Absolute, centered on desktop, left-aligned on mobile

#### Year Markers
- Circular badges on the timeline
- Size: `w-16 h-16`
- White background with primary border
- Contains year text
- Position: Centered on timeline

#### Content Cards

Each milestone has:
- **Year**: Displayed in circular badge
- **Title**: `text-xl font-semibold`
- **Description**: Paragraph text with `text-muted-foreground`
- **Card Background**: White with border and shadow
- **Layout**: Alternates left/right on desktop (even/odd index)

### Data Source
- **Config**: `homeConfig.experience[]`
- **Structure**: Array of objects with `year`, `title`, `description`

### Current Milestones

1. **2024: Nx Monorepo 架構實踐**
   - Built multi-framework monorepo projects
   - Design systems and shared libraries
   - Modern toolchain integration

2. **2023: React 生態系深度探索**
   - React 19, Next.js 15 research
   - State management practices
   - Performance optimization

3. **2022: 多框架開發經驗**
   - Angular, Vue hands-on experience
   - Cross-framework technical perspective

### i18n Keys
- `experience.title`

---

## Section 5: Tech Stack (SkillCloud)

### Purpose
Display comprehensive list of technologies and tools, organized by category.

### Layout
- White background (default)
- Border-top separator
- Container: `max-w-6xl mx-auto`
- Padding: `py-16 md:py-20`

### Section Header
- Title: "Tech Stack" / "技術堆疊"
- Subtitle: "Technologies and tools I work with" / "我使用的技術與工具"
- Centered

### Technology Categories

Technologies are grouped by category:
- **Frontend** (前端)
- **Backend** (後端)
- **DevOps**
- **Tools** (工具)

#### Category Display
- Category title: `text-2xl font-semibold`
- Tech tags: Clickable buttons with hover effects
- Layout: Flex wrap with gaps

### Data Source
- **Library**: `@nx-playground/tech-stack-data`
- **Imports**: `techStack`, `techCategories`
- **Grouping**: Client-side grouping by `tech.category`

### Tech Tags
- **Component**: `TechTag` (shared component)
- **Interaction**: Click to search in blogs (`/blogs?tag={name}`)
- **Styling**: Category-based colors
- **Size**: Default size (not compact)

### Footer Hint
Below all categories:
- Info text: "💡 Click any tech tag to search related documentation"
- Small, muted text
- Centered

### i18n Keys
- `skills.title`
- `skills.subtitle`
- `skills.searchHint`

---

## Section 6: Contact Section

### Purpose
Provide multiple contact methods with clear calls-to-action.

### Layout
- Background: `bg-muted/30`
- Container: `max-w-4xl mx-auto`
- Padding: `py-16 md:py-20`

### Section Header
- Title: "Get In Touch" / "聯絡方式"
- Subtitle: "Feel free to reach out..." / "歡迎與我聯繫..."
- Centered

### Availability Badge
- Green badge with animated pulse dot
- Text: `homeConfig.availability[locale]`
- Example: "Open for freelance projects and full-time opportunities"
- Centered above contact cards

### Contact Cards

Grid layout: `grid-cols-1 md:grid-cols-2`

Cards are conditionally rendered based on available contact info:

#### Email Card (if `homeConfig.contact.email` exists)
- **Icon**: Email/envelope icon (blue theme)
- **Title**: "Email" / "電子郵件"
- **Content**: Email address (break-all)
- **Button**: "Send Email" / "發送郵件"
- **Action**: Opens `mailto:` link

#### GitHub Card (if `homeConfig.contact.github` exists)
- **Icon**: GitHub logo (gray theme)
- **Title**: "GitHub"
- **Content**: "Check out my open source projects" / "查看我的開源專案"
- **Button**: "View on GitHub" / "前往 GitHub"
- **Action**: Opens GitHub profile in new tab

#### LinkedIn Card (if `homeConfig.contact.linkedin` exists)
- **Icon**: LinkedIn logo (blue theme)
- **Title**: "LinkedIn"
- **Content**: "Connect with me on LinkedIn"
- **Button**: "View on LinkedIn" / "前往 LinkedIn"
- **Action**: Opens LinkedIn profile in new tab
- **Layout**: Full width (spans 2 columns on desktop)

### Card Styling
- White background with shadow
- Hover: Shadow increases
- Icon: Centered with gradient background circle
- Button: Colored background matching card theme

### i18n Keys
- `contact.title`
- `contact.subtitle`
- `contact.email`
- `contact.sendEmail`
- `contact.github`
- `contact.githubProfile`
- `contact.viewGitHub`
- `contact.linkedin`
- `contact.viewLinkedIn`
- `contact.availability`

---

## Data Configuration

### homeConfig.ts

```typescript
interface HomeConfig {
  tagline: { 'zh-TW': string; en: string };
  shortBio: { 'zh-TW': string; en: string };
  contact: {
    email?: string;
    github?: string;
    linkedin?: string;
  };
  availability: { 'zh-TW': string; en: string };
  experience: Experience[];
}

interface Experience {
  year: string;
  title: { 'zh-TW': string; en: string };
  description: { 'zh-TW': string; en: string };
}
```

### siteConfig.ts

```typescript
interface SiteConfig {
  siteName: string;
  siteUrl: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}
```

---

## Responsive Behavior

### Mobile (< 768px)
- Hero: Single column, stacked buttons
- Core Strengths: 1 column grid
- Featured Projects: 1 column grid
- Experience Timeline: Left-aligned, single-sided
- Tech Stack: Full width tags
- Contact: 1 column grid

### Tablet (768px - 1024px)
- Hero: Centered, side-by-side buttons
- Core Strengths: 2x2 grid
- Featured Projects: 2 columns
- Experience Timeline: Still left-aligned
- Tech Stack: Wrapped tags
- Contact: 2 columns

### Desktop (> 1024px)
- Hero: Optimal spacing
- Core Strengths: 4 columns
- Featured Projects: 3 columns
- Experience Timeline: Alternating left/right
- Tech Stack: Full width display
- Contact: 2 columns (LinkedIn spans full)

---

## Interactions

### Navigation
- **View Projects** button → `/apps`
- **Contact Me** button → Smooth scroll to `#contact`
- **Featured Project card** → `/apps/{appId}`
- **View All Projects** link → `/apps`
- **Tech tags** → `/blogs?tag={name}`
- **Contact buttons** → External links (email/GitHub/LinkedIn)

### Hover States
- All cards: Shadow increase + slight lift
- Buttons: Background color change
- Links: Underline or color change
- Tech tags: Scale up + shadow

### Animations
- Availability badge: Pulse animation on dot
- CTA buttons: Smooth transitions
- Card hovers: Transform + shadow transitions
- Featured project arrow: Translate on hover

---

## Accessibility

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic section elements
- Link vs button distinction

### ARIA
- Buttons have descriptive text
- Links have proper labels
- Images have decorative icons (aria-hidden where appropriate)

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states visible
- Logical tab order

### Color Contrast
- All text meets WCAG AA standards
- Separate colors for light/dark modes
- Gradient text has fallback solid colors

---

## Performance Considerations

### Data Loading
- Featured projects: Loaded once from Zustand store
- Tech stack: Static import from library
- Config data: Static imports
- Images: Placeholder only (no actual images loaded)

### Code Splitting
- Each component is separately importable
- i18n loaded per feature
- Store only loaded when used

### Rendering
- No heavy computations in render
- Memoized tech grouping
- Conditional rendering for optional sections

---

## Future Enhancements

### Phase 2 Considerations
- Add React animation library for Hero section
- Implement smooth scroll behavior
- Add loading states for featured projects
- Add project images (replace placeholders)
- Add view counter or analytics
- Add testimonials section
- Implement blog post preview section

