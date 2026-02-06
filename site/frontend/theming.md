# Theming Guide

Complete guide to CSS variables, dark mode, and customization.

## Quick Start

Import the SDK styles in your main entry file:

```typescript
// main.ts
import '@morscherlab/mld-sdk/styles'
```

The SDK includes all necessary CSS variables and utility classes. **Tailwind CSS is optional.**

## CSS Variables

### Core Variables

All colors and styles are controlled through CSS variables defined in `:root`.

#### Background Colors

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--bg-primary` | `#F8FAFC` | `#0F172A` | Main background |
| `--bg-secondary` | `#FFFFFF` | `#1E293B` | Card/panel background |
| `--bg-tertiary` | `#F1F5F9` | `#334155` | Hover/active states |
| `--bg-card` | `#FFFFFF` | `#1E293B` | Card background |
| `--bg-hover` | `#F1F5F9` | `#334155` | Hover background |

#### Text Colors

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--text-primary` | `#1E293B` | `#F8FAFC` | Primary text |
| `--text-secondary` | `#64748B` | `#94A3B8` | Secondary text |
| `--text-muted` | `#94A3B8` | `#64748B` | Muted/placeholder text |

#### Border Colors

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--border-color` | `#E5E7EB` | `#334155` | Standard borders |
| `--border-light` | `#F3F4F6` | `#1E293B` | Light borders |

#### Brand Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--color-primary` | `#3B82F6` | Primary brand color (blue) |
| `--color-primary-hover` | `#2563EB` | Primary hover state |
| `--color-cta` | `#F97316` | Call-to-action (orange) |
| `--color-cta-hover` | `#EA580C` | CTA hover state |
| `--color-purple` | `#8B5CF6` | Accent purple |

#### Semantic Colors

| Variable | Value | Description |
|----------|-------|-------------|
| `--mld-success` | `#10B981` | Success green |
| `--mld-success-bg` | `rgba(16, 185, 129, 0.1)` | Success background |
| `--mld-error` | `#EF4444` | Error red |
| `--mld-error-bg` | `rgba(239, 68, 68, 0.1)` | Error background |
| `--mld-warning` | `#F59E0B` | Warning yellow |
| `--mld-warning-bg` | `rgba(245, 158, 11, 0.1)` | Warning background |
| `--mld-info` | `#3B82F6` | Info blue |
| `--mld-info-bg` | `rgba(59, 130, 246, 0.1)` | Info background |

#### Shadows

| Variable | Description |
|----------|-------------|
| `--shadow-sm` | Small shadow |
| `--shadow` | Standard shadow |
| `--shadow-md` | Medium shadow |
| `--shadow-lg` | Large shadow |

#### Border Radius

| Variable | Value | Description |
|----------|-------|-------------|
| `--radius-sm` | `0.25rem` | Small radius (4px) |
| `--radius` | `0.375rem` | Standard radius (6px) |
| `--radius-md` | `0.5rem` | Medium radius (8px) |
| `--radius-lg` | `0.75rem` | Large radius (12px) |

## Dark Mode

Dark mode is automatically supported. Add the `dark` class to the `<html>` element:

```html
<html class="dark">
```

### Using useTheme

```typescript
import { useTheme } from '@morscherlab/mld-sdk'

const { isDark, toggleTheme, setTheme } = useTheme()

// Toggle
toggleTheme()

// Set specific mode
setTheme('dark')
setTheme('light')
```

### Using useSettingsStore

```typescript
import { useSettingsStore } from '@morscherlab/mld-sdk'

const settings = useSettingsStore()

// Options: 'light' | 'dark' | 'system'
settings.theme = 'system'

// Apply theme
settings.applyTheme()

// Check current mode
if (settings.isDark()) {
  // Currently in dark mode
}
```

## Custom Theming

Override CSS variables to customize the look:

```css
/* your-styles.css */
:root {
  /* Custom brand colors */
  --color-primary: #6366F1;  /* Indigo instead of blue */
  --color-primary-hover: #4F46E5;

  /* Custom background */
  --bg-primary: #FAFAFA;
}

html.dark {
  --bg-primary: #18181B;
  --bg-secondary: #27272A;
}
```

### Theme Presets

Create theme presets by grouping variable overrides:

```css
/* Purple theme */
.theme-purple {
  --color-primary: #8B5CF6;
  --color-primary-hover: #7C3AED;
  --color-cta: #EC4899;
  --color-cta-hover: #DB2777;
}

/* Green theme */
.theme-green {
  --color-primary: #10B981;
  --color-primary-hover: #059669;
  --color-cta: #14B8A6;
  --color-cta-hover: #0D9488;
}
```

## Utility Classes

The SDK provides ready-to-use utility classes.

### Buttons

```html
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-cta">Call to Action</button>
<button class="btn-success">Success</button>
<button class="btn-danger">Danger</button>
```

### Inputs

```html
<input class="input-modern" type="text" placeholder="Enter text..." />
<select class="select-modern">
  <option>Option 1</option>
</select>
<label class="label-modern">Field Label</label>
```

