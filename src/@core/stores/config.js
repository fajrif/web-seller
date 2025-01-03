import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'
import { cookieRef, useLayoutConfigStore } from '@layouts/stores/config'
import { themeConfig } from '@themeConfig'

// SECTION Store
export const useConfigStore = defineStore('config', () => {
  // 👉 Theme
  const userPreferredColorScheme = usePreferredColorScheme()
  const cookieColorScheme = cookieRef('color-scheme', 'light')

  watch(userPreferredColorScheme, val => {
    if (val !== 'no-preference')
      cookieColorScheme.value = val
  }, { immediate: true })

  const theme = cookieRef('theme', themeConfig.app.theme)

  // 👉 isVerticalNavSemiDark
  const isVerticalNavSemiDark = cookieRef('isVerticalNavSemiDark', themeConfig.verticalNav.isVerticalNavSemiDark)

  // 👉 isVerticalNavSemiDark
  const skin = cookieRef('skin', themeConfig.app.skin)

  // ℹ️ We need to use `storeToRefs` to forward the state
  const { isLessThanOverlayNavBreakpoint, appContentWidth, navbarType, isNavbarBlurEnabled, appContentLayoutNav, isVerticalNavCollapsed, footerType, isAppRTL } = storeToRefs(useLayoutConfigStore())

  return {
    theme,
    isVerticalNavSemiDark,
    skin,

    // @layouts exports
    isLessThanOverlayNavBreakpoint,
    appContentWidth,
    navbarType,
    isNavbarBlurEnabled,
    appContentLayoutNav,
    isVerticalNavCollapsed,
    footerType,
    isAppRTL,
  }
})

// !SECTION
// SECTION Init
export const initConfigStore = () => {
  const userPreferredColorScheme = usePreferredColorScheme()
  const vuetifyTheme = useTheme()
  const configStore = useConfigStore()

  watch([() => configStore.theme, userPreferredColorScheme], () => {
    vuetifyTheme.global.name.value = configStore.theme === 'system'
      ? userPreferredColorScheme.value === 'dark'
        ? 'dark'
        : 'light'
      : configStore.theme
  })
  onMounted(() => {
    if (configStore.theme === 'system')
      vuetifyTheme.global.name.value = userPreferredColorScheme.value
  })
}

// !SECTION
// SnackBar
export const useMessageStore = defineStore('snackbar', () => {
	const visible = ref(false)
	const title = ref('')
	const text = ref('')
	const color = ref()
	const icon = ref('tabler-info-circle')
	const mode = ref()
	const position = ref('top')
	const timeout = ref(45000)

  function setMessage(col, msg) {
    color.value = col
    text.value = msg
    title.value = col.charAt(0).toUpperCase() + col.substring(1)
    visible.value = true
  }

  function close() {
    color.value = ''
    visible.value = false
    title.value = ''
    text.value = ''
  }

  return { visible, title, text, color, icon, mode, position, timeout, setMessage, close }
})
