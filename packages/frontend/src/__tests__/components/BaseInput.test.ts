import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../../components/BaseInput.vue'

describe('BaseInput', () => {
  describe('text input', () => {
    it('should emit string value on input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', type: 'text' },
      })
      const input = wrapper.find('input')
      await input.setValue('hello')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })
  })

  describe('number input', () => {
    it('should emit number value on input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 0, type: 'number' },
      })
      const input = wrapper.find('input')
      // Simulate typing a number
      Object.defineProperty(input.element, 'value', { value: '42', writable: true })
      await input.trigger('input')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
    })

    it('should emit null for empty number input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 5, type: 'number' },
      })
      const input = wrapper.find('input')
      // Simulate clearing the input
      Object.defineProperty(input.element, 'value', { value: '', writable: true })
      await input.trigger('input')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    })

    it('should not emit NaN for empty number input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 5, type: 'number' },
      })
      const input = wrapper.find('input')
      Object.defineProperty(input.element, 'value', { value: '', writable: true })
      await input.trigger('input')
      const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0]
      expect(emitted).not.toBeNaN()
    })
  })

  describe('props', () => {
    it('should apply disabled attribute', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', disabled: true },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('should apply placeholder', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', placeholder: 'Enter text' },
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
    })

    it('should apply error class', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', error: true },
      })
      expect(wrapper.find('input').classes()).toContain('mld-input--error')
    })

    it('should apply size class', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', size: 'lg' },
      })
      expect(wrapper.find('input').classes()).toContain('mld-input--lg')
    })
  })

  describe('events', () => {
    it('should emit focus event', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })
      await wrapper.find('input').trigger('focus')
      expect(wrapper.emitted('focus')).toHaveLength(1)
    })

    it('should emit blur event', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })
      await wrapper.find('input').trigger('blur')
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })
})
