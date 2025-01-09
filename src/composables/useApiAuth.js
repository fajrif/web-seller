import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApiAuth = createFetch({
  baseUrl: import.meta.env.VITE_API_AUTH_URL,
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
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
