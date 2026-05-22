import { useQuery } from '@tanstack/react-query';
import { apiFetch, API_BASE } from '@/lib/api';

const CUSTOMERS_KEY = 'customers';

export interface Customer {
  id: string;
  name: string | null;
  phone: string;
  ordersCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

async function fetchCustomers(): Promise<Customer[]> {
  const response = await apiFetch('/customer');
  
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  
  const data = await response.json();
  return data.data || data;
}

export function useCustomers() {
  return useQuery({
    queryKey: [CUSTOMERS_KEY],
    queryFn: fetchCustomers,
    staleTime: 60 * 1000,
  });
}
