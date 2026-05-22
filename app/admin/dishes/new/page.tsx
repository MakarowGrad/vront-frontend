'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, X, Star, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useCategories } from '@/app/hooks/useCategories';
import { useCreateDish } from '@/app/hooks/useDishes';
import { z } from 'zod';
import { ImageUploader } from '../../components/ImageUploader';
import { VideoUploader } from '../../components/VideoUploader';
import { getImageUrl } from '@/app/lib/utils';

// Validation schema
const dishSchema = z.object({
  title: z.string().min(2, 'Название должно содержать минимум 2 символа'),
  slug: z.string().min(2, 'Slug должен содержать минимум 2 символа').regex(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефисы'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  composition: z.string().min(5, 'Укажите состав блюда'),
  price: z.number().min(1, 'Цена должна быть больше 0'),
  weight: z.number().min(0).optional(),
  orderStep: z.number().min(1, 'Шаг заказа должен быть минимум 1'),
  minQty: z.number().min(1, 'Минимальное количество должно быть минимум 1'),
  images: z.array(z.string()).min(1, 'Добавьте хотя бы одно фото'),
});

type DishFormData = {
  title: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  composition: string;
  price: number;
  weight?: number;
  orderStep: number;
  minQty: number;
  isHit: boolean;
  isNew: boolean;
  isAvailable: boolean;
  images: string[];
  explodeVideo: string;
  assembleVideo: string;
};

const initialFormData: DishFormData = {
  title: '',
  slug: '',
  categoryId: '',
  shortDescription: '',
  fullDescription: '',
  composition: '',
  price: 0,
  weight: undefined,
  orderStep: 1,
  minQty: 1,
  isHit: false,
  isNew: false,
  isAvailable: true,
  images: [],
  explodeVideo: '',
  assembleVideo: '',
};

const orderStepOptions = [1, 5, 8, 10];

export default function NewDishPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DishFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [galleryInput, setGalleryInput] = useState('');
  // galleryInput not used anymore but kept to avoid type errors during transition
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof DishFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const validateForm = (): boolean => {
    try {
      dishSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const createDish = useCreateDish();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    createDish.mutate({
      title: formData.title,
      slug: formData.slug,
      categoryId: formData.categoryId,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      composition: formData.composition,
      price: formData.price,
      weight: formData.weight || undefined,
      orderStep: formData.orderStep,
      minQty: formData.minQty,
      isHit: formData.isHit,
      isNew: formData.isNew,
      isAvailable: formData.isAvailable,
      coverImage: formData.images[0] || '',
      gallery: formData.images.slice(1),
      explodeVideo: formData.explodeVideo,
      assembleVideo: formData.assembleVideo,
    } as any, {
      onSuccess: () => router.push('/admin/dishes'),
      onError: (err: any) => {
        alert(err.message || 'Ошибка при создании блюда');
        setIsSubmitting(false);
      },
    });
  };

  const { data: categories = [] } = useCategories();
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dishes"
            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-heading-xl text-text-primary">Новое блюдо</h1>
            <p className="text-body-sm text-text-muted mt-1">
              Создание нового блюда в меню
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Скрыть превью' : 'Показать превью'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-dark text-background"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 mr-2 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-surface-primary rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-heading-lg text-text-primary">Основная информация</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Название <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Например: Тартар из говядины"
                  className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                    errors.title ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.title && <p className="text-caption text-error">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Slug <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="tartar-iz-govyadiny"
                  className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                    errors.slug ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.slug && <p className="text-caption text-error">{errors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-secondary">
                Категория <span className="text-error">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                  errors.categoryId ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-caption text-error">{errors.categoryId}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-secondary">
                Краткое описание
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="Краткое описание для карточки блюда"
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                  errors.shortDescription ? 'border-error' : 'border-border'
                }`}
              />
              {errors.shortDescription && <p className="text-caption text-error">{errors.shortDescription}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-secondary">
                Полное описание
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => handleChange('fullDescription', e.target.value)}
                placeholder="Подробное описание блюда"
                rows={4}
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all resize-none ${
                  errors.fullDescription ? 'border-error' : 'border-border'
                }`}
              />
              {errors.fullDescription && <p className="text-caption text-error">{errors.fullDescription}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-secondary">
                Состав <span className="text-error">*</span>
              </label>
              <textarea
                value={formData.composition}
                onChange={(e) => handleChange('composition', e.target.value)}
                placeholder="Перечислите ингредиенты через запятую"
                rows={3}
                className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all resize-none ${
                  errors.composition ? 'border-error' : 'border-border'
                }`}
              />
              {errors.composition && <p className="text-caption text-error">{errors.composition}</p>}
            </div>
          </div>

          {/* Pricing & Quantity */}
          <div className="bg-surface-primary rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-heading-lg text-text-primary">Цена и количество</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Цена (₽) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                  placeholder="1850"
                  className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                    errors.price ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.price && <p className="text-caption text-error">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Вес (г)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="180"
                  className={`w-full px-4 py-2.5 bg-surface border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all ${
                    errors.weight ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.weight && <p className="text-caption text-error">{errors.weight}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Шаг заказа <span className="text-error">*</span>
                </label>
                <select
                  value={formData.orderStep}
                  onChange={(e) => handleChange('orderStep', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                >
                  {orderStepOptions.map((step) => (
                    <option key={step} value={step}>
                      {step}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-secondary">
                  Мин. количество <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minQty}
                  onChange={(e) => handleChange('minQty', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-body-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-surface-primary rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-heading-lg text-text-primary">Медиа</h2>

            <ImageUploader
              images={formData.images}
              onChange={handleImagesChange}
              maxImages={10}
              label="Фотографии блюда"
            />
            {errors.images && <p className="text-caption text-error">{errors.images}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <VideoUploader
                videoUrl={formData.explodeVideo}
                onChange={(url) => handleChange('explodeVideo', url)}
                label="Видео разборки"
              />
              <VideoUploader
                videoUrl={formData.assembleVideo}
                onChange={(url) => handleChange('assembleVideo', url)}
                label="Видео сборки"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-surface-primary rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-heading-lg text-text-primary">Настройки</h2>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHit}
                  onChange={(e) => handleChange('isHit', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-gold focus:ring-gold/20"
                />
                <span className="text-body-sm text-text-secondary">Хит продаж</span>
                <Star className="w-4 h-4 text-gold" />
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => handleChange('isNew', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-gold focus:ring-gold/20"
                />
                <span className="text-body-sm text-text-secondary">Новинка</span>
                <Sparkles className="w-4 h-4 text-success" />
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => handleChange('isAvailable', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-gold focus:ring-gold/20"
                />
                <span className="text-body-sm text-text-secondary">Доступно для заказа</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/dishes">
              <Button type="button" variant="outline">
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gold hover:bg-gold-dark text-background"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            {/* Catalog Card Preview */}
            <div className="bg-surface-primary rounded-xl border border-border p-6">
              <h3 className="font-serif text-heading-md text-text-primary mb-4">Карточка в каталоге</h3>
              <div className="bg-surface-secondary rounded-xl overflow-hidden border border-border">
                <div className="relative aspect-[4/3] bg-surface-tertiary">
                  {formData.images[0] ? (
                    <img
                      src={getImageUrl(formData.images[0])}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-caption text-text-muted">Нет изображения</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {formData.isHit && (
                      <span className="badge-hit">Хит</span>
                    )}
                    {formData.isNew && (
                      <span className="badge-new">Новинка</span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-serif text-heading-sm text-text-primary line-clamp-1">
                    {formData.title || 'Название блюда'}
                  </h4>
                  <p className="text-body-xs text-text-muted line-clamp-2">
                    {formData.shortDescription || 'Краткое описание блюда'}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="price-display text-lg">
                      {formData.price > 0 ? `${formData.price.toLocaleString('ru-RU')} ₽` : '0 ₽'}
                    </span>
                    <span className="text-caption text-text-muted">
                      {formData.weight ? `${formData.weight} г` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail View Preview */}
            <div className="bg-surface-primary rounded-xl border border-border p-6">
              <h3 className="font-serif text-heading-md text-text-primary mb-4">Страница блюда</h3>
              <div className="bg-surface-secondary rounded-xl overflow-hidden border border-border">
                <div className="relative aspect-video bg-surface-tertiary">
                  {formData.images[0] ? (
                    <img
                      src={getImageUrl(formData.images[0])}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-caption text-text-muted">Нет изображения</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-serif text-heading-lg text-text-primary">
                      {formData.title || 'Название блюда'}
                    </h4>
                    <div className="flex gap-1.5">
                      {formData.isHit && (
                        <span className="badge-hit">Хит</span>
                      )}
                      {formData.isNew && (
                        <span className="badge-new">Новинка</span>
                      )}
                    </div>
                  </div>
                  <p className="text-body-sm text-text-secondary">
                    {formData.fullDescription || 'Полное описание блюда'}
                  </p>
                  {formData.composition && (
                    <div className="pt-2">
                      <span className="label">Состав:</span>
                      <p className="text-body-sm text-text-secondary mt-1">
                        {formData.composition}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      <span className="price-display text-2xl">
                        {formData.price > 0 ? `${formData.price.toLocaleString('ru-RU')} ₽` : '0 ₽'}
                      </span>
                      <span className="text-body-sm text-text-muted">
                        {formData.weight ? `${formData.weight} г` : '—'}
                      </span>
                    </div>
                    <span className="text-caption text-text-muted">
                      {selectedCategory?.name || 'Категория'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
