# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
