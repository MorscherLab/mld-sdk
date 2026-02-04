<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

export interface MoleculeData {
  smiles: string
  molfile: string
}

interface Props {
  modelValue?: MoleculeData
  disabled?: boolean
  readonly?: boolean
  height?: number
  showSmiles?: boolean
  placeholder?: string
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  height: 300,
  showSmiles: true,
  placeholder: 'Draw a chemical structure',
  error: false,
})

const emit = defineEmits<{
  'update:modelValue': [data: MoleculeData | undefined]
  'error': [message: string]
}>()

// State
const containerRef = ref<HTMLDivElement | null>(null)
const jsmeInstance = ref<unknown>(null)
const isLoading = ref(true)
const loadError = ref<string | null>(null)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// Computed
const hasStructure = computed(() => {
  return props.modelValue?.smiles && props.modelValue.smiles.length > 0
})

// Use window-level state to persist across component instances and hot-reloads
interface JSMEGlobalState {
  __jsmeCallbacks__?: Array<() => void>
  __jsmeLoading__?: boolean
  __jsmeLoaded__?: boolean
  __jsmeLoadPromise__?: Promise<void>
  JSApplet?: { JSME?: new (id: string, width: string, height: string, options?: object) => unknown }
  jsmeOnLoad?: () => void
}

function getJSMEState(): JSMEGlobalState {
  const win = window as unknown as JSMEGlobalState
  if (!win.__jsmeCallbacks__) {
    win.__jsmeCallbacks__ = []
  }
  return win
}

function waitForJSME(): Promise<void> {
  const win = getJSMEState()

  // Already loaded
  if (win.JSApplet?.JSME) {
    return Promise.resolve()
  }

  // Reuse existing promise if loading
  if (win.__jsmeLoadPromise__) {
    return win.__jsmeLoadPromise__
  }

  win.__jsmeLoadPromise__ = new Promise((resolve, reject) => {
    // Double-check after promise creation
    if (win.JSApplet?.JSME) {
      resolve()
      return
    }

    // Set up global callback FIRST (before checking for existing script)
    const originalOnLoad = win.jsmeOnLoad
    win.jsmeOnLoad = () => {
      win.__jsmeLoaded__ = true
      originalOnLoad?.()
      win.__jsmeCallbacks__?.forEach(cb => cb())
      win.__jsmeCallbacks__ = []
      resolve()
    }

    // Add to callback queue
    win.__jsmeCallbacks__?.push(resolve)

    // Check if script already exists
    const existingScript = document.querySelector('script[data-jsme]')
    if (existingScript) {
      // Script exists, poll for JSApplet.JSME (in case jsmeOnLoad already fired)
      const checkReady = setInterval(() => {
        if (win.JSApplet?.JSME) {
          clearInterval(checkReady)
          win.__jsmeLoaded__ = true
          win.__jsmeCallbacks__?.forEach(cb => cb())
          win.__jsmeCallbacks__ = []
          resolve()
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkReady)
        if (!win.__jsmeLoaded__ && !win.JSApplet?.JSME) {
          reject(new Error('JSME initialization timeout'))
        }
      }, 15000)
      return
    }

    // Load the script
    win.__jsmeLoading__ = true
    const script = document.createElement('script')
    script.src = 'https://jsme-editor.github.io/dist/jsme/jsme.nocache.js'
    script.async = true
    script.setAttribute('data-jsme', 'true')

    script.onerror = () => {
      win.__jsmeLoading__ = false
      win.__jsmeLoadPromise__ = undefined
      reject(new Error('Failed to load JSME script'))
    }

    // Timeout
    setTimeout(() => {
      if (!win.__jsmeLoaded__ && !win.JSApplet?.JSME) {
        reject(new Error('JSME initialization timeout'))
      }
    }, 15000)

    document.head.appendChild(script)
  })

  return win.__jsmeLoadPromise__
}

