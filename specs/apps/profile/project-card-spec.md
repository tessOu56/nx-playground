# ProjectCard Component Specification

## Overview

The ProjectCard is a unified card component used to display project information across the entire application. It provides a consistent, professional presentation for both Apps and Libs in list views and search results.

## Component Location

**File**: `apps/profile/src/components/ProjectCard.tsx`

## Props Interface

```typescript
interface ProjectCardProps {
  project: AppData | LibData; // Full project data
  type: 'app' | 'lib'; // Project type for conditional rendering
  onClick?: () => void; // Click handler (usually navigate to detail)
}
```

## Data Sources

### TypeScript Types

- `AppData`: Apps project data (extends `ProjectData`)
- `LibData`: Libraries project data (extends `ProjectData`)
- `ProjectData`: Combined README + Spec + Changelog data

### Key Fields Used

- `project.id` - Project identifier
- `project.name` - Display name
- `project.version` - Version number
- `project.category` - Category classification
- `project.status` - Production status
- `project.shortDesc` - Short description (priority)
- `project.description` - Full description (fallback)
- `project.techStack[]` - Array of technology names
- `project.highlights[]` - Array of highlight points

---

## Card Structure

### 1. Container

- **Element**: `<div>`
- **Styling**:
  - Background: `bg-white dark:bg-gray-800`
  - Border: `rounded-xl`
  - Shadow: `shadow-lg`, `hover:shadow-xl`
  - Padding: `p-6`
  - Hover: Lift animation (`hover:-translate-y-1`)
  - Cursor: `cursor-pointer`
- **Interaction**: `onClick` handler for navigation

### 2. Header Section

#### 2.1 Left: Title Area

- **Title** (`<h3>`):

  - Font: `text-2xl font-bold`
  - Color: `text-gray-900 dark:text-white`
  - Content: `project.name`

- **Package Name** (Libs only):
  - Element: `<code>`
  - Display condition: Only when `type === 'lib'`
  - Format: `@nx-playground/{project.id}`
  - Styling: `text-sm` with monospace, gray background badge

#### 2.2 Right: Badges Area

Vertical stack of badges (flex-col, gap-2, items-end):

1. **CategoryBadge** (always shown)

   - Component: `<CategoryBadge>`
   - Props: `category={project.category}`, `type={type}`
   - Position: Top

2. **StatusBadge** (conditional)

   - Component: `<StatusBadge>`
   - Display condition: Only if `status === 'coming-soon'` OR `status === 'development'`
   - Props: `status={project.status}`
   - Note: Production status is NOT shown (assumed default)

3. **Version Number** (conditional)
   - Element: `<span>`
   - Display condition: Only if `project.version` exists
   - Format: `v{project.version}`
   - Styling: `text-xs text-gray-500 dark:text-gray-400`

### 3. Description

- **Element**: Paragraph
- **Content**: `project.shortDesc || project.description`
- **Priority**: shortDesc first, fallback to description
- **Styling**:
  - Color: `text-gray-600 dark:text-gray-400`
  - Truncation: `line-clamp-3` (max 3 lines)
  - Margin: `mb-4`

### 4. Tech Stack Section

**Display Condition**: Only if `project.techStack` exists and has items

**Layout**:

- Flex wrap container with `gap-2`
- Shows up to 4 tech tags
- "+N" indicator if more than 4 technologies

**Elements**:

1. **Tech Tags** (max 4):

   - Component: `<TechTag>`
   - Props: `name={tech}`, `compact={true}`
   - Clickable: Navigates to blogs search

2. **Overflow Indicator**:
   - Display condition: `techStack.length > 4`
   - Format: `+{techStack.length - 4}`
   - Styling: Small badge with muted colors

### 5. Highlights Section

**Display Condition**: Only if `project.highlights` exists and has items

**Layout**:

- Title: "Highlights:" (hardcoded, small font)
- List: Vertical space-y-1
- Shows up to 4 highlights

**List Items**:

- Checkmark icon: Green ✓
- Text: `text-sm text-gray-600 dark:text-gray-400`
- Layout: Flex with icon on left
- Max display: 4 items (`.slice(0, 4)`)

---

## Sub-Components

### CategoryBadge

**File**: `apps/profile/src/components/CategoryBadge.tsx`

**Purpose**: Display project category with color-coded badge

**Props**:

```typescript
{
  category: string;
  type?: 'app' | 'lib';
}
```

**Category Colors**:

Apps:

- `react`: Cyan (`bg-cyan-100 text-cyan-800`)
- `angular`: Red (`bg-red-100 text-red-800`)
- `vue`: Green (`bg-green-100 text-green-800`)
- `nextjs`: Purple (`bg-purple-100 text-purple-800`)

Libs:

- `ui`: Purple (`bg-purple-100 text-purple-800`)
- `data`: Blue (`bg-blue-100 text-blue-800`)
- `utils`: Green (`bg-green-100 text-green-800`)

**Styling**:

- Rounded pill shape: `rounded-full`
- Small text: `text-xs font-medium`
- Padding: `px-3 py-1`
- Text transform: `category.toUpperCase()`

