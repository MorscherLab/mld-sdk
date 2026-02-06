<script setup>
import SliderDemo from '../.vitepress/showcase/SliderDemo.vue'
</script>

# BaseSlider

A slider component for numeric range selection with configurable min, max, and step values.

## Demo

<ClientOnly>
  <SliderDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | - | Current value (v-model) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Slider size |
| `showValue` | `boolean` | `true` | Show current value next to slider |
| `disabled` | `boolean` | `false` | Disable the slider |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when the slider value changes |

## Usage

```vue
<BaseSlider
  v-model="volume"
  :min="0"
  :max="100"
  :step="5"
/>
```
