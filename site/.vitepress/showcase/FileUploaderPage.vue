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
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">FileUploader</h1>
    <p class="text-text-secondary mb-8">
      A drag-and-drop file upload component with file type and size validation.
      Supports both file and folder selection modes.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-md space-y-2">
        <FileUploader @upload="handleUpload" @error="handleError" />
        <p v-if="uploadedFiles.length" class="text-sm text-text-secondary">
          Uploaded: {{ uploadedFiles.map(f => f.name).join(', ') }}
        </p>
      </div>
    </div>

    <!-- Folder Mode -->
    <div class="demo-section">
      <h3>Folder Mode</h3>
      <p class="text-sm text-text-secondary mb-4">
        Select entire folders to upload all files within. Uses webkitdirectory for folder selection.
      </p>
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
    </div>

    <!-- Accept Specific Types -->
    <div class="demo-section">
      <h3>Accept Specific Types</h3>
      <div class="max-w-md">
        <FileUploader
          accept=".jpg,.jpeg,.png,.gif"
          @upload="handleImageUpload"
          @error="handleError"
        />
        <p class="mt-2 text-xs text-text-muted">Only image files accepted</p>
      </div>
    </div>

    <!-- Multiple Files with Size Limit -->
    <div class="demo-section">
      <h3>Multiple Files with Size Limit</h3>
      <div class="max-w-md">
        <FileUploader
          multiple
          :max-size="5 * 1024 * 1024"
          @upload="(files) => console.log('Multiple:', files)"
          @error="handleError"
        />
        <p class="mt-2 text-xs text-text-muted">Multiple files, max 5MB each</p>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-6 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <FileUploader :size="size" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <FileUploader disabled />
        </div>
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>mode</code></td>
            <td><code>'file' | 'folder'</code></td>
            <td><code>'file'</code></td>
            <td>Selection mode - file or folder</td>
          </tr>
          <tr>
            <td><code>accept</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Accepted file types (e.g., ".csv,.xlsx")</td>
          </tr>
          <tr>
            <td><code>multiple</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Allow multiple file selection</td>
          </tr>
          <tr>
            <td><code>maxSize</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Maximum file size in bytes</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Uploader size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the uploader</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>upload</code></td>
            <td><code>File[]</code></td>
            <td>Emitted when valid files are selected</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>string</code></td>
            <td>Emitted when file validation fails</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;!-- File mode (default) --&gt;
&lt;FileUploader
  accept=".csv,.xlsx"
  multiple
  :max-size="10 * 1024 * 1024"
  @upload="handleUpload"
  @error="handleError"
/&gt;

&lt;!-- Folder mode --&gt;
&lt;FileUploader
  mode="folder"
  @upload="handleFolderUpload"
  @error="handleError"
/&gt;</pre>
    </div>
  </div>
</template>
