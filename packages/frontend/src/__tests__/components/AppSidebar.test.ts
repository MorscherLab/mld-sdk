import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '../../components/AppSidebar.vue'
import CollapsibleCard from '../../components/CollapsibleCard.vue'
import type { SidebarToolSection } from '../../types'

const samplePanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    { id: 'parameters', label: 'Parameters', icon: '⚙' },
    { id: 'filters', label: 'Filters', icon: '🔍', defaultOpen: false },
  ],
  results: [
    { id: 'display', label: 'Display Options' },
  ],
}

describe('AppSidebar', () => {
  describe('rendering with default props', () => {
    it('should render sidebar with default classes', () => {
      const wrapper = mount(AppSidebar)
      expect(wrapper.find('.mld-sidebar').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--left').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--floating').exists()).toBe(true)
    })

    it('should apply default width', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 280px')
    })

    it('should be hidden when no panels match active view', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'settings' },
      })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })

    it('should be hidden when activeView is empty', () => {
      const wrapper = mount(AppSidebar)
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })
  })

  describe('side prop', () => {
    it('should default to left side', () => {
      const wrapper = mount(AppSidebar)
      expect(wrapper.find('.mld-sidebar--left').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--right').exists()).toBe(false)
    })

    it('should apply right side class', () => {
      const wrapper = mount(AppSidebar, {
        props: { side: 'right' },
      })
      expect(wrapper.find('.mld-sidebar--right').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--left').exists()).toBe(false)
    })
  })

  describe('floating prop', () => {
    it('should apply floating class by default', () => {
      const wrapper = mount(AppSidebar)
      expect(wrapper.find('.mld-sidebar--floating').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--static').exists()).toBe(false)
    })

    it('should apply static class when floating is false', () => {
      const wrapper = mount(AppSidebar, {
        props: { floating: false },
      })
      expect(wrapper.find('.mld-sidebar--static').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--floating').exists()).toBe(false)
    })
  })

  describe('width prop', () => {
    it('should apply custom width', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          panels: samplePanels,
          activeView: 'analysis',
          width: '300px',
        },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 300px')
    })

    it('should handle different CSS units', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          panels: samplePanels,
          activeView: 'analysis',
          width: '20rem',
        },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 20rem')
    })
  })

  describe('panels and activeView', () => {
    it('should render sections for active view', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      const sections = wrapper.findAll('.mld-sidebar__section')
      expect(sections).toHaveLength(2)
    })

    it('should render CollapsibleCard for each section', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      const cards = wrapper.findAllComponents(CollapsibleCard)
      expect(cards).toHaveLength(2)
    })

    it('should pass section label as title to CollapsibleCard', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      const cards = wrapper.findAllComponents(CollapsibleCard)
      expect(cards[0].props('title')).toBe('Parameters')
      expect(cards[1].props('title')).toBe('Filters')
    })

    it('should pass section icon to CollapsibleCard', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      const cards = wrapper.findAllComponents(CollapsibleCard)
      expect(cards[0].props('icon')).toBe('⚙')
    })

    it('should respect defaultOpen on sections', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      const cards = wrapper.findAllComponents(CollapsibleCard)
      expect(cards[0].props('defaultOpen')).toBe(true)
      expect(cards[1].props('defaultOpen')).toBe(false)
    })

    it('should switch sections when activeView changes', async () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      expect(wrapper.findAllComponents(CollapsibleCard)).toHaveLength(2)

      await wrapper.setProps({ activeView: 'results' })
      expect(wrapper.findAllComponents(CollapsibleCard)).toHaveLength(1)
    })

    it('should hide when switching to view with no panels', async () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
      })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(false)

      await wrapper.setProps({ activeView: 'settings' })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })
  })

  describe('section slots', () => {
    it('should render named section slots', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
        slots: {
          'section-parameters': '<div class="params-content">Parameters content</div>',
          'section-filters': '<div class="filters-content">Filters content</div>',
        },
      })
      expect(wrapper.find('.params-content').exists()).toBe(true)
      expect(wrapper.find('.filters-content').exists()).toBe(true)
    })

    it('should not render section slots for inactive view', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'results' },
        global: { components: { CollapsibleCard } },
        slots: {
          'section-parameters': '<div class="params-content">Parameters content</div>',
          'section-display': '<div class="display-content">Display content</div>',
        },
      })
      expect(wrapper.find('.params-content').exists()).toBe(false)
      expect(wrapper.find('.display-content').exists()).toBe(true)
    })
  })

  describe('slots', () => {
    it('should render header slot', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        slots: {
          header: '<div class="custom-header">Header</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('Header')
    })

    it('should render footer slot', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        slots: {
          footer: '<div class="custom-footer">Footer</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').text()).toBe('Footer')
    })

    it('should not render header when slot is not provided', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
      })
      expect(wrapper.find('.mld-sidebar__header').exists()).toBe(false)
    })

    it('should not render footer when slot is not provided', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
      })
      expect(wrapper.find('.mld-sidebar__footer').exists()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty panels object', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: {}, activeView: 'analysis' },
      })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })

    it('should handle view with empty sections array', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: { empty: [] }, activeView: 'empty' },
      })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })

    it('should handle undefined activeView', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels },
      })
      expect(wrapper.find('.mld-sidebar--hidden').exists()).toBe(true)
    })
  })

  describe('integration: multiple classes', () => {
    it('should apply multiple classes correctly', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          side: 'left',
          floating: false,
        },
      })

      const sidebar = wrapper.find('.mld-sidebar')
      expect(sidebar.classes()).toContain('mld-sidebar--left')
      expect(sidebar.classes()).toContain('mld-sidebar--static')
    })

    it('should render all slots with sections', () => {
      const wrapper = mount(AppSidebar, {
        props: { panels: samplePanels, activeView: 'analysis' },
        global: { components: { CollapsibleCard } },
        slots: {
          header: '<div class="header">Header</div>',
          footer: '<div class="footer">Footer</div>',
          'section-parameters': '<div>Params</div>',
        },
      })

      expect(wrapper.find('.header').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar__sections').exists()).toBe(true)
    })
  })
})
