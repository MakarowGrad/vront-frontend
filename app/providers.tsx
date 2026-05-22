/**
 * Providers Component - Luxury Food Delivery
 * Wraps the application with all necessary providers
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { OfflineProvider } from './components/OfflineProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineProvider>
        {children}
      </OfflineProvider>
    </QueryClientProvider>
  );
}
