<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GroupItem } from '../types'

interface Props {
  groups: GroupItem[]
  group1: string[]
  group2: string[]
  label1?: string
  label2?: string
  color1?: string
  color2?: string
  minPerGroup?: number
}

const props = withDefaults(defineProps<Props>(), {
  label1: 'Control',
  label2: 'Treatment',
  color1: '#3B82F6',
  color2: '#F43F5E',
  minPerGroup: 1,
})

const emit = defineEmits<{
  'update:group1': [names: string[]]
  'update:group2': [names: string[]]
}>()

const dragOverZone = ref<'zone1' | 'zone2' | null>(null)
const draggingGroup = ref<string | null>(null)

const unassignedGroups = computed(() =>
  props.groups.filter(
    g => !props.group1.includes(g.name) && !props.group2.includes(g.name)
  )
)

const zone1Groups = computed(() =>
  props.groups.filter(g => props.group1.includes(g.name))
)

const zone2Groups = computed(() =>
  props.groups.filter(g => props.group2.includes(g.name))
)

const zone1Count = computed(() =>
  zone1Groups.value.reduce((sum, g) => sum + g.count, 0)
)

const zone2Count = computed(() =>
  zone2Groups.value.reduce((sum, g) => sum + g.count, 0)
)

const isValid = computed(() =>
  props.group1.length >= props.minPerGroup &&
  props.group2.length >= props.minPerGroup
)

const validationMessage = computed(() => {
  if (isValid.value) return null
  const missing1 = Math.max(0, props.minPerGroup - props.group1.length)
  const missing2 = Math.max(0, props.minPerGroup - props.group2.length)
  const parts: string[] = []
  if (missing1 > 0) parts.push(`${missing1} more to ${props.label1}`)
  if (missing2 > 0) parts.push(`${missing2} more to ${props.label2}`)
  return `Add ${parts.join(' and ')}`
})

function handleDragStart(event: DragEvent, groupName: string) {
  draggingGroup.value = groupName
  event.dataTransfer?.setData('groupName', groupName)
  event.dataTransfer!.effectAllowed = 'move'
}

function handleDragEnd() {
  draggingGroup.value = null
  dragOverZone.value = null
}

function handleDragOver(event: DragEvent, zone: 'zone1' | 'zone2') {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
  dragOverZone.value = zone
}

function handleDragLeave() {
  dragOverZone.value = null
}

function handleDrop(event: DragEvent, zone: 'zone1' | 'zone2') {
  event.preventDefault()
  dragOverZone.value = null

  const groupName = event.dataTransfer?.getData('groupName')
  if (!groupName) return

  assignToZone(groupName, zone)
}

function assignToZone(groupName: string, zone: 'zone1' | 'zone2') {
  // Remove from both zones first
  const newGroup1 = props.group1.filter(n => n !== groupName)
  const newGroup2 = props.group2.filter(n => n !== groupName)

  // Add to target zone
  if (zone === 'zone1') {
    emit('update:group1', [...newGroup1, groupName])
    emit('update:group2', newGroup2)
  } else {
    emit('update:group1', newGroup1)
    emit('update:group2', [...newGroup2, groupName])
  }
}

function removeFromZone(groupName: string, zone: 'zone1' | 'zone2') {
  if (zone === 'zone1') {
    emit('update:group1', props.group1.filter(n => n !== groupName))
  } else {
    emit('update:group2', props.group2.filter(n => n !== groupName))
  }
}

function clearAll() {
  emit('update:group1', [])
  emit('update:group2', [])
}
</script>

