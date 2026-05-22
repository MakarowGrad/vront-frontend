'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface OfflineContextValue {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOrderCount: number;
  lastSyncError: string | null;
  checkNow: () => void;
}

const OfflineContext = createContext<OfflineContextValue>({
  isOnline: true,
  isSyncing: false,
  pendingOrderCount: 0,
  lastSyncError: null,
  checkNow: () => {},
});

export function useOffline() {
  return useContext(OfflineContext);
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const checkPending = useCallback(async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const channel = new MessageChannel();
      const promise = new Promise<{ count: number }>((resolve) => {
        channel.port1.onmessage = (event) => resolve(event.data);
      });
      navigator.serviceWorker.controller.postMessage({ type: 'GET_PENDING_COUNT' }, [channel.port2]);
      const result = await promise;
      setPendingOrderCount(result.count);
    }
  }, []);

  const checkNow = useCallback(async () => {
    await checkPending();
  }, [checkPending]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncError(null);
      // trigger sync check
      checkPending();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkPending();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkPending]);

  // Listen for sync messages from SW
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_STATUS') {
        setIsSyncing(event.data.isSyncing);
        if (event.data.error) setLastSyncError(event.data.error);
        checkPending();
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, [checkPending]);

  return (
    <OfflineContext.Provider value={{ isOnline, isSyncing, pendingOrderCount, lastSyncError, checkNow }}>
      {children}
    </OfflineContext.Provider>
  );
}
