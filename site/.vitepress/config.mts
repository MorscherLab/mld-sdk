import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

const guideSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Quick Start', link: '/guide/getting-started' },
      { text: 'Skill Setup', link: '/guide/skill-setup' },
    ],
  },
  {
    text: 'Building Plugins',
    items: [
      { text: 'Full-Stack Plugin', link: '/integration/fullstack-plugin' },
    ],
  },
]

export default defineConfig({
  title: 'MLD SDK',
  description: 'SDK for building plugins that integrate with the MorscherLab Database platform',
  base: '/mld-sdk/',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Python SDK', link: '/python/plugin-guide' },
      { text: 'Frontend SDK', link: '/frontend/components' },
      { text: 'Showcase', link: '/showcase/' },
    ],

    sidebar: {
      '/guide/': guideSidebar,
      '/integration/': guideSidebar,
      '/python/': [
        {
          text: 'Python SDK',
          items: [
            { text: 'Plugin Guide', link: '/python/plugin-guide' },
            { text: 'API Reference', link: '/python/api-reference' },
            { text: 'Exceptions', link: '/python/exceptions' },
            { text: 'R Integration', link: '/python/r-integration' },
          ],
        },
      ],
      '/frontend/': [
        {
          text: 'Frontend SDK',
          items: [
            { text: 'Components', link: '/frontend/components' },
            { text: 'Composables', link: '/frontend/composables' },
            { text: 'Theming', link: '/frontend/theming' },
            { text: 'API Reference', link: '/frontend/api-reference' },
          ],
        },
      ],
      '/showcase/': [
        {
          text: 'Overview',
          link: '/showcase/',
        },
        {
          text: 'Buttons',
          items: [
            { text: 'BaseButton', link: '/showcase/button' },
            { text: 'IconButton', link: '/showcase/icon-button' },
            { text: 'DropdownButton', link: '/showcase/dropdown-button' },
          ],
        },
        {
          text: 'Form Inputs',
          items: [
            { text: 'BaseInput', link: '/showcase/input' },
            { text: 'BaseTextarea', link: '/showcase/textarea' },
            { text: 'BaseSelect', link: '/showcase/select' },
            { text: 'BaseCheckbox', link: '/showcase/checkbox' },
            { text: 'BaseToggle', link: '/showcase/toggle' },
            { text: 'BaseRadioGroup', link: '/showcase/radio' },
            { text: 'BaseSlider', link: '/showcase/slider' },
            { text: 'ColorSlider', link: '/showcase/color-slider' },
            { text: 'NumberInput', link: '/showcase/number-input' },
            { text: 'DatePicker', link: '/showcase/date-picker' },
            { text: 'TagsInput', link: '/showcase/tags-input' },
            { text: 'FileUploader', link: '/showcase/file-uploader' },
            { text: 'FormField', link: '/showcase/form-field' },
            { text: 'SegmentedControl', link: '/showcase/segmented-control' },
            { text: 'MultiSelect', link: '/showcase/multi-select' },
          ],
        },
        {
          text: 'Feedback',
          items: [
            { text: 'AlertBox', link: '/showcase/alert' },
            { text: 'ToastNotification', link: '/showcase/toast' },
            { text: 'Skeleton', link: '/showcase/skeleton' },
            { text: 'BasePill', link: '/showcase/pill' },
          ],
        },
        {
          text: 'Layout',
          items: [
            { text: 'BaseTabs', link: '/showcase/tabs' },
            { text: 'AppTopBar', link: '/showcase/top-bar' },
            { text: 'AppSidebar', link: '/showcase/sidebar' },
            { text: 'AppLayout', link: '/showcase/layout' },
            { text: 'BaseModal', link: '/showcase/modal' },
            { text: 'CollapsibleCard', link: '/showcase/collapsible-card' },
            { text: 'ThemeToggle', link: '/showcase/theme-toggle' },
          ],
        },
        {
          text: 'Data Display',
          items: [
            { text: 'Calendar', link: '/showcase/calendar' },
            { text: 'DataFrame', link: '/showcase/dataframe' },
          ],
        },
        {
          text: 'Lab Components',
          items: [
            { text: 'WellPlate', link: '/showcase/well-plate' },
            { text: 'RackEditor', link: '/showcase/rack-editor' },
            { text: 'SampleLegend', link: '/showcase/sample-legend' },
            { text: 'PlateMapEditor', link: '/showcase/plate-map-editor' },
            { text: 'ExperimentTimeline', link: '/showcase/experiment-timeline' },
            { text: 'MoleculeInput', link: '/showcase/molecule-input' },
            { text: 'ConcentrationInput', link: '/showcase/concentration-input' },
            { text: 'DoseCalculator', link: '/showcase/dose-calculator' },
            { text: 'ReagentList', link: '/showcase/reagent-list' },
            { text: 'SampleHierarchyTree', link: '/showcase/sample-hierarchy-tree' },
            { text: 'ProtocolStepEditor', link: '/showcase/protocol-step-editor' },
          ],
        },
        {
          text: 'Sample Management',
          items: [
            { text: 'SampleSelector', link: '/showcase/sample-selector' },
            { text: 'GroupAssigner', link: '/showcase/group-assigner' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MorscherLab/mld-sdk' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © MorscherLab',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@showcase': resolve(__dirname, 'showcase'),
        '@components': resolve(__dirname, 'components'),
      },
    },
  },
})
