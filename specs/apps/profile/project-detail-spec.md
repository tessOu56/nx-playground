# Project Detail Page Specification

## Overview

The Project Detail page provides comprehensive information about a single app or library project. It displays all available data from README, PRD (Spec), and CHANGELOG in a well-organized, scannable format.

## Page Types

Two pages use the same `ProjectDetail` component:

- **AppDetailPage**: `/apps/{appId}` - Application details
- **LibDetailPage**: `/libs/{libId}` - Library details

## Component Location

**Files**:

- `apps/profile/src/features/detail/components/ProjectDetail.tsx` - Main component
- `apps/profile/src/features/detail/pages/AppDetailPage.tsx` - Apps wrapper
- `apps/profile/src/features/detail/pages/LibDetailPage.tsx` - Libs wrapper

## Props Interface

```typescript
interface ProjectDetailProps {
  project: ProjectData; // Full merged project data
  type: 'app' | 'lib'; // Determines back button and routing
}
```

## Data Loading

### Page-Level Loading (AppDetailPage / LibDetailPage)

1. **Extract URL params**: `{ appId/libId, locale }`
2. **Load data**: Call `loadApp(id, locale)` or `loadLib(id, locale)`
3. **Loading state**: Show loading spinner
4. **Error state**: Show "not found" message
5. **Success state**: Render `<ProjectDetail>` with data

### Data Sources

- **README**: `readmeLoader.ts` - Tech docs from project README files
- **Spec**: `specLoader.ts` - Product specs from `/specs/{type}/{id}/`
- **Changelog**: `changelogLoader.ts` - Version history from CHANGELOG files
- **Merged**: `projectLoader.ts` - Combines all three sources

---

## Page Structure

The detail page consists of 13 sections in this order:

1. Back Button
2. Header Section
3. Metadata Bar
4. Purpose & Description
5. Tech Stack
6. Key Features
7. Technical Highlights
8. Use Cases
9. Target Audience
10. Stats (libs only)
11. Documentation (README + Spec)
12. Changelog
13. Links & Resources

---

## Section 1: Back Button

### Purpose

Navigate back to the list page (apps or libs).

### Elements

- **Link**: `<Link to={backPath}>`
- **Icon**: Left arrow SVG
- **Text**:
  - Apps: "← Back to Applications" / "← 返回應用程式"
  - Libs: "← Back to Libraries" / "← 返回函式庫"
- **Styling**: Blue link with hover underline
- **i18n**: `backToApps` / `backToLibs`

---

## Section 2: Header Section

### Purpose

Display project name and short description prominently.

### Elements

#### 2.1 Project Name

- **Element**: `<h1>`
- **Content**: `project.name`
- **Styling**:
  - Font: `text-5xl font-bold`
  - Color: `text-gray-900 dark:text-white`
  - Margin: `mb-4`

#### 2.2 Short Description

- **Element**: Paragraph
- **Content**: `project.shortDesc || project.description`
- **Styling**:
  - Font: `text-xl`
  - Color: `text-gray-600 dark:text-gray-400`

---

## Section 3: Metadata Bar

### Purpose

Display key metadata at a glance: Status, Version, Category.

### Layout

- **Container**: White card with shadow
- **Grid**: `grid-cols-1 md:grid-cols-3`
- **Gap**: `gap-6`
- **Padding**: `p-6`

### Metadata Items

Each item has:

- Icon container (40x40px, gray background, rounded)
- Label (small, muted)
- Value (large, prominent)

#### 3.1 Status

- **Icon**: Checkmark in circle
- **Label**: "Status" / "狀態"
- **Value**: Badge with color
  - Production: Green (`bg-green-100 text-green-800`)
  - Development: Blue (`bg-blue-100 text-blue-800`)
  - Coming Soon: Yellow (`bg-yellow-100 text-yellow-800`)
- **i18n**: `status`, `statusProduction`, `statusDevelopment`, `statusComingSoon`

#### 3.2 Version

