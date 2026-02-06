<script setup lang="ts">
import { ref } from 'vue'
import { MoleculeInput, BaseToggle } from '@morscherlab/mld-sdk'

interface MoleculeData {
  smiles: string
  molfile: string
}

const moleculeData = ref<MoleculeData | undefined>(undefined)
const disabled = ref(false)
const readonly = ref(false)
const showSmiles = ref(true)
const height = ref(300)

// Pre-defined molecule for demo
const aspirinSmiles = 'CC(=O)OC1=CC=CC=C1C(=O)O'
const aspirinMolfile = `
  Mrv2207 02011023102D

  0  0  0     0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 13 13 0 0 0
M  V30 BEGIN ATOM
M  V30 1 C -2.6667 1.5 0 0
M  V30 2 C -1.333 0.77 0 0
M  V30 3 O -1.333 -0.77 0 0
M  V30 4 O 0 1.54 0 0
M  V30 5 C 1.3337 0.77 0 0
M  V30 6 C 1.3337 -0.77 0 0
M  V30 7 C 2.6674 -1.54 0 0
M  V30 8 C 4.0011 -0.77 0 0
M  V30 9 C 4.0011 0.77 0 0
M  V30 10 C 2.6674 1.54 0 0
M  V30 11 C 5.3348 1.54 0 0
M  V30 12 O 6.6685 0.77 0 0
M  V30 13 O 5.3348 3.08 0 0
M  V30 END ATOM
M  V30 BEGIN BOND
M  V30 1 1 1 2
M  V30 2 2 2 3
M  V30 3 1 2 4
M  V30 4 1 4 5
M  V30 5 2 5 6
M  V30 6 1 6 7
M  V30 7 2 7 8
M  V30 8 1 8 9
M  V30 9 2 9 10
M  V30 10 1 10 5
M  V30 11 1 9 11
M  V30 12 1 11 12
M  V30 13 2 11 13
M  V30 END BOND
M  V30 END CTAB
M  END
`

function loadAspirin() {
  moleculeData.value = {
    smiles: aspirinSmiles,
    molfile: aspirinMolfile,
  }
}

function handleError(message: string) {
  console.error('Molecule Input Error:', message)
}
</script>

<template>
  <div class="max-w-5xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">MoleculeInput</h1>
    <p class="text-text-secondary mb-8">
      Chemical structure sketcher using JSME (JavaScript Molecular Editor) for drawing and editing molecular structures.
    </p>

    <!-- Interactive Demo -->
    <div class="demo-section">
      <h3>Interactive Demo</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
        <div class="flex items-center gap-2">
          <BaseToggle v-model="disabled" size="sm" />
          <span class="text-sm text-text-secondary">Disabled</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="readonly" size="sm" />
          <span class="text-sm text-text-secondary">Readonly</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="showSmiles" size="sm" />
          <span class="text-sm text-text-secondary">Show SMILES</span>
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">Height (px)</label>
          <input
            v-model.number="height"
            type="number"
            min="200"
            max="600"
            step="50"
            class="w-full px-2 py-1 border border-border rounded text-sm bg-bg-primary"
          />
        </div>
      </div>

      <div class="mb-4">
        <button
          type="button"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
          @click="loadAspirin"
        >
          Load Aspirin Structure
        </button>
        <button
          type="button"
          class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          @click="moleculeData = undefined"
        >
          Clear
        </button>
      </div>

      <MoleculeInput
        v-model="moleculeData"
        :disabled="disabled"
        :readonly="readonly"
        :show-smiles="showSmiles"
        :height="height"
        placeholder="Draw a chemical structure"
        @error="handleError"
      />

      <div v-if="moleculeData" class="mt-4 p-3 bg-bg-secondary rounded-lg">
        <p class="text-sm text-text-secondary">
          <strong>SMILES:</strong> <code class="text-xs">{{ moleculeData.smiles }}</code>
        </p>
      </div>
    </div>

    <!-- Readonly Mode -->
    <div class="demo-section">
      <h3>Readonly Mode</h3>
      <p class="text-sm text-text-secondary mb-4">
        Use readonly mode to display a structure without the editor interface.
      </p>
      <MoleculeInput
        :model-value="{ smiles: aspirinSmiles, molfile: aspirinMolfile }"
        readonly
        :height="200"
      />
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
            <td><code>MoleculeData</code></td>
            <td><code>undefined</code></td>
            <td>Molecule data containing SMILES and molfile (v-model)</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable interaction with the editor</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Display in readonly mode (no editor UI)</td>
          </tr>
          <tr>
            <td><code>height</code></td>
            <td><code>number</code></td>
            <td><code>300</code></td>
            <td>Height of the editor in pixels</td>
          </tr>
          <tr>
            <td><code>showSmiles</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show SMILES string below the editor</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>'Draw a chemical structure'</code></td>
            <td>Placeholder text when no structure</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show error state styling</td>
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
            <td><code>MoleculeData | undefined</code></td>
            <td>Emitted when molecule structure changes</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>string</code></td>
            <td>Emitted when editor encounters an error</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MoleculeData Type -->
    <div class="demo-section">
      <h3>MoleculeData Type</h3>
      <pre class="code-block">interface MoleculeData {
  smiles: string   // Simplified molecular-input-line-entry system
  molfile: string  // MDL molfile format for structure
}</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;MoleculeInput
  v-model="moleculeData"
  :height="300"
  show-smiles
  @error="handleError"
/&gt;</pre>
    </div>
  </div>
</template>
