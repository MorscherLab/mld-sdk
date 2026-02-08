# MLD SDK Component Showcase

A comprehensive showcase of all components available in the `@morscherlab/mld-sdk` package.

::: info Getting Started
Install the SDK in your Vue 3 project:

```bash
npm install @morscherlab/mld-sdk
```

Import styles and components:

```typescript
import '@morscherlab/mld-sdk/styles'
import { BaseButton, useToast } from '@morscherlab/mld-sdk'
```
:::

## Buttons

| Component | Description |
|-----------|-------------|
| [BaseButton](/showcase/button) | 6 variants, 3 sizes, loading/disabled states |
| [IconButton](/showcase/icon-button) | Icon-only button, 6 variants, 3 sizes |
| [DropdownButton](/showcase/dropdown-button) | Button with dropdown menu for option selection |

## Form Inputs

| Component | Description |
|-----------|-------------|
| [BaseInput](/showcase/input) | 7 input types, 3 sizes, error/disabled states |
| [BaseTextarea](/showcase/textarea) | Multi-line text input with resize options |
| [BaseSelect](/showcase/select) | Dropdown select with descriptions, 3 sizes |
| [BaseCheckbox](/showcase/checkbox) | Boolean toggle with optional label |
| [BaseToggle](/showcase/toggle) | Switch-style toggle component |
| [BaseRadioGroup](/showcase/radio) | Mutually exclusive option selection |
| [BaseSlider](/showcase/slider) | Numeric range selection |
| [ColorSlider](/showcase/color-slider) | Gradient slider with threshold coloring |
| [NumberInput](/showcase/number-input) | Number input with +/- buttons |
| [DatePicker](/showcase/date-picker) | Calendar-based date selection |
| [TimePicker](/showcase/time-picker) | Clock-based time slot selection |
| [DateTimePicker](/showcase/datetime-picker) | Combined date and time picker |
| [TimeRangeInput](/showcase/time-range-input) | Start/end time range with duration |
| [TagsInput](/showcase/tags-input) | Multiple tags/keywords entry |
| [FileUploader](/showcase/file-uploader) | Drag-and-drop file upload |
| [FormField](/showcase/form-field) | Wrapper with label, error, hint |
| [SegmentedControl](/showcase/segmented-control) | Button group for single selection |
| [MultiSelect](/showcase/multi-select) | Chip-based multi-selection |

## Feedback

| Component | Description |
|-----------|-------------|
| [AlertBox](/showcase/alert) | 4 types: success, error, warning, info |
| [ToastNotification](/showcase/toast) | Toast notifications via `useToast()` |
| [Skeleton](/showcase/skeleton) | Loading placeholder component |
| [BasePill](/showcase/pill) | Tags, status badges with 7 variants |
| [LoadingSpinner](/showcase/loading-spinner) | Standalone spinner with size/variant options |
| [ProgressBar](/showcase/progress-bar) | Determinate/indeterminate progress indicator |
| [StatusIndicator](/showcase/status-indicator) | Colored dot with optional label and pulse animation |
| [EmptyState](/showcase/empty-state) | Placeholder display for empty data states |

## Layout

| Component | Description |
|-----------|-------------|
| [BaseTabs](/showcase/tabs) | 3 variants: underline, pills, bordered |
| [AppTopBar](/showcase/top-bar) | Header with logo, pages dropdown, actions |
| [AppSidebar](/showcase/sidebar) | Sidebar with collapsible sections, collapse |
| [AppLayout](/showcase/layout) | Page shell with topbar + sidebar + content |
| [BaseModal](/showcase/modal) | 5 sizes, customizable close behavior |
| [CollapsibleCard](/showcase/collapsible-card) | Expandable card with header |
| [ThemeToggle](/showcase/theme-toggle) | Light/dark mode toggle button |
| [Divider](/showcase/divider) | Horizontal/vertical separator with optional label |
| [Breadcrumb](/showcase/breadcrumb) | Navigation breadcrumb trail |
| [ConfirmDialog](/showcase/confirm-dialog) | Confirmation modal for destructive actions |
| [SettingsModal](/showcase/settings-modal) | Tab-based settings modal with appearance settings |

## Data Display

| Component | Description |
|-----------|-------------|
| [Calendar](/showcase/calendar) | Month calendar with selection and markers |
| [DataFrame](/showcase/dataframe) | Data table with sorting, search, pagination |
| [Avatar](/showcase/avatar) | Circular badge with initials, image, or fallback |
| [Tooltip](/showcase/tooltip) | Lightweight hover tooltip |
| [ChartContainer](/showcase/chart-container) | Chart wrapper with loading, empty, toolbar, legend |
| [ScientificNumber](/showcase/scientific-number) | Scientific notation with Unicode superscripts |
| [ChemicalFormula](/showcase/chemical-formula) | Inline chemical formula rendering |

## Lab Components

| Component | Description |
|-----------|-------------|
| [WellPlate](/showcase/well-plate) | Interactive microplate display (6-384 wells) |
| [SampleLegend](/showcase/sample-legend) | Color-coded sample type legend |
| [PlateMapEditor](/showcase/plate-map-editor) | Full-featured plate layout editor |
| [ExperimentTimeline](/showcase/experiment-timeline) | Visual protocol step timeline |
| [MoleculeInput](/showcase/molecule-input) | Chemical structure sketcher (JSME) |
| [ConcentrationInput](/showcase/concentration-input) | Numeric input with concentration units |
| [DoseCalculator](/showcase/dose-calculator) | Multi-mode dose calculator |
| [ReagentList](/showcase/reagent-list) | Reagent inventory table |
| [SampleHierarchyTree](/showcase/sample-hierarchy-tree) | Hierarchical biological data tree |
| [ProtocolStepEditor](/showcase/protocol-step-editor) | Template-based protocol step editor |
| [FormulaInput](/showcase/formula-input) | Chemical formula entry with MW calculation |
| [SequenceInput](/showcase/sequence-input) | DNA/RNA/protein sequence input with tools |
| [UnitInput](/showcase/unit-input) | Number input with switchable unit dropdown |

## Sample Management

| Component | Description |
|-----------|-------------|
| [SampleSelector](/showcase/sample-selector) | Hierarchical sample grouping |
| [GroupAssigner](/showcase/group-assigner) | Drag-and-drop group assignment |

## Workflow

| Component | Description |
|-----------|-------------|
| [StepWizard](/showcase/step-wizard) | Multi-step wizard with progress and validation |
| [AuditTrail](/showcase/audit-trail) | Timestamped event log for change history |
| [BatchProgressList](/showcase/batch-progress-list) | Multi-item progress tracking |

## Scheduling

| Component | Description |
|-----------|-------------|
| [ScheduleCalendar](/showcase/schedule-calendar) | Day/week/month calendar with drag-to-create and event management |
| [ResourceCard](/showcase/resource-card) | Bookable resource card with status, specs, and compact mode |

## Composables

- `useApi()` - HTTP client with error handling
- `useAuth()` - Authentication state and actions
- `usePasskey()` - WebAuthn/FIDO2 support
- `useTheme()` - Theme mode management
- `useToast()` - Toast notification system
- `usePlatformContext()` - Platform integration for plugins
- `useChemicalFormula()` - Chemical formula parsing and MW calculation
- `useSequenceUtils()` - DNA/RNA/protein sequence utilities
- `useTimeUtils` - Time parsing, formatting, slot generation, and range utilities
- `useScheduleDrag()` - Drag-to-create, resize, and move for schedule components

## Stores

- `useAuthStore()` - Pinia store for auth state
- `useSettingsStore()` - Pinia store for app settings
