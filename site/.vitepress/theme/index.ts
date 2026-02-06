import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createPinia } from 'pinia'
import './custom.css'

// Import showcase helper components for global registration
import DemoSection from '../components/DemoSection.vue'
import PageHeader from '../components/PageHeader.vue'
import PropsTable from '../components/PropsTable.vue'
import EventsTable from '../components/EventsTable.vue'
import CodeBlock from '../components/CodeBlock.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(createPinia())

    // Register showcase helper components globally
    app.component('DemoSection', DemoSection)
    app.component('PageHeader', PageHeader)
    app.component('PropsTable', PropsTable)
    app.component('EventsTable', EventsTable)
    app.component('ShowcaseCodeBlock', CodeBlock)
  },
}

export default theme
