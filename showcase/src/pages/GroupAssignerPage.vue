<script setup lang="ts">
import { ref, computed } from 'vue'
import { GroupAssigner, type GroupItem } from '@morscherlab/mld-sdk'

// Basic example groups
const groups = ref<GroupItem[]>([
  { name: 'Control', color: '#6B7280', count: 3 },
  { name: 'Treatment A', color: '#3B82F6', count: 4 },
  { name: 'Treatment B', color: '#10B981', count: 4 },
  { name: 'Treatment C', color: '#F59E0B', count: 3 },
])
const group1 = ref<string[]>(['Control'])
const group2 = ref<string[]>(['Treatment A'])

// Custom labels example
const customGroups = ref<GroupItem[]>([
  { name: 'Wild Type', color: '#8B5CF6', count: 6 },
  { name: 'Mutant A', color: '#EC4899', count: 5 },
  { name: 'Mutant B', color: '#06B6D4', count: 5 },
  { name: 'Knockout', color: '#EF4444', count: 4 },
])
const customGroup1 = ref<string[]>([])
const customGroup2 = ref<string[]>([])

// Pre-assigned example
const preGroups = ref<GroupItem[]>([
  { name: 'Vehicle', color: '#6B7280', count: 3 },
  { name: 'Low Dose', color: '#3B82F6', count: 3 },
  { name: 'Mid Dose', color: '#10B981', count: 3 },
  { name: 'High Dose', color: '#F59E0B', count: 3 },
])
const preGroup1 = ref<string[]>(['Vehicle'])
const preGroup2 = ref<string[]>(['Low Dose', 'Mid Dose', 'High Dose'])

