'use client';

import { useOffline } from './OfflineProvider';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

export function NetworkStatusBar() {
  const { isOnline, isSyncing, pendingOrderCount, lastSyncError } = useOffline();

  if (isOnline && !isSyncing && !lastSyncError) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      {!isOnline && (
        <div className="bg-warning/90 backdrop-blur-sm text-background px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          <WifiOff className="w-4 h-4" />
          <span>Нет интернета. Вы работаете в офлайн-режиме.</span>
        </div>
      )}
      {isOnline && isSyncing && (
        <div className="bg-gold/90 backdrop-blur-sm text-background px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Синхронизация заказов...</span>
        </div>
      )}
      {isOnline && !isSyncing && lastSyncError && (
        <div className="bg-error/90 backdrop-blur-sm text-background px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{lastSyncError}</span>
        </div>
      )}
    </div>
  );
}
