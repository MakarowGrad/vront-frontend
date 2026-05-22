/**
 * Root Layout
 */

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Providers } from './providers';
import { PWARegister } from './components/PWARegister';
import { InstallPWA } from './components/InstallPWA';
import { MaxBridgeInit } from './components/MaxBridgeInit';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'В СВОЕЙ ТАРЕЛКЕ | Фуршетный мастер Жанна',
    template: '%s | В СВОЕЙ ТАРЕЛКЕ',
  },
  description: 'Фуршеты и праздничные столы от мастера Жанны в Жигалово.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* SECURITY-FIX-CSP-002: Replaced dangerouslySetInnerHTML with external script [2026-05-18] */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <Script src="https://st.max.ru/js/max-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <PWARegister />
        <InstallPWA />
        <MaxBridgeInit />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
