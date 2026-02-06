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
