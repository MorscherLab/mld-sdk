<script setup>
import DatePickerDemo from '../.vitepress/showcase/DatePickerDemo.vue'
</script>

# DatePicker

A calendar-based date selection component with today button and clear functionality.

## Demo

<ClientOnly>
  <DatePickerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Selected date in YYYY-MM-DD format (v-model) |
| `placeholder` | `string` | `'Select date'` | Placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `min` | `string` | - | Minimum selectable date (YYYY-MM-DD) |
| `max` | `string` | - | Maximum selectable date (YYYY-MM-DD) |
| `clearable` | `boolean` | `true` | Show clear button when date is selected |
| `disabled` | `boolean` | `false` | Disable the date picker |
| `error` | `boolean` | `false` | Show error state styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| undefined` | Emitted when the selected date changes |

## Usage

```vue
<DatePicker
  v-model="date"
  placeholder="Select a date"
  :min="minDate"
  :max="maxDate"
/>
```
