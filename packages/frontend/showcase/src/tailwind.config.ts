import type { Config } from 'tailwindcss'
import mldPreset from '@morscherlab/mld-sdk/tailwind.preset'

export default {
  content: [
    '../index.html',
    './**/*.{vue,js,ts,jsx,tsx}',
    '../../src/components/**/*.vue',
    '../../dist/**/*.js',
  ],
  presets: [mldPreset],
} satisfies Config