### Cards

```html
<div class="card">Card content</div>
<div class="card card-hover">Hoverable card</div>
<div class="floating-card">Floating panel</div>
```

### Alerts

```html
<div class="alert-success">Success message</div>
<div class="alert-error">Error message</div>
<div class="alert-warning">Warning message</div>
<div class="alert-info">Info message</div>
```

### Form Controls

```html
<div class="toggle-switch active"></div>
<input type="checkbox" class="checkbox-modern" />
```

### Color Utilities

```html
<!-- Background colors -->
<div class="bg-bg-primary">Primary background</div>
<div class="bg-bg-secondary">Secondary background</div>
<div class="bg-bg-hover">Hover background</div>

<!-- Text colors -->
<span class="text-text-primary">Primary text</span>
<span class="text-text-secondary">Secondary text</span>
<span class="text-text-muted">Muted text</span>

<!-- Brand colors -->
<span class="text-mld-primary">Primary color</span>
<span class="text-mld-success">Success color</span>
<span class="text-mld-danger">Danger color</span>
```

## CSS Naming Convention

SDK components use BEM naming with `mld-` prefix:

```
.mld-{component}__{element}--{modifier}
```

Examples:
- `.mld-button` - Block
- `.mld-button__icon` - Element
- `.mld-button--primary` - Modifier
- `.mld-button--loading` - State modifier

### Component CSS Classes

| Component | Base Class |
|-----------|------------|
| BaseButton | `.mld-button` |
| BaseInput | `.mld-input` |
| BaseModal | `.mld-modal` |
| BaseSelect | `.mld-select` |
| BaseTabs | `.mld-tabs` |
| AlertBox | `.mld-alert` |
| CollapsibleCard | `.mld-collapsible-card` |
| WellPlate | `.mld-well-plate` |
| FileUploader | `.mld-file-uploader` |

## Typography

The SDK uses Fira Sans for UI text and Fira Code for code:

```css
html {
  font-family: 'Fira Sans', system-ui, sans-serif;
}

code, pre {
  font-family: 'Fira Code', monospace;
}
```

### Font Weights

| Weight | Class | Use |
|--------|-------|-----|
| 300 | `.font-light` | Large headings |
| 400 | `.font-normal` | Body text |
| 500 | `.font-medium` | Emphasis, labels |
| 600 | `.font-semibold` | Buttons, titles |
| 700 | `.font-bold` | Strong emphasis |

## Tailwind CSS Integration (Optional)

If using Tailwind CSS, import the MLD preset:

```typescript
// tailwind.config.ts
import mldPreset from '@morscherlab/mld-sdk/tailwind.preset'

export default {
  presets: [mldPreset],
  content: [
    './src/**/*.vue',
    './node_modules/@morscherlab/mld-sdk/**/*.vue',
  ],
}
```

The preset provides:
- Custom color tokens mapping to CSS variables
- Extended spacing scale
- Custom border radius values
- Transition duration utilities

### Tailwind v4 Compatibility

The SDK includes pre-built utility classes that work without Tailwind scanning SDK source files. This ensures compatibility regardless of your Tailwind configuration.

## Scrollbar Styling

Custom scrollbar styles are included:

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
}
```

## Animations

### Page Transitions

```vue
<Transition name="fade">
  <div v-if="show">Content</div>
</Transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Reduced Motion

The SDK respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Color Palettes

The SDK supports multiple color palettes for data visualization:

```typescript
import { useSettingsStore, colorPalettes } from '@morscherlab/mld-sdk'

const settings = useSettingsStore()

// Available palettes
console.log(colorPalettes)
// {
//   default: { name: 'Default (Cyan-Pink)', hues: [180, 320] },
//   colorblind: { name: 'Colorblind-friendly', hues: [45, 260] },
//   viridis: { name: 'Viridis', hues: [280, 80] },
//   pastel: { name: 'Pastel', hues: [200, 340] },
// }

// Set palette
settings.colorPalette = 'colorblind'

// Get hue range for custom gradients
const [hue1, hue2] = settings.getPaletteHues()
```

## Best Practices

### 1. Always Use CSS Variables

```css
/* Good */
.my-component {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* Bad - won't work with dark mode */
.my-component {
  background: white;
  color: #1E293B;
}
```

### 2. Don't Use Tailwind Utilities in SDK Components

SDK components must use dedicated CSS classes, not Tailwind utilities:

```vue
<!-- Good -->
<div class="mld-modal">

<!-- Bad - won't work for SDK consumers without Tailwind -->
<div class="fixed inset-0 z-50 flex items-center justify-center">
```

### 3. Use Semantic Color Variables

```css
/* Good - semantic meaning */
.error-state {
  color: var(--mld-error);
  background: var(--mld-error-bg);
}

/* Less ideal - direct color reference */
.error-state {
  color: #EF4444;
}
```

### 4. Test Both Light and Dark Modes

Always verify your customizations work in both modes:

```typescript
const { toggleTheme } = useTheme()

// During development
toggleTheme()  // Check both modes
```
