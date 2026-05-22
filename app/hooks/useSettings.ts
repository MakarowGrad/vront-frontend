import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

const SETTINGS_KEY = 'settings';

export interface Settings {
  id?: string;
  brandName: string;
  phone: string;
  address: string;
  workingHours: string;
  description: string;
  logo?: string | null;
  theme?: string;
  primaryColor?: string | null;
  backgroundImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

async function fetchSettings(): Promise<Settings> {
  const response = await apiFetch('/settings');
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function updateSettingsRequest(settings: Partial<Settings>): Promise<Settings> {
  const response = await apiFetch('/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update settings');
  }
  
  return response.json();
}

export function useSettings() {
  return useQuery({
    queryKey: [SETTINGS_KEY],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateSettingsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_KEY] });
    },
  });
}
