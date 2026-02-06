<script setup lang="ts">
import { Skeleton } from '@morscherlab/mld-sdk'
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">Skeleton</h1>
    <p class="text-text-secondary mb-8">
      A loading placeholder component for indicating content is loading.
    </p>

    <!-- Variants -->
    <div class="demo-section">
      <h3>Variants</h3>
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Text (default)</label>
          <div class="space-y-2 max-w-md">
            <Skeleton />
            <Skeleton width="75%" />
            <Skeleton width="50%" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Circular</label>
          <div class="flex gap-4">
            <Skeleton variant="circular" />
            <Skeleton variant="circular" :width="48" :height="48" />
            <Skeleton variant="circular" :width="64" :height="64" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Rectangular</label>
          <Skeleton variant="rectangular" width="200px" height="120px" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Rounded</label>
          <Skeleton variant="rounded" width="200px" height="120px" />
        </div>
      </div>
    </div>

    <!-- Animations -->
    <div class="demo-section">
      <h3>Animations</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Pulse (default)</label>
          <Skeleton animation="pulse" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Wave</label>
          <Skeleton animation="wave" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">None</label>
          <Skeleton animation="none" />
        </div>
      </div>
    </div>

    <!-- Example: Card Loading -->
    <div class="demo-section">
      <h3>Example: Card Loading</h3>
      <div class="max-w-sm p-4 rounded-mld border border-border bg-bg-card">
        <div class="flex items-center gap-3 mb-4">
          <Skeleton variant="circular" :width="40" :height="40" />
          <div class="flex-1 space-y-2">
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </div>
        </div>
        <Skeleton variant="rounded" height="160px" class="mb-4" />
        <div class="space-y-2">
          <Skeleton />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </div>
      </div>
    </div>

    <!-- Example: Table Loading -->
    <div class="demo-section">
      <h3>Example: Table Loading</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <div class="bg-bg-hover p-3 border-b border-border flex gap-4">
          <Skeleton width="100px" />
          <Skeleton width="150px" />
          <Skeleton width="80px" />
          <Skeleton width="120px" />
        </div>
        <div v-for="i in 3" :key="i" class="p-3 border-b border-border last:border-0 flex gap-4">
          <Skeleton width="100px" />
          <Skeleton width="150px" />
          <Skeleton width="80px" />
          <Skeleton width="120px" />
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
            <td><code>variant</code></td>
            <td><code>'text' | 'circular' | 'rectangular' | 'rounded'</code></td>
            <td><code>'text'</code></td>
            <td>Shape variant</td>
          </tr>
          <tr>
            <td><code>width</code></td>
            <td><code>string | number</code></td>
            <td>-</td>
            <td>Width (number = pixels, string = CSS value)</td>
          </tr>
          <tr>
            <td><code>height</code></td>
            <td><code>string | number</code></td>
            <td>-</td>
            <td>Height (number = pixels, string = CSS value)</td>
          </tr>
          <tr>
            <td><code>animation</code></td>
            <td><code>'pulse' | 'wave' | 'none'</code></td>
            <td><code>'pulse'</code></td>
            <td>Animation type</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;!-- Text lines --&gt;
&lt;Skeleton /&gt;
&lt;Skeleton width="75%" /&gt;

&lt;!-- Avatar --&gt;
&lt;Skeleton variant="circular" :width="40" :height="40" /&gt;

&lt;!-- Image placeholder --&gt;
&lt;Skeleton variant="rounded" width="200px" height="150px" /&gt;</pre>
    </div>
  </div>
</template>
