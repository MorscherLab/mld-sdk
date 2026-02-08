<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmDialog, BaseButton } from '@morscherlab/mld-sdk'

const showDanger = ref(false)
const showWarning = ref(false)
const showInfo = ref(false)
const showLoading = ref(false)
const loading = ref(false)
const showCustom = ref(false)

function handleLoadingConfirm() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showLoading.value = false
  }, 2000)
}
</script>

<template>
  <!-- Variants -->
  <DemoSection title="Variants">
    <div class="flex gap-4 items-center">
      <BaseButton variant="danger" @click="showDanger = true">Danger</BaseButton>
      <BaseButton variant="secondary" @click="showWarning = true">Warning</BaseButton>
      <BaseButton variant="secondary" @click="showInfo = true">Info</BaseButton>
    </div>

    <ConfirmDialog
      v-model="showDanger"
      title="Delete Experiment"
      message="This will permanently delete EXP-001 and all associated data. This action cannot be undone."
      variant="danger"
      @confirm="showDanger = false"
    />

    <ConfirmDialog
      v-model="showWarning"
      title="Override Results"
      message="Existing results will be overwritten. You may want to export them first."
      variant="warning"
      @confirm="showWarning = false"
    />

    <ConfirmDialog
      v-model="showInfo"
      title="Run Analysis"
      message="This analysis may take several minutes to complete. You will be notified when it finishes."
      variant="info"
      @confirm="showInfo = false"
    />
  </DemoSection>

  <!-- With Loading -->
  <DemoSection title="With Loading">
    <p class="text-sm text-text-secondary mb-4">
      Simulates a 2-second async operation before closing
    </p>
    <BaseButton variant="danger" @click="showLoading = true">Delete with Loading</BaseButton>

    <ConfirmDialog
      v-model="showLoading"
      title="Delete Item"
      message="Are you sure you want to delete this item?"
      variant="danger"
      confirm-label="Delete"
      :loading="loading"
      @confirm="handleLoadingConfirm"
    />
  </DemoSection>

  <!-- Custom Labels -->
  <DemoSection title="Custom Labels">
    <BaseButton variant="danger" @click="showCustom = true">Delete with Custom Labels</BaseButton>

    <ConfirmDialog
      v-model="showCustom"
      title="Delete Project"
      message="This project and all its experiments will be permanently removed."
      variant="danger"
      confirm-label="Yes, delete it"
      cancel-label="No, keep it"
      @confirm="showCustom = false"
    />
  </DemoSection>
</template>
