<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import GroupingModal from './GroupingModal.vue'
import type { SampleGroup } from '../types'

interface Props {
  samples: string[]
  modelValue: string[]
  groups?: SampleGroup[]
  enableGrouping?: boolean
  enableAutoGroup?: boolean
  enableMetadataGroup?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  groups: () => [],
  enableGrouping: true,
  enableAutoGroup: true,
  enableMetadataGroup: true,
})

const emit = defineEmits<{
  'update:modelValue': [samples: string[]]
  'update:groups': [groups: SampleGroup[]]
  autoGroup: [level: number]
  metadataGroup: [mapping: Record<string, string[]>]
}>()

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
]

// UI State
const showLevelPopover = ref(false)
const popoverRef = ref<HTMLDivElement | null>(null)
const showMetadataModal = ref(false)
const newGroupName = ref('')
const editingGroupColor = ref<string | null>(null)
const colorPickerInput = ref<HTMLInputElement | null>(null)
const expandedGroups = ref<Record<string, boolean>>({})
const searchQuery = ref('')

// Drag and Drop State
const draggingSample = ref<string | null>(null)
const dragSourceGroup = ref<string | null>(null)
const dragOverGroup = ref<string | null>(null)

// Computed: groups from props
const internalGroups = computed({
  get: () => props.groups,
  set: (value) => emit('update:groups', value),
})

// Computed: hierarchical structure (Major Group > Sub Groups > Samples)
interface MajorGroup {
  name: string
  color: string
  subGroups: SampleGroup[]
  allSamples: string[]
}

const hierarchicalGroups = computed<MajorGroup[]>(() => {
  const groups = internalGroups.value
  if (groups.length === 0) return []

  // Detect separator: use '/' if any group name contains it, otherwise '_'
  const separator = groups.some(g => g.name.includes('/')) ? '/' : '_'
  const majorGroupMap: Record<string, SampleGroup[]> = {}

  for (const group of groups) {
    const parts = group.name.split(separator)
    // Use first part as major group, or full name if no separator
    const majorPrefix = parts.length > 1 ? parts[0] : group.name

    if (!majorGroupMap[majorPrefix]) {
      majorGroupMap[majorPrefix] = []
    }
    majorGroupMap[majorPrefix].push(group)
  }

  const result: MajorGroup[] = []

  for (const [majorName, subGroups] of Object.entries(majorGroupMap).sort(([a], [b]) => a.localeCompare(b))) {
    const allSamples = subGroups.flatMap(g => g.samples)
    const color = subGroups[0]?.color || '#3B82F6'

    result.push({
      name: majorName,
      color,
      subGroups: subGroups.sort((a, b) => a.name.localeCompare(b.name)),
      allSamples
    })
  }

  return result
})

// Check if hierarchy is meaningful (major groups have multiple sub-groups)
// If each major group only has 1 sub-group with same name, show flat view instead
const showHierarchy = computed(() => {
  const groups = hierarchicalGroups.value
  if (groups.length === 0) return false

  // Show hierarchy if any major group has multiple sub-groups
  // OR if major group name differs from its sub-group name
  return groups.some(major =>
    major.subGroups.length > 1 ||
    (major.subGroups.length === 1 && major.name !== major.subGroups[0].name)
  )
})

const groupingEnabled = computed(() => internalGroups.value.length > 0)

const ungroupedSamples = computed(() => {
  const groupedSamples = new Set(
    internalGroups.value.flatMap(g => g.samples)
  )
  return props.samples.filter(s => !groupedSamples.has(s))
})

const filteredSamples = computed(() => {
  if (!searchQuery.value.trim()) return props.samples
  const query = searchQuery.value.toLowerCase()
  return props.samples.filter(s => s.toLowerCase().includes(query))
})

// Compute available grouping levels with preview
const groupingLevels = computed(() => {
  if (props.samples.length === 0) return []

  const maxLevel = detectGroupingLevels()
  const levels: Array<{ level: number; groupCount: number; example: string; description: string }> = []

  for (let level = 1; level <= maxLevel; level++) {
    const prefixGroups: Record<string, string[]> = {}

    for (const sample of props.samples) {
      const parts = sample.split(/[_\-.]/)
      const prefix = parts.slice(0, level).join('_')
      if (prefix) {
        if (!prefixGroups[prefix]) {
          prefixGroups[prefix] = []
        }
        prefixGroups[prefix].push(sample)
      }
    }

    const groupNames = Object.keys(prefixGroups).sort()
    const example = groupNames[0] || ''
    const descriptions = ['main groups', 'sub-groups']
    const description = descriptions[level - 1] || `level ${level} groups`

    levels.push({
      level,
      groupCount: groupNames.length,
      example,
      description
    })
  }

  return levels
})

