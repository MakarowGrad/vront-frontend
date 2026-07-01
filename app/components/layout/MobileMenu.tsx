"use client";

/**
 * MobileMenu Component
 * Full-screen mobile navigation drawer with elegant animations
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  favoritesCount?: number;
}

// ============================================
// Navigation Data
// ============================================

const mainNavItems = [
  { href: "/catalog", label: "Каталог", description: "Все блюда" },
  { href: "/favorites", label: "Избранное", description: "Сохраненные блюда" },
  { href: "/orders", label: "Заказы", description: "История заказов" },
];

const secondaryNavItems = [
  { href: "/delivery", label: "Доставка" },
  { href: "/payment", label: "Оплата" },
  { href: "/about", label: "Обо мне" },
  { href: "/contacts", label: "Контакты" },
];

// ============================================
// Icon Components
// ============================================

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M20 24V28M16 26H24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ============================================
// Count Badge Component
// ============================================

const CountBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <span className="ml-auto min-w-[22px] h-[22px] px-1.5 flex items-center justify-center text-xs font-semibold bg-gold text-background-primary rounded-full">
      {count > 99 ? "99+" : count}
    </span>
  );
};

// ============================================
// MobileMenu Component
// ============================================

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  cartCount = 0,
  favoritesCount = 0,
}) => {
  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background-primary shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <LogoIcon className="w-8 h-8 text-gold" />
            <span className="font-serif text-lg font-semibold text-text-primary">
              В СВОЕЙ ТАРЕЛКЕ
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
            aria-label="Закрыть меню"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto">
          {/* Main Navigation */}
          <nav className="p-4">
            <p className="text-caption uppercase tracking-wider text-text-muted mb-4 px-2">
              Основное меню
            </p>
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl text-text-primary hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{item.label}</span>
                      <p className="text-body-xs text-text-muted">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-text-muted group-hover:text-gold transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-2">
            <p className="text-caption uppercase tracking-wider text-text-muted mb-4 px-2">
              Быстрый доступ
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/favorites"
                prefetch={false}
                onClick={onClose}
                className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary text-text-primary hover:bg-surface-hover transition-colors"
              >
                <HeartIcon className="w-5 h-5 text-gold" />
                <span className="text-body-sm">Избранное</span>
                <CountBadge count={favoritesCount} />
              </Link>
              <button
                onClick={() => {
                  onClose();
                  // Cart will be opened by parent
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary text-text-primary hover:bg-surface-hover transition-colors"
              >
                <CartIcon className="w-5 h-5 text-gold" />
                <span className="text-body-sm">Корзина</span>
                <CountBadge count={cartCount} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="divider my-4 mx-4" />

          {/* Secondary Navigation */}
          <nav className="px-4 pb-4">
            <ul className="space-y-1">
              {secondaryNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors group"
                  >
                    <span className="text-body-sm">{item.label}</span>
                    <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="mt-auto p-4 bg-surface-secondary">
            <p className="text-caption uppercase tracking-wider text-text-muted mb-3">
              Свяжитесь с нами
            </p>
            <p className="text-body-xs text-text-muted mb-2">
              Фуршетный мастер Жанна
            </p>
            <a
              href="tel:89025475544"
              className="block text-heading-sm text-gold font-serif mb-1"
            >
              8 (902) 547-55-44 — звонки
            </a>
            <a
              href="tel:89642712291"
              className="block text-heading-sm text-gold font-serif mb-1"
            >
              8 (964) 271-22-91 — звонки
            </a>
            <p className="text-body-xs text-text-muted">
              Ежедневно: 9:00 — 21:00
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
