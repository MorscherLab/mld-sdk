<script setup>
import CalendarDemo from '../.vitepress/showcase/CalendarDemo.vue'
</script>

# Calendar

Month calendar with date selection, range selection, and custom markers. Supports single, multiple, and range selection modes with min/max constraints.

## Demo

<ClientOnly>
  <CalendarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date \| Date[] \| { start: Date; end: Date } \| null` | — | Selected date(s) (v-model) |
| `selectionMode` | `CalendarSelectionMode` | `'single'` | Selection behavior |
| `month` | `number` | Current month | Display month (0-11) |
| `year` | `number` | Current year | Display year |
| `fixedWeeks` | `boolean` | `true` | Always show 6 weeks |
| `weekStartsOn` | `0-6` | `1` | First day of week (0=Sun) |
| `showOutsideDays` | `boolean` | `true` | Show adjacent month days |
| `showNavigation` | `boolean` | `true` | Show prev/next buttons |
| `markers` | `CalendarMarker[]` | `[]` | Visual markers on dates |
| `minDate` | `Date \| string` | — | Earliest selectable date |
| `maxDate` | `Date \| string` | — | Latest selectable date |
| `disabledDates` | `Array<Date \| string>` | `[]` | Specific disabled dates |
| `isDateDisabled` | `(date: Date) => boolean` | — | Custom disable logic |
| `locale` | `string` | `'en-US'` | Locale for formatting |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Date \| Date[] \| { start; end }` | Selection changed |
| `update:month` | `number` | Displayed month changed |
| `update:year` | `number` | Displayed year changed |
| `day-click` | `CalendarDayContext` | A day was clicked |
| `navigate` | `direction, month, year` | Month navigation occurred |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header` | `month, year, prevMonth, nextMonth` | Custom header content |
| `week-day` | `dayName, index` | Custom weekday label |
| `day-content` | `day: CalendarDayContext` | Custom day cell content |

## Usage

```vue
<template>
  <!-- Single selection -->
  <Calendar v-model="date" />

  <!-- Range selection with markers -->
  <Calendar
    v-model="range"
    selection-mode="range"
    :markers="[
      { date: '2024-03-15', color: '#22c55e', label: 'Event' }
    ]"
  />
</template>
```
