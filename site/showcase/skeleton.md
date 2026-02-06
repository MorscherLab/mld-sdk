<script setup>
import SkeletonDemo from '../.vitepress/showcase/SkeletonDemo.vue'
</script>

# Skeleton

A loading placeholder component for indicating content is loading. Supports multiple shape variants and animation styles.

## Demo

<ClientOnly>
  <SkeletonDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular' \| 'rounded'` | `'text'` | Shape variant |
| `width` | `string \| number` | - | Width (number = pixels, string = CSS value) |
| `height` | `string \| number` | - | Height (number = pixels, string = CSS value) |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animation type |

## Usage

```vue
<!-- Text lines -->
<Skeleton />
<Skeleton width="75%" />

<!-- Avatar -->
<Skeleton variant="circular" :width="40" :height="40" />

<!-- Image placeholder -->
<Skeleton variant="rounded" width="200px" height="150px" />
```
