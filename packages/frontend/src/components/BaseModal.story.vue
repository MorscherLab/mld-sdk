<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { ModalSize } from '../types'

const modalSizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full']
const galleryOpen = ref<Record<string, boolean>>({
  sm: false,
  md: false,
  lg: false,
  xl: false,
  full: false,
  noClose: false,
  footer: false,
})
</script>

<template>
  <Story title="Base Inputs/BaseModal">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <BaseButton @click="state.open = true">
            Open Modal
          </BaseButton>
          <BaseModal
            v-model="state.open"
            :title="state.title"
            :size="state.size"
            :closable="state.closable"
            :close-on-overlay="state.closeOnOverlay"
            :close-on-escape="state.closeOnEscape"
          >
            <p style="margin: 0; color: var(--text-primary, #e2e8f0);">
              This is the modal body content. You can put any content here.
            </p>
            <template #footer>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <BaseButton variant="secondary" @click="state.open = false">Cancel</BaseButton>
                <BaseButton variant="primary" @click="state.open = false">Confirm</BaseButton>
              </div>
            </template>
          </BaseModal>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="modalSizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.closable" title="Closable" />
        <HstCheckbox v-model="state.closeOnOverlay" title="Close on Overlay" />
        <HstCheckbox v-model="state.closeOnEscape" title="Close on Escape" />
      </template>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <BaseButton
          v-for="size in modalSizes"
          :key="size"
          variant="secondary"
          @click="galleryOpen[size] = true"
        >
          {{ size }}
        </BaseButton>

        <BaseModal
          v-for="size in modalSizes"
          :key="size"
          v-model="galleryOpen[size]"
          :title="`${size.toUpperCase()} Modal`"
          :size="size"
        >
          <p style="margin: 0; color: var(--text-primary, #e2e8f0);">
            This is a <strong>{{ size }}</strong> sized modal.
          </p>
        </BaseModal>
      </div>
    </Variant>

    <Variant title="With Footer">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <BaseButton @click="galleryOpen.footer = true">Open with Footer</BaseButton>
        <BaseModal v-model="galleryOpen.footer" title="Confirm Action" size="sm">
          <p style="margin: 0; color: var(--text-primary, #e2e8f0);">
            Are you sure you want to proceed with this action?
          </p>
          <template #footer>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
              <BaseButton variant="secondary" @click="galleryOpen.footer = false">Cancel</BaseButton>
              <BaseButton variant="danger" @click="galleryOpen.footer = false">Delete</BaseButton>
            </div>
          </template>
        </BaseModal>
      </div>
    </Variant>

    <Variant title="Not Closable">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <BaseButton @click="galleryOpen.noClose = true">Open Non-Closable</BaseButton>
        <BaseModal
          v-model="galleryOpen.noClose"
          title="Processing..."
          size="sm"
          :closable="false"
          :close-on-overlay="false"
          :close-on-escape="false"
        >
          <p style="margin: 0; color: var(--text-primary, #e2e8f0);">
            Please wait while we process your request. This modal cannot be dismissed.
          </p>
          <template #footer>
            <div style="display: flex; justify-content: flex-end;">
              <BaseButton variant="primary" @click="galleryOpen.noClose = false">Force Close (demo)</BaseButton>
            </div>
          </template>
        </BaseModal>
      </div>
    </Variant>
  </Story>
</template>
