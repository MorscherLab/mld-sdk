import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createPinia } from 'pinia'
import './custom.css'

import DemoSection from '../components/DemoSection.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(createPinia())

    app.component('DemoSection', DemoSection)
  },
}

export default theme
