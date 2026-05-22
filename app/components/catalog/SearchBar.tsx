/**
 * SearchBar Component
 * Premium search input for dish catalog
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Поиск блюд...',
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center',
        'bg-surface-secondary rounded-xl',
        'border transition-all duration-200',
        isFocused
          ? 'border-gold shadow-glow-sm'
          : 'border-border hover:border-border-light',
        className
      )}
    >
      {/* Search Icon */}
      <div className="absolute left-4 pointer-events-none">
        <Search
          className={cn(
            'w-5 h-5 transition-colors duration-200',
            isFocused ? 'text-gold' : 'text-text-muted'
          )}
        />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full py-3 pl-12 pr-10',
          'bg-transparent text-body-md text-text-primary',
          'placeholder:text-text-muted',
          'focus:outline-none'
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute right-3',
            'w-6 h-6 rounded-full',
            'flex items-center justify-center',
            'bg-surface-tertiary text-text-muted',
            'hover:bg-surface-hover hover:text-text-primary',
            'transition-all duration-200'
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

interface SearchBarCompactProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBarCompact({ onSearch, className }: SearchBarCompactProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          'w-10 h-10 rounded-full',
          'flex items-center justify-center',
          'bg-surface-tertiary text-text-secondary',
          'hover:bg-surface-hover hover:text-text-primary',
          'transition-all duration-200',
          className
        )}
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query) setIsExpanded(false);
        }}
        placeholder="Поиск..."
        autoFocus
        className={cn(
          'w-48 py-2 pl-10 pr-8',
          'bg-surface-tertiary rounded-full',
          'text-body-sm text-text-primary',
          'placeholder:text-text-muted',
          'border border-border focus:border-gold',
          'focus:outline-none transition-all duration-200'
        )}
      />
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-text-muted hover:text-text-primary" />
        </button>
      )}
    </form>
  );
}
