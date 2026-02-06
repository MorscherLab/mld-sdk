<script setup>
import NumberInputDemo from '../.vitepress/showcase/NumberInputDemo.vue'
</script>

# NumberInput

A number input with increment/decrement buttons for easy value adjustment.

## Demo

<ClientOnly>
  <NumberInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | - | Current value (v-model) |
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `step` | `number` | `1` | Increment/decrement step |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `boolean` | `false` | Show error state styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when the value changes |

## Usage

```vue
<NumberInput
  v-model="quantity"
  :min="1"
  :max="99"
  :step="1"
/>
```
