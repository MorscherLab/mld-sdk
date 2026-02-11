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

const fileTypeMap: Record<string, { color: string; label: string }> = {
  csv: { color: '#10B981', label: 'CSV' },
  tsv: { color: '#10B981', label: 'TSV' },
  xlsx: { color: '#10B981', label: 'XLSX' },
  xls: { color: '#10B981', label: 'XLS' },
  pdf: { color: '#EF4444', label: 'PDF' },
  png: { color: '#8B5CF6', label: 'PNG' },
  jpg: { color: '#8B5CF6', label: 'JPG' },
  jpeg: { color: '#8B5CF6', label: 'JPEG' },
  gif: { color: '#8B5CF6', label: 'GIF' },
  svg: { color: '#8B5CF6', label: 'SVG' },
  webp: { color: '#8B5CF6', label: 'WEBP' },
  json: { color: '#F59E0B', label: 'JSON' },
  xml: { color: '#F59E0B', label: 'XML' },
  txt: { color: '#64748B', label: 'TXT' },
  zip: { color: '#6366F1', label: 'ZIP' },
  gz: { color: '#6366F1', label: 'GZ' },
  py: { color: '#3B82F6', label: 'PY' },
  js: { color: '#EAB308', label: 'JS' },
  ts: { color: '#3B82F6', label: 'TS' },
  fasta: { color: '#EC4899', label: 'FASTA' },
  fastq: { color: '#EC4899', label: 'FASTQ' },
  bam: { color: '#EC4899', label: 'BAM' },
  vcf: { color: '#EC4899', label: 'VCF' },
}

function getFileType(filename: string): { color: string; label: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return fileTypeMap[ext] || { color: '#94A3B8', label: ext.toUpperCase() || 'FILE' }
}

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
    <!-- Dropzone -->
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
        selectedFiles.length > 0 ? 'mld-file-uploader__dropzone--has-files' : '',
      ]"
      @click="openFilePicker"
      @keydown.enter="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <!-- Animated border overlay -->
      <div class="mld-file-uploader__border" aria-hidden="true" />

      <!-- Glow effect on drag -->
      <div v-if="isDragOver" class="mld-file-uploader__glow" aria-hidden="true" />

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
        <!-- Animated icon -->
        <div :class="['mld-file-uploader__icon-wrapper', `mld-file-uploader__icon-wrapper--${size}`]">
          <div class="mld-file-uploader__icon-bg" aria-hidden="true" />
          <svg
            v-if="isFolder"
            :class="['mld-file-uploader__icon', `mld-file-uploader__icon--${size}`]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>
          <svg
            v-else
            :class="['mld-file-uploader__icon', `mld-file-uploader__icon--${size}`]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 13v8" /><path d="m8 17 4-4 4 4" />
          </svg>
        </div>

        <p :class="['mld-file-uploader__text', `mld-file-uploader__text--${size}`]">
          <span class="mld-file-uploader__highlight">{{ isFolder ? 'Click to select folder' : 'Click to upload' }}</span>
          <span class="mld-file-uploader__text-secondary"> or drag and drop</span>
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
        <div class="mld-file-uploader__folder-icon-wrapper">
          <svg class="mld-file-uploader__folder-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
          </svg>
        </div>
        <div class="mld-file-uploader__folder-details">
          <span class="mld-file-uploader__folder-name">{{ folderName }}</span>
          <span class="mld-file-uploader__folder-count">{{ selectedFiles.length }} file{{ selectedFiles.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Clear folder"
        class="mld-file-uploader__remove-btn"
        @click.stop="clearAll"
      >
        <svg class="mld-file-uploader__remove-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <!-- File list display -->
    <TransitionGroup
      v-if="!isFolder && selectedFiles.length > 0"
      tag="ul"
      name="mld-file-uploader-item"
      class="mld-file-uploader__list"
    >
      <li
        v-for="(file, index) in selectedFiles"
        :key="`${file.name}-${file.size}-${index}`"
        class="mld-file-uploader__file"
      >
        <div class="mld-file-uploader__file-info">
          <span
            class="mld-file-uploader__file-badge"
            :style="{ '--badge-color': getFileType(file.name).color }"
          >
            {{ getFileType(file.name).label }}
          </span>
          <div class="mld-file-uploader__file-meta">
            <span class="mld-file-uploader__file-name">{{ file.name }}</span>
            <span class="mld-file-uploader__file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button
          type="button"
          :aria-label="`Remove ${file.name}`"
          class="mld-file-uploader__remove-btn"
          @click.stop="removeFile(index)"
        >
          <svg class="mld-file-uploader__remove-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<style>
@import '../styles/components/file-uploader.css';
</style>