// JSME initialization
async function initJSME() {
  if (!containerRef.value || props.readonly) return

  try {
    isLoading.value = true
    loadError.value = null

    // Wait for JSME to be ready
    await waitForJSME()

    // Wait for DOM to be ready
    await nextTick()

    if (!containerRef.value) return

    // Get JSME constructor from window
    const win = getJSMEState()

    if (!win.JSApplet?.JSME) {
      throw new Error('JSME library not available after loading')
    }

    // Create JSME instance
    const editorId = `jsme-${Date.now()}`
    containerRef.value.id = editorId

    const instance = new win.JSApplet.JSME(
      editorId,
      '100%',
      `${props.height}px`,
      {
        options: 'query,hydrogens,paste,depict',
      }
    )

    jsmeInstance.value = instance

    // Set initial value if provided
    if (props.modelValue?.molfile) {
      (instance as { readMolFile: (mol: string) => void }).readMolFile(props.modelValue.molfile)
    }

    // Set up change callback
    (instance as { setCallBack: (event: string, callback: () => void) => void }).setCallBack('AfterStructureModified', handleStructureChange)

    isLoading.value = false
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load molecule editor'
    loadError.value = message
    emit('error', message)
    isLoading.value = false
  }
}

function handleStructureChange() {
  // Debounce the change event
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = setTimeout(() => {
    if (!jsmeInstance.value) return

    const instance = jsmeInstance.value as {
      smiles: () => string
      molFile: () => string
    }

    const smiles = instance.smiles()
    const molfile = instance.molFile()

    if (!smiles || smiles.length === 0) {
      emit('update:modelValue', undefined)
    } else {
      emit('update:modelValue', { smiles, molfile })
    }
  }, 300)
}

function clearStructure() {
  if (jsmeInstance.value) {
    (jsmeInstance.value as { reset: () => void }).reset()
  }
  emit('update:modelValue', undefined)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (!jsmeInstance.value) return

  const instance = jsmeInstance.value as {
    smiles: () => string
    readMolFile: (mol: string) => void
    reset: () => void
  }

  // Only update if the external value differs from current
  const currentSmiles = instance.smiles()
  if (newValue?.smiles !== currentSmiles) {
    if (newValue?.molfile) {
      instance.readMolFile(newValue.molfile)
    } else {
      instance.reset()
    }
  }
})

// Lifecycle
onMounted(() => {
  if (!props.readonly) {
    initJSME()
  } else {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  jsmeInstance.value = null
})
</script>

<template>
  <div
    :class="[
      'mld-molecule-input',
      disabled ? 'mld-molecule-input--disabled' : '',
      readonly ? 'mld-molecule-input--readonly' : '',
      error ? 'mld-molecule-input--error' : '',
    ]"
  >
    <!-- Loading state -->
    <div
      v-if="isLoading && !readonly"
      class="mld-molecule-input__skeleton"
      :style="{ height: `${height}px` }"
    >
      <svg
        class="mld-molecule-input__skeleton-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
      <span class="mld-molecule-input__skeleton-text">Loading molecule editor...</span>
    </div>

    <!-- Error state -->
    <div
      v-else-if="loadError"
      class="mld-molecule-input__error"
    >
      <svg
        class="mld-molecule-input__error-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      {{ loadError }}
    </div>

    <!-- Readonly mode - show empty or placeholder -->
    <template v-else-if="readonly">
      <div
        v-if="hasStructure"
        class="mld-molecule-input__readonly"
        :style="{ height: `${height}px` }"
      >
        <!-- In readonly mode, we just display a placeholder since we don't have SVG rendering -->
        <div class="mld-molecule-input__empty">
          <svg
            class="mld-molecule-input__empty-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span class="mld-molecule-input__empty-text">Structure defined (readonly)</span>
        </div>
      </div>
      <div
        v-else
        class="mld-molecule-input__empty"
        :style="{ height: `${height}px` }"
      >
        <svg
          class="mld-molecule-input__empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <span class="mld-molecule-input__empty-text">No structure</span>
      </div>
    </template>

    <!-- Editor mode -->
    <template v-else>
      <div
        ref="containerRef"
        class="mld-molecule-input__editor"
        :style="{ height: `${height}px` }"
        role="application"
        aria-label="Molecule structure editor"
      />

      <!-- Actions toolbar -->
      <div class="mld-molecule-input__actions">
        <button
          type="button"
          class="mld-molecule-input__action-btn"
          :disabled="!hasStructure || disabled"
          aria-label="Clear structure"
          @click="clearStructure"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </template>

    <!-- SMILES display -->
    <div
      v-if="showSmiles && hasStructure && !loadError"
      class="mld-molecule-input__smiles"
    >
      <span class="mld-molecule-input__smiles-label">SMILES:</span>
      {{ modelValue?.smiles }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/molecule-input.css';
</style>