const isValid = computed(() => group1.value.length >= 1 && group2.value.length >= 1)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">GroupAssigner</h1>
    <p class="text-text-secondary mb-8">
      A drag-and-drop component for assigning groups to two categories. Ideal for
      statistical comparisons like volcano plots (Control vs Treatment).
    </p>

    <!-- Basic Example -->
    <div class="demo-section">
      <h3>Basic Example</h3>
      <p class="text-sm text-text-secondary mb-4">
        Drag groups between zones to assign them. Groups in Control will be compared against Treatment.
      </p>
      <div class="max-w-xl">
        <GroupAssigner
          :groups="groups"
          v-model:group1="group1"
          v-model:group2="group2"
          :min-per-group="1"
        />
        <div class="mt-4 p-3 bg-bg-tertiary rounded-mld text-sm">
          <p class="text-text-secondary">
            <strong>Control:</strong> {{ group1.join(', ') || 'None' }}
          </p>
          <p class="text-text-secondary mt-1">
            <strong>Treatment:</strong> {{ group2.join(', ') || 'None' }}
          </p>
          <p class="mt-2" :class="isValid ? 'text-mld-success' : 'text-mld-warning'">
            {{ isValid ? 'Ready for comparison' : 'Assign at least one group to each zone' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Custom Labels and Colors -->
    <div class="demo-section">
      <h3>Custom Labels and Colors</h3>
      <p class="text-sm text-text-secondary mb-4">
        Customize zone labels and accent colors for different comparison types.
      </p>
      <div class="max-w-xl">
        <GroupAssigner
          :groups="customGroups"
          v-model:group1="customGroup1"
          v-model:group2="customGroup2"
          label1="Baseline"
          label2="Experimental"
          color1="#8B5CF6"
          color2="#EC4899"
          :min-per-group="1"
        />
      </div>
    </div>

    <!-- Pre-assigned Groups -->
    <div class="demo-section">
      <h3>Pre-assigned Groups</h3>
      <p class="text-sm text-text-secondary mb-4">
        Groups can be pre-assigned. Users can still drag to reassign.
      </p>
      <div class="max-w-xl">
        <GroupAssigner
          :groups="preGroups"
          v-model:group1="preGroup1"
          v-model:group2="preGroup2"
          label1="Vehicle"
          label2="Drug Treatment"
          color1="#6B7280"
          color2="#10B981"
        />
      </div>
    </div>

    <!-- Features -->
    <div class="demo-section">
      <h3>Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Drag and Drop</h4>
          <p class="text-sm text-text-secondary">
            Drag groups from the available list to either zone. Zones highlight on hover.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Move Between Zones</h4>
          <p class="text-sm text-text-secondary">
            Groups can be dragged from one zone to another to reassign them.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Quick Remove</h4>
          <p class="text-sm text-text-secondary">
            Click the X button on any assigned group to return it to the available list.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Validation</h4>
          <p class="text-sm text-text-secondary">
            Shows warning message when minimum group requirements aren't met.
          </p>
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
            <td><code>groups</code></td>
            <td><code>GroupItem[]</code></td>
            <td>Required</td>
            <td>All available groups</td>
          </tr>
          <tr>
            <td><code>group1</code></td>
            <td><code>string[]</code></td>
            <td>Required</td>
            <td>Groups in zone 1 (v-model:group1)</td>
          </tr>
          <tr>
            <td><code>group2</code></td>
            <td><code>string[]</code></td>
            <td>Required</td>
            <td>Groups in zone 2 (v-model:group2)</td>
          </tr>
          <tr>
            <td><code>label1</code></td>
            <td><code>string</code></td>
            <td><code>'Control'</code></td>
            <td>Zone 1 label</td>
          </tr>
          <tr>
            <td><code>label2</code></td>
            <td><code>string</code></td>
            <td><code>'Treatment'</code></td>
            <td>Zone 2 label</td>
          </tr>
          <tr>
            <td><code>color1</code></td>
            <td><code>string</code></td>
            <td><code>'#3B82F6'</code></td>
            <td>Zone 1 accent color</td>
          </tr>
          <tr>
            <td><code>color2</code></td>
            <td><code>string</code></td>
            <td><code>'#F43F5E'</code></td>
            <td>Zone 2 accent color</td>
          </tr>
          <tr>
            <td><code>minPerGroup</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Minimum groups required per zone</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
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
            <td><code>update:group1</code></td>
            <td><code>string[]</code></td>
            <td>Emitted when zone 1 groups change</td>
          </tr>
          <tr>
            <td><code>update:group2</code></td>
            <td><code>string[]</code></td>
            <td>Emitted when zone 2 groups change</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Types -->
    <div class="demo-section">
      <h3>Types</h3>
      <pre class="code-block">interface GroupItem {
  name: string   // Group name (used as identifier)
  color: string  // Hex color for the group pill
  count: number  // Sample count (displayed in badge)
}</pre>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { GroupAssigner, type GroupItem } from '@morscherlab/mld-sdk'

const groups = ref&lt;GroupItem[]&gt;([
  { name: 'Control', color: '#6B7280', count: 3 },
  { name: 'Treatment A', color: '#3B82F6', count: 4 },
  { name: 'Treatment B', color: '#10B981', count: 4 },
])

const control = ref&lt;string[]&gt;(['Control'])
const treatment = ref&lt;string[]&gt;([])
&lt;/script&gt;

&lt;template&gt;
  &lt;GroupAssigner
    :groups="groups"
    v-model:group1="control"
    v-model:group2="treatment"
    label1="Control"
    label2="Treatment"
    :min-per-group="1"
  /&gt;
&lt;/template&gt;</pre>
    </div>

    <!-- Use Case -->
    <div class="demo-section">
      <h3>Use Case: Volcano Plot</h3>
      <p class="text-sm text-text-secondary">
        GroupAssigner is designed for statistical comparison workflows. In a volcano plot,
        you need to define which samples are "Control" (baseline) and which are "Treatment"
        (experimental). This component makes that assignment intuitive through drag-and-drop,
        and validates that both groups have sufficient samples for meaningful comparison.
      </p>
    </div>
  </div>
</template>
