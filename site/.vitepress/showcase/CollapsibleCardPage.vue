<script setup lang="ts">
import { ref, computed } from 'vue'
import { CollapsibleCard, SegmentedControl, BaseToggle, type SegmentedOption } from '@morscherlab/mld-sdk'

const toggle1 = ref(true)
const toggle2 = ref(false)
const toggle3 = ref(true)

// Peak Picking demo state
const peakPickingEnabled = ref(true)
const peakPickingMethod = ref<string>('v4')
const organizeNames = ref(true)
const skipBlanks = ref(false)

const peakPickingMethods: SegmentedOption[] = [
  { value: 'v4', label: 'v4', description: 'Advanced' },
  { value: 'v2', label: 'v2', description: 'Smoothed' },
  { value: 'v1', label: 'v1', description: 'Basic' },
]

const peakPickingSubtitle = computed(() =>
  peakPickingEnabled.value ? `Enabled (${peakPickingMethod.value})` : 'Disabled'
)

// SVG path icons
const settingsIcon = '<path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>'
const chartIcon = '<path d="M18 20V10M12 20V4M6 20v-6"/>'
const bellIcon = '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>'
const lockIcon = '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>'
const peakIcon = '<path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>'
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">CollapsibleCard</h1>
    <p class="text-text-secondary mb-8">
      An expandable card component with a clickable header. Supports icon badges
      and inline toggle switches for feature toggles.
    </p>

    <!-- RFA Peak Picking Style -->
    <div class="demo-section">
      <h3>Peak Picking Panel Style (RFA)</h3>
      <p class="text-sm text-text-secondary mb-4">
        This pattern matches the RawFileAnalyzer sidebar panels with colored icon, toggle switch,
        and SegmentedControl inside.
      </p>
      <div class="max-w-xs space-y-2">
        <CollapsibleCard
          title="Peak Picking"
          :subtitle="peakPickingSubtitle"
          :icon="peakIcon"
          icon-color="#F97316"
          icon-bg="rgba(249, 115, 22, 0.15)"
          show-toggle
          v-model:toggle-value="peakPickingEnabled"
          toggle-color="#F97316"
          default-open
        >
          <div v-if="peakPickingEnabled" class="space-y-3">
            <!-- Method Section -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium uppercase tracking-wide text-text-muted">Method</label>
              <SegmentedControl
                v-model="peakPickingMethod"
                :options="peakPickingMethods"
                variant="card"
                size="sm"
              />
            </div>

            <!-- Toggle Options -->
            <div class="space-y-1">
              <div class="flex items-center justify-between py-1">
                <span class="text-sm text-text-primary">Organize names</span>
                <BaseToggle v-model="organizeNames" size="sm" />
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-sm text-text-primary">Skip blanks</span>
                <BaseToggle v-model="skipBlanks" size="sm" />
              </div>
            </div>
          </div>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Default Closed -->
    <div class="demo-section">
      <h3>Default Closed</h3>
      <div class="max-w-lg">
        <CollapsibleCard title="Click to expand">
          <p class="text-text-secondary">
            This content is hidden by default. Click the header to reveal it.
            The card smoothly animates open and closed.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Default Open -->
    <div class="demo-section">
      <h3>Default Open</h3>
      <div class="max-w-lg">
        <CollapsibleCard title="Already expanded" default-open>
          <p class="text-text-secondary">
            This card starts in the open state because of the <code>default-open</code> prop.
            Click the header to collapse it.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- With Icon Badge -->
    <div class="demo-section">
      <h3>With Icon Badge</h3>
      <p class="text-sm text-text-secondary mb-4">
        Add visual icons to differentiate sections. Pass SVG path content as the icon prop.
      </p>
      <div class="max-w-lg space-y-2">
        <CollapsibleCard
          title="Settings"
          subtitle="Configure application preferences"
          :icon="settingsIcon"
          icon-color="#3B82F6"
          icon-bg="rgba(59, 130, 246, 0.1)"
          default-open
        >
          <p class="text-text-secondary">
            Application settings content goes here.
          </p>
        </CollapsibleCard>

        <CollapsibleCard
          title="Analytics"
          subtitle="View usage statistics"
          :icon="chartIcon"
          icon-color="#10B981"
          icon-bg="rgba(16, 185, 129, 0.1)"
        >
          <p class="text-text-secondary">
            Analytics dashboard content.
          </p>
        </CollapsibleCard>

        <CollapsibleCard
          title="Notifications"
          subtitle="Manage alert preferences"
          :icon="bellIcon"
          icon-color="#F59E0B"
          icon-bg="rgba(245, 158, 11, 0.1)"
        >
          <p class="text-text-secondary">
            Notification settings content.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- With Toggle Switch -->
    <div class="demo-section">
      <h3>With Toggle Switch</h3>
      <p class="text-sm text-text-secondary mb-4">
        Add inline toggle switches for enabling/disabling features directly from the header.
      </p>
      <div class="max-w-lg space-y-2">
        <CollapsibleCard
          title="Auto-save"
          subtitle="Automatically save changes"
          :icon="settingsIcon"
          icon-color="#3B82F6"
          icon-bg="rgba(59, 130, 246, 0.1)"
          show-toggle
          v-model:toggle-value="toggle1"
          default-open
        >
          <p class="text-text-secondary">
            Auto-save is <strong>{{ toggle1 ? 'enabled' : 'disabled' }}</strong>.
            Configure auto-save interval and other options here.
          </p>
        </CollapsibleCard>

        <CollapsibleCard
          title="Dark Mode"
          subtitle="Use dark color scheme"
          show-toggle
          v-model:toggle-value="toggle2"
        >
          <p class="text-text-secondary">
            Dark mode is <strong>{{ toggle2 ? 'enabled' : 'disabled' }}</strong>.
            Additional theme options can be configured here.
          </p>
        </CollapsibleCard>

        <CollapsibleCard
          title="Notifications"
          subtitle="Receive email alerts"
          :icon="bellIcon"
          icon-color="#F59E0B"
          icon-bg="rgba(245, 158, 11, 0.1)"
          show-toggle
          v-model:toggle-value="toggle3"
        >
          <p class="text-text-secondary">
            Notifications are <strong>{{ toggle3 ? 'enabled' : 'disabled' }}</strong>.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- With Subtitle -->
    <div class="demo-section">
      <h3>With Subtitle</h3>
      <div class="max-w-lg">
        <CollapsibleCard title="Advanced Settings" subtitle="Configure optional features">
          <div class="space-y-3">
            <p class="text-text-secondary">
              The subtitle provides additional context about the section content.
            </p>
            <ul class="list-disc list-inside text-sm text-text-secondary">
              <li>Caching options</li>
              <li>Performance tuning</li>
              <li>Debug settings</li>
            </ul>
          </div>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Disabled -->
    <div class="demo-section">
      <h3>Disabled State</h3>
      <div class="max-w-lg">
        <CollapsibleCard
          title="Locked Section"
          subtitle="Requires admin access"
          :icon="lockIcon"
          icon-color="#6B7280"
          icon-bg="rgba(107, 114, 128, 0.1)"
          disabled
        >
          <p class="text-text-secondary">
            This content cannot be accessed.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Accordion Pattern -->
    <div class="demo-section">
      <h3>Accordion Pattern</h3>
      <p class="text-sm text-text-secondary mb-4">
        Multiple cards can be stacked. Each operates independently.
      </p>
      <div class="max-w-lg space-y-2">
        <CollapsibleCard title="General Settings" subtitle="Basic configuration" default-open>
          <p class="text-text-secondary">
            Configure basic application settings like name, timezone, and language.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Security" subtitle="Authentication and authorization">
          <p class="text-text-secondary">
            Manage security settings including password policies and two-factor authentication.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Integrations" subtitle="Third-party connections" disabled>
          <p class="text-text-secondary">
            Connect to external services and APIs.
          </p>
        </CollapsibleCard>
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
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td>Required</td>
            <td>Card header title</td>
          </tr>
          <tr>
            <td><code>subtitle</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Optional subtitle below title</td>
          </tr>
          <tr>
            <td><code>defaultOpen</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Start in expanded state</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Prevent toggling</td>
          </tr>
          <tr>
            <td><code>icon</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>SVG path content for icon badge</td>
          </tr>
          <tr>
            <td><code>iconColor</code></td>
            <td><code>string</code></td>
            <td><code>var(--color-primary)</code></td>
            <td>Icon stroke/fill color</td>
          </tr>
          <tr>
            <td><code>iconBg</code></td>
            <td><code>string</code></td>
            <td><code>var(--color-primary-soft)</code></td>
            <td>Icon badge background color</td>
          </tr>
          <tr>
            <td><code>showToggle</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show toggle switch in header</td>
          </tr>
          <tr>
            <td><code>toggleValue</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Toggle state (v-model:toggle-value)</td>
          </tr>
          <tr>
            <td><code>toggleColor</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Custom color for toggle when active (e.g., "#F97316")</td>
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
            <td><code>update:toggleValue</code></td>
            <td><code>boolean</code></td>
            <td>Emitted when toggle state changes</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;!-- Basic usage --&gt;
