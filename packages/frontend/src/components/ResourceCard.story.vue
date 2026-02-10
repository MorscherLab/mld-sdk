<script setup lang="ts">
import ResourceCard from './ResourceCard.vue'
import type { ResourceSpec } from '../types/components'

const plateReaderSpecs: ResourceSpec[] = [
  { label: 'Detection', value: 'Absorbance, Fluorescence, Luminescence' },
  { label: 'Plate formats', value: '6 to 384-well' },
  { label: 'Temperature', value: 'RT to 45 C' },
]

const flowCytoSpecs: ResourceSpec[] = [
  { label: 'Lasers', value: '405nm, 488nm, 561nm, 640nm' },
  { label: 'Detectors', value: '14 fluorescence + FSC/SSC' },
  { label: 'Throughput', value: 'Up to 10,000 events/sec' },
]

function initState() {
  return {
    name: 'BMG CLARIOstar Plus',
    description: 'Multi-mode microplate reader with UV/Vis absorbance, fluorescence, and luminescence detection.',
    status: 'available' as const,
    location: 'Lab 204, Bench 3',
    specs: plateReaderSpecs,
    tags: ['Plate Reader', 'High-throughput'],
    nextAvailable: undefined as string | undefined,
    showBookAction: true,
    compact: false,
    size: 'md' as const,
  }
}
</script>

<template>
  <Story title="Scheduling/ResourceCard">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px;">
          <ResourceCard
            :name="state.name"
            :description="state.description"
            :status="state.status"
            :location="state.location"
            :specs="state.specs"
            :tags="state.tags"
            :next-available="state.nextAvailable"
            :show-book-action="state.showBookAction"
            :compact="state.compact"
            :size="state.size"
            @book="() => console.log('Book clicked')"
            @click="() => console.log('Card clicked')"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.name" title="Name" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect
          v-model="state.status"
          title="Status"
          :options="[
            { value: 'available', label: 'Available' },
            { value: 'in-use', label: 'In Use' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'offline', label: 'Offline' },
          ]"
        />
        <HstText v-model="state.location" title="Location" />
        <HstCheckbox v-model="state.showBookAction" title="Show Book Action" />
        <HstCheckbox v-model="state.compact" title="Compact" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="In Use">
      <div style="padding: 2rem; max-width: 500px;">
        <ResourceCard
          name="BD FACSCanto II"
          description="Flow cytometer with 3-laser, 8-color capability for cell analysis."
          status="in-use"
          location="Lab 201, Room B"
          :specs="flowCytoSpecs"
          :tags="['Flow Cytometry', 'Cell Analysis']"
          next-available="Today at 15:30"
        />
      </div>
    </Variant>

    <Variant title="Maintenance">
      <div style="padding: 2rem; max-width: 500px;">
        <ResourceCard
          name="Thermo Fisher Centrifuge"
          description="High-speed refrigerated centrifuge for sample processing."
          status="maintenance"
          location="Lab 203"
          :tags="['Centrifuge']"
          next-available="Tomorrow at 09:00"
        />
      </div>
    </Variant>

    <Variant title="Compact Mode">
      <div style="padding: 2rem; max-width: 500px; display: flex; flex-direction: column; gap: 0.5rem;">
        <ResourceCard name="Plate Reader" status="available" compact />
        <ResourceCard name="Flow Cytometer" status="in-use" compact />
        <ResourceCard name="Centrifuge" status="maintenance" compact />
        <ResourceCard name="Mass Spec" status="offline" compact />
      </div>
    </Variant>

    <Variant title="All Statuses (Card)">
      <div style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 900px;">
        <ResourceCard
          name="Available Resource"
          description="This resource is available for booking."
          status="available"
          :tags="['Lab Equipment']"
        />
        <ResourceCard
          name="In-Use Resource"
          description="Currently being used by another researcher."
          status="in-use"
          next-available="In 2 hours"
          :tags="['Lab Equipment']"
        />
        <ResourceCard
          name="Maintenance Resource"
          description="Undergoing scheduled maintenance."
          status="maintenance"
          next-available="Next Monday"
          :tags="['Lab Equipment']"
        />
        <ResourceCard
          name="Offline Resource"
          description="Currently offline and unavailable."
          status="offline"
          :tags="['Lab Equipment']"
          :show-book-action="false"
        />
      </div>
    </Variant>
  </Story>
</template>