<template>
  <div class="mld-group-assigner">
    <!-- Drop zones -->
    <div class="mld-group-assigner__zones">
      <!-- Zone 1 (Control) -->
      <div
        :class="[
          'mld-group-assigner__zone',
          'mld-group-assigner__zone--1',
          dragOverZone === 'zone1' ? 'mld-group-assigner__zone--dragover' : '',
        ]"
        :style="{ '--zone-color': color1 }"
        @dragover="handleDragOver($event, 'zone1')"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, 'zone1')"
      >
        <div class="mld-group-assigner__zone-header">
          <span class="mld-group-assigner__zone-label">{{ label1 }}</span>
          <span class="mld-group-assigner__zone-count">{{ zone1Count }} samples</span>
        </div>

        <div class="mld-group-assigner__zone-content">
          <div
            v-for="group in zone1Groups"
            :key="group.name"
            class="mld-group-assigner__pill"
            draggable="true"
            @dragstart="handleDragStart($event, group.name)"
            @dragend="handleDragEnd"
          >
            <span
              class="mld-group-assigner__pill-color"
              :style="{ backgroundColor: group.color }"
            />
            <span class="mld-group-assigner__pill-name">{{ group.name }}</span>
            <span class="mld-group-assigner__pill-count">{{ group.count }}</span>
            <button
              type="button"
              class="mld-group-assigner__pill-remove"
              @click="removeFromZone(group.name, 'zone1')"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="zone1Groups.length === 0" class="mld-group-assigner__zone-empty">
            Drag groups here
          </div>
        </div>
      </div>

      <!-- Zone 2 (Treatment) -->
      <div
        :class="[
          'mld-group-assigner__zone',
          'mld-group-assigner__zone--2',
          dragOverZone === 'zone2' ? 'mld-group-assigner__zone--dragover' : '',
        ]"
        :style="{ '--zone-color': color2 }"
        @dragover="handleDragOver($event, 'zone2')"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, 'zone2')"
      >
        <div class="mld-group-assigner__zone-header">
          <span class="mld-group-assigner__zone-label">{{ label2 }}</span>
          <span class="mld-group-assigner__zone-count">{{ zone2Count }} samples</span>
        </div>

        <div class="mld-group-assigner__zone-content">
          <div
            v-for="group in zone2Groups"
            :key="group.name"
            class="mld-group-assigner__pill"
            draggable="true"
            @dragstart="handleDragStart($event, group.name)"
            @dragend="handleDragEnd"
          >
            <span
              class="mld-group-assigner__pill-color"
              :style="{ backgroundColor: group.color }"
            />
            <span class="mld-group-assigner__pill-name">{{ group.name }}</span>
            <span class="mld-group-assigner__pill-count">{{ group.count }}</span>
            <button
              type="button"
              class="mld-group-assigner__pill-remove"
              @click="removeFromZone(group.name, 'zone2')"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="zone2Groups.length === 0" class="mld-group-assigner__zone-empty">
            Drag groups here
          </div>
        </div>
      </div>
    </div>

    <!-- Unassigned groups -->
    <div v-if="unassignedGroups.length > 0" class="mld-group-assigner__unassigned">
      <div class="mld-group-assigner__unassigned-header">
        <span class="mld-group-assigner__unassigned-title">Available Groups</span>
        <button
          v-if="group1.length > 0 || group2.length > 0"
          type="button"
          class="mld-group-assigner__clear-btn"
          @click="clearAll"
        >
          Clear all
        </button>
      </div>

      <div class="mld-group-assigner__unassigned-list">
        <div
          v-for="group in unassignedGroups"
          :key="group.name"
          :class="[
            'mld-group-assigner__pill',
            'mld-group-assigner__pill--unassigned',
            draggingGroup === group.name ? 'mld-group-assigner__pill--dragging' : '',
          ]"
          draggable="true"
          @dragstart="handleDragStart($event, group.name)"
          @dragend="handleDragEnd"
        >
          <span
            class="mld-group-assigner__pill-color"
            :style="{ backgroundColor: group.color }"
          />
          <span class="mld-group-assigner__pill-name">{{ group.name }}</span>
          <span class="mld-group-assigner__pill-count">{{ group.count }}</span>
        </div>
      </div>
    </div>

    <!-- Validation message -->
    <div v-if="validationMessage" class="mld-group-assigner__validation">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ validationMessage }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/group-assigner.css';
</style>
