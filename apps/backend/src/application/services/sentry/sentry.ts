import { getEnvVar } from "../../../utils/getEnvVar";
import Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

Sentry.init({
  dsn: getEnvVar("SENTRY_DSN"),
  sendDefaultPii: true,
});

export default Sentry;
