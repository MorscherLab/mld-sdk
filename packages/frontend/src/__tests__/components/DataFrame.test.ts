import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataFrame from '../../components/DataFrame.vue'
import type { DataFrameColumn, SortState, PaginationState } from '../../types'

describe('DataFrame', () => {
  const mockData = [
    { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
  ]

  const mockColumns: DataFrameColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age', align: 'right' },
    { key: 'email', label: 'Email' },
  ]

  describe('rendering with default props', () => {
    it('should render table container', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      expect(wrapper.find('.mld-dataframe').exists()).toBe(true)
      expect(wrapper.find('.mld-dataframe__table').exists()).toBe(true)
    })

    it('should render column headers', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const headers = wrapper.findAll('.mld-dataframe__th')
      expect(headers).toHaveLength(3)
      expect(headers[0].text()).toBe('Name')
      expect(headers[1].text()).toBe('Age')
      expect(headers[2].text()).toBe('Email')
    })

    it('should render data rows', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(3)
    })

    it('should render cell values', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const firstRow = wrapper.findAll('.mld-dataframe__row')[0]
      const cells = firstRow.findAll('.mld-dataframe__td')
      expect(cells[0].text()).toBe('Alice')
      expect(cells[1].text()).toBe('30')
      expect(cells[2].text()).toBe('alice@example.com')
    })

    it('should apply bordered class by default', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      expect(wrapper.find('.mld-dataframe--bordered').exists()).toBe(true)
    })

    it('should apply striped rows by default', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows[1].classes()).toContain('mld-dataframe__row--striped')
    })
  })

  describe('column configuration', () => {
    it('should apply column alignment', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const ageHeader = wrapper.findAll('.mld-dataframe__th')[1]
      expect(ageHeader.classes()).toContain('mld-dataframe__th--align-right')
    })

    it('should apply column width', () => {
      const columns: DataFrameColumn[] = [
        { key: 'name', label: 'Name', width: 200 },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns },
      })
      const header = wrapper.find('.mld-dataframe__th')
      expect(header.attributes('style')).toContain('width: 200px')
    })

    it('should support string width values', () => {
      const columns: DataFrameColumn[] = [
        { key: 'name', label: 'Name', width: '20rem' },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns },
      })
      const header = wrapper.find('.mld-dataframe__th')
      expect(header.attributes('style')).toContain('width: 20rem')
    })

    it('should apply minWidth', () => {
      const columns: DataFrameColumn[] = [
        { key: 'name', label: 'Name', minWidth: 150 },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns },
      })
      const header = wrapper.find('.mld-dataframe__th')
      expect(header.attributes('style')).toContain('min-width: 150px')
    })

    it('should apply ellipsis class to cells', () => {
      const columns: DataFrameColumn[] = [
        { key: 'name', label: 'Name', ellipsis: true },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns },
      })
      const cell = wrapper.find('.mld-dataframe__td')
      expect(cell.classes()).toContain('mld-dataframe__td--ellipsis')
    })

    it('should use custom formatter', () => {
      const columns: DataFrameColumn[] = [
        {
          key: 'age',
          label: 'Age',
          formatter: (value) => `${value} years old`,
        },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns },
      })
      const ageCell = wrapper.findAll('.mld-dataframe__row')[0].findAll('.mld-dataframe__td')[0]
      expect(ageCell.text()).toBe('30 years old')
    })
  })

  describe('sorting', () => {
    const sortableColumns: DataFrameColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'age', label: 'Age', sortable: true },
    ]

    it('should show sort icon on sortable columns', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: sortableColumns },
      })
      const sortIcons = wrapper.findAll('.mld-dataframe__sort-icon')
      expect(sortIcons).toHaveLength(2)
    })

    it('should apply sortable class to sortable headers', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: sortableColumns },
      })
      const headers = wrapper.findAll('.mld-dataframe__th')
      expect(headers[0].classes()).toContain('mld-dataframe__th--sortable')
    })

    it('should sort ascending on first click', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: sortableColumns },
      })
      const nameHeader = wrapper.findAll('.mld-dataframe__th')[0]
      await nameHeader.trigger('click')

      expect(wrapper.emitted('update:sort')).toHaveLength(1)
      const sortState = wrapper.emitted('update:sort')?.[0]?.[0] as SortState
      expect(sortState.key).toBe('name')
      expect(sortState.direction).toBe('asc')
    })

    it('should sort descending on second click', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: sortableColumns,
          sort: { key: 'name', direction: 'asc' },
        },
      })
      const nameHeader = wrapper.findAll('.mld-dataframe__th')[0]
      await nameHeader.trigger('click')

      const sortState = wrapper.emitted('update:sort')?.[0]?.[0] as SortState
      expect(sortState.direction).toBe('desc')
    })

    it('should clear sort on third click', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: sortableColumns,
          sort: { key: 'name', direction: 'desc' },
        },
      })
      const nameHeader = wrapper.findAll('.mld-dataframe__th')[0]
      await nameHeader.trigger('click')

      const sortState = wrapper.emitted('update:sort')?.[0]?.[0]
      expect(sortState).toBeNull()
    })

    it('should sort data internally when sort prop is not provided', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: sortableColumns },
      })
      const nameHeader = wrapper.findAll('.mld-dataframe__th')[0]
      await nameHeader.trigger('click')

      // After sorting, first row should have name starting with 'A'
      const firstRow = wrapper.findAll('.mld-dataframe__row')[0]
      const cells = firstRow.findAll('.mld-dataframe__td')
      expect(cells[0].text()).toBe('Alice')
    })

    it('should sort numeric columns correctly', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: sortableColumns },
      })
      const ageHeader = wrapper.findAll('.mld-dataframe__th')[1]
      await ageHeader.trigger('click')

      // After sorting ascending, first row should have age 25
      const firstRow = wrapper.findAll('.mld-dataframe__row')[0]
      const cells = firstRow.findAll('.mld-dataframe__td')
      expect(cells[1].text()).toBe('25')
    })

    it('should apply sorted class to active column', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: sortableColumns,
          sort: { key: 'name', direction: 'asc' },
        },
      })
      const nameHeader = wrapper.findAll('.mld-dataframe__th')[0]
      expect(nameHeader.classes()).toContain('mld-dataframe__th--sorted')
    })

    it('should enable sorting globally with sortable prop', () => {
      const columns: DataFrameColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'age', label: 'Age' },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns, sortable: true },
      })
      const sortableHeaders = wrapper.findAll('.mld-dataframe__th--sortable')
      expect(sortableHeaders).toHaveLength(2)
    })
  })

  describe('search filtering', () => {
    it('should show search input when searchable is true', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, searchable: true },
      })
      expect(wrapper.find('.mld-dataframe__search').exists()).toBe(true)
    })

    it('should filter data based on search query', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, searchable: true },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      await searchInput.setValue('Alice')

      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(1)
      expect(rows[0].text()).toContain('Alice')
    })

    it('should search across all columns by default', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, searchable: true },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      await searchInput.setValue('bob@example.com')

      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(1)
      expect(rows[0].text()).toContain('Bob')
    })

    it('should search only specified columns', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          searchable: true,
          searchKeys: ['name'],
        },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      await searchInput.setValue('bob@example.com')

      // Should not find Bob by email since we're only searching name
      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(0)
    })

    it('should be case-insensitive', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, searchable: true },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      await searchInput.setValue('ALICE')

      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(1)
    })

    it('should use custom placeholder', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          searchable: true,
          searchPlaceholder: 'Type to search...',
        },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      expect(searchInput.attributes('placeholder')).toBe('Type to search...')
    })
  })

  describe('pagination', () => {
    const paginationState: PaginationState = {
      page: 1,
      pageSize: 2,
      total: 3,
    }

    it('should show pagination controls', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: paginationState },
      })
      expect(wrapper.find('.mld-dataframe__footer').exists()).toBe(true)
      expect(wrapper.find('.mld-dataframe__page-controls').exists()).toBe(true)
    })

    it('should display page info', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: paginationState },
      })
      const pageInfo = wrapper.find('.mld-dataframe__page-info')
      expect(pageInfo.text()).toContain('1')
      expect(pageInfo.text()).toContain('3')
    })

    it('should paginate data', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: paginationState },
      })
      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(2) // pageSize is 2
    })

    it('should emit pagination event on page change', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: paginationState },
      })
      const nextButton = wrapper.findAll('.mld-dataframe__page-btn')[1]
      await nextButton.trigger('click')

      expect(wrapper.emitted('update:pagination')).toHaveLength(1)
      const newPagination = wrapper.emitted('update:pagination')?.[0]?.[0] as PaginationState
      expect(newPagination.page).toBe(2)
    })

    it('should disable prev button on first page', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: paginationState },
      })
      const prevButton = wrapper.findAll('.mld-dataframe__page-btn')[0]
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('should disable next button on last page', () => {
      const lastPageState: PaginationState = { page: 2, pageSize: 2, total: 3 }
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: lastPageState },
      })
      const nextButton = wrapper.findAll('.mld-dataframe__page-btn')[1]
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('should not show pagination when false', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, pagination: false },
      })
      expect(wrapper.find('.mld-dataframe__footer').exists()).toBe(false)
    })
  })

  describe('row selection', () => {
    it('should show checkbox column when selectable', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, selectable: true },
      })
      expect(wrapper.find('.mld-dataframe__th--checkbox').exists()).toBe(true)
    })

    it('should show checkboxes for each row', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, selectable: true },
      })
      const checkboxes = wrapper.findAll('.mld-dataframe__checkbox')
      // One for header + one for each row
      expect(checkboxes.length).toBeGreaterThan(mockData.length)
    })

    it('should emit selectedKeys on row selection', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, selectable: true, rowKey: 'id' },
      })
      const rowCheckboxes = wrapper.findAll('.mld-dataframe__td--checkbox .mld-dataframe__checkbox')
      await rowCheckboxes[0].trigger('change')

      expect(wrapper.emitted('update:selectedKeys')).toHaveLength(1)
      const keys = wrapper.emitted('update:selectedKeys')?.[0]?.[0] as number[]
      expect(keys).toContain(1)
    })

    it('should toggle selection on row checkbox click', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          selectable: true,
          rowKey: 'id',
          selectedKeys: [1],
        },
      })
      const rowCheckboxes = wrapper.findAll('.mld-dataframe__td--checkbox .mld-dataframe__checkbox')
      await rowCheckboxes[0].trigger('change')

      const keys = wrapper.emitted('update:selectedKeys')?.[0]?.[0] as number[]
      expect(keys).not.toContain(1)
    })

    it('should select all rows with header checkbox', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, selectable: true, rowKey: 'id' },
      })
      const headerCheckbox = wrapper.find('.mld-dataframe__th--checkbox .mld-dataframe__checkbox')
      await headerCheckbox.trigger('change')

      const keys = wrapper.emitted('update:selectedKeys')?.[0]?.[0] as number[]
      expect(keys).toHaveLength(3)
    })

    it('should apply selected class to selected rows', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          selectable: true,
          rowKey: 'id',
          selectedKeys: [1],
        },
      })
      const selectedRow = wrapper.find('.mld-dataframe__row--selected')
      expect(selectedRow.exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('should emit row-click event', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const firstRow = wrapper.findAll('.mld-dataframe__row')[0]
      await firstRow.trigger('click')

      expect(wrapper.emitted('row-click')).toHaveLength(1)
      const [row, index] = wrapper.emitted('row-click')?.[0] as [Record<string, unknown>, number]
      expect(row.name).toBe('Alice')
      expect(index).toBe(0)
    })

    it('should emit cell-click event', async () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
      })
      const firstCell = wrapper.find('.mld-dataframe__td')
      await firstCell.trigger('click')

      expect(wrapper.emitted('cell-click')).toHaveLength(1)
      const [value, column, row] = wrapper.emitted('cell-click')?.[0] as [unknown, DataFrameColumn, Record<string, unknown>]
      expect(value).toBe('Alice')
      expect(column.key).toBe('name')
      expect(row.name).toBe('Alice')
    })
  })

  describe('empty state', () => {
    it('should show empty state when no data', () => {
      const wrapper = mount(DataFrame, {
        props: { data: [], columns: mockColumns },
      })
      expect(wrapper.find('.mld-dataframe__empty').exists()).toBe(true)
    })

    it('should display empty text', () => {
      const wrapper = mount(DataFrame, {
        props: { data: [], columns: mockColumns },
      })
      expect(wrapper.find('.mld-dataframe__empty-text').text()).toBe('No data')
    })

    it('should use custom empty text', () => {
      const wrapper = mount(DataFrame, {
        props: { data: [], columns: mockColumns, emptyText: 'No records found' },
      })
      expect(wrapper.find('.mld-dataframe__empty-text').text()).toBe('No records found')
    })

    it('should not show empty state when loading', () => {
      const wrapper = mount(DataFrame, {
        props: { data: [], columns: mockColumns, loading: true },
      })
      expect(wrapper.find('.mld-dataframe__empty').exists()).toBe(false)
    })
  })

  describe('loading state', () => {
    it('should show loading overlay', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, loading: true },
      })
      expect(wrapper.find('.mld-dataframe__loading').exists()).toBe(true)
    })

    it('should show loading spinner', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, loading: true },
      })
      expect(wrapper.find('.mld-dataframe__loading-spinner').exists()).toBe(true)
    })
  })

  describe('styling props', () => {
    it('should not apply striped when striped is false', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, striped: false },
      })
      expect(wrapper.find('.mld-dataframe__row--striped').exists()).toBe(false)
    })

    it('should not apply bordered when bordered is false', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, bordered: false },
      })
      expect(wrapper.find('.mld-dataframe--bordered').exists()).toBe(false)
    })

    it('should apply size class to cells', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, size: 'sm' },
      })
      const cell = wrapper.find('.mld-dataframe__td')
      expect(cell.classes()).toContain('mld-dataframe__td--sm')
    })

    it('should apply sticky header class', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, stickyHeader: true },
      })
      expect(wrapper.find('.mld-dataframe__thead--sticky').exists()).toBe(true)
    })

    it('should apply maxHeight style', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, maxHeight: 400 },
      })
      const tableWrapper = wrapper.find('.mld-dataframe__table-wrapper')
      expect(tableWrapper.attributes('style')).toContain('max-height: 400px')
    })

    it('should support string maxHeight', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, maxHeight: '50vh' },
      })
      const tableWrapper = wrapper.find('.mld-dataframe__table-wrapper')
      expect(tableWrapper.attributes('style')).toContain('max-height: 50vh')
    })
  })

  describe('nested keys', () => {
    it('should access nested object properties', () => {
      const nestedData = [
        { id: 1, user: { name: 'Alice', email: 'alice@example.com' } },
      ]
      const nestedColumns: DataFrameColumn[] = [
        { key: 'user.name', label: 'Name' },
        { key: 'user.email', label: 'Email' },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: nestedData, columns: nestedColumns },
      })
      const cells = wrapper.findAll('.mld-dataframe__td')
      expect(cells[0].text()).toBe('Alice')
      expect(cells[1].text()).toBe('alice@example.com')
    })
  })

  describe('rowKey prop', () => {
    it('should use string rowKey', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          selectable: true,
          rowKey: 'id',
        },
      })
      expect(wrapper.find('.mld-dataframe').exists()).toBe(true)
    })

    it('should use function rowKey', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          selectable: true,
          rowKey: (row) => `row-${row.id}`,
        },
      })
      expect(wrapper.find('.mld-dataframe').exists()).toBe(true)
    })
  })

  describe('slots', () => {
    it('should support header slot', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
        slots: {
          'header-name': '<div class="custom-header">Custom Name</div>',
        },
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('Custom Name')
    })

    it('should support cell slot', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns },
        slots: {
          'cell-name': '<div class="custom-cell">{{ value }}</div>',
        },
      })
      expect(wrapper.find('.custom-cell').exists()).toBe(true)
    })

    it('should support empty slot', () => {
      const wrapper = mount(DataFrame, {
        props: { data: [], columns: mockColumns },
        slots: {
          empty: '<div class="custom-empty">Nothing here</div>',
        },
      })
      expect(wrapper.find('.custom-empty').exists()).toBe(true)
      expect(wrapper.find('.custom-empty').text()).toBe('Nothing here')
    })

    it('should support loading slot', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: mockColumns, loading: true },
        slots: {
          loading: '<div class="custom-loading">Loading...</div>',
        },
      })
      expect(wrapper.find('.custom-loading').exists()).toBe(true)
    })

    it('should support footer slot', () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          pagination: { page: 1, pageSize: 2, total: 3 },
        },
        slots: {
          footer: '<div class="custom-footer">Custom Footer</div>',
        },
      })
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      const dataWithNulls = [
        { id: 1, name: null, age: undefined, email: 'test@example.com' },
      ]
      const wrapper = mount(DataFrame, {
        props: { data: dataWithNulls, columns: mockColumns },
      })
      const cells = wrapper.findAll('.mld-dataframe__td')
      expect(cells[0].text()).toBe('')
      expect(cells[1].text()).toBe('')
    })

    it('should handle empty columns array', () => {
      const wrapper = mount(DataFrame, {
        props: { data: mockData, columns: [] },
      })
      expect(wrapper.find('.mld-dataframe__table').exists()).toBe(true)
    })

    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        age: 20 + (i % 50),
      }))
      const wrapper = mount(DataFrame, {
        props: {
          data: largeData,
          columns: mockColumns,
          pagination: { page: 1, pageSize: 10, total: 1000 },
        },
      })
      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(10)
    })

    it('should handle search with filtered pagination', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          searchable: true,
          pagination: { page: 1, pageSize: 2, total: 3 },
        },
      })
      const searchInput = wrapper.find('.mld-dataframe__search')
      await searchInput.setValue('Alice')

      const rows = wrapper.findAll('.mld-dataframe__row')
      expect(rows).toHaveLength(1)
    })

    it('should stop propagation on checkbox clicks', async () => {
      const wrapper = mount(DataFrame, {
        props: {
          data: mockData,
          columns: mockColumns,
          selectable: true,
          rowKey: 'id',
        },
      })
      const checkbox = wrapper.find('.mld-dataframe__td--checkbox .mld-dataframe__checkbox')
      await checkbox.trigger('click')

      // Row click should not be emitted
      expect(wrapper.emitted('row-click')).toBeUndefined()
    })
  })
})