function detectGroupingLevels(): number {
  if (props.samples.length === 0) return 1
  const maxParts = Math.max(...props.samples.map(s => s.split(/[_\-.]/).length))
  return Math.min(maxParts, 3)
}

// Selection state
const isAllSelected = computed(() =>
  props.samples.length > 0 && props.modelValue.length === props.samples.length
)

// Toggle functions
function toggleSelectAll() {
  if (isAllSelected.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', [...props.samples])
  }
}

function toggleSample(sample: string) {
  const newSelection = props.modelValue.includes(sample)
    ? props.modelValue.filter(s => s !== sample)
    : [...props.modelValue, sample]
  emit('update:modelValue', newSelection)
}

function toggleSamplesSelection(samples: string[]) {
  const allSelected = samples.every(s => props.modelValue.includes(s))
  const newSelection = allSelected
    ? props.modelValue.filter(s => !samples.includes(s))
    : [...props.modelValue, ...samples.filter(s => !props.modelValue.includes(s))]

  emit('update:modelValue', newSelection)
}

function toggleGroupSamples(groupName: string) {
  const group = internalGroups.value.find(g => g.name === groupName)
  if (!group) return
  toggleSamplesSelection(group.samples)
}

function toggleMajorGroupSamples(majorGroup: MajorGroup) {
  toggleSamplesSelection(majorGroup.allSamples)
}

// Selection state checks
function isFullySelected(samples: string[]): boolean {
  return samples.length > 0 && samples.every(s => props.modelValue.includes(s))
}

function isPartiallySelected(samples: string[]): boolean {
  if (samples.length === 0) return false
  const selectedCount = samples.filter(s => props.modelValue.includes(s)).length
  return selectedCount > 0 && selectedCount < samples.length
}

function isGroupFullySelected(groupName: string): boolean {
  const group = internalGroups.value.find(g => g.name === groupName)
  return group ? isFullySelected(group.samples) : false
}

function isGroupPartiallySelected(groupName: string): boolean {
  const group = internalGroups.value.find(g => g.name === groupName)
  return group ? isPartiallySelected(group.samples) : false
}

function isMajorGroupFullySelected(majorGroup: MajorGroup): boolean {
  return isFullySelected(majorGroup.allSamples)
}

function isMajorGroupPartiallySelected(majorGroup: MajorGroup): boolean {
  return isPartiallySelected(majorGroup.allSamples)
}

// Expand/collapse
function toggleGroupExpanded(groupName: string) {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

function isGroupExpanded(groupName: string): boolean {
  return !!expandedGroups.value[groupName]
}

function expandAllGroups() {
  const expanded: Record<string, boolean> = {}
  for (const major of hierarchicalGroups.value) {
    expanded[`major:${major.name}`] = true
    for (const sub of major.subGroups) {
      expanded[sub.name] = true
    }
  }
  expanded['__ungrouped__'] = true
  expandedGroups.value = expanded
}

function collapseAllGroups() {
  expandedGroups.value = {}
}

// Auto-group
function toggleLevelPopover() {
  showLevelPopover.value = !showLevelPopover.value
}

function selectLevel(level: number) {
  emit('autoGroup', level)
  showLevelPopover.value = false
}

// Group management
function clearGroups() {
  internalGroups.value = []
}

function deleteMajorGroup(majorGroup: MajorGroup) {
  internalGroups.value = internalGroups.value.filter(
    g => !majorGroup.subGroups.some(sg => sg.name === g.name)
  )
}

function deleteGroup(groupName: string) {
  internalGroups.value = internalGroups.value.filter(g => g.name !== groupName)
}

function removeSampleFromGroup(sample: string, groupName: string) {
  internalGroups.value = internalGroups.value.map(g =>
    g.name === groupName
      ? { ...g, samples: g.samples.filter((s: string) => s !== sample) }
      : g
  )
}

// Drag and Drop handlers
function handleDragStart(sample: string, sourceGroup: string | null, event: DragEvent) {
  draggingSample.value = sample
  dragSourceGroup.value = sourceGroup
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', sample)
  }
}

function resetDragState() {
  draggingSample.value = null
  dragSourceGroup.value = null
  dragOverGroup.value = null
}

