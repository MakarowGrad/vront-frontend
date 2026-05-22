'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UtensilsCrossed,
  ShoppingBag,
  FolderTree,
  Settings,
  Crown,
  X,
  ChevronRight,
  LogOut,
  CalendarDays,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { apiFetch, clearAccessToken } from '@/lib/api';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  {
    name: 'Категории',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    name: 'Блюда',
    href: '/admin/dishes',
    icon: UtensilsCrossed,
  },
  {
    name: 'Заказы',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    name: 'Календарь',
    href: '/admin/calendar',
    icon: CalendarDays,
  },
  {
    name: 'Настройки',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const brandName = 'В СВОЕЙ ТАРЕЛКЕ';
  const adminLabel = 'Admin';

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await apiFetch('/admin/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    }
    clearAccessToken();
    queryClient.clear();
    router.push('/admin/login');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link
          href="/admin"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow">
            <Crown className="w-5 h-5 text-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-heading-xs text-text-primary group-hover:text-gold transition-colors truncate max-w-[140px]">
              {brandName}
            </span>
            <span className="text-caption text-text-muted uppercase tracking-wider">
              {adminLabel}
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => {
                onClose?.();
                router.push(item.href);
              }}
              className={`
                w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${isActive
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 transition-colors
                ${isActive ? 'text-gold' : 'text-text-muted group-hover:text-text-secondary'}
              `} />
              <span className="flex-1 text-body-sm font-medium">
                {item.name}
              </span>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-gold" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-secondary">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-body-xs font-semibold text-gold">АД</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-body-sm font-medium text-text-primary truncate">
              Администратор
            </span>
            <span className="text-caption text-text-muted truncate">
              admin@vsvoitar.ru
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-body-sm font-medium">Выйти</span>
        </button>
      </div>
    </div>
  );
}
