'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Lock, Unlock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  useBlockedSlots,
  useCreateBlockedSlot,
  useDeleteBlockedSlot,
} from '@/app/hooks/useAvailability';

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
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

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function monthName(date: Date): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const monthKey = getMonthKey(currentMonth);
  const { data: blockedSlots = [], isLoading } = useBlockedSlots(monthKey);
  const createSlot = useCreateBlockedSlot();
  const deleteSlot = useDeleteBlockedSlot();

  const blockedMap = useMemo(() => {
    const map = new Map<string, { id: string; timeSlots: string[]; isFullDay: boolean }>();
    for (const slot of blockedSlots) {
      map.set(slot.date, { id: slot.id, timeSlots: slot.timeSlots, isFullDay: slot.isFullDay });
    }
    return map;
  }, [blockedSlots]);

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const key = formatDateKey(date);
    setSelectedDate(key);
    const existing = blockedMap.get(key);
    if (existing) {
      setSelectedSlots(existing.timeSlots);
      setIsFullDay(existing.isFullDay);
    } else {
      setSelectedSlots([]);
      setIsFullDay(false);
    }
    setDialogOpen(true);
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    if (!selectedDate) return;
    createSlot.mutate(
      {
        date: selectedDate,
        timeSlots: selectedSlots,
        isFullDay: isFullDay,
      },
      {
        onSuccess: () => setDialogOpen(false),
      }
    );
  };

  const handleDelete = () => {
    if (!selectedDate) return;
    const existing = blockedMap.get(selectedDate);
    if (existing) {
      deleteSlot.mutate(existing.id, {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedSlots([]);
          setIsFullDay(false);
        },
      });
    }
  };

  const isToday = (d: Date) => {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };

  const isCurrentMonth = (d: Date) => d.getMonth() === currentMonth.getMonth();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-text-primary flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-gold" />
            Календарь загрузки кухни
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Блокируйте даты и время, когда кухня занята
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <span className="text-lg font-medium text-text-primary min-w-[180px] text-center">
            {monthName(currentMonth)}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50" />
          <span>Полностью занят</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/50" />
          <span>Частично занят</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-surface-secondary border border-border" />
          <span>Свободен</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-text-secondary">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const key = formatDateKey(day);
            const blocked = blockedMap.get(key);
            const fullDay = blocked?.isFullDay;
            const partial = blocked && !blocked.isFullDay && blocked.timeSlots.length > 0;
            const today = isToday(day);
            const current = isCurrentMonth(day);

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                className={`
                  relative min-h-[80px] p-2 border-b border-r border-border
                  flex flex-col items-center justify-start
                  transition-colors
                  ${!current ? 'opacity-40 bg-background-primary/50' : 'hover:bg-surface-hover'}
                  ${today ? 'bg-gold/5' : ''}
                  ${fullDay ? 'bg-red-500/10 hover:bg-red-500/20' : ''}
                  ${partial ? 'bg-orange-500/10 hover:bg-orange-500/20' : ''}
                `}
              >
                <span className={`
                  text-sm font-medium
                  ${today ? 'text-gold' : 'text-text-primary'}
                `}>
                  {day.getDate()}
                </span>
                {fullDay && (
                  <Lock className="w-4 h-4 text-red-400 mt-1" />
                )}
                {partial && (
                  <div className="mt-1 text-[10px] text-orange-400">
                    {blocked.timeSlots.length} слот.
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gold" />
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }) : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Full day toggle */}
            <label className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border cursor-pointer">
              <input
                type="checkbox"
                checked={isFullDay}
                onChange={(e) => setIsFullDay(e.target.checked)}
                className="w-5 h-5 rounded border-border text-gold focus:ring-gold"
              />
              <span className="text-sm font-medium text-text-primary">
                Заблокировать весь день
              </span>
              {isFullDay ? (
                <Lock className="w-4 h-4 text-red-400 ml-auto" />
              ) : (
                <Unlock className="w-4 h-4 text-text-muted ml-auto" />
              )}
            </label>

            {/* Time slots */}
            {!isFullDay && (
              <div>
                <p className="text-sm text-text-secondary mb-2">
                  Выберите временные слоты для блокировки:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`
                        flex items-center justify-center gap-2 px-2 py-2 rounded-lg border text-sm cursor-pointer transition-colors
                        ${selectedSlots.includes(slot)
                          ? 'bg-red-500/10 border-red-500/50 text-red-400'
                          : 'bg-surface-secondary border-border text-text-secondary hover:bg-surface-hover'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slot)}
                        onChange={() => toggleSlot(slot)}
                        className="sr-only"
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {blockedMap.get(selectedDate || '') && (
              <button
                onClick={handleDelete}
                disabled={deleteSlot.isPending}
                className="px-4 py-2 rounded-lg border border-error text-error hover:bg-error/10 transition-colors text-sm font-medium"
              >
                {deleteSlot.isPending ? 'Удаление...' : 'Удалить блокировку'}
              </button>
            )}
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition-colors text-sm font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={createSlot.isPending || (!isFullDay && selectedSlots.length === 0)}
              className="px-4 py-2 rounded-lg bg-gold text-background-primary hover:bg-gold-light transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSlot.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
