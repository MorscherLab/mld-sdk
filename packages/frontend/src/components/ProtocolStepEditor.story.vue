<script setup lang="ts">
import ProtocolStepEditor from './ProtocolStepEditor.vue'
import type { ProtocolStep } from '../types'

const editStep: ProtocolStep = {
  id: 'step-edit',
  type: 'incubation',
  name: 'Overnight Incubation',
  description: 'Incubate at 37C with 5% CO2 for cell attachment.',
  duration: 960,
  status: 'pending',
  parameters: { temperature: 37, co2_percent: 5, humidity: 95 },
  order: 0,
}

function initState() {
  return {
    mode: 'create' as const,
    showPreview: true,
  }
}
</script>

<template>
  <Story title="Lab/ProtocolStepEditor">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px;">
          <ProtocolStepEditor
            :mode="state.mode"
            :show-preview="state.showPreview"
            @save="(step) => console.log('Saved:', step)"
            @cancel="() => console.log('Cancelled')"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSelect
          v-model="state.mode"
          title="Mode"
          :options="[
            { value: 'create', label: 'Create' },
            { value: 'edit', label: 'Edit' },
          ]"
        />
        <HstCheckbox v-model="state.showPreview" title="Show Preview" />
      </template>
    </Variant>

    <Variant title="Edit Mode">
      <div style="padding: 2rem; max-width: 600px;">
        <ProtocolStepEditor
          mode="edit"
          :model-value="editStep"
          @save="(step) => console.log('Saved:', step)"
        />
      </div>
    </Variant>

    <Variant title="No Preview">
      <div style="padding: 2rem; max-width: 600px;">
        <ProtocolStepEditor
          mode="create"
          :show-preview="false"
        />
      </div>
    </Variant>
  </Story>
</template>
