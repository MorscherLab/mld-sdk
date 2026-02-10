# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-02-10

### Breaking Changes

- **AppSidebar redesign** - Converted from navigation sidebar to context-sensitive toolkit panel. `items` prop replaced with `panels` (mapping view IDs to section arrays), `activeId` replaced with `activeView`, `collapsed`/`collapsedWidth` props removed. Use `#section-{id}` slots for section content. `SidebarItem` type renamed to `SidebarToolSection`.
- **AppLayout simplified** - Removed `v-model:sidebar-collapsed`, `sidebarCollapsedWidth` prop, and sidebar slot scoped props (`collapsed`, `toggle`). Sidebar visibility is now controlled by AppSidebar itself based on `activeView`.

### Added

- **Skill reference: guideline.md** - Plugin architecture patterns, UX conventions, navigation hierarchy, component selection guide, CSS rules, and testing best practices
- **Skill reference: troubleshooting.md** - 20 entries organized by symptom (build/setup, runtime backend, runtime frontend, deployment, performance) with cause/fix/prevention format

### Changed

- **AppSidebar** - Sections render as CollapsibleCards with `#section-{id}` slots; sidebar auto-hides when active view has no matching panels
- **AppLayout** - Sidebar wrapper auto-hides via `:has(.mld-sidebar--hidden)` CSS; stripped topbar card variant borders inside layout
- **CollapsibleCard** - Icon badge now correctly renders text/emoji icons (not just SVG paths) via `isSvgIcon` detection
- **Skill SKILL.md** - Reference navigation table expanded with guideline and troubleshooting links; inline troubleshooting items replaced with pointer to full guide

### Fixed

- **AppTopBar CSS** - Card variant inside AppLayout now strips redundant margins, border-radius, and box-shadow

## [0.4.0] - 2026-02-09

### Added

- **AppContainer layout mode** - `direction` prop (`'row'` | `'column'`) turns AppContainer into a transparent flex wrapper for composing multi-panel layouts without manual flex boilerplate. New `gap` prop controls spacing between children.
- **AppContainer `ContainerDirection` type** - Exported from `@morscherlab/mld-sdk/types`
- **AppSidebar panel slot** - New `#panel` scoped slot with `activeId` for page-specific sidebar settings (filters, toggles, config per page)
- **AppTopBar built-in actions** - `showThemeToggle`, `showSettings`, `showStandaloneLabel` props with integrated ThemeToggle, SettingsModal, and standalone mode indicator
- **AppLayout auto-width sidebar** - `sidebarWidth` and `sidebarCollapsedWidth` now default to `'auto'` (fit content)
- **Python SDK LocalDatabase** - Per-plugin SQLite storage with key-value/JSON API and raw SQLModel access (`LocalDatabase`, `LocalDatabaseConfig`). Optional `sqlmodel` dependency via `mld-sdk[local-db]`
- **Live demo page** - Full-page interactive showcase at `/showcase/live-demo` demonstrating 4 layout patterns (split, master-detail, toolbar+content, scrollable)

### Changed

- **AppTopBar** - Removed deprecated `floating`/`sticky` props; use `variant` instead. Added `TopBarSettingsConfig` type.
- **AppLayout** - Sidebar width defaults changed from `240px`/`64px` to `auto`

### Fixed

- **AppContainer CSS** - Split monolithic `.mld-container` into base + card role + layout role to support dual-purpose rendering

## [0.3.4] - 2026-02-09

### Fixed

- **Frontend SDK** - Fix VitePress/consumer CSS overriding SDK component styles for semantic HTML elements (`h3`, `h4`, `p`) across 16 components by using longhand `margin-top`/`margin-bottom` with `!important`
- **Frontend SDK** - Fix table styling in ReagentList and DataFrame being overridden by VitePress `.vp-doc` table rules (zebra striping, padding, borders)

## [0.3.3] - 2026-02-06

### Added

