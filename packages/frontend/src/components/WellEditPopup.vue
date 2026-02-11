<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import type { Well, WellEditData, WellEditField } from '../types'

interface Props {
  wellId: string
  wellData?: Partial<Well>
  editFields?: WellEditField[]
  defaultInjectionVolume?: number
  position: { x: number; y: number }
}

const props = withDefaults(defineProps<Props>(), {
  wellData: () => ({}),
  editFields: () => ['label', 'sampleType', 'injectionVolume', 'injectionCount', 'customMethod'],
  defaultInjectionVolume: 5,
})

const emit = defineEmits<{
  save: [data: WellEditData]
  clear: []
  close: []
}>()

const showAdvanced = ref(false)

const formData = ref({
  label: '',
  sampleType: 'sample',
  injectionVolume: props.defaultInjectionVolume,
  injectionCount: 1,
  customMethod: '',
})

watch(
  () => [props.wellId, props.wellData] as const,
  () => {
    const meta = props.wellData?.metadata as Record<string, unknown> | undefined
    formData.value = {
      label: (meta?.label as string) || '',
      sampleType: props.wellData?.sampleType || 'sample',
      injectionVolume: (meta?.injectionVolume as number) || props.defaultInjectionVolume,
      injectionCount: (meta?.injectionCount as number) || 1,
      customMethod: (meta?.customMethod as string) || '',
    }
    showAdvanced.value = (formData.value.injectionCount > 1) || !!formData.value.customMethod
  },
  { immediate: true },
)

const hasField = (field: WellEditField) => props.editFields.includes(field)

const popupStyle = computed(() => {
  const x = props.position.x
  const y = props.position.y
  const style: Record<string, string> = {
    left: `${x}px`,
    top: `${y}px`,
  }
  return style
})

function save() {
  emit('save', {
    wellId: props.wellId,
    label: formData.value.label.trim(),
    sampleType: formData.value.sampleType,
    injectionVolume: formData.value.injectionVolume,
    injectionCount: formData.value.injectionCount || 1,
    customMethod: formData.value.customMethod?.trim() || '',
  })
}

function clear() {
  emit('clear')
}

function close() {
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const sampleTypeButtons = [
  { type: 'sample', label: 'S', tooltip: 'Sample' },
  { type: 'blank', label: 'B', tooltip: 'Blank' },
  { type: 'qc', label: 'Q', tooltip: 'QC' },
]
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="mld-well-edit-popup__backdrop" @click="close" />

    <!-- Popup -->
    <div
      class="mld-well-edit-popup"
      :style="popupStyle"
      @click.stop
    >
      <!-- Header -->
      <div class="mld-well-edit-popup__header">
        <div class="mld-well-edit-popup__header-left">
          <span class="mld-well-edit-popup__well-id">{{ wellId }}</span>
          <span class="mld-well-edit-popup__title">Edit Well</span>
        </div>
        <button class="mld-well-edit-popup__close" @click="close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="mld-well-edit-popup__body">
        <!-- Sample Name -->
        <div v-if="hasField('label')">
          <label class="mld-well-edit-popup__label">Sample Name</label>
          <input
            v-model="formData.label"
            type="text"
            placeholder="e.g., Sample_001"
            class="mld-well-edit-popup__input"
            @keydown.enter="save"
            autofocus
          />
        </div>

        <!-- Type + Volume row -->
        <div class="mld-well-edit-popup__row">
          <div v-if="hasField('sampleType')">
            <label class="mld-well-edit-popup__label">Type</label>
            <div class="mld-well-edit-popup__type-grid">
              <button
                v-for="btn in sampleTypeButtons"
                :key="btn.type"
                :title="btn.tooltip"
                class="mld-well-edit-popup__type-btn"
                :class="{
                  [`mld-well-edit-popup__type-btn--${btn.type}`]: formData.sampleType === btn.type,
                }"
                @click="formData.sampleType = btn.type"
              >
                {{ btn.label }}
              </button>
            </div>
          </div>
          <div v-if="hasField('injectionVolume')">
            <label class="mld-well-edit-popup__label">Volume (uL)</label>
            <input
              v-model.number="formData.injectionVolume"
              type="number"
              min="0.1"
              max="100"
              step="0.5"
              class="mld-well-edit-popup__input"
            />
          </div>
        </div>

        <!-- Advanced toggle -->
        <label
          v-if="hasField('injectionCount') || hasField('customMethod')"
          class="mld-well-edit-popup__advanced-toggle"
        >
          <input type="checkbox" v-model="showAdvanced" />
          <span>Advanced options</span>
        </label>

        <!-- Advanced fields -->
        <template v-if="showAdvanced">
          <!-- Injection count -->
          <div v-if="hasField('injectionCount')">
            <label class="mld-well-edit-popup__label">Repeat Injections</label>
            <div class="mld-well-edit-popup__count-grid">
              <button
                v-for="n in [1, 2, 3, 4, 5]"
                :key="n"
                class="mld-well-edit-popup__count-btn"
                :class="{ 'mld-well-edit-popup__count-btn--active': formData.injectionCount === n }"
                @click="formData.injectionCount = n"
              >
                {{ n }}&times;
              </button>
              <input
                v-model.number="formData.injectionCount"
                type="number"
                min="1"
                max="10"
                class="mld-well-edit-popup__count-input"
              />
            </div>
          </div>

          <!-- Custom method -->
          <div v-if="hasField('customMethod')">
            <label class="mld-well-edit-popup__label">Custom Method Path</label>
            <input
              v-model="formData.customMethod"
              type="text"
              placeholder="Leave empty for default"
              class="mld-well-edit-popup__input mld-well-edit-popup__input--mono"
            />
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="mld-well-edit-popup__footer">
        <button class="mld-well-edit-popup__btn mld-well-edit-popup__btn--clear" @click="clear">
          Clear Well
        </button>
        <button class="mld-well-edit-popup__btn mld-well-edit-popup__btn--save" @click="save">
          Save
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style>
@import '../styles/components/well-edit-popup.css';
</style>
