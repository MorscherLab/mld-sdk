<script setup lang="ts">
import ExperimentTimeline from './ExperimentTimeline.vue'
import type { ProtocolStep } from '../types'

const mockSteps: ProtocolStep[] = [
  {
    id: 'step-1',
    type: 'addition',
    name: 'Seed Cells',
    description: 'Add 200 uL cell suspension per well at 5000 cells/well density.',
    duration: 15,
    status: 'completed',
    parameters: { 'Cell density': '5000 cells/well', 'Volume': '200 uL' },
    order: 0,
  },
  {
    id: 'step-2',
    type: 'incubation',
    name: 'Overnight Incubation',
    description: 'Allow cells to attach and reach 70-80% confluency.',
    duration: 960,
    status: 'completed',
    parameters: { 'Temperature': '37 C', 'CO2': '5%' },
    order: 1,
  },
  {
    id: 'step-3',
    type: 'wash',
    name: 'PBS Wash',
    description: 'Remove old media and wash with PBS.',
    duration: 5,
    status: 'in_progress',
    parameters: { 'Buffer': 'PBS', 'Volume': '200 uL', 'Repeats': '2' },
    order: 2,
  },
  {
    id: 'step-4',
    type: 'addition',
    name: 'Add Treatment',
    description: 'Add compound dilutions to designated wells.',
    duration: 30,
    status: 'pending',
    parameters: { 'Compound': 'Cisplatin', 'Concentration range': '0.1 - 100 uM' },
    order: 3,
  },
  {
    id: 'step-5',
    type: 'measurement',
    name: 'Cell Viability Assay',
    description: 'Measure cell viability using CellTiter-Glo assay.',
    duration: 45,
    status: 'pending',
    parameters: { 'Assay': 'CellTiter-Glo', 'Read mode': 'Luminescence' },
    order: 4,
  },
]

function initState() {
  return {
    modelValue: mockSteps,
    orientation: 'vertical' as const,
    showDuration: true,
    showTime: false,
    editable: false,
    collapsible: true,
    size: 'md' as const,
    colorByStatus: true,
    colorByType: false,
  }
}
</script>

<template>
  <Story title="Lab/ExperimentTimeline">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px;">
          <ExperimentTimeline
            v-model="state.modelValue"
            :orientation="state.orientation"
            :show-duration="state.showDuration"
            :show-time="state.showTime"
            :editable="state.editable"
            :collapsible="state.collapsible"
            :size="state.size"
            :color-by-status="state.colorByStatus"
            :color-by-type="state.colorByType"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSelect
          v-model="state.orientation"
          title="Orientation"
          :options="[
            { value: 'vertical', label: 'Vertical' },
            { value: 'horizontal', label: 'Horizontal' },
          ]"
        />
        <HstCheckbox v-model="state.showDuration" title="Show Duration" />
        <HstCheckbox v-model="state.showTime" title="Show Time" />
        <HstCheckbox v-model="state.editable" title="Editable" />
        <HstCheckbox v-model="state.collapsible" title="Collapsible" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
        <HstCheckbox v-model="state.colorByStatus" title="Color by Status" />
        <HstCheckbox v-model="state.colorByType" title="Color by Type" />
      </template>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 2rem; overflow-x: auto;">
        <ExperimentTimeline
          :model-value="mockSteps"
          orientation="horizontal"
        />
      </div>
    </Variant>

    <Variant title="Editable">
      <div style="padding: 2rem; max-width: 600px;">
        <ExperimentTimeline
          :model-value="mockSteps"
          editable
        />
      </div>
    </Variant>

    <Variant title="Color by Type">
      <div style="padding: 2rem; max-width: 600px;">
        <ExperimentTimeline
          :model-value="mockSteps"
          :color-by-status="false"
          color-by-type
        />
      </div>
    </Variant>

    <Variant title="Small">
      <div style="padding: 2rem; max-width: 400px;">
        <ExperimentTimeline
          :model-value="mockSteps"
          size="sm"
        />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="padding: 2rem; max-width: 600px;">
        <ExperimentTimeline :model-value="[]" editable />
      </div>
    </Variant>
  </Story>
</template>
