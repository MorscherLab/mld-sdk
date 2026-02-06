<script setup>
import ThemeToggleDemo from '../.vitepress/showcase/ThemeToggleDemo.vue'
</script>

# ThemeToggle

A button component that toggles between light and dark themes. Pairs with the `useTheme` composable for programmatic theme control.

## Demo

<ClientOnly>
  <ThemeToggleDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

## useTheme() API

The `useTheme` composable provides programmatic access to theme state:

```ts
import { useTheme } from '@morscherlab/mld-sdk'

const { isDark, toggleTheme, setTheme } = useTheme()

// Check current theme
console.log(isDark.value) // true or false

// Toggle theme
toggleTheme()

// Set specific theme
setTheme('dark')
setTheme('light')
```

### Return Values

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isDark` | `Ref<boolean>` | Reactive boolean indicating dark mode |
| `toggleTheme()` | `() => void` | Toggle between light and dark |
| `setTheme()` | `(theme: 'light' \| 'dark') => void` | Set a specific theme |

## Usage

```vue
<template>
  <!-- Simple usage -->
  <ThemeToggle />

  <!-- With size -->
  <ThemeToggle size="sm" />

  <!-- In a header -->
  <AppTopBar title="Dashboard">
    <template #actions>
      <ThemeToggle size="sm" />
    </template>
  </AppTopBar>
</template>
```

## Behavior

- Theme preference is persisted in localStorage
- Applies `dark` class to the document root
- Shows sun icon in dark mode, moon icon in light mode
- Accessible with keyboard navigation