- **Icon**: Tag
- **Label**: "Version" / "版本"
- **Value**: `v{project.version}`
- **Styling**: `text-lg font-semibold`
- **i18n**: `version`

#### 3.3 Category

- **Icon**: Palette/Design
- **Label**: "Category" / "分類"
- **Value**: `project.category` (capitalized)
- **Styling**: `text-lg font-semibold capitalize`
- **i18n**: `category`

---

## Section 4: Purpose & Description

### Purpose

Explain the project's purpose and goals.

### Display Condition

Only if `project.purpose` exists.

### Elements

- **Title**: "Purpose" / "專案目的"
- **Content**: `project.purpose`
- **Styling**: Large paragraph with relaxed line height
- **i18n**: `purpose`

---

## Section 5: Tech Stack

### Purpose

Display all technologies used in the project.

### Display Condition

Only if `project.techStack` exists and has items.

### Elements

- **Title**: "Tech Stack" / "技術堆疊"
- **Tags**: All tech items (no limit)
- **Layout**: Flex wrap with gaps
- **Component**: `<TechTag>` for each item
- **Interaction**: Click to search in blogs
- **i18n**: `techStack`

---

## Section 6: Key Features

### Purpose

List main features from README.

### Display Condition

Only if `project.features` exists and has items.

### Elements

- **Title**: "Key Features" / "主要功能"
- **List**: Unordered list with checkmark icons
- **Icon**: Green checkmark SVG
- **Styling**: Space-y-3, flex layout for icon+text
- **i18n**: `keyFeatures`

---

## Section 7: Technical Highlights

### Purpose

Showcase technical achievements and notable implementations.

### Display Condition

Only if `project.highlights` exists and has items.

### Elements

- **Title**: "Technical Highlights" / "技術亮點"
- **Items**: Numbered boxes (1, 2, 3...)
- **Layout**:
  - Gray background boxes
  - Numbered badge on left (blue circle)
  - Text on right
- **Styling**: `space-y-4` between items
- **i18n**: `highlights`

---

## Section 8: Use Cases

### Purpose

Describe practical use cases for the project.

### Display Condition

Only if `project.useCases` exists and has items.

### Elements

- **Title**: "Use Cases" / "使用場景"
- **List**: Unordered list with document icons
- **Icon**: Blue document/clipboard SVG
- **Styling**: Similar to Key Features
- **i18n**: `useCases`

---

## Section 9: Target Audience

### Purpose

Describe who the project is for.

### Display Condition

Only if `project.targetAudience` exists.

### Elements

- **Title**: "Target Audience" / "目標用戶"
- **Content**: `project.targetAudience`
- **Styling**: Large paragraph
- **i18n**: `targetAudience`

---

## Section 10: Stats

### Purpose

Display library statistics (components, hooks, utilities count).

### Display Condition

Only if `project.stats` exists (typically libs only).

### Layout

- **Grid**: `grid-cols-1 md:grid-cols-3`
- **Items**: Up to 3 stat cards

### Stat Cards

Each card shows:

- Colored icon background (blue/green/purple)
- Large number (`text-3xl font-bold`)
- Label below number

#### 10.1 Components

- **Icon**: Grid/Layout icon
- **Color**: Blue
- **Value**: `project.stats.components`
- **Label**: "Components" / "組件"

#### 10.2 Hooks

- **Icon**: Lightning bolt
- **Color**: Green
- **Value**: `project.stats.hooks`
- **Label**: "Hooks"

#### 10.3 Utilities

- **Icon**: Settings/Gear
- **Color**: Purple
- **Value**: `project.stats.utilities`
- **Label**: "Utilities" / "工具函式"

**i18n**: `stats`, `statsComponents`, `statsHooks`, `statsUtilities`

---

## Section 11: Documentation

### Purpose

Display README and Spec content in a single scrollable section.

### Display Condition

Only if `project.readmeContent` OR `project.specContent` exists.

### Structure

#### 11.1 Section Title

- "Documentation" / "專案文檔"

#### 11.2 README Content (if exists)