### StatusBadge

**File**: `apps/profile/src/components/StatusBadge.tsx`

**Purpose**: Display project status (development/coming-soon)

**Props**:

```typescript
{
  status: 'production' | 'development' | 'coming-soon';
}
```

**Status Display**:

- `production`: Green, "生產中" (not shown in card - only in detail page)
- `development`: Yellow, "開發中"
- `coming-soon`: Gray, "即將推出"

**Styling**: Same as CategoryBadge (rounded-full, small text)

### TechTag

**File**: `apps/profile/src/components/TechTag.tsx`

**Purpose**: Display technology with category-based colors, clickable for search

**Props**:

```typescript
{
  name: string;
  compact?: boolean;  // Use compact=true in cards
}
```

**Interaction**:

- Click navigates to `/blogs?tag={name}` for documentation search
- Hover: Scale up + shadow effect

---

## Responsive Behavior

### Mobile (< 768px)

- Full width card
- Header: Stack if badges overflow
- Tech tags: Wrap naturally
- All sections maintain readability

### Tablet (768px+)

- Card width determined by grid parent
- Header: Badges align to right
- Tech tags: Wrap with consistent spacing

### Desktop (1024px+)

- Optimal card dimensions in grid
- Hover effects fully active
- All content clearly visible

---

## Interaction States

### Default State

- White/dark-gray background
- Standard shadow
- Normal position

### Hover State

- Shadow increases (shadow-xl)
- Card lifts up (-translate-y-1)
- Smooth transition (300ms)

### Click State

- Execute onClick handler
- Usually navigates to detail page

---

## Conditional Rendering

### Always Shown

- Title (project.name)
- Category badge
- Description (shortDesc or description)

### Conditionally Shown

- **Package name**: Only for libs (`type === 'lib'`)
- **Status badge**: Only for development or coming-soon (not production)
- **Version number**: Only if `project.version` exists
- **Tech stack section**: Only if `project.techStack` has items
- **Highlights section**: Only if `project.highlights` has items
- **Tech overflow indicator**: Only if more than 4 tech items
- **Highlights overflow**: Only shows first 4 items

---

## Styling Guidelines

### Colors

- Primary text: `text-gray-900 dark:text-white`
- Secondary text: `text-gray-600 dark:text-gray-400`
- Muted text: `text-gray-500 dark:text-gray-400`
- Highlight checkmark: `text-green-600 dark:text-green-400`

### Spacing

- Card padding: `p-6`
- Section margins: `mb-4`
- Small gaps: `gap-2`
- Vertical lists: `space-y-1`

### Typography

- Title: `text-2xl font-bold`
- Subtitle: `text-sm font-semibold`
- Body: `text-sm` or default
- Code: `text-sm` with monospace

### Borders & Shadows

- Border radius: `rounded-xl` (12px)
- Default shadow: `shadow-lg`
- Hover shadow: `shadow-xl`
- Badge radius: `rounded-full` or `rounded`

---

## Usage Examples

### Apps Page

```tsx
<ProjectCard
  project={appData}
  type='app'
  onClick={() => navigate(`/apps/${appData.id}`)}
/>
```

### Libs Page

```tsx
<ProjectCard
  project={libData}
  type='lib'
  onClick={() => navigate(`/libs/${libData.id}`)}
/>
```

### Search Results (Blogs)

```tsx
// Can be used for both apps and libs in search results
<ProjectCard
  project={result}
  type={
    result.category in ['react', 'angular', 'vue', 'nextjs'] ? 'app' : 'lib'
  }
  onClick={() => navigate(getDetailPath(result))}
/>
```

---

## Accessibility

### Semantic HTML

- Proper heading hierarchy (h3 for card title)
- List elements for highlights
- Code element for package names

### Keyboard & Screen Readers

- Card is keyboard accessible (clickable div)
- All text content is readable
- Icon + text combinations

### Visual Accessibility

- High contrast text colors
- Clear visual hierarchy
- Sufficient spacing between elements
- Dark mode support

---

## Performance Considerations

### Rendering

- Minimal re-renders (pure component)
- Conditional rendering prevents empty sections
- Array slicing limits displayed items

### Data

- No data fetching in component
- Receives pre-loaded project data
- Efficient tech tag filtering (slice)

---

## Design Rationale

### Why This Structure?

1. **Unified Component**: Single component for all project types reduces maintenance
2. **Information Hierarchy**: Most important info (name, category) at top
3. **Scannable**: Key details visible without clicking
4. **Action-Oriented**: Entire card is clickable
5. **Responsive**: Works well on all screen sizes
6. **Consistent**: Same styling across apps, libs, and search

### Comparison to Previous Design

- **Before**: Separate AppCard and LibCard components
- **After**: Unified ProjectCard with type-based conditional rendering
- **Benefit**: Easier to maintain, consistent UX, less code duplication

---

## Future Enhancements

### Potential Improvements

- Add project thumbnail/icon support
- Add favorite/bookmark functionality
- Add quick actions menu (share, copy link)
- Add animated hover effects (subtle scale, glow)
- Add "New" badge for recently added projects
- Add last updated timestamp display
