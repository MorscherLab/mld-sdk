import { ref } from 'vue'
import type { Toast } from '../types'

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: Toast['type'] = 'success', duration = 3500) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  function success(message: string, duration = 3500) {
    show(message, 'success', duration)
  }

  function error(message: string, duration = 5000) {
    show(message, 'error', duration)
  }

  function warning(message: string, duration = 4000) {
    show(message, 'warning', duration)
  }

  function info(message: string, duration = 3500) {
    show(message, 'info', duration)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  return { toasts, show, success, error, warning, info, dismiss, clear }
}
