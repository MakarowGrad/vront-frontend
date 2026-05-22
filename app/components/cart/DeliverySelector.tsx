'use client';

/**
 * DeliverySelector Component
 * Toggle between delivery and pickup options
 */

import { useState } from 'react';
import { Truck, Store, MapPin, Clock } from 'lucide-react';

interface DeliverySelectorProps {
  value: 'delivery' | 'pickup';
  onChange: (value: 'delivery' | 'pickup') => void;
  address?: string;
  onAddressChange?: (address: string) => void;
}

const PICKUP_LOCATION = {
  name: 'В СВОЕЙ ТАРЕЛКЕ',
  address: 'рп Жигалово, ул. Советская, д. 94',
  hours: 'Ежедневно 9:00 — 21:00',
  phone: '8 (902) 547-55-44',
};

export function DeliverySelector({
  value,
  onChange,
  address = '',
  onAddressChange,
}: DeliverySelectorProps) {
  const [localAddress, setLocalAddress] = useState(address);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setLocalAddress(newAddress);
    onAddressChange?.(newAddress);
  };

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange('delivery')}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
            value === 'delivery'
              ? 'border-gold bg-gold/5'
              : 'border-border bg-surface-secondary hover:border-border-light'
          }`}
        >
          <div className={`p-2 rounded-full ${value === 'delivery' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
            <Truck className={`w-5 h-5 ${value === 'delivery' ? 'text-gold' : 'text-text-muted'}`} />
          </div>
          <span className={`text-body-sm font-medium ${value === 'delivery' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Доставка
          </span>
          {value === 'delivery' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
          )}
        </button>

        <button
          onClick={() => onChange('pickup')}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
            value === 'pickup'
              ? 'border-gold bg-gold/5'
              : 'border-border bg-surface-secondary hover:border-border-light'
          }`}
        >
          <div className={`p-2 rounded-full ${value === 'pickup' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
            <Store className={`w-5 h-5 ${value === 'pickup' ? 'text-gold' : 'text-text-muted'}`} />
          </div>
          <span className={`text-body-sm font-medium ${value === 'pickup' ? 'text-text-primary' : 'text-text-secondary'}`}>
            Самовывоз
          </span>
          {value === 'pickup' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
          )}
        </button>
      </div>

      {/* Delivery Address Input */}
      {value === 'delivery' && (
        <div className="animate-fade-in">
          <label className="block text-body-sm font-medium text-text-secondary mb-2">
            Адрес доставки
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={localAddress}
              onChange={handleAddressChange}
              placeholder="Введите адрес доставки"
              className="input-luxury pl-10"
            />
          </div>
          <p className="mt-2 text-caption text-text-muted">
            Доставка осуществляется по Москве и Московской области
          </p>
        </div>
      )}

      {/* Pickup Location Info */}
      {value === 'pickup' && (
        <div className="animate-fade-in p-4 rounded-xl bg-surface border border-border/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-gold/10">
              <Store className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-body-md font-semibold text-text-primary">
                {PICKUP_LOCATION.name}
              </h4>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>{PICKUP_LOCATION.address}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span>{PICKUP_LOCATION.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
