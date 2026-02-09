import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLayout from '../../components/AppLayout.vue'

describe('AppLayout', () => {
  describe('rendering with default props', () => {
    it('should render layout with default classes', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout').exists()).toBe(true)
      expect(wrapper.find('.mld-layout--sidebar-right').exists()).toBe(false)
      expect(wrapper.find('.mld-layout--floating').exists()).toBe(false)
    })

    it('should render body container', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout__body').exists()).toBe(true)
    })

    it('should render main content slot', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          default: '<p>Main content</p>',
        },
      })
      expect(wrapper.find('.mld-layout__main').exists()).toBe(true)
      expect(wrapper.find('.mld-layout__main').text()).toBe('Main content')
    })
  })

  describe('topbar slot', () => {
    it('should render topbar when slot is provided', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          topbar: '<div class="custom-topbar">Topbar</div>',
        },
      })
      expect(wrapper.find('.mld-layout__topbar').exists()).toBe(true)
      expect(wrapper.find('.custom-topbar').text()).toBe('Topbar')
    })

    it('should not render topbar when slot is not provided', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout__topbar').exists()).toBe(false)
    })
  })

  describe('sidebar slot', () => {
    it('should render sidebar when slot is provided', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          sidebar: '<div class="custom-sidebar">Sidebar</div>',
        },
      })
      expect(wrapper.find('.mld-layout__sidebar').exists()).toBe(true)
      expect(wrapper.find('.custom-sidebar').text()).toBe('Sidebar')
    })

    it('should not render sidebar when slot is not provided', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout__sidebar').exists()).toBe(false)
    })

    it('should pass collapsed prop to sidebar slot', () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarCollapsed: true },
        slots: {
          sidebar: `<template #sidebar="{ collapsed }">
            <div :data-collapsed="collapsed">Sidebar</div>
          </template>`,
        },
      })
      const sidebar = wrapper.find('[data-collapsed]')
      expect(sidebar.attributes('data-collapsed')).toBe('true')
    })

    it('should pass toggle function to sidebar slot', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          sidebar: `<template #sidebar="{ toggle }">
            <button @click="toggle">Toggle</button>
          </template>`,
        },
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('sidebarPosition prop', () => {
    it('should default to left position', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout--sidebar-right').exists()).toBe(false)
    })

    it('should add right class when sidebarPosition is right', () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarPosition: 'right' },
      })
      expect(wrapper.find('.mld-layout--sidebar-right').exists()).toBe(true)
    })

    it('should not add right class when sidebarPosition is left', () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarPosition: 'left' },
      })
      expect(wrapper.find('.mld-layout--sidebar-right').exists()).toBe(false)
    })
  })

  describe('floating prop', () => {
    it('should not add floating class by default', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout--floating').exists()).toBe(false)
    })

    it('should add floating class when floating is true', () => {
      const wrapper = mount(AppLayout, {
        props: { floating: true },
      })
      expect(wrapper.find('.mld-layout--floating').exists()).toBe(true)
    })
  })

  describe('sidebar width styling', () => {
    it('should not apply inline width when default auto is used (expanded)', () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarCollapsed: false },
        slots: { sidebar: '<div>Nav</div>' },
      })
      const sidebar = wrapper.find('.mld-layout__sidebar')
      expect(sidebar.attributes('style')).toBeUndefined()
    })

    it('should not apply inline width when default auto is used (collapsed)', () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarCollapsed: true },
        slots: { sidebar: '<div>Nav</div>' },
      })
      const sidebar = wrapper.find('.mld-layout__sidebar')
      expect(sidebar.attributes('style')).toBeUndefined()
    })

    it('should apply custom sidebar width', () => {
      const wrapper = mount(AppLayout, {
        props: {
          sidebarWidth: '300px',
          sidebarCollapsed: false,
        },
        slots: { sidebar: '<div>Nav</div>' },
      })
      const sidebar = wrapper.find('.mld-layout__sidebar')
      expect(sidebar.attributes('style')).toContain('width: 300px')
    })

    it('should apply custom collapsed width', () => {
      const wrapper = mount(AppLayout, {
        props: {
          sidebarCollapsedWidth: '80px',
          sidebarCollapsed: true,
        },
        slots: { sidebar: '<div>Nav</div>' },
      })
      const sidebar = wrapper.find('.mld-layout__sidebar')
      expect(sidebar.attributes('style')).toContain('width: 80px')
    })
  })

  describe('v-model:sidebarCollapsed', () => {
    it('should emit update:sidebarCollapsed when toggle is called', async () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarCollapsed: false },
        slots: {
          sidebar: `<template #sidebar="{ toggle }">
            <button @click="toggle" data-test="toggle-btn">Toggle</button>
          </template>`,
        },
      })

      await wrapper.find('[data-test="toggle-btn"]').trigger('click')
      expect(wrapper.emitted('update:sidebarCollapsed')).toHaveLength(1)
      expect(wrapper.emitted('update:sidebarCollapsed')?.[0]).toEqual([true])
    })

    it('should emit false when collapsed is true', async () => {
      const wrapper = mount(AppLayout, {
        props: { sidebarCollapsed: true },
        slots: {
          sidebar: `<template #sidebar="{ toggle }">
            <button @click="toggle" data-test="toggle-btn">Toggle</button>
          </template>`,
        },
      })

      await wrapper.find('[data-test="toggle-btn"]').trigger('click')
      expect(wrapper.emitted('update:sidebarCollapsed')?.[0]).toEqual([false])
    })
  })

  describe('integration: all slots', () => {
    it('should render topbar, sidebar, and main content together', () => {
      const wrapper = mount(AppLayout, {
        slots: {
          topbar: '<div class="topbar-content">Header</div>',
          sidebar: '<div class="sidebar-content">Nav</div>',
          default: '<div class="main-content">Content</div>',
        },
      })

      expect(wrapper.find('.topbar-content').text()).toBe('Header')
      expect(wrapper.find('.sidebar-content').text()).toBe('Nav')
      expect(wrapper.find('.main-content').text()).toBe('Content')
    })

    it('should apply multiple modifier classes', () => {
      const wrapper = mount(AppLayout, {
        props: {
          sidebarPosition: 'right',
          floating: true,
        },
      })

      const layout = wrapper.find('.mld-layout')
      expect(layout.classes()).toContain('mld-layout--sidebar-right')
      expect(layout.classes()).toContain('mld-layout--floating')
    })
  })

  describe('edge cases', () => {
    it('should handle empty default slot', () => {
      const wrapper = mount(AppLayout)
      expect(wrapper.find('.mld-layout__main').exists()).toBe(true)
      expect(wrapper.find('.mld-layout__main').text()).toBe('')
    })

    it('should handle sidebar width with different units', () => {
      const wrapper = mount(AppLayout, {
        props: {
          sidebarWidth: '20rem',
          sidebarCollapsedWidth: '4rem',
          sidebarCollapsed: false,
        },
        slots: { sidebar: '<div>Nav</div>' },
      })
      const sidebar = wrapper.find('.mld-layout__sidebar')
      expect(sidebar.attributes('style')).toContain('width: 20rem')
    })
  })
})
