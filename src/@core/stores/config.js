import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'
import { cookieRef, useLayoutConfigStore } from '@layouts/stores/config'
import { isEmpty, isEmptyArray, isNullOrUndefined } from '@core/utils/helpers'
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

  function setFileName(_fname) {
		filename.value = _fname
  }

  function setDataParsed(data) {
		if(isEmpty(data[0])){
			console.log('Skip data nama_produk kosong:' + data[0])
		} else {
			if(isNaN(data[1]) || isEmpty(data[1])){
			} else {
				var index = products.value.length + 1
				var item = {
					id: index,
					nama_produk: data[0],
					id_kategori: parseInt(data[1]),
					kode_etalase: parseInt(data[2]),
					kondisi: data[3],
					harga: parseInt(data[4]) || 0,
					harga_coret: parseInt(data[5]) || 0,
					berat: data[6],
					panjang: data[7],
					lebar: data[8],
					tinggi: data[9],
					minimum_pembelian: data[10],
					stok: data[11],
					deskripsi: data[12],
					image_url: data[13],
				}
				var validatedItem = validate(item)
				products.value.push({ ...item, ...validatedItem })
			}
		}
  }

	function validate(item) {
		var errors = []

		// gambar
		var result = requiredValidator(item.image_url)
		if(typeof result === 'string') {
			errors.push('image_url: ' + result)
		}

		// nama_produk
		var result = requiredValidator(item.nama_produk)
		if(typeof result === 'string') {
			errors.push('nama_produk: ' + result)
		} else {
			result = alphaDashValidator(item.nama_produk)
			if(typeof result === 'string') {
				errors.push('nama_produk: ' + result)
			}
		}

		// deskripsi
		result = requiredValidator(item.deskripsi)
		if(typeof result === 'string') {
			errors.push('deskripsi: ' + result)
		} else {
			result = lineBreaksValidator(item.deskripsi)
			if(typeof result === 'string') {
				errors.push('deskripsi: ' + result)
			} else {
				result = minLengthValidator(item.deskripsi,100)
				if(typeof result === 'string') {
					errors.push('deskripsi: ' + result)
				}
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
			} else {
				result = minIntegerValidator(item.harga,1)
				if(typeof result === 'string') {
					errors.push('harga: ' + result)
				}
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
			} else {
				if(item.harga !== '' && item.harga !== null) {
					result = minIntegerValidator(item.harga_coret,Math.floor(item.harga) + 1)
					if(typeof result === 'string') {
						errors.push('harga_coret: ' + result)
					}
				}
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
			} else {
				result = betweenValidator(item.stok,1,9999)
				if(typeof result === 'string') {
					errors.push('stok: ' + result)
				}
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
				result = betweenValidator(item.minimum_pembelian,1,9999)
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
			} else {
				result = betweenValidator(item.berat,10,999999999)
				if(typeof result === 'string') {
					errors.push('berat: ' + result)
				}
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
			} else {
				result = betweenValidator(item.panjang,10,999999999)
				if(typeof result === 'string') {
					errors.push('panjang: ' + result)
				}
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
			} else {
				result = betweenValidator(item.lebar,10,999999999)
				if(typeof result === 'string') {
					errors.push('lebar: ' + result)
				}
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
			} else {
				result = betweenValidator(item.tinggi,10,999999999)
				if(typeof result === 'string') {
					errors.push('tinggi: ' + result)
				}
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

  return { products, filename, setDataParsed, validate, remove, clear, setFileName }
}, {
  persist: {
    storage: localStorage,
		key: 'file-upload-products',
  },
})

// !SECTION
// userData
export const useUserDataStore = defineStore('userData', () => {
  const id = ref()
  const name = ref()
  const photo_url = ref()
  const status = ref()
  const phone = ref()

  function setUserData(data) {
		id.value = data.merchant.id
		name.value = data.merchant.name
		photo_url.value = data.merchant.photo_url
		status.value = data.merchant.status
		phone.value = data.user.phone
  }

  function clear() {
		localStorage.removeItem('user-data')
		localStorage.removeItem('file-upload-products')
		getActivePinia()._s.forEach(store => {
			if(store.$id == "fileUploadProducts") {
				 store.clear()
			}
			id.value = null
			name.value = null
			photo_url.value = null
			status.value = null
			phone.value = null
		});
  }

  return { id, name, photo_url, status, phone, setUserData, clear }
}, {
  persist: {
    storage: localStorage,
		key: 'user-data',
  },
})
