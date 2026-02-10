<script setup lang="ts">
import StatusIndicator from './StatusIndicator.vue'
import type { StatusType } from '../types'

const statuses: StatusType[] = ['success', 'warning', 'error', 'info', 'muted']
</script>

<template>
  <Story title="Feedback/StatusIndicator">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <StatusIndicator
            :status="state.status"
            :label="state.label || undefined"
            :pulse="state.pulse"
            :color="state.customColor || undefined"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.status"
          title="Status"
          :options="statuses.map(s => ({ label: s, value: s }))"
        />
        <HstText v-model="state.label" title="Label" />
        <HstCheckbox v-model="state.pulse" title="Pulse" />
        <HstText v-model="state.customColor" title="Custom Color" />
      </template>
    </Variant>

    <Variant title="All Statuses">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
        <StatusIndicator
          v-for="status in statuses"
          :key="status"
          :status="status"
          :label="status.charAt(0).toUpperCase() + status.slice(1)"
        />
      </div>
    </Variant>

    <Variant title="With Pulse">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
        <StatusIndicator status="success" label="Connected" :pulse="true" />
        <StatusIndicator status="warning" label="Syncing" :pulse="true" />
        <StatusIndicator status="error" label="Disconnected" :pulse="true" />
        <StatusIndicator status="info" label="Processing" :pulse="true" />
      </div>
    </Variant>

    <Variant title="Dot Only (No Label)">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <StatusIndicator
          v-for="status in statuses"
          :key="status"
          :status="status"
        />
      </div>
    </Variant>

    <Variant title="Custom Colors">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
        <StatusIndicator color="#8b5cf6" label="Purple (custom)" />
        <StatusIndicator color="#ec4899" label="Pink (custom)" />
        <StatusIndicator color="#14b8a6" label="Teal (custom)" />
        <StatusIndicator color="#f97316" label="Orange (custom)" />
      </div>
    </Variant>

    <Variant title="Practical Example">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <h3 style="margin: 0 0 1rem; color: var(--text-primary, #1e293b); font-size: 0.875rem; font-weight: 600;">
          System Status
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Database</span>
            <StatusIndicator status="success" label="Online" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Analysis Engine</span>
            <StatusIndicator status="warning" label="Degraded" :pulse="true" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">File Storage</span>
            <StatusIndicator status="success" label="Online" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Scheduler</span>
            <StatusIndicator status="error" label="Offline" :pulse="true" />
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
