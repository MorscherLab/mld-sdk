import type { Config } from 'tailwindcss'

const mldPreset = {
  theme: {
    extend: {
      colors: {
        mld: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          'primary-light': '#93C5FD',
          cta: '#F97316',
          'cta-hover': '#EA580C',
          danger: '#EF4444',
          'danger-hover': '#DC2626',
          success: '#10B981',
          'success-hover': '#059669',
          warning: '#F59E0B',
          'warning-hover': '#D97706',
        },
        bg: {
          primary: 'var(--mld-bg-primary)',
          secondary: 'var(--mld-bg-secondary)',
          card: 'var(--mld-bg-card)',
          hover: 'var(--mld-bg-hover)',
          input: 'var(--mld-bg-input)',
        },
        text: {
          primary: 'var(--mld-text-primary)',
          secondary: 'var(--mld-text-secondary)',
          muted: 'var(--mld-text-muted)',
          inverse: 'var(--mld-text-inverse)',
        },
        border: {
          DEFAULT: 'var(--mld-border)',
          focus: 'var(--mld-border-focus)',
        },
      },
      fontFamily: {
        sans: ['Fira Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        mld: '0.5rem',
        'mld-sm': '0.375rem',
        'mld-lg': '0.75rem',
      },
      boxShadow: {
        mld: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'mld-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'mld-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        mld: '150ms',
      },
    },
  },
} satisfies Partial<Config>

export default mldPreset
