<script setup lang="ts">
import { ref } from 'vue'
import { ScientificNumber } from '@morscherlab/mld-sdk'

const customValue = ref(0.0000342)
</script>

<template>
  <DemoSection title="Auto Notation">
    <div class="flex flex-wrap gap-6 items-baseline">
      <div v-for="val in [1234, 0.005, 67800000, 0.00000012, 42]" :key="val" class="text-center">
        <ScientificNumber :value="val" />
        <p class="text-xs text-text-secondary mt-1">{{ val }}</p>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="Notation Modes">
    <div class="flex flex-col gap-3">
      <div class="flex items-baseline gap-3">
        <span class="text-xs text-text-muted w-24">Scientific:</span>
        <ScientificNumber :value="12345.67" notation="scientific" />
      </div>
      <div class="flex items-baseline gap-3">
        <span class="text-xs text-text-muted w-24">Engineering:</span>
        <ScientificNumber :value="12345.67" notation="engineering" />
      </div>
      <div class="flex items-baseline gap-3">
        <span class="text-xs text-text-muted w-24">Compact:</span>
        <ScientificNumber :value="12345.67" notation="compact" />
      </div>
      <div class="flex items-baseline gap-3">
        <span class="text-xs text-text-muted w-24">Auto:</span>
        <ScientificNumber :value="12345.67" notation="auto" />
      </div>
    </div>
  </DemoSection>

  <DemoSection title="With Units">
    <div class="flex flex-wrap gap-6 items-baseline">
      <ScientificNumber :value="0.0023" unit="mol/L" />
      <ScientificNumber :value="5600000" unit="Da" notation="compact" />
      <ScientificNumber :value="3.14159" :precision="2" unit="rad" />
    </div>
  </DemoSection>

  <DemoSection title="Copyable">
    <ScientificNumber :value="6.022e23" unit="mol⁻¹" :copyable="true" />
  </DemoSection>

  <DemoSection title="Edge Cases">
    <div class="flex flex-wrap gap-6 items-baseline">
      <div class="text-center">
        <ScientificNumber :value="0" />
        <p class="text-xs text-text-secondary mt-1">Zero</p>
      </div>
      <div class="text-center">
        <ScientificNumber :value="NaN" />
        <p class="text-xs text-text-secondary mt-1">NaN</p>
      </div>
      <div class="text-center">
        <ScientificNumber :value="Infinity" />
        <p class="text-xs text-text-secondary mt-1">Infinity</p>
      </div>
      <div class="text-center">
        <ScientificNumber :value="-0.0042" />
        <p class="text-xs text-text-secondary mt-1">Negative</p>
      </div>
    </div>
  </DemoSection>
</template>
