# Design Tokens Documentation

This document outlines the design tokens used in the project. These tokens are organized into categories and can be used to maintain consistency across the UI.

## Usage in Tailwind CSS

All design tokens are available as Tailwind CSS classes. Here's how to use them:

### Colors
- Use `bg-{color}-{shade}` for background colors
- Use `text-{color}-{shade}` for text colors
- Use `border-{color}-{shade}` for border colors

### Spacing
- Use `p-{spacing}`, `m-{spacing}`, `gap-{spacing}` etc.

### Border Radius
- Use `rounded-{radius}` for border radius

### Typography
- Use `font-{weight}` for font weights
- Use `text-{size}` for font sizes

## Semantic Colors

For better theme support, use these semantic color classes:

### Text Colors
- `text-text-primary` - Primary text color
- `text-text-secondary` - Secondary text color
- `text-text-tertiary` - Tertiary text color
- `text-text-disabled` - Disabled text color
- `text-text-inverse` - Inverse text color

### Background Colors
- `bg-background-primary` - Primary background color
- `bg-background-secondary` - Secondary background color
- `bg-background-tertiary` - Tertiary background color
- `bg-background-inverse` - Inverse background color

### Border Colors
- `border-border-primary` - Primary border color
- `border-border-secondary` - Secondary border color
- `border-border-focus` - Focus border color
- `border-border-error` - Error border color
- `border-border-success` - Success border color
- `border-border-warning` - Warning border color

## Available Colors

### Base

- **White**: `#ffffff` (Tailwind: `bg-base-white`, `text-base-white`)
- **Black**: `#000000` (Tailwind: `bg-base-black`, `text-base-black`)
- **Transparent**: `rgba(255, 255, 255, 0)` (Tailwind: `bg-base-transparent`, `text-base-transparent`)

### Gray

