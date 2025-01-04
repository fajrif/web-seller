import { setupWorker } from 'msw/browser'

// Handlers
import { handlerAuth } from '@db/auth/index'
import { handlerPagesFaq } from '@db/pages/faq/index'

const worker = setupWorker(...handlerAuth, ...handlerPagesFaq)
export default function () {
  const workerUrl = `${import.meta.env.BASE_URL ?? '/'}mockServiceWorker.js`

  worker.start({
    serviceWorker: {
      url: workerUrl,
    },
    onUnhandledRequest: 'bypass',
  })
}
