'use client';

import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/app/hooks/useAnalytics';

const PERIODS = [
  { value: 7, label: '7 дней' },
  { value: 30, label: '30 дней' },
  { value: 90, label: '90 дней' },
];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function SvgChart({ data }: { data: Array<{ date: string; views: number; unique: number }> }) {
  if (data.length === 0) return null;

  const width = 800;
  const height = 320;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => Math.max(d.views, d.unique)), 1);
  const niceMax = Math.ceil(maxValue / 5) * 5 || 5;

  const getX = (i: number) => padding.left + (i / (data.length - 1 || 1)) * chartWidth;
  const getY = (v: number) => padding.top + chartHeight - (v / niceMax) * chartHeight;

  const viewsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.views)}`)
    .join(' ');

  const uniquePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.unique)}`)
    .join(' ');

  const gridLines = [0, 1, 2, 3, 4, 5].map((i) => {
    const y = padding.top + chartHeight - (i / 5) * chartHeight;
    const value = Math.round((niceMax / 5) * i);
    return (
      <g key={i}>
        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#333" strokeWidth={1} />
        <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#888" fontSize={10}>
          {value}
        </text>
      </g>
    );
  });

  const xLabels = data.map((d, i) => (
    <text
      key={d.date}
      x={getX(i)}
      y={height - padding.bottom + 18}
      textAnchor="middle"
      fill="#888"
      fontSize={10}
      transform={`rotate(-30, ${getX(i)}, ${height - padding.bottom + 18})`}
    >
      {formatDateLabel(d.date)}
    </text>
  ));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px]" preserveAspectRatio="xMidYMid meet">
        {gridLines}
        <path d={viewsPath} fill="none" stroke="#c9a96e" strokeWidth={2} />
        <path d={uniquePath} fill="none" stroke="#aaaaaa" strokeWidth={2} strokeDasharray="4 4" />
        {data.map((d, i) => (
          <g key={`pts-${d.date}`}>
            <circle cx={getX(i)} cy={getY(d.views)} r={4} fill="#c9a96e" />
            <circle cx={getX(i)} cy={getY(d.unique)} r={3} fill="#aaaaaa" />
          </g>
        ))}
        {xLabels}
      </svg>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading, error } = useAnalytics(days);

  const chartData = useMemo(() => {
    if (!data?.chartData) return [];
    return data.chartData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
        <p className="text-body-sm text-text-muted">Загрузка статистики...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Ошибка загрузки статистики</h2>
          <p className="text-sm text-text-secondary">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold" />
            Статистика посещений
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Аналитика посещений сайта за выбранный период
          </p>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDays(p.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                days === p.value
                  ? 'bg-gold text-background-primary'
                  : 'bg-surface-secondary text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-secondary rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gold/10">
              <Eye className="w-5 h-5 text-gold" />
            </div>
            <span className="text-sm text-text-secondary">Всего просмотров</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{data?.totalViews ?? 0}</p>
        </div>

        <div className="bg-surface-secondary rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-text-secondary">Уникальные посетители</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{data?.totalUnique ?? 0}</p>
        </div>

        <div className="bg-surface-secondary rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-text-secondary">Среднее в день</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {chartData.length > 0 ? Math.round((data?.totalViews ?? 0) / chartData.length) : 0}
          </p>
        </div>

        <div className="bg-surface-secondary rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-text-secondary">Дней в периоде</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{chartData.length}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface-secondary rounded-xl border border-border p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Динамика посещений</h2>
        {chartData.length > 0 ? (
          <>
            <SvgChart data={chartData} />
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-text-secondary">Просмотры</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-text-muted" />
                <span className="text-text-secondary">Уникальные</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-text-muted py-12">Нет данных за выбранный период</p>
        )}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Топ страниц</h2>
          </div>
          <div className="divide-y divide-border">
            {data?.topPaths && data.topPaths.length > 0 ? (
              data.topPaths.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-text-primary truncate max-w-[60%]">{item.path}</span>
                  <span className="text-sm font-medium text-gold">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-text-muted py-8">Нет данных</p>
            )}
          </div>
        </div>

        {/* Top referrers */}
        <div className="bg-surface-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Источники трафика</h2>
          </div>
          <div className="divide-y divide-border">
            {data?.topReferrers && data.topReferrers.length > 0 ? (
              data.topReferrers.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-text-primary truncate max-w-[70%]">
                    {item.referrer || 'Прямой заход / неизвестно'}
                  </span>
                  <span className="text-sm font-medium text-gold">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-text-muted py-8">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
