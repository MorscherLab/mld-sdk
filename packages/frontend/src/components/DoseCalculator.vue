<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ConcentrationInput from './ConcentrationInput.vue'
import {
  useConcentrationUnits,
  type ConcentrationValue,
} from '../composables/useConcentrationUnits'
import {
  useDoseCalculator,
  type VolumeValue,
  type VolumeUnit,
  type DilutionResult,
  type SerialDilutionResult,
  type WellConcentration,
} from '../composables/useDoseCalculator'

type CalculatorMode = 'dilution' | 'serial' | 'conversion'

interface Props {
  mode?: CalculatorMode | 'auto'
  molecularWeight?: number
  targetWells?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'auto',
  disabled: false,
})

const emit = defineEmits<{
  'apply-to-wells': [results: WellConcentration[]]
  'calculate': [result: DilutionResult | SerialDilutionResult]
}>()

const { formatWithUnit } = useConcentrationUnits()
const {
  volumeUnits,
  calculateDilution,
  calculateSerialDilution,
  formatVolume,
  generateWellConcentrations,
} = useDoseCalculator()

// Active mode (for tabbed interface)
const activeMode = ref<CalculatorMode>(props.mode === 'auto' ? 'dilution' : props.mode)

// Dilution form state
const stockConcentration = ref<ConcentrationValue>({ value: 10, unit: 'mM' })
const finalConcentration = ref<ConcentrationValue>({ value: 100, unit: 'µM' })
const finalVolume = ref<VolumeValue>({ value: 1, unit: 'mL' })

// Serial dilution form state
const serialStartConcentration = ref<ConcentrationValue>({ value: 100, unit: 'µM' })
const serialDilutionFactor = ref(3)
const serialNumberOfDilutions = ref(8)
const serialVolumePerWell = ref<VolumeValue>({ value: 100, unit: 'µL' })

// Results
const dilutionResult = ref<DilutionResult | null>(null)
const serialResult = ref<SerialDilutionResult | null>(null)

// Computed
const showTabs = computed(() => props.mode === 'auto')

const hasTargetWells = computed(() => {
  return props.targetWells && props.targetWells.length > 0
})

const canApplyToWells = computed(() => {
  if (!hasTargetWells.value) return false
  if (activeMode.value === 'serial' && serialResult.value?.valid) return true
  if (activeMode.value === 'dilution' && dilutionResult.value?.valid) return true
  return false
})

// Calculate dilution result
function recalculateDilution() {
  if (!stockConcentration.value || !finalConcentration.value || !finalVolume.value) {
    dilutionResult.value = null
    return
  }

  dilutionResult.value = calculateDilution({
    stockConcentration: stockConcentration.value,
    finalConcentration: finalConcentration.value,
    finalVolume: finalVolume.value,
  })

  if (dilutionResult.value.valid) {
    emit('calculate', dilutionResult.value)
  }
}

// Calculate serial dilution result
function recalculateSerial() {
  if (
    !serialStartConcentration.value ||
    serialDilutionFactor.value <= 1 ||
    serialNumberOfDilutions.value < 1 ||
    !serialVolumePerWell.value
  ) {
    serialResult.value = null
    return
  }

  serialResult.value = calculateSerialDilution({
    startingConcentration: serialStartConcentration.value,
    dilutionFactor: serialDilutionFactor.value,
    numberOfDilutions: serialNumberOfDilutions.value,
    volumePerWell: serialVolumePerWell.value,
  })

  if (serialResult.value.valid) {
    emit('calculate', serialResult.value)
  }
}

// Apply to wells
function handleApplyToWells() {
  if (!props.targetWells || props.targetWells.length === 0) return

  if (activeMode.value === 'serial' && serialResult.value?.valid) {
    const wellConcentrations = generateWellConcentrations(
      serialResult.value,
      props.targetWells
    )
    emit('apply-to-wells', wellConcentrations)
  }

  if (activeMode.value === 'dilution' && dilutionResult.value?.valid) {
    // For simple dilution, apply same concentration to all wells
    const wellConcentrations: WellConcentration[] = props.targetWells.map(wellId => ({
      wellId,
      concentration: finalConcentration.value,
      volume: finalVolume.value,
    }))
    emit('apply-to-wells', wellConcentrations)
  }
}

