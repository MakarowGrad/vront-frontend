'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, Star, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { DataTable, Column } from '../components/DataTable';
import { AvailabilityBadge } from '../components/StatusBadge';
import { useDishes, useDeleteDish } from '@/app/hooks/useDishes';
import { useCategories } from '@/app/hooks/useCategories';
import { Dish } from '@/app/types';
import { getImageUrl } from '@/app/lib/utils';

function DishesPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('categoryId') || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const catId = searchParams.get('categoryId');
    if (catId) setCategoryFilter(catId);
  }, [searchParams]);

  const { data: dishes = [], isLoading } = useDishes({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const deleteDish = useDeleteDish();

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || dish.categoryId === categoryFilter;
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && dish.isAvailable) ||
        (availabilityFilter === 'unavailable' && !dish.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [dishes, searchQuery, categoryFilter, availabilityFilter]);

  // Paginate
  const paginatedDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDishes.slice(start, start + itemsPerPage);
  }, [filteredDishes, currentPage]);

  const handleDelete = async (dishId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это блюдо?')) return;
    // SECURITY-FIX-INF-002: Removed debug console.log [2026-05-18]

    try {
      await deleteDish.mutateAsync(dishId);
      toast.success('Блюдо успешно удалено');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при удалении блюда');
    }
  };

  const columns: Column<Dish>[] = [
    {
      key: 'image',
      header: 'Изображение',
      width: '80px',
      sortable: false,
      render: (dish) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-secondary">
          {dish.coverImage ? (
            <Image
              src={getImageUrl(dish.coverImage)}
              alt={dish.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-caption text-text-muted">Нет фото</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Название',
      render: (dish) => (
        <div className="flex flex-col">
          <span className="text-body-sm font-medium text-text-primary">{dish.title}</span>
          <span className="text-caption text-text-muted line-clamp-1">{dish.shortDescription}</span>
          <div className="flex items-center gap-1 mt-1">
            {dish.isHit && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gold/20 text-gold text-caption">
                <Star className="w-3 h-3" />
                Хит
              </span>
            )}
            {dish.isNew && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success/20 text-success text-caption">
                <Sparkles className="w-3 h-3" />
                Новинка
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Категория',
      width: '140px',
      render: (dish) => {
        const category = categories.find((c) => c.id === dish.categoryId);
        return (
          <span className="text-body-sm text-text-secondary">
            {category?.name || '—'}
          </span>
        );
      },
    },
    {
      key: 'price',
      header: 'Цена',
      width: '120px',
      render: (dish) => (
        <span className="text-body-sm font-medium text-gold">
          {dish.price.toLocaleString('ru-RU')} ₽
        </span>
      ),
    },
    {
      key: 'orderStep',
      header: 'Шаг',
      width: '80px',
      render: (dish) => (
        <span className="text-body-sm text-text-secondary">{dish.orderStep}</span>
      ),
    },
    {
      key: 'availability',
      header: 'Доступность',
      width: '130px',
      render: (dish) => (
        <AvailabilityBadge isAvailable={dish.isAvailable} />
      ),
    },
    {
      key: 'actions',
      header: 'Действия',
      width: '100px',
      sortable: false,
      render: (dish) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/dishes/edit?id=${dish.id}`}
            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-gold transition-colors"
            title="Редактировать"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(dish.id)}
            disabled={deleteDish.isPending}
            className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors disabled:opacity-50"
            title="Удалить"
          >
            {deleteDish.isPending && deleteDish.variables === dish.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-heading-xl text-text-primary">Блюда</h1>
          <p className="text-body-sm text-text-muted mt-1">
            Управление меню
          </p>
        </div>
        <Link href="/admin/dishes/new">
          <Button className="bg-gold hover:bg-gold-dark text-background">
            <Plus className="w-4 h-4 mr-2" />
            Добавить блюдо
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Поиск блюд..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
        >
          <option value="all">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => {
            setAvailabilityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
        >
          <option value="all">Все статусы</option>
          <option value="available">Доступные</option>
          <option value="unavailable">Недоступные</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedDishes}
        keyExtractor={(dish) => dish.id}
        isLoading={isLoading}
        emptyMessage={searchQuery ? 'Блюда не найдены' : 'Нет блюд для отображения'}
        pagination={{
          page: currentPage,
          limit: itemsPerPage,
          total: filteredDishes.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}

export default function DishesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Загрузка...</div>}>
      <DishesPageContent />
    </Suspense>
  );
}
