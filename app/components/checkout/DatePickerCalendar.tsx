'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useBlockedSlotsForMonth } from '@/app/hooks/useAvailability';

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function getMonthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const days: Date[] = [];
  for (let i = 0; i < startDay; i++) {
    const d = new Date(year, month, -i);
    days.unshift(d);
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
}

interface DatePickerCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

export function DatePickerCalendar({
  selectedDate,
  onSelect,
  minDate,
  maxDate,
}: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthKey = getMonthKey(currentMonth);
  const { data: blockedSlots = [] } = useBlockedSlotsForMonth(monthKey);

  const blockedMap = useMemo(() => {
    const map = new Map<string, BlockedSlot>();
    for (const slot of blockedSlots) {
      map.set(slot.date, slot);
    }
    return map;
  }, [blockedSlots]);

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  const isOutsideMonth = (d: Date) => d.getMonth() !== currentMonth.getMonth();

  const isDisabled = (d: Date) => {
    const key = formatDateKey(d);
    if (minDate && key < minDate) return true;
    if (maxDate && key > maxDate) return true;
    return false;
  };

  const isFullDayBlocked = (d: Date) => {
    const slot = blockedMap.get(formatDateKey(d));
    return slot?.isFullDay || false;
  };

  const isPartiallyBlocked = (d: Date) => {
    const slot = blockedMap.get(formatDateKey(d));
    return !!slot && !slot.isFullDay && (slot.timeSlots?.length || 0) > 0;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    onSelect(formatDateKey(d));
  };

  const monthLabel = `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <div className="bg-surface-secondary rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-body-md font-semibold text-text-primary">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((wd) => (
          <div key={wd} className="text-center text-caption text-text-muted font-medium py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => {
          const key = formatDateKey(d);
          const outside = isOutsideMonth(d);
          const disabled = isDisabled(d);
          const fullBlocked = isFullDayBlocked(d);
          const partialBlocked = isPartiallyBlocked(d);
          const selected = selectedDate === key;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(d)}
              disabled={disabled || fullBlocked}
              className={cn(
                'relative h-9 rounded-lg text-body-sm font-medium transition-all',
                outside && 'text-text-muted/40',
                !outside && !disabled && !fullBlocked && 'text-text-primary hover:bg-surface-tertiary',
                selected && 'bg-gold text-background-primary hover:bg-gold-light',
                disabled && !selected && 'text-text-muted/30 cursor-not-allowed',
                fullBlocked && !selected && 'bg-red-500/20 text-red-400 cursor-not-allowed',
                partialBlocked && !fullBlocked && !selected && !disabled && 'bg-amber-500/15 text-amber-400',
              )}
              title={
                fullBlocked
                  ? 'День полностью занят'
                  : partialBlocked
                  ? 'Часть времени занята'
                  : undefined
              }
            >
              {d.getDate()}
              {partialBlocked && !fullBlocked && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40" />
          <span className="text-caption text-text-muted">Занят весь день</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/40" />
          <span className="text-caption text-text-muted">Частично занят</span>
        </div>
      </div>
    </div>
  );
}
