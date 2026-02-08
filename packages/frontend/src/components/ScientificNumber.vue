<script setup lang="ts">
import { computed, ref } from 'vue'

type NumberNotation = 'auto' | 'scientific' | 'engineering' | 'compact'

interface Props {
  value: number
  precision?: number
  notation?: NumberNotation
  unit?: string
  copyable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  precision: 3,
  notation: 'auto',
  copyable: false,
})

const copied = ref(false)

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00B9',
  '2': '\u00B2',
  '3': '\u00B3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
  '-': '\u207B',
}

const SI_SUFFIXES: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'G'],
  [1e6, 'M'],
  [1e3, 'k'],
  [1e-3, 'm'],
  [1e-6, '\u00B5'],
  [1e-9, 'n'],
  [1e-12, 'p'],
]

function toSuperscript(exp: number): string {
  return String(exp)
    .split('')
    .map(ch => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join('')
}

function roundToPrecision(n: number, digits: number): string {
  return n.toFixed(digits).replace(/\.?0+$/, '') || '0'
}

interface FormattedNumber {
  type: 'plain' | 'scientific' | 'compact'
  mantissa?: string
  exponent?: number
  exponentStr?: string
  plain?: string
  suffix?: string
}

const formatted = computed<FormattedNumber>(() => {
  const v = props.value

  if (!Number.isFinite(v)) return { type: 'plain', plain: '' }
  if (v === 0) return { type: 'plain', plain: '0' }

  const absV = Math.abs(v)

  if (props.notation === 'compact') {
    for (const [threshold, suffix] of SI_SUFFIXES) {
      if (absV >= threshold * 0.999) {
        return {
          type: 'compact',
          plain: roundToPrecision(v / threshold, props.precision),
          suffix,
        }
      }
    }
    return { type: 'plain', plain: roundToPrecision(v, props.precision) }
  }

  const useScientific =
    props.notation === 'scientific' ||
    props.notation === 'engineering' ||
    (props.notation === 'auto' && (absV < 0.01 || absV >= 10000))

  if (!useScientific) {
    return { type: 'plain', plain: roundToPrecision(v, props.precision) }
  }

  let exp = Math.floor(Math.log10(absV))

  if (props.notation === 'engineering') {
    exp = Math.floor(exp / 3) * 3
  }

  const mantissa = v / Math.pow(10, exp)
  const mantissaStr = roundToPrecision(mantissa, props.precision)

  return {
    type: 'scientific',
    mantissa: mantissaStr,
    exponent: exp,
    exponentStr: toSuperscript(exp),
  }
})

const specialDisplay = computed(() => {
  if (Number.isNaN(props.value)) return 'NaN'
  if (props.value === Infinity) return '\u221E'
  if (props.value === -Infinity) return '-\u221E'
  return null
})

const plainTextValue = computed(() => {
  if (specialDisplay.value) return specialDisplay.value
  const f = formatted.value
  let text: string
  if (f.type === 'scientific') {
    text = `${f.mantissa}e${f.exponent}`
  } else if (f.type === 'compact') {
    text = `${f.plain}${f.suffix ?? ''}`
  } else {
    text = f.plain ?? '0'
  }
  if (props.unit) text += ` ${props.unit}`
  return text
})

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(plainTextValue.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch {
    // clipboard not available
  }
}
</script>

<template>
  <span class="mld-sci-number">
    <!-- Special values: NaN, Infinity -->
    <template v-if="specialDisplay">
      <span class="mld-sci-number__plain">{{ specialDisplay }}</span>
    </template>

    <!-- Scientific / Engineering notation -->
    <template v-else-if="formatted.type === 'scientific'">
      <span class="mld-sci-number__mantissa">{{ formatted.mantissa }}</span>
      <span class="mld-sci-number__times">&times;</span>
      <span class="mld-sci-number__base">10</span>
      <span class="mld-sci-number__exponent">{{ formatted.exponentStr }}</span>
    </template>

    <!-- Compact notation with SI suffix -->
    <template v-else-if="formatted.type === 'compact'">
      <span class="mld-sci-number__plain">{{ formatted.plain }}</span>
      <span v-if="formatted.suffix" class="mld-sci-number__suffix">{{ formatted.suffix }}</span>
    </template>

    <!-- Plain number -->
    <template v-else>
      <span class="mld-sci-number__plain">{{ formatted.plain }}</span>
    </template>

    <!-- Unit -->
    <span v-if="unit" class="mld-sci-number__unit">{{ unit }}</span>

    <!-- Copy button -->
    <button
      v-if="copyable"
      :class="['mld-sci-number__copy-btn', { 'mld-sci-number__copy-btn--copied': copied }]"
      type="button"
      :title="copied ? 'Copied!' : 'Copy value'"
      @click.stop="copyToClipboard"
    >
      <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  </span>
</template>

<style>
@import '../styles/components/scientific-number.css';
</style>
