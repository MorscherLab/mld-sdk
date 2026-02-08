<script setup>
import AvatarDemo from '../.vitepress/showcase/AvatarDemo.vue'
</script>

# Avatar

A user avatar component that displays an image, auto-generated initials from a name, custom initials, or a fallback icon. Colors are deterministically generated from the name.

## Demo

<ClientOnly>
  <AvatarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Full name used to generate initials and background color |
| `initials` | `string` | - | Custom initials (overrides name-based initials) |
| `src` | `string` | - | Image URL for the avatar |
| `alt` | `string` | `''` | Alt text for the image |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `color` | `string` | - | Custom background color (overrides name-based color) |

## Usage

```vue
<script setup lang="ts">
import { Avatar } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- From name (auto initials + color) -->
  <Avatar name="Jane Doe" />

  <!-- Custom initials with color -->
  <Avatar initials="MLD" color="#3B82F6" />

  <!-- From image -->
  <Avatar src="/path/to/photo.jpg" alt="Jane Doe" size="lg" />

  <!-- Fallback (shows user icon) -->
  <Avatar />
</template>
```