- **25**: `#fafafa` (Tailwind: `bg-gray-25`, `text-gray-25`)
- **50**: `#f7f7f7` (Tailwind: `bg-gray-50`, `text-gray-50`)
- **100**: `#f0f0f1` (Tailwind: `bg-gray-100`, `text-gray-100`)
- **200**: `#ececed` (Tailwind: `bg-gray-200`, `text-gray-200`)
- **300**: `#cecfd2` (Tailwind: `bg-gray-300`, `text-gray-300`)
- **400**: `#94979c` (Tailwind: `bg-gray-400`, `text-gray-400`)
- **500**: `#85888e` (Tailwind: `bg-gray-500`, `text-gray-500`)
- **600**: `#61656c` (Tailwind: `bg-gray-600`, `text-gray-600`)
- **700**: `#373a41` (Tailwind: `bg-gray-700`, `text-gray-700`)
- **800**: `#22262f` (Tailwind: `bg-gray-800`, `text-gray-800`)
- **900**: `#13161b` (Tailwind: `bg-gray-900`, `text-gray-900`)
- **950**: `#0c0e12` (Tailwind: `bg-gray-950`, `text-gray-950`)
- **Blue-25**: `#fcfcfd` (Tailwind: `bg-gray-blue-25`, `text-gray-blue-25`)
- **Cool-25**: `#fcfcfd` (Tailwind: `bg-gray-cool-25`, `text-gray-cool-25`)
- **Modern-25**: `#fcfcfd` (Tailwind: `bg-gray-modern-25`, `text-gray-modern-25`)
- **Neutral-25**: `#fcfcfd` (Tailwind: `bg-gray-neutral-25`, `text-gray-neutral-25`)
- **Neutral-50**: `#f9fafb` (Tailwind: `bg-gray-neutral-50`, `text-gray-neutral-50`)
- **Blue-50**: `#f8f9fc` (Tailwind: `bg-gray-blue-50`, `text-gray-blue-50`)
- **Blue-100**: `#eaecf5` (Tailwind: `bg-gray-blue-100`, `text-gray-blue-100`)
- **Blue-200**: `#d5d9eb` (Tailwind: `bg-gray-blue-200`, `text-gray-blue-200`)
- **Blue-300**: `#b3b8db` (Tailwind: `bg-gray-blue-300`, `text-gray-blue-300`)
- **Blue-400**: `#717bbc` (Tailwind: `bg-gray-blue-400`, `text-gray-blue-400`)
- **Blue-500**: `#4e5ba6` (Tailwind: `bg-gray-blue-500`, `text-gray-blue-500`)
- **Blue-600**: `#3e4784` (Tailwind: `bg-gray-blue-600`, `text-gray-blue-600`)
- **Blue-700**: `#363f72` (Tailwind: `bg-gray-blue-700`, `text-gray-blue-700`)
- **Blue-800**: `#293056` (Tailwind: `bg-gray-blue-800`, `text-gray-blue-800`)
- **Blue-900**: `#101323` (Tailwind: `bg-gray-blue-900`, `text-gray-blue-900`)
- **Blue-950**: `#0d0f1c` (Tailwind: `bg-gray-blue-950`, `text-gray-blue-950`)
- **Cool-50**: `#f9f9fb` (Tailwind: `bg-gray-cool-50`, `text-gray-cool-50`)
- **Cool-100**: `#eff1f5` (Tailwind: `bg-gray-cool-100`, `text-gray-cool-100`)
- **Cool-200**: `#dcdfea` (Tailwind: `bg-gray-cool-200`, `text-gray-cool-200`)
- **Cool-300**: `#b9c0d4` (Tailwind: `bg-gray-cool-300`, `text-gray-cool-300`)
- **Cool-400**: `#7d89b0` (Tailwind: `bg-gray-cool-400`, `text-gray-cool-400`)
- **Cool-500**: `#5d6b98` (Tailwind: `bg-gray-cool-500`, `text-gray-cool-500`)
- **Cool-600**: `#4a5578` (Tailwind: `bg-gray-cool-600`, `text-gray-cool-600`)
- **Cool-700**: `#404968` (Tailwind: `bg-gray-cool-700`, `text-gray-cool-700`)
- **Cool-800**: `#30374f` (Tailwind: `bg-gray-cool-800`, `text-gray-cool-800`)
- **Cool-900**: `#111322` (Tailwind: `bg-gray-cool-900`, `text-gray-cool-900`)
- **Modern-50**: `#f8fafc` (Tailwind: `bg-gray-modern-50`, `text-gray-modern-50`)
- **Modern-100**: `#eef2f6` (Tailwind: `bg-gray-modern-100`, `text-gray-modern-100`)
- **Modern-200**: `#e3e8ef` (Tailwind: `bg-gray-modern-200`, `text-gray-modern-200`)
- **Modern-300**: `#cdd5df` (Tailwind: `bg-gray-modern-300`, `text-gray-modern-300`)
- **Modern-400**: `#9aa4b2` (Tailwind: `bg-gray-modern-400`, `text-gray-modern-400`)
- **Modern-500**: `#697586` (Tailwind: `bg-gray-modern-500`, `text-gray-modern-500`)
- **Modern-600**: `#4b5565` (Tailwind: `bg-gray-modern-600`, `text-gray-modern-600`)
- **Modern-700**: `#364152` (Tailwind: `bg-gray-modern-700`, `text-gray-modern-700`)
- **Modern-800**: `#202939` (Tailwind: `bg-gray-modern-800`, `text-gray-modern-800`)
- **Modern-900**: `#121926` (Tailwind: `bg-gray-modern-900`, `text-gray-modern-900`)
- **Neutral-100**: `#f3f4f6` (Tailwind: `bg-gray-neutral-100`, `text-gray-neutral-100`)
- **Neutral-200**: `#e5e7eb` (Tailwind: `bg-gray-neutral-200`, `text-gray-neutral-200`)
- **Neutral-300**: `#d2d6db` (Tailwind: `bg-gray-neutral-300`, `text-gray-neutral-300`)
- **Neutral-400**: `#9da4ae` (Tailwind: `bg-gray-neutral-400`, `text-gray-neutral-400`)
- **Neutral-500**: `#6c737f` (Tailwind: `bg-gray-neutral-500`, `text-gray-neutral-500`)
- **Neutral-600**: `#4d5761` (Tailwind: `bg-gray-neutral-600`, `text-gray-neutral-600`)
- **Neutral-700**: `#384250` (Tailwind: `bg-gray-neutral-700`, `text-gray-neutral-700`)
- **Neutral-800**: `#1f2a37` (Tailwind: `bg-gray-neutral-800`, `text-gray-neutral-800`)
- **Neutral-900**: `#111927` (Tailwind: `bg-gray-neutral-900`, `text-gray-neutral-900`)
- **Iron-25**: `#fcfcfc` (Tailwind: `bg-gray-iron-25`, `text-gray-iron-25`)
- **True-25**: `#fcfcfc` (Tailwind: `bg-gray-true-25`, `text-gray-true-25`)
- **Iron-50**: `#fafafa` (Tailwind: `bg-gray-iron-50`, `text-gray-iron-50`)
- **True-50**: `#f7f7f7` (Tailwind: `bg-gray-true-50`, `text-gray-true-50`)
- **Iron-100**: `#f4f4f5` (Tailwind: `bg-gray-iron-100`, `text-gray-iron-100`)
- **Iron-200**: `#e4e4e7` (Tailwind: `bg-gray-iron-200`, `text-gray-iron-200`)
- **Iron-300**: `#d1d1d6` (Tailwind: `bg-gray-iron-300`, `text-gray-iron-300`)
- **Iron-400**: `#a0a0ab` (Tailwind: `bg-gray-iron-400`, `text-gray-iron-400`)
- **Iron-500**: `#70707b` (Tailwind: `bg-gray-iron-500`, `text-gray-iron-500`)
- **Iron-600**: `#51525c` (Tailwind: `bg-gray-iron-600`, `text-gray-iron-600`)
- **Iron-700**: `#3f3f46` (Tailwind: `bg-gray-iron-700`, `text-gray-iron-700`)
- **Iron-800**: `#26272b` (Tailwind: `bg-gray-iron-800`, `text-gray-iron-800`)
- **Iron-900**: `#1a1a1e` (Tailwind: `bg-gray-iron-900`, `text-gray-iron-900`)
- **True-100**: `#f5f5f5` (Tailwind: `bg-gray-true-100`, `text-gray-true-100`)
- **True-200**: `#e5e5e5` (Tailwind: `bg-gray-true-200`, `text-gray-true-200`)
- **True-300**: `#d6d6d6` (Tailwind: `bg-gray-true-300`, `text-gray-true-300`)
- **True-400**: `#a3a3a3` (Tailwind: `bg-gray-true-400`, `text-gray-true-400`)
- **True-500**: `#737373` (Tailwind: `bg-gray-true-500`, `text-gray-true-500`)
- **True-600**: `#525252` (Tailwind: `bg-gray-true-600`, `text-gray-true-600`)
- **True-700**: `#424242` (Tailwind: `bg-gray-true-700`, `text-gray-true-700`)
- **Warm-25**: `#fdfdfc` (Tailwind: `bg-gray-warm-25`, `text-gray-warm-25`)
- **Warm-50**: `#fafaf9` (Tailwind: `bg-gray-warm-50`, `text-gray-warm-50`)
- **Warm-100**: `#f5f5f4` (Tailwind: `bg-gray-warm-100`, `text-gray-warm-100`)
- **Warm-200**: `#e7e5e4` (Tailwind: `bg-gray-warm-200`, `text-gray-warm-200`)
- **Warm-300**: `#d7d3d0` (Tailwind: `bg-gray-warm-300`, `text-gray-warm-300`)
- **Warm-400**: `#a9a29d` (Tailwind: `bg-gray-warm-400`, `text-gray-warm-400`)
- **Warm-500**: `#79716b` (Tailwind: `bg-gray-warm-500`, `text-gray-warm-500`)
- **Warm-600**: `#57534e` (Tailwind: `bg-gray-warm-600`, `text-gray-warm-600`)
- **Warm-700**: `#44403c` (Tailwind: `bg-gray-warm-700`, `text-gray-warm-700`)
- **Warm-800**: `#292524` (Tailwind: `bg-gray-warm-800`, `text-gray-warm-800`)
- **Warm-900**: `#1c1917` (Tailwind: `bg-gray-warm-900`, `text-gray-warm-900`)
- **Warm-950**: `#171412` (Tailwind: `bg-gray-warm-950`, `text-gray-warm-950`)
- **Cool-950**: `#0e101b` (Tailwind: `bg-gray-cool-950`, `text-gray-cool-950`)
- **Modern-950**: `#0d121c` (Tailwind: `bg-gray-modern-950`, `text-gray-modern-950`)
- **Neutral-950**: `#0d121c` (Tailwind: `bg-gray-neutral-950`, `text-gray-neutral-950`)
- **Iron-950**: `#131316` (Tailwind: `bg-gray-iron-950`, `text-gray-iron-950`)
- **True-800**: `#292929` (Tailwind: `bg-gray-true-800`, `text-gray-true-800`)
- **True-900**: `#141414` (Tailwind: `bg-gray-true-900`, `text-gray-true-900`)
- **True-950**: `#0f0f0f` (Tailwind: `bg-gray-true-950`, `text-gray-true-950`)

