<script setup lang="ts">
import { ref } from 'vue'
import GroupingModal from './GroupingModal.vue'

const mockSamples = [
  'CTRL_Rep1', 'CTRL_Rep2', 'CTRL_Rep3',
  'TREAT_A_Rep1', 'TREAT_A_Rep2', 'TREAT_A_Rep3',
  'TREAT_B_Rep1', 'TREAT_B_Rep2', 'TREAT_B_Rep3',
]

const isOpen = ref(false)
</script>

<template>
  <Story title="Lab/GroupingModal">
    <Variant title="Playground">
      <div style="padding: 2rem;">
        <button
          type="button"
          style="
            padding: 0.5rem 1rem;
            background: var(--bg-card, #fff);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
          "
          @click="isOpen = true"
        >
          Open Grouping Modal
        </button>
        <GroupingModal
          :open="isOpen"
          :samples="mockSamples"
          @close="isOpen = false"
          @apply="(mapping, columns) => { console.log('Applied grouping:', mapping, columns); isOpen = false }"
        />
      </div>
    </Variant>

    <Variant title="Open by Default">
      <div style="padding: 2rem;">
        <GroupingModal
          :open="true"
          :samples="mockSamples"
          @close="() => {}"
          @apply="() => {}"
        />
      </div>
    </Variant>
  </Story>
</template>
