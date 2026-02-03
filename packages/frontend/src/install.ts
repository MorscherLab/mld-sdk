import type { App, Plugin } from 'vue'
import * as components from './components'

/**
 * Vue plugin that registers all MLD SDK components globally.
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { MLDSdk } from '@estrellaxd/mld-sdk'
 * import '@estrellaxd/mld-sdk/styles'
 *
 * const app = createApp(App)
 * app.use(MLDSdk)
 * ```
 */
export const MLDSdk: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      // Check if it's a valid Vue component (has setup, render, or template)
      if (
        component &&
        typeof component === 'object' &&
        ('setup' in component || 'render' in component || '__name' in component)
      ) {
        app.component(name, component as Parameters<typeof app.component>[1])
      }
    }
  },
}

export default MLDSdk