### Brand

- **25**: `#fcfaff` (Tailwind: `bg-brand-25`, `text-brand-25`)
- **50**: `#f9f5ff` (Tailwind: `bg-brand-50`, `text-brand-50`)
- **100**: `#f4ebff` (Tailwind: `bg-brand-100`, `text-brand-100`)
- **200**: `#e9d7fe` (Tailwind: `bg-brand-200`, `text-brand-200`)
- **300**: `#d6bbfb` (Tailwind: `bg-brand-300`, `text-brand-300`)
- **400**: `#b692f6` (Tailwind: `bg-brand-400`, `text-brand-400`)
- **500**: `#9e77ed` (Tailwind: `bg-brand-500`, `text-brand-500`)
- **600**: `#7f56d9` (Tailwind: `bg-brand-600`, `text-brand-600`)
- **700**: `#6941c6` (Tailwind: `bg-brand-700`, `text-brand-700`)
- **800**: `#53389e` (Tailwind: `bg-brand-800`, `text-brand-800`)
- **900**: `#42307d` (Tailwind: `bg-brand-900`, `text-brand-900`)
- **950**: `#2c1c5f` (Tailwind: `bg-brand-950`, `text-brand-950`)

### Error

- **25**: `#fffbfa` (Tailwind: `bg-error-25`, `text-error-25`)
- **50**: `#fef3f2` (Tailwind: `bg-error-50`, `text-error-50`)
- **100**: `#fee4e2` (Tailwind: `bg-error-100`, `text-error-100`)
- **200**: `#fecdca` (Tailwind: `bg-error-200`, `text-error-200`)
- **300**: `#fda29b` (Tailwind: `bg-error-300`, `text-error-300`)
- **400**: `#f97066` (Tailwind: `bg-error-400`, `text-error-400`)
- **500**: `#f04438` (Tailwind: `bg-error-500`, `text-error-500`)
- **600**: `#d92d20` (Tailwind: `bg-error-600`, `text-error-600`)
- **700**: `#b42318` (Tailwind: `bg-error-700`, `text-error-700`)
- **800**: `#912018` (Tailwind: `bg-error-800`, `text-error-800`)
- **900**: `#7a271a` (Tailwind: `bg-error-900`, `text-error-900`)
- **950**: `#55160c` (Tailwind: `bg-error-950`, `text-error-950`)

