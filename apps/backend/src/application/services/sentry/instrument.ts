import Sentry from "@sentry/node";
import { getEnvVar } from "../../../utils/getEnvVar";
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  sampleRate: 1,
  release: `KadeřníkPlus-release`,
  environment: getEnvVar("ENVIRONMENT"),
  dsn: getEnvVar("SENTRY_DSN"),
  sendDefaultPii: true,
  tracesSampleRate: getEnvVar("IS_DEVELOPMENT") === "true" ? 1 : 1, //později produkce 0.4
  profilesSampleRate: getEnvVar("IS_DEVELOPMENT") === "true" ? 1 : 1, //později produkce 0.4
  enableLogs: true,
  integrations: [
    Sentry.expressIntegration(),
    Sentry.prismaIntegration(),
    Sentry.httpIntegration(),
    // nodeProfilingIntegration(),
  ],
});

export default Sentry;
