import { ref, computed, type Ref, type ComputedRef } from 'vue'

/**
 * Error type for async operations.
 */
export interface AsyncError {
  message: string
  code?: string
  details?: Record<string, unknown>
  originalError?: unknown
}

/**
 * State of an async operation.
 */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Return type for useAsync composable.
 */
export interface UseAsyncReturn<T> {
  // Data
  data: Ref<T | null>
  error: Ref<AsyncError | null>

  // State
  state: Ref<AsyncState>
  isIdle: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  isSuccess: ComputedRef<boolean>
  isError: ComputedRef<boolean>

  // Methods
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
  setData: (data: T | null) => void
  setError: (error: AsyncError | null) => void
}

/**
 * Options for useAsync.
 */
export interface UseAsyncOptions<T> {
  // Initial data value
  initialData?: T | null

  // Whether to run immediately on creation
  immediate?: boolean

  // Arguments for immediate execution
  immediateArgs?: unknown[]

  // Transform error into AsyncError
  transformError?: (error: unknown) => AsyncError

  // Called on success
  onSuccess?: (data: T) => void

  // Called on error
  onError?: (error: AsyncError) => void

  // Reset data on new execution
  resetOnExecute?: boolean
}

/**
 * Default error transformer.
 */
function defaultTransformError(error: unknown): AsyncError {
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    }
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>

    // Handle Axios-like errors
    if ('response' in errorObj && errorObj.response) {
      const response = errorObj.response as Record<string, unknown>
      const data = response.data as Record<string, unknown> | undefined

      return {
        message: (data?.detail as string) || (data?.message as string) || 'Request failed',
        code: String(response.status),
        details: data,
        originalError: error,
      }
    }

    // Handle generic error objects
    return {
      message: (errorObj.message as string) || 'Unknown error',
      code: errorObj.code as string | undefined,
      details: errorObj,
      originalError: error,
    }
  }

  return {
    message: String(error),
    originalError: error,
  }
}

/**
 * Composable for managing async operation state.
 *
 * Provides standardized loading, error, and success state management
 * for any async function.
 *
 * @param asyncFn - The async function to wrap
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error, execute } = useAsync(
 *   async (id: string) => {
 *     const response = await api.get(`/users/${id}`)
 *     return response.data
 *   }
 * )
 *
 * // Execute the function
 * await execute('user-123')
 *
 * // In template
 * <div v-if="isLoading">Loading...</div>
 * <div v-else-if="error">{{ error.message }}</div>
 * <div v-else-if="data">{{ data.name }}</div>
 * ```
 *
 * @example
 * ```typescript
 * // With options
 * const { data, execute } = useAsync(
 *   fetchUser,
 *   {
 *     immediate: true,
 *     immediateArgs: ['default-user'],
 *     onSuccess: (user) => console.log('Fetched:', user.name),
 *     onError: (error) => toast.error(error.message),
 *   }
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Form submission
 * const { isLoading, error, execute: submit } = useAsync(
 *   async (formData: FormData) => {
 *     await api.post('/submit', formData)
 *   },
 *   {
 *     onSuccess: () => {
 *       toast.success('Submitted!')
 *       router.push('/success')
 *     },
 *   }
 * )
 *
 * const handleSubmit = () => submit(new FormData(formRef.value))
 * ```
 */
export function useAsync<T>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const {
    initialData = null,
    immediate = false,
    immediateArgs = [],
    transformError = defaultTransformError,
    onSuccess,
    onError,
    resetOnExecute = false,
  } = options

  // State
  const data = ref<T | null>(initialData) as Ref<T | null>
  const error = ref<AsyncError | null>(null)
  const state = ref<AsyncState>('idle')

  // Computed state helpers
  const isIdle = computed(() => state.value === 'idle')
  const isLoading = computed(() => state.value === 'loading')
  const isSuccess = computed(() => state.value === 'success')
  const isError = computed(() => state.value === 'error')

  // Execute the async function
  async function execute(...args: unknown[]): Promise<T | null> {
    state.value = 'loading'
    error.value = null

    if (resetOnExecute) {
      data.value = null
    }

    try {
      const result = await asyncFn(...args)
      data.value = result
      state.value = 'success'
      onSuccess?.(result)
      return result
    } catch (e) {
      const asyncError = transformError(e)
      error.value = asyncError
      state.value = 'error'
      onError?.(asyncError)
      return null
    }
  }

  // Reset to initial state
  function reset(): void {
    data.value = initialData
    error.value = null
    state.value = 'idle'
  }

  // Manual data setter
  function setData(newData: T | null): void {
    data.value = newData
    if (newData !== null) {
      state.value = 'success'
      error.value = null
    }
  }

  // Manual error setter
  function setError(newError: AsyncError | null): void {
    error.value = newError
    if (newError !== null) {
      state.value = 'error'
    }
  }

  // Execute immediately if requested
  if (immediate) {
    execute(...immediateArgs)
  }

  return {
    data,
    error,
    state,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset,
    setData,
    setError,
  }
}

/**
 * Create a batch of async operations that can be executed in parallel.
 *
 * @example
 * ```typescript
 * const { results, isLoading, execute } = useAsyncBatch([
 *   () => fetchUser(userId),
 *   () => fetchPosts(userId),
 *   () => fetchComments(userId),
 * ])
 *
 * await execute()
 * // results.value = [user, posts, comments]
 * ```
 */
export function useAsyncBatch<T extends readonly (() => Promise<unknown>)[]>(
  asyncFns: T
): {
  results: Ref<{ [K in keyof T]: Awaited<ReturnType<T[K]>> | null }>
  errors: Ref<(AsyncError | null)[]>
  isLoading: Ref<boolean>
  execute: () => Promise<void>
  reset: () => void
} {
  type Results = { [K in keyof T]: Awaited<ReturnType<T[K]>> | null }

  const results = ref<Results>(asyncFns.map(() => null) as unknown as Results) as Ref<Results>
  const errors = ref<(AsyncError | null)[]>(asyncFns.map(() => null))
  const isLoading = ref(false)

  async function execute(): Promise<void> {
    isLoading.value = true
    errors.value = asyncFns.map(() => null)

    const promises = asyncFns.map(async (fn, index) => {
      try {
        const result = await fn()
        ;(results.value as unknown[])[index] = result
      } catch (e) {
        errors.value[index] = defaultTransformError(e)
        ;(results.value as unknown[])[index] = null
      }
    })

    await Promise.all(promises)
    isLoading.value = false
  }

  function reset(): void {
    results.value = asyncFns.map(() => null) as unknown as Results
    errors.value = asyncFns.map(() => null)
    isLoading.value = false
  }

  return {
    results,
    errors,
    isLoading,
    execute,
    reset,
  }
}
