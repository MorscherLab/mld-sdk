import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { ProtocolStep, ProtocolStepType, ProtocolStepStatus } from '../types'

// Parameter definition for step templates
export interface ParameterDefinition {
  key: string
  label: string
  type: 'number' | 'text' | 'select' | 'concentration' | 'temperature' | 'duration' | 'reagent'
  unit?: string
  options?: Array<{ value: string; label: string }>
  required?: boolean
  default?: unknown
  min?: number
  max?: number
  placeholder?: string
}

// Step template definition
export interface StepTemplate {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  defaultDuration?: number
  parameters: ParameterDefinition[]
  isBuiltIn?: boolean
}

// Validation result
export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export interface UseProtocolTemplatesReturn {
  builtInTemplates: StepTemplate[]
  customTemplates: Ref<StepTemplate[]>
  allTemplates: ComputedRef<StepTemplate[]>
  getTemplateByType: (type: ProtocolStepType) => StepTemplate | undefined
  getTemplateById: (id: string) => StepTemplate | undefined
  saveCustomTemplate: (template: StepTemplate) => void
  deleteCustomTemplate: (templateId: string) => void
  validateStep: (step: ProtocolStep, template: StepTemplate) => ValidationResult
  createStepFromTemplate: (template: StepTemplate, overrides?: Partial<ProtocolStep>) => ProtocolStep
  formatParameterValue: (value: unknown, param: ParameterDefinition) => string
}

// Built-in templates
const BUILT_IN_TEMPLATES: StepTemplate[] = [
  {
    id: 'builtin-incubation',
    type: 'incubation',
    name: 'Incubation',
    description: 'Incubate samples at specified conditions',
    defaultDuration: 60,
    isBuiltIn: true,
    parameters: [
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'temperature',
        unit: '°C',
        required: true,
        default: 37,
        min: -80,
        max: 100,
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'duration',
        unit: 'hours',
        required: true,
        default: 24,
        min: 0,
      },
      {
        key: 'co2',
        label: 'CO2',
        type: 'number',
        unit: '%',
        required: false,
        default: 5,
        min: 0,
        max: 100,
      },
      {
        key: 'humidity',
        label: 'Humidity',
        type: 'number',
        unit: '%',
        required: false,
        default: 95,
        min: 0,
        max: 100,
      },
    ],
  },
  {
    id: 'builtin-wash',
    type: 'wash',
    name: 'Wash',
    description: 'Wash samples with buffer',
    defaultDuration: 5,
    isBuiltIn: true,
    parameters: [
      {
        key: 'buffer',
        label: 'Buffer',
        type: 'select',
        required: true,
        default: 'PBS',
        options: [
          { value: 'PBS', label: 'PBS' },
          { value: 'PBST', label: 'PBST' },
          { value: 'TBS', label: 'TBS' },
          { value: 'TBST', label: 'TBST' },
          { value: 'Water', label: 'Water' },
          { value: 'Other', label: 'Other' },
        ],
      },
      {
        key: 'volume',
        label: 'Volume',
        type: 'number',
        unit: 'µL',
        required: true,
        default: 200,
        min: 0,
      },
      {
        key: 'cycles',
        label: 'Wash Cycles',
        type: 'number',
        required: true,
        default: 3,
        min: 1,
        max: 10,
      },
    ],
  },
  {
    id: 'builtin-addition',
    type: 'addition',
    name: 'Addition',
    description: 'Add reagent or compound to samples',
    defaultDuration: 5,
    isBuiltIn: true,
    parameters: [
      {
        key: 'reagent',
        label: 'Reagent',
        type: 'text',
        required: true,
        placeholder: 'Enter reagent name',
      },
      {
        key: 'volume',
        label: 'Volume',
        type: 'number',
        unit: 'µL',
        required: true,
        default: 100,
        min: 0,
      },
      {
        key: 'concentration',
        label: 'Concentration',
        type: 'concentration',
        required: false,
      },
    ],
  },
  {
    id: 'builtin-measurement',
    type: 'measurement',
    name: 'Measurement',
    description: 'Take measurements using specified instrument',
    defaultDuration: 15,
    isBuiltIn: true,
    parameters: [
      {
        key: 'instrument',
        label: 'Instrument',
        type: 'select',
        required: true,
        options: [
          { value: 'plate_reader', label: 'Plate Reader' },
          { value: 'microscope', label: 'Microscope' },
          { value: 'flow_cytometer', label: 'Flow Cytometer' },
          { value: 'spectrophotometer', label: 'Spectrophotometer' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        key: 'readout',
        label: 'Readout Type',
        type: 'text',
        required: false,
        placeholder: 'e.g., Absorbance 450nm',
      },
      {
        key: 'notes',
        label: 'Parameters',
        type: 'text',
        required: false,
        placeholder: 'Additional parameters',
      },
    ],
  },
  {
    id: 'builtin-centrifuge',
    type: 'centrifuge',
    name: 'Centrifuge',
    description: 'Centrifuge samples',
    defaultDuration: 10,
    isBuiltIn: true,
    parameters: [
      {
        key: 'speed',
        label: 'Speed',
        type: 'number',
        unit: 'RPM',
        required: true,
        default: 1000,
        min: 100,
        max: 20000,
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        unit: 'min',
        required: true,
        default: 5,
        min: 1,
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'temperature',
        unit: '°C',
        required: false,
        default: 4,
        min: -10,
        max: 40,
      },
    ],
  },
  {
    id: 'builtin-transfer',
    type: 'transfer',
    name: 'Transfer',
    description: 'Transfer samples between containers',
    defaultDuration: 10,
    isBuiltIn: true,
    parameters: [
      {
        key: 'source',
        label: 'Source',
        type: 'text',
        required: true,
        placeholder: 'Source container',
      },
      {
        key: 'destination',
        label: 'Destination',
        type: 'text',
        required: true,
        placeholder: 'Destination container',
      },
      {
        key: 'volume',
        label: 'Volume',
        type: 'number',
        unit: 'µL',
        required: true,
        default: 100,
        min: 0,
      },
    ],
  },
  {
    id: 'builtin-mix',
    type: 'mix',
    name: 'Mix',
    description: 'Mix samples',
    defaultDuration: 5,
    isBuiltIn: true,
    parameters: [
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        required: true,
        default: 'pipette',
        options: [
          { value: 'pipette', label: 'Pipette mixing' },
          { value: 'vortex', label: 'Vortex' },
          { value: 'shaker', label: 'Orbital shaker' },
          { value: 'inversion', label: 'Inversion' },
        ],
      },
      {
        key: 'duration',
        label: 'Duration',
        type: 'number',
        unit: 'sec',
        required: false,
        default: 30,
        min: 1,
      },
      {
        key: 'speed',
        label: 'Speed/Intensity',
        type: 'text',
        required: false,
        placeholder: 'e.g., 300 RPM',
      },
    ],
  },
  {
    id: 'builtin-custom',
    type: 'custom',
    name: 'Custom Step',
    description: 'Custom protocol step',
    defaultDuration: 15,
    isBuiltIn: true,
    parameters: [
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        required: true,
        placeholder: 'Describe the step',
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'text',
        required: false,
        placeholder: 'Additional notes',
      },
    ],
  },
]

