'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // SECURITY-FIX-SW-001: Require HTTPS for SW registration [2026-05-18]
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        return;
      }
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((_registration) => {
          // SW registered
        })
        .catch((_error) => {
          // Silent fail
        });
    }
  }, []);
  return null;
}
