/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // SECURITY-FIX-CSP-001: Add CSP and security headers [2026-05-18]
  // FORCE-REBUILD-2026-05-15: Rebuild with updated NEXT_PUBLIC_API_URL for Timeweb backend
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    // Extract origin from API URL for CSP directives
    let apiOrigin = '';
    try {
      apiOrigin = apiUrl ? new URL(apiUrl).origin : '';
    } catch {
      apiOrigin = '';
    }
    // Fallback for Timeweb backend when env var is stale in build cache
    const prodApiOrigin = 'https://makarowgrad-vront-backend-53ee.twc1.net';
    const cspApiOrigins = isDev
      ? ['http://localhost:3001', 'http://192.168.1.37:3001']
      : [prodApiOrigin, apiOrigin].filter(Boolean);
    const cspApiOriginStr = cspApiOrigins.join(' ');
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              // DEV: images served from backend on different port
              isDev
                ? "img-src 'self' blob: data: http://localhost:3001 http://192.168.1.37:3001"
                : `img-src 'self' blob: data: ${cspApiOriginStr}`,
              "font-src 'self'",
              // DEV: allow API calls to backend on different port
              isDev
                ? "connect-src 'self' http://localhost:3001 http://192.168.1.37:3001"
                : `connect-src 'self' ${cspApiOriginStr}`,
              // Always allow Max WebApp script source
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://st.max.ru"
                : "script-src 'self' 'unsafe-inline' https://st.max.ru",
              "worker-src 'self'",
              "manifest-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Only enforce HTTPS upgrade on production (breaks local HTTP dev)
              ...(isDev ? [] : ['upgrade-insecure-requests']),
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          // DEV: disable HSTS on local dev (causes HTTPS pinning issues on mobile)
          ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]),
        ],
      },
    ];
  },
};

module.exports = nextConfig;
