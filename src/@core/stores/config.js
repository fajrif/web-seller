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
  const icon = ref('tabler-check')
  const mode = ref()
  const position = ref('top')
  const timeout = ref(45000)

  function setMessage(col, msg) {
    color.value = col
    if(col == 'error') {
      icon.value = 'tabler-xbox-x'
    } else {
      icon.value = 'tabler-circle-check'
    }
    text.value = msg
    title.value = col.charAt(0).toUpperCase() + col.substring(1)
    visible.value = true
  }

  function close() {
    color.value = ''
    icon.value = 'tabler-check'
    visible.value = false
    title.value = ''
    text.value = ''
  }

  return { visible, title, text, color, icon, mode, position, timeout, setMessage, close }
})

// !SECTION
// FileUploadProduct
export const useFileUploadProductStore = defineStore('fileUploadProducts', () => {
  const products = ref([])
  const filename = ref('')

  function setDataParsed(data, _fname) {
		products.value = data.map((item, index) => {
			return { id: index + 1, ...item, ...validate(item) }
		})
		console.log(products.value)
		filename.value = _fname
  }

	function validate(item) {
		var errors = []

		// nama_produk
		var result = requiredValidator(item.nama_produk)
		if(typeof result === 'string') {
			errors.push('nama_produk: ' + result)
		}

		// deskripsi
		result = requiredValidator(item.deskripsi)
		if(typeof result === 'string') {
			errors.push('deskripsi: ' + result)
		} else {
			result = minLengthValidator(item.deskripsi,100)
			if(typeof result === 'string') {
				errors.push('deskripsi: ' + result)
			}
		}

		// id_kategori
		result = requiredValidator(item.id_kategori)
		if(typeof result === 'string') {
			errors.push('id_kategori: ' + result)
		} else {
			result = integerValidator(item.id_kategori)
			if(typeof result === 'string') {
				errors.push('id_kategori: ' + result)
			}
		}

		// kode_etalase
		result = requiredValidator(item.kode_etalase)
		if(typeof result === 'string') {
			errors.push('kode_etalase: ' + result)
		} else {
			result = integerValidator(item.kode_etalase)
			if(typeof result === 'string') {
				errors.push('kode_etalase: ' + result)
			}
		}

		// kondisi
		result = requiredValidator(item.kondisi)
		if(typeof result === 'string') {
			errors.push('kondisi: ' + result)
		} else {
			if(item.kondisi.toUpperCase() !== 'BARU' && item.kondisi.toUpperCase() !== 'BEKAS') {
				errors.push('kondisi: Pilihan Baru / Bekas')
			}
		}

		// harga
		result = requiredValidator(item.harga)
		if(typeof result === 'string') {
			errors.push('harga: ' + result)
		} else {
			result = integerValidator(item.harga)
			if(typeof result === 'string') {
				errors.push('harga: ' + result)
			}
		}

		// harga_coret
		result = requiredValidator(item.harga_coret)
		if(typeof result === 'string') {
			errors.push('harga_coret: ' + result)
		} else {
			result = integerValidator(item.harga_coret)
			if(typeof result === 'string') {
				errors.push('harga_coret: ' + result)
			}
		}

		// stok
		result = requiredValidator(item.stok)
		if(typeof result === 'string') {
			errors.push('stok: ' + result)
		} else {
			result = integerValidator(item.stok)
			if(typeof result === 'string') {
				errors.push('stok: ' + result)
			}
		}

		// minimum_pembelian
		result = requiredValidator(item.minimum_pembelian)
		if(typeof result === 'string') {
			errors.push('minimum_pembelian: ' + result)
		} else {
			result = integerValidator(item.minimum_pembelian)
			if(typeof result === 'string') {
				errors.push('minimum_pembelian: ' + result)
			} else {
				console.log('betweenValidator')
				result = betweenValidator(item.minimum_pembelian,1,9999)
				console.log(result)
				if(typeof result === 'string') {
					errors.push('minimum_pembelian: ' + result)
				}
			}
		}

		// berat
		result = requiredValidator(item.berat)
		if(typeof result === 'string') {
			errors.push('berat: ' + result)
		} else {
			result = integerValidator(item.berat)
			if(typeof result === 'string') {
				errors.push('berat: ' + result)
			}
		}

		// panjang
		result = requiredValidator(item.panjang)
		if(typeof result === 'string') {
			errors.push('panjang: ' + result)
		} else {
			result = integerValidator(item.panjang)
			if(typeof result === 'string') {
				errors.push('panjang: ' + result)
			}
		}

		// lebar
		result = requiredValidator(item.lebar)
		if(typeof result === 'string') {
			errors.push('lebar: ' + result)
		} else {
			result = integerValidator(item.lebar)
			if(typeof result === 'string') {
				errors.push('lebar: ' + result)
			}
		}

		// tinggi
		result = requiredValidator(item.tinggi)
		if(typeof result === 'string') {
			errors.push('tinggi: ' + result)
		} else {
			result = integerValidator(item.tinggi)
			if(typeof result === 'string') {
				errors.push('tinggi: ' + result)
			}
		}

		return {
			status: errors.length === 0,
			errors: errors
		}
	}

  function remove(id) {
		products.value = products.value.filter((item) => item.id !== parseInt(id))
  }

  function clear() {
		products.value = []
		filename.value = ''
  }

  return { products, filename, setDataParsed, remove, clear }
})