### Warning

- **25**: `#fffcf5` (Tailwind: `bg-warning-25`, `text-warning-25`)
- **50**: `#fffaeb` (Tailwind: `bg-warning-50`, `text-warning-50`)
- **100**: `#fef0c7` (Tailwind: `bg-warning-100`, `text-warning-100`)
- **200**: `#fedf89` (Tailwind: `bg-warning-200`, `text-warning-200`)
- **300**: `#fec84b` (Tailwind: `bg-warning-300`, `text-warning-300`)
- **400**: `#fdb022` (Tailwind: `bg-warning-400`, `text-warning-400`)
- **500**: `#f79009` (Tailwind: `bg-warning-500`, `text-warning-500`)
- **600**: `#dc6803` (Tailwind: `bg-warning-600`, `text-warning-600`)
- **700**: `#b54708` (Tailwind: `bg-warning-700`, `text-warning-700`)
- **800**: `#93370d` (Tailwind: `bg-warning-800`, `text-warning-800`)
- **900**: `#7a2e0e` (Tailwind: `bg-warning-900`, `text-warning-900`)
- **950**: `#4e1d09` (Tailwind: `bg-warning-950`, `text-warning-950`)

### Success

- **25**: `#f6fef9` (Tailwind: `bg-success-25`, `text-success-25`)
- **50**: `#ecfdf3` (Tailwind: `bg-success-50`, `text-success-50`)
- **100**: `#dcfae6` (Tailwind: `bg-success-100`, `text-success-100`)
- **200**: `#abefc6` (Tailwind: `bg-success-200`, `text-success-200`)
- **300**: `#75e0a7` (Tailwind: `bg-success-300`, `text-success-300`)
- **400**: `#47cd89` (Tailwind: `bg-success-400`, `text-success-400`)
- **500**: `#17b26a` (Tailwind: `bg-success-500`, `text-success-500`)
- **600**: `#079455` (Tailwind: `bg-success-600`, `text-success-600`)
- **700**: `#067647` (Tailwind: `bg-success-700`, `text-success-700`)
- **800**: `#085d3a` (Tailwind: `bg-success-800`, `text-success-800`)
- **900**: `#074d31` (Tailwind: `bg-success-900`, `text-success-900`)
- **950**: `#053321` (Tailwind: `bg-success-950`, `text-success-950`)

