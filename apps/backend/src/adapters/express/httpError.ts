export function httpError(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
) {
  const error = new Error(message) as Error & {
    status: number;
    code?: string;
    details?: unknown;
  };
  error.status = status;
  if (code) error.code = code;
  if (details) error.details = details;
  return error;
}
