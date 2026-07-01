"use client";

/**
 * Footer Component - Mobile optimized
 * Simple navigation and contact info
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "bg-background-secondary border-t border-border mt-auto",
        className
      )}
    >
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-3 text-xs">
          <Link href="/catalog" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Меню
          </Link>
          <Link href="/favorites" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Избранное
          </Link>
          <Link href="/orders" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Заказы
          </Link>
          <Link href="/about" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Обо мне
          </Link>
          <Link href="/contacts" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Контакты
          </Link>
          <Link href="/admin/login" prefetch={false} className="text-text-secondary hover:text-gold transition-colors">
            Админ
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-3" />

        {/* Contact Info */}
        <div className="text-center text-[10px] sm:text-xs text-text-muted space-y-0.5">
          <p>Фуршетный мастер Жанна</p>
          <p>8 (902) 547-55-44 — звонки</p>
          <p>8 (964) 271-22-91 — звонки</p>
          <p>Ежедневно: 9:00 — 21:00</p>
          <p className="pt-1">© 2026 В СВОЕЙ ТАРЕЛКЕ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
