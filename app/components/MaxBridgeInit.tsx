'use client';

import { useEffect } from 'react';
import { initMaxWebApp, isMaxWebApp } from '@/app/lib/max-bridge';

export function MaxBridgeInit() {
  useEffect(() => {
    if (isMaxWebApp()) {
      initMaxWebApp();
    }
  }, []);

  return null;
}
