import { ofetch } from 'ofetch'

export const $apiAuth = ofetch.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken)
      options.headers.append('Authorization', `Bearer ${accessToken}`)
  },
})
