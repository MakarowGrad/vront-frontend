"use client";

/**
 * HeroActions Component - Mobile optimized
 * Two full-width buttons stacked
 */

import React from "react";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export const HeroActions: React.FC = () => {
  return (
    <section className="w-full bg-background-primary">
      <div className="max-w-[900px] mx-auto px-4 pb-4">
        <div className="flex flex-col gap-3">
          {/* Primary Button - Меню */}
          <Link href="/catalog" className="w-full">
            <button className="w-full py-4 px-4 rounded-xl text-base font-semibold bg-transparent text-text-primary border-2 border-border hover:border-gold hover:text-gold transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <UtensilsCrossed className="w-5 h-5" />
              Нажмите Меню
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroActions;
