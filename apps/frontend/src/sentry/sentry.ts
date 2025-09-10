import * as Sentry from '@sentry/react'

const initializeSentry = () => {
  Sentry.init({
    dsn: 'https://6651c8da0140cfb0a365d8f77448a23a@o4509837349814272.ingest.de.sentry.io/4509837351649360',
    sendDefaultPii: true,
    environment: process.env.IS_DEVELOPMENT === 'true' ? 'DEV' : 'PROD',
    tracesSampleRate: process.env.IS_DEVELOPMENT === 'true' ? 1 : 0.4,
    profilesSampleRate: process.env.IS_DEVELOPMENT === 'true' ? 1 : 0.4,
    enableLogs: true,
    integrations: [Sentry.browserTracingIntegration()],
    tracePropagationTargets: ['localhost', /^https:\/\/api\.kadernikplus\.cz/],
  })
}

export default initializeSentry
