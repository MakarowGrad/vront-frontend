import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

const DASHBOARD_KEY = 'dashboard';

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalCustomers: number;
  totalDishes: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  customer: {
    phone: string;
    name: string | null;
  };
  itemCount: number;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

async function fetchDashboard(): Promise<DashboardData> {
  const response = await apiFetch('/admin/dashboard');

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  const data = await response.json();
  return data.data || data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [DASHBOARD_KEY],
    queryFn: fetchDashboard,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}
