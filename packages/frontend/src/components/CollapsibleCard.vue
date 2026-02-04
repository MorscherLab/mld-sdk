<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  disabled?: boolean
  icon?: string
  iconColor?: string
  iconBg?: string
  showToggle?: boolean
  toggleValue?: boolean
  toggleColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  disabled: false,
  showToggle: false,
  toggleValue: false,
  toggleColor: '',
})

const emit = defineEmits<{
  'update:toggleValue': [value: boolean]
}>()

const isOpen = ref(props.defaultOpen)

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const handleToggleClick = (event: Event) => {
  event.stopPropagation()
  emit('update:toggleValue', !props.toggleValue)
}

const headerClasses = computed(() => [
  'mld-collapsible-card__header',
  props.disabled ? 'mld-collapsible-card__header--disabled' : '',
])

const iconBgStyle = computed(() => {
  if (!props.icon) return {}
  return {
    backgroundColor: props.iconBg || 'var(--color-primary-soft)',
  }
})

const iconColorStyle = computed(() => {
  if (!props.icon) return {}
  return {
    color: props.iconColor || 'var(--color-primary)',
  }
})

const toggleTrackStyle = computed(() => {
  if (!props.toggleValue || !props.toggleColor) return {}
  return {
    backgroundColor: props.toggleColor,
    borderColor: props.toggleColor,
  }
})
</script>

<template>
  <div class="mld-collapsible-card">
    <button
      type="button"
      :class="headerClasses"
      :disabled="disabled"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div class="mld-collapsible-card__title-section">
        <!-- Icon badge -->
        <div v-if="icon" class="mld-collapsible-card__icon-badge" :style="iconBgStyle">
          <svg
            class="mld-collapsible-card__icon"
            :style="iconColorStyle"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="icon"
          />
        </div>

        <div class="mld-collapsible-card__titles">
          <h3 class="mld-collapsible-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="mld-collapsible-card__subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="mld-collapsible-card__actions">
        <!-- Toggle switch -->
        <div
          v-if="showToggle"
          class="mld-collapsible-card__toggle"
          @click="handleToggleClick"
        >
          <div
            role="switch"
            tabindex="0"
            :aria-checked="toggleValue"
            :class="[
              'mld-collapsible-card__toggle-track',
              toggleValue ? 'mld-collapsible-card__toggle-track--on' : '',
            ]"
            :style="toggleTrackStyle"
            @keydown.enter.prevent="handleToggleClick"
            @keydown.space.prevent="handleToggleClick"
          >
            <span
              :class="[
                'mld-collapsible-card__toggle-knob',
                toggleValue ? 'mld-collapsible-card__toggle-knob--on' : '',
              ]"
            />
          </div>
        </div>

        <!-- Chevron -->
        <svg
          :class="[
            'mld-collapsible-card__chevron',
            isOpen ? 'mld-collapsible-card__chevron--open' : '',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <Transition name="collapse">
      <div v-show="isOpen" class="mld-collapsible-card__body">
        <div class="mld-collapsible-card__content">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '../styles/components/collapsible-card.css';
</style>