- **Subtitle**: "README"
- **Content**: HTML from parsed Markdown
- **Styling**:
  - Prose classes: `prose dark:prose-invert max-w-none`
  - Custom prose colors for headings, paragraphs, links
- **Separator**: Border-bottom after README

#### 11.3 Spec Content (if exists)

- **Subtitle**: "Specification" / "規格說明"
- **Content**: HTML from parsed Markdown
- **Styling**: Same prose classes as README

### Prose Customization

```css
prose-headings:text-gray-900 dark:prose-headings:text-white
prose-p:text-gray-700 dark:prose-p:text-gray-300
prose-a:text-blue-600 dark:prose-a:text-blue-400
```

**i18n**: `documentation`, `readme`, `specContent`

---

## Section 12: Changelog

### Purpose

Display version history with expand/collapse functionality.

### Display Condition

Only if `project.changelog` exists and has releases.

### Layout

#### 12.1 Section Title

- "Version History" / "版本歷史"

#### 12.2 Version List

- Default: Show first 3 releases
- Expanded: Show all releases
- State: `useState(showAllVersions)`

### Release Card

Each release displays:

#### Header

- **Version**: `v{release.version}` (large, bold)
- **Type Badge**: Color-coded by type
  - Major: Red
  - Minor: Blue
  - Patch: Gray
- **Date**: `release.date` (muted color)

#### Changes

All change types are conditionally rendered:

1. **Breaking Changes** (⚠️)

   - Color: Red, bold
   - Display first if exists
   - i18n: `changelogBreaking`

2. **Added** (✨)

   - Color: Green
   - i18n: `changelogAdded`

3. **Changed** (🔄)

   - Color: Blue
   - i18n: `changelogChanged`

4. **Fixed** (🐛)

   - Color: Purple
   - i18n: `changelogFixed`

5. **Removed** (🗑️)

   - Color: Red
   - i18n: `changelogRemoved`

6. **Deprecated** (⚠️)

   - Color: Orange
   - i18n: `changelogDeprecated`

7. **Security** (🔒)
   - Color: Yellow
   - i18n: `changelogSecurity`

### Expand/Collapse Button

**Display Condition**: Only if more than 3 releases

**Button**:

- Full width
- Gray background
- Text: "Show All Versions ({count})" / "Hide Versions"
- Toggle: `setShowAllVersions(!showAllVersions)`

**i18n**: `showAllVersions`, `hideVersions`, `changelog`

---

## Section 13: Links & Resources

### Purpose

Provide links to demo and source code.

### Layout

- **Grid**: `grid-cols-1 md:grid-cols-2`
- **Gap**: `gap-4`

### Link Buttons

#### 13.1 Demo Link

**Display**: Always (enabled or disabled)

**Enabled State** (if `project.demoUrl` exists):

- Blue button with external link icon
- Opens in new tab
- Text: "View Demo" / "查看展示"

**Disabled State** (if no demoUrl):

- Gray button, not clickable
- Lock icon
- Text: "Coming Soon" / "即將推出"
- Cursor: not-allowed

#### 13.2 GitHub Link

**Display Condition**: Only if `project.repoUrl` exists

**Elements**:

- Border button (secondary style)
- GitHub logo icon
- Opens in new tab
- Text: "View on GitHub" / "在 GitHub 上查看"

**i18n**: `links`, `viewDemo`, `viewGitHub`, `comingSoon`

---

## Responsive Behavior

### Mobile (< 768px)

- Metadata bar: 1 column stack
- Stats: 1 column stack
- Links: 1 column stack
- All sections full width

### Tablet (768px - 1024px)

- Metadata bar: 3 columns
- Stats: 3 columns
- Links: 2 columns
- Content max-width: 5xl

### Desktop (1024px+)

- All grids at full columns
- Optimal reading width
- Hover states fully visible

---

## State Management

### Component State

```typescript
const [showAllVersions, setShowAllVersions] = useState(false);
```

Used for changelog expansion.

