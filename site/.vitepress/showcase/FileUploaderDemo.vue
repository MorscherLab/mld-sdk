<script setup lang="ts">
import { ref } from 'vue'
import { FileUploader } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const uploadedFiles = ref<File[]>([])
const imageFiles = ref<File[]>([])
const folderFiles = ref<File[]>([])

function handleUpload(files: File[]) {
  uploadedFiles.value = files
  console.log('Uploaded:', files)
}

function handleImageUpload(files: File[]) {
  imageFiles.value = files
  console.log('Images:', files)
}

function handleFolderUpload(files: File[]) {
  folderFiles.value = files
  console.log('Folder files:', files)
}

function handleError(message: string) {
  console.error('Upload error:', message)
  alert(message)
}
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-md space-y-2">
      <FileUploader @upload="handleUpload" @error="handleError" />
      <p v-if="uploadedFiles.length" class="text-sm text-text-secondary">
        Uploaded: {{ uploadedFiles.map(f => f.name).join(', ') }}
      </p>
    </div>
  </DemoSection>

  <!-- Folder Mode -->
  <DemoSection title="Folder Mode" description="Select entire folders to upload all files within. Uses webkitdirectory for folder selection.">
    <div class="max-w-md space-y-2">
      <FileUploader
        mode="folder"
        @upload="handleFolderUpload"
        @error="handleError"
      />
      <p v-if="folderFiles.length" class="text-sm text-text-secondary">
        Selected {{ folderFiles.length }} file(s) from folder
      </p>
    </div>
  </DemoSection>

  <!-- Accept Specific Types -->
  <DemoSection title="Accept Specific Types">
    <div class="max-w-md">
      <FileUploader
        accept=".jpg,.jpeg,.png,.gif"
        @upload="handleImageUpload"
        @error="handleError"
      />
      <p class="mt-2 text-xs text-text-muted">Only image files accepted</p>
    </div>
  </DemoSection>

  <!-- Multiple Files with Size Limit -->
  <DemoSection title="Multiple Files with Size Limit">
    <div class="max-w-md">
      <FileUploader
        multiple
        :max-size="5 * 1024 * 1024"
        @upload="(files) => console.log('Multiple:', files)"
        @error="handleError"
      />
      <p class="mt-2 text-xs text-text-muted">Multiple files, max 5MB each</p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-6 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <FileUploader :size="size" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <FileUploader disabled />
      </div>
    </div>
  </DemoSection>
</template>
