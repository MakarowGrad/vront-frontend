import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface AnalyticsStats {
  totalViews: number;
  totalUnique: number;
  chartData: Array<{ date: string; views: number; unique: number }>;
  topPaths: Array<{ path: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export function useAnalytics(days = 30) {
  return useQuery<AnalyticsStats>({
    queryKey: ['analytics', days],
    queryFn: async () => {
      const response = await apiFetch(`/analytics?days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
  });
}
