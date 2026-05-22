/**
 * FilterBar Component
 * Hit/New/Available filters + sort dropdown
 */

'use client';

import React from 'react';
import { Flame, Sparkles, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { SortOption } from '@/app/types';
import { cn } from '@/app/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface FilterBarProps {
  showHitsOnly: boolean;
  showNewOnly: boolean;
  showAvailableOnly: boolean;
  sortBy: SortOption;
  onToggleHits: () => void;
  onToggleNew: () => void;
  onToggleAvailable: () => void;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'name_asc', label: 'Название: А-Я' },
  { value: 'name_desc', label: 'Название: Я-А' },
  { value: 'newest', label: 'Сначала новые' },
];

export function FilterBar({
  showHitsOnly,
  showNewOnly,
  showAvailableOnly,
  sortBy,
  onToggleHits,
  onToggleNew,
  onToggleAvailable,
  onSortChange,
  resultsCount,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Top Row - Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hits Filter */}
          <button
            onClick={onToggleHits}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-body-sm font-medium transition-all duration-200',
              showHitsOnly
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-surface-tertiary text-text-secondary hover:text-text-primary border border-transparent'
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            Хиты
            {showHitsOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* New Filter */}
          <button
            onClick={onToggleNew}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-body-sm font-medium transition-all duration-200',
              showNewOnly
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-surface-tertiary text-text-secondary hover:text-text-primary border border-transparent'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Новинки
            {showNewOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Available Filter */}
          <button
            onClick={onToggleAvailable}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-body-sm font-medium transition-all duration-200',
              showAvailableOnly
                ? 'bg-info/20 text-info border border-info/30'
                : 'bg-surface-tertiary text-text-secondary hover:text-text-primary border border-transparent'
            )}
          >
            <Check className="w-3.5 h-3.5" />
            В наличии
            {showAvailableOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-text-muted" />
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[180px] h-9 bg-surface-tertiary border-border text-body-sm">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent className="bg-surface-secondary border-border">
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-body-sm text-text-secondary focus:text-text-primary focus:bg-surface-tertiary"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-body-xs text-text-muted">
        <span>Найдено:</span>
        <span className="font-medium text-text-secondary">
          {resultsCount} {getDishesWord(resultsCount)}
        </span>
      </div>
    </div>
  );
}

function getDishesWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'блюд';
  }

  if (lastDigit === 1) {
    return 'блюдо';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'блюда';
  }

  return 'блюд';
}
