<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ProtocolStep, ProtocolStepType, ProtocolStepStatus } from '../types'
import {
  useProtocolTemplates,
  type StepTemplate,
} from '../composables/useProtocolTemplates'
import ConcentrationInput from './ConcentrationInput.vue'
import type { ConcentrationValue } from '../composables/useConcentrationUnits'

interface Props {
  modelValue?: ProtocolStep
  templates?: StepTemplate[]
  customTemplates?: StepTemplate[]
  mode?: 'create' | 'edit'
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  showPreview: true,
})

const emit = defineEmits<{
  'update:modelValue': [step: ProtocolStep]
  'save': [step: ProtocolStep]
  'save-template': [template: StepTemplate]
  'cancel': []
}>()

const {
  allTemplates,
  getTemplateByType,
  validateStep,
  formatParameterValue,
} = useProtocolTemplates()

// State
const selectedTemplateId = ref<string | null>(null)
const dropdownOpen = ref(false)
const stepName = ref('')
const stepDescription = ref('')
const stepDuration = ref<number | undefined>()
const parameters = ref<Record<string, unknown>>({})
const validationErrors = ref<Record<string, string>>({})

// Combined templates from props and composable
const availableTemplates = computed(() => {
  if (props.templates && props.templates.length > 0) {
    return props.templates
  }
  const combined = [...allTemplates.value]
  if (props.customTemplates) {
    combined.push(...props.customTemplates)
  }
  return combined
})

// Selected template
const selectedTemplate = computed(() => {
  if (!selectedTemplateId.value) return null
  return availableTemplates.value.find((t) => t.id === selectedTemplateId.value) || null
})

// Step type icons (same as ExperimentTimeline)
const stepTypeIcons: Record<ProtocolStepType, string> = {
  incubation: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  wash: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  addition: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  measurement: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  centrifuge: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  mix: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  custom: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
}

// Preview computed
const previewStep = computed<ProtocolStep | null>(() => {
  if (!selectedTemplate.value) return null
  return {
    id: props.modelValue?.id || 'preview',
    type: selectedTemplate.value.type,
    name: stepName.value || selectedTemplate.value.name,
    description: stepDescription.value,
    duration: stepDuration.value ?? selectedTemplate.value.defaultDuration,
    status: (props.modelValue?.status || 'pending') as ProtocolStepStatus,
    parameters: { ...parameters.value },
    order: props.modelValue?.order || 0,
  }
})

const previewParams = computed(() => {
  if (!selectedTemplate.value || !previewStep.value) return ''
  return selectedTemplate.value.parameters
    .filter((p) => parameters.value[p.key] !== undefined && parameters.value[p.key] !== '')
    .map((p) => formatParameterValue(parameters.value[p.key], p))
    .join(', ')
})

// Initialize from modelValue
function initFromStep(step: ProtocolStep) {
  const template = getTemplateByType(step.type)
  if (template) {
    selectedTemplateId.value = template.id
  }
  stepName.value = step.name
  stepDescription.value = step.description || ''
  stepDuration.value = step.duration
  parameters.value = { ...(step.parameters || {}) }
}

// Handle template selection
function selectTemplate(template: StepTemplate) {
  selectedTemplateId.value = template.id
  dropdownOpen.value = false

  // Reset to template defaults if creating new
  if (props.mode === 'create') {
    stepName.value = template.name
    stepDescription.value = template.description || ''
    stepDuration.value = template.defaultDuration

    parameters.value = {}
    for (const param of template.parameters) {
      if (param.default !== undefined) {
        parameters.value[param.key] = param.default
      }
    }
  }
}

// Handle parameter change
function handleParamChange(key: string, value: unknown) {
  parameters.value[key] = value
  // Clear validation error when user changes value
  if (validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
}

// Handle concentration change
function handleConcentrationChange(key: string, value: ConcentrationValue | undefined) {
  parameters.value[key] = value
  if (validationErrors.value[key]) {
    delete validationErrors.value[key]
  }
}

// Validate and save
function handleSave() {
  if (!selectedTemplate.value || !previewStep.value) return

  const result = validateStep(previewStep.value, selectedTemplate.value)
  validationErrors.value = result.errors

  if (result.valid) {
    emit('save', previewStep.value)
    emit('update:modelValue', previewStep.value)
  }
}

// Save as template
function handleSaveTemplate() {
  if (!selectedTemplate.value) return

  const newTemplate: StepTemplate = {
    id: `custom-${Date.now()}`,
    type: selectedTemplate.value.type,
    name: stepName.value || selectedTemplate.value.name,
    description: stepDescription.value,
    defaultDuration: stepDuration.value,
    parameters: selectedTemplate.value.parameters.map((p) => ({
      ...p,
      default: parameters.value[p.key],
    })),
    isBuiltIn: false,
  }

  emit('save-template', newTemplate)
}

// Handle cancel
function handleCancel() {
  emit('cancel')
}

// Close dropdown on click outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.mld-protocol-editor__template-dropdown')) {
    dropdownOpen.value = false
  }
}

