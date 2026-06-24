'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { Menu, Crown, Loader2 } from 'lucide-react';
import { getAccessToken, refreshToken, clearAccessToken, apiFetch } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const isLoginPage = pathname?.startsWith('/admin/login') ?? false;

  const handleLogout = async () => {
    try {
      await apiFetch('/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    clearAccessToken();
    queryClient.clear();
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    if (isLoginPage) return;

    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        try {
          await refreshToken();
        } catch {
          window.location.href = '/admin/login';
        }
      }
      setIsAuthLoading(false);
    };

    const adminTheme = localStorage.getItem('adminTheme') || 'dark';
    const html = document.documentElement;
    html.classList.remove('dark', 'light', 'custom');
    html.classList.add(adminTheme);

    checkAuth();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkAuth();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // SECURITY: if the browser restored this admin page from bfcache after logout,
    // force a reload so the auth check runs against current (empty) credentials.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !getAccessToken()) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
        // Silent fail
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [router, isLoginPage]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background-primary">
        {children}
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-sm text-text-secondary">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-surface-primary border-r border-border
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface-primary border-b border-border flex items-center justify-between px-4 lg:px-6 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              <span className="font-serif text-heading-sm text-text-primary hidden sm:inline">
                Панель управления
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-body-xs text-gold">Администратор</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="bg-surface-primary border-t border-border py-3 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted">
              © 2026 В СВОЕЙ ТАРЕЛКЕ
            </span>
            <span className="text-caption text-text-muted">
              Админ-панель
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
