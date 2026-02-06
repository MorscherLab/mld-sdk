import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePill from '../../components/BasePill.vue'

describe('BasePill', () => {
  describe('rendering with default props', () => {
    it('should render pill with default variant and size', () => {
      const wrapper = mount(BasePill, {
        slots: { default: 'Label' },
      })
      expect(wrapper.find('.mld-pill').exists()).toBe(true)
      expect(wrapper.find('.mld-pill--default').exists()).toBe(true)
      expect(wrapper.find('.mld-pill--md').exists()).toBe(true)
    })

    it('should render label content', () => {
      const wrapper = mount(BasePill, {
        slots: { default: 'Test Label' },
      })
      expect(wrapper.find('.mld-pill__label').text()).toBe('Test Label')
    })

    it('should not show remove button by default', () => {
      const wrapper = mount(BasePill, {
        slots: { default: 'Label' },
      })
      expect(wrapper.find('.mld-pill__remove').exists()).toBe(false)
    })

    it('should not show icon slot by default', () => {
      const wrapper = mount(BasePill, {
        slots: { default: 'Label' },
      })
      expect(wrapper.find('.mld-pill__icon').exists()).toBe(false)
    })
  })

  describe('variant prop', () => {
    it('should apply primary variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'primary' },
        slots: { default: 'Primary' },
      })
      expect(wrapper.find('.mld-pill--primary').exists()).toBe(true)
    })

    it('should apply success variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'success' },
        slots: { default: 'Success' },
      })
      expect(wrapper.find('.mld-pill--success').exists()).toBe(true)
    })

    it('should apply warning variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'warning' },
        slots: { default: 'Warning' },
      })
      expect(wrapper.find('.mld-pill--warning').exists()).toBe(true)
    })

    it('should apply error variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'error' },
        slots: { default: 'Error' },
      })
      expect(wrapper.find('.mld-pill--error').exists()).toBe(true)
    })

    it('should apply info variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'info' },
        slots: { default: 'Info' },
      })
      expect(wrapper.find('.mld-pill--info').exists()).toBe(true)
    })

    it('should apply outline variant class', () => {
      const wrapper = mount(BasePill, {
        props: { variant: 'outline' },
        slots: { default: 'Outline' },
      })
      expect(wrapper.find('.mld-pill--outline').exists()).toBe(true)
    })
  })

  describe('size prop', () => {
    it('should apply small size class', () => {
      const wrapper = mount(BasePill, {
        props: { size: 'sm' },
        slots: { default: 'Small' },
      })
      expect(wrapper.find('.mld-pill--sm').exists()).toBe(true)
    })

    it('should apply medium size class', () => {
      const wrapper = mount(BasePill, {
        props: { size: 'md' },
        slots: { default: 'Medium' },
      })
      expect(wrapper.find('.mld-pill--md').exists()).toBe(true)
    })

    it('should apply large size class', () => {
      const wrapper = mount(BasePill, {
        props: { size: 'lg' },
        slots: { default: 'Large' },
      })
      expect(wrapper.find('.mld-pill--lg').exists()).toBe(true)
    })
  })

  describe('removable prop', () => {
    it('should show remove button when removable is true', () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Removable' },
      })
      expect(wrapper.find('.mld-pill__remove').exists()).toBe(true)
    })

    it('should emit remove event when remove button is clicked', async () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Removable' },
      })
      await wrapper.find('.mld-pill__remove').trigger('click')
      expect(wrapper.emitted('remove')).toHaveLength(1)
    })

    it('should not show remove button when disabled', () => {
      const wrapper = mount(BasePill, {
        props: { removable: true, disabled: true },
        slots: { default: 'Disabled' },
      })
      expect(wrapper.find('.mld-pill__remove').exists()).toBe(false)
    })

    it('should stop event propagation on remove click', async () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Removable' },
      })
      const button = wrapper.find('.mld-pill__remove')
      const clickEvent = new MouseEvent('click', { bubbles: true })
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')

      await button.element.dispatchEvent(clickEvent)
      expect(stopPropagationSpy).toHaveBeenCalled()
    })
  })

  describe('disabled prop', () => {
    it('should apply disabled class when disabled is true', () => {
      const wrapper = mount(BasePill, {
        props: { disabled: true },
        slots: { default: 'Disabled' },
      })
      expect(wrapper.find('.mld-pill--disabled').exists()).toBe(true)
    })

    it('should not emit remove event when disabled', async () => {
      const wrapper = mount(BasePill, {
        props: { removable: true, disabled: true },
        slots: { default: 'Disabled' },
      })
      // Remove button shouldn't exist when disabled + removable
      expect(wrapper.find('.mld-pill__remove').exists()).toBe(false)
    })
  })

  describe('icon prop and slot', () => {
    it('should show icon slot when icon is true', () => {
      const wrapper = mount(BasePill, {
        props: { icon: true },
        slots: {
          default: 'With Icon',
          icon: '<svg class="test-icon"></svg>',
        },
      })
      expect(wrapper.find('.mld-pill__icon').exists()).toBe(true)
      expect(wrapper.find('.test-icon').exists()).toBe(true)
    })

    it('should apply with-icon class when icon is true', () => {
      const wrapper = mount(BasePill, {
        props: { icon: true },
        slots: {
          default: 'With Icon',
          icon: '<svg></svg>',
        },
      })
      expect(wrapper.find('.mld-pill--with-icon').exists()).toBe(true)
    })

    it('should not show icon slot when icon is false', () => {
      const wrapper = mount(BasePill, {
        props: { icon: false },
        slots: {
          default: 'No Icon',
          icon: '<svg class="test-icon"></svg>',
        },
      })
      expect(wrapper.find('.mld-pill__icon').exists()).toBe(false)
    })
  })

  describe('combined props', () => {
    it('should apply multiple classes correctly', () => {
      const wrapper = mount(BasePill, {
        props: {
          variant: 'success',
          size: 'sm',
          disabled: true,
          icon: true,
        },
        slots: {
          default: 'Combined',
          icon: '<svg></svg>',
        },
      })
      const pill = wrapper.find('.mld-pill')
      expect(pill.classes()).toContain('mld-pill--success')
      expect(pill.classes()).toContain('mld-pill--sm')
      expect(pill.classes()).toContain('mld-pill--disabled')
      expect(pill.classes()).toContain('mld-pill--with-icon')
    })

    it('should render with icon and remove button', () => {
      const wrapper = mount(BasePill, {
        props: {
          icon: true,
          removable: true,
        },
        slots: {
          default: 'Full Featured',
          icon: '<svg class="icon"></svg>',
        },
      })
      expect(wrapper.find('.mld-pill__icon').exists()).toBe(true)
      expect(wrapper.find('.mld-pill__remove').exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on remove button', () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Removable' },
      })
      const button = wrapper.find('.mld-pill__remove')
      expect(button.attributes('aria-label')).toBe('Remove')
    })

    it('should have proper button type', () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Removable' },
      })
      const button = wrapper.find('.mld-pill__remove')
      expect(button.attributes('type')).toBe('button')
    })
  })

  describe('edge cases', () => {
    it('should handle empty label', () => {
      const wrapper = mount(BasePill)
      expect(wrapper.find('.mld-pill__label').exists()).toBe(true)
      expect(wrapper.find('.mld-pill__label').text()).toBe('')
    })

    it('should handle long text labels', () => {
      const longText = 'This is a very long label that might need to wrap or be truncated'
      const wrapper = mount(BasePill, {
        slots: { default: longText },
      })
      expect(wrapper.find('.mld-pill__label').text()).toBe(longText)
    })

    it('should render SVG icon in remove button', () => {
      const wrapper = mount(BasePill, {
        props: { removable: true },
        slots: { default: 'Test' },
      })
      const svg = wrapper.find('.mld-pill__remove-icon')
      expect(svg.exists()).toBe(true)
      expect(svg.element.tagName).toBe('svg')
    })
  })
})
