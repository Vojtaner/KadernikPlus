import { getEnvVar } from "./getEnvVar";

const allowedOrigins = getEnvVar("CORS_ORIGINS")?.split(",") || [];

const originPatterns = allowedOrigins
  .map((pattern) => {
    try {
      if (!pattern.includes("*") && !pattern.includes(".")) {
        return new RegExp(
          `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
        );
      }
      return new RegExp(pattern);
    } catch {
      console.warn(`Invalid CORS pattern skipped: ${pattern}`);
      return null;
    }
  })
  .filter(Boolean) as RegExp[];

const checkCors = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (!origin) {
    return callback(null, true);
  }

  const isAllowed = originPatterns.some((regex) => regex.test(origin));

  if (isAllowed) {
    callback(null, true);
  } else {
    callback(new Error("Nepovolené CORS policy."));
  }
};

export default checkCors;
