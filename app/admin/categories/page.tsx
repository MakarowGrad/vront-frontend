'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { GripVertical, Eye, EyeOff, Pencil, Check, X, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/app/hooks/useCategories';
import { Category } from '@/app/types';

export default function CategoriesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleToggleVisibility = (category: Category) => {
    if (updateCategory.isPending) return;
    updateCategory.mutate(
      {
        id: category.id,
        input: { isActive: !category.isActive },
      },
      {
        onError: (err) => {
          console.error('Failed to toggle visibility:', err);
          alert('Ошибка при изменении видимости');
        },
      }
    );
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editingId || updateCategory.isPending) return;
    updateCategory.mutate(
      {
        id: editingId,
        input: { name: editName.trim() },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditName('');
        },
        onError: (err) => {
          console.error('Failed to update category:', err);
          alert('Ошибка при сохранении категории');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0 || updateCategory.isPending) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;
    try {
      await Promise.all(
        newCategories.map((cat, i) =>
          updateCategory.mutateAsync({ id: cat.id, input: { sortOrder: i + 1 } })
        )
      );
    } catch (err) {
      console.error('Failed to reorder categories:', err);
      alert('Ошибка при изменении порядка');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1 || updateCategory.isPending) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;
    try {
      await Promise.all(
        newCategories.map((cat, i) =>
          updateCategory.mutateAsync({ id: cat.id, input: { sortOrder: i + 1 } })
        )
      );
    } catch (err) {
      console.error('Failed to reorder categories:', err);
      alert('Ошибка при изменении порядка');
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || createCategory.isPending) return;
    createCategory.mutate(
      {
        name: newCategoryName.trim(),
        slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        description: '',
        sortOrder: categories.length + 1,
        isActive: true,
      },
      {
        onSuccess: () => {
          setNewCategoryName('');
          setIsAdding(false);
        },
        onError: (err) => {
          console.error('Failed to create category:', err);
          alert('Ошибка при создании категории');
        },
      }
    );
  };

  const handleDeleteCategory = (id: string) => {
    if (deleteCategory.isPending) return;
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      deleteCategory.mutate(id, {
        onError: (err: any) => {
          console.error('Failed to delete category:', err);
          alert(err?.message || 'Ошибка при удалении категории');
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-heading-xl text-text-primary">Категории</h1>
          <p className="text-body-sm text-text-muted mt-1">
            Управление категориями меню
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-gold hover:bg-gold-dark text-background"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-surface-primary rounded-xl border border-border p-6">
          <h2 className="font-serif text-heading-md text-text-primary mb-4">Новая категория</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название категории"
              className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <Button onClick={handleAddCategory} disabled={createCategory.isPending} className="bg-gold hover:bg-gold-dark text-background">
              {createCategory.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Добавить
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-surface-primary rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-secondary">
          <div className="grid grid-cols-12 gap-4 text-body-xs font-medium text-text-muted uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Название</div>
            <div className="col-span-3 hidden sm:block">Slug</div>
            <div className="col-span-3 sm:col-span-2">Статус</div>
            <div className="col-span-4 sm:col-span-2 text-right">Действия</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {categories.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-body-sm text-text-muted">Нет категорий</p>
              <p className="text-caption text-text-muted mt-1">
                Добавьте первую категорию, чтобы начать
              </p>
            </div>
          ) : (
            categories.map((category, index) => (
              <div
                key={category.id}
                className="px-6 py-4 hover:bg-surface-secondary transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Order Number */}
                  <div className="col-span-1 flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
                    <span className="text-body-sm text-text-muted">{index + 1}</span>
                  </div>

                  {/* Name */}
                  <div className="col-span-4">
                    {editingId === category.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          onBlur={(e) => {
                            // Don't save if focus moved to cancel button
                            if (e.relatedTarget?.closest('button')?.textContent?.includes('✕')) {
                              return;
                            }
                            handleSaveEdit();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          disabled={updateCategory.isPending}
                          className="p-1.5 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors disabled:opacity-50"
                        >
                          {updateCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/admin/dishes?categoryId=${category.id}`}
                        className="text-body-sm font-medium text-text-primary hover:text-gold transition-colors"
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="col-span-3 hidden sm:block">
                    <span className="text-body-sm text-text-muted">{category.slug}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 sm:col-span-2">
                    <button
                      onClick={() => handleToggleVisibility(category)}
                      className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-xs font-medium transition-colors whitespace-nowrap flex-shrink-0
                        ${category.isActive
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-error/10 text-error border border-error/20'
                        }
                      `}
                    >
                      {category.isActive ? (
                        <>
                          <Eye className="w-3 h-3 flex-shrink-0" />
                          Видима
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 flex-shrink-0" />
                          Скрыта
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-0.5">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || updateCategory.isPending}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      title="Вверх"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1 || updateCategory.isPending}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      title="Вниз"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(category)}
                      disabled={editingId === category.id || updateCategory.isPending}
                      className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-gold disabled:opacity-50 transition-colors flex-shrink-0"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleteCategory.isPending}
                      className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors disabled:opacity-50 flex-shrink-0"
                      title="Удалить"
                    >
                      {deleteCategory.isPending && deleteCategory.variables === category.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-info/5 border border-info/20 rounded-lg">
        <div className="w-5 h-5 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-info text-xs">i</span>
        </div>
        <div>
          <p className="text-body-sm text-text-secondary">
            Используйте стрелки для изменения порядка отображения категорий в меню.
            Категории со статусом &quot;Скрыта&quot; не отображаются на сайте.
          </p>
        </div>
      </div>
    </div>
  );
}
