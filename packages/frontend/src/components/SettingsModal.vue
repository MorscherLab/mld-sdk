<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useSettingsStore, colorPalettes } from '../stores/settings'
import type { ThemeMode, ColorPalette, TableDensity } from '../types'

export interface SettingsTab {
  id: string
  label: string
  icon?: string
}

interface Props {
  modelValue: boolean
  title?: string
  tabs?: SettingsTab[]
  showAppearance?: boolean
  size?: 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Settings',
  tabs: () => [],
  showAppearance: true,
  size: 'lg',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const settings = useSettingsStore()

const allTabs = computed<SettingsTab[]>(() =>
  props.showAppearance
    ? [...props.tabs, { id: 'appearance', label: 'Appearance' }]
    : props.tabs
)

const activeTab = ref(allTabs.value[0]?.id || 'appearance')

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const densityOptions: { value: TableDensity; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'comfortable', label: 'Comfortable' },
]

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    :size="size"
    @update:model-value="emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="mld-settings-modal">
      <!-- Tabs -->
      <div v-if="allTabs.length > 1" class="mld-settings-modal__tabs">
        <button
          v-for="tab in allTabs"
          :key="tab.id"
          type="button"
          :class="['mld-settings-modal__tab', { 'mld-settings-modal__tab--active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Custom tab content -->
      <div class="mld-settings-modal__content">
        <template v-for="tab in tabs" :key="tab.id">
          <div v-show="activeTab === tab.id">
            <slot :name="`tab-${tab.id}`" />
          </div>
        </template>

        <!-- Built-in appearance tab -->
        <div v-if="showAppearance" v-show="activeTab === 'appearance'">
          <!-- Theme -->
          <div class="mld-settings-modal__section">
            <div class="mld-settings-modal__section-label">Theme</div>
            <div class="mld-settings-modal__option-group">
              <button
                v-for="opt in themeOptions"
                :key="opt.value"
                type="button"
                :class="['mld-settings-modal__option-btn', { 'mld-settings-modal__option-btn--active': settings.theme === opt.value }]"
                @click="settings.theme = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Color palette -->
          <div class="mld-settings-modal__section">
            <div class="mld-settings-modal__section-label">Color Palette</div>
            <div class="mld-settings-modal__option-group">
              <button
                v-for="(palette, key) in colorPalettes"
                :key="key"
                type="button"
                :class="['mld-settings-modal__option-btn', { 'mld-settings-modal__option-btn--active': settings.colorPalette === key }]"
                @click="settings.colorPalette = key as ColorPalette"
              >
                {{ palette.name }}
              </button>
            </div>
          </div>

          <!-- Table density -->
          <div class="mld-settings-modal__section">
            <div class="mld-settings-modal__section-label">Table Density</div>
            <div class="mld-settings-modal__option-group">
              <button
                v-for="opt in densityOptions"
                :key="opt.value"
                type="button"
                :class="['mld-settings-modal__option-btn', { 'mld-settings-modal__option-btn--active': settings.tableDensity === opt.value }]"
                @click="settings.tableDensity = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
            <p class="mld-settings-modal__note">Adjusts row height in data tables.</p>
          </div>

          <slot name="appearance" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style>
@import '../styles/components/settings-modal.css';
</style>
