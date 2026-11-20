import { NextRequest } from "next/server";

/**
 * Validates request origin against allowed host to mitigate CSRF attacks.
 */
export function verifyCsrfOrigin(request: NextRequest): boolean {
  // Safe methods don't mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    // If running in development or server-to-server tests where origin may be omitted
    if (process.env.NODE_ENV !== "production") {
      return true;
    }
    return false;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