// Volume unit change handler
function handleVolumeChange(event: Event, target: 'final' | 'serial') {
  const input = event.target as HTMLInputElement
  const value = parseFloat(input.value)
  if (isNaN(value)) return

  if (target === 'final') {
    finalVolume.value = { ...finalVolume.value, value }
  } else {
    serialVolumePerWell.value = { ...serialVolumePerWell.value, value }
  }
}

function handleVolumeUnitChange(event: Event, target: 'final' | 'serial') {
  const select = event.target as HTMLSelectElement
  const unit = select.value as VolumeUnit

  if (target === 'final') {
    finalVolume.value = { ...finalVolume.value, unit }
  } else {
    serialVolumePerWell.value = { ...serialVolumePerWell.value, unit }
  }
}

// Watch for changes and recalculate
watch(
  [stockConcentration, finalConcentration, finalVolume],
  () => {
    if (activeMode.value === 'dilution') {
      recalculateDilution()
    }
  },
  { deep: true, immediate: true }
)

watch(
  [serialStartConcentration, serialDilutionFactor, serialNumberOfDilutions, serialVolumePerWell],
  () => {
    if (activeMode.value === 'serial') {
      recalculateSerial()
    }
  },
  { deep: true, immediate: true }
)

watch(activeMode, (mode) => {
  if (mode === 'dilution') {
    recalculateDilution()
  } else if (mode === 'serial') {
    recalculateSerial()
  }
})
</script>

