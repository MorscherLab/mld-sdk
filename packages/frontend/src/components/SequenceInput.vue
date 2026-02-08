<script setup lang="ts">
import { computed } from 'vue'
import { useSequenceUtils, type SequenceType, type SequenceStats } from '../composables/useSequenceUtils'

interface Props {
  modelValue?: string
  type?: SequenceType
  readonly?: boolean
  showStats?: boolean
  showTools?: boolean
  maxLength?: number
  placeholder?: string
  rows?: number
  error?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'auto',
  readonly: false,
  showStats: true,
  showTools: true,
  rows: 6,
  placeholder: 'Paste or type sequence...',
  error: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  tools?(props: { sequence: string; type: 'dna' | 'rna' | 'protein'; stats: SequenceStats }): unknown
}>()

const { detectSequenceType, validateSequence, reverseComplement, calculateStats, formatFasta } = useSequenceUtils()

const resolvedType = computed<'dna' | 'rna' | 'protein'>(() => {
  if (props.type !== 'auto') return props.type as 'dna' | 'rna' | 'protein'
  if (!props.modelValue) return 'dna'
  return detectSequenceType(props.modelValue)
})

const stats = computed<SequenceStats>(() => {
  if (!props.modelValue) return { length: 0 }
  return calculateStats(props.modelValue, resolvedType.value)
})

const viewerLines = computed(() => {
  if (!props.modelValue) return []
  const formatted = formatFasta(props.modelValue, 60)
  return formatted.split('\n').filter(l => l.length > 0)
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  let value = target.value

  if (props.maxLength && value.length > props.maxLength) {
    value = value.slice(0, props.maxLength)
  }

  // Validate characters
  value = validateSequence(value, resolvedType.value)
  emit('update:modelValue', value)
}

function doReverseComplement() {
  if (!props.modelValue || resolvedType.value === 'protein') return
  emit('update:modelValue', reverseComplement(props.modelValue, resolvedType.value as 'dna' | 'rna'))
}

function doUppercase() {
  if (!props.modelValue) return
  emit('update:modelValue', props.modelValue.toUpperCase())
}

function doClear() {
  emit('update:modelValue', '')
}

function doCopy() {
  if (!props.modelValue) return
  navigator.clipboard.writeText(props.modelValue)
}

function getBaseClass(char: string): string {
  const c = char.toLowerCase()
  if (c === 'a') return 'mld-sequence-input__base--a'
  if (c === 't') return 'mld-sequence-input__base--t'
  if (c === 'u') return 'mld-sequence-input__base--u'
  if (c === 'g') return 'mld-sequence-input__base--g'
  if (c === 'c') return 'mld-sequence-input__base--c'
  if (c === 'n') return 'mld-sequence-input__base--n'
  return ''
}
</script>

<template>
  <div
    :class="[
      'mld-sequence-input',
      error ? 'mld-sequence-input--error' : '',
      disabled ? 'mld-sequence-input--disabled' : '',
    ]"
  >
    <!-- Toolbar -->
    <div v-if="showTools && !readonly" class="mld-sequence-input__toolbar">
      <slot name="tools" :sequence="modelValue || ''" :type="resolvedType" :stats="stats">
        <button
          v-if="resolvedType !== 'protein'"
          type="button"
          class="mld-sequence-input__tool-btn"
          :disabled="!modelValue || disabled"
          @click="doReverseComplement"
        >
          Rev Comp
        </button>
        <button
          type="button"
          class="mld-sequence-input__tool-btn"
          :disabled="!modelValue || disabled"
          @click="doUppercase"
        >
          Uppercase
        </button>
        <div class="mld-sequence-input__tool-sep" />
        <button
          type="button"
          class="mld-sequence-input__tool-btn"
          :disabled="!modelValue || disabled"
          @click="doCopy"
        >
          Copy
        </button>
        <button
          type="button"
          class="mld-sequence-input__tool-btn"
          :disabled="!modelValue || disabled"
          @click="doClear"
        >
          Clear
        </button>
      </slot>

      <span class="mld-sequence-input__type-badge">{{ resolvedType }}</span>
    </div>

    <!-- Editor (input mode) -->
    <div v-if="!readonly" class="mld-sequence-input__editor">
      <textarea
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        class="mld-sequence-input__textarea"
        spellcheck="false"
        autocomplete="off"
        @input="handleInput"
      />
    </div>

    <!-- Viewer (readonly mode) -->
    <div v-else class="mld-sequence-input__viewer">
      <div
        v-for="(line, lineIdx) in viewerLines"
        :key="lineIdx"
        class="mld-sequence-input__viewer-line"
      >
        <span class="mld-sequence-input__line-number">{{ lineIdx * 60 + 1 }}</span>
        <span class="mld-sequence-input__line-content">
          <span
            v-for="(char, charIdx) in line.split('')"
            :key="charIdx"
            :class="getBaseClass(char)"
          >{{ char }}</span>
        </span>
      </div>
      <div v-if="!modelValue" class="mld-sequence-input__viewer-line">
        <span class="mld-sequence-input__line-number" />
        <span class="mld-sequence-input__line-content" style="color: var(--text-muted);">No sequence</span>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="showStats && modelValue" class="mld-sequence-input__stats">
      <span>
        <span class="mld-sequence-input__stat-label">Length:</span>
        <span class="mld-sequence-input__stat-value">{{ stats.length }}</span>
      </span>
      <span v-if="stats.gcPercent !== undefined">
        <span class="mld-sequence-input__stat-label">GC:</span>
        <span class="mld-sequence-input__stat-value">{{ stats.gcPercent.toFixed(1) }}%</span>
      </span>
      <span v-if="stats.molecularWeight !== undefined">
        <span class="mld-sequence-input__stat-label">MW:</span>
        <span class="mld-sequence-input__stat-value">~{{ (stats.molecularWeight / 1000).toFixed(1) }} kDa</span>
      </span>
    </div>
  </div>
</template>

<style>
@import '../styles/components/sequence-input.css';
</style>
