// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'danger' | 'success' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Input types
export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'

// Modal types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info'

// Toast types
export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

// Tab types
export interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
}

// Select types
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
}

// Radio types
export interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

// Form field types
export interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

// Sidebar types
export interface SidebarItem {
  id: string
  label: string
  icon?: string
  to?: string
  href?: string
  children?: SidebarItem[]
  badge?: string | number
  disabled?: boolean
}

// Collapsible types
export interface CollapsibleState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

// TopBar types
export type TopBarVariant = 'floating' | 'card' | 'sticky' | 'default'

// TopBar page navigation types
export interface TopBarPage {
  id: string
  label: string
  to?: string              // vue-router path
  href?: string            // External link
  icon?: string            // Optional icon
  description?: string     // Optional subtitle in dropdown
  disabled?: boolean
}

// TopBar tab types (displayed in middle of topbar)
export interface TopBarTab {
  id: string
  label: string
  to?: string              // vue-router path
  href?: string            // External link
  icon?: string            // Optional icon
  disabled?: boolean
  children?: TopBarTabOption[]  // Dropdown options
}

export interface TopBarTabOption {
  id: string
  label: string
  to?: string
  href?: string
  description?: string
  disabled?: boolean
}

// Well Plate types
export type WellPlateFormat = 6 | 12 | 24 | 48 | 54 | 96 | 384
export type WellState = 'empty' | 'filled' | 'selected' | 'disabled'
export type WellPlateSelectionMode = 'none' | 'single' | 'multiple' | 'rectangle' | 'drag'
export type WellShape = 'circle' | 'rounded'

export interface Well {
  id: string
  row: number
  col: number
  state: WellState
  sampleType?: string
  value?: number
  metadata?: Record<string, unknown>
}

export type HeatmapColorScale = 'viridis' | 'plasma' | 'turbo' | 'custom'

export interface HeatmapConfig {
  enabled: boolean
  min?: number
  max?: number
  colorScale?: HeatmapColorScale
  customColors?: string[]
  showLegend?: boolean
}

// Sample Legend types
export interface SampleType {
  id: string
  name: string
  color?: string
  count?: number
  description?: string
}

// Plate Map Editor types
export interface PlateMap {
  id: string
  name: string
  format: WellPlateFormat
  wells: Record<string, Well>
}

export interface PlateMapEditorState {
  plates: PlateMap[]
  activePlateId: string
  samples: SampleType[]
  selectedWells: string[]
  activeSampleId?: string
}

// Experiment Timeline types
export type ProtocolStepType = 'incubation' | 'wash' | 'addition' | 'measurement' | 'transfer' | 'centrifuge' | 'mix' | 'custom'
export type ProtocolStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'

export interface ProtocolStep {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  duration?: number
  status: ProtocolStepStatus
  parameters?: Record<string, unknown>
  order: number
}