<template>
  <div
    :class="[
      'mld-dose-calculator',
      disabled ? 'mld-dose-calculator--disabled' : '',
    ]"
  >
    <!-- Tabs -->
    <div v-if="showTabs" class="mld-dose-calculator__tabs" role="tablist">
      <button
        type="button"
        :class="[
          'mld-dose-calculator__tab',
          activeMode === 'dilution' ? 'mld-dose-calculator__tab--active' : '',
        ]"
        role="tab"
        :aria-selected="activeMode === 'dilution'"
        @click="activeMode = 'dilution'"
      >
        Dilution
      </button>
      <button
        type="button"
        :class="[
          'mld-dose-calculator__tab',
          activeMode === 'serial' ? 'mld-dose-calculator__tab--active' : '',
        ]"
        role="tab"
        :aria-selected="activeMode === 'serial'"
        @click="activeMode = 'serial'"
      >
        Serial
      </button>
      <button
        type="button"
        :class="[
          'mld-dose-calculator__tab',
          activeMode === 'conversion' ? 'mld-dose-calculator__tab--active' : '',
        ]"
        role="tab"
        :aria-selected="activeMode === 'conversion'"
        @click="activeMode = 'conversion'"
      >
        Conversion
      </button>
    </div>

    <!-- Dilution form -->
    <div
      v-if="activeMode === 'dilution'"
      class="mld-dose-calculator__form"
      role="tabpanel"
    >
      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Stock Concentration</label>
        <ConcentrationInput
          v-model="stockConcentration"
          :disabled="disabled"
          :show-conversion="false"
          size="md"
        />
      </div>

      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Final Concentration</label>
        <ConcentrationInput
          v-model="finalConcentration"
          :disabled="disabled"
          :show-conversion="false"
          size="md"
        />
      </div>

      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Final Volume</label>
        <div class="mld-dose-calculator__field-row">
          <input
            type="number"
            :value="finalVolume.value"
            :disabled="disabled"
            class="mld-dose-calculator__input"
            min="0"
            step="any"
            @input="handleVolumeChange($event, 'final')"
          />
          <select
            :value="finalVolume.unit"
            :disabled="disabled"
            class="mld-dose-calculator__select"
            @change="handleVolumeUnitChange($event, 'final')"
          >
            <option v-for="unit in volumeUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>

      <div class="mld-dose-calculator__divider" />

      <!-- Dilution Result -->
      <div v-if="dilutionResult?.valid" class="mld-dose-calculator__result">
        <div class="mld-dose-calculator__result-title">Result</div>
        <div class="mld-dose-calculator__result-row">
          <span class="mld-dose-calculator__result-label">Stock volume</span>
          <span class="mld-dose-calculator__result-value">
            {{ formatVolume(dilutionResult.stockVolume) }}
          </span>
        </div>
        <div class="mld-dose-calculator__result-row">
          <span class="mld-dose-calculator__result-label">Diluent volume</span>
          <span class="mld-dose-calculator__result-value">
            {{ formatVolume(dilutionResult.diluentVolume) }}
          </span>
        </div>
        <div class="mld-dose-calculator__result-row">
          <span class="mld-dose-calculator__result-label">Dilution factor</span>
          <span class="mld-dose-calculator__result-value">
            {{ dilutionResult.dilutionFactor.toFixed(1) }}×
          </span>
        </div>
      </div>

      <div v-else-if="dilutionResult?.error" class="mld-dose-calculator__error">
        {{ dilutionResult.error }}
      </div>
    </div>

    <!-- Serial Dilution form -->
    <div
      v-else-if="activeMode === 'serial'"
      class="mld-dose-calculator__form"
      role="tabpanel"
    >
      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Starting Concentration</label>
        <ConcentrationInput
          v-model="serialStartConcentration"
          :disabled="disabled"
          :show-conversion="false"
          size="md"
        />
      </div>

      <div class="mld-dose-calculator__field-row">
        <div class="mld-dose-calculator__field">
          <label class="mld-dose-calculator__field-label">Dilution Factor</label>
          <div class="mld-dose-calculator__input-wrapper">
            <input
              v-model.number="serialDilutionFactor"
              type="number"
              :disabled="disabled"
              class="mld-dose-calculator__input"
              min="1.1"
              step="0.1"
            />
            <span class="mld-dose-calculator__unit-suffix">×</span>
          </div>
        </div>

        <div class="mld-dose-calculator__field">
          <label class="mld-dose-calculator__field-label">Dilutions</label>
          <input
            v-model.number="serialNumberOfDilutions"
            type="number"
            :disabled="disabled"
            class="mld-dose-calculator__input"
            min="1"
            max="24"
          />
        </div>
      </div>

      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Volume per Well</label>
        <div class="mld-dose-calculator__field-row">
          <input
            type="number"
            :value="serialVolumePerWell.value"
            :disabled="disabled"
            class="mld-dose-calculator__input"
            min="0"
            step="any"
            @input="handleVolumeChange($event, 'serial')"
          />
          <select
            :value="serialVolumePerWell.unit"
            :disabled="disabled"
            class="mld-dose-calculator__select"
            @change="handleVolumeUnitChange($event, 'serial')"
          >
            <option v-for="unit in volumeUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
        </div>
      </div>

      <div class="mld-dose-calculator__divider" />

      <!-- Serial Preview -->
      <div v-if="serialResult?.valid" class="mld-dose-calculator__preview">
        <div class="mld-dose-calculator__preview-title">Preview</div>
        <div class="mld-dose-calculator__preview-steps">
          <template v-for="(step, index) in serialResult.steps" :key="step.stepNumber">
            <div class="mld-dose-calculator__preview-step">
              <span class="mld-dose-calculator__preview-step-num">{{ step.stepNumber }}:</span>
              <span class="mld-dose-calculator__preview-step-conc">
                {{ formatWithUnit(step.concentration, 3) }}
              </span>
            </div>
            <span
              v-if="index < serialResult.steps.length - 1"
              class="mld-dose-calculator__preview-arrow"
            >
              →
            </span>
          </template>
        </div>
      </div>

      <div v-else-if="serialResult?.error" class="mld-dose-calculator__error">
        {{ serialResult.error }}
      </div>
    </div>

    <!-- Conversion form -->
    <div
      v-else-if="activeMode === 'conversion'"
      class="mld-dose-calculator__form"
      role="tabpanel"
    >
      <div class="mld-dose-calculator__field">
        <label class="mld-dose-calculator__field-label">Input Concentration</label>
        <ConcentrationInput
          :disabled="disabled"
          :molecular-weight="molecularWeight"
          :show-conversion="true"
          size="md"
        />
      </div>

      <div
        v-if="!molecularWeight"
        class="mld-dose-calculator__error"
      >
        Provide molecular weight for mass ↔ molarity conversion
      </div>
    </div>

    <!-- Molecular weight section (shown if needed) -->
    <div
      v-if="molecularWeight"
      class="mld-dose-calculator__mw-section"
    >
      <span class="mld-dose-calculator__mw-label">
        Molecular Weight: {{ molecularWeight }} g/mol
      </span>
    </div>

    <!-- Apply to wells button -->
    <div v-if="hasTargetWells" class="mld-dose-calculator__form">
      <button
        type="button"
        class="mld-dose-calculator__apply-btn"
        :disabled="!canApplyToWells || disabled"
        @click="handleApplyToWells"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Apply to {{ targetWells?.length }} selected well{{ targetWells?.length === 1 ? '' : 's' }}
      </button>
    </div>
  </div>
</template>

<style>
@import '../styles/components/dose-calculator.css';
</style>