function handleDragEnd() {
  resetDragState()
}

function handleDragOver(groupName: string, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverGroup.value = groupName
}

function handleDragLeave() {
  dragOverGroup.value = null
}

function handleDrop(targetGroupName: string, event: DragEvent) {
  event.preventDefault()

  const sample = draggingSample.value
  const sourceGroup = dragSourceGroup.value
  if (!sample) return

  if (sourceGroup === targetGroupName) {
    resetDragState()
    return
  }

  internalGroups.value = internalGroups.value.map(g => {
    if (sourceGroup && g.name === sourceGroup) {
      return { ...g, samples: g.samples.filter((s: string) => s !== sample) }
    }
    if (g.name === targetGroupName && !g.samples.includes(sample)) {
      return { ...g, samples: [...g.samples, sample] }
    }
    return g
  })

  resetDragState()
}

// Color picker
function openColorPicker(groupName: string, event: Event) {
  event.stopPropagation()
  editingGroupColor.value = groupName
  colorPickerInput.value?.click()
}

function handleColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (editingGroupColor.value) {
    internalGroups.value = internalGroups.value.map(g =>
      g.name === editingGroupColor.value ? { ...g, color: target.value } : g
    )
  }
  editingGroupColor.value = null
}

function getGroupColor(groupName: string): string {
  const group = internalGroups.value.find(g => g.name === groupName)
  return group?.color || '#3B82F6'
}

// New group
function addNewGroup() {
  if (!newGroupName.value.trim()) return

  const usedColors = new Set(internalGroups.value.map(g => g.color))
  const availableColor = DEFAULT_COLORS.find(c => !usedColors.has(c)) || DEFAULT_COLORS[0]

  const newGroup: SampleGroup = {
    name: newGroupName.value.trim(),
    color: availableColor,
    samples: [],
  }

  internalGroups.value = [...internalGroups.value, newGroup]
  newGroupName.value = ''
}

// Metadata modal
function handleMetadataApply(mapping: Record<string, string[]>) {
  emit('metadataGroup', mapping)
  showMetadataModal.value = false
}

