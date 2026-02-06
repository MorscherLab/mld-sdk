<script setup>
import ButtonDemo from '../.vitepress/showcase/ButtonDemo.vue'
</script>

# BaseButton

A versatile button component with multiple variants, sizes, and states. Supports loading indicators and full-width layout.

## Demo

<ClientOnly>
  <ButtonDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'primary'` | Button style variant |
| `size` | `ButtonSize` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `fullWidth` | `boolean` | `false` | Expand to full container width |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when button is clicked (not when disabled or loading) |

## Usage

```vue
<template>
  <BaseButton variant="primary" size="md">
    Click me
  </BaseButton>

  <BaseButton variant="danger" :loading="isLoading" @click="handleClick">
    Delete
  </BaseButton>
</template>
```
