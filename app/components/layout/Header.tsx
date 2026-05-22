"use client";

/**
 * Header Component
 * Logo left, icons (theme, favorites, cart, account, menu) right
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, ImageIcon, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { decryptData } from "@/app/lib/crypto";

type ThemeOption = 'dark' | 'light' | 'custom';

interface HeaderProps {
  cartCount?: number;
  favoritesCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  cartButtonRef?: React.RefObject<HTMLButtonElement>;
}

const themeIcons: Record<ThemeOption, React.ReactNode> = {
  dark: <Moon className="w-4 h-4" />,
  light: <Sun className="w-4 h-4" />,
  custom: <ImageIcon className="w-4 h-4" />,
};

const themeLabels: Record<ThemeOption, string> = {
  dark: 'Тёмный',
  light: 'Светлый',
  custom: 'Картинка',
};

export const Header: React.FC<HeaderProps> = ({ 
  cartCount = 0,
  favoritesCount = 0,
  onCartClick,
  onMenuClick,
  cartButtonRef,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeOption>('custom');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [allowThemeOverride, setAllowThemeOverride] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Load theme on mount
    const savedTheme = localStorage.getItem('siteTheme') as ThemeOption | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const override = localStorage.getItem('allowUserThemeOverride');
    if (override !== null) {
      setAllowThemeOverride(override === 'true');
    }

    // SECURITY-FIX-LS-002: Decrypt phone before checking login status [2026-05-18]
    (async () => {
      const phone = await decryptData(localStorage.getItem('customer_phone') || '');
      setIsLoggedIn(!!phone);
    })();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const applyTheme = (newTheme: ThemeOption) => {
    if (!allowThemeOverride) return;
    setTheme(newTheme);
    localStorage.setItem('siteTheme', newTheme);
    setShowThemeMenu(false);
    
    const html = document.documentElement;
    html.classList.remove('dark', 'light', 'custom');
    html.classList.add(newTheme);
  };

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface-primary shadow-lg",
      )}
    >
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-serif text-base text-text-primary flex items-center gap-1.5"
          >
            В СВОЕЙ ТАРЕЛКЕ
            {/* SECURITY-FIX-PWA-001: HTTPS security indicator [2026-05-18] */}
            {mounted && typeof window !== 'undefined' && window.location.protocol === 'https:' && (
              <span title="Защищённое соединение" className="text-[10px] text-success">🔒</span>
            )}
          </Link>

          {/* Icons */}
          <div className="flex items-center -mr-1">
            {/* Theme Toggle */}
            {mounted && allowThemeOverride && (
              <div className="relative">
                <button 
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-gold hover:bg-surface transition-all"
                  suppressHydrationWarning
                >
                  {themeIcons[theme]}
                </button>

                {showThemeMenu && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-surface-primary border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {(['dark', 'light', 'custom'] as ThemeOption[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => applyTheme(t)}
                        className={cn(
                          "flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors",
                          theme === t
                            ? "bg-gold/10 text-gold"
                            : "text-text-secondary hover:bg-surface"
                        )}
                      >
                        {themeIcons[t]}
                        {themeLabels[t]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            <Link
              href="/favorites"
              className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-gold hover:bg-surface transition-all relative"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-gold text-background-primary text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              ref={cartButtonRef}
              onClick={onCartClick}
              className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-gold hover:bg-surface transition-all relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-gold text-background-primary text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              href={mounted && isLoggedIn ? "/orders" : "/login"}
              className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-gold hover:bg-surface transition-all relative"
            >
              <User className="w-4 h-4" />
              {mounted && isLoggedIn && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success" />
              )}
            </Link>

            {/* Menu */}
            <button 
              onClick={onMenuClick}
              className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:text-gold hover:bg-surface transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-px bg-border" />
    </header>
  );
};

export default Header;