&lt;CollapsibleCard
  title="Advanced Options"
  subtitle="Optional configuration"
  default-open
&gt;
  &lt;p&gt;Collapsible content goes here...&lt;/p&gt;
&lt;/CollapsibleCard&gt;

&lt;!-- With icon badge --&gt;
&lt;CollapsibleCard
  title="Settings"
  subtitle="Configure preferences"
  :icon="settingsIcon"
  icon-color="#3B82F6"
  icon-bg="rgba(59, 130, 246, 0.1)"
&gt;
  Content here...
&lt;/CollapsibleCard&gt;

&lt;!-- With toggle switch --&gt;
&lt;CollapsibleCard
  title="Auto-save"
  subtitle="Save changes automatically"
  show-toggle
  v-model:toggle-value="enabled"
&gt;
  &lt;p&gt;Auto-save is &#123;&#123; enabled ? 'on' : 'off' &#125;&#125;&lt;/p&gt;
&lt;/CollapsibleCard&gt;</pre>
    </div>

    <!-- Behavior -->
    <div class="demo-section">
      <h3>Behavior</h3>
      <ul class="space-y-2 text-sm text-text-secondary">
        <li>Click anywhere on the header to toggle (except the toggle switch)</li>
        <li>Toggle switch operates independently from collapse/expand</li>
        <li>Smooth expand/collapse animation</li>
        <li>Chevron rotates to indicate state</li>
        <li>Supports keyboard navigation (Enter/Space)</li>
        <li>Uses <code>aria-expanded</code> for accessibility</li>
      </ul>
    </div>
  </div>
</template>
