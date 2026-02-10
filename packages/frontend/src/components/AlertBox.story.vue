<script setup lang="ts">
import { ref } from 'vue'
import AlertBox from './AlertBox.vue'
import type { AlertType } from '../types'

const alertTypes: AlertType[] = ['info', 'success', 'warning', 'error']
const dismissed = ref(false)

function handleDismiss() {
  dismissed.value = true
  setTimeout(() => { dismissed.value = false }, 2000)
}
</script>

<template>
  <Story title="Feedback/AlertBox">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
          <AlertBox
            :type="state.type"
            :title="state.showTitle ? state.title : undefined"
            :dismissible="state.dismissible"
            @dismiss="() => console.log('dismissed')"
          >
            {{ state.message }}
          </AlertBox>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="alertTypes.map(t => ({ label: t, value: t }))"
        />
        <HstCheckbox v-model="state.showTitle" title="Show Title" />
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.message" title="Message" />
        <HstCheckbox v-model="state.dismissible" title="Dismissible" />
      </template>
    </Variant>

    <Variant title="All Types">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <AlertBox
          v-for="type in alertTypes"
          :key="type"
          :type="type"
          :title="`${type.charAt(0).toUpperCase() + type.slice(1)} Alert`"
        >
          This is a {{ type }} alert message with supporting details.
        </AlertBox>
      </div>
    </Variant>

    <Variant title="Dismissible">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <AlertBox
          v-if="!dismissed"
          type="warning"
          title="Experiment incomplete"
          dismissible
          @dismiss="handleDismiss"
        >
          3 wells have missing sample assignments. Click dismiss to hide this alert (it will reappear after 2 seconds).
        </AlertBox>
        <p v-else style="color: var(--text-muted, #94a3b8); font-style: italic;">
          Alert dismissed. Reappearing shortly...
        </p>
      </div>
    </Variant>

    <Variant title="Without Title">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <AlertBox type="info">
          A simple informational message without a title.
        </AlertBox>
        <AlertBox type="error">
          Something went wrong while processing the sample batch.
        </AlertBox>
      </div>
    </Variant>

    <Variant title="Rich Content">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <AlertBox type="success" title="Analysis Complete">
          <p style="margin: 0 0 0.5rem;">
            Successfully processed <strong>96 wells</strong> across 3 plates.
          </p>
          <ul style="margin: 0; padding-left: 1.25rem;">
            <li>Peak detection: 1,247 peaks found</li>
            <li>QC passed: 94/96 wells</li>
            <li>Outliers flagged: 2 wells (B3, G11)</li>
          </ul>
        </AlertBox>
      </div>
    </Variant>
  </Story>
</template>
