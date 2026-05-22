"use client";

/**
 * DeliveryBlock Component
 * Two-column section showing delivery and pickup information
 */

import React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

interface DeliveryBlockProps {
  className?: string;
}

// ============================================
// Icon Components
// ============================================

const DeliveryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const PickupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// ============================================
// DeliveryBlock Component
// ============================================

export const DeliveryBlock: React.FC<DeliveryBlockProps> = ({ className }) => {
  const deliveryFeatures = [
    "Быстрая доставка от 30 минут",
    "Бесплатно при заказе от 3000 ₽",
    "Термоупаковка сохраняет тепло",
    "Отслеживание заказа онлайн",
  ];

  const pickupFeatures = [
    "Готовность за 20 минут",
    "Удобное расположение в центре",
    "Парковка для клиентов",
    "Персональное обслуживание",
  ];

  const deliveryZones = [
    "Центр — 30 мин",
    "Внутри МКАД — 45-60 мин",
    "За МКАД — от 60 мин",
  ];

  return (
    <section className={cn("py-16 lg:py-24 bg-background-secondary", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-caption uppercase tracking-wider text-gold mb-3">
            Услуги
          </span>
          <h2 className="font-serif text-display-sm md:text-display-md text-text-primary mb-4">
            Как получить заказ
          </h2>
          <p className="text-body-md text-text-secondary max-w-2xl mx-auto">
            Выберите удобный способ получения ваших любимых блюд
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Delivery Card */}
          <div className="group relative bg-surface-secondary rounded-3xl border border-border p-6 lg:p-10 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                <DeliveryIcon className="w-8 h-8 text-gold" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-heading-xl text-text-primary mb-3">
                Доставка
              </h3>

              {/* Description */}
              <p className="text-body-md text-text-secondary mb-6">
                Привезу блюда к вам домой или оформлю стол на вашей площадке.
                Всё будет аккуратно упаковано и красиво оформлено.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {deliveryFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-body-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Delivery Zones */}
              <div className="p-4 rounded-xl bg-surface-tertiary/50">
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="w-4 h-4 text-gold" />
                  <span className="text-body-sm font-medium text-text-primary">Зоны доставки</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deliveryZones.map((zone, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-body-xs bg-surface text-text-secondary"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Card */}
          <div className="group relative bg-surface-secondary rounded-3xl border border-border p-6 lg:p-10 overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                <PickupIcon className="w-8 h-8 text-gold" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-heading-xl text-text-primary mb-3">
                Самовывоз
              </h3>

              {/* Description */}
              <p className="text-body-md text-text-secondary mb-6">
                Заберите заказ самостоятельно.
                Договоримся об удобном времени и месте в Жигалово.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pickupFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-body-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Address & Hours */}
              <div className="p-4 rounded-xl bg-surface-tertiary/50 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-body-sm font-medium text-text-primary block">Адрес</span>
                    <span className="text-body-xs text-text-muted">Жигалово</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-body-sm font-medium text-text-primary block">Часы работы</span>
                    <span className="text-body-xs text-text-muted">Ежедневно: 9:00 — 21:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryBlock;
