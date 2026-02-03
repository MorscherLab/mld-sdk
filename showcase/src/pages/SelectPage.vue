<script setup lang="ts">
import { ref } from 'vue'
import { BaseSelect, type SelectOption } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const basicOptions: SelectOption<string>[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const optionsWithDescriptions: SelectOption<string>[] = [
  { value: 'react', label: 'React', description: 'A JavaScript library for building user interfaces' },
  { value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
  { value: 'angular', label: 'Angular', description: 'Platform for building mobile & desktop apps' },
  { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
]

const optionsWithDisabled: SelectOption<string>[] = [
  { value: 'active1', label: 'Active Option 1' },
  { value: 'disabled1', label: 'Disabled Option', disabled: true },
  { value: 'active2', label: 'Active Option 2' },
  { value: 'disabled2', label: 'Another Disabled', disabled: true },
]

const numericOptions: SelectOption<number>[] = [
  { value: 10, label: '10 items' },
  { value: 25, label: '25 items' },
  { value: 50, label: '50 items' },
  { value: 100, label: '100 items' },
]

const basicValue = ref('')
const frameworkValue = ref('')
const disabledValue = ref('')
const numericValue = ref<number>(25)
const errorValue = ref('')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseSelect</h1>
    <p class="text-text-secondary mb-8">
      A dropdown select component with support for descriptions and disabled options.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-md">
        <BaseSelect
          v-model="basicValue"
          :options="basicOptions"
          placeholder="Select an option"
        />
        <p class="mt-2 text-sm text-text-secondary">Selected: {{ basicValue || 'None' }}</p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseSelect
            :size="size"
            :options="basicOptions"
            :placeholder="`Size ${size}`"
          />
        </div>
      </div>
    </div>

    <!-- With Descriptions -->
    <div class="demo-section">
      <h3>Options with Descriptions</h3>
      <p class="text-sm text-text-secondary mb-4">Note: Descriptions are available in the options but HTML select doesn't display them. Consider custom dropdown for richer UI.</p>
      <div class="max-w-md">
        <BaseSelect
          v-model="frameworkValue"
          :options="optionsWithDescriptions"
          placeholder="Choose a framework"
        />
        <p class="mt-2 text-sm text-text-secondary">Selected: {{ frameworkValue || 'None' }}</p>
      </div>
    </div>

    <!-- Disabled Options -->
    <div class="demo-section">
      <h3>Disabled Options</h3>
      <div class="max-w-md">
        <BaseSelect
          v-model="disabledValue"
          :options="optionsWithDisabled"
          placeholder="Some options are disabled"
        />
      </div>
    </div>

    <!-- Numeric Values -->
    <div class="demo-section">
      <h3>Numeric Values</h3>
      <div class="max-w-md">
        <BaseSelect
          v-model="numericValue"
          :options="numericOptions"
        />
        <p class="mt-2 text-sm text-text-secondary">Selected: {{ numericValue }} (type: {{ typeof numericValue }})</p>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <BaseSelect
            v-model="errorValue"
            :options="basicOptions"
            error
            placeholder="Select with error"
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <BaseSelect
            :options="basicOptions"
            disabled
            placeholder="Disabled select"
          />
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
            <td><code>string | number</code></td>
            <td>-</td>
            <td>Selected value (v-model)</td>
          </tr>
          <tr>
            <td><code>options</code></td>
            <td><code>SelectOption[]</code></td>
            <td>Required</td>
            <td>Array of options to display</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Placeholder text when no selection</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Select size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the select</td>
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

    <!-- SelectOption Type -->
    <div class="demo-section">
      <h3>SelectOption Type</h3>
      <pre class="code-block">interface SelectOption&lt;T = string&gt; {
  value: T
  label: string
  disabled?: boolean
  description?: string  // For custom implementations
}</pre>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">const options: SelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular', disabled: true },
]

&lt;BaseSelect
  v-model="selectedFramework"
  :options="options"
  placeholder="Choose a framework"
/&gt;</pre>
    </div>
  </div>
</template>
