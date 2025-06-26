import { handlers } from './handlers'
import { setupWorker } from 'msw/browser'

const worker = setupWorker(...handlers)

export async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'false') {
    return
  }

  return worker.start()
}
