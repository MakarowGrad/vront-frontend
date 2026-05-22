'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Share2, PlusSquare, Smartphone, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa_install_dismissed_v1';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return Date.now() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // silent
  }
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (standalone) {
      setIsStandalone(true);
      return;
    }

    // Already dismissed recently — don't annoy the user
    if (wasDismissedRecently()) {
      return;
    }

    // iOS detection
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIos(ios);

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    // Android/Chrome: catch beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback for browsers that never fire beforeinstallprompt
    // Only show after a delay and if we haven't seen the real prompt
    fallbackTimer = setTimeout(() => {
      setDeferredPrompt((prev) => {
        if (!prev) setVisible(true);
        return prev;
      });
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === 'accepted') {
      markDismissed();
      setVisible(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    markDismissed();
    setVisible(false);
  }, []);

  if (isStandalone || !visible) return null;

  // Android/Chrome with install prompt
  if (!isIos && deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-[60] md:bottom-4 md:left-auto md:right-4 md:w-80">
        <div className="bg-surface-primary border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-text-primary">
                Добавьте на главный экран
              </p>
              <p className="text-caption text-text-muted mt-0.5">
                Быстрый доступ и работа без интернета
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2 px-3 bg-gold hover:bg-gold-light text-background-primary text-body-xs font-semibold rounded-lg transition-colors"
                >
                  Установить
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-2 px-3 text-text-muted hover:text-text-primary text-body-xs rounded-lg hover:bg-surface-hover transition-colors"
                >
                  Скрыть
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-surface-hover text-text-muted shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android fallback (no beforeinstallprompt yet)
  if (!isIos) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-[60] md:bottom-4 md:left-auto md:right-4 md:w-80">
        <div className="bg-surface-primary border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-text-primary">
                Добавьте на главный экран
              </p>
              <p className="text-caption text-text-muted mt-1">
                Нажмите{' '}
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
                  <MoreVertical className="w-3 h-3" /> ⋮
                </span>
                {' '}вверху Chrome, затем «Добавить на главный экран»
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2 px-3 text-text-muted hover:text-text-primary text-body-xs rounded-lg hover:bg-surface-hover transition-colors"
                >
                  Понятно
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-surface-hover text-text-muted shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Safari hint
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-surface-primary border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-text-primary">
              Добавьте на экран «Домой»
            </p>
            <p className="text-caption text-text-muted mt-1">
              Нажмите{' '}
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
                <Share2 className="w-3 h-3" /> Поделиться
              </span>
              {' '}внизу Safari, затем{' '}
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
                <PlusSquare className="w-3 h-3" /> На экран «Домой»
              </span>
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 px-3 text-text-muted hover:text-text-primary text-body-xs rounded-lg hover:bg-surface-hover transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-surface-hover text-text-muted shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