// Format duration
function formatDuration(minutes: number | undefined): string {
  if (minutes === undefined) return ''
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  if (props.modelValue) {
    initFromStep(props.modelValue)
  } else if (availableTemplates.value.length > 0) {
    selectTemplate(availableTemplates.value[0])
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for external changes
watch(
  () => props.modelValue,
  (step) => {
    if (step) {
      initFromStep(step)
    }
  }
)
</script>

<template>
  <div class="mld-protocol-editor">
    <!-- Header -->
    <div class="mld-protocol-editor__header">
      <span class="mld-protocol-editor__title">
        {{ mode === 'create' ? 'Create Protocol Step' : 'Edit Protocol Step' }}
      </span>
      <span
        :class="[
          'mld-protocol-editor__mode-badge',
          `mld-protocol-editor__mode-badge--${mode}`,
        ]"
      >
        {{ mode }}
      </span>
    </div>

    <!-- Form -->
    <div class="mld-protocol-editor__form">
      <!-- Template selector -->
      <div class="mld-protocol-editor__template-select">
        <label class="mld-protocol-editor__template-label">Template</label>
        <div class="mld-protocol-editor__template-dropdown">
          <button
            type="button"
            class="mld-protocol-editor__template-btn"
            @click.stop="dropdownOpen = !dropdownOpen"
          >
            <svg
              v-if="selectedTemplate"
              class="mld-protocol-editor__template-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stepTypeIcons[selectedTemplate.type]"
              />
            </svg>
            <span class="mld-protocol-editor__template-text">
              {{ selectedTemplate?.name || 'Select template...' }}
            </span>
            <svg
              :class="[
                'mld-protocol-editor__template-arrow',
                dropdownOpen ? 'mld-protocol-editor__template-arrow--open' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-if="dropdownOpen" class="mld-protocol-editor__template-menu">
            <button
              v-for="template in availableTemplates"
              :key="template.id"
              type="button"
              :class="[
                'mld-protocol-editor__template-option',
                selectedTemplateId === template.id ? 'mld-protocol-editor__template-option--active' : '',
              ]"
              @click="selectTemplate(template)"
            >
              <svg
                class="mld-protocol-editor__template-option-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="stepTypeIcons[template.type]"
                />
              </svg>
              <div class="mld-protocol-editor__template-option-text">
                <div>{{ template.name }}</div>
                <div v-if="template.description" class="mld-protocol-editor__template-option-desc">
                  {{ template.description }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="mld-protocol-editor__divider" />

      <!-- Step name -->
      <div class="mld-protocol-editor__field">
        <label class="mld-protocol-editor__field-label mld-protocol-editor__field-label--required">
          Step Name
        </label>
        <input
          v-model="stepName"
          type="text"
          :class="[
            'mld-protocol-editor__input',
            validationErrors.name ? 'mld-protocol-editor__input--error' : '',
          ]"
          placeholder="Enter step name"
        />
        <span v-if="validationErrors.name" class="mld-protocol-editor__field-error">
          {{ validationErrors.name }}
        </span>
      </div>

      <!-- Dynamic parameters -->
      <template v-if="selectedTemplate">
        <div
          v-for="(param, index) in selectedTemplate.parameters"
          :key="param.key"
          :class="[
            'mld-protocol-editor__field',
            index % 2 === 0 && selectedTemplate.parameters[index + 1]
              ? ''
              : '',
          ]"
        >
          <label
            :class="[
              'mld-protocol-editor__field-label',
              param.required ? 'mld-protocol-editor__field-label--required' : '',
            ]"
          >
            {{ param.label }}
          </label>

          <!-- Number input with unit -->
          <div
            v-if="param.type === 'number' || param.type === 'temperature' || param.type === 'duration'"
            class="mld-protocol-editor__input-unit"
          >
            <input
              type="number"
              :value="parameters[param.key]"
              :min="param.min"
              :max="param.max"
              :placeholder="param.placeholder || `Enter ${param.label.toLowerCase()}`"
              :class="[
                'mld-protocol-editor__input',
                validationErrors[param.key] ? 'mld-protocol-editor__input--error' : '',
              ]"
              @input="handleParamChange(param.key, ($event.target as HTMLInputElement).valueAsNumber)"
            />
            <span v-if="param.unit" class="mld-protocol-editor__unit-suffix">
              {{ param.unit }}
            </span>
          </div>

          <!-- Text input -->
          <input
            v-else-if="param.type === 'text'"
            type="text"
            :value="parameters[param.key]"
            :placeholder="param.placeholder || `Enter ${param.label.toLowerCase()}`"
            :class="[
              'mld-protocol-editor__input',
              validationErrors[param.key] ? 'mld-protocol-editor__input--error' : '',
            ]"
            @input="handleParamChange(param.key, ($event.target as HTMLInputElement).value)"
          />

          <!-- Select -->
          <select
            v-else-if="param.type === 'select'"
            :value="parameters[param.key]"
            :class="[
              'mld-protocol-editor__select',
              validationErrors[param.key] ? 'mld-protocol-editor__input--error' : '',
            ]"
            @change="handleParamChange(param.key, ($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>Select {{ param.label.toLowerCase() }}</option>
            <option
              v-for="option in param.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Concentration input -->
          <ConcentrationInput
            v-else-if="param.type === 'concentration'"
            :model-value="parameters[param.key] as ConcentrationValue | undefined"
            :error="!!validationErrors[param.key]"
            size="md"
            @update:model-value="handleConcentrationChange(param.key, $event)"
          />

          <!-- Reagent input (text for now) -->
          <input
            v-else-if="param.type === 'reagent'"
            type="text"
            :value="parameters[param.key]"
            :placeholder="param.placeholder || 'Enter reagent name'"
            :class="[
              'mld-protocol-editor__input',
              validationErrors[param.key] ? 'mld-protocol-editor__input--error' : '',
            ]"
            @input="handleParamChange(param.key, ($event.target as HTMLInputElement).value)"
          />

          <span v-if="validationErrors[param.key]" class="mld-protocol-editor__field-error">
            {{ validationErrors[param.key] }}
          </span>
        </div>
      </template>

      <!-- Description -->
      <div class="mld-protocol-editor__field">
        <label class="mld-protocol-editor__field-label">Description</label>
        <textarea
          v-model="stepDescription"
          class="mld-protocol-editor__textarea"
          placeholder="Optional step description"
          rows="2"
        />
      </div>
    </div>

    <!-- Preview -->
    <div v-if="showPreview && previewStep" class="mld-protocol-editor__preview">
      <div class="mld-protocol-editor__preview-title">Preview</div>
      <div class="mld-protocol-editor__preview-card">
        <div class="mld-protocol-editor__preview-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="stepTypeIcons[previewStep.type]"
            />
          </svg>
        </div>
        <div class="mld-protocol-editor__preview-content">
          <div class="mld-protocol-editor__preview-name">{{ previewStep.name }}</div>
          <div v-if="previewParams" class="mld-protocol-editor__preview-params">
            {{ previewParams }}
          </div>
        </div>
        <div v-if="previewStep.duration" class="mld-protocol-editor__preview-duration">
          {{ formatDuration(previewStep.duration) }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mld-protocol-editor__actions">
      <div class="mld-protocol-editor__actions-left">
        <button
          type="button"
          class="mld-protocol-editor__btn mld-protocol-editor__btn--ghost"
          @click="handleSaveTemplate"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save as Template
        </button>
      </div>
      <button
        type="button"
        class="mld-protocol-editor__btn mld-protocol-editor__btn--secondary"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button
        type="button"
        class="mld-protocol-editor__btn mld-protocol-editor__btn--primary"
        :disabled="!selectedTemplate"
        @click="handleSave"
      >
        {{ mode === 'create' ? 'Add Step' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<style>
@import '../styles/components/protocol-step-editor.css';
</style>
