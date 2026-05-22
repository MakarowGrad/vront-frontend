"use client";

/**
 * TrustBlock Component
 * Personal quality section for a single furshet master
 */

import React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface TrustBlockProps {
  className?: string;
}

// ============================================
// Icon Components
// ============================================

const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const ChefHatIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// ============================================
// Features Data
// ============================================

const features = [
  {
    icon: LeafIcon,
    title: "Отборные продукты",
    description: "Покупаю только свежие и качественные ингредиенты у проверенных поставщиков.",
  },
  {
    icon: ChefHatIcon,
    title: "Готовлю сама",
    description: "Каждое блюдо готовлю лично — от закуски до десерта. Никакой готовой полуфабрикатной продукции.",
  },
  {
    icon: SparklesIcon,
    title: "Красивая подача",
    description: "Сервировка и оформление стола — так же важны, как и вкус. Ваши гости будут в восторге.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Индивидуальный подход",
    description: "Подберу меню под ваш праздник, количество гостей и бюджет. Учту все пожелания.",
  },
  {
    icon: TruckIcon,
    title: "Привезу и накрою",
    description: "Привозу блюда, оформляю стол и убираюсь после себя — вам останется только наслаждаться.",
  },
  {
    icon: HeartIcon,
    title: "С любовью",
    description: "Готовлю так, как для своей семьи. В каждом блюде — внимание, забота и частичка души.",
  },
];

// ============================================
// TrustBlock Component
// ============================================

export const TrustBlock: React.FC<TrustBlockProps> = ({ className }) => {
  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-caption uppercase tracking-wider text-gold mb-3">
            Мои ценности
          </span>
          <h2 className="font-serif text-display-sm md:text-display-md text-text-primary mb-4">
            Почему выбирают меня
          </h2>
          <p className="text-body-md text-text-secondary max-w-2xl mx-auto">
            Я вкладываю душу в каждую деталь, чтобы ваш праздник получился незабываемым
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 lg:p-8 bg-surface-secondary rounded-2xl border border-border transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
                    <IconComponent className="w-7 h-7 text-gold" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-14 h-14 rounded-xl bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-heading-sm text-text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBlock;
