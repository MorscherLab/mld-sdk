<script setup>
import ColorSliderDemo from '../.vitepress/showcase/ColorSliderDemo.vue'
</script>

# ColorSlider

A slider with gradient track and threshold-based value coloring. Ideal for tolerance, quality, or risk indicators where the value badge color communicates meaning.

## Demo

<ClientOnly>
  <ColorSliderDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | - | Current value (v-model) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Slider size |
| `showValue` | `boolean` | `true` | Show colored value badge |
| `showLabels` | `boolean` | `false` | Show min/max labels below slider |
| `minLabel` | `string` | min value | Custom label for minimum |
| `maxLabel` | `string` | max value | Custom label for maximum |
| `colorStops` | `ColorStop[]` | green to yellow to red | Gradient color stops |
| `thresholds` | `[number, number]` | `[10, 30]` | Percentage thresholds for badge color |
| `disabled` | `boolean` | `false` | Disable the slider |

## Types

```ts
interface ColorStop {
  value: number  // Percentage position (0-100)
  color: string  // CSS color value
}
```

## Usage

```vue
<template>
  <!-- PPM Tolerance slider -->
  <ColorSlider
    v-model="tolerance"
    :min="1"
    :max="50"
    show-labels
    min-label="1 (strict)"
    max-label="50 (loose)"
  />

  <!-- Custom gradient and thresholds -->
  <ColorSlider
    v-model="quality"
    :min="0"
    :max="100"
    :thresholds="[80, 50]"
    :color-stops="[
      { value: 0, color: '#ef4444' },
      { value: 50, color: '#eab308' },
      { value: 100, color: '#22c55e' },
    ]"
  />
</template>
```
