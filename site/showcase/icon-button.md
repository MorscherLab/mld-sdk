<script setup>
import IconButtonDemo from '../.vitepress/showcase/IconButtonDemo.vue'
</script>

# IconButton

A compact button designed for icon-only actions with accessible labels. Provides all the same variants and states as BaseButton in a square, icon-sized format.

## Demo

<ClientOnly>
  <IconButtonDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'ghost'` | Button style variant |
| `size` | `ButtonSize` | `'md'` | Button size |
| `label` | `string` | Required | Accessible label (aria-label and title) |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Icon content (typically an SVG) |

## Usage

```vue
<template>
  <IconButton
    variant="danger"
    label="Delete item"
    @click="handleDelete"
  >
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </IconButton>
</template>
```

## Accessibility

The `label` prop is required for accessibility. It provides:

- `aria-label` for screen readers
- `title` for tooltip on hover