### Page-Level State (in AppDetailPage / LibDetailPage)

```typescript
const [project, setProject] = useState<AppData | null>(null);
const [loading, setLoading] = useState(true);
```

Loading states:

- `loading === true`: Show loading spinner
- `project === null`: Show "not found" message
- `project`: Render ProjectDetail

---

## Helper Functions

### getStatusBadgeColor(status)

Maps status to Tailwind classes:

- `production` → Green
- `development` → Blue
- `coming-soon` → Yellow
- Default → Gray

### getStatusText(status)

Maps status to translated text using i18n.

### getChangeTypeColor(type)

Maps changelog change type to color classes:

- `added` → Green
- `changed` → Blue
- `fixed` → Purple
- `removed` → Red
- `deprecated` → Orange
- `security` → Yellow
- `breaking` → Red (bold)

---

## Styling Guidelines

### Container

- **Background**: Gradient `from-gray-50 to-white` (light), `from-gray-900 to-gray-800` (dark)
- **Padding**: `py-12 px-4`
- **Max width**: `max-w-5xl mx-auto`

### Section Cards

All content sections use consistent styling:

- **Background**: `bg-white dark:bg-gray-800`
- **Border**: `rounded-xl`
- **Shadow**: `shadow-lg`
- **Padding**: `p-8`
- **Margin**: `mb-8` (space between sections)

### Typography

- **Section titles (h2)**: `text-3xl font-bold text-gray-900 dark:text-white mb-6`
- **Subsection titles (h3)**: `text-2xl font-semibold text-gray-800 dark:text-gray-200`
- **Body text**: `text-gray-700 dark:text-gray-300`
- **Muted text**: `text-gray-600 dark:text-gray-400`

### Colors & Themes

- Consistent use of gray scale for text
- Primary blue for links and actions
- Semantic colors for status and change types
- Full dark mode support

---

## Conditional Rendering Logic

### Always Rendered

- Back button
- Header (name + description)
- Metadata bar (status, version, category)
- Links section (even if disabled)

### Conditionally Rendered

Each section checks for data before rendering:

```typescript
{
  project.purpose && <PurposeSection />;
}
{
  project.techStack?.length > 0 && <TechStackSection />;
}
{
  project.features?.length > 0 && <FeaturesSection />;
}
{
  project.highlights?.length > 0 && <HighlightsSection />;
}
{
  project.useCases?.length > 0 && <UseCasesSection />;
}
{
  project.targetAudience && <TargetAudienceSection />;
}
{
  project.stats && <StatsSection />;
}
{
  (project.readmeContent || project.specContent) && <DocumentationSection />;
}
{
  project.changelog?.releases.length > 0 && <ChangelogSection />;
}
```

---

## i18n Support

### Translation Hook

```typescript
const { t } = useDetailTranslation();
```

### Translation Keys

**Navigation**:

- `backToApps`, `backToLibs`

**Metadata**:

- `status`, `version`, `category`
- `statusProduction`, `statusDevelopment`, `statusComingSoon`

**Sections**:

- `purpose`, `techStack`, `keyFeatures`, `highlights`
- `useCases`, `targetAudience`, `stats`
- `documentation`, `readme`, `specContent`, `changelog`

**Stats**:

- `statsComponents`, `statsHooks`, `statsUtilities`

**Changelog**:

- `changelogAdded`, `changelogChanged`, `changelogFixed`
- `changelogRemoved`, `changelogDeprecated`, `changelogSecurity`, `changelogBreaking`
- `showAllVersions`, `hideVersions`

**Links**:

- `links`, `viewDemo`, `viewGitHub`, `comingSoon`

### Translation Files

- `apps/profile/src/features/detail/locales/en/detail.json`
- `apps/profile/src/features/detail/locales/zh-TW/detail.json`

---

## Interactions

### Navigation

- **Back button**: Navigate to `/apps` or `/libs`
- **Tech tags**: Navigate to `/blogs?tag={name}` for search
- **Demo button**: Open demo URL in new tab (if available)
- **GitHub button**: Open repo URL in new tab (if available)

