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
  <div class="max-w-6xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">PlateMapEditor</h1>
    <p class="text-text-secondary mb-8">
      Full-featured plate layout editor combining WellPlate and SampleLegend with multi-plate support, undo/redo, and import/export.
    </p>

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

    <!-- Workflow -->
    <div class="demo-section">
      <h3>Workflow</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="text-2xl mb-2">1</div>
          <h4 class="font-medium text-text-primary mb-1">Add Sample Types</h4>
          <p class="text-sm text-text-secondary">
            Create sample types in the sidebar with custom names. Colors are assigned automatically.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="text-2xl mb-2">2</div>
          <h4 class="font-medium text-text-primary mb-1">Select Wells</h4>
          <p class="text-sm text-text-secondary">
            Click and drag on the plate to select wells. Use Ctrl/Cmd+A to select all.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="text-2xl mb-2">3</div>
          <h4 class="font-medium text-text-primary mb-1">Assign Samples</h4>
          <p class="text-sm text-text-secondary">
            Click a sample type, then click "Assign" or press 1-9 for quick assignment.
          </p>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts -->
    <div class="demo-section">
      <h3>Keyboard Shortcuts</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-2">
          <kbd class="px-2 py-1 bg-bg-secondary rounded border border-border text-sm">1-9</kbd>
          <span class="text-sm text-text-secondary">Quick assign sample</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-2 py-1 bg-bg-secondary rounded border border-border text-sm">Del</kbd>
          <span class="text-sm text-text-secondary">Clear selected wells</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-2 py-1 bg-bg-secondary rounded border border-border text-sm">Ctrl+Z</kbd>
          <span class="text-sm text-text-secondary">Undo</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="px-2 py-1 bg-bg-secondary rounded border border-border text-sm">Ctrl+A</kbd>
          <span class="text-sm text-text-secondary">Select all wells</span>
        </div>
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
            <td><code>modelValue</code></td>
            <td><code>PlateMapEditorState</code></td>
            <td><code>undefined</code></td>
            <td>Editor state (v-model)</td>
          </tr>
          <tr>
            <td><code>format</code></td>
            <td><code>WellPlateFormat</code></td>
            <td><code>96</code></td>
            <td>Default plate format</td>
          </tr>
          <tr>
            <td><code>maxPlates</code></td>
            <td><code>number</code></td>
            <td><code>10</code></td>
            <td>Maximum number of plates</td>
          </tr>
          <tr>
            <td><code>showToolbar</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show toolbar with plate tabs</td>
          </tr>
          <tr>
            <td><code>showSidebar</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show sample legend sidebar</td>
          </tr>
          <tr>
            <td><code>allowAddPlates</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow adding new plates</td>
          </tr>
          <tr>
            <td><code>allowAddSamples</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow adding sample types</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg' | 'xl' | 'fill'</code></td>
            <td><code>'md'</code></td>
            <td>Size preset. Use 'fill' to make plate fill parent container width.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>PlateMapEditorState</code></td>
            <td>State changed</td>
          </tr>
          <tr>
            <td><code>plate-add</code></td>
            <td><code>{ id, name }</code></td>
            <td>New plate created</td>
          </tr>
          <tr>
            <td><code>plate-remove</code></td>
            <td><code>plateId</code></td>
            <td>Plate deleted</td>
          </tr>
          <tr>
            <td><code>sample-assign</code></td>
            <td><code>wellIds, sampleId</code></td>
            <td>Wells assigned to sample</td>
          </tr>
          <tr>
            <td><code>wells-clear</code></td>
            <td><code>wellIds</code></td>
            <td>Wells cleared</td>
          </tr>
          <tr>
            <td><code>export</code></td>
            <td><code>data, format</code></td>
            <td>Data exported</td>
          </tr>
          <tr>
            <td><code>import</code></td>
            <td><code>success</code></td>
            <td>Data imported</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Composable -->
    <div class="demo-section">
      <h3>useWellPlateEditor Composable</h3>
      <p class="text-sm text-text-secondary mb-4">
        For programmatic control, use the <code>useWellPlateEditor</code> composable directly.
      </p>
      <pre class="code-block">import { useWellPlateEditor } from '@morscherlab/mld-sdk'

const editor = useWellPlateEditor({
  plates: [{ id: 'p1', name: 'Plate 1', format: 96, wells: {} }],
  samples: [{ id: 's1', name: 'Control', color: '#3B82F6' }],
})

// Actions
editor.addPlate('Plate 2')
editor.addSample('Treatment', '#10B981')
editor.assignSample(['A1', 'A2', 'A3'], 's1')
editor.undo()
editor.redo()

// Export
const json = editor.exportData('json')
const csv = editor.exportData('csv')</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;PlateMapEditor
  v-model="editorState"
  :format="96"
  :max-plates="5"
  @sample-assign="handleAssign"
  @export="handleExport"
/&gt;</pre>
    </div>
  </div>
</template>