// Storage key for custom templates
const STORAGE_KEY = 'mld-custom-protocol-templates'

function loadCustomTemplates(): StepTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore errors
  }
  return []
}

function saveCustomTemplatesToStorage(templates: StepTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch {
    // Ignore errors
  }
}

export function useProtocolTemplates(): UseProtocolTemplatesReturn {
  const customTemplates = ref<StepTemplate[]>(loadCustomTemplates())

  const allTemplates = computed(() => {
    return [...BUILT_IN_TEMPLATES, ...customTemplates.value]
  })

  function getTemplateByType(type: ProtocolStepType): StepTemplate | undefined {
    // First check custom templates, then built-in
    return (
      customTemplates.value.find((t) => t.type === type) ||
      BUILT_IN_TEMPLATES.find((t) => t.type === type)
    )
  }

  function getTemplateById(id: string): StepTemplate | undefined {
    return (
      customTemplates.value.find((t) => t.id === id) ||
      BUILT_IN_TEMPLATES.find((t) => t.id === id)
    )
  }

  function saveCustomTemplate(template: StepTemplate) {
    const newTemplate = {
      ...template,
      isBuiltIn: false,
      id: template.id || `custom-${Date.now()}`,
    }

    const index = customTemplates.value.findIndex((t) => t.id === newTemplate.id)
    if (index >= 0) {
      customTemplates.value[index] = newTemplate
    } else {
      customTemplates.value.push(newTemplate)
    }

    saveCustomTemplatesToStorage(customTemplates.value)
  }

  function deleteCustomTemplate(templateId: string) {
    const index = customTemplates.value.findIndex((t) => t.id === templateId)
    if (index >= 0) {
      customTemplates.value.splice(index, 1)
      saveCustomTemplatesToStorage(customTemplates.value)
    }
  }

  function validateStep(step: ProtocolStep, template: StepTemplate): ValidationResult {
    const errors: Record<string, string> = {}

    if (!step.name || step.name.trim() === '') {
      errors.name = 'Step name is required'
    }

    for (const param of template.parameters) {
      if (param.required) {
        const value = step.parameters?.[param.key]
        if (value === undefined || value === null || value === '') {
          errors[param.key] = `${param.label} is required`
        }
      }

      if (param.type === 'number' || param.type === 'temperature' || param.type === 'duration') {
        const value = step.parameters?.[param.key]
        if (value !== undefined && value !== null && value !== '') {
          const numValue = Number(value)
          if (isNaN(numValue)) {
            errors[param.key] = `${param.label} must be a number`
          } else {
            if (param.min !== undefined && numValue < param.min) {
              errors[param.key] = `${param.label} must be at least ${param.min}`
            }
            if (param.max !== undefined && numValue > param.max) {
              errors[param.key] = `${param.label} must be at most ${param.max}`
            }
          }
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  function createStepFromTemplate(
    template: StepTemplate,
    overrides?: Partial<ProtocolStep>
  ): ProtocolStep {
    // Build default parameters from template
    const parameters: Record<string, unknown> = {}
    for (const param of template.parameters) {
      if (param.default !== undefined) {
        parameters[param.key] = param.default
      }
    }

    return {
      id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: template.type,
      name: template.name,
      description: template.description,
      duration: template.defaultDuration,
      status: 'pending' as ProtocolStepStatus,
      parameters,
      order: 0,
      ...overrides,
    }
  }

  function formatParameterValue(value: unknown, param: ParameterDefinition): string {
    if (value === undefined || value === null || value === '') {
      return '-'
    }

    if (param.type === 'select' && param.options) {
      const option = param.options.find((o) => o.value === value)
      if (option) return option.label
    }

    if (param.type === 'concentration' && typeof value === 'object') {
      const conc = value as { value: number; unit: string }
      return `${conc.value} ${conc.unit}`
    }

    const strValue = String(value)
    if (param.unit) {
      return `${strValue} ${param.unit}`
    }

    return strValue
  }

  return {
    builtInTemplates: BUILT_IN_TEMPLATES,
    customTemplates,
    allTemplates,
    getTemplateByType,
    getTemplateById,
    saveCustomTemplate,
    deleteCustomTemplate,
    validateStep,
    createStepFromTemplate,
    formatParameterValue,
  }
}
