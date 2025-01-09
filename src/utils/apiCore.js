import { ofetch } from 'ofetch'

export const $apiCore = ofetch.create({
  baseURL: import.meta.env.VITE_API_CORE_URL,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken)
      options.headers.append('Authorization', `Bearer ${accessToken}`)
  },
})
