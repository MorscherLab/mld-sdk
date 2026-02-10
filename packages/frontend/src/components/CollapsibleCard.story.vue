<script setup lang="ts">
import CollapsibleCard from './CollapsibleCard.vue'
</script>

<template>
  <Story title="Layout/CollapsibleCard">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <CollapsibleCard
            :title="state.title"
            :subtitle="state.subtitle || undefined"
            :default-open="state.defaultOpen"
            :disabled="state.disabled"
            :show-toggle="state.showToggle"
            :toggle-value="state.toggleValue"
          >
            <p style="margin: 0; color: var(--text-muted, #94a3b8);">
              This is the collapsible content area. It can contain any child elements.
            </p>
          </CollapsibleCard>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.subtitle" title="Subtitle" />
        <HstCheckbox v-model="state.defaultOpen" title="Default Open" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.showToggle" title="Show Toggle" />
        <HstCheckbox v-model="state.toggleValue" title="Toggle Value" />
      </template>
    </Variant>

    <Variant title="Open by Default">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard title="Open Section" :default-open="true">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">
            This card starts in the open state by default.
          </p>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="Closed by Default">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard title="Closed Section" :default-open="false">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">
            Click the header to reveal this content.
          </p>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="With Subtitle">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard
          title="Analysis Parameters"
          subtitle="Configure settings for dose-response curve fitting"
          :default-open="true"
        >
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Model: 4-parameter logistic</p>
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Weighting: 1/Y^2</p>
            <p style="margin: 0; color: var(--text-primary, #1e293b);">Iterations: 1000</p>
          </div>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="With Icon">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard
          title="Quality Control"
          subtitle="Plate QC metrics and thresholds"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          :default-open="true"
        >
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">QC parameters and results appear here.</p>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="With Toggle Switch">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard
          title="Notifications"
          subtitle="Enable or disable notifications"
          :default-open="true"
          :show-toggle="true"
          :toggle-value="true"
        >
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">
            Notification preferences and settings.
          </p>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <CollapsibleCard title="Locked Section" :disabled="true" :default-open="false">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">
            This content cannot be accessed.
          </p>
        </CollapsibleCard>
      </div>
    </Variant>

    <Variant title="Multiple Cards">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem;">
        <CollapsibleCard title="General Settings" :default-open="true">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">General configuration options.</p>
        </CollapsibleCard>
        <CollapsibleCard title="Advanced Settings" :default-open="false">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">Advanced configuration for power users.</p>
        </CollapsibleCard>
        <CollapsibleCard title="Export Options" :default-open="false">
          <p style="margin: 0; color: var(--text-muted, #94a3b8);">Configure export format and destination.</p>
        </CollapsibleCard>
      </div>
    </Variant>
  </Story>
</template>
