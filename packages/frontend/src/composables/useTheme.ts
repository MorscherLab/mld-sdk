import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(theme: 'light' | 'dark') {
    isDark.value = theme === 'dark'
  }

  watch(isDark, (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('mld-theme', dark ? 'dark' : 'light')
  })

  onMounted(() => {
    const savedTheme = localStorage.getItem('mld-theme')
    if (savedTheme === 'dark') {
      isDark.value = true
    } else if (savedTheme === 'light') {
      isDark.value = false
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
  }
}
