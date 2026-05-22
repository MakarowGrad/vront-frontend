'use client';

/**
 * ImageUploader - Uploads files to server, returns real URLs
 * Works on mobile (camera) and desktop (drag & drop / click)
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:3001/api`
  : 'http://localhost:3001/api';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  label = 'Фотографии',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiFetch('/catalog/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Ошибка загрузки изображения');
      throw new Error(errText);
    }

    const data = await res.json();
    return data.url;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const remainingSlots = maxImages - images.length;
      const imageFiles = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remainingSlots);

      if (imageFiles.length === 0) return;

      setUploading(true);
      try {
        const urls = await Promise.all(imageFiles.map(uploadFile));
        onChange([...images, ...urls]);
      } catch (err) {
        alert('Не удалось загрузить изображения');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [clickedImage] = newImages.splice(index, 1);
    newImages.unshift(clickedImage);
    onChange(newImages);
  };

  const fullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${window.location.protocol}//${window.location.hostname}:3001${url}`;
    return url;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-body-sm font-medium text-text-secondary">
          {label}{' '}
          <span className="text-text-muted">
            ({images.length}/{maxImages})
          </span>
        </label>
      </div>

      {/* Upload Area */}
      {images.length < maxImages && !uploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all min-h-[140px]
            ${isDragging
              ? 'border-gold bg-gold/5'
              : 'border-border hover:border-gold/50 hover:bg-surface-hover'
            }
          `}
        >
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
            <Upload className="w-5 h-5 text-gold" />
          </div>
          <div className="text-center">
            <p className="text-body-sm text-text-secondary">
              Перетащите фото сюда
            </p>
            <p className="text-caption text-text-muted mt-1">
              или нажмите для выбора
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Uploading state */}
      {uploading && (
        <div className="border-2 border-dashed border-gold/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 min-h-[140px] bg-gold/5">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-body-sm text-text-secondary">Загрузка...</p>
        </div>
      )}

      {/* Camera button for mobile */}
      {images.length < maxImages && !uploading && (
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="w-full py-3 px-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-all flex items-center justify-center gap-2 text-body-sm text-text-secondary"
        >
          <Camera className="w-4 h-4" />
          Сделать фото камерой
        </button>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={fullUrl(url)}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onDoubleClick={() => setAsCover(index)}
                title={index === 0 ? 'Обложка' : 'Двойной клик — сделать обложкой'}
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Cover badge */}
              {index === 0 ? (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-gold text-background-primary text-[10px] font-bold">
                  Обложка
                </span>
              ) : (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  2× клик — обложка
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
