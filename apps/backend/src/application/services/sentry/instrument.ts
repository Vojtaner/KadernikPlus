import Sentry from "@sentry/node";
import { getEnvVar } from "../../../utils/getEnvVar";

const initSentry = () => {
  Sentry.init({
    sampleRate: 1,
    release: `KadeřníkPlus-release`,
    environment: getEnvVar("IS_DEVELOPMENT") ? "DEV" : "PROD",
    dsn: getEnvVar("SENTRY_DSN"),
    sendDefaultPii: true,
    tracesSampleRate: getEnvVar("IS_DEVELOPMENT") ? 1 : 0.4,
    profilesSampleRate: getEnvVar("IS_DEVELOPMENT") ? 1 : 0.4,
    enableLogs: true,
    integrations: [
      Sentry.expressIntegration(),
      Sentry.prismaIntegration(),
      Sentry.httpIntegration(),
    ],
  });

  return Sentry;
};

export default initSentry;
