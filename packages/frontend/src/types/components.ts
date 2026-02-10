// Container types
export type ContainerDirection = 'row' | 'column'

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
export interface SidebarToolSection {
  id: string
  label: string
  icon?: string
  defaultOpen?: boolean
}

// Collapsible types
export interface CollapsibleState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

// TopBar types
export type TopBarVariant = 'card' | 'default'

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

// TopBar settings config (pass-through for built-in SettingsModal)
export interface TopBarSettingsConfig {
  title?: string
  tabs?: SettingsTab[]
  showAppearance?: boolean
  size?: 'md' | 'lg' | 'xl'
}

// Well Plate types
export type WellPlateFormat = 6 | 12 | 24 | 48 | 54 | 96 | 384
export type WellState = 'empty' | 'filled' | 'selected' | 'disabled'
export type WellPlateSelectionMode = 'none' | 'single' | 'multiple' | 'rectangle' | 'drag'
export type WellPlateSize = 'sm' | 'md' | 'lg' | 'xl' | 'fill'
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

// Slot position for rack color coding
export type SlotPosition = 'R' | 'G' | 'B' | 'Y'

// Extended well data stored in Well.metadata
export interface WellExtendedData {
  label?: string
  injectionVolume?: number
  injectionCount?: number
  customMethod?: string | null
}

// Data emitted when editing a well
export interface WellEditData {
  wellId: string
  label: string
  sampleType: string
  injectionVolume: number
  injectionCount: number
  customMethod: string
}

// Fields shown in the edit popup
export type WellEditField = 'label' | 'sampleType' | 'injectionVolume' | 'injectionCount' | 'customMethod'

// Legend item for sample type display
export interface WellLegendItem {
  type: string
  label: string
  color: string
}

