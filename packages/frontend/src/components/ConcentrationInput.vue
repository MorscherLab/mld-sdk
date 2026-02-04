<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  useConcentrationUnits,
  type ConcentrationValue,
  type ConcentrationUnit,
} from '../composables/useConcentrationUnits'

interface Props {
  modelValue?: ConcentrationValue
  allowedUnits?: ConcentrationUnit[]
  showConversion?: boolean
  molecularWeight?: number
  min?: number
  max?: number
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  showConversion: true,
  disabled: false,
  error: false,
  size: 'md',
  placeholder: 'Enter value',
})

const emit = defineEmits<{
  'update:modelValue': [value: ConcentrationValue | undefined]
}>()

const { unitCategories, getConversionHint } = useConcentrationUnits()

// Filter categories based on allowedUnits
const filteredCategories = computed(() => {
  if (!props.allowedUnits || props.allowedUnits.length === 0) {
    return unitCategories.value
  }
  return unitCategories.value
    .map(cat => ({
      label: cat.label,
      units: cat.units.filter(u => props.allowedUnits!.includes(u)),
    }))
    .filter(cat => cat.units.length > 0)
})

// Flatten all available units
const availableUnits = computed(() => {
  return filteredCategories.value.flatMap(cat => cat.units)
})

// Current value and unit
const currentValue = computed(() => props.modelValue?.value)
const currentUnit = computed(() => props.modelValue?.unit || availableUnits.value[0] || 'µM')

// Conversion hint
const conversionHint = computed(() => {
  if (!props.showConversion || !props.modelValue) return null
  return getConversionHint(props.modelValue)
})

function handleValueInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? undefined : Number(target.value)

  if (value === undefined || isNaN(value)) {
    emit('update:modelValue', undefined)
    return
  }

  // Apply min/max constraints
  let clampedValue = value
  if (props.min !== undefined && clampedValue < props.min) {
    clampedValue = props.min
  }
  if (props.max !== undefined && clampedValue > props.max) {
    clampedValue = props.max
  }

  emit('update:modelValue', {
    value: clampedValue,
    unit: currentUnit.value,
  })
}

function handleUnitChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const unit = target.value as ConcentrationUnit

  emit('update:modelValue', {
    value: currentValue.value ?? 0,
    unit,
  })
}

// Ensure modelValue always has a valid unit
watch(availableUnits, (units) => {
  if (props.modelValue && !units.includes(props.modelValue.unit)) {
    emit('update:modelValue', {
      value: props.modelValue.value,
      unit: units[0] || 'µM',
    })
  }
}, { immediate: true })
</script>

<template>
  <div
    :class="[
      'mld-concentration-input',
      error ? 'mld-concentration-input--error' : '',
      disabled ? 'mld-concentration-input--disabled' : '',
    ]"
  >
    <div class="mld-concentration-input__controls">
      <input
        type="number"
        :value="currentValue"
        :min="min"
        :max="max"
        :disabled="disabled"
        :placeholder="placeholder"
        :class="[
          'mld-concentration-input__value',
          `mld-concentration-input__value--${size}`,
          disabled ? 'mld-concentration-input__value--disabled' : '',
        ]"
        aria-label="Concentration value"
        @input="handleValueInput"
      />

      <div class="mld-concentration-input__unit">
        <select
          :value="currentUnit"
          :disabled="disabled"
          :class="[
            'mld-concentration-input__unit-select',
            `mld-concentration-input__unit-select--${size}`,
          ]"
          aria-label="Concentration unit"
          @change="handleUnitChange"
        >
          <template v-for="category in filteredCategories" :key="category.label">
            <optgroup
              v-if="filteredCategories.length > 1"
              :label="category.label"
              class="mld-concentration-input__unit-group"
            >
              <option
                v-for="unit in category.units"
                :key="unit"
                :value="unit"
              >
                {{ unit }}
              </option>
            </optgroup>
            <template v-else>
              <option
                v-for="unit in category.units"
                :key="unit"
                :value="unit"
              >
                {{ unit }}
              </option>
            </template>
          </template>
        </select>
      </div>
    </div>

    <div
      v-if="showConversion && conversionHint"
      class="mld-concentration-input__conversion"
    >
      {{ conversionHint }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/concentration-input.css';
</style>
