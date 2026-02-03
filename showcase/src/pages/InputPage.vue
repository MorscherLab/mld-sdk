<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, type InputType } from '@morscherlab/mld-sdk'

const inputTypes: InputType[] = ['text', 'password', 'email', 'number', 'search', 'tel', 'url']
const sizes = ['sm', 'md', 'lg'] as const

const textValue = ref('')
const passwordValue = ref('')
const emailValue = ref('')
const numberValue = ref<number | undefined>(undefined)
const searchValue = ref('')
const errorValue = ref('Invalid input')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseInput</h1>
    <p class="text-text-secondary mb-8">
      A flexible input component supporting various types and states.
    </p>

    <!-- Input Types -->
    <div class="demo-section">
      <h3>Input Types</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="type in inputTypes" :key="type" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">{{ type }}</label>
          <BaseInput :type="type" :placeholder="`Enter ${type}...`" />
        </div>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseInput :size="size" :placeholder="`Size ${size}`" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Normal</label>
          <BaseInput v-model="textValue" placeholder="Enter text..." />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <BaseInput v-model="errorValue" error placeholder="Invalid input" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <BaseInput disabled placeholder="Disabled input" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Readonly</label>
          <BaseInput readonly model-value="Read-only value" />
        </div>
      </div>
    </div>

    <!-- Number Input -->
    <div class="demo-section">
      <h3>Number Input with Min/Max</h3>
      <div class="max-w-md">
        <BaseInput
          v-model="numberValue"
          type="number"
          :min="0"
          :max="100"
          :step="5"
          placeholder="Enter a number (0-100, step 5)"
        />
        <p class="mt-2 text-sm text-text-secondary">Value: {{ numberValue }}</p>
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
            <td>Input value (v-model)</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>InputType</code></td>
            <td><code>'text'</code></td>
            <td>HTML input type</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Placeholder text</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Input size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the input</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Make input read-only</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show error state styling</td>
          </tr>
          <tr>
            <td><code>min</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Minimum value (for number type)</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Maximum value (for number type)</td>
          </tr>
          <tr>
            <td><code>step</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Step increment (for number type)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>string | number</code></td>
            <td>Emitted on input (for v-model)</td>
          </tr>
          <tr>
            <td><code>focus</code></td>
            <td><code>FocusEvent</code></td>
            <td>Emitted when input gains focus</td>
          </tr>
          <tr>
            <td><code>blur</code></td>
            <td><code>FocusEvent</code></td>
            <td>Emitted when input loses focus</td>
          </tr>
          <tr>
            <td><code>keydown</code></td>
            <td><code>KeyboardEvent</code></td>
            <td>Emitted on keydown</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseInput
  v-model="email"
  type="email"
  placeholder="Enter email"
  :error="hasError"
/&gt;

&lt;BaseInput
  v-model="count"
  type="number"
  :min="0"
  :max="100"
  :step="5"
/&gt;</pre>
    </div>
  </div>
</template>