### Green

- **25**: `#f6fef9` (Tailwind: `bg-green-25`, `text-green-25`)
- **50**: `#edfcf2` (Tailwind: `bg-green-50`, `text-green-50`)
- **100**: `#d3f8df` (Tailwind: `bg-green-100`, `text-green-100`)
- **200**: `#aaf0c4` (Tailwind: `bg-green-200`, `text-green-200`)
- **300**: `#73e2a3` (Tailwind: `bg-green-300`, `text-green-300`)
- **400**: `#3ccb7f` (Tailwind: `bg-green-400`, `text-green-400`)
- **500**: `#16b364` (Tailwind: `bg-green-500`, `text-green-500`)
- **600**: `#099250` (Tailwind: `bg-green-600`, `text-green-600`)
- **700**: `#087443` (Tailwind: `bg-green-700`, `text-green-700`)
- **800**: `#095c37` (Tailwind: `bg-green-800`, `text-green-800`)
- **900**: `#084c2e` (Tailwind: `bg-green-900`, `text-green-900`)
- **950**: `#052e1c` (Tailwind: `bg-green-950`, `text-green-950`)
- **Light**: `#15290a` (Tailwind: `bg-green-light`, `text-green-light`)

### Blue

- **25**: `#f5faff` (Tailwind: `bg-blue-25`, `text-blue-25`)
- **50**: `#eff8ff` (Tailwind: `bg-blue-50`, `text-blue-50`)
- **100**: `#d1e9ff` (Tailwind: `bg-blue-100`, `text-blue-100`)
- **200**: `#b2ddff` (Tailwind: `bg-blue-200`, `text-blue-200`)
- **300**: `#84caff` (Tailwind: `bg-blue-300`, `text-blue-300`)
- **400**: `#53b1fd` (Tailwind: `bg-blue-400`, `text-blue-400`)
- **500**: `#2e90fa` (Tailwind: `bg-blue-500`, `text-blue-500`)
- **600**: `#1570ef` (Tailwind: `bg-blue-600`, `text-blue-600`)
- **700**: `#175cd3` (Tailwind: `bg-blue-700`, `text-blue-700`)
- **800**: `#1849a9` (Tailwind: `bg-blue-800`, `text-blue-800`)
- **900**: `#194185` (Tailwind: `bg-blue-900`, `text-blue-900`)
- **950**: `#102a56` (Tailwind: `bg-blue-950`, `text-blue-950`)
- **Light**: `#062c41` (Tailwind: `bg-blue-light`, `text-blue-light`)
- **Dark**: `#002266` (Tailwind: `bg-blue-dark`, `text-blue-dark`)

## Available Spacing

