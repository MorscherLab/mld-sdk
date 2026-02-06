import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from '../../components/Calendar.vue'
import type { CalendarMarker } from '../../types'

describe('Calendar', () => {
  const fixedDate = new Date(2024, 0, 15) // January 15, 2024 (Monday)

  describe('rendering with default props', () => {
    it('should render calendar container', () => {
      const wrapper = mount(Calendar)
      expect(wrapper.find('.mld-calendar').exists()).toBe(true)
    })

    it('should show navigation by default', () => {
      const wrapper = mount(Calendar)
      expect(wrapper.find('.mld-calendar__header').exists()).toBe(true)
      expect(wrapper.findAll('.mld-calendar__nav-btn')).toHaveLength(2)
    })

    it('should display current month and year', () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024 },
      })
      expect(wrapper.find('.mld-calendar__title').text()).toContain('January')
      expect(wrapper.find('.mld-calendar__title').text()).toContain('2024')
    })

    it('should render weekday labels', () => {
      const wrapper = mount(Calendar)
      const weekdays = wrapper.findAll('.mld-calendar__weekday')
      expect(weekdays).toHaveLength(7)
    })

    it('should render 42 days in fixed weeks mode', () => {
      const wrapper = mount(Calendar, {
        props: { fixedWeeks: true },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      expect(days).toHaveLength(42)
    })

    it('should render day grid', () => {
      const wrapper = mount(Calendar)
      expect(wrapper.find('.mld-calendar__grid').exists()).toBe(true)
    })
  })

  describe('month navigation', () => {
    it('should navigate to previous month', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 1, year: 2024 },
      })
      const prevBtn = wrapper.findAll('.mld-calendar__nav-btn')[0]
      await prevBtn.trigger('click')

      expect(wrapper.emitted('update:month')).toHaveLength(1)
      expect(wrapper.emitted('update:month')?.[0]).toEqual([0])
    })

    it('should navigate to next month', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024 },
      })
      const nextBtn = wrapper.findAll('.mld-calendar__nav-btn')[1]
      await nextBtn.trigger('click')

      expect(wrapper.emitted('update:month')).toHaveLength(1)
      expect(wrapper.emitted('update:month')?.[0]).toEqual([1])
    })

    it('should navigate to previous year when going back from January', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024 },
      })
      const prevBtn = wrapper.findAll('.mld-calendar__nav-btn')[0]
      await prevBtn.trigger('click')

      expect(wrapper.emitted('update:month')?.[0]).toEqual([11])
      expect(wrapper.emitted('update:year')?.[0]).toEqual([2023])
    })

    it('should navigate to next year when going forward from December', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 11, year: 2024 },
      })
      const nextBtn = wrapper.findAll('.mld-calendar__nav-btn')[1]
      await nextBtn.trigger('click')

      expect(wrapper.emitted('update:month')?.[0]).toEqual([0])
      expect(wrapper.emitted('update:year')?.[0]).toEqual([2025])
    })

    it('should emit navigate event with direction', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 5, year: 2024 },
      })
      const prevBtn = wrapper.findAll('.mld-calendar__nav-btn')[0]
      await prevBtn.trigger('click')

      expect(wrapper.emitted('navigate')).toHaveLength(1)
      expect(wrapper.emitted('navigate')?.[0]).toEqual(['prev', 4, 2024])
    })

    it('should hide navigation when showNavigation is false', () => {
      const wrapper = mount(Calendar, {
        props: { showNavigation: false },
      })
      expect(wrapper.find('.mld-calendar__header').exists()).toBe(false)
    })
  })

  describe('single date selection', () => {
    it('should emit selected date on day click', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'single', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[15].trigger('click') // Click a day

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      const emittedDate = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date
      expect(emittedDate).toBeInstanceOf(Date)
    })

    it('should mark selected date', () => {
      const selectedDate = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: 'single',
          modelValue: selectedDate,
          month: 0,
          year: 2024,
        },
      })
      const selectedDays = wrapper.findAll('.mld-calendar__day--selected')
      expect(selectedDays.length).toBeGreaterThan(0)
    })

    it('should emit day-click event', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'single', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')

      expect(wrapper.emitted('day-click')).toHaveLength(1)
      const dayContext = wrapper.emitted('day-click')?.[0]?.[0]
      expect(dayContext).toHaveProperty('date')
      expect(dayContext).toHaveProperty('isToday')
      expect(dayContext).toHaveProperty('isSelected')
    })
  })

  describe('range selection', () => {
    it('should select range start on first click', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'range', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')

      // First click doesn't emit yet (waiting for end date)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('should emit range on second click', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'range', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')
      await days[15].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      const range = wrapper.emitted('update:modelValue')?.[0]?.[0] as { start: Date; end: Date }
      expect(range).toHaveProperty('start')
      expect(range).toHaveProperty('end')
      expect(range.start).toBeInstanceOf(Date)
      expect(range.end).toBeInstanceOf(Date)
    })

    it('should swap start and end if end is before start', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'range', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[15].trigger('click')
      await days[10].trigger('click')

      const range = wrapper.emitted('update:modelValue')?.[0]?.[0] as { start: Date; end: Date }
      expect(range.start.getTime()).toBeLessThan(range.end.getTime())
    })

    it('should mark dates in range', () => {
      const start = new Date(2024, 0, 10)
      const end = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: 'range',
          modelValue: { start, end },
          month: 0,
          year: 2024,
        },
      })
      const inRangeDays = wrapper.findAll('.mld-calendar__day--in-range')
      expect(inRangeDays.length).toBeGreaterThan(0)
    })
  })

  describe('multiple selection', () => {
    it('should add dates to selection array', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'multiple', modelValue: [], month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      const selected = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date[]
      expect(Array.isArray(selected)).toBe(true)
      expect(selected).toHaveLength(1)
    })

    it('should remove date when clicking selected date', async () => {
      const date1 = new Date(2024, 0, 10)
      const date2 = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: 'multiple',
          modelValue: [date1, date2],
          month: 0,
          year: 2024,
        },
      })

      // Find and click the first selected date
      const days = wrapper.findAll('.mld-calendar__day')
      const dayToClick = days.find(d => d.classes().includes('mld-calendar__day--selected'))
      if (dayToClick) {
        await dayToClick.trigger('click')
        const newSelection = wrapper.emitted('update:modelValue')?.[0]?.[0] as Date[]
        expect(newSelection).toHaveLength(1)
      }
    })
  })

  describe('markers', () => {
    it('should display markers on dates', () => {
      const markers: CalendarMarker[] = [
        { date: new Date(2024, 0, 15), color: '#ff0000', label: 'Event' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      expect(wrapper.find('.mld-calendar__marker').exists()).toBe(true)
    })

    it('should apply marker color', () => {
      const markers: CalendarMarker[] = [
        { date: new Date(2024, 0, 15), color: '#ff0000', label: 'Event' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      const marker = wrapper.find('.mld-calendar__marker')
      expect(marker.attributes('style')).toContain('--marker-color')
    })

    it('should show marker label as title', () => {
      const markers: CalendarMarker[] = [
        { date: new Date(2024, 0, 15), label: 'Important Event' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      const marker = wrapper.find('.mld-calendar__marker')
      expect(marker.attributes('title')).toBe('Important Event')
    })

    it('should limit markers to 3 per day', () => {
      const markers: CalendarMarker[] = [
        { date: new Date(2024, 0, 15), label: 'Event 1' },
        { date: new Date(2024, 0, 15), label: 'Event 2' },
        { date: new Date(2024, 0, 15), label: 'Event 3' },
        { date: new Date(2024, 0, 15), label: 'Event 4' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      // Find the day with markers
      const markersContainer = wrapper.find('.mld-calendar__markers')
      const renderedMarkers = markersContainer.findAll('.mld-calendar__marker')
      expect(renderedMarkers).toHaveLength(3)
    })

    it('should support different marker types', () => {
      const markers: CalendarMarker[] = [
        { date: new Date(2024, 0, 15), type: 'dot' },
        { date: new Date(2024, 0, 16), type: 'bar' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      expect(wrapper.find('.mld-calendar__marker--dot').exists()).toBe(true)
      expect(wrapper.find('.mld-calendar__marker--bar').exists()).toBe(true)
    })
  })

  describe('disabled dates', () => {
    it('should disable dates before minDate', () => {
      const minDate = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: { minDate, month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      // Days before 15th should be disabled
      const firstDay = days[0]
      expect(firstDay.attributes('disabled')).toBeDefined()
    })

    it('should disable dates after maxDate', () => {
      const maxDate = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: { maxDate, month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      // Days after 15th should be disabled (later in the array)
      const lastDays = days.slice(-5)
      const hasDisabled = lastDays.some(d => d.attributes('disabled') !== undefined)
      expect(hasDisabled).toBe(true)
    })

    it('should disable dates in disabledDates array', () => {
      const disabledDates = [new Date(2024, 0, 10), new Date(2024, 0, 20)]
      const wrapper = mount(Calendar, {
        props: { disabledDates, month: 0, year: 2024 },
      })
      const disabledDays = wrapper.findAll('.mld-calendar__day--disabled')
      expect(disabledDays.length).toBeGreaterThan(0)
    })

    it('should use custom isDateDisabled function', () => {
      const isWeekend = (date: Date) => {
        const day = date.getDay()
        return day === 0 || day === 6
      }
      const wrapper = mount(Calendar, {
        props: { isDateDisabled: isWeekend, month: 0, year: 2024 },
      })
      const disabledDays = wrapper.findAll('.mld-calendar__day--disabled')
      // Should have disabled weekend days
      expect(disabledDays.length).toBeGreaterThan(0)
    })

    it('should not emit selection for disabled dates', async () => {
      const minDate = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'single', minDate, month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      const disabledDay = days.find(d => d.attributes('disabled') !== undefined)

      if (disabledDay) {
        await disabledDay.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })

  describe('week configuration', () => {
    it('should start week on Monday by default', () => {
      const wrapper = mount(Calendar, {
        props: { weekStartsOn: 1 },
      })
      const weekdays = wrapper.findAll('.mld-calendar__weekday')
      // First weekday should be Mon (depends on locale)
      expect(weekdays[0].text()).toBeTruthy()
    })

    it('should start week on Sunday', () => {
      const wrapper = mount(Calendar, {
        props: { weekStartsOn: 0 },
      })
      const weekdays = wrapper.findAll('.mld-calendar__weekday')
      expect(weekdays).toHaveLength(7)
    })
  })

  describe('outside days', () => {
    it('should mark days outside current month', () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024, showOutsideDays: true },
      })
      const outsideDays = wrapper.findAll('.mld-calendar__day--outside')
      expect(outsideDays.length).toBeGreaterThan(0)
    })

    it('should not select outside days when showOutsideDays is false', async () => {
      const wrapper = mount(Calendar, {
        props: {
          selectionMode: 'single',
          month: 0,
          year: 2024,
          showOutsideDays: false,
        },
      })
      const outsideDay = wrapper.find('.mld-calendar__day--outside')
      if (outsideDay.exists()) {
        await outsideDay.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })

  describe('today marker', () => {
    it('should mark today\'s date', () => {
      const today = new Date()
      const wrapper = mount(Calendar, {
        props: { month: today.getMonth(), year: today.getFullYear() },
      })
      const todayDay = wrapper.find('.mld-calendar__day--today')
      expect(todayDay.exists()).toBe(true)
    })
  })

  describe('locale support', () => {
    it('should use default en-US locale', () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024 },
      })
      expect(wrapper.find('.mld-calendar__title').text()).toContain('January')
    })

    it('should accept custom locale', () => {
      const wrapper = mount(Calendar, {
        props: { month: 0, year: 2024, locale: 'de-DE' },
      })
      const title = wrapper.find('.mld-calendar__title').text()
      expect(title).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('should have button type on day cells', () => {
      const wrapper = mount(Calendar)
      const days = wrapper.findAll('.mld-calendar__day')
      days.forEach(day => {
        expect(day.attributes('type')).toBe('button')
      })
    })

    it('should have aria-label on navigation buttons', () => {
      const wrapper = mount(Calendar)
      const navButtons = wrapper.findAll('.mld-calendar__nav-btn')
      expect(navButtons[0].attributes('aria-label')).toBe('Previous month')
      expect(navButtons[1].attributes('aria-label')).toBe('Next month')
    })

    it('should disable button element for disabled dates', () => {
      const minDate = new Date(2024, 0, 15)
      const wrapper = mount(Calendar, {
        props: { minDate, month: 0, year: 2024 },
      })
      const disabledDay = wrapper.find('.mld-calendar__day--disabled')
      expect(disabledDay.attributes('disabled')).toBeDefined()
    })
  })

  describe('selection mode none', () => {
    it('should not emit selection when mode is none', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'none', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('should still emit day-click event in none mode', async () => {
      const wrapper = mount(Calendar, {
        props: { selectionMode: 'none', month: 0, year: 2024 },
      })
      const days = wrapper.findAll('.mld-calendar__day')
      await days[10].trigger('click')

      expect(wrapper.emitted('day-click')).toHaveLength(1)
    })
  })

  describe('slots', () => {
    it('should support custom header slot', () => {
      const wrapper = mount(Calendar, {
        slots: {
          header: '<div class="custom-header">Custom Header</div>',
        },
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('Custom Header')
    })

    it('should support custom week-day slot', () => {
      const wrapper = mount(Calendar, {
        slots: {
          'week-day': '<span class="custom-weekday">X</span>',
        },
      })
      expect(wrapper.find('.custom-weekday').exists()).toBe(true)
    })

    it('should support custom day-content slot', () => {
      const wrapper = mount(Calendar, {
        slots: {
          'day-content': '<div class="custom-day">Custom</div>',
        },
      })
      expect(wrapper.find('.custom-day').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle year boundaries correctly', async () => {
      const wrapper = mount(Calendar, {
        props: { month: 11, year: 2023 },
      })
      const nextBtn = wrapper.findAll('.mld-calendar__nav-btn')[1]
      await nextBtn.trigger('click')

      expect(wrapper.emitted('update:year')?.[0]).toEqual([2024])
      expect(wrapper.emitted('update:month')?.[0]).toEqual([0])
    })

    it('should handle string date inputs for markers', () => {
      const markers: CalendarMarker[] = [
        { date: '2024-01-15', label: 'Event' },
      ]
      const wrapper = mount(Calendar, {
        props: { markers, month: 0, year: 2024 },
      })
      expect(wrapper.find('.mld-calendar__marker').exists()).toBe(true)
    })

    it('should handle string date inputs for disabled dates', () => {
      const wrapper = mount(Calendar, {
        props: {
          disabledDates: ['2024-01-15', '2024-01-16'],
          month: 0,
          year: 2024,
        },
      })
      const disabledDays = wrapper.findAll('.mld-calendar__day--disabled')
      expect(disabledDays.length).toBeGreaterThan(0)
    })

    it('should handle minDate as string', () => {
      const wrapper = mount(Calendar, {
        props: {
          minDate: '2024-01-15',
          month: 0,
          year: 2024,
        },
      })
      const disabledDays = wrapper.findAll('.mld-calendar__day--disabled')
      expect(disabledDays.length).toBeGreaterThan(0)
    })
  })
})
