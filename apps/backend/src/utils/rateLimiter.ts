import rateLimit from "express-rate-limit";
import { getEnvVar } from "./getEnvVar";

const rateLimiter = rateLimit({
  windowMs: Number(getEnvVar("RATE_LIMIT_WINDOW_MS")) || 60_000,
  max: Number(getEnvVar("RATE_LIMIT_MAX")) || 20,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(429).send("Too many requests");
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

export default rateLimiter;
