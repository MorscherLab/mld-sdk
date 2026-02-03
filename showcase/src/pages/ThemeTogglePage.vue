<script setup lang="ts">
import { ThemeToggle, useTheme, AlertBox } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const { isDark, toggleTheme, setTheme } = useTheme()
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ThemeToggle</h1>
    <p class="text-text-secondary mb-8">
      A button component that toggles between light and dark themes.
    </p>

    <!-- Current Theme -->
    <div class="demo-section">
      <h3>Current Theme</h3>
      <AlertBox :type="isDark ? 'info' : 'warning'">
        <p>
          Current theme: <strong>{{ isDark ? 'Dark' : 'Light' }}</strong>
        </p>
      </AlertBox>
    </div>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <p class="text-sm text-text-secondary mb-4">Click to toggle the theme</p>
      <ThemeToggle />
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="demo-grid items-end">
        <div v-for="size in sizes" :key="size" class="text-center">
          <ThemeToggle :size="size" />
          <p class="text-xs text-text-muted mt-2">{{ size }}</p>
        </div>
      </div>
    </div>

    <!-- Inline with Text -->
    <div class="demo-section">
      <h3>Inline with Text</h3>
      <div class="flex items-center gap-3">
        <span class="text-text-secondary">Toggle theme:</span>
        <ThemeToggle size="sm" />
      </div>
    </div>

    <!-- useTheme Composable -->
    <div class="demo-section">
      <h3>useTheme() Composable</h3>
      <p class="text-sm text-text-secondary mb-4">
        The theme can also be controlled programmatically:
      </p>
      <div class="demo-grid">
        <button
          class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
          @click="setTheme('light')"
        >
          Set Light
        </button>
        <button
          class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
          @click="setTheme('dark')"
        >
          Set Dark
        </button>
        <button
          class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
          @click="toggleTheme"
        >
          Toggle
        </button>
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
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Button size</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- useTheme API -->
    <div class="demo-section">
      <h3>useTheme() API</h3>
      <pre class="code-block">import { useTheme } from '@morscherlab/mld-sdk'

const { isDark, toggleTheme, setTheme } = useTheme()

// Check current theme
console.log(isDark.value) // true or false

// Toggle theme
toggleTheme()

// Set specific theme
setTheme('dark')
setTheme('light')</pre>
    </div>

    <!-- Return Values -->
    <div class="demo-section">
      <h3>useTheme() Return Values</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Property/Method</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>isDark</code></td>
            <td><code>Ref&lt;boolean&gt;</code></td>
            <td>Reactive boolean indicating dark mode</td>
          </tr>
          <tr>
            <td><code>toggleTheme()</code></td>
            <td><code>() =&gt; void</code></td>
            <td>Toggle between light and dark</td>
          </tr>
          <tr>
            <td><code>setTheme()</code></td>
            <td><code>(theme: 'light' | 'dark') =&gt; void</code></td>
            <td>Set a specific theme</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;!-- Simple usage --&gt;
&lt;ThemeToggle /&gt;

&lt;!-- With size --&gt;
&lt;ThemeToggle size="sm" /&gt;

&lt;!-- In a header --&gt;
&lt;AppTopBar title="Dashboard"&gt;
  &lt;template #actions&gt;
    &lt;ThemeToggle size="sm" /&gt;
  &lt;/template&gt;
&lt;/AppTopBar&gt;</pre>
    </div>

    <!-- Behavior -->
    <div class="demo-section">
      <h3>Behavior</h3>
      <ul class="space-y-2 text-sm text-text-secondary">
        <li>Theme preference is persisted in localStorage</li>
        <li>Applies <code>dark</code> class to the document root</li>
        <li>Shows sun icon in dark mode, moon icon in light mode</li>
        <li>Accessible with keyboard navigation</li>
      </ul>
    </div>
  </div>
</template>
