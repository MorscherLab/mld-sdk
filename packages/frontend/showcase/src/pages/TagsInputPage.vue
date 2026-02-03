<script setup lang="ts">
import { ref } from 'vue'
import { TagsInput } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const tags = ref<string[]>(['Vue', 'TypeScript'])
const skills = ref<string[]>([])
const limitedTags = ref<string[]>(['Tag 1', 'Tag 2'])
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">TagsInput</h1>
    <p class="text-text-secondary mb-8">
      A component for entering multiple tags/keywords with add/remove functionality.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-md space-y-2">
        <TagsInput v-model="tags" placeholder="Add tags..." />
        <p class="text-sm text-text-secondary">Tags: {{ tags.join(', ') || '(none)' }}</p>
        <p class="text-xs text-text-muted">Press Enter or comma to add a tag</p>
      </div>
    </div>

    <!-- Empty State -->
    <div class="demo-section">
      <h3>Empty State</h3>
      <div class="max-w-md">
        <TagsInput v-model="skills" placeholder="Type skills and press Enter..." />
      </div>
    </div>

    <!-- Max Tags -->
    <div class="demo-section">
      <h3>Max Tags Limit</h3>
      <div class="max-w-md space-y-2">
        <TagsInput v-model="limitedTags" :max-tags="5" placeholder="Max 5 tags..." />
        <p class="text-sm text-text-secondary">{{ limitedTags.length }}/5 tags</p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <TagsInput :size="size" :model-value="['Example', 'Tags']" :placeholder="`Size ${size}`" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <TagsInput error :model-value="['Invalid']" placeholder="Error state" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <TagsInput disabled :model-value="['Locked', 'Tags']" placeholder="Disabled" />
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
            <td><code>string[]</code></td>
            <td><code>[]</code></td>
            <td>Array of tags (v-model)</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Placeholder text (shown when empty)</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Input size</td>
          </tr>
          <tr>
            <td><code>maxTags</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Maximum number of tags allowed</td>
          </tr>
          <tr>
            <td><code>allowDuplicates</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Allow duplicate tags</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the input</td>
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
      <pre class="code-block">&lt;TagsInput
  v-model="tags"
  placeholder="Add tags..."
  :max-tags="10"
/&gt;</pre>
    </div>
  </div>
</template>
