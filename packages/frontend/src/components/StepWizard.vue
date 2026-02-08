<script setup lang="ts">
import { ref, computed } from 'vue'

interface WizardStep {
  id: string
  label: string
  description?: string
  icon?: string
  optional?: boolean
}

type WizardStepState = 'pending' | 'active' | 'completed' | 'disabled'

interface Props {
  steps: WizardStep[]
  modelValue?: number
  linear?: boolean
  showProgress?: boolean
  showStepNumbers?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  linear: true,
  showProgress: true,
  showStepNumbers: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [index: number]
  'complete': []
  'cancel': []
  'step-change': [change: [from: number, to: number]]
}>()

const stepValidity = ref<boolean[]>([])

// Initialize validity for all steps to true
if (stepValidity.value.length === 0) {
  stepValidity.value = props.steps.map(() => true)
}

const stepStates = computed<WizardStepState[]>(() => {
  return props.steps.map((_, index) => {
    if (index === props.modelValue) return 'active'
    if (index < props.modelValue && stepValidity.value[index] !== false) return 'completed'
    if (index > props.modelValue && props.linear) {
      for (let i = props.modelValue; i < index; i++) {
        if (stepValidity.value[i] === false) return 'disabled'
      }
    }
    return 'pending'
  })
})

function setStepValid(index: number, valid: boolean) {
  if (index >= 0 && index < props.steps.length) {
    stepValidity.value[index] = valid
  }
}

function goToStep(index: number) {
  if (index < 0 || index >= props.steps.length) return
  if (stepStates.value[index] === 'disabled') return

  if (props.linear && index > props.modelValue) {
    for (let i = props.modelValue; i < index; i++) {
      if (stepValidity.value[i] === false) return
    }
  }

  const from = props.modelValue
  emit('step-change', [from, index])
  emit('update:modelValue', index)
}

function goNext() {
  if (stepValidity.value[props.modelValue] === false) return
  if (props.modelValue < props.steps.length - 1) {
    goToStep(props.modelValue + 1)
  }
}

function goBack() {
  if (props.modelValue > 0) {
    goToStep(props.modelValue - 1)
  }
}

function finish() {
  if (stepValidity.value[props.modelValue] === false) return
  if (props.modelValue === props.steps.length - 1) {
    emit('complete')
  }
}

function cancel() {
  emit('cancel')
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      goBack()
      break
    case 'ArrowRight':
      event.preventDefault()
      goNext()
      break
    case 'Escape':
      cancel()
      break
  }
}

defineExpose({ setStepValid })
</script>

<template>
  <div
    :class="['mld-wizard', `mld-wizard--${props.size}`]"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <!-- Progress indicator -->
    <div v-if="props.showProgress" class="mld-wizard__progress">
      <slot name="progress" :steps="props.steps" :current="props.modelValue" :states="stepStates">
        <div class="mld-wizard__steps-indicator">
          <template v-for="(step, index) in props.steps" :key="step.id">
            <!-- Connector line (before each step except first) -->
            <div
              v-if="index > 0"
              :class="[
                'mld-wizard__step-connector',
                stepStates[index - 1] === 'completed' ? 'mld-wizard__step-connector--completed' : '',
              ]"
            />
            <!-- Step indicator -->
            <div
              :class="[
                'mld-wizard__step-indicator',
                `mld-wizard__step-indicator--${stepStates[index]}`,
              ]"
              @click="goToStep(index)"
            >
              <div class="mld-wizard__step-dot">
                <template v-if="stepStates[index] === 'completed'">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </template>
                <template v-else-if="props.showStepNumbers">
                  {{ index + 1 }}
                </template>
              </div>
              <div class="mld-wizard__step-label">{{ step.label }}</div>
            </div>
          </template>
        </div>
      </slot>
    </div>

    <!-- Step content -->
    <div class="mld-wizard__body">
      <div
        v-for="(step, index) in props.steps"
        :key="step.id"
        v-show="index === props.modelValue"
        class="mld-wizard__step-content"
      >
        <slot :name="`step-${step.id}`" :step="step" :index="index" />
      </div>
    </div>

    <!-- Navigation -->
    <div class="mld-wizard__navigation">
      <slot
        name="navigation"
        :go-back="goBack"
        :go-next="goNext"
        :finish="finish"
        :cancel="cancel"
        :is-first="props.modelValue === 0"
        :is-last="props.modelValue === props.steps.length - 1"
        :can-proceed="stepValidity[props.modelValue] !== false"
      >
        <button
          type="button"
          class="mld-wizard__nav-btn mld-wizard__nav-btn--cancel"
          @click="cancel"
        >
          Cancel
        </button>
        <div style="flex: 1" />
        <button
          type="button"
          class="mld-wizard__nav-btn mld-wizard__nav-btn--back"
          :disabled="props.modelValue === 0"
          @click="goBack"
        >
          Back
        </button>
        <button
          v-if="props.modelValue < props.steps.length - 1"
          type="button"
          class="mld-wizard__nav-btn mld-wizard__nav-btn--next"
          :disabled="stepValidity[props.modelValue] === false"
          @click="goNext"
        >
          Next
        </button>
        <button
          v-else
          type="button"
          class="mld-wizard__nav-btn mld-wizard__nav-btn--finish"
          :disabled="stepValidity[props.modelValue] === false"
          @click="finish"
        >
          Finish
        </button>
      </slot>
    </div>
  </div>
</template>

<style>
@import '../styles/components/step-wizard.css';
</style>
