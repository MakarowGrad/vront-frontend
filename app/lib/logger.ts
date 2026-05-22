/**
 * Safe logger that strips sensitive data and only logs in development
 * SECURITY-FIX-INF-002: Replace raw console.log with safe logger [2026-05-18]
 */

const isDev = process.env.NODE_ENV === 'development';

function sanitize(args: unknown[]): unknown[] {
  return args.map((arg) => {
    if (typeof arg === 'string') {
      // Mask tokens, cookies, auth headers
      return arg
        .replace(/Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*/g, 'Bearer [REDACTED]')
        .replace(/access_token=[^;\s&]*/g, 'access_token=[REDACTED]')
        .replace(/refresh_token=[^;\s&]*/g, 'refresh_token=[REDACTED]')
        .replace(/"token"\s*:\s*"[^"]*"/g, '"token":"[REDACTED]"')
        .replace(/"accessToken"\s*:\s*"[^"]*"/g, '"accessToken":"[REDACTED]"');
    }
    return arg;
  });
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...sanitize(args));
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...sanitize(args));
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...sanitize(args));
  },
};
