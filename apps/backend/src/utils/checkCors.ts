import { getEnvVar } from "./getEnvVar";

const allowedOriginsRaw = getEnvVar("CORS_ORIGINS")?.split(",") || [];

// Rozdělit na přesné URL a regexy
const allowedExact: string[] = [];
const allowedRegex: RegExp[] = [];

allowedOriginsRaw.forEach((pattern) => {
  pattern = pattern.trim();
  if (!pattern) return;

  // Pokud začíná ^ nebo končí $, považovat za regex
  if (pattern.startsWith("^") || pattern.endsWith("$")) {
    try {
      allowedRegex.push(new RegExp(pattern));
    } catch (err) {
      console.warn(`Invalid CORS regex skipped: ${pattern}`);
    }
  } else {
    // Přesná URL → escapujeme pro RegExp interně
    allowedExact.push(pattern);
  }
});

export const checkCors = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (!origin) return callback(null, true);

  // Přesná shoda
  if (allowedExact.includes(origin)) return callback(null, true);

  // Regex shoda
  const regexMatch = allowedRegex.some((r) => r.test(origin));
  if (regexMatch) return callback(null, true);

  // Nepovolené
  console.warn(`CORS blocked: ${origin}`);
  callback(new Error("Nepovolené CORS policy."));
};
