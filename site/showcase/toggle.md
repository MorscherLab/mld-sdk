<script setup>
import ToggleDemo from '../.vitepress/showcase/ToggleDemo.vue'
</script>

# BaseToggle

A switch-style toggle component for boolean values with label and size variants.

## Demo

<ClientOnly>
  <ToggleDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Toggle state (v-model) |
| `label` | `string` | - | Label text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggle size |
| `disabled` | `boolean` | `false` | Disable the toggle |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when the toggle state changes |

## Usage

```vue
<BaseToggle
  v-model="darkMode"
  label="Enable dark mode"
/>

<BaseToggle
  v-model="notifications"
  label="Push notifications"
  size="lg"
/>
```
