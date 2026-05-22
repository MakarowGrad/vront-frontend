"use client";

/**
 * HeroSection Component - Mobile optimized
 * Background: dark vignette effect (black edges, semi-transparent center)
 */

import React from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section
      className={cn(
        "w-full relative overflow-hidden bg-background-primary",
        className
      )}
    >
      {/* Dark theme vignette */}
      <div className="absolute inset-0 pointer-events-none dark:block hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(30,30,30,0.3) 0%, rgba(10,10,10,0.8) 70%, rgba(10,10,10,1) 100%),
              linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%)
            `,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.95) 100%)
            `,
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-4 pt-8 pb-6 text-center">
        {/* Main Headline */}
        <h1 className="font-serif text-2xl sm:text-3xl text-text-primary mb-3 leading-tight">
          Вкус, который<br className="sm:hidden" /> запоминается
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-text-secondary/90 max-w-sm mx-auto leading-relaxed">
          Фуршеты и праздничные столы для ваших лучших моментов. Готовлю с душой и с любовью.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
