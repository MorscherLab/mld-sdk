<script setup lang="ts">
import FileUploader from './FileUploader.vue'

const sizes = ['sm', 'md', 'lg'] as const

function handleUpload(files: File[]) {
  console.log('Files uploaded:', files.map(f => f.name))
}

function handleError(message: string) {
  console.error('Upload error:', message)
}
</script>

<template>
  <Story title="Base Inputs/FileUploader">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <FileUploader
            :accept="state.accept || undefined"
            :multiple="state.multiple"
            :max-size="state.useMaxSize ? state.maxSize : undefined"
            :disabled="state.disabled"
            :size="state.size"
            :mode="state.mode"
            @upload="handleUpload"
            @error="handleError"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.accept" title="Accept (e.g. .csv,.xlsx)" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstSelect
          v-model="state.mode"
          title="Mode"
          :options="[
            { label: 'file', value: 'file' },
            { label: 'folder', value: 'folder' },
          ]"
        />
        <HstCheckbox v-model="state.multiple" title="Multiple" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.useMaxSize" title="Limit File Size" />
        <HstSlider v-model="state.maxSize" title="Max Size (bytes)" :min="1024" :max="10485760" :step="1024" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <FileUploader :size="size" @upload="handleUpload" />
        </div>
      </div>
    </Variant>

    <Variant title="CSV Files Only">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <FileUploader
          accept=".csv,.tsv,.txt"
          :max-size="5242880"
          @upload="handleUpload"
          @error="handleError"
        />
      </div>
    </Variant>

    <Variant title="Multiple Image Upload">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <FileUploader
          accept="image/*"
          multiple
          :max-size="10485760"
          @upload="handleUpload"
          @error="handleError"
        />
      </div>
    </Variant>

    <Variant title="Folder Mode">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <FileUploader
          mode="folder"
          @upload="handleUpload"
          @error="handleError"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <FileUploader disabled @upload="handleUpload" />
      </div>
    </Variant>
  </Story>
</template>
