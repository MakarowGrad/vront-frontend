'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setupBackButton, isMaxWebApp } from '@/app/lib/max-bridge';

export function useMaxBackButton(enabled = true) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || !isMaxWebApp()) return;

    const cleanup = setupBackButton(() => {
      router.back();
    });

    return cleanup;
  }, [enabled, router]);
}
