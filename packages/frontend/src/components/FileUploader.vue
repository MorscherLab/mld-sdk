<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  mode?: 'file' | 'folder'
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  size: 'md',
  mode: 'file',
})

const emit = defineEmits<{
  upload: [files: File[]]
  error: [message: string]
}>()

const isDragOver = ref(false)
const inputRef = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const folderName = ref<string | null>(null)

const isFolder = computed(() => props.mode === 'folder')

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

function handleFiles(files: FileList | File[], folder?: string) {
  const validFiles = validateFiles(files)
  if (validFiles.length === 0) return

  if (isFolder.value) {
    folderName.value = folder || extractFolderName(validFiles)
    selectedFiles.value = validFiles
    emit('upload', validFiles)
  } else if (!props.multiple) {
    selectedFiles.value = [validFiles[0]]
    emit('upload', [validFiles[0]])
  } else {
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    emit('upload', validFiles)
  }
}

function extractFolderName(files: File[]): string | null {
  if (files.length === 0) return null
  const firstPath = files[0].webkitRelativePath
  if (firstPath) {
    return firstPath.split('/')[0]
  }
  return null
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  if (props.disabled) return

  if (isFolder.value && event.dataTransfer?.items) {
    handleFolderDrop(event.dataTransfer.items)
  } else if (event.dataTransfer?.files) {
    handleFiles(event.dataTransfer.files)
  }
}

async function handleFolderDrop(items: DataTransferItemList) {
  const files: File[] = []
  let folderNameFromDrop: string | undefined

  for (const item of Array.from(items)) {
    const entry = item.webkitGetAsEntry?.()
    if (entry?.isDirectory) {
      folderNameFromDrop = entry.name
      await readDirectory(entry as FileSystemDirectoryEntry, files)
    } else if (entry?.isFile) {
      const file = await getFile(entry as FileSystemFileEntry)
      if (file) files.push(file)
    }
  }

  if (files.length > 0) {
    handleFiles(files, folderNameFromDrop)
  }
}

async function readDirectory(directory: FileSystemDirectoryEntry, files: File[]): Promise<void> {
  const reader = directory.createReader()
  const entries = await new Promise<FileSystemEntry[]>((resolve) => {
    reader.readEntries(resolve)
  })

  for (const entry of entries) {
    if (entry.isFile) {
      const file = await getFile(entry as FileSystemFileEntry)
      if (file) files.push(file)
    } else if (entry.isDirectory) {
      await readDirectory(entry as FileSystemDirectoryEntry, files)
    }
  }
}

function getFile(entry: FileSystemFileEntry): Promise<File | null> {
  return new Promise((resolve) => {
    entry.file(resolve, () => resolve(null))
  })
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
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  if (isFolder.value && selectedFiles.value.length === 0) {
    folderName.value = null
  }
}

function clearAll() {
  selectedFiles.value = []
  folderName.value = null
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
        :multiple="isFolder || multiple"
        :disabled="disabled"
        :webkitdirectory="isFolder || undefined"
        class="mld-file-uploader__input"
        @change="handleInputChange"
      />

      <div class="mld-file-uploader__content">
        <!-- Folder icon for folder mode -->
        <svg
          v-if="isFolder"
          :class="['mld-file-uploader__icon', `mld-file-uploader__icon--${size}`]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <!-- Cloud upload icon for file mode -->
        <svg
          v-else
          :class="['mld-file-uploader__icon', `mld-file-uploader__icon--${size}`]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        <p :class="['mld-file-uploader__text', `mld-file-uploader__text--${size}`]">
          <span class="mld-file-uploader__highlight">{{ isFolder ? 'Click to select folder' : 'Click to upload' }}</span>
          <span> or drag and drop</span>
        </p>

        <p :class="['mld-file-uploader__hint', `mld-file-uploader__hint--${size}`]">
          <template v-if="isFolder">
            Select a folder to upload all files within
          </template>
          <template v-else>
            {{ acceptLabel }}{{ maxSizeLabel ? ` (max ${maxSizeLabel})` : '' }}
          </template>
        </p>
      </div>
    </div>

    <!-- Folder summary display -->
    <div v-if="isFolder && folderName && selectedFiles.length > 0" class="mld-file-uploader__folder-summary">
      <div class="mld-file-uploader__folder-info">
        <svg class="mld-file-uploader__folder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <div class="mld-file-uploader__folder-details">
          <span class="mld-file-uploader__folder-name">{{ folderName }}</span>
          <span class="mld-file-uploader__folder-count">{{ selectedFiles.length }} file{{ selectedFiles.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Clear folder"
        class="mld-file-uploader__file-remove"
        @click.stop="clearAll"
      >
        <svg class="mld-file-uploader__file-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- File list display (for non-folder mode) -->
    <ul v-if="!isFolder && selectedFiles.length > 0" class="mld-file-uploader__list">
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
