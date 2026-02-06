<script setup lang="ts">
import { ref } from 'vue'
import { BaseTextarea } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const
const resizeOptions = ['none', 'vertical', 'horizontal', 'both'] as const

const textValue = ref('')
const errorValue = ref('This has an error')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseTextarea</h1>
    <p class="text-text-secondary mb-8">
      A multi-line text input component with resize options and size variants.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-md">
        <BaseTextarea v-model="textValue" placeholder="Enter your message..." />
        <p class="mt-2 text-sm text-text-secondary">Value: {{ textValue || '(empty)' }}</p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseTextarea :size="size" :placeholder="`Size ${size}`" :rows="2" />
        </div>
      </div>
    </div>

    <!-- Resize Options -->
    <div class="demo-section">
      <h3>Resize Options</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="resize in resizeOptions" :key="resize" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">resize: {{ resize }}</label>
          <BaseTextarea :resize="resize" :placeholder="`Resize ${resize}`" :rows="2" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <BaseTextarea v-model="errorValue" error />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <BaseTextarea disabled placeholder="Disabled textarea" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Readonly</label>
          <BaseTextarea readonly model-value="This is read-only content" />
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
            <td>Textarea value (v-model)</td>
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
            <td>Textarea size</td>
          </tr>
          <tr>
            <td><code>rows</code></td>
            <td><code>number</code></td>
            <td><code>3</code></td>
            <td>Number of visible rows</td>
          </tr>
          <tr>
            <td><code>resize</code></td>
            <td><code>'none' | 'vertical' | 'horizontal' | 'both'</code></td>
            <td><code>'vertical'</code></td>
            <td>Resize behavior</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the textarea</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Make textarea read-only</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show error state styling</td>
          </tr>
          <tr>
            <td><code>maxlength</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Maximum character length</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseTextarea
  v-model="message"
  placeholder="Enter your message..."
  :rows="5"
  resize="vertical"
/&gt;</pre>
    </div>
  </div>
</template>
