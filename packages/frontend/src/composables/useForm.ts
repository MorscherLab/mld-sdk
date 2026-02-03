import { ref, reactive, computed, watch, type Ref } from 'vue'

/**
 * Validation rule function type.
 * Returns error message string if invalid, undefined/null if valid.
 */
export type ValidationRule<T = unknown> = (value: T, formData: Record<string, unknown>) => string | undefined | null

/**
 * Field validation rules configuration.
 */
export interface FieldRules<T = unknown> {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  email?: boolean | string
  custom?: ValidationRule<T> | ValidationRule<T>[]
}

/**
 * Field validation rules configuration.
 */
export interface FieldState {
  value: unknown
  error: string | null
  touched: boolean
  dirty: boolean
}

/**
 * Form state and methods.
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
  // Form data (reactive)
  data: T

  // Field errors
  errors: Record<string, string | null>

  // Field touched state
  touched: Record<string, boolean>

  // Field dirty state (value changed from initial)
  dirty: Record<string, boolean>

  // Overall form state
  isValid: Ref<boolean>
  isDirty: Ref<boolean>
  isSubmitting: Ref<boolean>

  // Methods
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: (field: string, error: string | null) => void
  setFieldTouched: (field: string, touched?: boolean) => void
  validateField: (field: string) => boolean
  validate: () => boolean
  reset: (values?: Partial<T>) => void
  handleSubmit: (onSubmit: (data: T) => Promise<void> | void) => (e?: Event) => Promise<void>
  getFieldProps: <K extends keyof T>(field: K) => {
    modelValue: T[K]
    'onUpdate:modelValue': (value: T[K]) => void
    onBlur: () => void
    error: string | null
  }
}

// Built-in validators
const validators = {
  required: (value: unknown, message = 'This field is required'): string | null => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    return null
  },

  minLength: (value: unknown, min: number, message?: string): string | null => {
    if (typeof value !== 'string') return null
    if (value.length < min) {
      return message || `Must be at least ${min} characters`
    }
    return null
  },

  maxLength: (value: unknown, max: number, message?: string): string | null => {
    if (typeof value !== 'string') return null
    if (value.length > max) {
      return message || `Must be at most ${max} characters`
    }
    return null
  },

  min: (value: unknown, min: number, message?: string): string | null => {
    if (typeof value !== 'number') return null
    if (value < min) {
      return message || `Must be at least ${min}`
    }
    return null
  },

  max: (value: unknown, max: number, message?: string): string | null => {
    if (typeof value !== 'number') return null
    if (value > max) {
      return message || `Must be at most ${max}`
    }
    return null
  },

  pattern: (value: unknown, pattern: RegExp, message?: string): string | null => {
    if (typeof value !== 'string') return null
    if (!pattern.test(value)) {
      return message || 'Invalid format'
    }
    return null
  },

  email: (value: unknown, message = 'Invalid email address'): string | null => {
    if (typeof value !== 'string' || !value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return message
    }
    return null
  },
}

/**
 * Form state management composable with validation.
 *
 * @param initialValues - Initial form values
 * @param rules - Validation rules for each field
 *
 * @example
 * ```typescript
 * const { data, errors, isValid, handleSubmit, getFieldProps } = useForm(
 *   { email: '', password: '' },
 *   {
 *     email: { required: true, email: true },
 *     password: { required: true, minLength: 8 },
 *   }
 * )
 *
 * // In template
 * <BaseInput v-bind="getFieldProps('email')" label="Email" />
 * <BaseInput v-bind="getFieldProps('password')" type="password" label="Password" />
 * <BaseButton @click="handleSubmit(onSubmit)" :disabled="!isValid">Submit</BaseButton>
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  rules: Partial<Record<keyof T, FieldRules>> = {}
): UseFormReturn<T> {
  // Store initial values for reset
  const _initialValues = { ...initialValues }

  // Reactive form data
  const data = reactive({ ...initialValues }) as T

  // Field state - use simple Record types for better TS compatibility
  const errors = reactive<Record<string, string | null>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = null
      return acc
    }, {} as Record<string, string | null>)
  )

  const touched = reactive<Record<string, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  const dirty = reactive<Record<string, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)
  )

  const isSubmitting = ref(false)

  // Watch data changes to track dirty state
  watch(
    () => ({ ...data }),
    (newData) => {
      for (const key of Object.keys(newData)) {
        dirty[key] = newData[key as keyof T] !== _initialValues[key as keyof T]
      }
    },
    { deep: true }
  )

  // Validate a single field
  function validateField(field: string): boolean {
    const value = data[field as keyof T]
    const fieldRules = rules[field as keyof T]

    if (!fieldRules) {
      errors[field] = null
      return true
    }

    // Check required
    if (fieldRules.required) {
      const message = typeof fieldRules.required === 'string' ? fieldRules.required : undefined
      const error = validators.required(value, message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Skip other validations if empty and not required
    if (value === null || value === undefined || value === '') {
      errors[field] = null
      return true
    }

    // Check minLength
    if (fieldRules.minLength !== undefined) {
      const config = typeof fieldRules.minLength === 'number'
        ? { value: fieldRules.minLength, message: undefined }
        : fieldRules.minLength
      const error = validators.minLength(value, config.value, config.message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check maxLength
    if (fieldRules.maxLength !== undefined) {
      const config = typeof fieldRules.maxLength === 'number'
        ? { value: fieldRules.maxLength, message: undefined }
        : fieldRules.maxLength
      const error = validators.maxLength(value, config.value, config.message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check min
    if (fieldRules.min !== undefined) {
      const config = typeof fieldRules.min === 'number'
        ? { value: fieldRules.min, message: undefined }
        : fieldRules.min
      const error = validators.min(value, config.value, config.message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check max
    if (fieldRules.max !== undefined) {
      const config = typeof fieldRules.max === 'number'
        ? { value: fieldRules.max, message: undefined }
        : fieldRules.max
      const error = validators.max(value, config.value, config.message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check pattern
    if (fieldRules.pattern !== undefined) {
      const config = fieldRules.pattern instanceof RegExp
        ? { value: fieldRules.pattern, message: undefined }
        : fieldRules.pattern
      const error = validators.pattern(value, config.value, config.message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check email
    if (fieldRules.email) {
      const message = typeof fieldRules.email === 'string' ? fieldRules.email : undefined
      const error = validators.email(value, message)
      if (error) {
        errors[field] = error
        return false
      }
    }

    // Check custom validators
    if (fieldRules.custom) {
      const customRules = Array.isArray(fieldRules.custom) ? fieldRules.custom : [fieldRules.custom]
      for (const rule of customRules) {
        const error = rule(value, data as Record<string, unknown>)
        if (error) {
          errors[field] = error
          return false
        }
      }
    }

    errors[field] = null
    return true
  }

  // Validate all fields
  function validate(): boolean {
    let isAllValid = true
    for (const field of Object.keys(data)) {
      if (!validateField(field)) {
        isAllValid = false
      }
    }
    return isAllValid
  }

  // Computed overall validity
  const isValid = computed(() => {
    return Object.values(errors).every(error => error === null)
  })

  // Computed overall dirty state
  const isDirty = computed(() => {
    return Object.values(dirty).some(d => d)
  })

  // Set field value
  function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
    ;(data as Record<string, unknown>)[field as string] = value
    if (touched[field as string]) {
      validateField(field as string)
    }
  }

  // Set field error
  function setFieldError(field: string, error: string | null): void {
    errors[field] = error
  }

  // Set field touched
  function setFieldTouched(field: string, isTouched = true): void {
    touched[field] = isTouched
    if (isTouched) {
      validateField(field)
    }
  }

  // Reset form
  function reset(values?: Partial<T>): void {
    const resetValues = values ? { ..._initialValues, ...values } : _initialValues
    for (const key of Object.keys(data)) {
      ;(data as Record<string, unknown>)[key] = resetValues[key as keyof T]
      errors[key] = null
      touched[key] = false
      dirty[key] = false
    }
  }

  // Handle submit
  function handleSubmit(onSubmit: (data: T) => Promise<void> | void) {
    return async (e?: Event): Promise<void> => {
      e?.preventDefault()

      // Mark all fields as touched
      for (const field of Object.keys(data)) {
        touched[field] = true
      }

      if (!validate()) {
        return
      }

      isSubmitting.value = true
      try {
        await onSubmit(data)
      } finally {
        isSubmitting.value = false
      }
    }
  }

  // Get props for a field (for v-bind)
  function getFieldProps<K extends keyof T>(field: K) {
    const fieldStr = field as string
    return {
      modelValue: data[field],
      'onUpdate:modelValue': (value: T[K]) => setFieldValue(field, value),
      onBlur: () => setFieldTouched(fieldStr),
      error: touched[fieldStr] ? errors[fieldStr] : null,
    }
  }

  return {
    data,
    errors,
    touched,
    dirty,
    isValid,
    isDirty,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validate,
    reset,
    handleSubmit,
    getFieldProps,
  }
}
