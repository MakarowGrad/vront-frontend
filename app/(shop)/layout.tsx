"use client";

/**
 * Shop Layout
 * Main layout for the shop section with Header, Footer, Cart Sheet, and Mobile Menu
 */

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, getImageUrl } from "@/lib/utils";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { MobileMenu } from "@/app/components/layout/MobileMenu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { FlyingDishProvider } from "@/app/components/cart/FlyingDishAnimation";
import { CartSummaryFloating } from "@/app/components/catalog/CartSummary";
import { NetworkStatusBar } from "@/app/components/NetworkStatusBar";
import { useCartStore } from "@/app/store/cartStore";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { CartItem as CartItemType } from "@/app/types";
import { CartRefContext } from "@/app/context/CartRefContext";

// ============================================
// Types
// ============================================

interface ShopLayoutProps {
  children: React.ReactNode;
}

// ============================================
// Icon Components
// ============================================

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ============================================
// Empty Cart State
// ============================================

const EmptyCart = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
    <div className="w-20 h-20 rounded-full bg-surface-tertiary flex items-center justify-center mb-6">
      <ShoppingBagIcon className="w-10 h-10 text-text-muted" />
    </div>
    <h3 className="font-serif text-heading-lg text-text-primary mb-2">
      Корзина пуста
    </h3>
    <p className="text-body-sm text-text-muted mb-8 max-w-xs">
      Добавьте блюда из каталога, чтобы оформить заказ
    </p>
    <Button variant="gold" onClick={onClose}>
      Перейти в каталог
    </Button>
  </div>
);

// ============================================
// Cart Item Component
// ============================================

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemove: (dishId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <div className="flex gap-2 p-3 bg-surface rounded-xl">
      {/* Image Placeholder - smaller */}
      <div className="w-14 h-14 rounded-lg bg-surface-tertiary flex-shrink-0 flex items-center justify-center">
        <svg className="w-6 h-6 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <h4 className="font-serif text-sm text-text-primary truncate leading-tight">
          {item.dish.title}
        </h4>
        {item.dish.weight && (
          <p className="text-xs text-text-muted mt-0.5">
            {item.dish.weight} {item.dish.weightUnit === 'g' ? 'г' : 'мл'}
          </p>
        )}

        {/* Quantity & Price - compact */}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity Stepper - New Design */}
          <div className="flex items-center gap-1.5 bg-surface rounded-lg px-1 py-0.5 shadow-inner">
            <button
              onClick={() => onUpdateQuantity(item.dishId, item.quantity - 1)}
              className="w-6 h-6 rounded-md bg-surface-secondary text-text-secondary hover:bg-gold hover:text-background-primary active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm disabled:opacity-40"
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="w-3 h-3" />
            </button>
            <span className="min-w-[1.25rem] text-center text-xs font-bold text-text-primary">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.dishId, item.quantity + 1)}
              className="w-6 h-6 rounded-md bg-gold text-background-primary hover:bg-gold-light active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm shadow-gold/30"
            >
              <PlusIcon className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <span className="font-mono text-sm text-gold font-semibold">
            {formatPrice(item.totalPrice)} ₽
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.dishId)}
        className="p-1 text-text-muted hover:text-error transition-colors self-start flex-shrink-0"
        aria-label="Удалить"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ============================================
// Client Theme Shell (isolates hydration-sensitive render)
// ============================================

const getApiBase = () =>
  process.env.NEXT_PUBLIC_API_URL || `${window.location.protocol}//${window.location.hostname}:3001/api`;

function ClientThemeShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'custom'>('custom');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const apiBase = getApiBase();

    fetch(apiBase + '/settings')
      .then((r) => r.json())
      .then((data) => {
        const adminTheme = data.theme || 'custom';
        const allowOverride = data.allowUserThemeOverride !== false;

        localStorage.setItem('adminTheme', adminTheme);
        localStorage.setItem('allowUserThemeOverride', String(allowOverride));

        let effectiveTheme = adminTheme;
        if (allowOverride) {
          const savedTheme = localStorage.getItem('siteTheme') as 'dark' | 'light' | 'custom' | null;
          if (savedTheme) {
            effectiveTheme = savedTheme;
          } else {
            localStorage.setItem('siteTheme', adminTheme);
            effectiveTheme = adminTheme;
          }
        } else {
          localStorage.setItem('siteTheme', adminTheme);
        }

        setTheme(effectiveTheme);
        const html = document.documentElement;
        html.classList.remove('dark', 'light', 'custom');
        html.classList.add(effectiveTheme);

        setBackgroundImage(data.backgroundImage || null);
      })
      .catch(() => {
        const savedTheme = localStorage.getItem('siteTheme') || 'custom';
        setTheme(savedTheme as 'dark' | 'light' | 'custom');
        const html = document.documentElement;
        html.classList.remove('dark', 'light', 'custom');
        html.classList.add(savedTheme);
      });
  }, []);

  // SECURITY-FIX-HTTPS-002: Convert relative URL to full backend URL for images [2026-05-19]
  const bgImageUrl = backgroundImage ? getImageUrl(backgroundImage) : null;

  return (
    <>
      {mounted && theme === 'custom' && bgImageUrl && (
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(' + bgImageUrl + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
          }} />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      )}
      <div className={'min-h-screen flex flex-col max-w-full overflow-x-hidden ' + (mounted && theme === 'custom' ? 'bg-transparent' : 'bg-background-primary')}>
        {children}
      </div>
    </>
  );
}

// ============================================
// Shop Layout Component
// ============================================

export default function ShopLayout({ children }: ShopLayoutProps) {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // Zustand stores
  const cartItems = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const favoritesCount = useFavoritesStore(state => state.getFavoritesCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate cart totals
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Handle quantity update
  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    updateQuantity(dishId, quantity);
  };

  // Handle item removal
  const handleRemoveItem = (dishId: string) => {
    removeFromCart(dishId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <ClientThemeShell>
      <FlyingDishProvider>
        <CartRefContext.Provider value={cartButtonRef}>
          {mounted && <NetworkStatusBar />}
          {/* Header */}
          <Header
            cartCount={mounted ? cartCount : 0}
            favoritesCount={mounted ? favoritesCount : 0}
            onCartClick={() => setIsCartOpen(true)}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            cartButtonRef={cartButtonRef}
          />

          {/* Main Content */}
          <main className="flex-1 pt-12 pb-20">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            cartCount={mounted ? cartCount : 0}
            favoritesCount={mounted ? favoritesCount : 0}
          />

          {/* Cart Sheet */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="flex flex-col p-0">
              <SheetHeader className="border-b border-border px-4 py-4">
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-gold" />
                  Корзина
                  {cartCount > 0 && (
                    <span className="text-body-sm text-text-muted font-normal">
                      ({cartCount})
                    </span>
                  )}
                </SheetTitle>
              </SheetHeader>

              {/* Cart Content */}
              <div className="flex-1 overflow-auto px-4 py-4">
                {cartItems.length === 0 ? (
                  <EmptyCart onClose={() => setIsCartOpen(false)} />
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.dishId}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-heading-sm text-text-primary">Итого</span>
                      <span className="font-mono text-heading-md text-gold font-semibold">
                        {formatPrice(cartTotal)} ₽
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="gold"
                      fullWidth
                      rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                      onClick={() => { setIsCartOpen(false); router.push('/checkout'); }}
                    >
                      Оформить заказ
                    </Button>
                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => setIsCartOpen(false)}
                    >
                      Продолжить покупки
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Floating Cart Summary */}
          <CartSummaryFloating />
        </CartRefContext.Provider>
      </FlyingDishProvider>
    </ClientThemeShell>
  );
}
