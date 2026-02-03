<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  upload: [files: File[]]
  error: [message: string]
}>()

const isDragOver = ref(false)
const inputRef = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])

const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { padding: 'py-4 px-4', icon: 'w-8 h-8', text: 'text-sm', subtext: 'text-xs' }
    case 'lg': return { padding: 'py-10 px-8', icon: 'w-14 h-14', text: 'text-lg', subtext: 'text-base' }
    default: return { padding: 'py-8 px-6', icon: 'w-12 h-12', text: 'text-base', subtext: 'text-sm' }
  }
})

const acceptLabel = computed(() => {
  if (!props.accept) return 'any file'
  return props.accept.split(',').map(a => a.trim().replace('.', '').toUpperCase()).join(', ')
})

const maxSizeLabel = computed(() => {
  if (!props.maxSize) return null
  if (props.maxSize >= 1024 * 1024 * 1024) {
    return `${(props.maxSize / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
  if (props.maxSize >= 1024 * 1024) {
    return `${(props.maxSize / (1024 * 1024)).toFixed(1)} MB`
  }
  if (props.maxSize >= 1024) {
    return `${(props.maxSize / 1024).toFixed(1)} KB`
  }
  return `${props.maxSize} bytes`
})

function validateFiles(files: FileList | File[]): File[] {
  const validFiles: File[] = []

  for (const file of Array.from(files)) {
    if (props.maxSize && file.size > props.maxSize) {
      emit('error', `File "${file.name}" exceeds maximum size of ${maxSizeLabel.value}`)
      continue
    }

    if (props.accept) {
      const acceptedTypes = props.accept.split(',').map(t => t.trim().toLowerCase())
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      const fileType = file.type.toLowerCase()

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExt === type
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', '/'))
        }
        return fileType === type
      })

      if (!isAccepted) {
        emit('error', `File "${file.name}" is not an accepted file type`)
        continue
      }
    }

    validFiles.push(file)
  }

  return validFiles
}

function handleFiles(files: FileList | File[]) {
  const validFiles = validateFiles(files)
  if (validFiles.length === 0) return

  if (!props.multiple) {
    selectedFiles.value = [validFiles[0]]
    emit('upload', [validFiles[0]])
  } else {
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    emit('upload', validFiles)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  if (props.disabled) return
  if (event.dataTransfer?.files) {
    handleFiles(event.dataTransfer.files)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (!props.disabled) {
    isDragOver.value = true
  }
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
  target.value = ''
}

function openFilePicker() {
  if (!props.disabled) {
    inputRef.value?.click()
  }
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} bytes`
}
</script>

<template>
  <div class="mld-file-uploader">
    <div
      role="button"
      tabindex="0"
      :aria-label="disabled ? 'File upload disabled' : 'Click or drag files to upload'"
      :aria-disabled="disabled"
      :class="[
        'mld-file-uploader__dropzone',
        `mld-file-uploader__dropzone--${size}`,
        isDragOver ? 'mld-file-uploader__dropzone--dragover' : '',
        disabled ? 'mld-file-uploader__dropzone--disabled' : '',
      ]"
      @click="openFilePicker"
      @keydown.enter="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="mld-file-uploader__input"
        @change="handleInputChange"
      />

      <div class="mld-file-uploader__content">
        <svg
          :class="['mld-file-uploader__icon', `mld-file-uploader__icon--${size}`]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        <p :class="['mld-file-uploader__text', `mld-file-uploader__text--${size}`]">
          <span class="mld-file-uploader__highlight">Click to upload</span>
          <span> or drag and drop</span>
        </p>

        <p :class="['mld-file-uploader__hint', `mld-file-uploader__hint--${size}`]">
          {{ acceptLabel }}{{ maxSizeLabel ? ` (max ${maxSizeLabel})` : '' }}
        </p>
      </div>
    </div>

    <ul v-if="selectedFiles.length > 0" class="mld-file-uploader__list">
      <li
        v-for="(file, index) in selectedFiles"
        :key="`${file.name}-${index}`"
        class="mld-file-uploader__file"
      >
        <div class="mld-file-uploader__file-info">
          <svg class="mld-file-uploader__file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="mld-file-uploader__file-name">{{ file.name }}</span>
          <span class="mld-file-uploader__file-size">{{ formatFileSize(file.size) }}</span>
        </div>
        <button
          type="button"
          :aria-label="`Remove ${file.name}`"
          class="mld-file-uploader__file-remove"
          @click.stop="removeFile(index)"
        >
          <svg class="mld-file-uploader__file-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
@import '../styles/components/file-uploader.css';
</style>
