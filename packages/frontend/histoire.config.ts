import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.ts',
  storyMatch: ['src/**/*.story.vue'],
  storyIgnored: ['**/node_modules/**', '**/dist/**'],
  tree: {
    file: 'title',
    order: 'asc',
  },
  theme: {
    title: 'MLD SDK',
    defaultColorScheme: 'auto',
  },
  vite: {
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname },
    },
  },
  backgroundPresets: [
    { label: 'Light', color: '#F8FAFC', contrastColor: '#1E293B' },
    { label: 'Dark', color: '#0F172A', contrastColor: '#F8FAFC' },
    { label: 'White', color: '#FFFFFF', contrastColor: '#1E293B' },
  ],
  defaultStoryProps: {
    layout: { type: 'single', iframe: false },
    autoPropsDisabled: false,
  },
})