- **BasePill** - Compact label component for tags, status badges with 7 variants, 3 sizes, removable mode, and icon slot
- **DropdownButton** - Button-style select with dropdown menu, supports all button variants/sizes, option descriptions, and loading state
- **Calendar** - Month calendar with single, multiple, and range date selection, markers, min/max constraints, and locale support
- **DataFrame** - Data table with column sorting, search filtering, pagination, row selection, custom formatters, and nested key access
- **Showcase demos** - Added VitePress demo pages for all 4 new components with new "Data Display" sidebar section

## [0.3.2] - 2026-02-04

### Fixed

- **Frontend SDK** - Add `@simplewebauthn/browser` as optional peer dependency (fixes #1)
- **Python SDK** - Fix `__version__` mismatch showing 1.1.0 instead of package version (fixes #2)

## [0.3.1] - 2026-02-04

### Added

- **SegmentedControl** - Tab-like button group for selecting between options
- **MultiSelect** - Multi-selection dropdown with search and tags
- **MoleculeInput** - SMILES input with JSME molecular editor integration
- **ConcentrationInput** - Numeric input with unit conversion (nM, µM, mM, M)
- **DoseCalculator** - Calculate dilutions and doses with stock/working concentrations
- **ReagentList** - Manage lists of reagents with concentrations and colors
- **SampleHierarchyTree** - Tree view for hierarchical sample organization
- **ProtocolStepEditor** - Protocol step management with templates and parameters
- **useConcentrationUnits** - Composable for concentration unit conversions
- **useDoseCalculator** - Composable for dose/dilution calculations
- **useProtocolTemplates** - Composable for protocol step templates

### Fixed

- **CollapsibleCard** - Fix header alignment issues:
  - Replace CSS Grid with Flexbox for reliable title/subtitle centering
  - Use `!important` on margin resets to override Tailwind preflight defaults
  - Tighter title/subtitle spacing with reduced line-height

## [0.3.0] - 2026-02-03

### Added

- **SampleSelector** - Hierarchical sample grouping component with:
  - Select All checkbox with indeterminate state
  - Auto-group by naming patterns (path levels)
  - CSV metadata grouping via GroupingModal
  - Color picker for groups
  - New group creation
- **GroupingModal** - Modal for CSV-based metadata grouping with:
  - Drag-and-drop CSV upload
  - Sample column and group column selectors
  - Column reordering
  - Data preview table
  - Sample match validation
- **GroupAssigner** - Drag-and-drop group assignment for comparisons with:
  - Two customizable drop zones (e.g., Control vs Treatment)
  - Draggable group pills with color indicators
  - Minimum group validation
  - Clear all functionality
- **FileUploader folder mode** - Added `mode` prop ('file' | 'folder') for folder selection
- **CollapsibleCard enhancements** - Added icon badge and toggle switch support:
  - `icon`, `iconColor`, `iconBg` props for icon badges
  - `showToggle`, `toggleValue` props for inline toggle switches
- **GitHub Pages deployment** - Automated showcase deployment to `morscherlab.github.io/mld-sdk`
- **Showcase enhancements** - Added demo helper components (CodeBlock, DemoSection, PropsTable, EventsTable)
- New types: `SampleGroup`, `GroupItem`, `FileUploaderMode`

## [0.2.0] - 2025-02-03

### Changed

- Moved SDK to standalone repository (`MorscherLab/mld-sdk`)
- Renamed frontend package from `@estrellaxd/mld-sdk` to `@morscherlab/mld-sdk`
- Updated repository URLs and package metadata

### Added

- Unified versioning for Python and Frontend SDKs
- CI workflow for PR validation
- Release workflow for automated publishing to GitHub Packages

## [0.1.2] - Previous

### Added

- Initial release of frontend SDK with Vue 3 components
- Components: BaseButton, BaseInput, BaseSelect, BaseTabs, BaseModal, FormField, AlertBox, IconButton, ThemeToggle, CollapsibleCard, AppTopBar, AppSidebar, ToastNotification
- Composables: useApi, useAuth, usePasskey, useTheme, useToast, usePlatformContext
- Stores: useAuthStore, useSettingsStore
- Tailwind preset for theming

## [0.1.1] - Previous

### Added

- Initial release of Python SDK
- AnalysisPlugin base class
- PlatformContext for platform integration
- Plugin metadata and capabilities models
