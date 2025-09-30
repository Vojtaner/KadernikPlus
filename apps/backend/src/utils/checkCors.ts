import { getEnvVar } from "./getEnvVar";

const allowedOrigins = getEnvVar("CORS_ORIGINS")?.split(",") || [];

const checkCors = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (!origin) return callback(null, true);

  try {
    const url = new URL(origin);
    const host = url.host;

    // Pro každou povolenou doménu kontrolujeme:
    // - přesná shoda
    // - subdomény (např. frontend-pr-37.up.railway.app)
    const isAllowed = allowedOrigins.some((allowed) => {
      // povolený vzor obsahuje hvězdičku -> glob-like match
      if (allowed.includes("*")) {
        const regex = new RegExp(
          "^" + allowed.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$"
        );
        return regex.test(host);
      }
      return host === allowed || host.endsWith(`.${allowed}`);
    });

    callback(isAllowed ? null : new Error("Nepovolené CORS"), isAllowed);
  } catch {
    callback(new Error("Nepovolené CORS"));
  }
};

export default checkCors;