- **0**: `0px` (Tailwind: `p-0`, `m-0`, `gap-0`)
- **1**: `4px` (Tailwind: `p-1`, `m-1`, `gap-1`)
- **2**: `8px` (Tailwind: `p-2`, `m-2`, `gap-2`)
- **3**: `12px` (Tailwind: `p-3`, `m-3`, `gap-3`)
- **4**: `16px` (Tailwind: `p-4`, `m-4`, `gap-4`)
- **5**: `20px` (Tailwind: `p-5`, `m-5`, `gap-5`)
- **6**: `24px` (Tailwind: `p-6`, `m-6`, `gap-6`)
- **8**: `32px` (Tailwind: `p-8`, `m-8`, `gap-8`)
- **10**: `40px` (Tailwind: `p-10`, `m-10`, `gap-10`)
- **12**: `48px` (Tailwind: `p-12`, `m-12`, `gap-12`)
- **16**: `64px` (Tailwind: `p-16`, `m-16`, `gap-16`)
- **20**: `80px` (Tailwind: `p-20`, `m-20`, `gap-20`)
- **24**: `96px` (Tailwind: `p-24`, `m-24`, `gap-24`)
- **32**: `128px` (Tailwind: `p-32`, `m-32`, `gap-32`)
- **40**: `160px` (Tailwind: `p-40`, `m-40`, `gap-40`)
- **48**: `192px` (Tailwind: `p-48`, `m-48`, `gap-48`)
- **56**: `224px` (Tailwind: `p-56`, `m-56`, `gap-56`)
- **64**: `256px` (Tailwind: `p-64`, `m-64`, `gap-64`)
- **80**: `320px` (Tailwind: `p-80`, `m-80`, `gap-80`)
- **96**: `384px` (Tailwind: `p-96`, `m-96`, `gap-96`)
- **120**: `480px` (Tailwind: `p-120`, `m-120`, `gap-120`)
- **140**: `560px` (Tailwind: `p-140`, `m-140`, `gap-140`)
- **160**: `640px` (Tailwind: `p-160`, `m-160`, `gap-160`)
- **180**: `720px` (Tailwind: `p-180`, `m-180`, `gap-180`)
- **192**: `768px` (Tailwind: `p-192`, `m-192`, `gap-192`)
- **256**: `1024px` (Tailwind: `p-256`, `m-256`, `gap-256`)
- **320**: `1280px` (Tailwind: `p-320`, `m-320`, `gap-320`)
- **360**: `1440px` (Tailwind: `p-360`, `m-360`, `gap-360`)
- **400**: `1600px` (Tailwind: `p-400`, `m-400`, `gap-400`)
- **480**: `1920px` (Tailwind: `p-480`, `m-480`, `gap-480`)
- **0․5**: `2px` (Tailwind: `p-0․5`, `m-0․5`, `gap-0․5`)
- **1․5**: `6px` (Tailwind: `p-1․5`, `m-1․5`, `gap-1․5`)

## Available Border Radius

- **None**: `0px` (Tailwind: `rounded-none`)
- **Xxs**: `2px` (Tailwind: `rounded-xxs`)
- **Xs**: `4px` (Tailwind: `rounded-xs`)
- **Sm**: `6px` (Tailwind: `rounded-sm`)
- **Md**: `8px` (Tailwind: `rounded-md`)
- **Xl**: `12px` (Tailwind: `rounded-xl`)
- **2xl**: `16px` (Tailwind: `rounded-2xl`)
- **4xl**: `24px` (Tailwind: `rounded-4xl`)
- **Full**: `9999px` (Tailwind: `rounded-full`)
- **Lg**: `10px` (Tailwind: `rounded-lg`)
- **3xl**: `20px` (Tailwind: `rounded-3xl`)

## Available Typography

### Font Family

- **Font**: `Inter` (Tailwind: `font-font`)

### Font Weight

- **Regular**: `Regular italic` (Tailwind: `font-regular`)
- **Medium**: `Medium italic` (Tailwind: `font-medium`)
- **Semibold**: `Semibold italic` (Tailwind: `font-semibold`)
- **Bold**: `Bold italic` (Tailwind: `font-bold`)

### Font Size

- **Text**: `20px` (Tailwind: `text-text`)
- **Display**: `72px` (Tailwind: `text-display`)

### Line Height

- **Text**: `30px` (Tailwind: `leading-text`)
- **Display**: `90px` (Tailwind: `leading-display`)

## Usage Examples

### Button Component
```tsx
<button className="bg-primary-500 text-white px-4 py-2 rounded-md">
  Click me
</button>
```

### Card Component
```tsx
<div className="bg-background-primary border border-border-primary rounded-lg p-6">
  <h2 className="text-text-primary text-xl font-semibold mb-4">Card Title</h2>
  <p className="text-text-secondary">Card content goes here.</p>
</div>
```

### Form Input
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-text-primary">Name</label>
  <input className="w-full px-3 py-2 border border-border-primary rounded-md bg-background-primary text-text-primary" />
</div>
```

## Theme Switching

All semantic colors automatically adapt to the current theme. Use the `ThemeSwitcher` component to switch between themes:

```tsx
import { ThemeSwitcher } from '@nx-playground/ui-components';

function App() {
  return (
    <div>
      <ThemeSwitcher />
      {/* Your app content */}
    </div>
  );
}
```

---

*This documentation is automatically generated from design tokens. Update the source CSS files and run `pnpm run design:tokens` to regenerate.*
