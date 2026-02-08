<script setup lang="ts">
import { useChemicalFormula, type FormulaPart } from '../composables/useChemicalFormula'

interface Props {
  modelValue?: string
  showPreview?: boolean
  showMW?: boolean
  placeholder?: string
  error?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  showPreview: true,
  showMW: true,
  placeholder: 'e.g. Ca(OH)2',
  error: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'mw': [mw: number | null]
}>()

const { parseFormula, calculateMW, renderFormulaParts } = useChemicalFormula()

function getParseResult(value: string) {
  if (!value) return null
  return parseFormula(value)
}

function getMW(value: string): number | null {
  const result = getParseResult(value)
  if (!result || !result.valid) return null
  return calculateMW(result.elements)
}

function getParts(value: string): FormulaPart[] {
  if (!value) return []
  return renderFormulaParts(value)
}

function getError(value: string): string | null {
  if (!value) return null
  const result = getParseResult(value)
  if (!result) return null
  if (!result.valid) return result.error || 'Invalid formula'
  return null
}

function formatMW(value: string): string {
  const mw = getMW(value)
  if (mw === null) return ''
  return `${mw.toFixed(2)} g/mol`
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('mw', getMW(target.value))
}
</script>

<template>
  <div
    :class="[
      'mld-formula-input',
      error ? 'mld-formula-input--error' : '',
      disabled ? 'mld-formula-input--disabled' : '',
    ]"
  >
    <div class="mld-formula-input__field">
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'mld-formula-input__input',
          `mld-formula-input__input--${size}`,
        ]"
        aria-label="Chemical formula"
        @input="handleInput"
      />

      <div
        v-if="showPreview && modelValue"
        class="mld-formula-input__preview"
      >
        <template v-for="(part, i) in getParts(modelValue)" :key="i">
          <span v-if="part.type === 'element'">{{ part.text }}</span>
          <span v-else-if="part.type === 'subscript'" style="vertical-align: sub; font-size: 0.75em; line-height: 0;">{{ part.text }}</span>
          <span v-else-if="part.type === 'superscript'" style="vertical-align: super; font-size: 0.75em; line-height: 0;">{{ part.text }}</span>
          <span v-else-if="part.type === 'paren'" style="color: var(--text-secondary);">{{ part.text }}</span>
          <span v-else-if="part.type === 'dot'" style="margin: 0 0.125em; color: var(--text-muted);">{{ part.text }}</span>
          <span v-else-if="part.type === 'charge'" style="vertical-align: super; font-size: 0.75em; line-height: 0;">{{ part.text }}</span>
        </template>
      </div>
    </div>

    <div
      v-if="showMW && modelValue && !getError(modelValue) && getMW(modelValue) !== null"
      class="mld-formula-input__mw"
    >
      {{ formatMW(modelValue) }}
    </div>

    <div
      v-if="modelValue && getError(modelValue)"
      class="mld-formula-input__error-text"
    >
      {{ getError(modelValue) }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/formula-input.css';
</style>
