'use client';

/**
 * CheckoutForm Component
 * Main checkout form with Zod validation and React Hook Form
 */

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CreditCard,
  Banknote,
  Handshake,
  Truck,
  Store,
  ChevronDown
} from 'lucide-react';
import { PaymentMethod, FulfillmentType } from '@/app/types';
import { formatPrice } from '@/app/lib/utils';
import { useBlockedSlotsForDate } from '@/app/hooks/useAvailability';
import { DatePickerCalendar } from './DatePickerCalendar';

// ============================================================================
// ZOD VALIDATION SCHEMA
// ============================================================================

export const checkoutSchema = z.object({
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы'),
  phone: z.string()
    .min(1, 'Телефон обязателен')
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Некорректный формат телефона')
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }, 'Телефон должен содержать 10-11 цифр'),
  fulfillmentType: z.enum(['delivery', 'pickup']),
  address: z.string().optional(),
  date: z.string()
    .min(1, 'Выберите дату'),
  time: z.string()
    .min(1, 'Выберите время'),
  comment: z.string()
    .max(500, 'Комментарий слишком длинный')
    .optional(),
  paymentMethod: z.enum([PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER, PaymentMethod.BY_AGREEMENT]),
}).refine((data) => {
  if (data.fulfillmentType === 'delivery') {
    return data.address && data.address.length >= 5;
  }
  return true;
}, {
  message: 'Адрес доставки обязателен (минимум 5 символов)',
  path: ['address'],
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const defaultCheckoutValues: CheckoutFormData = {
  name: '',
  phone: '+7',
  fulfillmentType: 'delivery',
  address: '',
  date: '',
  time: '',
  comment: '',
  paymentMethod: PaymentMethod.CASH,
};

// ============================================================================
// TIME SLOTS
// ============================================================================

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

// ============================================================================
// COMPONENT
// ============================================================================

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
  initialValues?: Partial<CheckoutFormData>;
}

export function CheckoutForm({ onSubmit, isLoading = false, initialValues }: CheckoutFormProps) {
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      ...defaultCheckoutValues,
      ...initialValues,
    },
  });

  const fulfillmentType = watch('fulfillmentType');
  const selectedTime = watch('time');
  const selectedPayment = watch('paymentMethod');
  const selectedDate = watch('date');

  const { data: blockedSlotsForDate = [] } = useBlockedSlotsForDate(selectedDate);
  const blockedSlot = blockedSlotsForDate[0];
  const isFullDayBlocked = blockedSlot?.isFullDay || false;
  const blockedTimeSlots = blockedSlot?.timeSlots || [];

  const availableTimeSlots = useMemo(() => {
    if (isFullDayBlocked) return [];
    return TIME_SLOTS.filter((t) => !blockedTimeSlots.includes(t));
  }, [isFullDayBlocked, blockedTimeSlots]);



  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleTimeSelect = (time: string) => {
    setValue('time', time, { shouldValidate: true });
    setShowTimeSlots(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <section className="space-y-4">
        <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
          <User className="w-5 h-5 text-gold" />
          Контактная информация
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Имя <span className="text-error">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('name')}
                type="text"
                placeholder="Введите ваше имя"
                className={`input-luxury pl-10 ${errors.name ? 'border-error focus:border-error' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-caption text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Телефон <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('phone')}
                type="tel"
                placeholder="+7 (___) ___-__-__"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw.length < 2 || (raw.length === 2 && raw !== '+7')) {
                    setValue('phone', '+7', { shouldValidate: true });
                    return;
                  }
                  let digits = raw.replace(/\D/g, '');
                  if (!digits.startsWith('7')) digits = '7' + digits;
                  digits = digits.slice(0, 11);
                  const after7 = digits.slice(1);
                  let formatted = '+7';
                  if (after7.length > 0) formatted += ' (' + after7.slice(0, 3);
                  if (after7.length >= 3) formatted += ') ' + after7.slice(3, 6);
                  if (after7.length >= 6) formatted += '-' + after7.slice(6, 8);
                  if (after7.length >= 8) formatted += '-' + after7.slice(8, 10);
                  setValue('phone', formatted, { shouldValidate: true });
                }}
                className={`input-luxury pl-10 ${errors.phone ? 'border-error focus:border-error' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-caption text-error">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Fulfillment Type */}
      <section className="space-y-4">
        <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
          <Truck className="w-5 h-5 text-gold" />
          Способ получения
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <label
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              fulfillmentType === 'delivery'
                ? 'border-gold bg-gold/5'
                : 'border-border bg-surface-secondary hover:border-border-light'
            }`}
          >
            <input
              {...register('fulfillmentType')}
              type="radio"
              value="delivery"
              className="sr-only"
            />
            <div className={`p-2 rounded-full ${fulfillmentType === 'delivery' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
              <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-gold' : 'text-text-muted'}`} />
            </div>
            <span className={`text-body-sm font-medium ${fulfillmentType === 'delivery' ? 'text-text-primary' : 'text-text-secondary'}`}>
              Доставка
            </span>
          </label>

          <label
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              fulfillmentType === 'pickup'
                ? 'border-gold bg-gold/5'
                : 'border-border bg-surface-secondary hover:border-border-light'
            }`}
          >
            <input
              {...register('fulfillmentType')}
              type="radio"
              value="pickup"
              className="sr-only"
            />
            <div className={`p-2 rounded-full ${fulfillmentType === 'pickup' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
              <Store className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-gold' : 'text-text-muted'}`} />
            </div>
            <span className={`text-body-sm font-medium ${fulfillmentType === 'pickup' ? 'text-text-primary' : 'text-text-secondary'}`}>
              Самовывоз
            </span>
          </label>
        </div>

        {/* Address Field (conditional) */}
        {fulfillmentType === 'delivery' && (
          <div className="animate-fade-in">
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Адрес доставки <span className="text-error">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                {...register('address')}
                type="text"
                placeholder="ул. Примерная, 123, кв. 45"
                className={`input-luxury pl-10 ${errors.address ? 'border-error focus:border-error' : ''}`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-caption text-error">{errors.address.message}</p>
            )}
          </div>
        )}

        {/* Pickup Info */}
        {fulfillmentType === 'pickup' && (
          <div className="animate-fade-in p-4 rounded-xl bg-surface border border-border/50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gold/10">
                <Store className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-serif text-body-md font-semibold text-text-primary">
                  В СВОЕЙ ТАРЕЛКЕ
                </h4>
                <p className="text-body-sm text-text-secondary mt-1">
                  рп Жигалово, ул. Советская, д. 94
                </p>
                <p className="text-caption text-text-muted mt-1">
                  Ежедневно 10:00 — 22:00
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Date & Time */}
      <section className="space-y-4">
        <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          Дата и время
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Дата <span className="text-error">*</span>
            </label>
            <DatePickerCalendar
              selectedDate={selectedDate}
              onSelect={(date) => setValue('date', date, { shouldValidate: true })}
              minDate={today}
              maxDate={maxDateStr}
            />
            {errors.date && (
              <p className="mt-1 text-caption text-error">{errors.date.message}</p>
            )}
            {isFullDayBlocked && (
              <p className="mt-1 text-caption text-error">Эта дата недоступна для заказа</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Время <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <button
                type="button"
                onClick={() => setShowTimeSlots(!showTimeSlots)}
                className={`input-luxury pl-10 text-left flex items-center justify-between ${errors.time ? 'border-error focus:border-error' : ''}`}
              >
                <span className={selectedTime ? 'text-text-primary' : 'text-text-muted'}>
                  {selectedTime || 'Выберите время'}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showTimeSlots ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Time Slots Dropdown */}
              {showTimeSlots && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 p-2 bg-surface-secondary rounded-xl border border-border shadow-lg max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-1">
                    {availableTimeSlots.length === 0 ? (
                      <p className="col-span-3 text-center text-sm text-text-muted py-4">
                        {isFullDayBlocked ? 'День полностью занят' : 'Нет доступного времени'}
                      </p>
                    ) : (
                      availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelect(time)}
                          className={`px-3 py-2 rounded-lg text-body-sm transition-colors ${
                            selectedTime === time
                              ? 'bg-gold text-background'
                              : 'hover:bg-surface-tertiary text-text-secondary'
                          }`}
                        >
                          {time}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.time && (
              <p className="mt-1 text-caption text-error">{errors.time.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Payment Method */}
      <section className="space-y-4">
        <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gold" />
          Способ оплаты
        </h3>

        <div className="space-y-2">
          {/* Cash */}
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedPayment === 'cash'
                ? 'border-gold bg-gold/5'
                : 'border-border bg-surface-secondary hover:border-border-light'
            }`}
          >
            <input
              {...register('paymentMethod')}
              type="radio"
              value="cash"
              className="sr-only"
            />
            <div className={`p-2 rounded-full ${selectedPayment === 'cash' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
              <Banknote className={`w-5 h-5 ${selectedPayment === 'cash' ? 'text-gold' : 'text-text-muted'}`} />
            </div>
            <div className="flex-1">
              <span className={`text-body-md font-medium ${selectedPayment === 'cash' ? 'text-text-primary' : 'text-text-secondary'}`}>
                Наличными
              </span>
              <p className="text-caption text-text-muted">
                Оплата при получении
              </p>
            </div>
            {selectedPayment === 'cash' && (
              <div className="w-2 h-2 rounded-full bg-gold" />
            )}
          </label>

          {/* Bank Transfer */}
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedPayment === 'bank_transfer'
                ? 'border-gold bg-gold/5'
                : 'border-border bg-surface-secondary hover:border-border-light'
            }`}
          >
            <input
              {...register('paymentMethod')}
              type="radio"
              value="bank_transfer"
              className="sr-only"
            />
            <div className={`p-2 rounded-full ${selectedPayment === 'bank_transfer' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
              <CreditCard className={`w-5 h-5 ${selectedPayment === 'bank_transfer' ? 'text-gold' : 'text-text-muted'}`} />
            </div>
            <div className="flex-1">
              <span className={`text-body-md font-medium ${selectedPayment === 'bank_transfer' ? 'text-text-primary' : 'text-text-secondary'}`}>
                Банковский перевод
              </span>
              <p className="text-caption text-text-muted">
                Перевод на расчетный счет
              </p>
            </div>
            {selectedPayment === 'bank_transfer' && (
              <div className="w-2 h-2 rounded-full bg-gold" />
            )}
          </label>

          {/* By Agreement */}
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedPayment === 'by_agreement'
                ? 'border-gold bg-gold/5'
                : 'border-border bg-surface-secondary hover:border-border-light'
            }`}
          >
            <input
              {...register('paymentMethod')}
              type="radio"
              value="by_agreement"
              className="sr-only"
            />
            <div className={`p-2 rounded-full ${selectedPayment === 'by_agreement' ? 'bg-gold/20' : 'bg-surface-tertiary'}`}>
              <Handshake className={`w-5 h-5 ${selectedPayment === 'by_agreement' ? 'text-gold' : 'text-text-muted'}`} />
            </div>
            <div className="flex-1">
              <span className={`text-body-md font-medium ${selectedPayment === 'by_agreement' ? 'text-text-primary' : 'text-text-secondary'}`}>
                По договоренности
              </span>
              <p className="text-caption text-text-muted">
                Свяжемся для уточнения деталей
              </p>
            </div>
            {selectedPayment === 'by_agreement' && (
              <div className="w-2 h-2 rounded-full bg-gold" />
            )}
          </label>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Comment */}
      <section className="space-y-4">
        <h3 className="font-serif text-heading-md text-text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold" />
          Комментарий
        </h3>

        <div>
          <textarea
            {...register('comment')}
            rows={3}
            placeholder="Дополнительные пожелания к заказу..."
            className="input-luxury resize-none"
          />
          {errors.comment && (
            <p className="mt-1 text-caption text-error">{errors.comment.message}</p>
          )}
        </div>
      </section>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gold hover:bg-gold-light text-background font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            Оформление заказа...
          </>
        ) : (
          'Оформить заказ'
        )}
      </button>
    </form>
  );
}
