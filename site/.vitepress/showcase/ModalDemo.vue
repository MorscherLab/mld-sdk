<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseButton, FormField, BaseInput, type ModalSize } from '@morscherlab/mld-sdk'

const sizes: ModalSize[] = ['sm', 'md', 'lg', 'xl', 'full']

const basicModal = ref(false)
const sizeModalOpen = ref(false)
const sizeModalSize = ref<ModalSize>('md')
const footerModal = ref(false)
const nonClosableModal = ref(false)
const formModal = ref(false)

function openSizeModal(size: ModalSize) {
  sizeModalSize.value = size
  sizeModalOpen.value = true
}

const formName = ref('')
const formEmail = ref('')
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Modal">
    <BaseButton @click="basicModal = true">Open Basic Modal</BaseButton>

    <BaseModal v-model="basicModal" title="Basic Modal">
      <p class="text-text-secondary">
        This is a basic modal with a title and close button.
        Click outside or press Escape to close.
      </p>
    </BaseModal>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Modal Sizes">
    <div class="demo-grid">
      <BaseButton
        v-for="size in sizes"
        :key="size"
        variant="secondary"
        @click="openSizeModal(size)"
      >
        {{ size.toUpperCase() }}
      </BaseButton>
    </div>

    <BaseModal
      v-model="sizeModalOpen"
      :title="`Size: ${sizeModalSize.toUpperCase()}`"
      :size="sizeModalSize"
    >
      <p class="text-text-secondary mb-4">
        This modal has size <code class="text-mld-primary">{{ sizeModalSize }}</code>.
      </p>
      <div class="text-sm text-text-muted">
        <p>sm: max-w-sm (384px)</p>
        <p>md: max-w-md (448px)</p>
        <p>lg: max-w-lg (512px)</p>
        <p>xl: max-w-xl (576px)</p>
        <p>full: max-w-4xl (896px)</p>
      </div>
    </BaseModal>
  </DemoSection>

  <!-- With Footer -->
  <DemoSection title="With Footer Slot">
    <BaseButton @click="footerModal = true">Open Modal with Footer</BaseButton>

    <BaseModal v-model="footerModal" title="Confirm Action" size="sm">
      <p class="text-text-secondary">
        Are you sure you want to proceed with this action?
        This cannot be undone.
      </p>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="footerModal = false">Cancel</BaseButton>
          <BaseButton variant="danger" @click="footerModal = false">Delete</BaseButton>
        </div>
      </template>
    </BaseModal>
  </DemoSection>

  <!-- Form Modal -->
  <DemoSection title="Form in Modal">
    <BaseButton variant="cta" @click="formModal = true">Open Form Modal</BaseButton>

    <BaseModal v-model="formModal" title="Create New Item" size="md">
      <div class="space-y-4">
        <FormField label="Name" required>
          <BaseInput v-model="formName" placeholder="Enter name" />
        </FormField>
        <FormField label="Email" required hint="We'll send a confirmation to this address">
          <BaseInput v-model="formEmail" type="email" placeholder="Enter email" />
        </FormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="ghost" @click="formModal = false">Cancel</BaseButton>
          <BaseButton variant="primary" @click="formModal = false">Create</BaseButton>
        </div>
      </template>
    </BaseModal>
  </DemoSection>

  <!-- Non-closable Modal -->
  <DemoSection title="Non-closable Modal">
    <p class="text-sm text-text-secondary mb-4">
      Modal that can only be closed via the action buttons
    </p>
    <BaseButton variant="secondary" @click="nonClosableModal = true">
      Open Non-closable Modal
    </BaseButton>

    <BaseModal
      v-model="nonClosableModal"
      title="Processing..."
      :closable="false"
      :close-on-overlay="false"
      :close-on-escape="false"
      size="sm"
    >
      <p class="text-text-secondary mb-4">
        This modal cannot be closed by clicking outside, pressing Escape,
        or the X button.
      </p>
      <BaseButton variant="primary" full-width @click="nonClosableModal = false">
        Close Modal
      </BaseButton>
    </BaseModal>
  </DemoSection>
</template>