// Rack for RackEditor
export interface Rack {
  id: string
  name: string
  format: WellPlateFormat
  slot: SlotPosition
  injectionVolume: number
  wells: Record<string, Partial<Well>>
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

// Sample Selector types
export interface SampleGroup {
  name: string
  color: string
  samples: string[]
}

// Group Assigner types
export interface GroupItem {
  name: string
  color: string
  count: number
}

// FileUploader types
export type FileUploaderMode = 'file' | 'folder'

// MoleculeInput types
export interface MoleculeData {
  smiles: string
  molfile: string
}

// ReagentList types
export type StorageCondition = 'RT' | '4C' | '-20C' | '-80C'

export type ReagentColumn =
  | 'name'
  | 'catalog'
  | 'lot'
  | 'expiry'
  | 'storage'
  | 'location'
  | 'stock'
  | 'supplier'

export interface Reagent {
  id: string
  name: string
  catalogNumber?: string
  lotNumber?: string
  expiryDate?: Date | string
  storageCondition?: StorageCondition
  location?: string
  stockLevel?: number
  stockUnit?: string
  supplier?: string
  url?: string
}

// SampleHierarchyTree types
export type TreeNodeType =
  | 'study'
  | 'experiment'
  | 'plate'
  | 'sample'
  | 'cell_line'
  | 'passage'
  | 'clone'
  | 'treatment'
  | 'folder'
  | 'custom'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

export interface TreeNode {
  id: string
  label: string
  type?: TreeNodeType
  icon?: string
  children?: TreeNode[]
  metadata?: Record<string, unknown>
  badge?: string | number
  badgeVariant?: BadgeVariant
}

// SegmentedControl types
export interface SegmentedOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export type SegmentedControlVariant = 'simple' | 'card'
export type SegmentedControlSize = 'sm' | 'md' | 'lg'

// MultiSelect types
export interface MultiSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export type MultiSelectSize = 'sm' | 'md' | 'lg'

// Pill types
/** Visual style variant for pill/badge components */
export type PillVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
/** Size variant for pill components */
export type PillSize = 'sm' | 'md' | 'lg'

// Calendar types
/** Date selection behavior for calendar component */
export type CalendarSelectionMode = 'none' | 'single' | 'range' | 'multiple'

/** Visual marker displayed on a calendar date */
export interface CalendarMarker {
  /** Date to mark */
  date: Date | string
  /** Marker color (CSS color value) */
  color?: string
  /** Tooltip/label for the marker */
  label?: string
  /** Visual style of the marker */
  type?: 'dot' | 'bar' | 'highlight'
  /** Additional custom data */
  customData?: Record<string, unknown>
}

/** Context object for a calendar day cell */
export interface CalendarDayContext {
  /** The date for this day */
  date: Date
  /** Day of month (1-31) */
  dayOfMonth: number
  /** True if this is today's date */
  isToday: boolean
  /** True if this date is currently selected */
  isSelected: boolean
  /** True if this date is within a selected range */
  isInRange: boolean
  /** True if this date cannot be selected */
  isDisabled: boolean
  /** True if this date is from an adjacent month */
  isOutsideMonth: boolean
  /** Markers configured for this date */
  markers: CalendarMarker[]
}

// DataFrame types
/** Sort direction (null means unsorted) */
export type SortDirection = 'asc' | 'desc' | null

/** Current sort state for a table column */
export interface SortState {
  /** Column key being sorted */
  key: string
  /** Sort direction */
  direction: SortDirection
}

/** Column configuration for DataFrame component */
export interface DataFrameColumn<T = Record<string, unknown>> {
  /** Unique column key (supports nested keys like 'user.name') */
  key: string
  /** Display label for column header */
  label: string
  /** Enable sorting for this column */
  sortable?: boolean
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Fixed column width */
  width?: string | number
  /** Minimum column width */
  minWidth?: string | number
  /** Truncate overflow text with ellipsis */
  ellipsis?: boolean
  /** Custom formatter for cell values */
  formatter?: (value: unknown, row: T, index: number) => string
}

/** Pagination state for table data */
export interface PaginationState {
  /** Current page (1-indexed) */
  page: number
  /** Number of rows per page */
  pageSize: number
  /** Total number of rows across all pages */
  total: number
}

// LoadingSpinner types
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'
export type SpinnerVariant = 'primary' | 'cta' | 'muted'

// Divider types
export type DividerSpacing = 'sm' | 'md' | 'lg'

// StatusIndicator types
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'muted'

// ProgressBar types
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'error' | 'info'
export type ProgressSize = 'sm' | 'md' | 'lg'

// Avatar types
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// EmptyState types
export type EmptyStateColor = 'primary' | 'cta' | 'success' | 'warning' | 'error' | 'muted'
export type EmptyStateSize = 'sm' | 'md' | 'lg'

// Breadcrumb types
export interface BreadcrumbItem {
  label: string
  to?: string
  href?: string
}

// Tooltip types
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

// ConfirmDialog types
export type ConfirmVariant = 'danger' | 'warning' | 'info'

// SettingsModal types
export interface SettingsTab {
  id: string
  label: string
  icon?: string
}

// ScientificNumber types
export type NumberNotation = 'auto' | 'scientific' | 'engineering' | 'compact'

// UnitInput types
export interface UnitOption {
  value: string
  label: string
  factor?: number
  group?: string
}

// StepWizard types
export interface WizardStep {
  id: string
  label: string
  description?: string
  icon?: string
  optional?: boolean
}

export type WizardStepState = 'pending' | 'active' | 'completed' | 'disabled'

// AuditTrail types
export type AuditEntryType = 'create' | 'update' | 'delete' | 'system'

export interface AuditEntry {
  id: string
  type: AuditEntryType
  action: string
  detail?: string
  user?: string
  timestamp: Date | string
  metadata?: Record<string, unknown>
}

// BatchProgressList types
export type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'error' | 'skipped'

export interface BatchItem {
  id: string
  label: string
  status: BatchItemStatus
  progress?: number
  message?: string
}

export interface BatchSummary {
  total: number
  completed: number
  processing: number
  error: number
  pending: number
  skipped: number
  percent: number
}

// TimePicker types
export type TimePickerFormat = '12h' | '24h'

export interface TimeRange {
  start: string  // "HH:mm"
  end: string    // "HH:mm"
}

// Schedule types
export type ScheduleView = 'day' | 'week' | 'month'
export type ScheduleEventStatus = 'confirmed' | 'pending' | 'cancelled' | 'in-progress'

export interface ScheduleEvent {
  id: string
  start: string          // ISO 8601 datetime
  end: string            // ISO 8601 datetime
  title: string
  color?: string
  status?: ScheduleEventStatus
  draggable?: boolean
  resizable?: boolean
  metadata?: Record<string, unknown>
}

export interface ScheduleBlockedSlot {
  start: string
  end: string
  label?: string
}

export interface ScheduleSlotContext {
  date: Date
  hour: number
  minute: number
}

export interface ScheduleEventCreateContext {
  start: Date
  end: Date
}

export interface ScheduleEventUpdateContext {
  event: ScheduleEvent
  newStart: Date
  newEnd: Date
}

// Resource types
export type ResourceStatus = 'available' | 'in-use' | 'maintenance' | 'offline'

export interface ResourceSpec {
  label: string
  value: string
}
