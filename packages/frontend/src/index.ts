// Styles (import to ensure bundling)
import './styles/index.css'

// Vue Plugin for global component registration
export { MLDSdk, default } from './install'

// Components
export {
  BaseButton,
  BaseInput,
  BaseTextarea,
  BaseSelect,
  BaseCheckbox,
  BaseToggle,
  BaseRadioGroup,
  BaseSlider,
  ColorSlider,
  BaseTabs,
  BaseModal,
  FormField,
  DatePicker,
  TimePicker,
  TagsInput,
  NumberInput,
  FileUploader,
  AlertBox,
  ToastNotification,
  IconButton,
  ThemeToggle,
  SettingsButton,
  CollapsibleCard,
  AppTopBar,
  AppSidebar,
  AppLayout,
  Skeleton,
  // Biological experiment components
  WellPlate,
  RackEditor,
  SampleLegend,
  PlateMapEditor,
  ExperimentTimeline,
  // Sample management components
  SampleSelector,
  GroupingModal,
  GroupAssigner,
  // Lab/Experiment components
  MoleculeInput,
  ConcentrationInput,
  DoseCalculator,
  ReagentList,
  SampleHierarchyTree,
  ProtocolStepEditor,
  // Selection components
  SegmentedControl,
  MultiSelect,
  // Pill / Dropdown components
  BasePill,
  DropdownButton,
  Calendar,
  DataFrame,
  // Utility / UI primitives
  LoadingSpinner,
  Divider,
  StatusIndicator,
  ProgressBar,
  Avatar,
  EmptyState,
  Breadcrumb,
  Tooltip,
  ConfirmDialog,
  ChartContainer,
  SettingsModal,
  // Scientific display components
  ScientificNumber,
  ChemicalFormula,
  // Scientific input components
  FormulaInput,
  SequenceInput,
  UnitInput,
  // Workflow components
  StepWizard,
  AuditTrail,
  BatchProgressList,
  // Scheduling / booking components
  DateTimePicker,
  TimeRangeInput,
  ScheduleCalendar,
  ResourceCard,
} from './components'

// Composables
export {
  useApi,
  useAuth,
  usePasskey,
  useTheme,
  useToast,
  usePlatformContext,
  useWellPlateEditor,
  useConcentrationUnits,
  useDoseCalculator,
  useProtocolTemplates,
  useRackEditor,
  useChemicalFormula,
  ATOMIC_WEIGHTS,
  useSequenceUtils,
  type ApiClientOptions,
  type UseWellPlateEditorOptions,
  type UseWellPlateEditorReturn,
  type UseRackEditorOptions,
  type UseRackEditorReturn,
  type ConcentrationValue,
  type ConcentrationUnit,
  type VolumeValue,
  type VolumeUnit,
  type StepTemplate,
  type FormulaParseResult,
  type FormulaPart,
  type SequenceType,
  type SequenceStats,
  // Time utilities
  parseTime,
  formatTime,
  generateTimeSlots,
  rangesOverlap,
  durationMinutes,
  formatDuration,
  isTimeInRange,
  findAvailableSlots,
  snapToSlot,
  addMinutes,
  compareTime,
  // Schedule drag
  useScheduleDrag,
} from './composables'

// Stores
export {
  useAuthStore,
  useSettingsStore,
  colorPalettes,
  type SettingsState,
} from './stores'

// Types
export type {
  // Component types
  ButtonVariant,
  ButtonSize,
  InputType,
  ModalSize,
  AlertType,
  Toast,
  TabItem,
  SelectOption,
  RadioOption,
  FormFieldProps,
  SidebarItem,
  CollapsibleState,
  TopBarVariant,
  TopBarPage,
  TopBarTab,
  TopBarTabOption,
  // Well Plate types
  WellPlateFormat,
  WellState,
  WellPlateSelectionMode,
  Well,
  HeatmapColorScale,
  HeatmapConfig,
  // Well Plate editing types
  SlotPosition,
  WellExtendedData,
  WellEditData,
  WellEditField,
  WellLegendItem,
  Rack,
  // Sample Legend types
  SampleType,
  // Plate Map Editor types
  PlateMap,
  PlateMapEditorState,
  // Experiment Timeline types
  ProtocolStepType,
  ProtocolStepStatus,
  ProtocolStep,
  // Sample management types
  SampleGroup,
  GroupItem,
  FileUploaderMode,
  // SegmentedControl types
  SegmentedOption,
  SegmentedControlVariant,
  SegmentedControlSize,
  // MultiSelect types
  MultiSelectOption,
  MultiSelectSize,
  // Pill types
  PillVariant,
  PillSize,
  // Calendar types
  CalendarSelectionMode,
  CalendarMarker,
  CalendarDayContext,
  // DataFrame types
  SortDirection,
  SortState,
  DataFrameColumn,
  PaginationState,
  // LoadingSpinner types
  SpinnerSize,
  SpinnerVariant,
  // Divider types
  DividerSpacing,
  // StatusIndicator types
  StatusType,
  // ProgressBar types
  ProgressVariant,
  ProgressSize,
  // Avatar types
  AvatarSize,
  // EmptyState types
  EmptyStateColor,
  EmptyStateSize,
  // Breadcrumb types
  BreadcrumbItem,
  // Tooltip types
  TooltipPosition,
  // ConfirmDialog types
  ConfirmVariant,
  // SettingsModal types
  SettingsTab,
  // ScientificNumber types
  NumberNotation,
  // TimePicker types
  TimePickerFormat,
  TimeRange,
  // Schedule types
  ScheduleView,
  ScheduleEventStatus,
  ScheduleEvent,
  ScheduleBlockedSlot,
  ScheduleSlotContext,
  ScheduleEventCreateContext,
  ScheduleEventUpdateContext,
  // Resource types
  ResourceStatus,
  ResourceSpec,
  // UnitInput types
  UnitOption,
  // StepWizard types
  WizardStep,
  WizardStepState,
  // AuditTrail types
  AuditEntryType,
  AuditEntry,
  // BatchProgressList types
  BatchItemStatus,
  BatchItem,
  BatchSummary,
  // Auth types
  AuthConfig,
  UserInfo,
  LoginResponse,
  TokenVerifyResponse,
  RegisterRequest,
  UpdateProfileRequest,
  CredentialInfo,
  // Platform types
  PluginInfo,
  PluginNavItem,
  PluginSettings,
  PluginSettingField,
  PlatformContext,
  PlatformEventType,
  PlatformEvent,
  ThemeMode,
  ColorPalette,
  TableDensity,
} from './types'
