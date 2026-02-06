import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownButton from '../../components/DropdownButton.vue'
import type { SelectOption } from '../../types'

describe('DropdownButton', () => {
  const mockOptions: SelectOption[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', description: 'Description for B' },
    { value: 'c', label: 'Option C', disabled: true },
  ]

  describe('rendering with default props', () => {
    it('should render dropdown button', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button').exists()).toBe(true)
      expect(wrapper.find('.mld-dropdown-button__trigger').exists()).toBe(true)
    })

    it('should show placeholder when no value is selected', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__label').text()).toBe('Select...')
    })

    it('should show custom placeholder', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, placeholder: 'Choose an option' },
      })
      expect(wrapper.find('.mld-dropdown-button__label').text()).toBe('Choose an option')
    })

    it('should be closed by default', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
    })

    it('should have chevron icon', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__chevron').exists()).toBe(true)
    })
  })

  describe('v-model behavior', () => {
    it('should display selected option label', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, modelValue: 'b' },
      })
      expect(wrapper.find('.mld-dropdown-button__label').text()).toBe('Option B')
    })

    it('should fallback to value when option not found', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, modelValue: 'unknown' },
      })
      expect(wrapper.find('.mld-dropdown-button__label').text()).toBe('unknown')
    })

    it('should emit update:modelValue when option is selected', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      await wrapper.findAll('.mld-dropdown-button__option')[0].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    })

    it('should emit select event with full option object', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      await wrapper.findAll('.mld-dropdown-button__option')[1].trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
      expect(wrapper.emitted('select')?.[0]).toEqual([mockOptions[1]])
    })
  })

  describe('toggle open/close', () => {
    it('should open menu when trigger is clicked', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)
    })

    it('should close menu when trigger is clicked again', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      const trigger = wrapper.find('.mld-dropdown-button__trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)
      await trigger.trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
    })

    it('should apply open class to trigger when menu is open', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__trigger--open').exists()).toBe(true)
    })

    it('should rotate chevron when open', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__chevron--open').exists()).toBe(true)
    })

    it('should close menu after selecting an option', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)

      await wrapper.findAll('.mld-dropdown-button__option')[0].trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
    })
  })

  describe('options rendering', () => {
    it('should render all options in menu', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const options = wrapper.findAll('.mld-dropdown-button__option')
      expect(options).toHaveLength(3)
    })

    it('should display option labels', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const labels = wrapper.findAll('.mld-dropdown-button__option-label')
      expect(labels[0].text()).toBe('Option A')
      expect(labels[1].text()).toBe('Option B')
      expect(labels[2].text()).toBe('Option C')
    })

    it('should display option descriptions when provided', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const descriptions = wrapper.findAll('.mld-dropdown-button__option-description')
      expect(descriptions).toHaveLength(1)
      expect(descriptions[0].text()).toBe('Description for B')
    })

    it('should mark selected option', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, modelValue: 'a' },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const selectedOption = wrapper.find('.mld-dropdown-button__option--selected')
      expect(selectedOption.exists()).toBe(true)
    })

    it('should show checkmark on selected option', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, modelValue: 'b' },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const options = wrapper.findAll('.mld-dropdown-button__option')
      const checkmark = options[1].find('.mld-dropdown-button__option-check')
      expect(checkmark.exists()).toBe(true)
    })

    it('should apply disabled class to disabled options', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const options = wrapper.findAll('.mld-dropdown-button__option')
      expect(options[2].classes()).toContain('mld-dropdown-button__option--disabled')
    })

    it('should not select disabled options', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const disabledOption = wrapper.findAll('.mld-dropdown-button__option')[2]
      await disabledOption.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('variant prop', () => {
    it('should apply secondary variant by default', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--secondary').exists()).toBe(true)
    })

    it('should apply primary variant', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, variant: 'primary' },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--primary').exists()).toBe(true)
    })

    it('should apply danger variant', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, variant: 'danger' },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--danger').exists()).toBe(true)
    })
  })

  describe('size prop', () => {
    it('should apply medium size by default', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--md').exists()).toBe(true)
    })

    it('should apply small size', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, size: 'sm' },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--sm').exists()).toBe(true)
    })

    it('should apply large size', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, size: 'lg' },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--lg').exists()).toBe(true)
    })
  })

  describe('disabled prop', () => {
    it('should disable button when disabled is true', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, disabled: true },
      })
      const trigger = wrapper.find('.mld-dropdown-button__trigger')
      expect(trigger.attributes('disabled')).toBeDefined()
    })

    it('should apply disabled class', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, disabled: true },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger--disabled').exists()).toBe(true)
    })

    it('should not open menu when disabled', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, disabled: true },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
    })
  })

  describe('loading prop', () => {
    it('should show spinner when loading', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, loading: true },
      })
      expect(wrapper.find('.mld-dropdown-button__spinner').exists()).toBe(true)
    })

    it('should disable button when loading', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, loading: true },
      })
      const trigger = wrapper.find('.mld-dropdown-button__trigger')
      expect(trigger.attributes('disabled')).toBeDefined()
    })

    it('should not open menu when loading', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, loading: true },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
    })
  })

  describe('click outside handling', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should close menu when clicking outside', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
        attachTo: document.body,
      })

      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)

      // Simulate click outside
      document.body.click()
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
      wrapper.unmount()
    })

    it('should not close menu when clicking inside', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })

      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)

      // Click on the container itself
      await wrapper.find('.mld-dropdown-button').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)
    })
  })

  describe('keyboard handling', () => {
    it('should close menu on Escape key', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
        attachTo: document.body,
      })

      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(true)

      // Simulate Escape key press
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.mld-dropdown-button__menu').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('accessibility', () => {
    it('should have proper button type', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger').attributes('type')).toBe('button')
    })

    it('should have aria-expanded attribute', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      const trigger = wrapper.find('.mld-dropdown-button__trigger')
      expect(trigger.attributes('aria-expanded')).toBe('false')

      await trigger.trigger('click')
      expect(trigger.attributes('aria-expanded')).toBe('true')
    })

    it('should have aria-haspopup attribute', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      expect(wrapper.find('.mld-dropdown-button__trigger').attributes('aria-haspopup')).toBe('listbox')
    })

    it('should have role="listbox" on menu', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      expect(wrapper.find('.mld-dropdown-button__menu').attributes('role')).toBe('listbox')
    })

    it('should have role="option" on options', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')
      const options = wrapper.findAll('.mld-dropdown-button__option')
      options.forEach(opt => {
        expect(opt.attributes('role')).toBe('option')
      })
    })

    it('should have aria-selected on options', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions, modelValue: 'a' },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const options = wrapper.findAll('.mld-dropdown-button__option')
      expect(options[0].attributes('aria-selected')).toBe('true')
      expect(options[1].attributes('aria-selected')).toBe('false')
    })

    it('should have aria-disabled on disabled options', async () => {
      const wrapper = mount(DropdownButton, {
        props: { options: mockOptions },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const disabledOption = wrapper.findAll('.mld-dropdown-button__option')[2]
      expect(disabledOption.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('edge cases', () => {
    it('should handle empty options array', () => {
      const wrapper = mount(DropdownButton, {
        props: { options: [] },
      })
      expect(wrapper.find('.mld-dropdown-button').exists()).toBe(true)
    })

    it('should handle numeric option values', async () => {
      const numericOptions: SelectOption<number>[] = [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
      ]
      const wrapper = mount(DropdownButton, {
        props: { options: numericOptions, modelValue: 1 },
      })
      expect(wrapper.find('.mld-dropdown-button__label').text()).toBe('One')
    })

    it('should handle options with same labels', async () => {
      const duplicateLabels: SelectOption[] = [
        { value: 'a', label: 'Same' },
        { value: 'b', label: 'Same' },
      ]
      const wrapper = mount(DropdownButton, {
        props: { options: duplicateLabels },
      })
      await wrapper.find('.mld-dropdown-button__trigger').trigger('click')

      const options = wrapper.findAll('.mld-dropdown-button__option')
      expect(options).toHaveLength(2)
    })
  })
})
