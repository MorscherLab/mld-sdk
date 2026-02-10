import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createPinia } from 'pinia'
import './styles/index.css'

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(createPinia())

  // Sync Histoire dark mode toggle to html.dark class (drives CSS variables)
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = (dark: boolean) => {
      document.documentElement.classList.toggle('dark', dark)
    }
    sync(mq.matches)
    mq.addEventListener('change', (e) => sync(e.matches))
  }
})
