"use client";

/**
 * Footer Component
 * Brand description, link columns, contacts
 * Geometry: bg-secondary, padding 3rem 1.5rem, border-top, max-width 900px
 */

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContactsBlockProps {
  className?: string;
}

export const ContactsBlock: React.FC<ContactsBlockProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "bg-background-secondary border-t border-border mt-16",
        className
      )}
    >
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        {/* Brand */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-text-primary mb-3">
            В СВОЕЙ ТАРЕЛКЕ
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-md">
            Фуршеты и праздничные столы от мастера Жанны в Жигалово.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Меню
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalog"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Каталог
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Избранное
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Заказы
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
              Обо мне
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Обо мне
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contacts */}
        <div className="border-t border-border pt-8">
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
            Контакты
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>
              <strong className="text-text-primary">Фуршетный мастер</strong> Жанна
            </p>
            <p>
              <strong className="text-text-primary">Телефон:</strong> 8 (902) 547-55-44 — звонки, 8 (964) 271-22-91 — звонки
            </p>
            <p>
              <strong className="text-text-primary">Email:</strong>{" "}
              info@vsvoitar.ru
            </p>
            <p>
              <strong className="text-text-primary">Работаем в:</strong> Жигалово
            </p>
            <p>
              <strong className="text-text-primary">Режим работы:</strong>{" "}
              Ежедневно: 9:00 — 21:00
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactsBlock;
