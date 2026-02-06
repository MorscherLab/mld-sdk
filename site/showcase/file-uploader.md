<script setup>
import FileUploaderDemo from '../.vitepress/showcase/FileUploaderDemo.vue'
</script>

# FileUploader

A drag-and-drop file upload component with file type and size validation. Supports both file and folder selection modes.

## Demo

<ClientOnly>
  <FileUploaderDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'file' \| 'folder'` | `'file'` | Selection mode - file or folder |
| `accept` | `string` | - | Accepted file types (e.g., `.csv,.xlsx`) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxSize` | `number` | - | Maximum file size in bytes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Uploader size |
| `disabled` | `boolean` | `false` | Disable the uploader |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `upload` | `File[]` | Emitted when valid files are selected |
| `error` | `string` | Emitted when file validation fails |

## Usage

```vue
<template>
  <!-- File mode (default) -->
  <FileUploader
    accept=".csv,.xlsx"
    multiple
    :max-size="10 * 1024 * 1024"
    @upload="handleUpload"
    @error="handleError"
  />

  <!-- Folder mode -->
  <FileUploader
    mode="folder"
    @upload="handleFolderUpload"
    @error="handleError"
  />
</template>
```
