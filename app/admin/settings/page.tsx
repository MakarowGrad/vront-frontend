'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSettings, useUpdateSettings } from '@/app/hooks/useSettings';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn, getImageUrl } from '@/lib/utils';
import { 
  Settings, 
  Store, 
  Phone, 
  MapPin, 
  Clock,
  Save,
  AlertCircle,
  Loader2,
  Palette,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/api';

const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Тёмная' },
  { value: 'light', label: 'Светлая' },
  { value: 'custom', label: 'Премиум' },
];

export default function AdminSettingsPage() {
  const { data: settings, isLoading, error } = useSettings();
  const updateSettings = useUpdateSettings();
  
  const [formData, setFormData] = useState({
    brandName: '',
    phone: '',
    address: '',
    workingHours: '',
    description: '',
    theme: 'custom',
    backgroundImage: '',
  });
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        brandName: settings.brandName || '',
        phone: settings.phone || '',
        address: settings.address || '',
        workingHours: settings.workingHours || '',
        description: settings.description || '',
        theme: settings.theme || 'custom',
        backgroundImage: settings.backgroundImage || '',
      });
    }
  }, [settings]);

  const handleUploadBackground = useCallback(async (file: File) => {
    setUploadingBg(true);
    try {
      const form = new FormData();
      form.append('image', file);

      const token = getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/settings/upload`, {
        method: 'POST',
        headers,
        body: form,
      });

      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setFormData(prev => ({ ...prev, backgroundImage: data.imageUrl }));
      toast.success('Фон загружен');
    } catch {
      toast.error('Не удалось загрузить фон');
    } finally {
      setUploadingBg(false);
    }
  }, []);

  const handleRemoveBackground = () => {
    setFormData(prev => ({ ...prev, backgroundImage: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        brandName: formData.brandName,
        phone: formData.phone,
        address: formData.address,
        workingHours: formData.workingHours,
        description: formData.description,
        theme: formData.theme,
        backgroundImage: formData.backgroundImage || null,
      });
      toast.success('Настройки сохранены');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Ошибка загрузки настроек</h2>
          <p className="text-sm text-text-secondary">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings className="w-6 h-6 text-gold" />
          Настройки
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Управление внешним видом и контактами
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme */}
          <div className="bg-surface-secondary rounded-xl border border-border p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <Palette className="w-4 h-4" />
              Тема оформления
            </label>
            <div className="flex gap-2">
              {THEME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, theme: opt.value }))}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                    formData.theme === opt.value
                      ? 'bg-gold text-background-primary border-gold'
                      : 'bg-surface-primary text-text-secondary border-border hover:border-gold/50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Image */}
          <div className="bg-surface-secondary rounded-xl border border-border p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <ImageIcon className="w-4 h-4" />
              Фоновое изображение
            </label>

            {formData.backgroundImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={getImageUrl(formData.backgroundImage)}
                  alt="Фон"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-text-secondary">
                <Upload className="w-8 h-8 text-text-muted" />
                <p className="text-sm">Нет фонового изображения</p>
              </div>
            )}

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadBackground(file);
                  }}
                />
                <div className={cn(
                  'w-full py-2.5 px-4 rounded-lg border text-sm font-medium text-center transition-all',
                  'border-border bg-surface-primary text-text-secondary hover:border-gold/50',
                  uploadingBg && 'opacity-50 cursor-not-allowed'
                )}>
                  {uploadingBg ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Загрузка...
                    </span>
                  ) : (
                    formData.backgroundImage ? 'Заменить изображение' : 'Загрузить изображение'
                  )}
                </div>
              </label>
              {formData.backgroundImage && (
                <Button type="button" variant="outline" onClick={handleRemoveBackground}>
                  Удалить
                </Button>
              )}
            </div>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Store className="w-4 h-4" />
              Название бренда
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl",
                "bg-surface-secondary border border-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-gold/50"
              )}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              Телефон
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl",
                "bg-surface-secondary border border-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-gold/50"
              )}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Адрес
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl",
                "bg-surface-secondary border border-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-gold/50"
              )}
            />
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Часы работы
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              placeholder="Пн-Пт: 10:00-22:00, Сб-Вс: 11:00-23:00"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl",
                "bg-surface-secondary border border-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-gold/50"
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl",
                "bg-surface-secondary border border-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-gold/50",
                "resize-none"
              )}
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateSettings.isPending || uploadingBg}
              className="w-full"
            >
              {updateSettings.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Сохранить настройки
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
