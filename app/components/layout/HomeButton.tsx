'use client';

/**
 * Floating Home Button
 * Quick navigation to homepage from any screen
 */

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show on homepage
  if (pathname === '/') return null;
  
  // Don't show on admin pages (admin has its own navigation)
  if (pathname.startsWith('/admin')) return null;

  return (
    <button
      onClick={() => router.push('/')}
      className={cn(
        "fixed top-20 right-4 z-40",
        "w-12 h-12 rounded-full",
        "bg-gold text-background-primary",
        "flex items-center justify-center",
        "shadow-lg shadow-gold/30",
        "hover:bg-gold-light hover:scale-110",
        "active:scale-95",
        "transition-all duration-300",
        "border-2 border-background-primary"
      )}
      title="На главную"
    >
      <Home className="w-5 h-5" />
    </button>
  );
}
