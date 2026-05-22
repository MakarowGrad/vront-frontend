'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { Menu, X, Crown, Loader2 } from 'lucide-react';
import { getAccessToken, refreshToken } from '@/lib/api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoginPage(window.location.pathname === '/admin/login');
  }, []);

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check authentication
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        // Try to refresh token silently
        try {
          await refreshToken();
          setIsAuthenticated(true);
        } catch {
          router.push('/admin/login');
        }
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    const adminTheme = localStorage.getItem('adminTheme') || 'dark';
    const html = document.documentElement;
    html.classList.remove('dark', 'light', 'custom');
    html.classList.add(adminTheme);

    checkAuth();

    // Periodic silent refresh every 10 minutes to prevent token expiry
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
        // Silent fail — next API call will handle 401
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [router, isLoginPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <span className="text-body text-text-secondary">Проверка авторизации...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Login page renders without sidebar/header
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-surface-primary border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
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

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
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
