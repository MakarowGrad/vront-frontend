'use client';

import { Check, AlertCircle, Send } from 'lucide-react';

interface NotificationChannelProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
  channelKey: string;
  testStatus: Record<string, 'idle' | 'sending' | 'success' | 'error'>;
  onTest: (key: string) => void;
}

export function NotificationChannel({
  title,
  icon: Icon,
  iconColor,
  enabled,
  onToggle,
  children,
  channelKey,
  testStatus,
  onTest,
}: NotificationChannelProps) {
  const status = testStatus[channelKey] || 'idle';

  return (
    <div className={`rounded-xl border p-5 transition-all ${enabled ? 'border-gold/50 bg-gold/5' : 'border-border bg-surface-primary'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">{title}</h3>
            <p className="text-xs text-text-muted">
              {enabled ? 'Включено' : 'Отключено'}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
        </label>
      </div>

      {enabled && (
        <div className="space-y-4">
          {children}

          <button
            onClick={() => onTest(channelKey)}
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-sm"
          >
            {status === 'sending' ? (
              <>
                <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                Отправка...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Отправлено!
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Ошибка
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Тестовое уведомление
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