### Expand/Collapse

- **Changelog**: Toggle between 3 and all versions
- **State**: Local useState
- **Button**: Full-width toggle at bottom of changelog

### Smooth Scroll

- No scroll behavior implemented
- All content loads immediately
- No lazy loading

---

## Data Flow

```
URL: /{locale}/apps/{appId}
  ↓
AppDetailPage (wrapper)
  ↓ useParams → extract appId, locale
  ↓ useEffect → loadApp(appId, locale)
  ↓
projectLoader.loadApp
  ↓ Promise.all([loadAppReadme, loadAppSpec, loadChangelog])
  ↓ mergeProjectData(readme, spec)
  ↓
AppData (complete)
  ↓
<ProjectDetail project={appData} type="app" />
  ↓
Render all 13 sections based on available data
```

---

## Error Handling

### Loading State

- Show centered loading message: "Loading..."
- Styling: Minimal, centered in viewport

### Not Found State

- Show centered error message: "App not found" / "Library not found"
- Styling: Minimal, centered in viewport
- No retry mechanism

### Missing Data

- Graceful degradation: Hide sections with no data
- No error messages for missing optional fields
- Sections conditionally render

---

## Performance Considerations

### Data Loading

- Single fetch per project (combined README + Spec + Changelog)
- No incremental loading
- All data loaded before component renders

### Rendering

- Large HTML content (README/Spec) rendered with dangerouslySetInnerHTML
- Changelog conditionally limited to 3 releases by default
- No virtualization (all content in DOM)

### State

- Minimal state (only showAllVersions toggle)
- No complex computations
- Helper functions are pure (no side effects)

---

## Accessibility

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic section elements
- Lists for features, highlights, use cases
- Links vs buttons used appropriately

### Keyboard Navigation

- Back button is keyboard accessible
- Changelog expand button is keyboard accessible
- All links are keyboard accessible
- Tech tags are keyboard accessible (buttons)

### ARIA

- External links have rel="noopener noreferrer"
- Icons are decorative (no aria-label needed)
- All interactive elements have visible text

### Color Contrast

- All text meets WCAG AA standards
- Status badges have sufficient contrast
- Link colors are distinguishable

---

## Comparison: Apps vs Libs

### Shared Sections

Both apps and libs display:

- Back button, Header, Metadata bar
- Purpose, Tech Stack, Features, Highlights
- Use Cases, Target Audience
- Documentation, Changelog, Links

### Libs-Specific

- **Stats section**: Only rendered if `project.stats` exists
- Usually only libs have stats (components/hooks/utilities count)

### Apps-Specific

- No app-specific sections currently
- Potential future: deployment info, live metrics

### Type Differences

- **Back button text**: "Back to Applications" vs "Back to Libraries"
- **Back path**: `/apps` vs `/libs`
- **Data type**: `AppData` vs `LibData` (TypeScript only)

---

## Design Rationale

### Single Component for Both Types

- **Benefit**: Consistent UX across apps and libs
- **Benefit**: Easier to maintain and update
- **Trade-off**: Some conditional logic based on type
- **Solution**: Minimal type-specific code, mostly shared

### Section Order

Organized by importance and user flow:

1. Identity (name, status, version)
2. Purpose and tech (why, what, how)
3. Details (features, highlights, use cases)
4. Deep dive (documentation, changelog)
5. Actions (links)

### Expandable Changelog

- **Rationale**: Long changelogs can overwhelm
- **Solution**: Show 3 recent, expand on demand
- **Benefit**: Fast initial page load and scanning

---

## Future Enhancements

### Potential Features

- Add breadcrumb navigation
- Add share button (copy link)
- Add print-friendly styling
- Add table of contents for long docs
- Add "Related Projects" section
- Add external integrations (npm package info, GitHub stats)
- Add deployment status and health checks (for apps)
- Add dependency graph visualization
- Add interactive code examples
- Add comment/feedback section
