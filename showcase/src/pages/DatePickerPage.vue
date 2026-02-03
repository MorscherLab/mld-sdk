<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const selectedDate = ref<string>()
const eventDate = ref<string>('2024-12-25')
const rangeDate = ref<string>()

const today = new Date()
const minDate = today.toISOString().split('T')[0]
const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString().split('T')[0]
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">DatePicker</h1>
    <p class="text-text-secondary mb-8">
      A calendar-based date selection component with today button and clear functionality.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-xs space-y-2">
        <DatePicker v-model="selectedDate" placeholder="Select a date" />
        <p class="text-sm text-text-secondary">Selected: {{ selectedDate || '(none)' }}</p>
      </div>
    </div>

    <!-- With Initial Value -->
    <div class="demo-section">
      <h3>With Initial Value</h3>
      <div class="max-w-xs space-y-2">
        <DatePicker v-model="eventDate" />
        <p class="text-sm text-text-secondary">Event date: {{ eventDate }}</p>
      </div>
    </div>

    <!-- Date Range Constraints -->
    <div class="demo-section">
      <h3>Date Range Constraints</h3>
      <div class="max-w-xs space-y-2">
        <DatePicker
          v-model="rangeDate"
          :min="minDate"
          :max="maxDate"
          placeholder="Select date (next 3 months)"
        />
        <p class="text-xs text-text-muted">
          Dates outside {{ minDate }} to {{ maxDate }} are disabled
        </p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4 max-w-xs">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <DatePicker :size="size" :placeholder="`Size ${size}`" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-xs">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <DatePicker error placeholder="Invalid date" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <DatePicker disabled placeholder="Disabled" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Not Clearable</label>
          <DatePicker model-value="2024-06-15" :clearable="false" />
        </div>
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Selected date in YYYY-MM-DD format (v-model)</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>'Select date'</code></td>
            <td>Placeholder text</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Input size</td>
          </tr>
          <tr>
            <td><code>min</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Minimum selectable date (YYYY-MM-DD)</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Maximum selectable date (YYYY-MM-DD)</td>
          </tr>
          <tr>
            <td><code>clearable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show clear button when date is selected</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the date picker</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show error state styling</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;DatePicker
  v-model="date"
  placeholder="Select a date"
  :min="minDate"
  :max="maxDate"
/&gt;</pre>
    </div>
  </div>
</template>
