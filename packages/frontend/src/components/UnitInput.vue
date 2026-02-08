<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface UnitOption {
  value: string
  label: string
  factor?: number
  group?: string
}

interface Props {
  modelValue?: number
  unit?: string
  units: UnitOption[]
  precision?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  convertOnUnitChange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  precision: undefined,
  step: undefined,
  placeholder: 'Enter value',
  disabled: false,
  error: false,
  size: 'md',
  convertOnUnitChange: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
  'update:unit': [unit: string]
  'change': [data: { value: number | undefined; unit: string }]
}>()

const conversionHint = ref<string | null>(null)

const currentUnit = computed(() => props.unit || (props.units.length > 0 ? props.units[0].value : ''))

// Group units by their group property
const hasGroups = computed(() => props.units.some(u => u.group))

const groupedUnits = computed(() => {
  if (!hasGroups.value) return null
  const groups = new Map<string, UnitOption[]>()
  const ungrouped: UnitOption[] = []
  for (const u of props.units) {
    if (u.group) {
      if (!groups.has(u.group)) groups.set(u.group, [])
      groups.get(u.group)!.push(u)
    } else {
      ungrouped.push(u)
    }
  }
  return { groups, ungrouped }
})

function findUnit(value: string): UnitOption | undefined {
  return props.units.find(u => u.value === value)
}

function roundToPrecision(value: number): number {
  if (props.precision === undefined) return value
  const factor = Math.pow(10, props.precision)
  return Math.round(value * factor) / factor
}

function clamp(value: number): number {
  let result = value
  if (props.min !== undefined && result < props.min) result = props.min
  if (props.max !== undefined && result > props.max) result = props.max
  return result
}

function handleValueInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? undefined : Number(target.value)

  conversionHint.value = null

  if (value === undefined || isNaN(value)) {
    emit('update:modelValue', undefined)
    emit('change', { value: undefined, unit: currentUnit.value })
    return
  }

  const clamped = clamp(value)
  emit('update:modelValue', clamped)
  emit('change', { value: clamped, unit: currentUnit.value })
}

function handleUnitChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const newUnitValue = target.value
  const oldUnitValue = currentUnit.value

  let newValue = props.modelValue

  if (props.convertOnUnitChange && newValue !== undefined) {
    const oldUnit = findUnit(oldUnitValue)
    const newUnit = findUnit(newUnitValue)

    if (oldUnit?.factor !== undefined && newUnit?.factor !== undefined && newUnit.factor !== 0) {
      const converted = newValue * (oldUnit.factor / newUnit.factor)
      newValue = roundToPrecision(converted)
      newValue = clamp(newValue)
      conversionHint.value = `Converted from ${oldUnit.label} to ${newUnit.label}`
      emit('update:modelValue', newValue)
    }
  }

  emit('update:unit', newUnitValue)
  emit('change', { value: newValue, unit: newUnitValue })
}

// Clear conversion hint after a delay
watch(conversionHint, (hint) => {
  if (hint) {
    setTimeout(() => {
      conversionHint.value = null
    }, 3000)
  }
})
</script>

<template>
  <div
    :class="[
      'mld-unit-input',
      error ? 'mld-unit-input--error' : '',
      disabled ? 'mld-unit-input--disabled' : '',
    ]"
  >
    <div class="mld-unit-input__controls">
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :placeholder="placeholder"
        :class="[
          'mld-unit-input__value',
          `mld-unit-input__value--${size}`,
          disabled ? 'mld-unit-input__value--disabled' : '',
        ]"
        aria-label="Value"
        @input="handleValueInput"
      />

      <div class="mld-unit-input__unit">
        <select
          :value="currentUnit"
          :disabled="disabled"
          :class="[
            'mld-unit-input__unit-select',
            `mld-unit-input__unit-select--${size}`,
          ]"
          aria-label="Unit"
          @change="handleUnitChange"
        >
          <template v-if="groupedUnits">
            <template v-if="groupedUnits.ungrouped.length > 0">
              <option
                v-for="u in groupedUnits.ungrouped"
                :key="u.value"
                :value="u.value"
              >
                {{ u.label }}
              </option>
            </template>
            <optgroup
              v-for="[groupLabel, groupUnits] in groupedUnits.groups"
              :key="groupLabel"
              :label="groupLabel"
              class="mld-unit-input__unit-group"
            >
              <option
                v-for="u in groupUnits"
                :key="u.value"
                :value="u.value"
              >
                {{ u.label }}
              </option>
            </optgroup>
          </template>
          <template v-else>
            <option
              v-for="u in units"
              :key="u.value"
              :value="u.value"
            >
              {{ u.label }}
            </option>
          </template>
        </select>
      </div>
    </div>

    <div
      v-if="conversionHint"
      class="mld-unit-input__conversion-hint"
    >
      {{ conversionHint }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/unit-input.css';
</style>
