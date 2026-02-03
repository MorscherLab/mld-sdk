<script setup lang="ts">
import { ref } from 'vue'
import { ColorSlider } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const tolerance = ref(5)
const quality = ref(75)
const risk = ref(50)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ColorSlider</h1>
    <p class="text-text-secondary mb-8">
      A slider with gradient track and threshold-based value coloring. Ideal for tolerance, quality, or risk indicators.
    </p>

    <!-- Basic Usage (PPM Tolerance Style) -->
    <div class="demo-section">
      <h3>PPM Tolerance Example</h3>
      <p class="text-sm text-text-secondary mb-4">
        Green (strict) → Yellow (moderate) → Red (loose). Value badge changes color based on thresholds.
      </p>
      <div class="max-w-md space-y-2">
        <ColorSlider
          v-model="tolerance"
          :min="1"
          :max="50"
          show-labels
          min-label="1 (strict)"
          max-label="50 (loose)"
        />
        <p class="text-sm text-text-secondary">Mass tolerance: {{ tolerance }} ppm</p>
      </div>
    </div>

    <!-- Quality Score (Reversed) -->
    <div class="demo-section">
      <h3>Quality Score (High = Good)</h3>
      <p class="text-sm text-text-secondary mb-4">
        Custom thresholds: Red below 50%, Yellow 50-80%, Green above 80%.
      </p>
      <div class="max-w-md space-y-2">
        <ColorSlider
          v-model="quality"
          :min="0"
          :max="100"
          :thresholds="[80, 50]"
          :color-stops="[
            { value: 0, color: '#ef4444' },
            { value: 50, color: '#eab308' },
            { value: 100, color: '#22c55e' },
          ]"
          show-labels
          min-label="0%"
          max-label="100%"
        />
        <p class="text-sm text-text-secondary">Quality: {{ quality }}%</p>
      </div>
    </div>

    <!-- Risk Level -->
    <div class="demo-section">
      <h3>Risk Level</h3>
      <div class="max-w-md space-y-2">
        <ColorSlider
          v-model="risk"
          :min="0"
          :max="100"
          :thresholds="[30, 70]"
          show-labels
          min-label="Low risk"
          max-label="High risk"
        />
        <p class="text-sm text-text-secondary">Risk: {{ risk }}%</p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-6 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <ColorSlider :size="size" :model-value="25" :min="1" :max="50" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-6 max-w-md">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Without value badge</label>
          <ColorSlider :model-value="30" :min="1" :max="50" :show-value="false" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <ColorSlider :model-value="15" :min="1" :max="50" disabled />
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
            <td><code>number</code></td>
            <td>-</td>
            <td>Current value (v-model)</td>
          </tr>
          <tr>
            <td><code>min</code></td>
            <td><code>number</code></td>
            <td><code>0</code></td>
            <td>Minimum value</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>number</code></td>
            <td><code>100</code></td>
            <td>Maximum value</td>
          </tr>
          <tr>
            <td><code>step</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Step increment</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Slider size</td>
          </tr>
          <tr>
            <td><code>showValue</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show colored value badge</td>
          </tr>
          <tr>
            <td><code>showLabels</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show min/max labels below slider</td>
          </tr>
          <tr>
            <td><code>minLabel</code></td>
            <td><code>string</code></td>
            <td>min value</td>
            <td>Custom label for minimum</td>
          </tr>
          <tr>
            <td><code>maxLabel</code></td>
            <td><code>string</code></td>
            <td>max value</td>
            <td>Custom label for maximum</td>
          </tr>
          <tr>
            <td><code>colorStops</code></td>
            <td><code>ColorStop[]</code></td>
            <td>green→yellow→red</td>
            <td>Gradient color stops</td>
          </tr>
          <tr>
            <td><code>thresholds</code></td>
            <td><code>[number, number]</code></td>
            <td><code>[10, 30]</code></td>
            <td>Percentage thresholds for badge color</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the slider</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ColorStop Type -->
    <div class="demo-section">
      <h3>ColorStop Type</h3>
      <pre class="code-block">interface ColorStop {
  value: number  // Percentage position (0-100)
  color: string  // CSS color value
}</pre>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;!-- PPM Tolerance slider --&gt;
&lt;ColorSlider
  v-model="tolerance"
  :min="1"
  :max="50"
  show-labels
  min-label="1 (strict)"
  max-label="50 (loose)"
/&gt;

&lt;!-- Custom gradient and thresholds --&gt;
&lt;ColorSlider
  v-model="quality"
  :min="0"
  :max="100"
  :thresholds="[80, 50]"
  :color-stops="[
    { value: 0, color: '#ef4444' },
    { value: 50, color: '#eab308' },
    { value: 100, color: '#22c55e' },
  ]"
/&gt;</pre>
    </div>
  </div>
</template>
