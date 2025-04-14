import { useUserDataStore } from '@core/stores/config'
import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApiCore = createFetch({
  baseUrl: import.meta.env.VITE_API_CORE_URL,
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }

      return { options }
    },
		onFetchError(ctx) {
      const { data, response } = ctx
      let parsedData = null
      try {
        // Invalid or expired JWT
        if(response.status == 401) {
					var userData = useUserDataStore()
          // Remove "accessToken" from cookie
          useCookie('accessToken').value = null
          // Remove "userAbilities" from cookie
          useCookie('userAbilityRules').value = null
					userData.clear()
					window.location.href = '/login'
        }
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }
      return { data: parsedData, response }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON
      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      return { data: parsedData, response }
    },
  },
})
