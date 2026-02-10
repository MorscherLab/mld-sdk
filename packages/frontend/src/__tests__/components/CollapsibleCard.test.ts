import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CollapsibleCard from '../../components/CollapsibleCard.vue'

describe('CollapsibleCard', () => {
  describe('basic rendering', () => {
    it('should render with required title prop', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })
      expect(wrapper.find('.mld-collapsible-card').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__title').text()).toBe('Test Card')
    })

    it('should render subtitle when provided', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', subtitle: 'Test Subtitle' },
      })
      expect(wrapper.find('.mld-collapsible-card__subtitle').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__subtitle').text()).toBe('Test Subtitle')
    })

    it('should not render subtitle when not provided', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })
      expect(wrapper.find('.mld-collapsible-card__subtitle').exists()).toBe(false)
    })
  })

  describe('icon rendering: SVG paths', () => {
    it('should render SVG when icon starts with uppercase M', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'M12 2L2 7l10 5 10-5-10-5z',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-badge').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon').element.tagName).toBe('svg')
      expect(wrapper.find('.mld-collapsible-card__icon path').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(false)
    })

    it('should render SVG when icon starts with lowercase m', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'm12 2l-10 5 10 5 10-5-10-5z',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon').element.tagName).toBe('svg')
      expect(wrapper.find('.mld-collapsible-card__icon path').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(false)
    })

    it('should render single path element with correct d attribute', () => {
      const pathData = 'M12 2L2 7l10 5 10-5-10-5z'
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: pathData,
        },
      })

      const path = wrapper.find('.mld-collapsible-card__icon path')
      expect(path.exists()).toBe(true)
      expect(path.attributes('d')).toBe(pathData)
    })

    it('should render SVG with multiple paths when icon is an array', () => {
      const paths = [
        'M12 2L2 7l10 5 10-5-10-5z',
        'M2 17l10 5 10-5M2 12l10 5 10-5',
      ]
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: paths,
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon').element.tagName).toBe('svg')

      const pathElements = wrapper.findAll('.mld-collapsible-card__icon path')
      expect(pathElements).toHaveLength(2)
      expect(pathElements[0].attributes('d')).toBe(paths[0])
      expect(pathElements[1].attributes('d')).toBe(paths[1])
      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(false)
    })

    it('should set correct SVG attributes for path icons', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'M12 2L2 7',
        },
      })

      const svg = wrapper.find('.mld-collapsible-card__icon')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
      expect(svg.attributes('fill')).toBe('none')
      expect(svg.attributes('stroke')).toBe('currentColor')
      expect(svg.attributes('stroke-width')).toBe('2')
      expect(svg.attributes('stroke-linecap')).toBe('round')
      expect(svg.attributes('stroke-linejoin')).toBe('round')
    })
  })

  describe('icon rendering: text and emoji', () => {
    it('should render emoji as text in span element', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: '⚙',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-badge').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('⚙')
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
    })

    it('should render single letter as text in span element', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'A',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('A')
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
    })

    it('should render multi-character text as span element', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'AB',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('AB')
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
    })

    it('should handle various emoji types', () => {
      const emojis = ['🔬', '💊', '🧪', '📊', '⭐']

      emojis.forEach((emoji) => {
        const wrapper = mount(CollapsibleCard, {
          props: {
            title: 'Test Card',
            icon: emoji,
          },
        })

        expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
        expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe(emoji)
        expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
      })
    })
  })

  describe('icon rendering: edge cases', () => {
    it('should not render icon badge when icon prop is undefined', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-badge').exists()).toBe(false)
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(false)
    })

    it('should not render icon badge when icon prop is empty string', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', icon: '' },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-badge').exists()).toBe(false)
    })

    it('should render empty array as SVG with no paths', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: [],
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-badge').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(true)
      expect(wrapper.findAll('.mld-collapsible-card__icon path')).toHaveLength(0)
    })

    it('should render string starting with non-M letter as text', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'Hello',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('Hello')
      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(false)
    })

    it('should render string with M in middle as text', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'AMB',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-text').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('AMB')
    })
  })

  describe('icon styling', () => {
    it('should apply custom icon color', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'M12 2L2 7',
          iconColor: '#ff0000',
        },
      })

      const svg = wrapper.find('.mld-collapsible-card__icon')
      expect(svg.attributes('style')).toContain('color: #ff0000')
    })

    it('should apply custom icon background', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: '⚙',
          iconBg: '#00ff00',
        },
      })

      const badge = wrapper.find('.mld-collapsible-card__icon-badge')
      expect(badge.attributes('style')).toContain('background-color: #00ff00')
    })

    it('should apply color to text icons', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'A',
          iconColor: '#0000ff',
        },
      })

      const textIcon = wrapper.find('.mld-collapsible-card__icon-text')
      expect(textIcon.attributes('style')).toContain('color: #0000ff')
    })

    it('should use default background when iconBg not provided', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: '⚙',
        },
      })

      const badge = wrapper.find('.mld-collapsible-card__icon-badge')
      expect(badge.attributes('style')).toContain('background-color: var(--color-primary-soft)')
    })

    it('should use default color when iconColor not provided', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'M12 2L2 7',
        },
      })

      const svg = wrapper.find('.mld-collapsible-card__icon')
      expect(svg.attributes('style')).toContain('color: var(--color-primary)')
    })
  })

  describe('collapsible behavior', () => {
    it('should be closed by default', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      const body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')
      expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
    })

    it('should be open when defaultOpen is true', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', defaultOpen: true },
      })

      const body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).not.toBe('none')
      expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
    })

    it('should toggle open state when header is clicked', async () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      let body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')

      await wrapper.find('button').trigger('click')
      body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).not.toBe('none')

      await wrapper.find('button').trigger('click')
      body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')
    })

    it('should not toggle when disabled', async () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', disabled: true },
      })

      let body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')

      await wrapper.find('button').trigger('click')
      body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')
    })

    it('should apply disabled class and attribute', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', disabled: true },
      })

      const header = wrapper.find('button')
      expect(header.attributes('disabled')).toBeDefined()
      expect(header.classes()).toContain('mld-collapsible-card__header--disabled')
    })
  })

  describe('toggle switch', () => {
    it('should not render toggle by default', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      expect(wrapper.find('.mld-collapsible-card__toggle').exists()).toBe(false)
    })

    it('should render toggle when showToggle is true', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', showToggle: true },
      })

      expect(wrapper.find('.mld-collapsible-card__toggle').exists()).toBe(true)
      expect(wrapper.find('[role="switch"]').exists()).toBe(true)
    })

    it('should reflect toggle state', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', showToggle: true, toggleValue: true },
      })

      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-checked')).toBe('true')
      expect(toggle.classes()).toContain('mld-collapsible-card__toggle-track--on')
    })

    it('should emit update:toggleValue event', async () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', showToggle: true, toggleValue: false },
      })

      await wrapper.find('.mld-collapsible-card__toggle').trigger('click')

      expect(wrapper.emitted('update:toggleValue')).toBeTruthy()
      expect(wrapper.emitted('update:toggleValue')?.[0]).toEqual([true])
    })

    it('should stop event propagation on toggle click', async () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', showToggle: true, defaultOpen: false },
      })

      // Click toggle should not expand/collapse the card
      await wrapper.find('.mld-collapsible-card__toggle').trigger('click')
      const body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).toBe('none')
    })

    it('should apply custom toggle color when active', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          showToggle: true,
          toggleValue: true,
          toggleColor: '#ff0000',
        },
      })

      const track = wrapper.find('.mld-collapsible-card__toggle-track')
      const style = track.attributes('style')
      expect(style).toContain('background-color: #ff0000')
      expect(style).toContain('border-color: #ff0000')
    })
  })

  describe('content slot', () => {
    it('should render default slot content', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card', defaultOpen: true },
        slots: {
          default: '<p>Card content</p>',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__content').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__content').html()).toContain('Card content')
    })
  })

  describe('chevron indicator', () => {
    it('should render chevron icon', () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      expect(wrapper.find('.mld-collapsible-card__chevron').exists()).toBe(true)
    })

    it('should toggle chevron class when open', async () => {
      const wrapper = mount(CollapsibleCard, {
        props: { title: 'Test Card' },
      })

      const chevron = wrapper.find('.mld-collapsible-card__chevron')
      expect(chevron.classes()).not.toContain('mld-collapsible-card__chevron--open')

      await wrapper.find('button').trigger('click')
      expect(chevron.classes()).toContain('mld-collapsible-card__chevron--open')
    })
  })

  describe('integration: icon with other features', () => {
    it('should render SVG icon with toggle and custom colors', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          icon: 'M12 2L2 7',
          iconColor: '#ff0000',
          iconBg: '#00ff00',
          showToggle: true,
          toggleValue: true,
          toggleColor: '#0000ff',
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__toggle').exists()).toBe(true)

      const svg = wrapper.find('.mld-collapsible-card__icon')
      expect(svg.attributes('style')).toContain('color: #ff0000')

      const badge = wrapper.find('.mld-collapsible-card__icon-badge')
      expect(badge.attributes('style')).toContain('background-color: #00ff00')
    })

    it('should render emoji icon with subtitle and disabled state', () => {
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          subtitle: 'Subtitle',
          icon: '🔬',
          disabled: true,
        },
      })

      expect(wrapper.find('.mld-collapsible-card__icon-text').text()).toBe('🔬')
      expect(wrapper.find('.mld-collapsible-card__subtitle').text()).toBe('Subtitle')
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('should render multi-path icon array with all features', () => {
      const paths = ['M12 2L2 7', 'M2 17l10 5']
      const wrapper = mount(CollapsibleCard, {
        props: {
          title: 'Test Card',
          subtitle: 'Subtitle',
          icon: paths,
          iconColor: '#ff0000',
          iconBg: '#00ff00',
          showToggle: true,
          defaultOpen: true,
        },
      })

      const pathElements = wrapper.findAll('.mld-collapsible-card__icon path')
      expect(pathElements).toHaveLength(2)
      expect(wrapper.find('.mld-collapsible-card__subtitle').exists()).toBe(true)
      expect(wrapper.find('.mld-collapsible-card__toggle').exists()).toBe(true)

      const body = wrapper.find('.mld-collapsible-card__body')
      expect((body.element as HTMLElement).style.display).not.toBe('none')
    })
  })
})
