<script setup lang="ts">
import { CollapsibleCard } from '@morscherlab/mld-sdk'
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">CollapsibleCard</h1>
    <p class="text-text-secondary mb-8">
      An expandable card component with a clickable header.
    </p>

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
        <CollapsibleCard title="Locked Section" subtitle="Requires admin access" disabled>
          <p class="text-text-secondary">
            This content cannot be accessed.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Multiple Cards -->
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

        <CollapsibleCard title="Notifications" subtitle="Email and push settings">
          <p class="text-text-secondary">
            Configure how and when you receive notifications from the application.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Integrations" subtitle="Third-party connections" disabled>
          <p class="text-text-secondary">
            Connect to external services and APIs.
          </p>
        </CollapsibleCard>
      </div>
    </div>

    <!-- Rich Content -->
    <div class="demo-section">
      <h3>Rich Content</h3>
      <div class="max-w-lg">
        <CollapsibleCard title="Order Summary" subtitle="3 items" default-open>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Widget Pro</span>
              <span class="text-text-primary">$29.99</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Widget Standard</span>
              <span class="text-text-primary">$19.99</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Widget Basic</span>
              <span class="text-text-primary">$9.99</span>
            </div>
            <div class="border-t border-border pt-3 flex justify-between font-medium">
              <span class="text-text-primary">Total</span>
              <span class="text-text-primary">$59.97</span>
            </div>
          </div>
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
        </tbody>
      </table>
    </div>

    <!-- Slots Table -->
    <div class="demo-section">
      <h3>Slots</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code></td>
            <td>Collapsible content</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;CollapsibleCard
  title="Advanced Options"
  subtitle="Optional configuration"
  default-open
&gt;
  &lt;p&gt;Collapsible content goes here...&lt;/p&gt;
&lt;/CollapsibleCard&gt;

&lt;!-- Accordion pattern --&gt;
&lt;div class="space-y-2"&gt;
  &lt;CollapsibleCard title="Section 1" default-open&gt;
    Content 1
  &lt;/CollapsibleCard&gt;
  &lt;CollapsibleCard title="Section 2"&gt;
    Content 2
  &lt;/CollapsibleCard&gt;
  &lt;CollapsibleCard title="Section 3" disabled&gt;
    Locked content
  &lt;/CollapsibleCard&gt;
&lt;/div&gt;</pre>
    </div>

    <!-- Behavior -->
    <div class="demo-section">
      <h3>Behavior</h3>
      <ul class="space-y-2 text-sm text-text-secondary">
        <li>Click anywhere on the header to toggle</li>
        <li>Smooth expand/collapse animation</li>
        <li>Chevron rotates to indicate state</li>
        <li>Supports keyboard navigation (Enter/Space)</li>
        <li>Uses <code>aria-expanded</code> for accessibility</li>
      </ul>
    </div>
  </div>
</template>
