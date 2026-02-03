# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