// Click outside handler
function handleClickOutside(event: MouseEvent) {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    showLevelPopover.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="mld-sample-selector">
    <!-- Select All Row -->
    <label class="mld-sample-selector__select-all">
      <input
        type="checkbox"
        :checked="isAllSelected"
        @change="toggleSelectAll"
        class="mld-sample-selector__checkbox"
      />
      <span class="mld-sample-selector__select-all-label">Select All</span>
      <span class="mld-sample-selector__select-all-count">{{ samples.length }} samples</span>
    </label>

    <!-- Action Buttons Row -->
    <div v-if="enableGrouping" class="mld-sample-selector__actions" ref="popoverRef">
      <div class="mld-sample-selector__actions-row">
        <!-- Auto Group Button -->
        <BaseButton
          v-if="enableAutoGroup"
          :variant="(showLevelPopover || groupingEnabled) ? 'primary' : 'secondary'"
          size="sm"
          :disabled="samples.length === 0"
          class="mld-sample-selector__action-btn"
          @click.stop="toggleLevelPopover"
        >
          <svg class="mld-sample-selector__action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Auto</span>
        </BaseButton>

        <!-- Metadata Button -->
        <BaseButton
          v-if="enableMetadataGroup"
          variant="secondary"
          size="sm"
          :disabled="samples.length === 0"
          class="mld-sample-selector__action-btn"
          @click="showMetadataModal = true"
        >
          <svg class="mld-sample-selector__action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Metadata</span>
        </BaseButton>

        <!-- Reset Button -->
        <BaseButton
          variant="ghost"
          size="sm"
          :disabled="internalGroups.length === 0"
          class="mld-sample-selector__action-btn mld-sample-selector__action-btn--reset"
          @click="clearGroups"
          title="Clear all groups"
        >
          <svg class="mld-sample-selector__action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </BaseButton>
      </div>

      <!-- Level Selection Popover -->
      <Transition name="mld-popover">
        <div v-if="showLevelPopover" class="mld-sample-selector__popover">
          <div class="mld-sample-selector__popover-header">Auto-Group by Level</div>
          <div class="mld-sample-selector__popover-body">
            <button
              v-for="levelInfo in groupingLevels"
              :key="levelInfo.level"
              type="button"
              class="mld-sample-selector__level-btn"
              @click="selectLevel(levelInfo.level)"
            >
              <div class="mld-sample-selector__level-info">
                <div class="mld-sample-selector__level-title">
                  <span>Level {{ levelInfo.level }}</span>
                  <span class="mld-sample-selector__level-badge">{{ levelInfo.groupCount }} groups</span>
                </div>
                <div class="mld-sample-selector__level-desc">
                  {{ levelInfo.description }}
                  <span v-if="levelInfo.example" class="mld-sample-selector__level-example">
                    e.g. <code>{{ levelInfo.example }}</code>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Grouped View -->
    <div v-if="groupingEnabled" class="mld-sample-selector__grouped">
      <!-- Groups Header -->
      <div class="mld-sample-selector__groups-header">
        <span class="mld-sample-selector__groups-title">Groups ({{ internalGroups.length }})</span>
        <div class="mld-sample-selector__groups-controls">
          <button type="button" class="mld-sample-selector__expand-btn" @click="expandAllGroups" title="Expand all">
            <svg class="mld-sample-selector__expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button type="button" class="mld-sample-selector__expand-btn" @click="collapseAllGroups" title="Collapse all">
            <svg class="mld-sample-selector__expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Hierarchical Tree -->
      <div class="mld-sample-selector__tree">
        <!-- Major Groups (when hierarchy is meaningful) -->
        <template v-if="showHierarchy">
          <div
            v-for="majorGroup in hierarchicalGroups"
            :key="majorGroup.name"
            class="mld-sample-selector__major-group"
          >
            <!-- Major Group Header -->
            <div
              class="mld-sample-selector__major-header"
              @click="toggleGroupExpanded(`major:${majorGroup.name}`)"
            >
              <svg
                :class="[
                  'mld-sample-selector__chevron',
                  isGroupExpanded(`major:${majorGroup.name}`) ? 'mld-sample-selector__chevron--open' : '',
                ]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>

              <input
                type="checkbox"
                :checked="isMajorGroupFullySelected(majorGroup)"
                :indeterminate="isMajorGroupPartiallySelected(majorGroup)"
                class="mld-sample-selector__checkbox"
                :style="{ accentColor: majorGroup.color }"
                @click.stop
                @change="toggleMajorGroupSamples(majorGroup)"
              />

              <div
                class="mld-sample-selector__color-dot mld-sample-selector__color-dot--large"
                :style="{ backgroundColor: majorGroup.color }"
              />

              <span class="mld-sample-selector__major-name">{{ majorGroup.name }}</span>

              <span
                class="mld-sample-selector__count-badge"
                :style="{ backgroundColor: majorGroup.color + '20', color: majorGroup.color }"
              >
                {{ majorGroup.allSamples.length }}
              </span>

              <button
                type="button"
                class="mld-sample-selector__delete-btn mld-sample-selector__delete-btn--hidden"
                @click.stop="deleteMajorGroup(majorGroup)"
                title="Remove major group"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Sub Groups (collapsible) -->
            <Transition name="mld-collapse">
              <div
                v-if="isGroupExpanded(`major:${majorGroup.name}`)"
                class="mld-sample-selector__sub-groups"
                :style="{ borderColor: majorGroup.color + '30' }"
              >
              <div
                v-for="subGroup in majorGroup.subGroups"
                :key="subGroup.name"
                :class="[
                  'mld-sample-selector__sub-group',
                  dragOverGroup === subGroup.name ? 'mld-sample-selector__sub-group--drag-over' : '',
                ]"
                @dragover="handleDragOver(subGroup.name, $event)"
                @dragleave="handleDragLeave"
                @drop="handleDrop(subGroup.name, $event)"
              >
                <!-- Sub Group Header -->
                <div
                  class="mld-sample-selector__sub-header"
                  @click="toggleGroupExpanded(subGroup.name)"
                >
                  <svg
                    :class="[
                      'mld-sample-selector__chevron mld-sample-selector__chevron--small',
                      isGroupExpanded(subGroup.name) ? 'mld-sample-selector__chevron--open' : '',
                    ]"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>

                  <input
                    type="checkbox"
                    :checked="isGroupFullySelected(subGroup.name)"
                    :indeterminate="isGroupPartiallySelected(subGroup.name)"
                    class="mld-sample-selector__checkbox mld-sample-selector__checkbox--small"
                    :style="{ accentColor: subGroup.color }"
                    @click.stop
                    @change="toggleGroupSamples(subGroup.name)"
                  />

                  <button
                    type="button"
                    class="mld-sample-selector__color-dot mld-sample-selector__color-dot--clickable"
                    :style="{ backgroundColor: subGroup.color }"
                    @click.stop="openColorPicker(subGroup.name, $event)"
                    title="Click to change color"
                  />

                  <span class="mld-sample-selector__sub-name">{{ subGroup.name }}</span>

                  <span
                    class="mld-sample-selector__count-badge mld-sample-selector__count-badge--small"
                    :style="{ backgroundColor: subGroup.color + '20', color: subGroup.color }"
                  >
                    {{ subGroup.samples.length }}
                  </span>

                  <button
                    type="button"
                    class="mld-sample-selector__delete-btn mld-sample-selector__delete-btn--hidden"
                    @click.stop="deleteGroup(subGroup.name)"
                    title="Remove sub group"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Samples (collapsible) -->
                <Transition name="mld-collapse">
                  <div
                    v-if="isGroupExpanded(subGroup.name)"
                    class="mld-sample-selector__samples"
                    :style="{ borderColor: subGroup.color + '40' }"
                  >
                    <div
                      v-for="sample in subGroup.samples"
                      :key="sample"
                      :class="[
                        'mld-sample-selector__sample',
                        draggingSample === sample ? 'mld-sample-selector__sample--dragging' : '',
                      ]"
                      draggable="true"
                      @dragstart="handleDragStart(sample, subGroup.name, $event)"
                      @dragend="handleDragEnd"
                    >
                      <svg class="mld-sample-selector__drag-handle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                      </svg>
                      <input
                        type="checkbox"
                        :checked="modelValue.includes(sample)"
                        class="mld-sample-selector__checkbox mld-sample-selector__checkbox--tiny"
                        :style="{ accentColor: subGroup.color }"
                        @change="toggleSample(sample)"
                      />
                      <span class="mld-sample-selector__sample-name">{{ sample }}</span>
                      <button
                        type="button"
                        class="mld-sample-selector__remove-btn"
                        @click="removeSampleFromGroup(sample, subGroup.name)"
                        title="Remove from group"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
        </template>

        <!-- Flat Groups (when no meaningful hierarchy - e.g., level 1) -->
        <template v-else>
          <div
            v-for="group in internalGroups"
            :key="group.name"
            :class="[
              'mld-sample-selector__sub-group',
              dragOverGroup === group.name ? 'mld-sample-selector__sub-group--drag-over' : '',
            ]"
            @dragover="handleDragOver(group.name, $event)"
            @dragleave="handleDragLeave"
            @drop="handleDrop(group.name, $event)"
          >
            <!-- Group Header -->
            <div
              class="mld-sample-selector__major-header"
              @click="toggleGroupExpanded(group.name)"
            >
              <svg
                :class="[
                  'mld-sample-selector__chevron',
                  isGroupExpanded(group.name) ? 'mld-sample-selector__chevron--open' : '',
                ]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>

              <input
                type="checkbox"
                :checked="isGroupFullySelected(group.name)"
                :indeterminate="isGroupPartiallySelected(group.name)"
                class="mld-sample-selector__checkbox"
                :style="{ accentColor: group.color }"
                @click.stop
                @change="toggleGroupSamples(group.name)"
              />

              <button
                type="button"
                class="mld-sample-selector__color-dot mld-sample-selector__color-dot--large mld-sample-selector__color-dot--clickable"
                :style="{ backgroundColor: group.color }"
                @click.stop="openColorPicker(group.name, $event)"
                title="Click to change color"
              />

              <span class="mld-sample-selector__major-name">{{ group.name }}</span>

              <span
                class="mld-sample-selector__count-badge"
                :style="{ backgroundColor: group.color + '20', color: group.color }"
              >
                {{ group.samples.length }}
              </span>

              <button
                type="button"
                class="mld-sample-selector__delete-btn mld-sample-selector__delete-btn--hidden"
                @click.stop="deleteGroup(group.name)"
                title="Remove group"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Samples (collapsible) -->
            <Transition name="mld-collapse">
              <div
                v-if="isGroupExpanded(group.name)"
                class="mld-sample-selector__samples"
                :style="{ borderColor: group.color + '40' }"
              >
                <div
                  v-for="sample in group.samples"
                  :key="sample"
                  :class="[
                    'mld-sample-selector__sample',
                    draggingSample === sample ? 'mld-sample-selector__sample--dragging' : '',
                  ]"
                  draggable="true"
                  @dragstart="handleDragStart(sample, group.name, $event)"
                  @dragend="handleDragEnd"
                >
                  <svg class="mld-sample-selector__drag-handle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                  <input
                    type="checkbox"
                    :checked="modelValue.includes(sample)"
                    class="mld-sample-selector__checkbox mld-sample-selector__checkbox--tiny"
                    :style="{ accentColor: group.color }"
                    @change="toggleSample(sample)"
                  />
                  <span class="mld-sample-selector__sample-name">{{ sample }}</span>
                  <button
                    type="button"
                    class="mld-sample-selector__remove-btn"
                    @click="removeSampleFromGroup(sample, group.name)"
                    title="Remove from group"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Empty state -->
        <div v-if="internalGroups.length === 0" class="mld-sample-selector__empty">
          Click the lightning bolt to auto-group samples
        </div>
      </div>

      <!-- Ungrouped Samples Section -->
      <div v-if="ungroupedSamples.length > 0" class="mld-sample-selector__ungrouped">
        <div
          class="mld-sample-selector__ungrouped-header"
          @click="toggleGroupExpanded('__ungrouped__')"
        >
          <svg
            :class="[
              'mld-sample-selector__chevron',
              isGroupExpanded('__ungrouped__') ? 'mld-sample-selector__chevron--open' : '',
            ]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="mld-sample-selector__ungrouped-label">Ungrouped</span>
          <span class="mld-sample-selector__ungrouped-count">{{ ungroupedSamples.length }}</span>
        </div>

        <Transition name="mld-collapse">
          <div
            v-if="isGroupExpanded('__ungrouped__')"
            class="mld-sample-selector__ungrouped-list"
          >
            <div
              v-for="sample in ungroupedSamples"
              :key="sample"
              :class="[
                'mld-sample-selector__sample',
                draggingSample === sample ? 'mld-sample-selector__sample--dragging' : '',
              ]"
              draggable="true"
              @dragstart="handleDragStart(sample, null, $event)"
              @dragend="handleDragEnd"
            >
              <svg class="mld-sample-selector__drag-handle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
              <input
                type="checkbox"
                :checked="modelValue.includes(sample)"
                class="mld-sample-selector__checkbox mld-sample-selector__checkbox--small"
                @change="toggleSample(sample)"
              />
              <span class="mld-sample-selector__sample-name">{{ sample }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- New Group Input -->
      <div class="mld-sample-selector__new-group">
        <BaseInput
          v-model="newGroupName"
          placeholder="New group name..."
          class="mld-sample-selector__new-group-input"
          @keyup.enter="addNewGroup"
        />
        <BaseButton
          variant="ghost"
          size="sm"
          :disabled="!newGroupName.trim()"
          class="mld-sample-selector__new-group-btn"
          @click="addNewGroup"
        >
          Add
        </BaseButton>
      </div>

      <!-- Hidden color picker input -->
      <input
        ref="colorPickerInput"
        type="color"
        class="mld-sample-selector__color-input"
        :value="editingGroupColor ? getGroupColor(editingGroupColor) : '#3B82F6'"
        @change="handleColorChange"
      />
    </div>

    <!-- Flat View (when no groups) -->
    <div v-if="!groupingEnabled" class="mld-sample-selector__flat">
      <!-- Search -->
      <div class="mld-sample-selector__search">
        <svg class="mld-sample-selector__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search samples..."
          class="mld-sample-selector__search-input"
        />
      </div>

      <!-- Flat samples list -->
      <div class="mld-sample-selector__flat-list">
        <div
          v-for="sample in filteredSamples"
          :key="sample"
          class="mld-sample-selector__flat-item"
        >
          <input
            type="checkbox"
            :checked="modelValue.includes(sample)"
            class="mld-sample-selector__checkbox"
            @change="toggleSample(sample)"
          />
          <span class="mld-sample-selector__flat-name">{{ sample }}</span>
        </div>

        <div v-if="filteredSamples.length === 0 && searchQuery.trim()" class="mld-sample-selector__empty">
          No samples match "{{ searchQuery }}"
        </div>
      </div>
    </div>

    <!-- Metadata Grouping Modal -->
    <GroupingModal
      :open="showMetadataModal"
      :samples="samples"
      @close="showMetadataModal = false"
      @apply="handleMetadataApply"
    />
  </div>
</template>

<style>
@import '../styles/components/sample-selector.css';
</style>
