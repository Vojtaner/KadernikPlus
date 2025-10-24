import * as Sentry from '@sentry/react';

const initializeSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DNS,
    sendDefaultPii: true,
    environment: import.meta.env.VITE_ENVIRONMENT,
    tracesSampleRate: import.meta.env.VITE_IS_DEVELOPMENT === 'true' ? 1 : 0.4,
    profilesSampleRate: import.meta.env.VITE_IS_DEVELOPMENT === 'true' ? 1 : 0.4,
    enableLogs: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    replaysSessionSampleRate: import.meta.env.VITE_IS_DEVELOPMENT === 'true' ? 1 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/api\.kadernikplus\.cz/,
      /^https:\/\/api-preprod\.kadernikplus\.cz/,
    ],
  });

  return Sentry;
};

export default initializeSentry;
