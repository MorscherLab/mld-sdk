<script setup lang="ts">
import { ref } from 'vue'
import { PlateMapEditor, BaseSelect, BaseToggle, type WellPlateFormat, type PlateMapEditorState } from '@morscherlab/mld-sdk'

const editorState = ref<PlateMapEditorState | undefined>(undefined)
const format = ref<WellPlateFormat>(96)
const showToolbar = ref(true)
const showSidebar = ref(true)
const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'fill'>('md')

const formatOptions = [
  { value: 6, label: '6-well' },
  { value: 12, label: '12-well' },
  { value: 24, label: '24-well' },
  { value: 48, label: '48-well' },
  { value: 54, label: '54-well' },
  { value: 96, label: '96-well' },
  { value: 384, label: '384-well' },
]

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: 'fill', label: 'Fill Container' },
]

function handlePlateAdd(plate: { id: string; name: string }) {
  console.log('Plate added:', plate)
}

function handlePlateRemove(plateId: string) {
  console.log('Plate removed:', plateId)
}

function handleSampleAssign(wellIds: string[], sampleId: string | undefined) {
  console.log('Sample assigned:', { wellIds, sampleId })
}

function handleExport(data: string, exportFormat: 'json' | 'csv') {
  console.log('Exported:', exportFormat, data.slice(0, 100) + '...')
}

function handleUndo() {
  console.log('Undo')
}

function handleRedo() {
  console.log('Redo')
}
</script>

<template>
  <!-- Interactive Demo -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div>
        <label class="block text-sm text-text-secondary mb-1">Format</label>
        <BaseSelect v-model="format" :options="formatOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Size</label>
        <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showToolbar" size="sm" />
        <span class="text-sm text-text-secondary">Toolbar</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showSidebar" size="sm" />
        <span class="text-sm text-text-secondary">Sidebar</span>
      </div>
    </div>

    <PlateMapEditor
      v-model="editorState"
      :format="format"
      :show-toolbar="showToolbar"
      :show-sidebar="showSidebar"
      :size="size"
      @plate-add="handlePlateAdd"
      @plate-remove="handlePlateRemove"
      @sample-assign="handleSampleAssign"
      @export="handleExport"
      @undo="handleUndo"
      @redo="handleRedo"
    />
  </div>
</template>
