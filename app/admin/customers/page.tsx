'use client';

import { useState } from 'react';
import { useCustomers } from '@/app/hooks/useCustomers';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Phone, 
  ShoppingBag,
  Search,
  AlertCircle
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: customers, isLoading, error } = useCustomers();

  const filteredCustomers = customers?.filter((c) => 
    c.phone?.includes(searchQuery) || 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Ошибка загрузки клиентов</h2>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-6 h-6 text-gold" />
          Клиенты
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          База клиентов и их заказы
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Поиск по имени или телефону..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-xl",
            "bg-surface-secondary border border-border",
            "text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-gold/50"
          )}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">
              {searchQuery ? 'Клиенты не найдены' : 'Нет клиентов'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="p-4 hover:bg-background-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">
                      {customer.name || 'Без имени'}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {customer.phone}
                      </span>
                      {customer.ordersCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {customer.ordersCount} заказов
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {customer.totalSpent !== undefined && (
                      <span className="font-semibold text-text-primary">
                        {customer.totalSpent.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
