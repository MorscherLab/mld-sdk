import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'overview',
    component: () => import('./pages/Overview.vue'),
  },
  // Form Components
  {
    path: '/button',
    name: 'button',
    component: () => import('./pages/ButtonPage.vue'),
  },
  {
    path: '/input',
    name: 'input',
    component: () => import('./pages/InputPage.vue'),
  },
  {
    path: '/textarea',
    name: 'textarea',
    component: () => import('./pages/TextareaPage.vue'),
  },
  {
    path: '/select',
    name: 'select',
    component: () => import('./pages/SelectPage.vue'),
  },
  {
    path: '/checkbox',
    name: 'checkbox',
    component: () => import('./pages/CheckboxPage.vue'),
  },
  {
    path: '/toggle',
    name: 'toggle',
    component: () => import('./pages/TogglePage.vue'),
  },
  {
    path: '/radio',
    name: 'radio',
    component: () => import('./pages/RadioPage.vue'),
  },
  {
    path: '/slider',
    name: 'slider',
    component: () => import('./pages/SliderPage.vue'),
  },
  {
    path: '/color-slider',
    name: 'color-slider',
    component: () => import('./pages/ColorSliderPage.vue'),
  },
  {
    path: '/number-input',
    name: 'number-input',
    component: () => import('./pages/NumberInputPage.vue'),
  },
  {
    path: '/date-picker',
    name: 'date-picker',
    component: () => import('./pages/DatePickerPage.vue'),
  },
  {
    path: '/tags-input',
    name: 'tags-input',
    component: () => import('./pages/TagsInputPage.vue'),
  },
  {
    path: '/file-uploader',
    name: 'file-uploader',
    component: () => import('./pages/FileUploaderPage.vue'),
  },
  {
    path: '/form-field',
    name: 'form-field',
    component: () => import('./pages/FormFieldPage.vue'),
  },
  {
    path: '/segmented-control',
    name: 'segmented-control',
    component: () => import('./pages/SegmentedControlPage.vue'),
  },
  {
    path: '/multi-select',
    name: 'multi-select',
    component: () => import('./pages/MultiSelectPage.vue'),
  },
  // Feedback Components
  {
    path: '/alert',
    name: 'alert',
    component: () => import('./pages/AlertPage.vue'),
  },
  {
    path: '/toast',
    name: 'toast',
    component: () => import('./pages/ToastPage.vue'),
  },
  // Navigation Components
  {
    path: '/tabs',
    name: 'tabs',
    component: () => import('./pages/TabsPage.vue'),
  },
  {
    path: '/top-bar',
    name: 'top-bar',
    component: () => import('./pages/TopBarPage.vue'),
  },
  {
    path: '/sidebar',
    name: 'sidebar',
    component: () => import('./pages/SidebarPage.vue'),
  },
  // Interactive Components
  {
    path: '/modal',
    name: 'modal',
    component: () => import('./pages/ModalPage.vue'),
  },
  {
    path: '/icon-button',
    name: 'icon-button',
    component: () => import('./pages/IconButtonPage.vue'),
  },
  {
    path: '/theme-toggle',
    name: 'theme-toggle',
    component: () => import('./pages/ThemeTogglePage.vue'),
  },
  {
    path: '/collapsible-card',
    name: 'collapsible-card',
    component: () => import('./pages/CollapsibleCardPage.vue'),
  },
  // Utility Components
  {
    path: '/skeleton',
    name: 'skeleton',
    component: () => import('./pages/SkeletonPage.vue'),
  },
  // Biological Experiment Components
  {
    path: '/well-plate',
    name: 'well-plate',
    component: () => import('./pages/WellPlatePage.vue'),
  },
  {
    path: '/sample-legend',
    name: 'sample-legend',
    component: () => import('./pages/SampleLegendPage.vue'),
  },
  {
    path: '/plate-map-editor',
    name: 'plate-map-editor',
    component: () => import('./pages/PlateMapEditorPage.vue'),
  },
  {
    path: '/experiment-timeline',
    name: 'experiment-timeline',
    component: () => import('./pages/ExperimentTimelinePage.vue'),
  },
  // Sample Management Components
  {
    path: '/sample-selector',
    name: 'sample-selector',
    component: () => import('./pages/SampleSelectorPage.vue'),
  },
  {
    path: '/group-assigner',
    name: 'group-assigner',
    component: () => import('./pages/GroupAssignerPage.vue'),
  },
  // Lab/Experiment Components
  {
    path: '/molecule-input',
    name: 'molecule-input',
    component: () => import('./pages/MoleculeInputPage.vue'),
  },
  {
    path: '/concentration-input',
    name: 'concentration-input',
    component: () => import('./pages/ConcentrationInputPage.vue'),
  },
  {
    path: '/dose-calculator',
    name: 'dose-calculator',
    component: () => import('./pages/DoseCalculatorPage.vue'),
  },
  {
    path: '/reagent-list',
    name: 'reagent-list',
    component: () => import('./pages/ReagentListPage.vue'),
  },
  {
    path: '/sample-hierarchy-tree',
    name: 'sample-hierarchy-tree',
    component: () => import('./pages/SampleHierarchyTreePage.vue'),
  },
  {
    path: '/protocol-step-editor',
    name: 'protocol-step-editor',
    component: () => import('./pages/ProtocolStepEditorPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
