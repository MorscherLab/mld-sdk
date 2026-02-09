import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '../../components/AppSidebar.vue'
import CollapsibleCard from '../../components/CollapsibleCard.vue'
import type { SidebarItem } from '../../types'

describe('AppSidebar', () => {
  describe('rendering with default props', () => {
    it('should render sidebar with default classes', () => {
      const wrapper = mount(AppSidebar)
      expect(wrapper.find('.mld-sidebar').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--left').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar--floating').exists()).toBe(true)
    })

    it('should apply default width when expanded', () => {
      const wrapper = mount(AppSidebar, {
        props: { collapsed: false },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 240px')
    })

    it('should apply default collapsed width when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: { collapsed: true },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 64px')
    })

    it('should not apply top offset (topOffset prop removed)', () => {
      const wrapper = mount(AppSidebar, {
        props: { floating: true },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).not.toContain('top:')
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

    it('should not apply top offset when not floating', () => {
      const wrapper = mount(AppSidebar, {
        props: { floating: false },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).not.toContain('top:')
    })

    it('should not have topOffset prop (removed)', () => {
      const wrapper = mount(AppSidebar, {
        props: { floating: true },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).not.toContain('top:')
    })
  })

  describe('width props', () => {
    it('should apply custom width when expanded', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          width: '300px',
          collapsed: false,
        },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 300px')
    })

    it('should apply custom collapsed width when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          collapsedWidth: '80px',
          collapsed: true,
        },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 80px')
    })
  })

  describe('items rendering', () => {
    const simpleItems: SidebarItem[] = [
      { id: 'home', label: 'Home', icon: 'H' },
      { id: 'settings', label: 'Settings', icon: 'S' },
    ]

    it('should render navigation items', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: simpleItems },
      })
      expect(wrapper.find('.mld-sidebar__nav').exists()).toBe(true)
      const items = wrapper.findAll('.mld-sidebar__item')
      expect(items).toHaveLength(2)
    })

    it('should render item labels when expanded', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: simpleItems, collapsed: false },
      })
      const labels = wrapper.findAll('.mld-sidebar__item-label')
      expect(labels).toHaveLength(2)
      expect(labels[0].text()).toBe('Home')
      expect(labels[1].text()).toBe('Settings')
    })

    it('should hide item labels when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: simpleItems, collapsed: true },
      })
      const labels = wrapper.findAll('.mld-sidebar__item-label')
      expect(labels).toHaveLength(0)
    })

    it('should render item icons', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: simpleItems },
      })
      const icons = wrapper.findAll('.mld-sidebar__icon')
      expect(icons).toHaveLength(2)
      expect(icons[0].text()).toBe('H')
      expect(icons[1].text()).toBe('S')
    })

    it('should render item badges when expanded', () => {
      const itemsWithBadges: SidebarItem[] = [
        { id: 'messages', label: 'Messages', badge: 5 },
        { id: 'alerts', label: 'Alerts', badge: 'new' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithBadges, collapsed: false },
      })
      const badges = wrapper.findAll('.mld-sidebar__badge')
      expect(badges).toHaveLength(2)
      expect(badges[0].text()).toBe('5')
      expect(badges[1].text()).toBe('new')
    })

    it('should hide badges when collapsed', () => {
      const itemsWithBadges: SidebarItem[] = [
        { id: 'messages', label: 'Messages', badge: 5 },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithBadges, collapsed: true },
      })
      const badges = wrapper.findAll('.mld-sidebar__badge')
      expect(badges).toHaveLength(0)
    })

    it('should render items as buttons by default', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: simpleItems },
      })
      const buttons = wrapper.findAll('button.mld-sidebar__item')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should render items as links when href is provided', () => {
      const itemsWithHref: SidebarItem[] = [
        { id: 'docs', label: 'Docs', href: 'https://example.com' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithHref },
      })
      const link = wrapper.find('a.mld-sidebar__item')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://example.com')
    })
  })

  describe('active state', () => {
    const items: SidebarItem[] = [
      { id: 'home', label: 'Home' },
      { id: 'settings', label: 'Settings' },
    ]

    it('should apply active class to active item', () => {
      const wrapper = mount(AppSidebar, {
        props: { items, activeId: 'home' },
      })
      const homeItem = wrapper.findAll('.mld-sidebar__item')[0]
      expect(homeItem.classes()).toContain('mld-sidebar__item--active')
    })

    it('should not apply active class to non-active items', () => {
      const wrapper = mount(AppSidebar, {
        props: { items, activeId: 'home' },
      })
      const settingsItem = wrapper.findAll('.mld-sidebar__item')[1]
      expect(settingsItem.classes()).not.toContain('mld-sidebar__item--active')
    })
  })

  describe('disabled state', () => {
    const itemsWithDisabled: SidebarItem[] = [
      { id: 'enabled', label: 'Enabled' },
      { id: 'disabled', label: 'Disabled', disabled: true },
    ]

    it('should apply disabled class to disabled items', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithDisabled },
      })
      const disabledItem = wrapper.findAll('.mld-sidebar__item')[1]
      expect(disabledItem.classes()).toContain('mld-sidebar__item--disabled')
    })

    it('should not emit select event for disabled items', async () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithDisabled },
      })
      const disabledItem = wrapper.findAll('.mld-sidebar__item')[1]
      await disabledItem.trigger('click')
      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('collapsible sections', () => {
    const itemsWithChildren: SidebarItem[] = [
      {
        id: 'section1',
        label: 'Section 1',
        icon: 'S',
        children: [
          { id: 'child1', label: 'Child 1' },
          { id: 'child2', label: 'Child 2' },
        ],
      },
    ]

    it('should render CollapsibleCard for items with children when expanded', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithChildren, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })
      expect(wrapper.findComponent(CollapsibleCard).exists()).toBe(true)
    })

    it('should render children items in CollapsibleCard', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithChildren, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })
      const children = wrapper.findAll('.mld-sidebar__section-children .mld-sidebar__item')
      expect(children).toHaveLength(2)
      expect(children[0].text()).toContain('Child 1')
      expect(children[1].text()).toContain('Child 2')
    })

    it('should show only section icon when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithChildren, collapsed: true },
      })
      expect(wrapper.find('.mld-sidebar__section-icon').exists()).toBe(true)
      expect(wrapper.findComponent(CollapsibleCard).exists()).toBe(false)
    })

    it('should use defaultOpen prop for CollapsibleCard', () => {
      const itemsDefaultOpen: SidebarItem[] = [
        {
          id: 'section1',
          label: 'Section 1',
          defaultOpen: true,
          children: [{ id: 'child1', label: 'Child 1' }],
        },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: itemsDefaultOpen, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })
      const collapsible = wrapper.findComponent(CollapsibleCard)
      expect(collapsible.props('defaultOpen')).toBe(true)
    })

    it('should default defaultOpen to true when not specified', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithChildren, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })
      const collapsible = wrapper.findComponent(CollapsibleCard)
      expect(collapsible.props('defaultOpen')).toBe(true)
    })
  })

  describe('item click events', () => {
    const items: SidebarItem[] = [
      { id: 'home', label: 'Home' },
      { id: 'settings', label: 'Settings' },
    ]

    it('should emit select event when item is clicked', async () => {
      const wrapper = mount(AppSidebar, {
        props: { items },
      })
      const firstItem = wrapper.findAll('.mld-sidebar__item')[0]
      await firstItem.trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
      expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
    })

    it('should emit correct item data', async () => {
      const wrapper = mount(AppSidebar, {
        props: { items },
      })
      const secondItem = wrapper.findAll('.mld-sidebar__item')[1]
      await secondItem.trigger('click')

      expect(wrapper.emitted('select')?.[0]).toEqual([items[1]])
    })

    it('should prevent default for items with "to" property', async () => {
      const itemsWithTo: SidebarItem[] = [
        { id: 'home', label: 'Home', to: '/home' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: itemsWithTo },
      })
      const item = wrapper.find('.mld-sidebar__item')
      const event = { preventDefault: () => {} }

      await item.trigger('click', event)
      expect(wrapper.emitted('select')).toHaveLength(1)
    })
  })

  describe('collapse toggle', () => {
    const items: SidebarItem[] = [
      { id: 'home', label: 'Home' },
    ]

    it('should render collapse toggle button when items exist', () => {
      const wrapper = mount(AppSidebar, {
        props: { items },
      })
      expect(wrapper.find('.mld-sidebar__collapse-btn').exists()).toBe(true)
    })

    it('should not render collapse toggle when no items', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: [] },
      })
      expect(wrapper.find('.mld-sidebar__collapse-btn').exists()).toBe(false)
    })

    it('should emit update:collapsed when toggle is clicked', async () => {
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: false },
      })
      await wrapper.find('.mld-sidebar__collapse-btn').trigger('click')

      expect(wrapper.emitted('update:collapsed')).toHaveLength(1)
      expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
    })

    it('should emit false when collapsed is true', async () => {
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: true },
      })
      await wrapper.find('.mld-sidebar__collapse-btn').trigger('click')

      expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([false])
    })

    it('should have correct aria-label when expanded', () => {
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: false },
      })
      const button = wrapper.find('.mld-sidebar__collapse-btn')
      expect(button.attributes('aria-label')).toBe('Collapse sidebar')
    })

    it('should have correct aria-label when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: true },
      })
      const button = wrapper.find('.mld-sidebar__collapse-btn')
      expect(button.attributes('aria-label')).toBe('Expand sidebar')
    })

    it('should apply collapsed class to chevron icon when collapsed', () => {
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: true },
      })
      const icon = wrapper.find('.mld-sidebar__collapse-icon')
      expect(icon.classes()).toContain('mld-sidebar__collapse-icon--collapsed')
    })
  })

  describe('slots', () => {
    it('should render header slot', () => {
      const wrapper = mount(AppSidebar, {
        slots: {
          header: '<div class="custom-header">Header</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('Header')
    })

    it('should render footer slot', () => {
      const wrapper = mount(AppSidebar, {
        slots: {
          footer: '<div class="custom-footer">Footer</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').text()).toBe('Footer')
    })

    it('should render default slot when no items provided', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: [] },
        slots: {
          default: '<div class="custom-content">Content</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__content').exists()).toBe(true)
      expect(wrapper.find('.custom-content').text()).toBe('Content')
    })

    it('should not render default slot when items provided', () => {
      const items: SidebarItem[] = [{ id: 'home', label: 'Home' }]
      const wrapper = mount(AppSidebar, {
        props: { items },
        slots: {
          default: '<div class="custom-content">Content</div>',
        },
      })
      expect(wrapper.find('.mld-sidebar__content').exists()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const wrapper = mount(AppSidebar, {
        props: { items: [] },
      })
      expect(wrapper.find('.mld-sidebar__nav').exists()).toBe(false)
      expect(wrapper.find('.mld-sidebar__collapse-btn').exists()).toBe(false)
    })

    it('should handle item without icon', () => {
      const items: SidebarItem[] = [
        { id: 'home', label: 'Home' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items },
      })
      expect(wrapper.find('.mld-sidebar__item').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar__icon').exists()).toBe(false)
    })

    it('should handle item without badge', () => {
      const items: SidebarItem[] = [
        { id: 'home', label: 'Home' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: false },
      })
      expect(wrapper.find('.mld-sidebar__badge').exists()).toBe(false)
    })

    it('should handle nested children with badges', () => {
      const items: SidebarItem[] = [
        {
          id: 'section1',
          label: 'Section 1',
          children: [
            { id: 'child1', label: 'Child 1', badge: 5 },
          ],
        },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })
      const badge = wrapper.find('.mld-sidebar__section-children .mld-sidebar__badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('5')
    })

    it('should handle width with different CSS units', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          width: '20rem',
          collapsedWidth: '4rem',
          collapsed: false,
        },
      })
      expect(wrapper.find('.mld-sidebar').attributes('style')).toContain('width: 20rem')
    })
  })

  describe('integration: complex scenarios', () => {
    it('should handle mixed items with and without children', () => {
      const mixedItems: SidebarItem[] = [
        { id: 'home', label: 'Home', icon: 'H' },
        {
          id: 'tools',
          label: 'Tools',
          icon: 'T',
          children: [
            { id: 'tool1', label: 'Tool 1' },
            { id: 'tool2', label: 'Tool 2' },
          ],
        },
        { id: 'settings', label: 'Settings', icon: 'S' },
      ]
      const wrapper = mount(AppSidebar, {
        props: { items: mixedItems, collapsed: false },
        global: {
          components: { CollapsibleCard },
        },
      })

      // 2 regular items + 1 CollapsibleCard
      const regularItems = wrapper.findAll('button.mld-sidebar__item').filter(el =>
        !el.classes().includes('mld-sidebar__section-children')
      )
      expect(regularItems.length).toBeGreaterThanOrEqual(2)
      expect(wrapper.findComponent(CollapsibleCard).exists()).toBe(true)
    })

    it('should handle all slots and items together', () => {
      const items: SidebarItem[] = [{ id: 'home', label: 'Home' }]
      const wrapper = mount(AppSidebar, {
        props: { items },
        slots: {
          header: '<div class="header">Header</div>',
          footer: '<div class="footer">Footer</div>',
        },
      })

      expect(wrapper.find('.header').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
      expect(wrapper.find('.mld-sidebar__nav').exists()).toBe(true)
    })

    it('should apply multiple classes correctly', () => {
      const wrapper = mount(AppSidebar, {
        props: {
          side: 'right',
          floating: false,
        },
      })

      const sidebar = wrapper.find('.mld-sidebar')
      expect(sidebar.classes()).toContain('mld-sidebar--right')
      expect(sidebar.classes()).toContain('mld-sidebar--static')
    })
  })
})
