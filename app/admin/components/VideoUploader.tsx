'use client';

/**
 * VideoUploader - Drag & Drop video upload
 * Works on mobile and desktop
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Video, Play } from 'lucide-react';

interface VideoUploaderProps {
  videoUrl: string;
  onChange: (url: string) => void;
  label?: string;
}

export function VideoUploader({
  videoUrl,
  onChange,
  label = 'Видео',
}: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    },
    [onChange]
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
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeVideo = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      <label className="text-body-sm font-medium text-text-secondary">
        {label}
      </label>

      {videoUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border bg-black">
          <video
            src={videoUrl}
            controls
            className="w-full max-h-[200px]"
          />
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-error/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-5
            flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all min-h-[100px]
            ${isDragging
              ? 'border-gold bg-gold/5'
              : 'border-border hover:border-gold/50 hover:bg-surface-hover'
            }
          `}
        >
          <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center">
            <Video className="w-4 h-4 text-gold" />
          </div>
          <div className="text-center">
            <p className="text-body-sm text-text-secondary">
              Перетащите видео сюда
            </p>
            <p className="text-caption text-text-muted mt-0.5">
              или нажмите для выбора
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </div>
      )}
    </div>
  );
}
