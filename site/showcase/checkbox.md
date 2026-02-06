<script setup>
import CheckboxDemo from '../.vitepress/showcase/CheckboxDemo.vue'
</script>

# BaseCheckbox

A checkbox component for boolean toggle with optional label and size variants.

## Demo

<ClientOnly>
  <CheckboxDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Checkbox state (v-model) |
| `label` | `string` | - | Label text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |
| `disabled` | `boolean` | `false` | Disable the checkbox |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when the checkbox state changes |

## Usage

```vue
<BaseCheckbox
  v-model="accepted"
  label="Accept terms and conditions"
/>

<BaseCheckbox
  v-model="remember"
  label="Remember me"
  size="sm"
/>
```
