<script setup lang="ts">
import { ref } from 'vue'
import { BaseRadioGroup, type RadioOption } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const selected = ref<string>('option1')
const plan = ref<string>('pro')

const basicOptions: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const planOptions: RadioOption[] = [
  { value: 'free', label: 'Free', description: 'Basic features, limited usage' },
  { value: 'pro', label: 'Pro', description: 'All features, unlimited usage' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions, dedicated support' },
]

const mixedOptions: RadioOption[] = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled (unavailable)', disabled: true },
  { value: 'custom', label: 'Custom' },
]
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseRadioGroup</h1>
    <p class="text-text-secondary mb-8">
      A radio group component for mutually exclusive option selection.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="space-y-4">
        <BaseRadioGroup v-model="selected" :options="basicOptions" name="basic" />
        <p class="text-sm text-text-secondary">Selected: {{ selected }}</p>
      </div>
    </div>

    <!-- With Descriptions -->
    <div class="demo-section">
      <h3>With Descriptions</h3>
      <div class="space-y-4">
        <BaseRadioGroup v-model="plan" :options="planOptions" name="plan" />
        <p class="text-sm text-text-secondary">Selected plan: {{ plan }}</p>
      </div>
    </div>

    <!-- Directions -->
    <div class="demo-section">
      <h3>Directions</h3>
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Vertical (default)</label>
          <BaseRadioGroup :options="basicOptions" name="vertical" direction="vertical" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Horizontal</label>
          <BaseRadioGroup :options="basicOptions" name="horizontal" direction="horizontal" />
        </div>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-6">
        <div v-for="size in sizes" :key="size" class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseRadioGroup :options="basicOptions" :name="`size-${size}`" :size="size" direction="horizontal" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">With disabled option</label>
          <BaseRadioGroup :options="mixedOptions" name="mixed" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Entire group disabled</label>
          <BaseRadioGroup :options="basicOptions" name="disabled" disabled />
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
            <td><code>RadioOption[]</code></td>
            <td>required</td>
            <td>Array of radio options</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td>required</td>
            <td>HTML name attribute for radio group</td>
          </tr>
          <tr>
            <td><code>direction</code></td>
            <td><code>'horizontal' | 'vertical'</code></td>
            <td><code>'vertical'</code></td>
            <td>Layout direction</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Radio button size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable entire group</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RadioOption Type -->
    <div class="demo-section">
      <h3>RadioOption Type</h3>
      <pre class="code-block">interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}</pre>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { BaseRadioGroup, type RadioOption } from '@morscherlab/mld-sdk'

const selected = ref('option1')

const options: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', description: 'With description' },
  { value: 'option3', label: 'Option 3', disabled: true },
]
&lt;/script&gt;

&lt;template&gt;
  &lt;BaseRadioGroup
    v-model="selected"
    :options="options"
    name="my-radio-group"
    direction="vertical"
  /&gt;
&lt;/template&gt;</pre>
    </div>
  </div>
</template>
